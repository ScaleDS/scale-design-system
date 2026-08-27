---
tag: sc-table-basic
class: ScTableBasic
category: data-display
documentedWith: sc-table-dynamic
import: @scale-ds/scale-design-system/components/sc-table-basic
props:
  label: { type: string, default: "" }
  pageSize: { type: number, default: 0, attr: page-size }
  page: { type: number, default: 0 }
slots: [header, default, footer]
events: [sort-change]
roles: [table]
source:
  guidance: guidance/components/table.html
  docs: "https://scaledesignsystem.com/components/table/"
---

# sc-table-basic

Accessible table using CSS subgrid columns with sortable headers, row selection, and optional pagination

Documented on the same page as `sc-table-dynamic`, which carries the shared
examples, guidelines and accessibility contract. See `sc-table-dynamic.md`.
