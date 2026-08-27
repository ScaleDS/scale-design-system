---
tag: sc-section-faq
class: ScSectionFaq
category: sections
import: @scale-ds/scale-design-system/components/sc-section-faq
dependencies: [sc-accordion]
slots: [heading, subtext, default]
cssProperties: [--sc-section-faq-padding-y]
source:
  guidance: guidance/sections/faq.html
  docs: "https://scaledesignsystem.com/sections/faq/"
---

# sc-section-faq

Accordion-based answers to common questions, making it easy for users to find what they're looking for — a heading/subtext column beside a stack of slotted `sc-accordion`.

## When to use

FAQ pages, help sections, and common questions about a product or feature.

## Do

- Write question-style accordion headings in the user’s words (“Is dark mode included?”).
- Order questions by how often they’re asked — most common first.
- Keep answers short and self-contained; link out for depth.

## Don't

- Don’t bury essential information (pricing, requirements) in an FAQ — put it on the page proper.
- Don’t open several items by default; at most one, to show the pattern.
- Don’t let the list sprawl — past a dozen questions, group or split the page.

## Accessibility

- **Headings:** the section imposes no heading level — slot the `h2`/`h3` that fits the page outline into `heading`.
- **Accordions:** keyboard and screen-reader behaviour comes from the slotted `sc-accordion` items — see that page for the toggle semantics.
- **Structure:** the section itself is presentational; reading and tab order follow the slotted question order.
