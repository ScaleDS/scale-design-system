---
tag: sc-section-pricing
class: ScSectionPricing
category: sections
import: @scale-ds/scale-design-system/components/sc-section-pricing
slots: [heading, subtext, card-1, card-2, card-3]
useInstead: [sc-table-dynamic, sc-row]
source:
  guidance: guidance/sections/pricing.html
  docs: "https://scaledesignsystem.com/sections/pricing/"
---

# sc-section-pricing

Side-by-side plan comparison with feature lists and action buttons, making the buying decision easier — a centred heading/subtext above three `sc-card-pricing` slots in a responsive grid.

## When to use

pricing pages, plan comparison, and subscription tiers. Slot a pricing card into each of `card-1`…`card-3`.

## When not to use

- Don’t exceed the three card slots — more tiers belong in a comparison `sc-table-dynamic`.
- Don’t hide caveats (currency, renewal terms) — a plain `sc-row` without an icon works for fine print.

## Do

- Keep the feature rows parallel across cards so plans compare line by line.
- Highlight one recommended plan — e.g. an `info` badge like “Best value”.
- State the price plainly in `plan` and what it’s for in `description`.

## Don't

- Don’t exceed the three card slots — more tiers belong in a comparison `sc-table-dynamic`.
- Don’t make every card’s CTA shout — emphasise the recommended plan’s button.
- Don’t hide caveats (currency, renewal terms) — a plain `sc-row` without an icon works for fine print.

## Accessibility

- **Headings:** the section imposes no heading level — slot the `h2`/`h3` that fits the page outline into `heading`.
- **Structure:** purely presentational — semantics come from the slotted `sc-card-pricing` cards and their content.
- **Order:** reading and tab order follow the slot order (`card-1`→`card-3`), on desktop and when the grid stacks on mobile.
- **Meaning:** don’t convey “included” by icon alone — the check rows keep their text labels.
