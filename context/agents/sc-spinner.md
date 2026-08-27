---
tag: sc-spinner
class: ScSpinner
category: feedback
import: @scale-ds/scale-design-system/components/sc-spinner
props:
  size: { type: enum, default: l, values: [l, s] }
  type: { type: enum, default: primary, values: [primary, negative, mono, inverse] }
  label: { type: string, default: Loading }
cssParts: [svg]
useInstead: [sc-progress-bar]
source:
  guidance: guidance/components/spinner.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-spinner.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=23278-205769"
  framer: "https://scaleframer.framer.website/components/spinner"
  docs: "https://scaledesignsystem.com/components/spinner/"
---

# sc-spinner

An animated, indeterminate loading indicator — a rotating 270° arc that tells users something is happening behind the scenes.

## When to use

loading states of unknown duration. For a determinate task with a known percentage, use a `sc-progress-bar`.

## When not to use

- Don’t use a spinner for a measurable task — use a `sc-progress-bar`.

## Do

- Use a spinner only when you can’t measure progress.
- Set a meaningful `label` describing what’s loading.
- Place it where the result will appear so the wait has context.

## Don't

- Don’t use a spinner for a measurable task — use a `sc-progress-bar`.
- Don’t show several spinners at once; one clear loading region is enough.
- Don’t leave a spinner running indefinitely — resolve to content or an error.

## Examples

### Size

Two sizes — `l` (48px) and `s` (24px).

```html
<sc-spinner size="l"></sc-spinner>
<sc-spinner size="s"></sc-spinner>
```

### Type

`type` sets the colour; `inverse` is tuned for dark surfaces.

```html
<sc-spinner type="primary"></sc-spinner>
<sc-spinner type="negative"></sc-spinner>
<sc-spinner type="mono"></sc-spinner>
<div style="display:inline-flex;padding:var(--sc-space-l);background:var(--sc-color-background-mono);border-radius:var(--sc-border-radius-m)">
  <sc-spinner type="inverse"></sc-spinner>
</div>
```

## Accessibility

- **Role:** exposes `role="status"` so the loading state is announced; the SVG itself is `aria-hidden`.
- **Name:** `label` (default “Loading”) becomes the `aria-label`.
- **Reduced motion:** under `prefers-reduced-motion` it slows rather than stops — the motion is the meaning, so it keeps conveying “in progress”.
- **Contrast:** pick the `type` that meets WCAG AA against its background — `inverse` on dark.
