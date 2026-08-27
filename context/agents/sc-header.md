---
tag: sc-header
class: ScHeader
category: layout
import: @scale-ds/scale-design-system/components/sc-header
dependencies: [sc-logo, sc-button, sc-button-icon]
props:
  navLinks: { type: array, default: "[]", attr: nav-links }
  navAlign: { type: enum, default: center, attr: nav-align, values: [leading, center, trailing] }
  logoHref: { type: string, default: ./, attr: logo-href }
  primaryLabel: { type: string, default: "Buy now", attr: primary-label }
  primaryHref: { type: string, default: "", attr: primary-href }
  secondaryLabel: { type: string, default: "", attr: secondary-label }
  secondaryHref: { type: string, default: "", attr: secondary-href }
  showSearch: { type: boolean, default: false, attr: show-search }
  searchItems: { type: SearchItem[], default: "[]" }
  navTree: { type: NavTreeSection[], default: "[]" }
  activeHref: { type: string, default: "", attr: active-href }
  activeSection: { type: string, default: "", attr: active-section }
cssParts: [theme-toggle]
cssProperties: [--sc-header-bg-bottom]
roles: [combobox, listbox, option, search, switch]
source:
  guidance: guidance/components/header.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-header.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=5469-7546"
  framer: "https://scaleframer.framer.website/components/header"
  docs: "https://scaledesignsystem.com/components/header/"
---

# sc-header

The fixed top bar of a site — brand logo, primary navigation, key actions, and an optional search overlay. Below 810px it collapses into a two-level mobile menu.

## When to use

site-wide navigation, marketing-site headers, and app top bars. Pairs with the `sc-footer` at the bottom of the page.

## Do

- Keep top-level nav short — a handful of destinations, not a sitemap.
- Lead with a single primary CTA; pair it with at most one secondary action.
- Set `active-href` / `active-section` so the current page reads as selected.

## Don't

- Don’t stack multiple primary CTAs competing for attention.
- Don’t enable `show-search` without supplying `.searchItems`.
- Don’t put a second fixed header on the page — it’s a single, page-level landmark.

## Examples

### Default

Pass `nav-links` as a JSON array of `{ label, href }`; `primary-label` / `primary-href` set the CTA. (Framed here — in production it spans the viewport and is fixed to the top.)

```html
<!-- transform on the wrapper makes the fixed-position header position
     against this box instead of the viewport, containing the demo. -->
<div style="position:relative;height:96px;border:1px solid var(--sc-color-border-subtle);border-radius:8px;overflow:hidden;width:100%;transform:translateZ(0)">
  <sc-header
    primary-label="Buy now"
    primary-href="#"
    nav-links='[{"label":"Pricing","href":"#"},{"label":"FAQ","href":"#"}]'
  ></sc-header>
</div>
```

### Secondary action

Add `secondary-label` / `secondary-href` for a lower-emphasis action beside the primary CTA — typically “Sign in”.

```html
<div style="position:relative;height:96px;border:1px solid var(--sc-color-border-subtle);border-radius:8px;overflow:hidden;width:100%;transform:translateZ(0)">
  <sc-header
    primary-label="Buy now"
    primary-href="#"
    secondary-label="Sign in"
    secondary-href="#"
    nav-links='[{"label":"Pricing","href":"#"},{"label":"FAQ","href":"#"}]'
  ></sc-header>
</div>
```

### Nav alignment

`nav-align` positions the links — `center` (default), `leading`, or `trailing`.

```html
<div style="position:relative;height:96px;border:1px solid var(--sc-color-border-subtle);border-radius:8px;overflow:hidden;width:100%;transform:translateZ(0)">
  <sc-header
    nav-align="trailing"
    primary-label="Buy now"
    primary-href="#"
    nav-links='[{"label":"Pricing","href":"#"},{"label":"FAQ","href":"#"}]'
  ></sc-header>
</div>
```

### With search

Set `show-search` to reveal the search icon, and provide pages to match against via the `.searchItems` property (an array of `{ label, href, group }`). Click the magnifier to open the overlay.

```html
<div style="position:relative;height:320px;border:1px solid var(--sc-color-border-subtle);border-radius:8px;overflow:hidden;width:100%;transform:translateZ(0)">
  <sc-header
    id="scd-header-search"
    show-search
    primary-label="Buy now"
    primary-href="#"
    nav-links='[{"label":"Pricing","href":"#"},{"label":"FAQ","href":"#"}]'
  ></sc-header>
</div>
```

## Accessibility

- **Landmark:** renders a native `<header>` (banner) with a `<nav aria-label="Main">` for primary navigation.
- **Current page:** the link matching `active-href` gets `aria-current="page"`.
- **Search:** a `role="search"` region with a `combobox` input and `listbox` results — `↓`/`↑` move through options, `Enter` follows, `Esc` closes.
- **Mobile menu:** the toggle exposes `aria-expanded`; section rows use `aria-haspopup` for the second-level panel.
- **Theme toggle:** a `role="switch"` with `aria-checked` and an “Toggle theme” label.
- **Layout offset:** because it’s `position: fixed`, give page content top padding so nothing hides behind it.
