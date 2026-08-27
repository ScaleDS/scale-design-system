---
tag: sc-section-content
class: ScSectionContent
category: sections
import: @scale-ds/scale-design-system/components/sc-section-content
props:
  align: { type: enum, default: center, values: [center, left] }
slots: [heading, subtext]
cssProperties: [--sc-section-content-padding-top, --sc-section-content-padding-bottom]
useInstead: [sc-section-feature, sc-section-signup]
source:
  guidance: guidance/sections/content.html
  docs: "https://scaledesignsystem.com/sections/content/"
---

# sc-section-content

A simple heading + subtext block, centered or left-aligned.

## When to use

text-only sections, section headers, and standalone content blocks between richer sections.

## When not to use

- Don’t pour long-form copy into `subtext` — for fuller layouts use `sc-section-feature`.
- Don’t put actions in it — pair it with a section that has them, or use `sc-section-signup` for a CTA.

## Do

- Use it to introduce or break up richer sections with a heading and a line or two of subtext.
- Keep one alignment per page — mixing centered and left-aligned blocks reads as accidental.
- Slot real heading elements so the block joins the page outline.

## Don't

- Don’t pour long-form copy into `subtext` — for fuller layouts use `sc-section-feature`.
- Don’t stack several in a row to fake an article layout.
- Don’t put actions in it — pair it with a section that has them, or use `sc-section-signup` for a CTA.

## Accessibility

- **Headings:** the section imposes no heading level — slot the `h2`/`h3` that fits the page outline into `heading`.
- **Structure:** purely presentational (no roles or landmarks added) — the slotted elements carry all semantics.
- **Alignment:** `align` only changes `text-align`; reading order is unaffected.
