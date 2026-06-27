# Scale Design System

A Lit-based agentic design system with machine-readable context for AI and human developers.

- 62 web components built with Lit + Shadow DOM
- W3C DTCG design tokens (colors, spacing, typography, borders, shadows)
- Form-associated inputs that work in real `<form>` submissions
- Theme controller + reset/typography helpers shared across components
- MCP server + `components.json` / `tokens.json` / `patterns.json` for AI agents

## Installation

```bash
npm install github:ScaleDS/scale-design-system
```

## Quick Start

```html
<!DOCTYPE html>
<html data-theme="light">
<head>
  <script type="module">
    import '@scale-ds/scale-design-system/components/sc-button.js'
    import '@scale-ds/scale-design-system/components/sc-input.js'
  </script>
</head>
<body>
  <sc-button type="primary" size="l">Get Started</sc-button>
  <sc-input label="Email" name="email" type="email" required></sc-input>
</body>
</html>
```

## Components

62 components across UI, data, layout, and section categories. Each file under `components/` exports a custom element registered with `customElements.define()` on import.

### UI

`sc-accordion`, `sc-alert`, `sc-avatar`, `sc-avatar-group`, `sc-badge`, `sc-banner`, `sc-breadcrumbs`, `sc-button`, `sc-button-group`, `sc-button-icon`, `sc-button-pill`, `sc-card`, `sc-card-selector`, `sc-checkbox`, `sc-checkbox-item`, `sc-date-picker`, `sc-divider`, `sc-file-upload`, `sc-file-upload-item`, `sc-help-text`, `sc-input`, `sc-input-pin`, `sc-logo`, `sc-menu-dropdown`, `sc-menu-item`, `sc-modal`, `sc-page-controls`, `sc-progress-bar`, `sc-radio`, `sc-radio-item`, `sc-row`, `sc-segmented-control`, `sc-signup`, `sc-slider`, `sc-spinner`, `sc-status-icon`, `sc-status-indicator`, `sc-tab`, `sc-tab-panel`, `sc-tabs`, `sc-tag`, `sc-text-area`, `sc-toast`, `sc-toggle`, `sc-tooltip`

### Data table

`sc-table-basic` is a row-major data table — CSS subgrid keeps columns aligned across rows — with built-in column sorting, row selection, and pagination. Compose it from the primitives below, or drive it from data with `sc-table-dynamic`:

| Component | Role |
|---|---|
| `sc-table-dynamic` | Data-driven entry point — pass `.columns` + `.rows` and it generates the markup, delegating sort/select/paginate to `sc-table-basic`. Far less boilerplate than hand-composing rows. |
| `sc-table-basic` | Container (`role="table"`); owns sorting, selection, and `page-size` pagination |
| `sc-table-row` | Row (`role="row"`); `selected` + hover state |
| `sc-table-head` | Column header; `sortable` (cycles asc/desc/none with `aria-sort`), `selectable` (select-all), `align` |
| `sc-table-cell` | Body cell; slotted content, `secondary-text`, `selectable`, `href` (renders a real link), `align` |
| `sc-table-footer` | Pagination — Prev/Next `sc-button`s + `sc-page-controls` dots, emits `page-change` |

`sc-table-dynamic` columns are `{ key, label?, sortable?, selectable?, align?, width?, href?(row), secondaryText?(row), leadingIcon?(row), trailingIcon?(row) }`; rows are plain objects keyed by column `key` (values may be strings, numbers, or Lit templates for rich cells). Column tracks default to `minmax(0, 1fr)` — stable widths that don't reflow on sort — so set `width` per column (e.g. `auto`, `120px`) only when you need to override.

```ts
import '@scale-ds/scale-design-system/components/sc-table-dynamic'

const columns = [
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Role', sortable: true, align: 'trailing' },
]
const table = document.querySelector('sc-table-dynamic')
table.columns = columns
table.pageSize = 10
table.rows = users.map(u => ({ name: u.name, email: u.email, role: u.role }))
```

### Layout & sections

