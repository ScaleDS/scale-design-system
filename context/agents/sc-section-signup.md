---
tag: sc-section-signup
class: ScSectionSignup
category: sections
import: @scale-ds/scale-design-system/components/sc-section-signup
slots: [heading, subtext, input, action]
useInstead: [sc-input, sc-hero]
source:
  guidance: guidance/sections/signup.html
  docs: "https://scaledesignsystem.com/sections/signup/"
---

# sc-section-signup

A card-based signup section with heading, subtext, an input, and an action button — slot your own `sc-input` and `sc-button` so it stays a real form.

## When to use

email capture, newsletter signup, and call-to-action blocks. For the bare inline field-plus-button, use `sc-signup`.

## When not to use

- Don’t add several fields — for a full form, build one with `sc-input` directly.
- Don’t use it as a page-opening CTA — that’s the `sc-hero`.

## Do

- State the value of signing up in the `subtext` — what they’ll receive.
- Ask for one thing (an email); use a labelled `type="email"` input.
- Use an action-led button label — “Subscribe”, “Get updates”.

## Don't

- Don’t add several fields — for a full form, build one with `sc-input` directly.
- Don’t hide the field’s accessible name — keep `label` set even when visually hidden.
- Don’t use it as a page-opening CTA — that’s the `sc-hero`.

## Examples

### Default

```html
<sc-section-signup>
  <span slot="heading">Sign up for updates</span>
  <span slot="subtext">Stay up to date with releases.</span>
  <sc-input id="signup-email" slot="input" label="Email" placeholder="you@example.com" type="email" required></sc-input>
  <sc-button id="signup-submit" slot="action" type="primary">Subscribe</sc-button>
</sc-section-signup>
```

## Accessibility

- **Field name:** the section adds no labelling — keep `label` on the slotted `sc-input` (use `show-label="false"` to hide it visually while keeping the accessible name).
- **Headings:** the heading slot is styled but imposes no level — slot a real heading element if it belongs in the page outline.
- **Form behaviour:** validation, `Enter`-to-submit, and the submit action come from the slotted `sc-input` and `sc-button` — wrap them in a `<form>` if you need native submission.
- **Order:** reading and tab order follow slot order — input before action.
