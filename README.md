# Scale Design System

Scale is a design system that helps individuals and organisations Scale.

It spans three connected products built on one shared foundation of tokens, components, and patterns:

- Lit Web components — open source. Framework-agnostic <sc-*> custom elements with built-in theming and design tokens, free to use and self-host.
- Figma library — paid. A fully variable-driven Figma system mapped 1:1 to the code, so designers and engineers work from the same source of truth.
- Framer system — paid. Production-ready Framer components and styles for shipping marketing sites and prototypes without leaving the canvas.

Find out more and grab a licence for the Figma and Framer versions here: [www.scaledesignsystem.com](https://scaledesignsystem.com/)

## Features

- 62 web components built with Lit + Shadow DOM
- W3C DTCG design tokens — colors, spacing, typography, borders, shadows, motion
- A motion system of durations, easings, composite transitions and keyframes, wired
  into every component that moves and zeroed under `prefers-reduced-motion`
- Form-associated inputs that work in real `<form>` submissions
- Polymorphic `sc-button` that renders a real `<a>` when given an `href`
- Shared theme controller with light/dark and brand-token retheming
- Per-component guidance for coding agents, generated from the same pages humans
  read, plus an MCP server and a Claude Code plugin — see [AI agent integration](#ai-agent-integration)

## Installation

```bash
npm install @scale-ds/scale-design-system
```

## Quick Start

Scaffold a pre-wired Vite + TypeScript app (theming, tokens, and a sample page):

```bash
npx degit ScaleDS/scale-design-system/examples/starter my-app
cd my-app && npm install && npm run dev
```

Or import a component straight into any page — each file registers its custom
element on import:

```html
<script type="module">
  import '@scale-ds/scale-design-system/components/sc-button.js'
</script>

<sc-button type="primary" href="/docs">Get Started</sc-button>
```

## AI agent integration

Scale ships machine-readable context so agents can look up component APIs,
tokens and patterns directly — no guessing, no web search.

| File | Purpose |
|---|---|
| `context/AGENTS.md` | Agent entry point — rules, categories, quick reference |
| `context/agents/*.md` | **One guidance file per component and foundation** — 70 of them, ~790 tokens each |
| `context/components.json` | Full component catalog — props with their accepted values, slots, events, CSS API |
| `context/tokens.json` | W3C DTCG design tokens |
| `context/patterns.json` | Composition patterns with ready-to-use templates |
| `guidance/` | The authored HTML fragments the guidance files and the docs site are both generated from |

### The per-component files

`context/agents/sc-button.md` carries the contract in frontmatter — every prop
with its real enum values, slots, events, CSS parts and custom properties — and
the judgment in the body: when to use it, when not to, do and don't, worked
examples, the accessibility contract.

Nothing in them is hand-written. They are generated from `guidance/`, the same
source that renders the human documentation, so an agent file cannot drift from
the page a person reads — it *is* that page. CI fails on a stale one.

Three ways to reach the same file, so this is not tied to one vendor's protocol:

1. **MCP** — `get-component-guidance` (below)
2. **Installed package** — `node_modules/@scale-ds/scale-design-system/context/agents/sc-button.md`
3. **Web** — `https://scaledesignsystem.com/components/button/agent.md`, indexed at [`/llms.txt`](https://scaledesignsystem.com/llms.txt)

An editor with no MCP support still gets the full guidance.

### MCP server

Bundled for Cursor, Claude Code and Claude Desktop:

```json
{
  "mcpServers": {
    "scale": {
      "command": "npx",
      "args": ["@scale-ds/scale-design-system"]
    }
  }
}
```

Tools: `get-component-guidance` (**start here when writing code** — one
component's full guidance, ~1k tokens instead of the ~26k the whole catalog
costs), `list-components`, `get-component`, `search-components`, `get-tokens`,
`get-patterns`, `get-component-example`, `get-dependencies`. Full table in
[`mcp/README.md`](mcp/README.md).

### Claude Code plugin

The skills matter more than the server. An MCP tool is inert until something
decides to call it, and an agent with the server installed will still write
`<button style="background:#0055ff">` unless something tells it not to.

Installing the plugin from this repo wires up both at once:

| Skill | For |
|---|---|
| `scale-build` | Building UI — check the catalog, read the guidance, compose, style with tokens, verify |
| `scale-review` | Auditing existing code for hardcoded values, raw controls, invalid props, missing a11y |
| `scale-migrate` | Converting from Tailwind, plain HTML, or another library |

### Does it work?

Measured, not assumed. 30 realistic prompts, graded structurally for hardcoded
values, raw HTML where an `sc-*` exists, hallucinated tags and invalid prop
values ([`eval/`](eval/README.md)):

| | clean output | findings |
|---|---|---|
| No guidance | 11/30 (37%) | 161 |
| Rules + catalog | 17/30 (57%) | 26 |
| **Rules + catalog + lookup** | **28/30 (93%)** | **3** |

Being able to look a component up is where the value is. Invalid prop values —
`size="large"`, `type="ghost"` — go from 15 to zero once the agent can read the
enum values rather than guess them.

Caveats kept with the number: run-to-run variance is wide at this sample size,
so read it as a large effect with an imprecise magnitude, and it was measured
through a coding agent rather than a raw API call.

## Theming

Visual properties come from CSS custom properties. The semantic brand
variables resolve to a primitive brand scale (`--sc-color-brand-100`–`900`) —
in the light theme:

```css
:root {
  --sc-color-background-brand: var(--sc-color-brand-500);
  --sc-color-background-brand-hover: var(--sc-color-brand-600);
  --sc-color-background-brand-pressed: var(--sc-color-brand-700);
  --sc-color-text-brand: var(--sc-color-brand-500);
  --sc-color-border-brand: var(--sc-color-brand-500);
}
```

Retheme by overriding the `--sc-color-brand-*` primitives — `sc-logo` and every
component follow automatically. The dark theme picks different steps from the
same scale (e.g. `--sc-color-background-brand: var(--sc-color-brand-400)`), so
both themes retheme at once and honour `prefers-color-scheme`.

Light/dark is driven by `data-theme` on `<html>` and a shared `ThemeController`.
See the [Color foundation](https://scaledesignsystem.com/foundations/color/) for
the full token reference.

## Motion

Motion ships as four tiers, each built from the one below. Durations and easings are
the primitives; composite transitions pair them into named recipes like
`--sc-motion-transition-enter-l`; keyframes supply the movement itself; and a set of
Sass mixins handles motion across more than one element.

```css
.panel {
  transition: opacity var(--sc-motion-transition-fade-in-m);
}

.sheet {
  animation: sc-motion-slide-in-from-bottom var(--sc-motion-transition-enter-l);
}
```

Every duration is zeroed under `prefers-reduced-motion`, except the two ambient loop
tokens — a spinner that stops spinning reads as a hang, not as calm.

The first three tiers are in the main stylesheet. The choreography mixins are not, so
import them where you need them:

```scss
@use '@scale-ds/scale-design-system/scss/sc-motion-choreography' as choreography;

.view--leaving { @include choreography.push(outgoing); }
.view--arriving { @include choreography.push(incoming); }
```

`@keyframes` don't cross a shadow boundary, so `sc-motion.ts` mirrors them for the
`sc-*` elements. `npm run check:motion` fails the build if the two copies drift. See
the [Motion foundation](https://scaledesignsystem.com/foundations/motion/) for the
full token reference.

## Scale Edit

A dev-only, in-page editing overlay. Pin comments and make **token-aware** visual
tweaks (colour roles, spacing, radius, typography) directly on a running page —
the controls only offer valid tokens, so edits stay on-system. Each change is
captured to a small queue that a coding agent reads and applies to your real source.

Add the Vite plugin (a no-op in `vite build`):

```ts
// vite.config.ts
import { scaleEdit } from '@scale-ds/scale-design-system/vite'

export default defineConfig({
  plugins: [scaleEdit()],
})
```

The overlay is **off by default** — opt in per run with `SCALE_EDIT`:

```bash
SCALE_EDIT=1 npm run dev   # overlay on for this run
npm run dev                # no overlay
```

Non-Vite setups can mount it manually via `enableEdit()` from
`@scale-ds/scale-design-system/edit`. See the
[Scale Edit docs](https://scaledesignsystem.com/get-started/scale-edit/) for
queue options and the agent workflow.

## Development

```bash
npm run build             # Compile TypeScript (components + bundled MCP server)
npm run build:watch       # Watch mode
npm run generate:context  # Regenerate components.json from source
npm run generate:agents   # Regenerate context/agents/ from guidance/ + components.json
npm run check:motion      # Guard the SCSS/TS keyframe mirror and the motion tokens
npm run check:agents      # Fail if context/agents/ is stale or a fragment breaks the schema
npm run check:grader      # Eval grader self-test (deterministic, no API cost)
npm run eval              # Guided-vs-baseline eval. Costs tokens — see eval/README.md
```

`context/` is generated **and** committed, so the only thing keeping it honest is
that CI regenerates it and fails on a difference. After editing a component run
`generate:context`; after editing a fragment in `guidance/` run
`generate:agents`. Never hand-edit anything under `context/agents/` — the next
run overwrites it.

The package builds on install via `prepare` and ships compiled `dist/` (plus
`scss/`, `context/`, `guidance/`, `assets/`, `mcp/dist/`), so `github:` installs
resolve `@scale-ds/scale-design-system/components/*` with no manual build step.

## Contributing

Contributions to the open-source Lit components are welcome — bug fixes,
accessibility, performance, and tooling improvements can go straight to a PR.
The system's fundamentals (design tokens, component APIs, visual design) are
maintainer-led and start as issues, so the Figma and Framer versions stay in
lockstep with the code. See [CONTRIBUTING.md](CONTRIBUTING.md) for the full
guide, including the ground rules for forks.

## Contributors

Thanks to everyone who has contributed to Scale:

- [@JoPixelPoet](https://github.com/JoPixelPoet) — npm/ESM packaging and dev tooling, form-control accessibility, component catalog backfill, package export surface, and the Sass `@use` migration.

## License

MIT
