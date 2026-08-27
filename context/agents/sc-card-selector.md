---
tag: sc-card-selector
class: ScCardSelector
category: forms
import: @scale-ds/scale-design-system/components/sc-card-selector
props:
  type: { type: enum, default: checkbox, values: [checkbox, radio] }
  checked: { type: boolean, default: false }
  disabled: { type: boolean, default: false }
  name: { type: string, default: "" }
  value: { type: string, default: "" }
  hideIndicator: { type: boolean, default: false, attr: hide-indicator }
slots: [default]
events: [change]
useInstead: [sc-radio, sc-checkbox]
source:
  guidance: guidance/components/card-selector.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-card-selector.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=32278-53004"
  docs: "https://scaledesignsystem.com/components/card-selector/"
---

# sc-card-selector

Cards that double as selection controls — a richer, more visual alternative to `sc-radio` and `sc-checkbox`.

## When to use

plan pickers, onboarding choices, or settings where each option benefits from a title, description, and a selected state. For a compact list, use a plain Radio or Checkbox instead.

## When not to use

- Don’t reach for Card Selector when a plain `sc-radio` or `sc-checkbox` list would do.

## Do

- Use `type="radio"` with a shared name when only one option may be chosen.
- Give each card a clear title and a short supporting line.
- Keep cards in a group the same width and structure.

## Don't

- Don’t reach for Card Selector when a plain `sc-radio` or `sc-checkbox` list would do.
- Don’t mix radio and checkbox selectors in the same group.
- Don’t rely on the border ring alone if colour is the only selection cue — keep the indicator unless space is tight.

## Examples

### States

Resting, `checked`, and `disabled`. Slot any content — a bold title plus a muted description reads best.

```html
<sc-card-selector style="width:360px">
  <strong>Standard plan</strong>
  <span style="color:var(--sc-color-text-secondary)">Perfect for individuals getting started.</span>
</sc-card-selector>
<sc-card-selector checked style="width:360px">
  <strong>Pro plan</strong>
  <span style="color:var(--sc-color-text-secondary)">For growing teams that need more.</span>
</sc-card-selector>
<sc-card-selector disabled style="width:360px">
  <strong>Enterprise plan</strong>
  <span style="color:var(--sc-color-text-secondary)">Currently unavailable in your region.</span>
</sc-card-selector>
```

### Indicator type

Default `type="checkbox"` toggles independently; `type="radio"` with a shared `name` single-selects. Add `hide-indicator` for border-only selection.

```html
<sc-card-selector style="width:360px">
  <strong>Email notifications</strong>
  <span style="color:var(--sc-color-text-secondary)">Get a digest each morning.</span>
</sc-card-selector>
<sc-card-selector checked hide-indicator style="width:360px">
  <strong>Border-only selected state</strong>
  <span style="color:var(--sc-color-text-secondary)">The blue ring conveys selection; no checkbox icon.</span>
</sc-card-selector>
```

### Radio group

Share a `name` across `type="radio"` selectors to make them mutually exclusive, and wrap them in a `role="radiogroup"` container. Try clicking.

```html
<div style="display:flex;flex-direction:column;gap:var(--sc-space-m);width:360px" role="radiogroup" aria-label="Plan">
  <sc-card-selector type="radio" name="plan-demo" value="starter">
    <strong>Starter</strong>
    <span style="color:var(--sc-color-text-secondary)">For trying things out — free.</span>
  </sc-card-selector>
  <sc-card-selector type="radio" name="plan-demo" value="growth" checked>
    <strong>Growth</strong>
    <span style="color:var(--sc-color-text-secondary)">For small teams — $29/mo.</span>
  </sc-card-selector>
  <sc-card-selector type="radio" name="plan-demo" value="scale">
    <strong>Scale</strong>
    <span style="color:var(--sc-color-text-secondary)">For organisations — $99/mo.</span>
  </sc-card-selector>
</div>
```

## Accessibility

- **Role:** each card renders a `<button>` with `role="checkbox"` or `role="radio"` and reflects `aria-checked`.
- **Grouping:** wrap radio selectors in a `role="radiogroup"` with an `aria-label` so the set is announced as one control.
- **Keyboard:** each card is tab-focusable; `Enter` / `Space` toggles it and fires a `change` event.
- **Disabled:** `disabled` sets `aria-disabled` and blocks activation.
- **Label:** the slotted title and description form the accessible name — don’t rely on the indicator alone to convey the option.
- **Focus:** shows the global keyboard focus ring on the card.
