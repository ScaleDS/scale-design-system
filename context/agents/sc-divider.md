---
tag: sc-divider
class: ScDivider
category: layout
import: @scale-ds/scale-design-system/components/sc-divider
props:
  variant: { type: enum, default: default, values: [default, subtle, selected] }
source:
  guidance: guidance/components/divider.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-divider.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=48-1372"
  framer: available
  docs: "https://scaledesignsystem.com/components/divider/"
---

# sc-divider

A thin horizontal line that separates content into sections.

## When to use

section separators, boundaries between list or menu items, and grouping cues inside a `sc-card`. When you only need whitespace, use spacing instead of a line.

## Do

- Use `subtle` for quiet separators within a surface.
- Reserve `selected` for an active or highlighted boundary.
- Let the divider fill its container; control width via the parent.

## Don't

- Don’t stack dividers and heavy spacing — pick one separation cue.
- Don’t use a divider where a heading or whitespace would group content more clearly.
- Don’t rely on a divider to convey meaning that needs a label.

## Examples

### Variants

`default` is a standard border; `subtle` recedes into the background; and `selected` uses the brand accent for an active boundary.

```html
<div style="display:flex;flex-direction:column;gap:var(--sc-space-l);width:320px">
  <sc-divider></sc-divider>
  <sc-divider variant="subtle"></sc-divider>
  <sc-divider variant="selected"></sc-divider>
</div>
```

### In context

A divider spans the full width of its container — drop it between stacked content to mark a boundary.

```html
<div style="display:flex;flex-direction:column;gap:var(--sc-space-m);width:320px">
  <div>Account settings</div>
  <sc-divider variant="subtle"></sc-divider>
  <div>Notifications</div>
  <sc-divider variant="subtle"></sc-divider>
  <div>Billing</div>
</div>
```

## Accessibility

- **Role:** defaults to `role="separator"` so assistive tech announces the boundary.
- **Decorative use:** if the line is purely visual, override with `role="presentation"` so it’s ignored.
- **Contrast:** `subtle` is intentionally low-contrast — don’t depend on it as the only signal that content is grouped.
- **Orientation:** the divider is horizontal; for vertical separation, lay out with borders or spacing on the parent.
