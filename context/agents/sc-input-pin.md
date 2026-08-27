---
tag: sc-input-pin
class: ScInputPin
category: forms
import: @scale-ds/scale-design-system/components/sc-input-pin
dependencies: [sc-help-text]
props:
  length: { type: number, default: 4 }
  size: { type: enum, default: l, values: [l, xl] }
  state: { type: enum, default: default, values: [default, negative, positive] }
  label: { type: string, default: Label }
  showLabel: { type: boolean, default: true, attr: show-label }
  helpText: { type: string, default: "Help text", attr: help-text }
  showHelpText: { type: boolean, default: true, attr: show-help-text }
  name: { type: string, default: "" }
  required: { type: boolean, default: false }
  disabled: { type: boolean, default: false }
events: [input, change, complete]
cssParts: [fields, cell, help-text]
roles: [group]
formAssociated: true
useInstead: [sc-input]
source:
  guidance: guidance/components/input-pin.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-input-pin.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=31936-81337"
  docs: "https://scaledesignsystem.com/components/input-pin/"
---

# sc-input-pin

One-time-code / PIN entry across separate digit cells. Typing auto-advances, Backspace steps back, arrows navigate, and pasting a code distributes its digits across the cells.

## When to use

verification codes, 2FA, and short PIN entry. Form-associated — the host submits the joined value and fires a `complete` event when every cell is filled. For general text, use `sc-input`.

## When not to use

- Don’t use split cells for long or alphanumeric input — use `sc-input`.

## Do

- Match `length` to the real code length so paste fills cleanly.
- Tell users where the code came from in `help-text`.
- Use `state="negative"` with a message when a code is wrong.

## Don't

- Don’t use split cells for long or alphanumeric input — use `sc-input`.
- Don’t block paste; many users paste codes from another app.
- Don’t rely on colour alone for the error — keep the help text.

## Examples

### 4 digits

`length` sets the number of cells (default 4).

```html
<sc-input-pin label="Verification code" help-text="Enter the 4-digit code we sent you."></sc-input-pin>
```

### 6 digits

```html
<sc-input-pin length="6" label="Verification code" help-text="Enter the 6-digit code."></sc-input-pin>
```

### Sizes

Two sizes — `l` (default) and `xl`.

```html
<div style="display:flex;flex-direction:column;gap:var(--sc-space-l);align-items:flex-start">
  <sc-input-pin size="l" label="Large" value="12"></sc-input-pin>
  <sc-input-pin size="xl" label="Extra large" value="12"></sc-input-pin>
</div>
```

### Negative

```html
<sc-input-pin state="negative" value="1234" label="Code" help-text="That code is incorrect."></sc-input-pin>
```

### Positive

```html
<sc-input-pin state="positive" value="1234" label="Code" help-text="Code verified."></sc-input-pin>
```

### Disabled

```html
<sc-input-pin disabled value="1234" label="Code"></sc-input-pin>
```

## Accessibility

- **Grouping:** the cells sit in a `role="group"` labelled by the field label and described by the help text.
- **Per-cell label:** each cell announces “Digit N of M”; the first cell carries `autocomplete="one-time-code"` so OS code suggestions work.
- **Keyboard:** typing auto-advances; `Backspace` clears and steps back; `←`/`→`, `Home`/`End` move between cells; paste distributes digits.
- **Input mode:** `inputmode="numeric"` brings up the number pad on mobile.
- **Form:** form-associated — `required` sets `valueMissing` until all cells are filled; emits `input`, `change`, and `complete`.
