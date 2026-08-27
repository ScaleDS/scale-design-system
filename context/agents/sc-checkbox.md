---
tag: sc-checkbox
class: ScCheckbox
category: forms
import: @scale-ds/scale-design-system/components/sc-checkbox
dependencies: [sc-checkbox-item]
props:
  checked: { type: boolean, default: false }
  disabled: { type: boolean, default: false }
  indeterminate: { type: boolean, default: false }
  required: { type: boolean, default: false }
  state: { type: enum, default: default, values: [default, negative, positive] }
  value: { type: string, default: "on" }
  name: { type: string, default: "" }
slots: [default]
events: [change]
formAssociated: true
useInstead: [sc-radio, sc-checkbox-item]
source:
  guidance: guidance/components/checkbox.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-checkbox.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=9709-79005"
  framer: "https://scaleframer.framer.website/components/form"
  docs: "https://scaledesignsystem.com/components/checkbox/"
---

# sc-checkbox

A labelled, form-associated checkbox that emits `change` events and binds to a form via `name` / `value`. For the bare square without a label, use the `sc-checkbox-item` primitive.

## When to use

multi-select options, terms acceptance, and labelled settings that need form binding. For a single on/off setting, consider a `sc-toggle`; for mutually exclusive choices, use `sc-radio`.

## When not to use

- Don’t use a checkbox for one mutually exclusive choice — use `sc-radio`.
- Don’t use the bare `sc-checkbox-item` without your own label and form wiring.

## Do

- Write a clear, positive label — the statement is true when checked.
- Use `indeterminate` only for a parent summarising mixed children.
- Reach for `sc-checkbox` in forms so it binds and validates.

## Don't

- Don’t use a checkbox for one mutually exclusive choice — use `sc-radio`.
- Don’t use the bare `sc-checkbox-item` without your own label and form wiring.
- Don’t phrase labels as negatives — “Don’t send emails” is hard to parse when checked.

## Examples

### States

`indeterminate` represents a partially-selected parent in a checkbox tree.

```html
<sc-checkbox>Unchecked</sc-checkbox>
<sc-checkbox checked>Checked</sc-checkbox>
<sc-checkbox indeterminate>Indeterminate</sc-checkbox>
```

### Validation

Set `state` to `negative` or `positive` to reflect form validity. Add `required` for native constraint validation.

```html
<sc-checkbox state="negative" required>Please accept the terms</sc-checkbox>
<sc-checkbox checked state="positive">Verified</sc-checkbox>
```

### Disabled

```html
<sc-checkbox disabled>Unchecked</sc-checkbox>
<sc-checkbox checked disabled>Checked</sc-checkbox>
```

### sc-checkbox-item primitive

The standalone checkbox visual — just the square and tick, with no label or form association. Reach for it in custom layouts (cards, list items) where you own the surrounding markup.

```html
<sc-checkbox-item></sc-checkbox-item>
<sc-checkbox-item checked></sc-checkbox-item>
<sc-checkbox-item indeterminate></sc-checkbox-item>
<sc-checkbox-item state="negative"></sc-checkbox-item>
<sc-checkbox-item checked disabled></sc-checkbox-item>
```

## Accessibility

- **Role:** renders `role="checkbox"` with `aria-checked` reflecting `true` / `false` / `mixed` (indeterminate).
- **Keyboard:** `Space` toggles the box; the label is also clickable.
- **Form:** `sc-checkbox` is form-associated — `required` sets `valueMissing` validity and it participates in reset.
- **Label:** the slotted text is the accessible name; `sc-checkbox-item` alone has none, so pair it with your own label.
- **State colour:** `negative` isn’t signalled by colour alone — pair it with `sc-help-text` describing the error.
- **Focus:** shows the global keyboard focus ring on the square.
