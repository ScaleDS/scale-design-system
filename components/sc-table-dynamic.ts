import { LitElement, html, css, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import './sc-table-basic'
import './sc-table-row'
import './sc-table-head'
import './sc-table-cell'
import './sc-table-footer'

/** A column definition for `sc-table-dynamic`. */
export interface ScTableColumn {
  /** Key used to look up each row's cell value (`row[key]`). */
  key: string
  /** Header content (string or a Lit template). */
  label?: unknown
  /** Adds a sort control to this column's header. */
  sortable?: boolean
  /** Turns this into the select column (select-all header + per-row checkbox). */
  selectable?: boolean
  /** Horizontal alignment of the header and cells. */
  align?: 'leading' | 'trailing'
  /** Grid track value for the column width (e.g. `auto`, `minmax(0,1fr)`). */
  width?: string
  /** Per-row muted second line. */
  secondaryText?: (row: ScTableRowData) => string | undefined
  /** Per-row href — when returned, the cell renders as a real link. */
  href?: (row: ScTableRowData) => string | undefined
  /** Per-row leading Feather icon name. */
  leadingIcon?: (row: ScTableRowData) => string | undefined
  /** Per-row trailing Feather icon name. */
  trailingIcon?: (row: ScTableRowData) => string | undefined
}

/** A row of data. Cell values are looked up by column `key`; the value may be a
 *  string, number, or a Lit template for rich content. */
export interface ScTableRowData {
  /** Initial selected state (for a `selectable` column). */
  selected?: boolean
  [key: string]: unknown
}

// Data-driven table — the compact counterpart to composing <sc-table-basic> from
// <sc-table-row>/<sc-table-head>/<sc-table-cell> by hand. Pass `columns` +
// `rows` and it generates that markup, delegating all sorting, selection, and
// pagination to the underlying <sc-table-basic>. Define the columns once, render the
// rows from data — no per-cell boilerplate.
@customElement('sc-table-dynamic')
export class ScTableDynamic extends LitElement {
  /** Column definitions (header + per-column behaviour). */
  @property({ attribute: false }) columns: ScTableColumn[] = []
  /** Row data; cell values are read by column `key`. */
  @property({ attribute: false }) rows: ScTableRowData[] = []
  /** Accessible name for the table. */
  @property() label = ''
  /** Rows per page. `0` (default) shows all rows and omits the footer. */
  @property({ type: Number, attribute: 'page-size' }) pageSize = 0

  static styles = css`
    :host {
      display: block;
    }
    sc-table-basic {
      width: 100%;
    }
  `

  render() {
    const cols = this.columns
    return html`
      <sc-table-basic
        label=${this.label || nothing}
        page-size=${this.pageSize > 0 ? this.pageSize : nothing}
      >
        <sc-table-row header slot="header">
          ${cols.map((c) => html`<sc-table-head
            ?sortable=${!!c.sortable}
            ?selectable=${!!c.selectable}
            align=${c.align ?? 'leading'}
            width=${c.width ?? 'minmax(0, 1fr)'}
          >${c.label ?? nothing}</sc-table-head>`)}
        </sc-table-row>

        ${this.rows.map((r) => html`<sc-table-row ?selected=${!!r.selected}>
          ${cols.map((c) => html`<sc-table-cell
            align=${c.align ?? 'leading'}
            ?selectable=${!!c.selectable}
            ?checked=${!!c.selectable && !!r.selected}
            secondary-text=${c.secondaryText?.(r) ?? nothing}
            href=${c.href?.(r) ?? nothing}
            leading-icon=${c.leadingIcon?.(r) ?? nothing}
            trailing-icon=${c.trailingIcon?.(r) ?? nothing}
          >${c.selectable ? nothing : (r[c.key] ?? nothing)}</sc-table-cell>`)}
        </sc-table-row>`)}

        ${this.pageSize > 0
          ? html`<sc-table-footer slot="footer"></sc-table-footer>`
          : nothing}
      </sc-table-basic>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-table-dynamic': ScTableDynamic
  }
}
