import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

// Table — the row-major container. Renders as a CSS grid with role="table";
// rows go in the default slot (plus an optional header row in slot="header"
// and an <sc-table-footer> in slot="footer"). The column track sizes are read
// from the header row's cells' `width` attributes (default `auto`), and each
// <sc-table-row> mirrors them via subgrid so columns line up across all rows.
//
// Column widths are configured once, on the header cells — "define columns,
// render rows".
@customElement('sc-table')
export class ScTable extends LitElement {
  /** Accessible name for the table. */
  @property() label = ''
  /** Rows shown per page. `0` (default) disables pagination — all rows show. */
  @property({ type: Number, attribute: 'page-size', reflect: true }) pageSize = 0
  /** Current page, zero-based. */
  @property({ type: Number, reflect: true }) page = 0

  // Body rows in their authored order, captured the first time a sort runs so
  // the "none" step can restore it.
  private _originalOrder: Element[] | null = null

  connectedCallback() {
    super.connectedCallback()
    if (!this.hasAttribute('role')) this.setAttribute('role', 'table')
    this.addEventListener('sort', this._onSort as EventListener)
    this.addEventListener('select', this._onCellSelect as EventListener)
    this.addEventListener('select-all', this._onSelectAll as EventListener)
    this.addEventListener('page-change', this._onPageChange as EventListener)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener('sort', this._onSort as EventListener)
    this.removeEventListener('select', this._onCellSelect as EventListener)
    this.removeEventListener('select-all', this._onSelectAll as EventListener)
    this.removeEventListener('page-change', this._onPageChange as EventListener)
  }

  protected updated() {
    if (this.label) this.setAttribute('aria-label', this.label)
    this._syncColumns()
    // Reflect any author-set initial row selection into the header checkbox.
    this._syncSelectAll()
    this._paginate()
  }

  static styles = css`
    :host {
      display: grid;
      width: 100%;
      box-sizing: border-box;
      background: var(--sc-color-background-primary);
      border: var(--sc-border-width-s) solid var(--sc-color-border-subtle);
      border-radius: var(--sc-border-radius-m);
    }

    /* The footer is a single full-width element, not part of the cell grid. */
    ::slotted(sc-table-footer) {
      grid-column: 1 / -1;
    }
  `

  // Derive grid-template-columns from the header row's cells. Each cell's
  // `width` attribute is a grid track value (e.g. "auto", "1fr",
  // "minmax(0,2fr)", "200px"); default is "auto".
  private _syncColumns() {
    const rows = Array.from(this.children).filter(
      (c) => c.tagName === 'SC-TABLE-ROW',
    ) as HTMLElement[]
    const headerRow =
      rows.find((r) => r.getAttribute('slot') === 'header') ?? rows[0]
    if (!headerRow) return
    const cells = Array.from(headerRow.children) as HTMLElement[]
    if (!cells.length) return
    const template = cells
      .map((c) => c.getAttribute('width') || 'auto')
      .join(' ')
    if (this.style.gridTemplateColumns !== template) {
      this.style.gridTemplateColumns = template
    }
  }

  private _rows() {
    return Array.from(this.children).filter(
      (c) => c.tagName === 'SC-TABLE-ROW',
    )
  }

  private _headerRow() {
    const rows = this._rows()
    return rows.find((r) => r.getAttribute('slot') === 'header') ?? rows[0] ?? null
  }

  private _bodyRows() {
    const header = this._headerRow()
    return this._rows().filter((r) => r !== header)
  }

  // A cell's sort key is its slotted (light-DOM) text — the primary content,
  // not the shadow-rendered secondary line.
  private _cellKey(row: Element, col: number) {
    return (row.children[col]?.textContent ?? '').trim()
  }

  // Treat currency-style strings as numbers ("$1,200" → 1200), but anything
  // with letters ("April 02") stays text and is compared with a numeric-aware
  // locale collation.
  private _numeric(value: string): number | null {
    const cleaned = value.replace(/[$,\s]/g, '')
    if (cleaned !== '' && /^-?\d*\.?\d+$/.test(cleaned)) return parseFloat(cleaned)
    return null
  }

  private _compare(a: string, b: string) {
    const na = this._numeric(a)
    const nb = this._numeric(b)
    if (na !== null && nb !== null) return na - nb
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' })
  }

  private _reorder(ordered: Element[]) {
    const footer = this.querySelector(':scope > [slot="footer"]')
    for (const row of ordered) this.insertBefore(row, footer)
  }

