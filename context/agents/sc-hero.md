---
tag: sc-hero
class: ScHero
category: sections
import: @scale-ds/scale-design-system/components/sc-hero
dependencies: [sc-badge, sc-button, sc-input]
props:
  badge: { type: string, default: "" }
  primaryLabel: { type: string, default: "", attr: primary-label }
  primaryHref: { type: string, default: "", attr: primary-href }
  primaryLeadingIcon: { type: string, default: "", attr: primary-leading-icon }
  secondaryLabel: { type: string, default: "", attr: secondary-label }
  secondaryHref: { type: string, default: "", attr: secondary-href }
  secondaryLeadingIcon: { type: string, default: "", attr: secondary-leading-icon }
  imageSrc: { type: string, default: "", attr: image-src }
  imageSrcDark: { type: string, default: "", attr: image-src-dark }
  imageAlt: { type: string, default: "", attr: image-alt }
  showForm: { type: boolean, default: false, attr: show-form }
  formPlaceholder: { type: string, default: "Enter your email", attr: form-placeholder }
  formButtonLabel: { type: string, default: Subscribe, attr: form-button-label }
slots: [heading, subtext, default]
useInstead: [sc-section-feature]
source:
  guidance: guidance/sections/hero.html
  docs: "https://scaledesignsystem.com/sections/hero/"
---

# sc-hero

The first thing visitors see — a bold, full-width section that sets the tone with a message and a call to action. Supports a version `badge`, a themed background image, CTA buttons, and an optional email capture form (`show-form`).

## When to use

the top section of a landing page, product introductions, and conversion-focused entry points. Slot a `heading` and `subtext`; set the CTAs via `primary-*` / `secondary-*`.

## When not to use

- Don’t use a hero mid-page for feature highlights — that’s `sc-section-feature`.

## Do

- Lead with one clear value statement in `heading` — a line, not a paragraph.
- Use one hero per page, at the very top.
- Provide both `image-src` and `image-src-dark` when using a background image so it matches the theme.

## Don't

- Don’t combine the CTA buttons and the email form — pick one conversion goal.
- Don’t put body copy in `subtext`; details belong in the sections below.
- Don’t use a hero mid-page for feature highlights — that’s `sc-section-feature`.

## Accessibility

- **Headings:** the hero imposes no heading level — on a landing page, slot the page’s `h1` into `heading`.
- **CTAs:** `primary-href` / `secondary-href` render real link-buttons (note: they open in a new tab via `target="_blank"`).
- **Image:** the background image takes `image-alt` — pass an empty value if it’s purely atmospheric, and mind text contrast over it (a gradient overlay is built in).
- **Form:** `show-form` renders a labelled email `sc-input` plus a submit `sc-button`.
