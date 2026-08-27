---
tag: sc-logo
class: ScLogo
category: brand
import: @scale-ds/scale-design-system/components/sc-logo
props:
  size: { type: enum, default: l, values: [l, m, s] }
  logoStyle: { type: enum, default: default, attr: logo-style, values: [default, inverse] }
  hideText: { type: boolean, default: false, attr: hide-text }
cssProperties: [--sc-logo-mark-size]
source:
  guidance: guidance/components/logo.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-logo.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=445-677"
  framer: available
  docs: "https://scaledesignsystem.com/components/logo/"
---

# sc-logo

The Scale brand logo — mark plus wordmark — across three sizes, with a mark-only option and an inverse style for dark or coloured surfaces.

## When to use

headers, footers, and brand references. Built into `sc-header` and `sc-footer`.

## Do

- Use the inverse style on dark or brand-coloured backgrounds for contrast.
- Drop to `hide-text` only when space genuinely can’t fit the wordmark.
- Give the logo clear space — don’t crowd it with other elements.

## Don't

- Don’t recolour or restyle the mark beyond the provided variants.
- Don’t stretch or distort it — scale with `size` or the mark-size var.
- Don’t place the default style on a low-contrast background.

## Examples

### Sizes

Three sizes — `l` (default), `m`, and `s`.

```html
<div style="display:flex;align-items:center;gap:var(--sc-space-xl);flex-wrap:wrap">
  <sc-logo size="l"></sc-logo>
  <sc-logo size="m"></sc-logo>
  <sc-logo size="s"></sc-logo>
</div>
```

### Mark only

`hide-text` drops the wordmark for tight spaces like a collapsed header.

```html
<sc-logo size="m" hide-text></sc-logo>
```

### Inverse

`logo-style="inverse"` flips the wordmark for use on a coloured or dark surface.

```html
<div style="background:var(--sc-color-brand-500);padding:var(--sc-space-xl);border-radius:var(--sc-border-radius-s)">
  <sc-logo size="m" logo-style="inverse"></sc-logo>
</div>
```

### Custom mark size

Override `--sc-logo-mark-size` to tune the mark independently of the named sizes.

```html
<sc-logo size="m" hide-text style="--sc-logo-mark-size:64px"></sc-logo>
```

## Accessibility

- **Accessible name:** the SVG has no built-in label — when the logo links home, give the link an accessible name (e.g. `aria-label="Scale home"`).
- **Decorative use:** if the brand is already named in adjacent text, the logo is decorative and needs no extra label.
- **Contrast:** pick the variant that meets WCAG AA against its background — inverse for dark, default for light.
- **Scaling:** the mark and wordmark are vector SVG, so they stay crisp at any size.