| Component | Description |
|---|---|
| `sc-header` | Fixed header with frosted-glass background, single-pill theme toggle, opt-in search overlay (`show-search` + `.searchItems`), and a responsive two-level mobile menu below 810px (`.navTree` + `active-section`/`active-href`); CTAs render as real `<a>` elements |
| `sc-hero` | Full-width hero with badge, CTAs, and theme-reactive image |
| `sc-footer` | Footer with logo, optional copyright, licence link |
| `sc-section-content` | Centred heading + subtext |
| `sc-section-feature` | Side-by-side content + image (`reverse` reorders the DOM, not just CSS) |
| `sc-section-bento` | 4-cell bento grid |
| `sc-section-pricing` | 3-column pricing card grid |
| `sc-section-faq` | FAQ accordion section |
| `sc-section-signup` | Email signup card |
| `sc-card-image` | Image card with `default` and `fill` variants |
| `sc-card-pricing` | Pricing tier card |

### Shared modules (non-element exports)

These live in `components/` but don't define custom elements — they're utilities consumed by the elements:

| Module | Purpose |
|---|---|
| `feather.ts` | `featherIcon(name, opts?)` helper returning a Lit `TemplateResult` |
| `theme-controller.ts` | `ThemeController` (Lit `ReactiveController`) — pub/sub theme state with optional `documentAttribute` / `storageKey` / `eventName` overrides |
| `button-variants.ts` | 10 shared type variants + disabled + loading state (positions the shared `<sc-spinner>` via `spinnerTypeForButton`) for `sc-button` and `sc-button-pill` |
| `reset.ts` | Local `* { box-sizing: border-box; margin: 0; padding: 0 }` reset for section-style components |
| `sc-focus-ring.ts` | `:focus-visible` outline shared across components |

`ThemeController` is exported from the package root for consumer reuse:

```ts
import { ThemeController } from '@scale-ds/scale-design-system'

class MyElement extends LitElement {
  private _theme = new ThemeController(this, { storageKey: 'my-app-theme' })
  render() {
    return html`<p>Theme: ${this._theme.theme}</p>`
  }
}
```

## Form association

`sc-input`, `sc-input-pin`, `sc-checkbox`, `sc-radio`, `sc-toggle`, `sc-segmented-control`, and `sc-file-upload` are form-associated custom elements. They participate in `FormData`, browser-native validation, `formdata` events, and form `reset`:

```html
<form>
  <sc-input name="email" type="email" required></sc-input>
  <sc-checkbox name="newsletter" value="yes">Subscribe</sc-checkbox>
  <sc-radio name="plan" value="free">Free</sc-radio>
  <sc-radio name="plan" value="pro" checked>Pro</sc-radio>
  <sc-toggle name="marketing" value="yes"></sc-toggle>
  <button type="submit">Submit</button>
</form>
```

Each control exposes `form`, `validity`, `validationMessage`, `willValidate`, `checkValidity()`, `reportValidity()`, plus the standard `formResetCallback` / `formDisabledCallback` lifecycle hooks.

## Polymorphic button

