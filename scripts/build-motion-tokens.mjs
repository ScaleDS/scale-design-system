#!/usr/bin/env node
/* Builds the `motion` group of context/tokens.json from the SCSS.
 *
 * Generated rather than hand-written because it is ~90 tokens, and because the
 * cubic-bezier control points have to be transcribed out of CSS function syntax
 * into DTCG's 4-number arrays — exactly the kind of copying that produces a token
 * that looks right and animates wrong.
 *
 *   node scripts/build-motion-tokens.mjs          # write context/tokens.json
 *   node scripts/build-motion-tokens.mjs --check   # exit 1 if it would change
 *
 * The `motion` group is spliced in textually rather than by re-serialising the
 * whole file: JSON.parse/stringify reorders integer-like keys, which would
 * silently reshuffle the colour ramps (`50` would jump ahead of `0-alpha-30`).
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

/* Both SCSS files quote example declarations in their comments — including a
   literal `--sc-motion-slide-distance: var(--sc-motion-distance-full);` — so
   comments must go before anything is matched. */
function stripComments(source) {
  return source.replace(/\/\*[\s\S]*?\*\//g, ' ')
}

function read(relativePath) {
  return stripComments(readFileSync(join(root, relativePath), 'utf8'))
}

function matchAll(source, pattern) {
  return [...source.matchAll(pattern)]
}

/* Trap notes. These are the places where a token's value is correct but its name
   or its type will mislead someone downstream, so the warning travels with the
   token into Figma and any future platform export rather than living only in a
   comment in a .scss file nobody downstream reads. */
const LINEAR_NOTE =
  'Sampled linear() curve. Neither DTCG nor Tokens Studio has a type for multi-point easing, ' +
  'so this ships as a string. It cannot round-trip to Figma as a named ease, and in After Effects ' +
  'or Lottie it is a multi-keyframe construction, not an ease.'

const SPRING_NOTE =
  'SPATIAL ONLY — springs overshoot past their target, which is meaningless for opacity and colour. ' +
  'Figma parameterises springs by mass/stiffness/damping and its preset values are unpublished, so ' +
  'there is no exact Figma equivalent; match by eye against Gentle/Quick/Bouncy.'

const DESCRIPTIONS = {
  'easing.in-out':
    'A tuned "standard" curve, a fast-out-slow-in: it reaches 0.776 at its midpoint, not 0.5. ' +
    'NOT the same as the CSS `ease-in-out` keyword (0.42, 0, 0.58, 1), which is symmetric, and not ' +
    'the same as Figma\'s "Ease In And Out", which matches the keyword. Use easing.in-out-sine or ' +
    'easing.in-out-quad when you need real symmetry.',
  'easing.emphasized':
    'A headline curve for hero moments. Defined as a two-segment path, not a cubic-bezier; ' +
    'sampled here so it can be used exactly. ' + LINEAR_NOTE,
  'distance.slide':
    'Default travel for the slide keyframes, overridden on the animating element — set it to ' +
    '{motion.distance.full} on a drawer. Not a design decision on its own; it is the knob the ' +
    'eight slide keyframes read so magnitude need not be baked into their names.',
}

export function buildMotionTokens() {
  const variables = read('scss/sc-motion-variables.scss')
  const transitions = read('scss/sc-motion-transitions.scss')

  const motion = {}

  /* ---- Durations ---- */
  motion.duration = Object.fromEntries(
    matchAll(variables, /--sc-motion-duration-(\d+):\s*(\d+ms);/g).map((m) => [
      m[1],
      { $value: m[2], $type: 'duration' },
    ]),
  )

  /* ---- Easings ----
     cubic-bezier() becomes DTCG's 4-number array, which is what a Figma or
     platform export actually needs. linear() has no type anywhere, so it ships as
     a string carrying a note about what it can't do. */
  motion.easing = {}
  for (const match of matchAll(variables, /--sc-motion-ease-([a-z0-9-]+):\s*(cubic-bezier\([^)]*\)|linear\([^)]*\));/g)) {
    const [, name, value] = match
    const key = name

    if (value.startsWith('cubic-bezier')) {
      const points = value
        .slice('cubic-bezier('.length, -1)
        .split(',')
        .map((n) => Number(n.trim()))

      if (points.length !== 4 || points.some(Number.isNaN)) {
        throw new Error(`Could not parse cubic-bezier for --sc-motion-ease-${name}: ${value}`)
      }

      motion.easing[key] = { $value: points, $type: 'cubicBezier' }
    } else {
      motion.easing[key] = { $value: value, $type: 'string' }
      motion.easing[key].$description = key.startsWith('spring') ? `${SPRING_NOTE} ${LINEAR_NOTE}` : LINEAR_NOTE
    }

    if (DESCRIPTIONS[`easing.${key}`]) {
      motion.easing[key].$description = DESCRIPTIONS[`easing.${key}`]
    }
  }

  /* ---- Composite transitions ---- */
  motion.transition = Object.fromEntries(
    matchAll(
      transitions,
      /--sc-motion-transition-([a-z0-9-]+):\s*var\(--sc-motion-duration-(\d+)\)\s*var\(--sc-motion-ease-([a-z0-9-]+)\);/g,
    ).map((m) => [
      m[1],
      {
        $value: {
          duration: `{motion.duration.${m[2]}}`,
          delay: '0ms',
          timingFunction: `{motion.easing.${m[3]}}`,
        },
        $type: 'transition',
      },
    ]),
  )

  /* ---- Loops ----
     `animation` shorthands, not transitions: they carry an iteration count, which
     DTCG's `transition` type has no slot for. No standard type fits, so `other`. */
  motion.loop = Object.fromEntries(
    matchAll(
      transitions,
      /--sc-motion-animation-([a-z0-9-]+):\s*var\(--sc-motion-duration-(\d+)\)\s*var\(--sc-motion-ease-([a-z0-9-]+)\)\s*(infinite);/g,
    ).map((m) => [
      m[1],
      {
        $value: {
          duration: `{motion.duration.${m[2]}}`,
          timingFunction: `{motion.easing.${m[3]}}`,
          iterations: m[4],
        },
        $type: 'other',
        $description:
          'Looping animation shorthand. No DTCG or Tokens Studio type covers an iteration count, ' +
          'so this is `other`. Pair with the `sc-motion-<name>` keyframe.',
      },
    ]),
  )

  /* ---- Distances and scales ---- */
  motion.distance = Object.fromEntries(
    matchAll(transitions, /--sc-motion-distance-([a-z-]+):\s*([^;]+);/g).map((m) => [
      m[1],
      { $value: m[2].trim(), $type: 'dimension' },
    ]),
  )

  const slideDefault = transitions.match(/--sc-motion-slide-distance:\s*var\(--sc-motion-distance-([a-z-]+)\);/)
  if (slideDefault) {
    motion.distance.slide = {
      $value: `{motion.distance.${slideDefault[1]}}`,
      $type: 'dimension',
      $description: DESCRIPTIONS['distance.slide'],
    }
  }

  motion.scale = Object.fromEntries(
    matchAll(transitions, /--sc-motion-scale-([a-z-]+):\s*([^;]+);/g).map((m) => [
      m[1],
      { $value: Number(m[2].trim()), $type: 'number' },
    ]),
  )

  return motion
}

