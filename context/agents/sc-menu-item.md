---
tag: sc-menu-item
class: ScMenuItem
category: navigation
documentedWith: sc-menu-dropdown
import: @scale-ds/scale-design-system/components/sc-menu-item
props:
  type: { type: enum, default: row, values: [row, button, link] }
  state: { type: enum, default: default, values: [default, selected, selected-open, disabled] }
  destructive: { type: boolean, default: false }
  label: { type: string, default: "" }
  href: { type: string, default: "" }
  leadingIcon: { type: string, default: "", attr: leading-icon }
  trailingIcon: { type: string, default: "", attr: trailing-icon }
slots: [default]
events: [select]
roles: [menuitem]
source:
  guidance: guidance/components/menu.html
  docs: "https://scaledesignsystem.com/components/menu/"
---

# sc-menu-item

Menu row with leading/trailing icons, label, link or button behaviour, and selection states

Documented on the same page as `sc-menu-dropdown`, which carries the shared
examples, guidelines and accessibility contract. See `sc-menu-dropdown.md`.
