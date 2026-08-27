---
tag: sc-tooltip
class: ScTooltip
category: feedback
import: @scale-ds/scale-design-system/components/sc-tooltip
props:
  content: { type: string, default: "" }
  placement: { type: enum, default: top, values: [top, bottom, left, right] }
  disabled: { type: boolean, default: false }
  open: { type: boolean, default: false }
  withoutArrow: { type: boolean, default: false, attr: without-arrow }
  distance: { type: number, default: 8 }
  showDelay: { type: number, default: 150, attr: show-delay }
  hideDelay: { type: number, default: 0, attr: hide-delay }
  trigger: { type: string, default: "hover focus" }
slots: [default, content]
events: [show, hide]
cssParts: [popup, body, arrow]
cssProperties: [--sc-tooltip-max-width]
roles: [tooltip]
source:
  guidance: guidance/components/tooltip.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-tooltip.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=5929-18392"
  framer: "https://scaleframer.framer.website/components/tooltip"
  docs: "https://scaledesignsystem.com/components/tooltip/"
---

# sc-tooltip

Small floating labels that appear on hover or focus to give a little extra context about an element.

## When to use

short, text-only hints for an icon or control. Keep content text-only — never put interactive elements inside. The tip is `position:fixed` so it escapes `overflow:hidden` ancestors and flips on collision.

## Do

- Keep content to a short, plain-text phrase — a label or one-line hint.
- Put tooltips on focusable triggers so keyboard users get them too.
- Use one to name an icon-only control (e.g. a `sc-button-icon`).

## Don't

- Don’t put links, buttons, or form fields inside — the tip is not part of the focus order.
- Don’t hide essential information in a tooltip; it must be discoverable without one.
- Don’t tooltip disabled elements — they don’t receive hover or focus.

## Examples

### Placement

Hover or focus a trigger. `placement` is `top` (default), `bottom`, `left`, or `right`.

```html
<div style="display:flex;gap:var(--sc-space-l);flex-wrap:wrap">
  <sc-tooltip content="Tooltip on top" placement="top"><sc-button size="s">Top</sc-button></sc-tooltip>
  <sc-tooltip content="Tooltip on bottom" placement="bottom"><sc-button size="s">Bottom</sc-button></sc-tooltip>
  <sc-tooltip content="Tooltip on left" placement="left"><sc-button size="s">Left</sc-button></sc-tooltip>
  <sc-tooltip content="Tooltip on right" placement="right"><sc-button size="s">Right</sc-button></sc-tooltip>
</div>
```

### Triggers

Works on any focusable trigger. `trigger="click"` toggles on click instead of hover.

```html
<div style="display:flex;gap:var(--sc-space-l);flex-wrap:wrap;align-items:center">
  <sc-tooltip content="Saved to your workspace"><sc-button size="s">Hover or focus</sc-button></sc-tooltip>
  <sc-tooltip content="A reusable design token"><span tabindex="0" style="text-decoration:underline dotted;cursor:help">tokens</span></sc-tooltip>
  <sc-tooltip content="More information"><sc-button-icon icon="info" label="Info" size="s"></sc-button-icon></sc-tooltip>
  <sc-tooltip content="Toggled by click" trigger="click"><sc-button size="s">Click me</sc-button></sc-tooltip>
</div>
```

### Options

`without-arrow` hides the arrow; `disabled` keeps the tip from ever opening.

```html
<div style="display:flex;gap:var(--sc-space-l);flex-wrap:wrap">
  <sc-tooltip content="No arrow here" without-arrow><sc-button size="s">No arrow</sc-button></sc-tooltip>
  <sc-tooltip content="You will never see this" disabled><sc-button size="s">Disabled tooltip</sc-button></sc-tooltip>
</div>
```

## Accessibility

- **Role:** the tip carries `role="tooltip"` and a unique id; the first focusable slotted trigger gets `aria-describedby` pointing at it, so screen readers announce the hint with the trigger.
- **Keyboard:** shows on keyboard focus as well as pointer hover; `Esc` dismisses while open.
- **Content:** text-only — interactive elements inside are unreachable since the tip never takes focus.
- **Pointer:** the tip is `pointer-events:none`, so it never steals hover from the trigger.
