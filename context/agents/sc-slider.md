---
tag: sc-slider
class: ScSlider
category: forms
import: @scale-ds/scale-design-system/components/sc-slider
props:
  value: { type: number, default: 0 }
  min: { type: number, default: 0 }
  max: { type: number, default: 100 }
  step: { type: number, default: 1 }
  label: { type: string, default: "" }
  name: { type: string, default: "" }
  disabled: { type: boolean, default: false }
events: [input, change]
cssParts: [input]
roles: [slider]
formAssociated: true
useInstead: [sc-input]
source:
  guidance: guidance/components/slider.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-slider.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=23278-207164"
  docs: "https://scaledesignsystem.com/components/slider/"
---

# sc-slider

A continuous range control built on a native `<input type="range">` — keyboard, drag, touch, and form participation come for free. The 4px track fills brand-blue up to the handle.

## When to use

volume, brightness, ratings, and any bounded numeric value where approximate selection is fine. Emits `input` while dragging and `change` on commit. For exact numbers, use an `sc-input`.

## When not to use

- Don’t use a slider when an exact value is required — use an `sc-input`.

## Do

- Use a slider when the exact number doesn’t matter — approximate is fine.
- Show the current value nearby when precision helps the user.
- Use `step` to snap to meaningful increments.

## Don't

- Don’t use a slider when an exact value is required — use an `sc-input`.
- Don’t use a wide range with a tiny step that’s impossible to hit by drag.
- Don’t omit `label` — the slider needs an accessible name.

## Examples

### Value

`value` is clamped to the `min`–`max` range.

```html
<div style="display:flex;flex-direction:column;gap:var(--sc-space-l);max-width:370px">
  <sc-slider value="0" label="Volume"></sc-slider>
  <sc-slider value="50" label="Volume"></sc-slider>
  <sc-slider value="100" label="Volume"></sc-slider>
</div>
```

### Live value

Read `event.detail.value` from the `input` event to mirror the value as it’s dragged.

```html
<div style="display:flex;align-items:center;gap:var(--sc-space-l);max-width:370px;width:100%">
  <sc-slider data-slider-readout value="30" label="Volume" style="flex:1"></sc-slider>
  <span class="slider-value" style="min-width:4ch;text-align:right;font-variant-numeric:tabular-nums;color:var(--sc-color-text-primary)">30%</span>
</div>
```

### Custom range & step

Set `min`, `max`, and `step` to snap to discrete values.

```html
<sc-slider min="0" max="10" step="2" value="6" label="Rating" style="max-width:370px"></sc-slider>
```

### Disabled

```html
<sc-slider value="40" disabled label="Volume" style="max-width:370px"></sc-slider>
```

## Accessibility

- **Role:** the native range input provides `role="slider"` with `aria-valuemin`/`max`/`now` updated automatically.
- **Name:** `label` sets `aria-label`; always provide one.
- **Keyboard:** `←`/`→` (and `↑`/`↓`) step by `step`, `Page Up`/`Page Down` jump larger, `Home`/`End` go to the ends.
- **Focus:** a dashed ring shows on the thumb for keyboard focus only.
- **Form:** form-associated — submits `value` under `name` and participates in reset.
