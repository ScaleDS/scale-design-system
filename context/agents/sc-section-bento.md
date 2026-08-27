---
tag: sc-section-bento
class: ScSectionBento
category: sections
import: @scale-ds/scale-design-system/components/sc-section-bento
slots: [heading, subtext, card-1, card-2, card-3, card-4]
cssProperties: [--sc-section-bento-padding-top]
useInstead: [sc-section-feature, sc-card]
source:
  guidance: guidance/sections/bento.html
  docs: "https://scaledesignsystem.com/sections/bento/"
---

# sc-section-bento

A bento grid with four `sc-card-image` slots arranged in a Z-pattern — row one spans 3 + 2 columns, row two flips to 2 + 3. Optional `heading` and `subtext` slots sit centred above the grid.

## When to use

feature showcases, product highlights, and visual grid layouts. Slot a fill-variant card into each of `card-1`…`card-4`.

## When not to use

- Don’t use it for fewer than four items — use `sc-section-feature` or a row of `sc-card` instead.

## Do

- Fill all four card slots — the Z-pattern reads as broken with gaps.
- Use `variant="fill"` cards so each one stretches to its cell.
- Keep card headings parallel in length and structure — the grid invites comparison.

## Don't

- Don’t rely on the wide-vs-narrow cells to signal importance — the layout collapses to a single column on mobile.
- Don’t slot long-form content into the cards; this is a showcase, not a reading surface.
- Don’t use it for fewer than four items — use `sc-section-feature` or a row of `sc-card` instead.

## Examples

### Four cards

```html
<sc-section-bento>
  <sc-card-image slot="card-1" variant="fill"
    image-src="/images/framer/sc-image-framer-bento-components-light.png"
    image-src-dark="/images/framer/sc-image-framer-bento-components-dark.png"
    image-alt="Components">
    <h4 slot="heading">56 Components</h4>
    <p slot="description">Thousands of combinations.</p>
  </sc-card-image>
  <sc-card-image slot="card-2" variant="fill"
    image-src="/images/framer/sc-image-framer-bento-variables-light.png"
    image-src-dark="/images/framer/sc-image-framer-bento-variables-dark.png"
    image-alt="Variables">
    <h4 slot="heading">120 Styles</h4>
    <p slot="description">Semantic color and type.</p>
  </sc-card-image>
  <sc-card-image slot="card-3" variant="fill"
    image-src="/images/framer/sc-image-framer-bento-icons-light.png"
    image-src-dark="/images/framer/sc-image-framer-bento-icons-dark.png"
    image-alt="Icons">
    <h4 slot="heading">288 Icons</h4>
    <p slot="description">Feather + status icons.</p>
  </sc-card-image>
  <sc-card-image slot="card-4" variant="fill"
    image-src="/images/framer/sc-image-framer-bento-sections-light.png"
    image-src-dark="/images/framer/sc-image-framer-bento-sections-dark.png"
    image-alt="Modules">
    <h4 slot="heading">15 Modules</h4>
    <p slot="description">Hero, Pricing, FAQ and more.</p>
  </sc-card-image>
</sc-section-bento>
```

## Accessibility

- **Headings:** the section imposes no heading levels — slot a heading that fits the page outline (e.g. `h2` in the `heading` slot, `h3`/`h4` in the cards).
- **Images:** give every slotted `sc-card-image` an `image-alt`; the section adds no text alternatives itself.
- **Order:** reading and tab order follow slot order (`card-1`→`card-4`), matching the visual Z-pattern on desktop and the stacked order on mobile.
- **Responsive:** the grid reflows (5-column Z-pattern → single column ≤ 402px) without content changes.
