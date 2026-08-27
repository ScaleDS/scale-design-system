#!/usr/bin/env node
// Verifies the grader against fixtures before it is trusted to score a run.
//
// An eval is only as good as its grader, and a grader nobody checked is just a
// number generator. These cases pin both directions: known-bad responses must
// produce the specific finding they are built to trigger, and known-good ones
// must produce nothing at all. The false-positive cases matter most — a grader
// that flags correct code makes the guidance look useless.

import { grade, isClean } from './grade.mjs'

const cases = [
  // --- must be flagged ------------------------------------------------------
  {
    name: 'hex colour',
    expect: 'hardcoded-color',
    response: '```html\n<div style="background: #0055ff">x</div>\n```',
  },
  {
    name: 'rgb colour',
    expect: 'hardcoded-color',
    response: '```css\n.panel { color: rgb(12, 24, 48); }\n```',
  },
  {
    name: 'px padding',
    expect: 'hardcoded-space',
    response: '```css\n.card { padding: 16px; }\n```',
  },
  {
    name: 'ms transition',
    expect: 'hardcoded-motion',
    response: '```css\n.panel { transition: opacity 200ms ease; }\n```',
  },
  {
    name: 'font-size',
    expect: 'hardcoded-type',
    response: '```css\n.title { font-size: 18px; }\n```',
  },
  {
    name: 'raw button',
    expect: 'raw-control',
    response: '```html\n<button class="primary">Save</button>\n```',
  },
  {
    name: 'hallucinated component',
    expect: 'unknown-component',
    response: '```html\n<sc-dropdown-menu></sc-dropdown-menu>\n```',
  },
  {
    name: 'invalid enum value',
    expect: 'invalid-prop',
    response: '```html\n<sc-button type="danger">Delete</sc-button>\n```',
  },
  {
    name: 'plausible-but-wrong size',
    expect: 'invalid-prop',
    response: '```html\n<sc-button size="md">Save</sc-button>\n```',
  },
  {
    name: 'missing import',
    expect: 'missing-import',
    response: "```js\nimport '@scale-ds/scale-design-system/components/sc-input'\n```\n```html\n<sc-button type=\"primary\">Go</sc-button>\n```",
  },
  {
    name: 'no code at all',
    expect: 'no-code',
    response: 'You should use a button component for this.',
  },

  // --- must NOT be flagged --------------------------------------------------
  {
    name: 'correct button',
    clean: true,
    response: '```html\n<sc-button type="primary" size="l">Save</sc-button>\n```',
  },
  {
    name: 'tokens throughout',
    clean: true,
    response: '```css\n.card {\n  padding: var(--sc-space-m);\n  gap: var(--sc-space-s);\n  border-radius: var(--sc-border-radius-m);\n  transition: opacity var(--sc-motion-transition-fade-in-m);\n}\n```',
  },
  {
    name: 'zero and auto are not design decisions',
    clean: true,
    response: '```css\n.reset { margin: 0; padding: 0; }\n.fill { margin: auto; }\n```',
  },
  {
    name: 'structural elements are fine',
    clean: true,
    response: '```html\n<div class="row"><span>Label</span><sc-toggle></sc-toggle></div>\n```',
  },
  {
    name: 'empty string is a valid target value',
    clean: true,
    response: '```html\n<sc-button href="/x" target="_blank">Open</sc-button>\n```',
  },
  {
    name: 'a warning about bad code is not bad code',
    clean: true,
    response: '```css\n/* never write background: #0055ff here */\n.panel { background: var(--sc-color-surface-l1); }\n```',
  },
  {
    name: 'markup with no imports is not missing them',
    clean: true,
    response: '```html\n<sc-badge status="info">New</sc-badge>\n```',
  },
  {
    name: 'imports present for every tag used',
    clean: true,
    response: "```js\nimport '@scale-ds/scale-design-system/components/sc-button'\n```\n```html\n<sc-button type=\"primary\">Go</sc-button>\n```",
  },
]

let failed = 0
for (const c of cases) {
  const result = grade(c.response)
  const checks = result.findings.map((f) => f.check)

  if (c.clean) {
    if (isClean(result)) console.log(`✓ ${c.name}`)
    else {
      failed++
      console.error(`✗ ${c.name} — expected clean, got: ${result.findings.map((f) => `${f.check}(${f.detail})`).join(', ')}`)
    }
  } else if (checks.includes(c.expect)) {
    console.log(`✓ ${c.name} → ${c.expect}`)
  } else {
    failed++
    console.error(`✗ ${c.name} — expected ${c.expect}, got: ${checks.join(', ') || 'nothing'}`)
  }
}

console.log(`\n${cases.length - failed}/${cases.length} grader cases pass`)
if (failed) process.exit(1)
