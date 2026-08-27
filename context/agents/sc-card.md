---
tag: sc-card
class: ScCard
category: content
import: @scale-ds/scale-design-system/components/sc-card
props:
  surface: { type: enum, default: l1, values: [none, subtle, l1, l2, l3, l4] }
  radius: { type: enum, default: m, values: [none, xs, s, m, l, xl, 2xl] }
  padding: { type: enum, default: none, values: [none, s, m, l, xl] }
slots: [default]
source:
  guidance: guidance/components/card.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-card.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=4283-5763"
  framer: available
  docs: "https://scaledesignsystem.com/components/card/"
---

# sc-card

A self-contained surface that groups related content and actions around a single subject. Compose a `surface` elevation, a `radius`, and optional `padding`.

## When to use

any time related content and actions belong together as one visually-grouped unit. For ready-made patterns, reach for `sc-card-image`, `sc-card-pricing`, or `sc-card-selector`.

## Do

- Keep one subject per card — a single object, summary, or choice.
- Use `l1` for resting cards and reserve higher elevations for floating layers.
- Leave `padding="none"` when an image or table needs to reach the edges.

## Don't

- Don’t nest cards within cards — flatten the hierarchy instead.
- Don’t mix several elevations in one grid; keep peers at the same level.
- Don’t make the whole card a single click target without a clear focusable control inside.

## Examples

### Surface

A transparent `subtle` tint plus four shadow elevations — `l1` is the resting card, higher levels read as floating layers.

```html
<sc-card surface="subtle" radius="m" padding="l" style="width:240px">Subtle background, no shadow.</sc-card>
<sc-card surface="l1" radius="m" padding="l" style="width:240px">L1 — the resting card surface.</sc-card>
<sc-card surface="l2" radius="m" padding="l" style="width:240px">L2 — raised for emphasis or hover.</sc-card>
<sc-card surface="l3" radius="m" padding="l" style="width:240px">L3 — popovers and floating panels.</sc-card>
```

### Radius

```html
<sc-card surface="l1" radius="none" padding="l" style="width:200px">No radius</sc-card>
<sc-card surface="l1" radius="s" padding="l" style="width:200px">Radius S</sc-card>
<sc-card surface="l1" radius="m" padding="l" style="width:200px">Radius M</sc-card>
<sc-card surface="l1" radius="xl" padding="l" style="width:200px">Radius XL</sc-card>
```

### Padding

Padding defaults to `none` so edge-to-edge content (like images) sits flush — set it when the card holds plain content.

```html
<sc-card surface="l1" radius="m" padding="s" style="width:200px">Padding S</sc-card>
<sc-card surface="l1" radius="m" padding="m" style="width:200px">Padding M</sc-card>
<sc-card surface="l1" radius="m" padding="l" style="width:200px">Padding L</sc-card>
<sc-card surface="l1" radius="m" padding="xl" style="width:200px">Padding XL</sc-card>
```

### Composition

Cards are just a surface — slot in whatever structure you need. They clip overflow, so edge-to-edge images get rounded corners for free.

```html
<sc-card surface="l1" radius="l" padding="l" style="width:320px">
  <div style="display:flex;flex-direction:column;gap:var(--sc-space-m)">
    <div>
      <div style="font-weight:600;font-size:18px">Project Aurora</div>
      <div style="color:var(--sc-color-text-secondary);font-size:14px;margin-top:4px">
        Cross-functional initiative kicking off next quarter.
      </div>
    </div>
    <sc-button-group>
      <sc-button type="primary" size="s">View</sc-button>
      <sc-button type="secondary" size="s">Share</sc-button>
    </sc-button-group>
  </div>
</sc-card>
<sc-card surface="l1" radius="l" style="width:280px">
  <img src="https://picsum.photos/seed/scale-card/560/240" alt="" style="display:block;width:100%;height:140px;object-fit:cover" />
  <div style="padding:var(--sc-space-l);display:flex;flex-direction:column;gap:var(--sc-space-s)">
    <div style="font-weight:600">Sunrise over the bay</div>
    <div style="color:var(--sc-color-text-secondary);font-size:14px">
      The card clips overflow so children don’t need their own rounded corners.
    </div>
  </div>
</sc-card>
```

## Accessibility

- **Role:** Card is a presentational `<div>` surface with no implicit role — meaning comes from the content you slot in.
- **Structure:** give the card a heading (`<h2>`–`<h4>`) so it appears in the document outline; group lists of cards in a `<ul>` / `<li>` where appropriate.
- **Interactivity:** put a real `sc-button` or link inside rather than attaching a click handler to the card; keyboard users need a focusable control.
- **Images:** decorative images need `alt=""`; meaningful ones need descriptive alt text.
- **Contrast:** text on any surface level must meet WCAG AA — elevation changes the background, so re-check low-emphasis text.
