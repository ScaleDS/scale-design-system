---
foundation: typography
title: Typography
source:
  guidance: guidance/foundations/typography.html
  tokens: context/tokens.json
  docs: "https://scaledesignsystem.com/foundations/typography/"
---

# Typography

Typography shapes the visual language of digital products by defining consistent, accessible text styles that support readability, hierarchy, and brand expression.

## Semantic

Rather than using sizes by their value (e.g., "14px"), we use them by their function (e.g., "Text/M/Regular"). This ensures consistent application across products, easy responsive scaling, clear intent in code, and future-proof flexibility. The muted token under each specimen is the mixin to apply that style. Only the font family changes across platforms; weights and letter-spacing are shared. iOS and Android use the smaller mobile size scale at any width, while web uses the desktop sizes and steps down to the mobile ones below 810px. The iOS preview uses the system font, so it renders in SF Pro only on Apple devices. Display and section headings. Inter, now in three weights (Light, Regular, Semibold) across ten sizes, from 72px hero headings down to a 14px 2XS. Body and supporting copy. Inter, now in Regular and Semibold across six sizes, from a 24px lead paragraph down to a new 10px XS for fine print. Inline and standalone links. Inter, Semibold, sized to sit alongside the matching Text step. UI labels for controls, tabs and chips. Inter, Semibold, compact and high-contrast.

## Primitives

Primitives are the raw type values every semantic style is built from: the font families, weights, and the size, line-height and letter-spacing scales. Reference the semantic styles above in product UI rather than these directly; reach for a primitive only when no semantic style fits. The size and line-height values shift at the 810px mobile breakpoint.

## Accessibility

- **Body size:** set body text at 16px or larger. Smaller type is harder to read for everyone and forces zoom on mobile, so reserve the S and XS steps for labels and captions rather than paragraphs.
- **Respect the user’s setting:** size type in relative units so it grows when someone raises their browser or OS text size. A layout that breaks at 200% zoom fails WCAG 1.4.4.
- **Line height:** keep body text at 1.5 or more, and paragraph spacing at least twice the font size (WCAG 1.4.12). The line-height primitives already meet this — don’t tighten them to win vertical space.
- **Line length:** hold running text to 60–90 characters. Longer lines make it easy to lose your place returning to the left edge.
- **Heading order:** pick the heading level by its place in the document outline, not by how big it looks. Screen readers navigate by that outline, so use a type token to change the size instead of skipping a level.
- **Weight and case:** avoid long runs of ALL CAPS, which are slower to read, and don’t rely on weight alone to carry meaning — light weights on low-contrast backgrounds are the first thing to disappear.
- **Alignment:** keep body text left-aligned. Justified text opens uneven rivers of white space that are particularly hard going for dyslexic readers.

The full token set for this foundation is in `context/tokens.json`.
