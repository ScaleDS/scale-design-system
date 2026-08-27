---
tag: sc-toggle
class: ScToggle
category: forms
import: @scale-ds/scale-design-system/components/sc-toggle
props:
  checked: { type: boolean, default: false }
  disabled: { type: boolean, default: false }
  name: { type: string, default: "" }
  value: { type: string, default: "on" }
events: [change]
roles: [switch]
formAssociated: true
useInstead: [sc-checkbox, sc-radio]
source:
  guidance: guidance/components/toggle.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-toggle.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=1681-4816"
  framer: "https://scaleframer.framer.website/components/toggle"
  docs: "https://scaledesignsystem.com/components/toggle/"
---

# sc-toggle

On/off switches for settings or features — immediate, satisfying, and instantly understood. Flipping a toggle applies the change straight away and emits `change`.

## When to use

instant settings like notifications or dark mode. For options that only apply on submit, use a `sc-checkbox`.

## When not to use

- Don’t use a toggle in a form that only applies on submit — use a `sc-checkbox`.
- Don’t use toggles for mutually exclusive choices — use `sc-radio` buttons.

## Do

- Apply the change immediately when the toggle flips — that’s the contract a switch implies.
- Label what the toggle controls (“Email notifications”), not its state (“On”).
- Use it for binary settings with an obvious on/off meaning.

## Don't

- Don’t use a toggle in a form that only applies on submit — use a `sc-checkbox`.
- Don’t use toggles for mutually exclusive choices — use `sc-radio` buttons.
- Don’t ship a bare toggle without an accessible name.

## Examples

### Off

```html
<sc-toggle></sc-toggle>
```

### On

```html
<sc-toggle checked></sc-toggle>
```

### Disabled off

```html
<sc-toggle disabled></sc-toggle>
```

### Disabled on

```html
<sc-toggle checked disabled></sc-toggle>
```

## Accessibility

- **Role:** renders a native `<button role="switch">` with `aria-checked` reflecting the state.
- **Keyboard:** `Enter` / `Space` toggles; a visible focus ring shows on keyboard focus.
- **Name:** there is no built-in label — provide one via `aria-label` or an associated visible label.
- **Disabled:** uses the native `disabled` button state (removed from the tab order) and dims the control.
- **Form:** form-associated — participates in submit and reset like a native input.