  // Sort the body rows when a header cell reports a new direction. Only one
  // column sorts at a time, so the other headers are reset to "none".
  private _onSort = (e: CustomEvent<{ sort: 'none' | 'ascending' | 'descending' }>) => {
    const target = e.target as HTMLElement
    if (target.tagName !== 'SC-TABLE-HEAD') return
    const header = this._headerRow()
    if (!header) return

    const heads = Array.from(header.children)
    const col = heads.indexOf(target)
    if (col < 0) return

    // Single-column sort: clear the indicator on every other header.
    for (const h of heads) {
      if (h !== target && h.tagName === 'SC-TABLE-HEAD') {
        ;(h as HTMLElement & { sort: string }).sort = 'none'
      }
    }

    const rows = this._bodyRows()
    if (!this._originalOrder) this._originalOrder = rows.slice()

    const direction = e.detail.sort
    if (direction === 'none') {
      this._reorder(this._originalOrder.filter((r) => rows.includes(r)))
    } else {
      const dir = direction === 'ascending' ? 1 : -1
      const sorted = rows.slice().sort(
        (a, b) => dir * this._compare(this._cellKey(a, col), this._cellKey(b, col)),
      )
      this._reorder(sorted)
    }

    // Re-sorting jumps back to the first page of the new ordering.
    this.page = 0
    this._paginate()

    this.dispatchEvent(new CustomEvent('sort-change', {
      detail: { column: col, sort: direction },
      bubbles: true,
      composed: true,
    }))
  }

  // ---- Row selection -------------------------------------------------------
  // The header's select-all checkbox is derived from row state: unchecked when
  // none are selected, indeterminate when some are, checked when all are.

  private _selectCell(row: Element) {
    return Array.from(row.children).find(
      (c) => c.tagName === 'SC-TABLE-CELL' && c.hasAttribute('selectable'),
    ) as (HTMLElement & { checked: boolean }) | undefined
  }

  private _selectableRows() {
    return this._bodyRows().filter((r) => this._selectCell(r))
  }

  private _selectHead() {
    const header = this._headerRow()
    if (!header) return null
    return (
      (Array.from(header.children).find(
        (h) => h.tagName === 'SC-TABLE-HEAD' && h.hasAttribute('selectable'),
      ) as (HTMLElement & { checked: boolean; indeterminate: boolean }) | undefined) ?? null
    )
  }

  // Recompute the header checkbox from current row selection.
  private _syncSelectAll() {
    const head = this._selectHead()
    if (!head) return
    const rows = this._selectableRows()
    if (!rows.length) return
    // Read the property (set synchronously) rather than the attribute, whose
    // reflection lags by an update cycle; fall back to the attribute pre-upgrade.
    const isSelected = (r: Element) =>
      (r as HTMLElement & { selected?: boolean }).selected ?? r.hasAttribute('selected')
    const selected = rows.filter(isSelected).length
    head.checked = selected === rows.length
    head.indeterminate = selected > 0 && selected < rows.length
  }

  // A body row's checkbox toggled → mark that row, then refresh the header.
  private _onCellSelect = (e: CustomEvent<{ checked: boolean }>) => {
    const cell = e.target as HTMLElement
    if (cell.tagName !== 'SC-TABLE-CELL') return
    const row = cell.closest('sc-table-row') as (HTMLElement & { selected: boolean }) | null
    if (row) row.selected = e.detail.checked
    this._syncSelectAll()
  }

  // The header's select-all toggled → set every selectable row + its checkbox.
  private _onSelectAll = (e: CustomEvent<{ checked: boolean }>) => {
    if ((e.target as HTMLElement).tagName !== 'SC-TABLE-HEAD') return
    const checked = e.detail.checked
    for (const row of this._selectableRows()) {
      ;(row as HTMLElement & { selected: boolean }).selected = checked
      const cell = this._selectCell(row)
      if (cell) cell.checked = checked
    }
    this._syncSelectAll()
  }

  // ---- Pagination ----------------------------------------------------------
  // When `pageSize` > 0, only the current page's rows are shown; the footer is
  // driven with the derived page count + current page.

  private _footer() {
    return this.querySelector(':scope > sc-table-footer') as
      (HTMLElement & { total: number; current: number }) | null
  }

  private _paginate() {
    const rows = this._bodyRows()
    const size = this.pageSize
    if (!size || size <= 0) {
      for (const r of rows) (r as HTMLElement).hidden = false
      return
    }
    const pageCount = Math.max(1, Math.ceil(rows.length / size))
    const page = Math.min(Math.max(0, this.page), pageCount - 1)
    if (page !== this.page) this.page = page
    const start = page * size
    const end = start + size
    rows.forEach((r, i) => {
      ;(r as HTMLElement).hidden = i < start || i >= end
    })
    const footer = this._footer()
    if (footer) {
      footer.total = pageCount
      footer.current = page
    }
  }

  private _onPageChange = (e: CustomEvent<{ current: number }>) => {
    if ((e.target as HTMLElement).tagName !== 'SC-TABLE-FOOTER') return
    this.page = e.detail.current
    this._paginate()
  }

  render() {
    return html`
      <slot name="header" @slotchange=${this._syncColumns}></slot>
      <slot @slotchange=${this._syncColumns}></slot>
      <slot name="footer"></slot>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-table': ScTable
  }
}
