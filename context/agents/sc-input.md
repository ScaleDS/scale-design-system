---
tag: sc-input
class: ScInput
category: forms
import: @scale-ds/scale-design-system/components/sc-input
dependencies: [sc-help-text]
props:
  state: { type: enum, default: default, values: [default, negative, positive, disabled] }
  label: { type: string, default: Label }
  placeholder: { type: string, default: Text }
  value: { type: string, default: "" }
  helpText: { type: string, default: "Help text", attr: help-text }
  showLabel: { type: boolean, default: true, attr: show-label }
  showHelpText: { type: boolean, default: true, attr: show-help-text }
  leadingIcon: { type: string, default: "", attr: leading-icon }
  trailingIcon: { type: string, default: "", attr: trailing-icon }
  type: { type: string, default: text }
  name: { type: string, default: "" }
  autocomplete: { type: string, default: "" }
  inputmode: { type: string | undefined }
  pattern: { type: string | undefined }
  required: { type: boolean, default: false }
  kind: { type: enum, default: default, values: [default, date] }
  mode: { type: enum, default: single, values: [single, range] }
  end: { type: string, default: "" }
  min: { type: string, default: "" }
  max: { type: string, default: "" }
  locale: { type: string, default: en-US }
  firstDayOfWeek: { type: enum, default: monday, attr: first-day-of-week, values: [monday, sunday] }
events: [input, change]
formAssociated: true
useInstead: [sc-text-area]
source:
  guidance: guidance/components/input.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-input.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=892-4256"
  framer: "https://scaleframer.framer.website/components/form"
  docs: "https://scaledesignsystem.com/components/input/"
---

# sc-input

A single-line text field with label, icons, help text, and validation states. It’s a form-associated custom element, so it participates in native `<form>` submission and validation just like a built-in input.

## When to use

form fields, search inputs, email capture — any single-line text entry. For multi-line input use `sc-text-area`.

## When not to use

- Don’t use Input for multi-line text — use `sc-text-area`.

## Do

- Always give the field a clear `label`; use `placeholder` for an example, not the label.
- Set `type` / `inputmode` (email, tel…) so mobile keyboards and validation match.
- Explain errors in `help-text` with `state="negative"`.

## Don't

- Don’t use placeholder text as the only label — it disappears on input.
- Don’t mark a field `positive` unless the success is meaningful to confirm.
- Don’t use Input for multi-line text — use `sc-text-area`.

## Examples

### Default

```html
<sc-input label="Email" placeholder="you@example.com" style="max-width:320px"></sc-input>
```

### Negative

```html
<sc-input label="Email" placeholder="you@example.com" state="negative" help-text="Invalid email" style="max-width:320px"></sc-input>
```

### Positive

```html
<sc-input label="Email" placeholder="you@example.com" state="positive" help-text="Looks good!" style="max-width:320px"></sc-input>
```

### Disabled

```html
<sc-input label="Email" placeholder="you@example.com" state="disabled" style="max-width:320px"></sc-input>
```

### Leading icon

```html
<sc-input label="Search" placeholder="Search..." leading-icon="search" style="max-width:320px"></sc-input>
```

### Trailing icon

```html
<sc-input label="Password" placeholder="Enter password" trailing-icon="lock" style="max-width:320px"></sc-input>
```

### Required

```html
<sc-input label="Full name" placeholder="John Doe" required show-help-text="false" style="max-width:320px"></sc-input>
```

### Required + email format

Try submitting empty, then “foo”, then “a@b.com”.

```html
<form data-email-form style="display:flex;flex-direction:column;gap:var(--sc-space-s);max-width:320px">
  <sc-input name="email" type="email" required label="Email" placeholder="you@example.com" help-text="Enter a valid email"></sc-input>
  <sc-button type="primary" data-submit>Submit</sc-button>
  <span class="email-out" style="font:var(--sc-type-size-s)/1.4 system-ui;color:var(--sc-color-text-positive)"></span>
</form>
```

### Form integration

Submit & reset — all four form-associated controls participate.

```html
<form data-fa-form style="display:flex;flex-direction:column;gap:var(--sc-space-l);max-width:480px;padding:var(--sc-space-l);border:1px solid var(--sc-color-border-subtle);border-radius:var(--sc-border-radius-m)">
  <sc-input name="email" type="email" label="Email" placeholder="you@example.com" required></sc-input>
  <sc-checkbox name="newsletter" value="yes">Subscribe to newsletter</sc-checkbox>
  <div style="display:flex;flex-direction:column;gap:var(--sc-space-s)">
    <span style="font-weight:600;color:var(--sc-color-text-secondary)">Plan</span>
    <sc-radio name="plan" value="free">Free</sc-radio>
    <sc-radio name="plan" value="pro" checked>Pro</sc-radio>
    <sc-radio name="plan" value="team">Team</sc-radio>
  </div>
  <sc-toggle name="marketing" value="yes"></sc-toggle>
  <div style="display:flex;gap:var(--sc-space-s)">
    <sc-button type="primary" data-fa-submit>Submit</sc-button>
    <sc-button type="secondary" data-fa-reset>Reset</sc-button>
  </div>
  <pre class="form-output" style="background:var(--sc-color-background-subtle);padding:var(--sc-space-m);border-radius:var(--sc-border-radius-xs);font-family:ui-monospace,monospace;font-size:13px;margin:0;white-space:pre-wrap">(submit to see FormData JSON)</pre>
</form>
```

### Date

`kind="date"` turns the field into a `sc-date-picker` dropdown.

```html
<sc-input kind="date" label="Start date" placeholder="Select a date" style="max-width:320px"></sc-input>
```

### Date — preselected

```html
<sc-input kind="date" label="Start date" placeholder="Select a date" value="2011-04-15" style="max-width:320px"></sc-input>
```

### Date — range

```html
<sc-input kind="date" mode="range" label="Trip dates" placeholder="Select dates" style="max-width:320px"></sc-input>
```

### Date — with help text

```html
<sc-input kind="date" label="Date of birth" placeholder="Select a date" help-text="MM/DD/YYYY" show-help-text style="max-width:320px"></sc-input>
```

### Date — disabled

```html
<sc-input kind="date" label="Start date" placeholder="Select a date" value="2011-04-15" state="disabled" style="max-width:320px"></sc-input>
```

## Accessibility

- **Label:** the `label` is associated with the inner field; keep `show-label` on, or provide an external label if hidden.
- **Form:** form-associated — native validation propagates to the host (`type="email"`, `pattern`, `required`) and it participates in submit/reset.
- **Errors:** `state="negative"` styles the field and its `sc-help-text`; pair it with a message so the error isn’t colour-only.
- **Date kind:** renders a `<button aria-haspopup="dialog">` with `aria-expanded`; the calendar follows the `sc-date-picker` keyboard model.
- **Focus:** shows a keyboard-only focus ring (suppressed for pointer focus).
- **Events:** emits `input` and `change` with `{ value }`.
