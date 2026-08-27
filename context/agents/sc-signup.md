---
tag: sc-signup
class: ScSignup
category: forms
import: @scale-ds/scale-design-system/components/sc-signup
dependencies: [sc-input, sc-button]
props:
  placeholder: { type: string, default: "Email address" }
  buttonLabel: { type: string, default: "Sign up", attr: button-label }
  value: { type: string, default: "" }
  name: { type: string, default: email }
  type: { type: string, default: email }
  state: { type: enum, default: default, values: [default, negative, positive] }
  helpText: { type: string, default: "", attr: help-text }
  disabled: { type: boolean, default: false }
  loading: { type: boolean, default: false }
events: [submit]
cssParts: [container, input, button]
useInstead: [sc-input, sc-button]
source:
  guidance: guidance/components/signup.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-signup.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=9709-35760"
  framer: "https://scaleframer.framer.website/components/form"
  docs: "https://scaledesignsystem.com/components/signup/"
---

# sc-signup

A standalone inline email-capture form — an `sc-input` paired with a primary “Sign up” button that wraps below on narrow widths.

## When to use

newsletter and waitlist capture inline on a page. For the full marketing block with heading and subtext, use `sc-section-signup`. Emits `submit` with the entered value; set `state` + `help-text` from your handler to show validation.

## When not to use

- Don’t use it for full forms — compose `sc-input`s and a `sc-button` instead.

## Do

- Give immediate feedback on `submit` via `state` + `help-text`.
- Show `loading` while the request is in flight.
- Keep the button label action-led — “Sign up”, “Subscribe”.

## Don't

- Don’t use it for full forms — compose `sc-input`s and a `sc-button` instead.
- Don’t leave a submit without feedback; always resolve to success or error.
- Don’t rely on placeholder text as the field’s only accessible name.

## Examples

### Default

```html
<sc-signup style="max-width:480px"></sc-signup>
```

### Custom labels

Set `placeholder` and `button-label` for other capture flows.

```html
<sc-signup placeholder="you@example.com" button-label="Subscribe" style="max-width:480px"></sc-signup>
```

### States

`loading` shows the button spinner while submitting; `disabled` turns the whole control off.

```html
<div style="display:flex;flex-direction:column;gap:var(--sc-space-l)">
  <sc-signup loading style="max-width:480px"></sc-signup>
  <sc-signup disabled style="max-width:480px"></sc-signup>
</div>
```

### Live validation

Listen for `submit`, then set `state` and `help-text` from your handler. Try submitting empty, then “foo”, then a real email.

```html
<sc-signup data-signup-validate style="max-width:480px"></sc-signup>
```

## Accessibility

- **Field name:** the inner input has no visible label, so give it an accessible name (e.g. an adjacent `<label>` or context) rather than relying on the placeholder alone.
- **Keyboard:** `Enter` in the field submits, the same as clicking the button.
- **Validation:** set `state="negative"` with a `help-text` message so the error isn’t colour-only; the help text is exposed to assistive tech.
- **Loading / disabled:** `loading` sets the button’s busy state; `disabled` turns off both the input and button.
