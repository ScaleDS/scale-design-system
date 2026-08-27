---
tag: sc-text-area
class: ScTextArea
category: forms
import: @scale-ds/scale-design-system/components/sc-text-area
dependencies: [sc-help-text]
props:
  state: { type: enum, default: default, values: [default, negative, positive, disabled] }
  label: { type: string, default: Label }
  placeholder: { type: string, default: Text }
  value: { type: string, default: "" }
  helpText: { type: string, default: "Help text", attr: help-text }
  showLabel: { type: boolean, default: true, attr: show-label }
  showHelpText: { type: boolean, default: true, attr: show-help-text }
  rows: { type: number, default: 3 }
  resize: { type: enum, default: vertical, values: [vertical, none, both, horizontal] }
  name: { type: string, default: "" }
  autocomplete: { type: string, default: "" }
  maxlength: { type: number }
  minlength: { type: number }
  required: { type: boolean, default: false }
events: [input, change]
cssParts: [textarea]
formAssociated: true
useInstead: [sc-input]
source:
  guidance: guidance/components/text-area.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-text-area.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=9709-93287"
  framer: "https://scaleframer.framer.website/components/form"
  docs: "https://scaledesignsystem.com/components/text-area/"
---

# sc-text-area

A multi-line text field for longer-form input — the resizable counterpart to `sc-input`, with the same label / help-text / state API and form association.

## When to use

messages, comments, and descriptions — any free-text input that may span multiple lines. For single-line entry, use an `sc-input`.

## When not to use

- Don’t use a text area for single-line input — use an `sc-input`.

## Do

- Size `rows` to the expected length of input.
- Use `maxlength` and show a count when there’s a limit.
- Explain errors in `help-text` with `state="negative"`.

## Don't

- Don’t use a text area for single-line input — use an `sc-input`.
- Don’t disable resize without a good reason; users may need more room.
- Don’t hide the label without giving the field an accessible name.

## Examples

### Default

```html
<sc-text-area label="Message" placeholder="Write a message…" help-text="Help text" style="max-width:370px"></sc-text-area>
```

### Filled

```html
<sc-text-area label="Message" value="The quick brown fox jumps over the lazy dog." help-text="Help text" style="max-width:370px"></sc-text-area>
```

### Negative

```html
<sc-text-area label="Message" value="Too short" state="negative" help-text="Please enter at least 20 characters." style="max-width:370px"></sc-text-area>
```

### Positive

```html
<sc-text-area label="Message" value="Looks good to me!" state="positive" help-text="Looks good." style="max-width:370px"></sc-text-area>
```

### Disabled

```html
<sc-text-area label="Message" value="Cannot edit this." state="disabled" help-text="Help text" style="max-width:370px"></sc-text-area>
```

### Taller (rows=6)

`rows` sets the initial height.

```html
<sc-text-area label="Description" placeholder="Describe your issue…" rows="6" show-help-text="false" style="max-width:370px"></sc-text-area>
```

### No resize

`resize="none"` removes the drag handle (also `both` / `horizontal`).

```html
<sc-text-area label="Comment" placeholder="No resize handle" resize="none" show-help-text="false" style="max-width:370px"></sc-text-area>
```

### No label

`show-label="false"` hides the visible label — provide an accessible name another way.

```html
<sc-text-area label="Notes" show-label="false" placeholder="Label hidden" show-help-text="false" style="max-width:370px"></sc-text-area>
```

## Accessibility

- **Label:** the `label` is wired to the textarea via `aria-labelledby`; if you hide it with `show-label="false"`, supply a name another way.
- **Form:** form-associated — `required` sets `valueMissing` validity, and `maxlength`/`minlength` apply natively; it participates in submit/reset.
- **Errors:** `state="negative"` styles the field and its `sc-help-text` — keep a message so the error isn’t colour-only.
- **Focus:** shows a keyboard-only focus ring (suppressed for pointer focus).
- **Events:** emits `input` and `change` with `{ value }`.
