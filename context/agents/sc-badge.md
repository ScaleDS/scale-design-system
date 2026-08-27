---
tag: sc-badge
class: ScBadge
category: feedback
import: @scale-ds/scale-design-system/components/sc-badge
props:
  status: { type: enum, default: default, values: [default, info, warning, negative, positive, mono, disabled] }
  icon: { type: string, default: "" }
slots: [default]
useInstead: [sc-button, sc-tag]
source:
  guidance: guidance/components/badge.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-badge.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=1673-3961"
  framer: "https://scaleframer.framer.website/components/badge"
  docs: "https://scaledesignsystem.com/components/badge/"
---

# sc-badge

Status indicators that show notifications, or state on top of another element.

## When to use

status labels, category tags, notification counts, and feature flags.

## When not to use

- Don’t use a badge for an interactive action — use a `sc-button` or `sc-tag`.

## Do

- Keep labels to one or two words.
- Match the status colour to its meaning — positive for success, negative for errors.
- Always pair the colour with a clear text label.

## Don't

- Don’t use a badge for an interactive action — use a `sc-button` or `sc-tag`.
- Don’t rely on colour alone to carry the meaning.
- Don’t crowd a view with many competing badges.

## Examples

### Status

Seven statuses set the badge colour to match its meaning.

```html
<sc-badge status="default">Default</sc-badge>
<sc-badge status="info">Info</sc-badge>
<sc-badge status="warning">Warning</sc-badge>
<sc-badge status="negative">Negative</sc-badge>
<sc-badge status="positive">Positive</sc-badge>
<sc-badge status="mono">Mono</sc-badge>
<sc-badge status="disabled">Disabled</sc-badge>
```

### With icons

An `icon` reinforces the status at a glance.

```html
<sc-badge status="info" icon="info">Info</sc-badge>
<sc-badge status="positive" icon="check-circle">Success</sc-badge>
<sc-badge status="warning" icon="alert-triangle">Warning</sc-badge>
```

## Accessibility

- **Text-led:** the badge is a static inline label, so its meaning comes from the slotted text — colour is never the only signal.
- **Icon:** the optional `icon` is decorative and reinforces the label rather than replacing it.
- **Not focusable:** a badge is not interactive; if it labels another element, place it where its text reads in a sensible order.
