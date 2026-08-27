---
foundation: layout
title: Layout
source:
  guidance: guidance/foundations/layout.html
  tokens: context/tokens.json
  docs: "https://scaledesignsystem.com/foundations/layout/"
---

# Layout

Layout is the structure underneath every screen: the responsive **breakpoints** that decide when a layout reflows, and the **column grid** that aligns content within each breakpoint. Design mobile-first and layer enhancements up the scale, so layouts adapt predictably rather than breaking at arbitrary widths. Build with the named Sass breakpoints (`$sc-breakpoint-mobile`, `-tablet`, `-desktop-m`, `-desktop`) and the shared grid rather than raw pixel widths so the reflow stays consistent across the system.

## Breakpoints

Four min-width breakpoints cover the standard device classes. Each is the lower bound of a range: styles apply from that width upward, mobile-first.

## Column grid

A shared column grid keeps content aligned within each breakpoint. The column count steps up with the available width, while a constant 16px outer margin frames the content on every screen. Place content on whole columns and let the gutters do the spacing between them.

## Do

- Design mobile-first: start at the smallest width and layer enhancements upward.
- Snap content to the column grid and let gutters handle the spacing between blocks.
- Use breakpoints to reflow the layout (columns, navigation), not to redesign each screen from scratch.
- Let content drive the breakpoint: change layout when it starts to break, not at a device’s exact size.
- Use relative units (%, rem, fr) within a breakpoint so the layout flexes between the fixed stops.
- Test at and between every breakpoint, including the exact boundary values.

## Don't

- Don’t target specific devices; breakpoints are width ranges, not iPhone or iPad sizes.
- Don’t place content on fractional columns or invent one-off gutters and margins.
- Don’t hide content at smaller widths; reflow or progressively disclose it instead.
- Don’t scatter one-off breakpoints; stay on the three-step scale unless content genuinely requires more.
- Don’t let content stretch edge-to-edge on large screens; cap the width so lines stay readable.
- Don’t hard-code pixel widths that assume a single viewport size.

## Accessibility

- **Reflow (WCAG 1.4.10):** content must reflow to a single column at 320px CSS width (equivalent to 400% zoom on a 1280px screen) without horizontal scrolling. The mobile breakpoint is what delivers this.
- **Zoom:** support up to 400% browser zoom; a layout should respond to zoom the same way it responds to a narrower viewport.
- **Text spacing (WCAG 1.4.12):** layouts must not clip or overlap when users increase line height or letter spacing. Leave breathing room at every breakpoint.
- **Orientation (WCAG 1.3.4):** don’t lock layout to portrait or landscape; breakpoints should respond to width regardless of orientation.

The full token set for this foundation is in `context/tokens.json`.
