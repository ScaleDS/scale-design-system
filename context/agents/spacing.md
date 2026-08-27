---
foundation: spacing
title: Spacing
source:
  guidance: guidance/foundations/spacing.html
  tokens: context/tokens.json
  docs: "https://scaledesignsystem.com/foundations/spacing/"
---

# Spacing

A mathematical spacing system built on an 8px base unit, with a 2px half-step for precision adjustments. This systematic approach creates consistent, predictable layouts that scale gracefully across every screen size and platform. Build with the named steps (`--sc-space-s`, `-m`, `-l`…) rather than raw pixels so spacing stays proportional and consistent across the system.

## Scale

Built on an 8px base unit with a 2px half-step for precision adjustments.

## Do

- Use the spacing scale exclusively, never arbitrary values like 15px, 22px, or 35px.
- Think in multiples of 8: estimate in 8s before reaching for a calculator (“that needs about 3× spacing = 24px”).
- Apply the internal ≤ external rule: padding inside a component should be less than the margins between components.
- Reserve 2XS (2px) for optical adjustments, not standard spacing.
- Create rhythm with repetition: use the same value for similar relationships (e.g. all form field gaps = M).
- Let white space breathe; larger spacing values improve comprehension.

## Don't

- Don’t use values off the scale: no 10px, 18px, 25px, or 30px.
- Don’t mix arbitrary and system values; L (16px) beside a random 14px margin creates visual discord.
- Don’t ignore optical adjustments; when visual balance needs a slight deviation, that’s what 2XS is for.
- Don’t over-complicate a component with more than 5–7 spacing values.
- Don’t forget responsive adjustments; spacing often needs to reduce on smaller screens.
- Don’t use large spacing on small components; a tiny badge with XL (24px) padding looks absurd.

## Accessibility

- **Touch targets:** keep interactive elements at least 44×44px (iOS) or 48×48px (Android) by combining content size with appropriate padding.
- **Reading comfort:** hold line length to 60–90 characters and use L to XL (16–24px) between paragraphs; large text blocks need more surrounding white space.
- **Cognitive load:** consistent, predictable spacing is easier to scan, helps users find information faster, and clarifies hierarchy for navigation.

The full token set for this foundation is in `context/tokens.json`.
