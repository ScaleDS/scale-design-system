---
tag: sc-table-dynamic
class: ScTableDynamic
category: data-display
import: @scale-ds/scale-design-system/components/sc-table-dynamic
dependencies: [sc-table-basic, sc-table-row, sc-table-head, sc-table-cell, sc-table-footer]
props:
  columns: { type: ScTableColumn[], default: "[]" }
  rows: { type: ScTableRowData[], default: "[]" }
  label: { type: string, default: "" }
  pageSize: { type: number, default: 0, attr: page-size }
source:
  guidance: guidance/components/table.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-table-basic.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=6410-10724"
  framer: "https://scaleframer.framer.website/components/table"
  docs: "https://scaledesignsystem.com/components/table/"
---

# sc-table-dynamic

Structured grids of rows and columns for displaying, organising, and comparing large sets of data.

## When to use

tabular data with sorting, selection, and pagination. Reach for `sc-table-dynamic` first; drop to the building blocks only when you need bespoke layout.

## Do

- Reach for `sc-table-dynamic` first; drop to the building blocks only for bespoke layouts.
- Right-align numeric columns and keep headers concise and sortable where it helps.
- Paginate large data sets rather than rendering thousands of rows at once.

## Don't

- Don’t use a table for layout — it’s for tabular data with real rows and columns.
- Don’t make every column sortable if sorting most of them is meaningless.
- Don’t hide critical actions behind horizontal scroll on narrow screens.

## Examples

### Dynamic (data-driven)

The compact path: pass `.columns` + `.rows` and `sc-table-dynamic` generates the markup, delegating sorting, selection, and pagination to `sc-table-basic`. The table holds no data of its own — you own the rows. Click a header to sort.

```html
({
  name, role: roles[i % roles.length], status: statuses[i % statuses.length],
  score: (i * 13 % 90) + 10, updated: days[i],
}))

const table = document.querySelector('sc-table-dynamic')
table.columns = columns
table.rows = rows">
        <sc-table-dynamic id="scd-table-default" label="Team" page-size="8"></sc-table-dynamic>
```

### Fetched from an API

The end-to-end dynamic pattern — fetch JSON, map it into rows, and assign `.rows`. This table is populated live from a public REST endpoint on load.

```html
({
  name: u.name, email: u.email, company: u.company.name, city: u.address.city,
}))">
        <sc-table-dynamic id="scd-table-fetch" label="Users" page-size="5"></sc-table-dynamic>
```

### Bank account transactions

Cell values can be Lit templates, not just text. Here a select column drives row selection, `desc` renders an avatar + reference line, and `debit`/`credit` are colour-coded amounts.

```html
({
  selected: i === 0,
  date: t.date,
  desc: html`<sc-avatar size=s alt=${t.name}></sc-avatar> ${t.name}`,
  debit:  t.debit  ? html`<span class=neg>${t.debit}</span>`  : '',
  credit: t.credit ? html`<span class=pos>${t.credit}</span>` : '',
  balance: t.balance,
}))">
        <sc-table-dynamic id="scd-table-bank" label="Bank account transactions" page-size="8"></sc-table-dynamic>
```

### Email

Icon columns via `leadingIcon(row)` (star, attachment) and a two-line cell via `secondaryText(row)` for the message preview.

```html
r.starred ? 'star' : '' },
  { key: 'sender',  label: 'Sender',  sortable: true },
  { key: 'subject', label: 'Subject', sortable: true, width: 'minmax(0,1fr)',
                    secondaryText: (r) => r.preview },
  { key: 'attach',  leadingIcon: (r) => r.attachment ? 'paperclip' : '' },
  { key: 'date',    label: 'Date', align: 'trailing' },
]">
        <sc-table-dynamic id="scd-table-email" label="Email" page-size="8"></sc-table-dynamic>
```

### Repo

Link columns via `href(row)` render real anchors, and the author cell is an avatar + name template.

```html
`/commit/${r.commit}` },
  { key: 'message', label: 'Message', sortable: true, width: 'minmax(0,1fr)' },
  { key: 'date',    label: 'Date',    sortable: true, align: 'trailing' },
  { key: 'issues',  label: 'Issues',  sortable: true, align: 'trailing', href: (r) => `/issues/${r.issues}` },
]">
        <sc-table-dynamic id="scd-table-repo" label="Repository commits" page-size="8"></sc-table-dynamic>
```

### Basic (hand-composed)

Compose rows and cells yourself for full control. A `header` row holds `sc-table-head` cells; `sortable` turns a head into a sort control; `selected` paints the active row.

```html
<sc-table-basic label="Team">
  <sc-table-row header slot="header">
    <sc-table-head sortable width="minmax(0,1fr)">Name</sc-table-head>
    <sc-table-head sortable width="minmax(0,1fr)">Role</sc-table-head>
    <sc-table-head sortable align="trailing" width="auto">Score</sc-table-head>
  </sc-table-row>
  <sc-table-row selected>
    <sc-table-cell>Ada Lovelace</sc-table-cell>
    <sc-table-cell>Engineer</sc-table-cell>
    <sc-table-cell align="trailing">88</sc-table-cell>
  </sc-table-row>
  <sc-table-row>
    <sc-table-cell>Alan Turing</sc-table-cell>
    <sc-table-cell>Researcher</sc-table-cell>
    <sc-table-cell align="trailing">74</sc-table-cell>
  </sc-table-row>
  <sc-table-row>
    <sc-table-cell>Grace Hopper</sc-table-cell>
    <sc-table-cell>Designer</sc-table-cell>
    <sc-table-cell align="trailing">61</sc-table-cell>
  </sc-table-row>
</sc-table-basic>
```

### Building blocks

The four primitives the layers above are built from — `sc-table-head`, `sc-table-cell`, `sc-table-footer`, and `sc-table-row`.

```html
<div style="display:flex;flex-direction:column;gap:var(--sc-space-l)">
  <div style="width:260px;border:1px solid var(--sc-color-border-subtle)">
    <sc-table-head sortable sort="ascending">Name</sc-table-head>
  </div>
  <div style="width:260px;border:1px solid var(--sc-color-border-subtle)">
    <sc-table-cell secondary-text="ada@example.com" leading-icon="user">Ada Lovelace</sc-table-cell>
  </div>
  <div style="width:320px;border:1px solid var(--sc-color-border-subtle)">
    <sc-table-footer total="6" current="2"></sc-table-footer>
  </div>
</div>
```

## Accessibility

- **Roles:** the grid exposes `role="table"` with `role="row"`, `role="columnheader"`, and `role="cell"` on its parts.
- **Name:** the `label` sets the table’s `aria-label`; always provide one.
- **Sort:** a sortable header reflects the current direction with `aria-sort` (`ascending` / `descending`).
- **Selection:** selectable columns render real `sc-checkbox`es with their own labels.
- **Links & icons:** `href` columns render real anchors; leading icons are decorative, so the cell text must carry the meaning.
