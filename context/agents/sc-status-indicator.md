---
tag: sc-status-indicator
class: ScStatusIndicator
category: feedback
import: @scale-ds/scale-design-system/components/sc-status-indicator
props:
  status: { type: enum, default: default, values: [default, brand, info, warning, negative, positive, inverse, disabled] }
  label: { type: string, default: "" }
cssParts: [dot]
roles: [img]
useInstead: [sc-badge, sc-status-icon]
source:
  guidance: guidance/components/status-indicator.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-status-indicator.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=74097-132835"
  framer: "https://scaleframer.framer.website/components/status-indicator"
  docs: "https://scaledesignsystem.com/components/status-indicator/"
---

# sc-status-indicator

A small 8px coloured dot that conveys a state at a glance — presence, list-item status, or a compact marker beside a label.

## When to use

presence dots, list-item status, and compact state markers next to text. For an icon with a glyph, use a `sc-status-icon`.

## When not to use

- Don’t use it where a labelled `sc-badge` or `sc-status-icon` would be clearer.

## Do

- Place the dot directly before the label it describes.
- Map `status` to a consistent meaning across the product.
- Set `label` whenever the dot appears without text.

## Don't

- Don’t use the dot as the only signal of state — colour alone isn’t accessible.
- Don’t reuse the same colour for conflicting meanings.
- Don’t use it where a labelled `sc-badge` or `sc-status-icon` would be clearer.

## Examples

### Status

Eight colour variants map to semantic states.

```html
<div style="display:flex;align-items:center;gap:var(--sc-space-l);flex-wrap:wrap">
  <sc-status-indicator status="default"></sc-status-indicator>
  <sc-status-indicator status="brand"></sc-status-indicator>
  <sc-status-indicator status="info"></sc-status-indicator>
  <sc-status-indicator status="warning"></sc-status-indicator>
  <sc-status-indicator status="negative"></sc-status-indicator>
  <sc-status-indicator status="positive"></sc-status-indicator>
  <sc-status-indicator status="disabled"></sc-status-indicator>
  <div style="display:inline-flex;padding:var(--sc-space-s);background:var(--sc-color-background-mono);border-radius:var(--sc-border-radius-xs)">
    <sc-status-indicator status="inverse"></sc-status-indicator>
  </div>
</div>
```

### Beside a label

The common case — the dot supplements adjacent text, so it stays decorative.

```html
<div style="display:flex;flex-direction:column;gap:var(--sc-space-s)">
  <span style="display:inline-flex;align-items:center;gap:var(--sc-space-s)"><sc-status-indicator status="positive"></sc-status-indicator>Online</span>
  <span style="display:inline-flex;align-items:center;gap:var(--sc-space-s)"><sc-status-indicator status="warning"></sc-status-indicator>Away</span>
  <span style="display:inline-flex;align-items:center;gap:var(--sc-space-s)"><sc-status-indicator status="default"></sc-status-indicator>Offline</span>
</div>
```

### Standalone with label

When the dot stands alone, `label` exposes it as an `img` with an accessible name.

```html
<sc-status-indicator status="positive" label="Online"></sc-status-indicator>
```

## Accessibility

- **Decorative by default:** with no `label` the dot is `aria-hidden`, relying on adjacent text for meaning.
- **Standalone:** setting `label` switches it to `role="img"` with that `aria-label`.
- **Not colour-only:** because the dot is just colour, always pair it with text (or a label) so the state is conveyed non-visually.
- **Contrast:** use `inverse` on dark surfaces; ensure the dot is distinguishable from its background.
