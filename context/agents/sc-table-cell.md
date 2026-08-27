---
tag: sc-table-cell
class: ScTableCell
category: data-display
documentedWith: sc-table-dynamic
import: @scale-ds/scale-design-system/components/sc-table-cell
dependencies: [sc-checkbox]
props:
  align: { type: enum, default: leading, values: [leading, trailing] }
  selectable: { type: boolean, default: false }
  checked: { type: boolean, default: false }
  leadingIcon: { type: string, default: "", attr: leading-icon }
  trailingIcon: { type: string, default: "", attr: trailing-icon }
  secondaryText: { type: string, default: "", attr: secondary-text }
  href: { type: string, default: "" }
  target: { type: enum, default: "", values: [_self, _blank, _parent, _top, ""] }
  rel: { type: string, default: "" }
  hideDivider: { type: boolean, default: false, attr: hide-divider }
slots: [default]
events: [select]
cssParts: [content, checkbox, text, link, secondary, divider]
roles: [cell, table]
source:
  guidance: guidance/components/table.html
  docs: "https://scaledesignsystem.com/components/table/"
---

# sc-table-cell

Table body cell with optional leading/trailing icons, secondary text, link rendering, and a selection checkbox

Documented on the same page as `sc-table-dynamic`, which carries the shared
examples, guidelines and accessibility contract. See `sc-table-dynamic.md`.
