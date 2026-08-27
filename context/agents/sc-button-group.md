---
tag: sc-button-group
class: ScButtonGroup
category: actions
import: @scale-ds/scale-design-system/components/sc-button-group
props:
  gap: { type: enum, default: m, values: [xs, s, m, l] }
  orientation: { type: enum, default: horizontal, values: [horizontal, vertical] }
  align: { type: enum, default: start, values: [start, center, end, stretch] }
  nowrap: { type: boolean, default: false }
  selectable: { type: boolean, default: false }
  value: { type: string, default: "" }
  label: { type: string, default: "" }
slots: [default]
events: [change]
source:
  guidance: guidance/components/button-group.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-button-group.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=23278-205767"
  framer: "https://scaleframer.framer.website/components/button-group"
  docs: "https://scaledesignsystem.com/components/button-group/"
---

# sc-button-group

Related buttons bundled together in a row with consistent spacing and shared alignment.

## When to use

form action rows, toolbars, and segmented filters — any time a set of buttons act on the same context. Add `selectable` to make it a radio-like single-select.

## Do

- Group buttons that act on the same object or context.
- Keep one primary action per group; let the rest carry lower emphasis.
- Use `selectable` when the buttons are mutually exclusive options.

## Don't

- Don’t mix unrelated actions into one group just to align them.
- Don’t use a selectable group for multi-select — reach for checkboxes instead.
- Don’t leave the group without a `label` for assistive tech.

## Examples

### Default

Wrap related `sc-button`s and give the group a `label` for its accessible name.

```html
<sc-button-group label="Document actions">
  <sc-button type="primary" leading-icon="save">Save</sc-button>
  <sc-button type="secondary" leading-icon="copy">Duplicate</sc-button>
  <sc-button type="text" leading-icon="trash-2">Delete</sc-button>
</sc-button-group>
```

### Selectable

`selectable` plus a `value` turns the group into a single-select segmented control — the child matching `value` renders as `primary` and the group fires a `change` event.

```html
<sc-button-group selectable value="7d" label="Time range">
  <sc-button-pill value="24h">24h</sc-button-pill>
  <sc-button-pill value="7d">7d</sc-button-pill>
  <sc-button-pill value="30d">30d</sc-button-pill>
  <sc-button-pill value="90d">90d</sc-button-pill>
  <sc-button-pill value="all">All</sc-button-pill>
</sc-button-group>
```

### Orientation

Set `orientation="vertical"` to stack the buttons into a column.

```html
<sc-button-group orientation="vertical" align="stretch" label="Account">
  <sc-button type="secondary" leading-icon="user">Profile</sc-button>
  <sc-button type="secondary" leading-icon="settings">Settings</sc-button>
  <sc-button type="secondary" leading-icon="log-out">Sign out</sc-button>
</sc-button-group>
```

### Gap

Tighten or loosen the spacing between buttons with `gap` — `xs`, `s`, `m` (default), or `l`.

```html
<sc-button-group gap="xs" label="Tight group">
  <sc-button type="secondary">One</sc-button>
  <sc-button type="secondary">Two</sc-button>
  <sc-button type="secondary">Three</sc-button>
</sc-button-group>
```

## Accessibility

- **Role:** renders `role="group"`, or `role="radiogroup"` when `selectable` — with the children exposed as `radio`s.
- **Name:** the `label` becomes the group’s `aria-label`; always set it.
- **Orientation:** `aria-orientation` follows the `orientation` prop so screen readers announce the layout.
- **Selection:** the active child carries `aria-checked="true"`; the rest are `false`.
- **Focus:** each button keeps its own keyboard focus ring.
