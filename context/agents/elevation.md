---
foundation: elevation
title: Elevation
source:
  guidance: guidance/foundations/elevation.html
  tokens: context/tokens.json
  docs: "https://scaledesignsystem.com/foundations/elevation/"
---

# Elevation

Scale uses a five-level elevation system to communicate visual depth and spatial hierarchy. Surface tokens define the background of an element at each level and adapt automatically between light and dark themes; paired shadow tokens reinforce that depth. Build with the named tokens (`--sc-color-surface-*`, `--sc-shadow-*`) rather than raw values so depth stays consistent across both themes.

## How it works

Each level maps to a surface color token with a light and dark value. In light mode every surface is white: depth is communicated through shadows and borders. In dark mode surfaces progressively lighten to create visible depth without relying on shadows. Levels stack from the page background up to the highest overlay; use the mode toggle in the header to compare how the same stack reads in each theme.

## Surfaces

Surface tokens set the background plane of an element by elevation level. Match the token to the element’s spatial role using the usage guidance below. The swatch and primitive shown reflect the active theme.

## Shadows

Each level above L0 is paired with a shadow token. All shadows use a dual layer: a directional shadow (y-offset + blur) for depth and an ambient shadow (no offset, smaller blur) for grounding.

## Do

- Use the correct level for each element’s role: a card belongs on L1, a modal on L3.
- Pair elevated surfaces (L3/L4) with a dimming overlay so the content below recedes.
- Use shadows to reinforce elevation in light mode, where every surface is white.
- Test in both themes: depth that only works in one mode is incomplete.
- Stay within the five levels; they cover every standard UI pattern.

## Don't

- Don’t skip levels arbitrarily; jumping L0 → L3 breaks the spatial logic.
- Don’t use surface tokens for interactive states; hover, pressed, and selected use `Background/` tokens.
- Don’t rely on shadows alone in dark mode: they’re nearly invisible; the surface lightening carries the depth.
- Don’t nest more than three levels deep; a card in a panel in a modal is a sign to rethink the hierarchy.
- Don’t use surface tokens for decoration; they communicate elevation, not visual styling.

## Accessibility

- **Contrast:** text and UI on every surface must meet WCAG 2.1 AA: 4.5:1 for text under 24px, 3:1 for text 24px and larger and for UI components.
- **Surface-to-surface:** adjacent levels should be visually distinguishable; in dark mode the progressive lightening keeps stacked surfaces perceptible.
- **Never rely on elevation alone:** reinforce hierarchy with borders, headings, and labels so structure survives without depth perception.
- **Modals:** pair L3/L4 overlays with backdrop dimming, and expose layered content to screen readers with correct ARIA roles and focus management.
- **Test broadly:** verify contrast on every level in both themes, with color-blindness simulators, at low brightness, and on low-quality displays.

The full token set for this foundation is in `context/tokens.json`.
