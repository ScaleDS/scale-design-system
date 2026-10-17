---
foundation: density
title: Density
source:
  guidance: guidance/foundations/density.html
  tokens: context/tokens.json
  docs: "https://scaledesignsystem.com/foundations/density/"
---

# Density

Density sets how much fits in a space. Scale has two densities: **Default**, sized for reading and touch, and **Compact**, for dense tools such as editors, dashboards and data tables. Compact works like a theme: put `data-density="compact"` on `<html>` or on any element, and every component inside it gets smaller with no change to its markup.

## How it works

Components read their sizes from the spacing, radius, type and icon tokens, never from fixed pixels. Compact moves each of those tokens one step down its own scale, so `--sc-space-m` takes the value of `--sc-space-s`, and `--sc-type-size-m` takes the value of `--sc-type-size-s`. A medium button goes from 36px to 24px tall, and its label from 14px to 12px. Colour, border width, shadow, motion and letter spacing stay the same in both densities. The smallest steps have a floor: `--sc-space-2xs` stays 2px and `--sc-type-size-xs` stays 10px, so Compact never shrinks text below a legible size.

## What changes

Every step of these tiers moves down one place. The full list of compact values is the `density.compact` group in `context/tokens.json`.

## Do

- Use Compact for tools people work in all day with a mouse and keyboard: editors, admin panels, dashboards, data tables.
- Set the density once, on the root or on a whole region, rather than on single components.
- Size your own UI with the same tokens (`--sc-space-*`, `--sc-type-size-*`, `--sc-size-icon-*`) so it follows the density too.
- Check a compact screen in both themes, as you would any other change.

## Don't

- Don’t use Compact for marketing pages, long reading or touch-first screens; Default is sized for those.
- Don’t mix densities inside one control group, such as a toolbar or a form row.
- Don’t size icons or controls in fixed pixels; they won’t follow the density and will look out of scale beside everything else.

## Accessibility

- **Target size:** compact controls are smaller than the 44×44px touch target, so keep Compact to pointer-first interfaces. Where a compact screen may be used by touch, add space around controls or leave that screen at Default.
- **Text size:** compact body text is 12px and the smallest text is 10px. Don’t go smaller, and keep long passages of text at Default.
- **Zoom:** every size is a token, so browser zoom and text scaling still work in Compact. Check that layouts hold at 200% zoom.
- **Contrast:** density doesn’t change colour, so contrast holds; smaller text still needs 4.5:1.

The full token set for this foundation is in `context/tokens.json`.
