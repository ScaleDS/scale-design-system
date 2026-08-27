---
foundation: color
title: Color
source:
  guidance: guidance/foundations/color.html
  tokens: context/tokens.json
  docs: "https://scaledesignsystem.com/foundations/color/"
---

# Color

Color serves as a fundamental element that conveys mood, establishes brand identity, and ensures visual consistency across all user interfaces.

## Semantic

Semantic tokens map a role (text, background, icon, border, surface, overlay) to a primitive value per theme. Reference these, never raw hex. The swatches below are live, so to compare light and dark, use the mode toggle in the header.

## Primitives

Primitives are the raw, theme-independent values: the base palette every semantic token resolves to. Reference the semantic tokens above in product UI rather than these directly, so light/dark theming stays automatic. The contrast pill shows each value’s WCAG ratio against the background it reads best on, black or white.

## Do

- Reference semantic tokens (`--sc-color-text-*`, `-background-*`, `-border-*`…) in product UI so light and dark theming stays automatic.
- Match the token to its role: body copy on text tokens, containers on surface or background tokens, dividers on border tokens.
- Use the `-inverse` tokens on dark or brand-filled surfaces, and `-static` tokens where a value must not flip with the theme.
- Pair status colors (positive, warning, negative) with an icon, label, or shape so meaning survives for color-blind users.
- Check every text-on-surface pairing against WCAG AA in both themes; the contrast ratio is listed beside each primitive.

## Don't

- Don’t hardcode raw hex (e.g. `#3355FF`) when a semantic token exists.
- Don’t use brand or accent colors for long-form body text or large fills where contrast falls short.
- Don’t rely on color alone to communicate state: success, warning, and error must carry a second cue.
- Don’t reference primitive tokens directly in product UI; they’re the raw palette the semantic layer resolves to.
- Don’t override a token’s value inline; adjust the role or choose a token that already fits.
- Don’t place text on a surface that fails 4.5:1 (3:1 for large text), even briefly in a hover or pressed state.

## Accessibility

- **Text contrast:** text meets WCAG 2.1 AA: 4.5:1 for body text and 3:1 for large text (≥24px, or ≥18.66px bold). Each primitive lists its ratio against the background it reads best on.
- **Non-text contrast:** icons, borders, and UI components that convey meaning meet 3:1 against adjacent colors (WCAG 1.4.11).
- **Don’t rely on color alone:** pair status and selected states with an icon, label, or pattern so information isn’t lost to color vision deficiency (WCAG 1.4.1).
- **Focus:** use `--sc-color-border-focus` for a clearly visible focus indicator at 3:1 contrast, and never remove it without an equivalent cue.
- **Theming:** semantic tokens adapt to light and dark automatically and honor `prefers-color-scheme`. Verify contrast holds in both themes, not just one.
- **States:** keep hover, pressed, selected, and disabled distinguishable by more than hue alone, and ensure disabled text still reads where it must remain legible.

The full token set for this foundation is in `context/tokens.json`.
