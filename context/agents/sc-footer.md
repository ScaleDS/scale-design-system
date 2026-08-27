---
tag: sc-footer
class: ScFooter
category: layout
import: @scale-ds/scale-design-system/components/sc-footer
dependencies: [sc-logo]
props:
  copyright: { type: string, default: "" }
  licenceLabel: { type: string, default: "Licence Agreement", attr: licence-label }
  licenceHref: { type: string, default: "#", attr: licence-href }
useInstead: [sc-header]
source:
  guidance: guidance/components/footer.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-footer.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=5469-9149"
  framer: "https://scaleframer.framer.website/components/footer"
  docs: "https://scaledesignsystem.com/components/footer/"
---

# sc-footer

The bottom section of a website — home to the brand mark, copyright, and a legal link.

## When to use

page footers, the bottom of marketing sites, and legal pages. Pairs with the `sc-header` at the top of the page.

## When not to use

- Don’t overload it with navigation — that belongs in the `sc-header` or a sitemap.

## Do

- Keep the footer minimal — brand mark, copyright, and the essential legal link.
- Place it as the last element on the page, full width.
- Point `licence-href` at a real, current legal page.

## Don't

- Don’t overload it with navigation — that belongs in the `sc-header` or a sitemap.
- Don’t leave a placeholder `#` link in production.
- Don’t omit the copyright on a public marketing site.

## Examples

### Default

Set `copyright` and point `licence-href` at your legal page; the `sc-logo` mark is built in.

```html
<sc-footer
  copyright="©2020 - 2026 Christopher Deane. All rights reserved."
  licence-label="Licence Agreement"
  licence-href="#"
></sc-footer>
```

### Custom link label

Change `licence-label` for other legal destinations like Terms or Privacy.

```html
<sc-footer
  copyright="© 2026 Acme Inc."
  licence-label="Terms & Privacy"
  licence-href="#"
></sc-footer>
```

## Accessibility

- **Landmark:** wrap the element in a native `<footer>` (or add `role="contentinfo"`) so it’s announced as the page footer landmark.
- **Link:** the licence is a real `<a>` — keyboard focusable, with a label describing the destination.
- **Logo:** the built-in `sc-logo` mark is decorative here; the copyright text carries the brand meaning.
- **Contrast:** the secondary copyright text must still meet WCAG AA against the page background.
