---
foundation: border
title: Border
source:
  guidance: guidance/foundations/border.html
  tokens: context/tokens.json
  docs: "https://scaledesignsystem.com/foundations/border/"
---

# Border

Borders combine flexible radius values and standardized widths to create consistent, accessible interfaces. They define visual boundaries, create hierarchy, and communicate interactive states. Build with the named tokens (`--sc-border-radius-*`, `--sc-border-width-*`) rather than raw values so edges stay crisp and consistent at every density.

## Border radius

Corner-radius values create visual cohesion and communicate brand personality through corner rounding. Match the radius to the element's scale: small controls take small radii, large surfaces like cards and modals take larger ones.

## Border width

Border-width values provide precise control over visual weight and hierarchy. Keeping widths on a small fixed scale keeps edges crisp and consistent at every density.

## Do

- Maintain a consistent radius within a component; all corners share the same value unless intentionally asymmetric.
- Scale radius proportionally, because larger elements can carry larger radii.
- Use appropriate widths for states: focus states should be more prominent (2–4px) than default borders (1px).
- Consider nested hierarchy: inner elements should have a smaller radius than their containers.
- Test borders in both light and dark modes to verify visual quality.

## Don't

- Don’t mix radius values randomly; establish a consistent scale and stick to it.
- Don’t use excessive border widths. Anything thicker than 4px should be rare and intentional.
- Don’t apply different radii to different corners unless intentional; asymmetry feels broken.
- Don’t ignore the container/content relationship: rounded images in square containers look awkward.

## Accessibility

- **Focus indicators:** keyboard navigation needs a clearly visible focus state. Use a border width of L (2px) or XL (4px), and never remove the outline without providing an alternative.
- **Touch targets:** borders count toward target size. Keep interactive targets at least 44×44px including the border, and factor border width into spacing.
- **Radius & legibility:** rounded corners aid scannability, but extreme radii (>24px) can crowd text in small containers. Keep enough padding between content and rounded edges.

The full token set for this foundation is in `context/tokens.json`.
