#!/usr/bin/env node
// Runs the prompt set against a model twice — once with the Scale guidance and
// once without — and grades both with the same structural grader.
//
// The delta is the whole output. "Agents write better Scale code with the
// guidance" is an assertion until two numbers sit next to each other, and it is
// entirely possible the honest answer is that it barely helps; the run is set
// up so that result would be visible rather than absorbed.
//
// Costs real tokens. Nothing here runs on its own — see `npm run eval`.
//
//   node eval/run.mjs                      both conditions, all prompts
//   node eval/run.mjs --only pricing-page  one prompt, for iterating
//   node eval/run.mjs --condition guided   one condition
//   node eval/run.mjs --model claude-sonnet-5

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { grade, summarise, isClean } from './grade.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`)
  return i === -1 ? fallback : process.argv[i + 1]
}

const MODEL = arg('model', null)
const ONLY = arg('only', null)
const ALL_CONDITIONS = ['baseline', 'guided', 'guided-lookup']
const CONDITIONS = arg('condition', null) ? [arg('condition', null)] : ALL_CONDITIONS

const { prompts } = JSON.parse(readFileSync(join(here, 'prompts.json'), 'utf-8'))
const selected = ONLY ? prompts.filter((p) => p.id === ONLY) : prompts

/**
 * Both conditions are told Scale exists. Without that the baseline would answer
 * in React or plain HTML and the comparison would measure whether the model can
 * read minds, not whether the guidance helps.
 */
const SHARED = `You are working in a web project that uses the Scale Design System
(@scale-ds/scale-design-system), a library of Lit web components.
Answer with the code you would write. Use fenced code blocks.`

/**
 * The guided condition gets the rules and the catalog — what an agent running
 * the scale-build skill would have in front of it.
 *
 * Deliberately NOT the guidance file for the component the prompt is about.
 * Handing over the answer would measure transcription, and the resulting number
 * would be worthless for deciding whether any of this was worth building.
 */
function guidedSystem() {
  const skill = readFileSync(join(root, 'skills', 'scale-build', 'SKILL.md'), 'utf-8')
    .replace(/^---[\s\S]*?---\n/, '')

  const catalog = JSON.parse(readFileSync(join(root, 'context', 'components.json'), 'utf-8'))
  const index = catalog.components
    .map((c) => `${c.tag} (${c.category}) — ${c.description}`)
    .join('\n')

  const foundations = readdirSync(join(root, 'context', 'agents'))
    .filter((f) => !f.startsWith('sc-'))
    .map((f) => f.replace(/\.md$/, ''))

  return `${SHARED}

${skill}

## Component catalog

${index}

## Foundations with guidance files

${foundations.join(', ')}`
}

/**
 * Two transports, because they bill differently.
 *
 * `api` goes through the Anthropic SDK and needs API credits. `cli` shells out
 * to `claude -p`, which runs on a Claude Pro/Max subscription — a different
 * product with separate billing, and the only route available to someone who
 * has a subscription but no API key.
 *
 * They do not measure quite the same thing. The CLI carries Claude Code's own
 * system prompt and harness, so a CLI run measures "a coding agent with and
 * without the guidance" rather than "the raw model". For this eval that is
 * arguably the more relevant question — the guidance exists for coding agents —
 * but the two numbers are not interchangeable, so the transport is recorded in
 * the results file.
 */
const VIA = arg('via', null) ?? (process.env.ANTHROPIC_API_KEY ? 'api' : 'cli')

// The CLI takes short aliases, the SDK takes full ids. Defaulting per transport
// avoids passing `claude-opus-5` to a flag that wants `opus`.
const MODEL_RESOLVED = MODEL ?? (VIA === 'cli' ? 'opus' : 'claude-opus-5')

let ask

