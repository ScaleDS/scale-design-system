import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

// Table Row — the row-major wrapper. It lays its head/cell children onto the
// parent <sc-table-basic>'s columns via CSS subgrid, so columns stay aligned across
// every row while each row remains a real box that can carry hover, selection,
// and zebra backgrounds. Host carries role="row".
@customElement('sc-table-row')
export class ScTableRow extends LitElement {
  /** Marks the row as selected (mirrors the row-select checkbox). */
  @property({ type: Boolean, reflect: true }) selected = false
  /** Header row — opts out of the hover treatment. */
  @property({ type: Boolean, reflect: true }) header = false

  connectedCallback() {
    super.connectedCallback()
    if (!this.hasAttribute('role')) this.setAttribute('role', 'row')
  }

  static styles = css`
    :host {
      display: grid;
      grid-column: 1 / -1;
      grid-template-columns: subgrid;
      align-items: stretch;
      background: var(--sc-table-row-background, transparent);
      transition: background-color 200ms ease;
    }

    /* Pagination hides off-page rows; :host wins over the UA [hidden] rule. */
    :host([hidden]) {
      display: none;
    }

    :host(:not([header]):hover) {
      --sc-table-row-background: var(--sc-color-background-hover);
    }

    :host([selected]) {
      --sc-table-row-background: var(--sc-color-background-selected);
    }
  `

  render() {
    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-table-row': ScTableRow
  }
}
