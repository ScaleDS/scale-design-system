---
tag: sc-table-head
class: ScTableHead
category: data-display
documentedWith: sc-table-dynamic
import: @scale-ds/scale-design-system/components/sc-table-head
dependencies: [sc-checkbox]
props:
  align: { type: enum, default: leading, values: [leading, trailing] }
  selectable: { type: boolean, default: false }
  checked: { type: boolean, default: false }
  indeterminate: { type: boolean, default: false }
  sortable: { type: boolean, default: false }
  sort: { type: enum, default: none, values: [none, ascending, descending] }
  hideDivider: { type: boolean, default: false, attr: hide-divider }
slots: [default]
events: [sort, select-all]
cssParts: [heading, sort, content, checkbox, divider]
roles: [columnheader, table]
source:
  guidance: guidance/components/table.html
  docs: "https://scaledesignsystem.com/components/table/"
---

# sc-table-head

Table header cell with an optional sort control and select-all checkbox

Documented on the same page as `sc-table-dynamic`, which carries the shared
examples, guidelines and accessibility contract. See `sc-table-dynamic.md`.
