---
tag: sc-table-row
class: ScTableRow
category: data-display
documentedWith: sc-table-dynamic
import: @scale-ds/scale-design-system/components/sc-table-row
props:
  selected: { type: boolean, default: false }
  header: { type: boolean, default: false }
slots: [default]
cssProperties: [--sc-table-row-background]
roles: [row]
source:
  guidance: guidance/components/table.html
  docs: "https://scaledesignsystem.com/components/table/"
---

# sc-table-row

Table row container using CSS subgrid for column alignment, in body or header variants

Documented on the same page as `sc-table-dynamic`, which carries the shared
examples, guidelines and accessibility contract. See `sc-table-dynamic.md`.
