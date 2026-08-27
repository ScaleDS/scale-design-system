---
tag: sc-help-text
class: ScHelpText
category: feedback
import: @scale-ds/scale-design-system/components/sc-help-text
dependencies: [sc-status-icon]
props:
  status: { type: enum, default: default, values: [default, info, warning, negative, positive, disabled] }
  size: { type: enum, default: l, values: [l, m, s] }
  text: { type: string, default: "Help text" }
source:
  guidance: guidance/components/help-text.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-help-text.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=31938-27580"
  framer: "https://scaleframer.framer.website/components/help-text"
  docs: "https://scaledesignsystem.com/components/help-text/"
---

# sc-help-text

Small instructional copy near a form field that guides users on what to enter or what went wrong. Status variants pair the message with a `sc-status-icon`.

## When to use

field hints, validation messages, and success feedback. Most inputs accept a `help-text` prop that renders this component for you.

## Do

- Keep it short and specific — say what to enter or exactly what’s wrong.
- Use `negative` for errors and `positive` for confirmation.
- Place it directly below the field it describes.

## Don't

- Don’t restate the label — add information the label doesn’t already give.
- Don’t stack several help texts on one field; lead with the most important.
- Don’t rely on colour alone — the wording must carry the meaning.

## Examples

### Default

Plain hint copy with no icon.

```html
<sc-help-text text="This is default help text."></sc-help-text>
```

### Info

```html
<sc-help-text status="info" text="This field requires verification."></sc-help-text>
```

### Warning

```html
<sc-help-text status="warning" text="This action cannot be undone."></sc-help-text>
```

### Negative

```html
<sc-help-text status="negative" text="Invalid email address."></sc-help-text>
```

### Positive

```html
<sc-help-text status="positive" text="Username is available."></sc-help-text>
```

### Sizes

Three sizes — `l` (default), `m`, and `s` — to match the field they describe.

```html
<div style="display:flex;flex-direction:column;gap:var(--sc-space-m)">
  <sc-help-text size="l" status="info" text="Large help text"></sc-help-text>
  <sc-help-text size="m" status="info" text="Medium help text"></sc-help-text>
  <sc-help-text size="s" status="info" text="Small help text"></sc-help-text>
</div>
```

## Accessibility

- **Association:** reference it from the field with `aria-describedby` so screen readers announce it with the input (the `help-text` prop on inputs wires this for you).
- **Errors:** for `negative` messages, also expose the field’s invalid state (`aria-invalid`) and announce the text via a live region when it appears.
- **Icon:** the status icon is decorative reinforcement — the message text must stand on its own without colour or icon.
- **Contrast:** the secondary text colour must meet WCAG AA; `disabled` is intentionally dimmed, so don’t use it to convey active meaning.
