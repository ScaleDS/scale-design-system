---
tag: sc-card-image
class: ScCardImage
category: content
import: @scale-ds/scale-design-system/components/sc-card-image
props:
  variant: { type: enum, default: default, values: [default, fill] }
  imageSrc: { type: string, default: "", attr: image-src }
  imageSrcDark: { type: string, default: "", attr: image-src-dark }
  imageAlt: { type: string, default: "", attr: image-alt }
slots: [heading, description, default]
cssProperties: [--sc-card-object-fit, --sc-card-object-position]
useInstead: [sc-card]
source:
  guidance: guidance/components/card-image.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-card-image.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=4283-5763"
  framer: available
  docs: "https://scaledesignsystem.com/components/card-image/"
---

# sc-card-image

A card surface with a dedicated image area plus `heading` and `description` slots. Ships light and dark image sources that switch with the theme.

## When to use

feature cards, blog-post previews, and product showcases — any content pairing an image with text, often laid out in a bento grid. For a plain surface, use `sc-card`.

## When not to use

- Don’t use it for plain grouped content — reach for `sc-card`.

## Do

- Put a real heading element in the `heading` slot so the card joins the document outline.
- Supply both `image-src` and `image-src-dark` so artwork reads in either theme.
- Keep peer cards the same height — use the `fill` variant with a fixed height in a grid.

## Don't

- Don’t overlay text on a busy `fill` image without enough contrast.
- Don’t leave `image-alt` empty when the image carries meaning.
- Don’t use it for plain grouped content — reach for `sc-card`.

## Examples

### Default variant

Image on top, text below. Provide `image-src` and `image-src-dark` so the artwork tracks the active theme.

```html
<sc-card-image
  variant="default"
  image-src="/images/framer/sc-image-framer-bento-components-light.png"
  image-src-dark="/images/framer/sc-image-framer-bento-components-dark.png"
  image-alt="Components" style="max-width:400px">
  <h4 slot="heading">Component Library</h4>
  <p slot="description">Drag and drop components with endless combinations.</p>
</sc-card-image>
```

### Fill variant

The image fills the card and text sits above it — set a fixed `height` for a consistent tile.

```html
<sc-card-image
  variant="fill"
  image-src="/images/framer/sc-image-framer-bento-variables-light.png"
  image-src-dark="/images/framer/sc-image-framer-bento-variables-dark.png"
  image-alt="Variables" style="max-width:400px;height:400px">
  <h4 slot="heading">120 Styles & Variables</h4>
  <p slot="description">Semantic color and type styles.</p>
</sc-card-image>
```

## Accessibility

- **Heading:** the `heading` slot should hold a real `<h2>`–`<h4>` at the right level for the page outline.
- **Image alt:** `image-alt` sets the `<img>` alt — describe meaningful images, use `""` for purely decorative ones.
- **Theme:** the component swaps to `image-src-dark` in dark mode; make sure both sources convey the same information.
- **Contrast:** in the `fill` variant, text sits over the image — keep it WCAG AA legible across both image sources.
- **Interactivity:** Card Image is a static surface — place a focusable `sc-button` or link inside rather than making the whole card clickable.
