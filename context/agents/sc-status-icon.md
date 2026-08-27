---
tag: sc-status-icon
class: ScStatusIcon
category: feedback
import: @scale-ds/scale-design-system/components/sc-status-icon
props:
  status: { type: enum, default: info, values: [info, warning, error, success] }
  size: { type: number, default: 24 }
  inverse: { type: boolean, default: false }
source:
  guidance: guidance/components/status-icon.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-status-icon.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=48-1153"
  framer: "https://scaleframer.framer.website/foundations/iconography"
  docs: "https://scaledesignsystem.com/components/status-icon/"
---

# sc-status-icon

An informational status icon — info, warning, error, and success — in three sizes, with an inverse variant for status-coloured surfaces.

## When to use

validation feedback, alert icons, and help-text icons. For a minimal coloured dot, use a `sc-status-indicator`.

## Do

- Pair the icon with text that states the same meaning.
- Match `status` to severity — error for blocking, warning for caution.
- Use `inverse` on status-coloured backgrounds so the icon stays legible.

## Don't

- Don’t rely on the icon alone to convey state — colour and shape aren’t enough on their own.
- Don’t use a status icon as a decorative bullet.
- Don’t mix statuses that contradict the surrounding message.

## Examples

### Status

Four statuses — `info`, `warning`, `error`, and `success`.

```html
<sc-status-icon status="info"></sc-status-icon>
<sc-status-icon status="warning"></sc-status-icon>
<sc-status-icon status="error"></sc-status-icon>
<sc-status-icon status="success"></sc-status-icon>
```

### Sizes

`size` accepts `16`, `24` (default), or `32`.

```html
<sc-status-icon status="info" size="16"></sc-status-icon>
<sc-status-icon status="info" size="24"></sc-status-icon>
<sc-status-icon status="info" size="32"></sc-status-icon>
```

### Inverse

`inverse` swaps the disc and glyph colours so the icon reads on a status-coloured surface (as in `sc-toast`).

```html
<div style="display:inline-flex;gap:var(--sc-space-m);padding:var(--sc-space-l);background:var(--sc-color-icon-positive);border-radius:var(--sc-border-radius-m)">
  <sc-status-icon status="success" inverse></sc-status-icon>
</div>
```

## Accessibility

- **Decorative by default:** the icon is a presentational SVG with no accessible name — the adjacent text must carry the status meaning.
- **Standalone use:** if the icon is the only indicator, give its container an accessible name (e.g. `role="img" aria-label="Error"`).
- **Not colour-only:** each status also differs in glyph (i, !, ✕, ✓), but still back it with text for clarity.
- **Contrast:** on a custom background, use `inverse` or check the disc colour meets WCAG AA.
