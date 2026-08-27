#!/usr/bin/env node
// Grades a model response for Scale Design System violations.
//
// Deterministic and structural on purpose. "Did this look like good code" is a
// judgement an LLM grader would render inconsistently across runs, and an eval
// whose scores move when nothing changed measures nothing. Every check here is
// a fact about the text: a hex literal is present or it isn't, a prop value is
// in the catalog's enum or it isn't.
//
// Used two ways: by `run.mjs` over generated responses, and by `grade.test.mjs`
// over fixtures, so the grader itself is verified before it is trusted to
// score anything.

import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const here = dirname(fileURLToPath(import.meta.url))
const catalog = JSON.parse(readFileSync(join(here, '..', 'context', 'components.json'), 'utf-8'))

const KNOWN_TAGS = new Set(catalog.components.map((c) => c.tag))
const PROPS = new Map(catalog.components.map((c) => [c.tag, c.props ?? {}]))

/** Native elements Scale has a component for. */
const REPLACEABLE = {
  button: 'sc-button',
  input: 'sc-input / sc-checkbox / sc-radio / sc-toggle / sc-slider',
  select: 'sc-menu-dropdown / sc-segmented-control',
  textarea: 'sc-text-area',
  table: 'sc-table-basic / sc-table-dynamic',
  dialog: 'sc-modal',
  progress: 'sc-progress-bar',
}

/**
 * Native elements that are legitimate inside Scale markup and must not be
 * counted against a response — they are structure, not controls.
 */
const STRUCTURAL = /^(div|span|p|a|ul|ol|li|h[1-6]|section|main|header|footer|nav|article|aside|img|svg|path|form|label|br|hr|small|strong|em|code|pre|table-of)$/

/** Fenced code blocks, which is where the gradeable material lives. */
export function codeBlocks(text) {
  return [...text.matchAll(/```[a-zA-Z]*\n([\s\S]*?)```/g)].map((m) => m[1])
}

/**
 * Strips comments before scanning, so a response that says "don't do
 * `background: #fff`" is not marked down for the thing it is warning against.
 */
function stripComments(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/(^|\s)\/\/[^\n]*/g, '$1')
}

export function grade(response) {
  const code = codeBlocks(response).map(stripComments).join('\n')
  const findings = []
  const add = (check, detail) => findings.push({ check, detail })

  if (!code.trim()) {
    return { findings: [{ check: 'no-code', detail: 'response contained no fenced code block' }], code: '', tags: [] }
  }

  // --- hardcoded colour -----------------------------------------------------
  // The highest-severity check: a literal that matches one theme silently
  // breaks the other, and nothing surfaces it at runtime.
  for (const m of code.matchAll(/#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?)\([^)]*\)/g)) {
    // A hex inside a url() or an id selector is not a colour.
    if (/^#[0-9a-fA-F]{3,8}$/.test(m[0])) add('hardcoded-color', m[0])
    else add('hardcoded-color', m[0].replace(/\s+/g, ''))
  }

  // --- hardcoded spacing / radius -------------------------------------------
  // 0, hairlines and 100%/auto are excluded: they are not design decisions.
  for (const m of code.matchAll(/\b(margin|padding|gap|border-radius|row-gap|column-gap)[a-z-]*\s*:\s*([^;{}\n]+)/gi)) {
    const value = m[2].trim()
    if (value.includes('var(--sc-')) continue
    if (/^(0|auto|100%|inherit|initial|unset|1px)$/.test(value)) continue
    if (/\b\d+(\.\d+)?(px|rem|em)\b/.test(value)) add('hardcoded-space', `${m[1]}: ${value}`)
  }

  // --- hardcoded motion -----------------------------------------------------
  for (const m of code.matchAll(/\b(transition|animation)[a-z-]*\s*:\s*([^;{}\n]+)/gi)) {
    const value = m[2].trim()
    if (value.includes('var(--sc-')) continue
    if (/\b\d+(\.\d+)?m?s\b/.test(value)) add('hardcoded-motion', `${m[1]}: ${value}`)
  }

  // --- hardcoded type -------------------------------------------------------
  for (const m of code.matchAll(/\bfont-(family|size|weight)\s*:\s*([^;{}\n]+)/gi)) {
    const value = m[2].trim()
    if (value.includes('var(--sc-')) continue
    add('hardcoded-type', `font-${m[1]}: ${value}`)
  }

  // --- raw controls ---------------------------------------------------------
  for (const m of code.matchAll(/<([a-z][a-z0-9-]*)\b/gi)) {
    const tag = m[1].toLowerCase()
    if (REPLACEABLE[tag]) add('raw-control', `<${tag}> — use ${REPLACEABLE[tag]}`)
  }

  // --- unknown sc-* tags ----------------------------------------------------
  // A hallucinated component is worse than a raw control: it renders as an
  // inert unknown element and looks like it worked.
  const tags = [...new Set([...code.matchAll(/<(sc-[a-z0-9-]+)/g)].map((m) => m[1]))]
  for (const tag of tags) {
    if (!KNOWN_TAGS.has(tag)) add('unknown-component', tag)
  }

  // --- invalid enum values --------------------------------------------------
  // Precise because the catalog carries every enum's real values. This is the
  // check that most needs a machine: `type="danger"` looks entirely plausible
  // and silently renders the default.
  for (const el of code.matchAll(/<(sc-[a-z0-9-]+)((?:\s+[a-z-]+(?:="[^"]*")?)*)\s*\/?>/g)) {
    const props = PROPS.get(el[1])
    if (!props) continue
    for (const attr of el[2].matchAll(/([a-z][a-z0-9-]*)="([^"]*)"/g)) {
      const def = Object.values(props).find((d) => d.attribute === attr[1])
      if (def?.values && !def.values.includes(attr[2])) {
        add('invalid-prop', `${el[1]} ${attr[1]}="${attr[2]}" (accepts: ${def.values.filter(Boolean).join(', ')})`)
      }
    }
  }

  // --- missing imports ------------------------------------------------------
  // Only when the response includes JS at all; a pure-markup answer is not
  // wrong for omitting them.
  if (/\bimport\s/.test(code)) {
    for (const tag of tags) {
      if (KNOWN_TAGS.has(tag) && !code.includes(`components/${tag}`)) {
        add('missing-import', tag)
      }
    }
  }

  return { findings, code, tags }
}

/** A response is clean when nothing structural is wrong with it. */
export const isClean = (result) => result.findings.length === 0

export function summarise(results) {
  const byCheck = {}
  let clean = 0
  for (const r of results) {
    if (isClean(r)) clean++
    for (const f of r.findings) byCheck[f.check] = (byCheck[f.check] ?? 0) + 1
  }
  return { total: results.length, clean, cleanRate: results.length ? clean / results.length : 0, byCheck }
}

export { STRUCTURAL }