if (VIA === 'api') {
  // Imported lazily and left out of package.json on purpose. The eval is opt-in
  // and never runs in CI, so making every `npm ci` install an API client the
  // shipped library has no use for would be a poor trade.
  let Anthropic
  try {
    ({ default: Anthropic } = await import('@anthropic-ai/sdk'))
  } catch {
    console.error('The eval needs the Anthropic SDK, which is not a dependency of this package:\n')
    console.error('  npm install --no-save @anthropic-ai/sdk\n')
    process.exit(1)
  }

  // Zero-arg: resolves ANTHROPIC_API_KEY, ANTHROPIC_AUTH_TOKEN, or an
  // `ant auth login` profile, in that order.
  const client = new Anthropic()

  ask = async (system, prompt) => {
    const response = await client.messages.create({
      model: MODEL_RESOLVED, max_tokens: 16000, system,
      messages: [{ role: 'user', content: prompt }],
    })
    return {
      text: response.content.filter((b) => b.type === 'text').map((b) => b.text).join('\n'),
      usage: response.usage,
    }
  }
} else {
  const { spawn } = await import('child_process')
  const { mkdtempSync } = await import('fs')
  const { tmpdir } = await import('os')

  /**
   * spawn rather than execFile so stdin can be closed outright. Left open,
   * `claude -p` waits on it, warns "no stdin data received in 3s", and the run
   * becomes flaky — it cost 7 of 30 lookup prompts on the first three-way run.
   * This also keeps stderr and the exit code, which the previous error path
   * threw away, leaving failures unattributable.
   */
  const run = (args, opts) => new Promise((resolve, reject) => {
    const child = spawn('claude', args, { ...opts, stdio: ['ignore', 'pipe', 'pipe'] })
    let stdout = '', stderr = ''
    child.stdout.on('data', (d) => { stdout += d })
    child.stderr.on('data', (d) => { stderr += d })
    const timer = setTimeout(() => { child.kill('SIGKILL'); reject(new Error(`timed out after ${opts.timeout / 1000}s`)) }, opts.timeout)
    child.on('error', (e) => { clearTimeout(timer); reject(e) })
    child.on('close', (code) => {
      clearTimeout(timer)
      if (code === 0) resolve({ stdout })
      else reject(new Error(`claude exited ${code}: ${stderr.trim().slice(0, 300) || '(no stderr)'}`))
    })
  })

  // Run from an empty scratch directory with every tool denied. Both are
  // required for the comparison to mean anything: from inside a Scale checkout
  // the baseline could read context/agents/ and CLAUDE.md, which is precisely
  // the guidance the baseline is defined as not having.
  //
  // `--strict-mcp-config` with no `--mcp-config` is the load-bearing one, and
  // it was learned the hard way. Without it the session inherits whatever MCP
  // servers the machine has configured — including Scale's own. On the first
  // run the guided condition dutifully tried to call `get-component`, hit a
  // permission prompt nobody was there to answer, and spent 8 of 30 prompts
  // asking for access instead of writing code. That is a broken harness, not a
  // result, and it also meant one condition had reach the other did not.
  const sandbox = mkdtempSync(join(tmpdir(), 'scale-eval-'))
  const DENY = 'Read Write Edit Bash Glob Grep WebFetch WebSearch Task NotebookEdit TodoWrite'

  // The lookup condition gets the Scale MCP server and nothing else. It points
  // at this checkout's own server rather than the published package, because
  // the npm release predates the agent files — `npx @scale-ds/...` would start
  // a server with no context/agents/ to serve and the condition would silently
  // degrade into the plain guided one.
  const mcpConfig = join(sandbox, 'mcp.json')
  writeFileSync(mcpConfig, JSON.stringify({
    mcpServers: { scale: { command: 'node', args: [join(root, 'mcp', 'dist', 'index.js')] } },
  }))
  const SCALE_TOOLS = [
    'mcp__scale__get-component-guidance', 'mcp__scale__get-component',
    'mcp__scale__list-components', 'mcp__scale__search-components',
    'mcp__scale__get-tokens', 'mcp__scale__get-patterns',
    'mcp__scale__get-component-example', 'mcp__scale__get-dependencies',
  ].join(' ')

  ask = async (system, prompt, condition) => {
    const lookup = condition === 'guided-lookup'
    const { stdout } = await run([
      '-p', prompt,
      '--system-prompt', system,
      '--model', MODEL_RESOLVED,
      '--disallowedTools', DENY,
      ...(lookup
        // Pre-approved, because there is nobody at the terminal to answer a
        // permission prompt — an unanswered one costs the whole prompt.
        ? ['--mcp-config', mcpConfig, '--strict-mcp-config', '--allowedTools', SCALE_TOOLS]
        : ['--strict-mcp-config']),
      '--no-session-persistence',
    ], { cwd: sandbox, timeout: 600_000 })
    return { text: stdout, usage: null }
  }
}

// guided-lookup shares the guided system prompt. The only difference between
// them is whether the agent can act on the skill's instruction to read a
// component's guidance before using it — which is the step the skill is built
// around, and the one the plain guided condition cannot take.
const guided = guidedSystem()
const systems = { baseline: SHARED, guided, 'guided-lookup': guided }
const results = {}

