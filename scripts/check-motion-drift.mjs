#!/usr/bin/env node
/* Motion drift check.
 *
 * @keyframes don't cross a shadow boundary, so the motion keyframes exist twice:
 * once in scss/sc-motion-transitions.scss for light-DOM consumers, and once in
 * components/sc-motion.ts for the sc-* elements. Same for the token names, which
 * the SCSS enforces with @error and the TS with union types. Two copies drift.
 *
 * This compares them and exits non-zero on any difference. The SCSS is treated as
 * the source of truth in the error messages, because that is where the values are
 * authored and reviewed.
 *
 *   node scripts/check-motion-drift.mjs
 */
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const SCSS = 'scss/sc-motion-transitions.scss'
const TS = 'components/sc-motion.ts'

/* Comments are where the two files legitimately differ — the TS explains shadow
 * DOM, the SCSS explains cascade — and both quote CSS in prose. Strip before
 * parsing so a code sample in a docstring can't register as a real rule. */
function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^[ \t]*\/\/.*$/gm, ' ')
}

/* Whitespace and the last semicolon in a block are free variation between a
 * .scss file and a css`` template; everything else is signal. */
function normalize(css) {
  return css
    .replace(/\s+/g, ' ')
    .replace(/\s*([{}:;,])\s*/g, '$1')
    .replace(/;}/g, '}')
    .trim()
}

/* Brace-matched so a nested block (the reduced-motion @keyframes lives inside an
 * @media) can't truncate the scan at the wrong closing brace. */
function extractKeyframes(source) {
  const found = new Map()
  const pattern = /@keyframes\s+([\w-]+)\s*\{/g
  let match

  while ((match = pattern.exec(source)) !== null) {
    const name = match[1]
    let depth = 1
    let i = pattern.lastIndex

    while (i < source.length && depth > 0) {
      if (source[i] === '{') depth += 1
      else if (source[i] === '}') depth -= 1
      i += 1
    }

    if (depth !== 0) {
      throw new Error(`Unbalanced braces in @keyframes ${name}`)
    }

    const body = normalize(source.slice(pattern.lastIndex, i - 1))
    if (!found.has(name)) found.set(name, [])
    found.get(name).push(body)
    pattern.lastIndex = i
  }

  return found
}

function extractCustomProperties(source, prefix) {
  const pattern = new RegExp(`--sc-motion-${prefix}-([a-z0-9-]+)\\s*:`, 'g')
  return new Set([...source.matchAll(pattern)].map((m) => m[1]))
}

/* The union members, read straight out of the type alias. */
function extractUnion(source, typeName) {
  const start = source.indexOf(`export type ${typeName} =`)
  if (start === -1) throw new Error(`${TS}: could not find \`export type ${typeName}\``)

  const rest = source.slice(start)
  const end = rest.indexOf('\nexport ', 1)
  const block = end === -1 ? rest : rest.slice(0, end)
  return new Set([...block.matchAll(/'([a-z0-9-]+)'/g)].map((m) => m[1]))
}

function diff(label, expected, actual, expectedFrom, actualFrom) {
  const problems = []
  for (const name of expected) {
    if (!actual.has(name)) problems.push(`  ${label} \`${name}\` is in ${expectedFrom} but missing from ${actualFrom}`)
  }
  for (const name of actual) {
    if (!expected.has(name)) problems.push(`  ${label} \`${name}\` is in ${actualFrom} but missing from ${expectedFrom}`)
  }
  return problems
}

const scss = stripComments(readFileSync(join(root, SCSS), 'utf8'))
const tsRaw = readFileSync(join(root, TS), 'utf8')
const ts = stripComments(tsRaw)

const problems = []

/* 1. Keyframes — names and bodies. */
const scssFrames = extractKeyframes(scss)
const tsFrames = extractKeyframes(ts)

problems.push(...diff('@keyframes', new Set(scssFrames.keys()), new Set(tsFrames.keys()), SCSS, TS))

for (const [name, scssBodies] of scssFrames) {
  const tsBodies = tsFrames.get(name)
  if (!tsBodies) continue

  if (scssBodies.length !== tsBodies.length) {
    problems.push(
      `  @keyframes \`${name}\` is declared ${scssBodies.length}x in ${SCSS} but ${tsBodies.length}x in ${TS}` +
        ` (a reduced-motion override counts as a second declaration)`,
    )
    continue
  }

  const sorted = (list) => [...list].sort()
  const a = sorted(scssBodies)
  const b = sorted(tsBodies)

  for (let i = 0; i < a.length; i += 1) {
    if (a[i] !== b[i]) {
      problems.push(
        `  @keyframes \`${name}\` body differs:\n` + `    ${SCSS}: ${a[i]}\n` + `    ${TS}: ${b[i]}`,
      )
    }
  }
}

/* 2. Token names vs union types. */
problems.push(
  ...diff(
    'transition token',
    extractCustomProperties(scss, 'transition'),
    extractUnion(ts, 'MotionTransition'),
    SCSS,
    `${TS} (MotionTransition)`,
  ),
)

problems.push(
  ...diff(
    'animation token',
    extractCustomProperties(scss, 'animation'),
    extractUnion(ts, 'MotionAnimation'),
    SCSS,
    `${TS} (MotionAnimation)`,
  ),
)

/* 3. The springs list, which drives the spatial-only overload. */
const springs = extractUnion(ts, 'SpringTransition')
for (const name of springs) {
  if (!extractUnion(ts, 'MotionTransition').has(name)) {
    problems.push(`  spring \`${name}\` is in SpringTransition but not MotionTransition`)
  }
}

if (problems.length > 0) {
  console.error(`\nMotion drift between ${SCSS} and ${TS}:\n`)
  console.error(problems.join('\n'))
  console.error(`\n${problems.length} problem(s). The SCSS is the source of truth for values.\n`)
  process.exit(1)
}

console.log(
  `motion: ${scssFrames.size} keyframes and ` +
    `${extractUnion(ts, 'MotionTransition').size + extractUnion(ts, 'MotionAnimation').size} token names ` +
    `match between ${SCSS} and ${TS}`,
)
