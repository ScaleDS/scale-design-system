---
foundation: material
title: Material
source:
  guidance: guidance/foundations/material.html
  tokens: context/tokens.json
  docs: "https://scaledesignsystem.com/foundations/material/"
---

# Material

Materials are translucent surfaces that blur and tint whatever sits behind them, so foreground UI stays legible while the content underneath shows through. Scale ships five levels, from barely-there to nearly opaque: **Ultra Thin**, **Thin**, **Regular**, **Thick**, and **Chrome**.

## How it works

A material paints two layers over a backdrop blur: a Fill - FX layer (a blended highlight that lifts the underlying colour) beneath a Fill layer (the tint that sets opacity). The blur radius is constant; the levels differ only in how opaque the fill is: Ultra Thin lets the most colour through, Chrome the least.

## Levels

Each level pairs a `-fill` token with a `-fill-fx` token, applied through its mixin. Match the level to how much the content below should remain visible, using the usage guidance. The preview shows the real material over a busy backdrop in the active theme.

## Do

- Use materials over content that should stay partly visible: floating panels, navigation, and overlays.
- Pick the level by how much the background should show through: Ultra Thin reveals most, Chrome least.
- Reserve Chrome for persistent framing UI (toolbars, headers); use Regular for the typical floating panel.
- Apply materials through their mixin so the two fill layers and blend modes stay correct.
- Test in both themes: the fills invert between light and dark, and legibility can change with them.

## Don't

- Don’t place a material over a flat, solid background; with nothing to blur it just looks like a faint tint.
- Don’t stack materials on materials; the compounded blur muddies both and tanks performance.
- Don’t hand-roll the fills with raw `rgba()` values; use the tokens so themes stay in sync.
- Don’t put long-form reading content on a thin material; reach for a solid surface when legibility matters more than depth.
- Don’t rely on the blur for meaning: it’s decoration, not a substitute for hierarchy or labelling.

## Accessibility

- **Contrast:** text and icons on a material must meet WCAG 2.1 AA against the worst-case backdrop that can scroll behind it: 4.5:1 for body text, 3:1 for large text and UI.
- **Reduced transparency:** honour `prefers-reduced-transparency` (and the platform “Reduce Transparency” setting) by falling back to a solid surface token.
- **Fallback:** where `backdrop-filter` is unsupported the fill still renders, but verify the un-blurred result stays legible.
- **Motion:** content moving behind a translucent surface can distract; keep critical text on calmer or more opaque levels (Thick, Chrome).
- **Test broadly:** check legibility over light and dark backdrops, busy imagery, and at low brightness. A material that only works over one backdrop is incomplete.

The full token set for this foundation is in `context/tokens.json`.
