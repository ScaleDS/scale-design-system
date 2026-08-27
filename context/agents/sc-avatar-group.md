---
tag: sc-avatar-group
class: ScAvatarGroup
category: content
import: @scale-ds/scale-design-system/components/sc-avatar-group
dependencies: [sc-avatar]
props:
  size: { type: enum, default: m, values: [l, m, s] }
  max: { type: number, default: 4 }
slots: [default]
roles: [group, menu, menuitem]
useInstead: [sc-avatar]
source:
  guidance: guidance/components/avatar-group.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-avatar-group.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=5926-18314"
  docs: "https://scaledesignsystem.com/components/avatar-group/"
---

# sc-avatar-group

Overlapping avatars with an overflow count — a compact way to show several people at once.

## When to use

team rosters, shared-document viewers, multi-user presence, and collaborator lists.

## When not to use

- Don’t use it for a single person — use `sc-avatar`.

## Do

- Give every avatar a meaningful `alt` — the names drive the overflow dropdown.
- Set `max` so the row stays compact in its container.
- Keep the group size consistent with the surrounding UI density.

## Don't

- Don’t show a long unbroken row — cap it with `max` and let the rest overflow.
- Don’t rely on the photos alone to identify people; surface names in the overflow menu.
- Don’t use it for a single person — use `sc-avatar`.

## Examples

### Sizes

The group `size` applies to every child avatar.

```html
<sc-avatar-group size="l">
  <sc-avatar size="l" src="https://i.pravatar.cc/48?img=11" alt="User 1"></sc-avatar>
  <sc-avatar size="l" src="https://i.pravatar.cc/48?img=12" alt="User 2"></sc-avatar>
  <sc-avatar size="l" src="https://i.pravatar.cc/48?img=13" alt="User 3"></sc-avatar>
  <sc-avatar size="l" alt="Grace"></sc-avatar>
  <sc-avatar size="l" alt="Henry"></sc-avatar>
</sc-avatar-group>
```

### Overflow count

Set `max` to cap visible avatars; the remainder collapse into a “+N” chip. **Click the chip** to open a dropdown of the hidden people — each row shows their avatar and name (read from each avatar’s `alt`).

```html
<sc-avatar-group size="m" max="3">
  <sc-avatar size="m" src="https://i.pravatar.cc/48?img=11" alt="Olivia Martin"></sc-avatar>
  <sc-avatar size="m" src="https://i.pravatar.cc/48?img=12" alt="Liam Nguyen"></sc-avatar>
  <sc-avatar size="m" src="https://i.pravatar.cc/48?img=13" alt="Emma Johansson"></sc-avatar>
  <sc-avatar size="m" src="https://i.pravatar.cc/48?img=14" alt="Noah Patel"></sc-avatar>
  <sc-avatar size="m" src="https://i.pravatar.cc/48?img=15" alt="Ava Rossi"></sc-avatar>
  <sc-avatar size="m" alt="William Chen"></sc-avatar>
  <sc-avatar size="m" alt="Sophia Garcia"></sc-avatar>
</sc-avatar-group>
```

## Accessibility

- **Group:** the row is `role="group"` labelled “Avatar group”.
- **Overflow trigger:** the “+N” control is a native `<button>` with `aria-haspopup="menu"`, `aria-expanded`, and an `aria-label` of “N more”.
- **Menu:** the dropdown is `role="menu"` with `role="menuitem"` rows; `Esc` closes it and returns focus to the trigger.
- **Focus:** the overflow button shows the global keyboard focus ring.
