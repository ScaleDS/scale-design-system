---
tag: sc-accordion
class: ScAccordion
category: navigation
import: @scale-ds/scale-design-system/components/sc-accordion
dependencies: [sc-divider]
props:
  open: { type: boolean, default: false }
  heading: { type: string, default: Heading }
slots: [default]
events: [toggle]
roles: [region]
useInstead: [sc-tabs]
source:
  guidance: guidance/components/accordion.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-accordion.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=8809-102"
  framer: "https://scaleframer.framer.website/components/accordion"
  docs: "https://scaledesignsystem.com/components/accordion/"
---

# sc-accordion

Vertically stacked sections that expand and collapse, perfect for keeping dense content tidy and scannable.

## When to use

FAQ sections, settings panels, and content that should stay hidden by default but remain accessible on demand.

## When not to use

- Don’t use one to switch between peer views — reach for `sc-tabs`.

## Do

- Keep headings short and descriptive so the collapsed list stays scannable.
- Use it for secondary or optional content that not everyone needs at once.
- Let each section open and close independently.

## Don't

- Don’t hide information everyone needs — show that inline instead.
- Don’t nest accordions inside accordions.
- Don’t use one to switch between peer views — reach for `sc-tabs`.

## Examples

### Default

A single section with a `heading` and slotted body content, collapsed on load.

```html
<sc-accordion heading="What is Scale?">
  Scale is a design system for Figma and Framer that helps individuals and organisations
  scale their design workflow.
</sc-accordion>
```

### Open by default

Set `open` to expand a panel on load — useful for the first item or a high-priority answer.

```html
<sc-accordion heading="How does dark mode work?" open>
  Scale uses semantic CSS custom properties that switch between light and dark themes
  automatically. No manual variant management needed.
</sc-accordion>
```

### Stacked

Place accordions back-to-back; each opens and closes independently.

```html
<sc-accordion heading="First question">
  Answer to the first question goes here.
</sc-accordion>
<sc-accordion heading="Second question" open>
  Answer to the second question is expanded by default.
</sc-accordion>
<sc-accordion heading="Third question">
  Answer to the third question goes here.
</sc-accordion>
```

## Accessibility

- **Trigger:** each heading is a native `<button>` with `aria-expanded` reflecting open/closed state and `aria-controls` pointing at its panel.
- **Keyboard:** `Enter` / `Space` toggles the focused section; `Tab` moves between headers.
- **Panel:** the body is a `role="region"` labelled by its header via `aria-labelledby`.
- **Focus:** the header shows the global keyboard focus ring; it is never removed.