`sc-button` accepts `href`, `target`, and `rel` props. When `href` is set (and the button isn't disabled/loading), it renders an `<a>` instead of a `<button>` — middle-click, ⌘-click, and the browser context menu all work as expected. When `target='_blank'`, `rel='noopener noreferrer'` is applied by default (override via the `rel` prop).

```html
<sc-button type="primary" href="/docs">Read the docs</sc-button>
<sc-button type="secondary" href="https://example.com" target="_blank">External</sc-button>
```

## Design tokens

All visual properties come from CSS custom properties. Tokens are defined in `scss/sc-variables-*.scss` and aggregated by `scss/main.scss`. Use the brand scale to retheme:

```css
:root {
  --sc-color-brand-500: #ff3355;
  --sc-color-brand-400: #ff5a76;
  --sc-color-brand-600: #ce2945;
}
```

`sc-logo` references `--sc-color-brand-400/500/600` directly, so it follows brand changes automatically.

Import the full SCSS bundle:

```scss
@use '@scale-ds/scale-design-system/scss/main.scss';
```

Or pick individual modules:

```scss
@use '@scale-ds/scale-design-system/scss/sc-variables-color';
@use '@scale-ds/scale-design-system/scss/sc-mixins-type' as type;

.my-heading { @include type.sc-typography-heading-m; }
```

Typography is also available as Lit `css` template tags for use inside Shadow DOM:

```ts
import { textL, labelM, headingS } from '@scale-ds/scale-design-system/scss/typography'
```

## Theming

Theme state is managed via `ThemeController`. `sc-header` is the publisher (theme toggle calls `.set()`), and `sc-hero`, `sc-card-image`, `sc-section-feature` consume it. The controller reads `document.documentElement.dataset.theme` on connect, listens for a `theme-change` window event, and persists to `localStorage['sc-theme']` by default (all overridable).

The host page needs a small inline script before any CSS renders to prevent FOUC:

```html
<script>
  const saved = localStorage.getItem('sc-theme')
  const prefers = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  document.documentElement.dataset.theme = saved ?? prefers
</script>
```

## AI agent integration

Scale ships with machine-readable context for AI agents:

| File | Purpose |
|---|---|
| `context/AGENTS.md` | Agent entry point with rules, categories, and quick reference |
| `context/components.json` | Full component catalog — props, slots, events, examples |
| `context/tokens.json` | W3C DTCG design tokens |
| `context/patterns.json` | Composition patterns with ready-to-use templates |

### MCP server

An MCP server is bundled in the package for IDE integration (Cursor, Claude Code, Claude Desktop, etc.):

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

Once connected, AI agents can query Scale directly for component APIs, design tokens, and composition patterns — no guessing, no web search.

## Scale Edit (dev overlay)

Scale Edit is a **dev-only, in-page editing overlay**. It lets you pin comments and make
**token-aware** visual tweaks directly on a running Scale page, captures them to a small queue,
and hands them to a coding agent that applies the changes to your real source.

Two exports ship with the package:

| Export | What it is |
|---|---|
| `@scale-ds/scale-design-system/vite` | `scaleEdit()` — Vite plugin (recommended). Injects the overlay in dev, serves the edit-queue bridge, and stamps `data-sc-loc="file:line"` onto HTML so the agent can locate source. |
| `@scale-ds/scale-design-system/edit` | `enableEdit()` / `disableEdit()` — manual overlay mount for non-Vite dev setups. |

**Wire it up (Vite):**

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import { scaleEdit } from '@scale-ds/scale-design-system/vite'

export default defineConfig({
  plugins: [scaleEdit()], // dev-only — a no-op in `vite build`
})
```

`scaleEdit(options?)`:

| Option | Default | Purpose |
|---|---|---|
| `endpoint` | `/__scale/edits` | REST route for the edit queue (GET / POST / DELETE). |
| `store` | `<root>/.scale/edits.json` | Where the queue is persisted. **Gitignore it.** |
| `stampSource` | `true` | Stamp `data-sc-loc` onto static HTML for source location. |

**Manual mount (no Vite):**

```ts
import { enableEdit } from '@scale-ds/scale-design-system/edit'
enableEdit() // dev only — never call in production
```

**How it works:**

1. Select any element on the page to pin a **comment**, or make a **token-constrained edit** —
   colour roles (`--sc-color-*`), spacing, radius, and named `sc-typography-*` styles. The
   controls only offer valid tokens, so edits stay on-system.
2. Each item is written to the queue (`.scale/edits.json`) as a structured `EditItem` with an
   anchor (`data-sc-loc`, CSS selector, tag, text).
3. A coding agent reads the queue, applies each item to the real source, and `DELETE`s it. In
   scale-docs this is the `/scale-edit` skill (also triggered by saying "apply edits").

The plugin runs under Vite's `apply: 'serve'`, so the overlay and bridge **never reach a
production build**.

## Development

```bash
npm run build           # Compile TypeScript
npm run build:watch     # Watch mode
npm run generate:context  # Regenerate components.json from source
```

The package builds on install via the `prepare` script and ships compiled `dist/` (plus `scss/`, `context/`, `assets/`) through the `files` allowlist — so `github:` installs resolve `@scale-ds/scale-design-system/components/*` with no manual build step.

## Publishing

```bash
npm version patch
npm publish --access public
```

Or, from the consumer repo:

```bash
npm run release-ds -- "<commit message>"
```

This commits + pushes this repo, bumps `@scale-ds/scale-design-system` to the new HEAD in the consumer's lockfile, and commits + pushes the consumer.

## License

MIT
