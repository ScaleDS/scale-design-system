# Scale Design System

Scale is a design system that helps individuals and organisations Scale.

It spans three connected products built on one shared foundation of tokens, components, and patterns:

- Lit Web components — open source. Framework-agnostic <sc-*> custom elements with built-in theming and design tokens, free to use and self-host.
- Figma library — paid. A fully variable-driven Figma system mapped 1:1 to the code, so designers and engineers work from the same source of truth.
- Framer system — paid. Production-ready Framer components and styles for shipping marketing sites and prototypes without leaving the canvas.

Find out more and grab a licence for the Figma and Framer versions here: [www.scaledesignsystem.com](https://scaledesignsystem.com/)

## Features

- 62 web components built with Lit + Shadow DOM
- W3C DTCG design tokens — colors, spacing, typography, borders, shadows
- Form-associated inputs that work in real `<form>` submissions
- Polymorphic `sc-button` that renders a real `<a>` when given an `href`
- Shared theme controller with light/dark and brand-token retheming
- MCP server + `components.json` / `tokens.json` / `patterns.json` for AI agents

Full component reference, examples, and guidelines live at
**[scaledesignsystem.com](https://scaledesignsystem.com)**.

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

Scale ships with machine-readable context so AI agents can query component APIs,
tokens, and patterns directly — no guessing, no web search.

| File | Purpose |
|---|---|
| `context/AGENTS.md` | Agent entry point — rules, categories, quick reference |
| `context/components.json` | Full component catalog — props, slots, events, examples |
| `context/tokens.json` | W3C DTCG design tokens |
| `context/patterns.json` | Composition patterns with ready-to-use templates |

An MCP server is bundled for IDE integration (Cursor, Claude Code, Claude Desktop):

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

## Theming

Visual properties come from CSS custom properties. Retheme by overriding the
brand scale (`sc-logo` and components follow it automatically):

```css
:root {
  --sc-color-brand-500: #ff3355;
  --sc-color-brand-400: #ff5a76;
  --sc-color-brand-600: #ce2945;
}
```

Light/dark is driven by `data-theme` on `<html>` and a shared `ThemeController`.
See the [theming docs](https://scaledesignsystem.com) for the FOUC-prevention
script and the full token reference.

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
[Scale Edit docs](https://scaledesignsystem.com) for queue options and the
agent workflow.

## Development

```bash
npm run build             # Compile TypeScript
npm run build:watch       # Watch mode
npm run generate:context  # Regenerate components.json from source
```

The package builds on install via `prepare` and ships compiled `dist/` (plus
`scss/`, `context/`, `assets/`), so `github:` installs resolve
`@scale-ds/scale-design-system/components/*` with no manual build step.

## License

MIT
