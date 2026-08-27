---
tag: sc-menu-dropdown
class: ScMenuDropdown
category: navigation
import: @scale-ds/scale-design-system/components/sc-menu-dropdown
dependencies: [sc-menu-item]
slots: [default]
events: [close]
roles: [menu]
useInstead: [sc-button]
source:
  guidance: guidance/components/menu.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-menu-dropdown.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=5484-8702"
  framer: "https://scaleframer.framer.website/components/menu"
  docs: "https://scaledesignsystem.com/components/menu/"
---

# sc-menu-dropdown

A temporary list of actions or options shown on a surface, letting users pick a single command. The `sc-menu-dropdown` is the surface; `sc-menu-item` rows are its children.

## When to use

header nav menus, user menus, and action menus. Pair it with a trigger — typically a `sc-button-icon` — to open and close the surface.

## When not to use

- Don’t use a menu for a primary, always-visible action — use a `sc-button`.

## Do

- Keep menus short and group related actions; order by frequency or importance.
- Use `destructive` for irreversible actions, placed last.
- Set `href` (or `type="link"`) for navigation items so they behave like links.

## Don't

- Don’t use a menu for a primary, always-visible action — use a `sc-button`.
- Don’t pack long, scrolling lists in — consider a dedicated page or search.
- Don’t mix destructive and routine actions without separating them.

## Examples

### Dropdown

Slot `sc-menu-item` children into a `sc-menu-dropdown`. Flag a destructive action with `destructive`.

```html
<sc-menu-dropdown>
  <sc-menu-item label="Profile" leading-icon="user"></sc-menu-item>
  <sc-menu-item label="Settings" leading-icon="settings"></sc-menu-item>
  <sc-menu-item label="Billing" leading-icon="credit-card"></sc-menu-item>
  <sc-menu-item label="Sign out" destructive leading-icon="log-out"></sc-menu-item>
</sc-menu-dropdown>
```

### Selected state

Mark the active choice with `state="selected"` and a trailing check.

```html
<sc-menu-dropdown>
  <sc-menu-item label="Profile" state="selected" leading-icon="user" trailing-icon="check"></sc-menu-item>
  <sc-menu-item label="Settings" leading-icon="settings"></sc-menu-item>
  <sc-menu-item label="Billing" leading-icon="credit-card"></sc-menu-item>
  <sc-menu-item label="Help" leading-icon="help-circle"></sc-menu-item>
</sc-menu-dropdown>
```

### Menu item rows (sc-menu-item)

A single row. `type` switches between `row`, `button`, and `link` behaviour; add leading/trailing icons and a `state`.

```html
<div style="display:flex;flex-direction:column;gap:var(--sc-space-s);width:320px">
  <sc-menu-item label="Default"></sc-menu-item>
  <sc-menu-item label="Selected" state="selected"></sc-menu-item>
  <sc-menu-item label="Disabled" state="disabled"></sc-menu-item>
  <sc-menu-item label="Delete account" destructive leading-icon="trash-2"></sc-menu-item>
  <sc-menu-item label="Profile" leading-icon="user" trailing-icon="chevron-right"></sc-menu-item>
</div>
```

## Accessibility

- **Roles:** the dropdown is a `role="menu"` containing `role="menuitem"` rows.
- **Keyboard:** `↑`/`↓` move between items, `Home`/`End` jump to the ends, and `Esc` fires a `close` event for the trigger to handle.
- **Activation:** items emit a `select` event; link items (`href` / `type="link"`) render a real `<a>`.
- **Disabled:** `state="disabled"` sets `aria-disabled` and skips activation.
- **Trigger:** the opening control should expose `aria-haspopup="menu"` and `aria-expanded`, and return focus to itself on close.
