---
tag: sc-card-pricing
class: ScCardPricing
category: content
import: @scale-ds/scale-design-system/components/sc-card-pricing
dependencies: [sc-divider]
slots: [badge, plan, description, default, actions]
source:
  guidance: guidance/components/card-pricing.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-card-pricing.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=4283-5763"
  framer: available
  docs: "https://scaledesignsystem.com/components/card-pricing/"
---

# sc-card-pricing

A pricing-tier card with slots for a badge, plan price, description, feature rows, and an action area — assembled from `sc-badge`, `sc-row`, and `sc-button`.

## When to use

pricing pages, plan comparisons, and subscription tiers. For a plain surface, use `sc-card`.

## Do

- List the same features in the same order across tiers so they’re scannable.
- Flag one recommended plan with a `sc-badge` and a primary button.
- Keep the price prominent and the billing period unambiguous.

## Don't

- Don’t cram unlimited feature rows in — summarise and link to full details.
- Don’t give every tier a primary button; only the recommended one should compete.
- Don’t hide the real cost behind vague copy.

## Examples

### Default

Slot a `sc-badge` into `badge`, the price into `plan`, supporting copy into `description`, `sc-row` for features in the default slot, and a `sc-button` into `actions`.

```html
<sc-card-pricing style="max-width:360px">
  <sc-badge slot="badge" status="default">Starter</sc-badge>
  <span slot="plan">$19</span>
  <span slot="description">For individuals.</span>
  <sc-row trailing-icon="check">Basic components</sc-row>
  <sc-row trailing-icon="check">1 project</sc-row>
  <sc-row>Community support</sc-row>
  <sc-button slot="actions" type="primary" size="m">Buy Now</sc-button>
</sc-card-pricing>
```

### Plan comparison

Lay tiers side by side and use the `sc-badge` status plus a higher-emphasis `sc-button` to flag the recommended plan.

```html
<sc-card-pricing style="flex:1;min-width:240px;max-width:300px">
  <sc-badge slot="badge" status="default">Starter</sc-badge>
  <span slot="plan">$19</span>
  <span slot="description">For individuals.</span>
  <sc-row trailing-icon="check">Basic components</sc-row>
  <sc-row trailing-icon="check">1 project</sc-row>
  <sc-button slot="actions" type="secondary" size="m">Choose Starter</sc-button>
</sc-card-pricing>
<sc-card-pricing style="flex:1;min-width:240px;max-width:300px">
  <sc-badge slot="badge" status="positive">Most popular</sc-badge>
  <span slot="plan">$49</span>
  <span slot="description">For growing teams.</span>
  <sc-row trailing-icon="check">All components</sc-row>
  <sc-row trailing-icon="check">Unlimited projects</sc-row>
  <sc-row trailing-icon="check">Priority support</sc-row>
  <sc-button slot="actions" type="primary" size="m">Choose Pro</sc-button>
</sc-card-pricing>
```

## Accessibility

- **Structure:** the price renders in a `<span>`, not a heading — add a real heading near the card (e.g. the plan name) so tiers appear in the document outline.
- **Feature rows:** the check icon is decorative; the `sc-row` text must convey what’s included on its own.
- **Action:** the `actions` slot holds a real `sc-button` or link — keyboard focusable, with a label naming the plan it buys.
- **Comparison:** when laying tiers side by side, keep a logical DOM order so screen-reader users read each plan top to bottom.
- **Contrast:** the `sc-badge` status colour must meet WCAG AA against the card surface.
