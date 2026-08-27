---
tag: sc-section-feature
class: ScSectionFeature
category: sections
import: @scale-ds/scale-design-system/components/sc-section-feature
props:
  imageSrc: { type: string, default: "", attr: image-src }
  imageSrcDark: { type: string, default: "", attr: image-src-dark }
  imageAlt: { type: string, default: "", attr: image-alt }
  reverse: { type: boolean, default: false }
slots: [heading, subtext, actions]
useInstead: [sc-section-bento]
source:
  guidance: guidance/sections/feature.html
  docs: "https://scaledesignsystem.com/sections/feature/"
---

# sc-section-feature

A split feature section — a text column (heading, subtext, optional `actions`) beside an image column that swaps to `image-src-dark` in dark mode.

## When to use

feature highlights and product walkthroughs. Alternate `reverse` down a page for a rhythmic text/image cadence.

## When not to use

- Don’t use it for a grid of small features — that’s `sc-section-bento`.

## Do

- Alternate `reverse` on consecutive features so text and image zig-zag down the page.
- Provide both `image-src` and `image-src-dark` so the image matches the theme.
- Keep the subtext to a sentence or two — one benefit per feature.

## Don't

- Don’t crowd the `actions` slot — one primary CTA at most per feature.
- Don’t use it for a grid of small features — that’s `sc-section-bento`.
- Don’t put text inside the image; keep copy in the text column where it scales and translates.

## Accessibility

- **Image:** always set `image-alt` — or pass an empty value if the image is purely decorative.
- **Headings:** the section imposes no heading level — slot the `h2`/`h3` that fits the page outline into `heading`.
- **Order:** `reverse` swaps the rendered column order, so visual and reading order stay in sync.
- **Theme:** the dark-mode image swap is automatic via the theme controller; both images need the same `image-alt` meaning.
