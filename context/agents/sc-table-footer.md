---
tag: sc-table-footer
class: ScTableFooter
category: data-display
documentedWith: sc-table-dynamic
import: @scale-ds/scale-design-system/components/sc-table-footer
dependencies: [sc-button, sc-page-controls]
props:
  total: { type: number, default: 6 }
  current: { type: number, default: 0 }
  prevLabel: { type: string, default: Prev, attr: prev-label }
  nextLabel: { type: string, default: Next, attr: next-label }
  label: { type: string, default: Pagination }
events: [page-change]
cssParts: [footer, prev, dots, next]
source:
  guidance: guidance/components/table.html
  docs: "https://scaledesignsystem.com/components/table/"
---

# sc-table-footer

Table footer with previous/next pagination buttons and page indicator dots

Documented on the same page as `sc-table-dynamic`, which carries the shared
examples, guidelines and accessibility contract. See `sc-table-dynamic.md`.
