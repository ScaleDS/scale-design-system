---
name: scale-build
description: Build or modify UI using the Scale Design System (@scale-ds/scale-design-system, `sc-*` Lit web components). Use whenever the project depends on @scale-ds/scale-design-system and the task involves creating, editing, or styling any interface — a page, section, form, dialog, table, or single control — and whenever the user mentions Scale, `sc-*` elements, or `--sc-*` tokens. Also use before writing raw HTML or CSS in such a project, to check whether Scale already provides the component.
---

# Building with Scale

Scale is a Lit web component design system. 62 components prefixed `sc-`, all
styling driven by `--sc-*` CSS custom properties.

## Non-negotiables

1. **Never write a raw HTML control when an `sc-*` exists.** No `<button>`,
   `<input>`, `<select>`, `<table>`. Check first — see Step 1.
2. **Never hardcode a colour, space, radius, duration, or font.** No hex, no
   `rgb()`, no `px` spacing, no `ms`. Use `--sc-*` tokens.
3. **Never guess a prop value.** Every enum prop has a fixed value list in its
   guidance file. An invalid value fails silently and renders the default.
4. **Never call `customElements.define`.** Importing a component registers it.

If you cannot satisfy one of these, stop and say so rather than approximating.

## Workflow

### 1. Check what Scale already has

Map the need to a category before writing anything:

| Need | Category | Examples |
|---|---|---|
| Trigger an action | `actions` | `sc-button` `sc-button-icon` `sc-button-pill` `sc-button-group` |
| Collect input | `forms` | `sc-input` `sc-checkbox` `sc-radio` `sc-toggle` `sc-slider` `sc-date-picker` `sc-file-upload` `sc-segmented-control` |
| Tell the user something | `feedback` | `sc-alert` `sc-banner` `sc-toast` `sc-modal` `sc-tooltip` `sc-badge` `sc-progress-bar` `sc-spinner` |
| Move around | `navigation` | `sc-tabs` `sc-accordion` `sc-breadcrumbs` `sc-menu-dropdown` `sc-page-controls` |
| Show records | `data-display` | `sc-table-basic` `sc-table-dynamic` |
| Present content | `content` | `sc-card` `sc-card-image` `sc-card-pricing` `sc-avatar` `sc-tag` |
| Structure a page | `layout` | `sc-header` `sc-footer` `sc-row` `sc-divider` |
| A whole page section | `sections` | `sc-hero` `sc-section-{feature,faq,pricing,bento,signup,content}` |

For a full page or a recognisable section, check the composition patterns
first — there are 12, covering hero, pricing, FAQ, signup, form card, page
header and footer. They save you assembling from parts.

If nothing fits, say so before hand-rolling. A missing component is a design
system gap worth reporting, not a licence to write custom CSS.

### 2. Read the component's guidance file

Never work from memory or from the tag name. For each component you are about
to use, load its file — first route that works:

1. MCP: `get-component-guidance` (from the `scale` server, bundled with this plugin)
2. Local: `node_modules/@scale-ds/scale-design-system/context/agents/sc-button.md`
3. Web: `https://scaledesignsystem.com/components/button/agent.md`

All three return the same file, so a missing MCP server costs you nothing but a
step. Frontmatter carries the prop contract with every valid enum value, slots,
events, CSS parts and properties, and `useInstead` redirects. The body carries
when to use it, when not to, do/don't, worked examples, and the accessibility
contract.

The same three routes work for the foundations — `color`, `spacing`,
`typography`, `border`, `elevation`, `layout`, `material`, `motion` — with no
`sc-` prefix. Read the relevant one before styling anything by hand.
`https://scaledesignsystem.com/llms.txt` indexes all of them.

**Read `useInstead` before committing to a component.** It is the most common
source of wrong-but-plausible output: `sc-button` for an icon-only action where
`sc-button-icon` belongs, `sc-alert` for something transient that should be
`sc-toast`.

### 3. Import, then compose

```js
import '@scale-ds/scale-design-system/components/sc-button'
```

Import each component you use. They self-register. Once per app, import the
global stylesheet for resets and typography:

```scss
@use '@scale-ds/scale-design-system/scss/main';
```

Compose from the examples in the guidance file rather than inventing markup.
Icon props take Feather icon names (`leading-icon="download"`).

### 4. Style with tokens only

Each guidance file lists the component's own `cssProperties` — the custom
properties it is designed to let you set, with their defaults. Override those,
not arbitrary CSS. For anything you write around a component, pull from the
token groups: colour, space, border radius/width, typography, shadow,
breakpoint, motion. `get-tokens` or `context/tokens.json` has the full set.

Theming is automatic — `data-theme` on `<html>` switches light and dark, and
`sc-header` dispatches `theme-change`. Never write a colour that only works in
one theme.

For motion, reach for a composite transition before a raw duration + easing:

```css
.panel { transition: opacity var(--sc-motion-transition-fade-in-m); }
```

### 5. Verify before you finish

Run through `references/checks.md`. Do not skip it — most Scale violations are
introduced silently, and the check takes seconds.

## Common mistakes

- Writing `<button class="...">` because the styling felt simpler than looking
  up `sc-button`'s types. There are 13; one of them is what you want.
- Passing an enum value that doesn't exist (`type="danger"` instead of
  `type="negative-primary"`). Silently renders the default, so it will look
  like it worked.
- Hardcoding a hex that happens to match the light theme, breaking dark mode.
- Rebuilding a section by hand when `sc-section-pricing` exists.
- Using `sc-alert` for something transient — that's `sc-toast`.