/* Splice the group in as the last top-level key, leaving every other byte of the
   file untouched. */
function render(tokensJson, motion) {
  const body = JSON.stringify({ motion }, null, 2)
    .replace(/^\{\n/, '')
    .replace(/\n\}$/, '')

  const withoutMotion = tokensJson.replace(/,\n {2}"motion": \{[\s\S]*?\n {2}\}(?=\n\})/, '')
  return withoutMotion.replace(/\n\}\n?$/, `,\n${body}\n}\n`)
}

const tokensPath = join(root, 'context/tokens.json')
const current = readFileSync(tokensPath, 'utf8')
const next = render(current, buildMotionTokens())

if (process.argv.includes('--check')) {
  if (current !== next) {
    console.error(
      'context/tokens.json is out of date with the motion SCSS.\n' +
        'Run: npm run build:motion-tokens',
    )
    process.exit(1)
  }
  console.log('motion tokens: context/tokens.json matches the SCSS')
} else if (process.argv[1] && process.argv[1].endsWith('build-motion-tokens.mjs')) {
  const motion = buildMotionTokens()
  writeFileSync(tokensPath, next)
  const count = Object.values(motion).reduce((sum, group) => sum + Object.keys(group).length, 0)
  console.log(
    `motion tokens: wrote ${count} tokens to context/tokens.json ` +
      `(${Object.entries(motion).map(([k, v]) => `${k} ${Object.keys(v).length}`).join(', ')})`,
  )
}
