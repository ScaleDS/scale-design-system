---
tag: sc-page-controls
class: ScPageControls
category: navigation
import: @scale-ds/scale-design-system/components/sc-page-controls
props:
  total: { type: number, default: 6 }
  current: { type: number, default: 0 }
  label: { type: string, default: "Page controls" }
  disabled: { type: boolean, default: false }
events: [change]
roles: [group]
source:
  guidance: guidance/components/page-controls.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-page-controls.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=892-5405"
  docs: "https://scaledesignsystem.com/components/page-controls/"
---

# sc-page-controls

Pagination dots for carousels and steppers. Each dot is a native button; the active one carries `aria-current` and clicking a dot fires a `change` event.

## When to use

carousels, onboarding steppers, and any short sequence of pages where a compact position indicator helps. For numbered table pagination, use the `sc-table-dynamic` footer instead.

## Do

- Use for short sequences — a handful of slides or steps.
- Give the group a meaningful `label` for context.
- Keep the dots in sync with the content they page through.

## Don't

- Don’t use dots for long lists — numbered pagination scales better.
- Don’t rely on dots as the only way to advance; pair with arrows or swipe.
- Don’t make dots the sole indicator of progress in a long multi-step form.

## Examples

### Active index

`current` is the zero-based active page.

```html
<div style="display:flex;flex-direction:column;gap:var(--sc-space-l);align-items:flex-start">
  <sc-page-controls total="6" current="0"></sc-page-controls>
  <sc-page-controls total="6" current="2"></sc-page-controls>
  <sc-page-controls total="6" current="5"></sc-page-controls>
</div>
```

### Count

`total` sets the number of dots.

```html
<div style="display:flex;flex-direction:column;gap:var(--sc-space-l);align-items:flex-start">
  <sc-page-controls total="2" current="0"></sc-page-controls>
  <sc-page-controls total="4" current="1"></sc-page-controls>
  <sc-page-controls total="6" current="3"></sc-page-controls>
</div>
```

### Interactive

Click a dot — the active state moves and a `change` event fires with the new index.

```html
<sc-page-controls total="5" current="0" label="Carousel pages"></sc-page-controls>
```

### Disabled

```html
<sc-page-controls total="6" current="2" disabled></sc-page-controls>
```

## Accessibility

- **Pattern:** a `role="group"` of native `<button>` dots (the WAI-ARIA carousel slide-picker pattern), labelled by `label`.
- **Active state:** the current dot carries `aria-current="true"` — colour isn’t the only cue.
- **Per-dot label:** each button announces “Go to page N”.
- **Target size:** the hit area expands to ~24px even though the dot renders at 8px.
- **Keyboard:** each dot is tab-focusable and activates with `Enter` / `Space`; `disabled` removes them from the tab order.
