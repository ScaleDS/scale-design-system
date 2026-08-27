---
tag: sc-avatar
class: ScAvatar
category: content
import: @scale-ds/scale-design-system/components/sc-avatar
props:
  size: { type: enum, default: m, values: [xl, l, m, s, xs] }
  src: { type: string, default: "" }
  alt: { type: string, default: "" }
  disabled: { type: boolean, default: false }
roles: [img]
useInstead: [sc-avatar-group]
source:
  guidance: guidance/components/avatar.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-avatar.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=5926-18314"
  framer: "https://scaleframer.framer.website/components/avatar"
  docs: "https://scaledesignsystem.com/components/avatar/"
---

# sc-avatar

Circular representations of a person or entity — showing a photo, initials, or a placeholder icon.

## When to use

profile pictures, comment threads, user lists, team members — anywhere a person needs a visual identity.

## When not to use

- Don’t line up many avatars by hand — use `sc-avatar-group`.

## Do

- Always pass `alt` with the person’s name — it becomes the accessible label.
- Use the initials fallback for users who have no photo.
- Keep the size consistent within a single list or row.

## Don't

- Don’t make an avatar the only label for an interactive control — pair it with a name or tooltip.
- Don’t line up many avatars by hand — use `sc-avatar-group`.
- Don’t rely on the placeholder icon to identify a specific person.

## Examples

### Sizes

Five sizes from `xs` (16px) to `xl` (96px). Match the size to the surrounding text and control density.

```html
<sc-avatar size="xl" src="https://i.pravatar.cc/96?img=1" alt="Jane Doe"></sc-avatar>
<sc-avatar size="l" src="https://i.pravatar.cc/48?img=2" alt="John Smith"></sc-avatar>
<sc-avatar size="m" src="https://i.pravatar.cc/32?img=3" alt="Alice"></sc-avatar>
<sc-avatar size="s" src="https://i.pravatar.cc/24?img=4" alt="Bob"></sc-avatar>
<sc-avatar size="xs" src="https://i.pravatar.cc/16?img=5" alt="Charlie"></sc-avatar>
```

### Behaviour & states

A fallback chain keeps the avatar meaningful: a `src` renders the photo; with no `src`, the first letter of `alt`; with neither, a placeholder icon. `disabled` dims the avatar.

```html
<sc-avatar size="l" src="https://i.pravatar.cc/48?img=6" alt="Diana"></sc-avatar>
<sc-avatar size="l" alt="Emily Ng"></sc-avatar>
<sc-avatar size="l"></sc-avatar>
<sc-avatar size="l" src="https://i.pravatar.cc/48?img=7" alt="Frank" disabled></sc-avatar>
```

## Accessibility

- **Name:** renders `role="img"` with an `aria-label` taken from `alt` (falls back to “Avatar” when empty) — always supply a meaningful `alt`.
- **Decorative layers:** the initials and placeholder icon are `aria-hidden`; the accessible name comes solely from `alt`.
- **Contrast:** initials sit on a token-driven surface that meets WCAG AA against the text colour.
- **Disabled:** `disabled` is visual only — convey the disabled state on the surrounding interactive element too.
