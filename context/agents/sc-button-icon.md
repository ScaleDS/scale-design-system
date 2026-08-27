---
tag: sc-button-icon
class: ScButtonIcon
category: actions
import: @scale-ds/scale-design-system/components/sc-button-icon
props:
  size: { type: enum, default: l, values: [l, s] }
  type: { type: enum, default: primary, values: [primary, secondary, tertiary, tertiary-mono, inverse, mono, outline, outline-mono] }
  disabled: { type: boolean, default: false }
  icon: { type: string, default: circle }
  label: { type: string, default: "" }
cssProperties: [--sc-button-icon-padding, --sc-button-icon-radius, --sc-button-icon-glyph-size, --sc-button-icon-color]
useInstead: [sc-button]
source:
  guidance: guidance/components/button-icon.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-button-icon.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=23278-183583"
  framer: "https://scaleframer.framer.website/components/button-icon"
  docs: "https://scaledesignsystem.com/components/button-icon/"
---

# sc-button-icon

An icon-only button that communicates an action without a visible label.

## When to use

dense toolbars and overflow actions where a text label won’t fit. If you have room for a label, prefer a `sc-button`.

## When not to use

- Don’t use an icon button when a text label would fit — use `sc-button`.

## Do

- Always set a `label` describing the action, not the icon.
- Use universally understood icons — close, search, settings, more.
- Pair with a `sc-tooltip` when the icon may be ambiguous.

## Don't

- Don’t use an icon button when a text label would fit — use `sc-button`.
- Don’t invent obscure icons for actions people won’t recognise.
- Don’t ship one without a `label` — the console warns and screen readers fall back to the icon name.

## Examples

### Types

Eight visual types, ordered by emphasis. Always pass a `label` — it becomes the accessible name.

```html
<sc-button-icon type="primary" icon="settings" label="Settings"></sc-button-icon>
<sc-button-icon type="secondary" icon="bell" label="Notifications"></sc-button-icon>
<sc-button-icon type="tertiary" icon="more-horizontal" label="More"></sc-button-icon>
<sc-button-icon type="tertiary-mono" icon="search" label="Search"></sc-button-icon>
<sc-button-icon type="outline" icon="edit" label="Edit"></sc-button-icon>
<sc-button-icon type="outline-mono" icon="filter" label="Filter"></sc-button-icon>
<sc-button-icon type="mono" icon="share-2" label="Share"></sc-button-icon>
```

### On dark surfaces

The `inverse` type is tuned to read on a dark or brand-colored background.

```html
<div style="display:flex;gap:var(--sc-space-m);padding:var(--sc-space-l);background:var(--sc-color-background-mono);border-radius:var(--sc-border-radius-l)">
  <sc-button-icon type="inverse" icon="play" label="Play"></sc-button-icon>
  <sc-button-icon type="inverse" icon="pause" label="Pause"></sc-button-icon>
  <sc-button-icon type="inverse" icon="skip-forward" label="Next"></sc-button-icon>
</div>
```

### Sizes

Two sizes — `l` (default, 24px icon) and `s` (16px icon).

```html
<sc-button-icon size="l" type="secondary" icon="star" label="Star"></sc-button-icon>
<sc-button-icon size="s" type="secondary" icon="star" label="Star"></sc-button-icon>
```

### Disabled

```html
<sc-button-icon type="primary" icon="x" label="Close" disabled></sc-button-icon>
<sc-button-icon type="outline" icon="trash-2" label="Delete" disabled></sc-button-icon>
```

## Accessibility

- **Element:** renders a native `<button type="button">` — keyboard focusable by default.
- **Name:** the `label` sets `aria-label`; with no label it falls back to the icon name and warns in the console.
- **Activation:** `Enter` / `Space` activates.
- **Disabled:** `disabled` removes it from the tab order and blocks pointer events.
- **Target size:** the `l` size gives a comfortable touch target; prefer it on touch surfaces.
- **Focus:** shows the global keyboard focus ring.
