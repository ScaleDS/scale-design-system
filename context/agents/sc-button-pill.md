---
tag: sc-button-pill
class: ScButtonPill
category: actions
import: @scale-ds/scale-design-system/components/sc-button-pill
dependencies: [sc-spinner]
props:
  size: { type: enum, default: l, values: [l, m, s] }
  type: { type: enum, default: primary, values: [primary, secondary, tertiary, tertiary-mono, inverse, mono, outline, outline-mono, negative-primary, negative-outline] }
  loading: { type: boolean, default: false }
  disabled: { type: boolean, default: false }
  leadingIcon: { type: string, default: "", attr: leading-icon }
  trailingIcon: { type: string, default: "", attr: trailing-icon }
slots: [default]
useInstead: [sc-button, sc-button-icon]
source:
  guidance: guidance/components/button-pill.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-button-pill.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=23278-183547"
  framer: "https://scaleframer.framer.website/components/button-pill"
  docs: "https://scaledesignsystem.com/components/button-pill/"
---

# sc-button-pill

Like Button, but with fully rounded ends for a softer, more contemporary feel.

## When to use

filter chips, tag-like toggles, and segmented controls — pair with a `sc-button-group` for single-select. For standard form and page actions, use `sc-button`.

## When not to use

- Don’t use pills for primary form or page actions — use `sc-button`.
- Don’t ship icon-only pills — use `sc-button-icon`.

## Do

- Use pills for filters, toggles, and segmented choices.
- Keep a clear, action- or value-led label on every pill.
- Pick one shape per context — don’t mix pills and square buttons in the same row.

## Don't

- Don’t use pills for primary form or page actions — use `sc-button`.
- Don’t ship icon-only pills — use `sc-button-icon`.
- Don’t stack several primary pills competing for attention.

## Examples

### Types

Ten visual types, ordered by emphasis — the same scale as `sc-button` in a rounded shape.

```html
<sc-button-pill type="primary">Primary</sc-button-pill>
<sc-button-pill type="secondary">Secondary</sc-button-pill>
<sc-button-pill type="tertiary">Tertiary</sc-button-pill>
<sc-button-pill type="outline">Outline</sc-button-pill>
<sc-button-pill type="mono">Mono</sc-button-pill>
<sc-button-pill type="negative-primary">Negative</sc-button-pill>
```

### Sizes

```html
<sc-button-pill size="l" type="primary">Large</sc-button-pill>
<sc-button-pill size="m" type="primary">Medium</sc-button-pill>
<sc-button-pill size="s" type="primary">Small</sc-button-pill>
```

### With icons

Add a `leading-icon` or `trailing-icon` to reinforce the action.

```html
<sc-button-pill type="primary" leading-icon="play">Play</sc-button-pill>
<sc-button-pill type="secondary" trailing-icon="chevron-right">Next</sc-button-pill>
<sc-button-pill type="outline" leading-icon="filter">Filter</sc-button-pill>
```

### States

```html
<sc-button-pill type="primary" disabled>Disabled</sc-button-pill>
<sc-button-pill type="primary" loading>Loading</sc-button-pill>
```

### As a segmented control

Inside a `sc-button-group` with `selectable`, each pill becomes a single-select option.

```html
<sc-button-group selectable value="7d" label="Time range">
  <sc-button-pill value="24h">24h</sc-button-pill>
  <sc-button-pill value="7d">7d</sc-button-pill>
  <sc-button-pill value="30d">30d</sc-button-pill>
  <sc-button-pill value="90d">90d</sc-button-pill>
</sc-button-group>
```

## Accessibility

- **Element:** renders a native `<button type="button">` — keyboard focusable by default.
- **Activation:** `Enter` / `Space` activates.
- **Busy / disabled:** `loading` sets `aria-busy` and disables the button; `disabled` blocks activation.
- **Label:** the visible text carries the meaning — keep a label rather than relying on an icon alone.
- **Selection:** inside a selectable `sc-button-group` the group exposes each pill as a `radio` with `aria-checked`.
- **Focus:** shows the global keyboard focus ring.
