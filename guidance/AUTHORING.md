# Guidelines page authoring

How to write the hand-authored HTML fragments in this folder
(`content/{foundations,components,sections}/<slug>.html`). Each fragment is raw HTML
injected into the `<scd-shell>` body by `scripts/generate-pages.mjs`; the nav set is
derived from `context/components.json` + `tokens.json`, so a fragment only owns its own
prose + demos.

**Component pages and Foundation pages are structured differently** — components document an
*object* (anatomy, states, props, install), foundations document a *system of values* (a
scale, tokens, application rules). Use the matching template below. This convention follows
the common spine across Polaris / Carbon / Atlassian, trimmed to a lean,
single-scroll, code-coupled system (closest to Polaris/Primer).

> **This file covers structure — what sections exist and in what order.**
> For *how the words read* (voice, sentence shape, punctuation, and the format for the
> description column of a token table) see `.opencode/skills/scale-authoring/SKILL.md`.
> Read both before writing a new page.

---

## Shared building blocks

| Block | Use for |
|---|---|
| `<div class="scd-page-header"><h1>…</h1><div class="scd-page-header-text">…</div></div>` | Page title + intro prose. `h1` sits directly in the header; all `<p>` intro prose goes in `.scd-page-header-text` (8px gap). |
| `<div class="scd-section"><h2>…</h2>…</div>` | Every content group below the header. One concept per section. |
| `<scd-demo>…live `<sc-*>` markup…</scd-demo>` | Live preview + copyable source (source is read from the element's own markup). |
| `<scd-demo code="…escaped HTML…">…</scd-demo>` | When the copyable snippet must differ from the live markup (e.g. to hide a layout wrapper). Escape `<` as `&lt;`. With an **empty body** it renders code-only (no preview box) — use this for the Install / import snippet. |
| `<scd-api tags="sc-button">` | Data-driven API tables (Props / Slots / Events / CSS Parts) from `components.json`. Multi-tag (`tags="sc-x sc-y"`) renders labelled sub-sections. **Components only.** |
| `<scd-token-page group="color" hide-header>` | Data-driven token swatches from `tokens.json`. Groups: `color`, `typography`, `spacing`, `borderRadius`, `borderWidth`, `shadow`, `breakpoint`. `hide-header` suppresses its built-in h1 so the fragment owns it. **Foundations only.** |
| `<div class="scd-guidelines"><div class="scd-guideline">…</div>…</div>` | The **Guidelines** (Do / Don't) section body — stacked blocks separated by a gap; each `.scd-guideline` holds an `<h3>` + `<ul>`. |
| `<code class="scd-inline-code">open</code>` | Inline code references in prose. |

---

## Component page template

Order matters — this is the read order. **R** = required, **+** = recommended, **○** = optional.

```
R  1. Page header   h1 + lead ("what it is") + "When to use" paragraph
+  2. Install       code-only import snippet (<scd-demo code="…">)
R  3. Examples      h2 heading; one h3 + <scd-demo> per property / variant group (Sizes, States…)
○  4. Anatomy       labelled parts diagram — composite components only
+  5. Guidelines    h2 heading; stacked Do / Don't blocks (.scd-guidelines / .scd-guideline)
R  6. Accessibility keyboard map, ARIA roles, focus order, contrast / target size
R  7. Properties    <scd-api tags="sc-…"> (renders the Props / Slots / Events / CSS Parts tables)
```

Under **Examples**, each example is its own `.scd-section` (so the 32px page gap separates
them) — the *first* section carries the `<h2>Examples</h2>` plus the first `<h3>`, and each
subsequent example section is just an `<h3>` + `<scd-demo>`.

### Skeleton

```html
<div class="scd-page-header">
  <h1>Button</h1>
  <div class="scd-page-header-text">
    <p>The go-to element for triggering actions.</p>
    <p><strong>When to use:</strong> primary user actions, form submissions, navigation triggers.</p>
  </div>
</div>

<div class="scd-section">
  <h2>Install</h2>
  <!-- Import only — the one-time `npm install` lives on the Quick Start page. -->
  <scd-demo code="import '@scale-ds/scale-design-system/components/sc-button'"></scd-demo>
</div>

<div class="scd-section">
  <h2>Examples</h2>
  <h3>Types</h3>
  <p>Short framing sentence.</p>
  <scd-demo>
    <sc-button type="primary">Primary</sc-button>
    <sc-button type="secondary">Secondary</sc-button>
  </scd-demo>
</div>

<div class="scd-section">
  <h3>Sizes</h3>
  <scd-demo>
    <sc-button size="l">Large</sc-button>
    <sc-button size="s">Small</sc-button>
  </scd-demo>
</div>

<div class="scd-section">
  <h2>Guidelines</h2>
  <div class="scd-guidelines">
    <div class="scd-guideline">
      <h3>Do</h3>
      <ul><li>Lead with a single primary action per view.</li></ul>
    </div>
    <div class="scd-guideline">
      <h3>Don't</h3>
      <ul><li>Don't stack several primary buttons together.</li></ul>
    </div>
  </div>
</div>

<div class="scd-section">
  <h2>Accessibility</h2>
  <ul>
    <li><strong>Keyboard:</strong> <kbd>Enter</kbd> / <kbd>Space</kbd> activates.</li>
    <li><strong>Roles:</strong> renders a native <code class="scd-inline-code">&lt;button&gt;</code>.</li>
    <li><strong>Focus:</strong> visible ring on keyboard focus; never removed.</li>
  </ul>
</div>

<div class="scd-section">
  <h2>Properties</h2>
  <scd-api tags="sc-button"></scd-api>
</div>
```

> Worked example: [`components/avatar.html`](components/avatar.html) follows this template end-to-end.

---

## Foundation page template

Foundations have **no Install, no Anatomy, no API** — instead they document the scale itself
and how to apply it.

```
R  1. Page header        h1 + lead ("what it is and why it matters")
+  2. Principles         the conceptual model — the scale, the roles, how the system is built
R  3. Token reference    <scd-token-page group="…" hide-header> swatches/values, OR a
                         hand-authored <sc-table-basic> scale table (see note below)
+  4. Guidelines         Do / Don't + role/usage rules (.scd-guidelines / .scd-guideline)
R  5. Accessibility      foundation-specific: contrast (color), min sizes (type),
                         reduced-motion (motion), touch targets (spacing)
```

**Token reference — data-driven vs hand-authored.** Use `<scd-token-page group="…"
hide-header>` for a plain swatch/value grid (e.g. Elevation). When the scale
needs richer columns — a live preview, a **Usage** description, both light/dark
values — hand-author an `<sc-table-basic>` instead: Spacing and Border render a
preview + Name + Variable + **Usage** + Value; Color's semantic tables stack the
name over its variable, add a **Usage** column, and a theme-aware Primitive column.
Hand-authored scale tables reuse the primitive-table chrome (hidden header row,
trimmed last-row divider, mobile stacking) — scope any new table CSS under `.scd-*`
in `guidelines.scss`.

**One page can cover sibling token groups.** **Border** merges `borderRadius` +
`borderWidth` into a single `foundations/border.html` (radius table + width table) —
there is no separate Border Radius / Border Width page. The nav entry is keyed on
`borderRadius` in `build-nav.mjs`; don't recreate the split fragments.

**A foundation page can rename + extend its group.** The `breakpoint` group renders
as a hand-authored **Layout** page (`foundations/layout.html`, slug/label set in
`build-nav.mjs`) — it pairs the breakpoint scale table with a column-grid table and
the live `<scd-grid-demo>` element (a column preview that tracks the viewport width).
So this group is hand-authored, *not* a `<scd-token-page group="breakpoint">`.

### Skeleton

```html
<div class="scd-page-header">
  <h1>Color</h1>
  <div class="scd-page-header-text">
    <p>Color conveys mood, establishes brand, and ensures visual consistency.</p>
  </div>
</div>

<div class="scd-section">
  <h2>How it works</h2>
  <p>Roles (surface, text, border, accent) map to semantic tokens, not raw hex …</p>
</div>

<div class="scd-section">
  <h2>Tokens</h2>
  <scd-token-page group="color" hide-header></scd-token-page>
</div>

<div class="scd-section">
  <h2>Applying color</h2>
  <p>Use <code class="scd-inline-code">--sc-color-text-primary</code> for body copy …</p>
  <!-- Do / Don't guidance -->
</div>

<div class="scd-section">
  <h2>Accessibility</h2>
  <p>Text + background pairings meet WCAG AA (4.5:1 body, 3:1 large) …</p>
</div>
```

---

## Why the two differ

| | Component page | Foundation page |
|---|---|---|
| Documents | an object you place | a system of values you reference |
| Live demos | yes — `<scd-demo>` of `<sc-*>` | swatches — `<scd-token-page>` |
| Anatomy | yes (composite ones) | n/a |
| Props/API | yes — `<scd-api>` | n/a |
| Install/import | yes | n/a |
| Core "reference" | the prop table | the token scale |
| Usage section | when to use vs siblings | which token for which role |

---

## How much detail

- **Examples carry the page** — lead with them, keep prose to a framing sentence per section.
- **Accessibility is required, not optional** — every modern system (Carbon, Polaris,
  Atlassian) ships a per-component a11y section; keyboard + roles + focus at minimum.
- **Usage = Do / Don't**, not a wall of prose. Short, paired, concrete.
- Pull the canonical description / when-to-use from `context/components.json` so on-page prose
  matches the source of truth.

## Conventions & gotchas

- **Asset paths must be root-absolute** (`/images/…`) — pages live at `/components/<slug>/`.
- **Fixed-position components** (`sc-header`, `sc-hero`) escape the demo box; wrap the live
  element in `<div style="…;transform:translateZ(0)">` so `position:fixed` anchors to the box,
  and use `<scd-demo code="…">` to show clean markup without the wrapper.
- **JS-set props** (arrays/objects like breadcrumbs `.crumbs`, or imperative APIs like toast):
  give `<scd-demo>` a clean `code="…"` snippet, put the live `<sc-*>` with an `id`, and set the
  property in a `<script type="module">` at the end of the fragment. Lit handles pre-upgrade
  props, so ordering is safe.
- **Scope any new CSS** under `.scd-*` in `guidelines.scss` — that sheet is now loaded
  site-wide, so an unscoped rule leaks onto the marketing pages.

### Optional helper worth adding

A `.scd-do` / `.scd-dont` two-column block (green/red accent) would make the Do/Don't sections
consistent and scannable. Until then, author them with a plain two-column layout or paired
`.scd-section`s. There is no anatomy/a11y component yet either — author those with existing
primitives (`.scd-section` + `<ul>` / `<table>` / an image).