console.log(`model: ${MODEL_RESOLVED}  via: ${VIA}`)
console.log(`prompts: ${selected.length}  conditions: ${CONDITIONS.join(', ')}\n`)

for (const condition of CONDITIONS) {
  results[condition] = []
  for (const p of selected) {
    process.stdout.write(`  ${condition.padEnd(9)} ${p.id.padEnd(22)}`)
    try {
      const { text, usage } = await ask(systems[condition], p.prompt, condition)
      const graded = grade(text)
      results[condition].push({ id: p.id, area: p.area, ...graded, response: text, usage })
      console.log(isClean(graded) ? 'clean' : `${graded.findings.length} finding(s)`)
    } catch (err) {
      // A failed request is not a clean response — recording it as one would
      // quietly improve whichever condition happened to error.
      console.log(`ERROR ${err.message}`)
      results[condition].push({ id: p.id, area: p.area, error: String(err), findings: [{ check: 'request-failed', detail: String(err) }] })
    }
  }
  console.log()
}

/* ------------------------------------------------------------------ report -- */

const outDir = join(here, 'results')
mkdirSync(outDir, { recursive: true })
const stamp = new Date().toISOString().replace(/[:.]/g, '-')
const outFile = join(outDir, `${stamp}.json`)
writeFileSync(outFile, JSON.stringify({ model: MODEL_RESOLVED, via: VIA, at: stamp, results }, null, 2))

console.log('─'.repeat(58))
const summaries = {}
for (const condition of CONDITIONS) {
  const s = summarise(results[condition])
  summaries[condition] = s
  console.log(`${condition.padEnd(10)} clean ${s.clean}/${s.total} (${(s.cleanRate * 100).toFixed(0)}%)`)
  for (const [check, n] of Object.entries(s.byCheck).sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(n).padStart(3)}  ${check}`)
  }
}

// A request that never reached the model is not evidence about the model. A run
// with failures in it can still be read, but the failures have to be visible
// next to the numbers, and a run where nothing succeeded must not print a delta
// at all — "+0 percentage points" off zero responses is the exact
// number-generator failure this eval exists to avoid.
const failed = Object.fromEntries(
  CONDITIONS.map((c) => [c, results[c].filter((r) => r.error).length]),
)
const totalFailed = Object.values(failed).reduce((a, b) => a + b, 0)
const totalRuns = CONDITIONS.reduce((n, c) => n + results[c].length, 0)

if (totalFailed) {
  console.log('─'.repeat(58))
  console.error(`⚠ ${totalFailed}/${totalRuns} requests failed: ${CONDITIONS.map((c) => `${c} ${failed[c]}`).join(', ')}`)
  console.error('  Failed requests are counted as not-clean, so any delta below is understated.')
}

if (totalFailed === totalRuns) {
  console.error('\n✖ every request failed — no result. Check credentials (ANTHROPIC_API_KEY, or `ant auth login`).')
  process.exit(1)
}

const totalFindings = (c) => Object.values(summaries[c].byCheck).reduce((a, b) => a + b, 0)

if (CONDITIONS.includes('baseline') && CONDITIONS.length > 1) {
  console.log('─'.repeat(58))
  for (const c of CONDITIONS.filter((x) => x !== 'baseline')) {
    const delta = summaries[c].cleanRate - summaries.baseline.cleanRate
    const swing = Math.abs(delta * summaries.baseline.total)
    // 30 prompts resolves a large effect and not a small one. Saying so costs
    // one line and stops a two-prompt swing being reported as a win.
    const note = swing <= 2 ? '  (within ~2 prompts — too close to call)' : ''
    console.log(`${c.padEnd(14)} ${delta >= 0 ? '+' : ''}${(delta * 100).toFixed(0)} pp clean vs baseline, ` +
      `findings ${totalFindings('baseline')} → ${totalFindings(c)}${note}`)
  }

  // Components actually used, per condition. Without it the check counts read
  // as though they were comparable, and they are not: a condition that never
  // writes an sc-* tag scores zero invalid-prop for the worst possible reason.
  console.log('─'.repeat(58))
  for (const c of CONDITIONS) {
    const used = results[c].filter((r) => r.tags?.length).length
    console.log(`${c.padEnd(14)} used sc-* components in ${used}/${results[c].length} responses`)
  }
}

console.log(`\nwritten to ${outFile.replace(root, '.')}`)
if (!existsSync(outFile)) process.exit(1)
