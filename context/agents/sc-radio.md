---
tag: sc-radio
class: ScRadio
category: forms
import: @scale-ds/scale-design-system/components/sc-radio
dependencies: [sc-radio-item]
props:
  checked: { type: boolean, default: false }
  disabled: { type: boolean, default: false }
  required: { type: boolean, default: false }
  state: { type: enum, default: default, values: [default, negative] }
  value: { type: string, default: "" }
  name: { type: string, default: "" }
slots: [default]
events: [change]
formAssociated: true
useInstead: [sc-checkbox, sc-radio-item]
source:
  guidance: guidance/components/radio.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-radio.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=9709-78973"
  framer: "https://scaleframer.framer.website/components/form"
  docs: "https://scaledesignsystem.com/components/radio/"
---

# sc-radio

A labelled, form-associated radio for single-select choices. For the bare circle without a label, use the `sc-radio-item` primitive.

## When to use

mutually-exclusive options that need a label and form binding. Share a `name` across radios to group them. For multi-select, use `sc-checkbox`.

## When not to use

- Don’t use radios for multi-select — use `sc-checkbox`.
- Don’t ship the bare `sc-radio-item` without your own label and grouping.

## Do

- Use a radio group when exactly one option must be chosen.
- Give every radio in a set the same `name`.
- Default to the safest or most common option when one makes sense.

## Don't

- Don’t use radios for multi-select — use `sc-checkbox`.
- Don’t use a single radio on its own; a checkbox or toggle fits better.
- Don’t ship the bare `sc-radio-item` without your own label and grouping.

## Examples

### States

Resting, `checked`, `negative`, and `disabled`.

```html
<div style="display:flex;flex-direction:column;gap:var(--sc-space-s)">
  <sc-radio>Unchecked</sc-radio>
  <sc-radio checked>Checked</sc-radio>
  <sc-radio state="negative">Invalid</sc-radio>
  <sc-radio disabled>Disabled</sc-radio>
</div>
```

### Group

Radios with a shared `name` are mutually exclusive — selecting one clears the others.

```html
<div style="display:flex;flex-direction:column;gap:var(--sc-space-s)">
  <sc-radio name="plan" value="free" checked>Free</sc-radio>
  <sc-radio name="plan" value="pro">Pro</sc-radio>
  <sc-radio name="plan" value="enterprise">Enterprise</sc-radio>
</div>
```

### Radio item primitive (sc-radio-item)

The standalone circle and dot only — no label or form association. Use it in custom layouts where you own the surrounding markup.

```html
<sc-radio-item></sc-radio-item>
<sc-radio-item checked></sc-radio-item>
<sc-radio-item state="negative"></sc-radio-item>
<sc-radio-item checked disabled></sc-radio-item>
```

## Accessibility

- **Role:** renders `role="radio"` with `aria-checked`; wrap a set in a `role="radiogroup"` with a label.
- **Keyboard:** Tab moves to each radio; `Space` selects it; the label is also clickable.
- **Form:** `sc-radio` is form-associated — `required` sets `valueMissing` until one in the group is chosen.
- **Label:** the slotted text is the accessible name; `sc-radio-item` alone has none, so pair it with your own label.
- **State colour:** `negative` isn’t conveyed by colour alone — add `sc-help-text` describing the error.
