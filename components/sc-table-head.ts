import { LitElement, html, css, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { heading2xs } from '@scale-ds/scale-design-system/scss/typography'
import { focusRing } from './sc-focus-ring.js'
import { featherIcon } from './feather.js'
import './sc-checkbox.js'

type TableHeadAlign = 'leading' | 'trailing'
type TableHeadSort = 'none' | 'ascending' | 'descending'

// Table Head — a column header cell. Defaults to a static label; set `sortable`
// to make it an activatable sort control (native <button>, chevron, and a
// reflected `aria-sort`). The host carries role="columnheader"; the parent
// table/row supplies role="table"/"row".
@customElement('sc-table-head')
export class ScTableHead extends LitElement {
  /** Horizontal alignment of the header content. */
  @property({ reflect: true }) align: TableHeadAlign = 'leading'
  /** Renders a leading select-all checkbox. */
  @property({ type: Boolean, reflect: true }) selectable = false
  /** Checkbox checked state (when `selectable`). */
  @property({ type: Boolean, reflect: true }) checked = false
  /** Checkbox indeterminate state — "some rows selected" (when `selectable`). */
  @property({ type: Boolean, reflect: true }) indeterminate = false
  /** Makes the header an activatable sort control. */
  @property({ type: Boolean, reflect: true }) sortable = false
  /** Current sort direction; drives the chevron and `aria-sort`. */
  @property({ reflect: true }) sort: TableHeadSort = 'none'
  /** Hides the bottom divider. */
  @property({ type: Boolean, attribute: 'hide-divider', reflect: true }) hideDivider = false

  connectedCallback() {
    super.connectedCallback()
    if (!this.hasAttribute('role')) this.setAttribute('role', 'columnheader')
  }

  protected updated() {
    if (this.sortable && this.sort !== 'none') this.setAttribute('aria-sort', this.sort)
    else this.removeAttribute('aria-sort')
  }

  static styles = [focusRing, css`
    :host {
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .content {
      display: flex;
      align-items: center;
      gap: var(--sc-space-s);
      height: 56px;
      padding: var(--sc-space-l);
      box-sizing: border-box;
      width: 100%;
      color: var(--sc-color-text-primary);
      ${heading2xs}
    }

    :host([align='trailing']) .content {
      justify-content: flex-end;
    }

    /* Sort control wraps only the label + chevron (kept a sibling of the
       optional checkbox, never its parent — interactive-in-button is invalid). */
    .sort {
      display: inline-flex;
      align-items: center;
      gap: var(--sc-space-s);
      min-width: 0;
      padding: 0;
      background: none;
      border: none;
      cursor: pointer;
      color: inherit;
      font: inherit;
      text-align: inherit;
      border-radius: var(--sc-border-radius-xs);
    }

    /* Zero-specificity reset so focusRing's :focus-visible always wins. */
    :where(.sort) {
      outline: none;
    }

    .heading {
      min-width: 0;
      word-break: break-word;
    }

    svg {
      display: block;
      flex-shrink: 0;
      color: var(--sc-color-icon-primary);
    }

    .divider {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: var(--sc-border-width-s);
      background: var(--sc-color-border-primary);
    }
  `]

  private _onSort() {
    const next: TableHeadSort =
      this.sort === 'ascending' ? 'descending'
      : this.sort === 'descending' ? 'none'
      : 'ascending'
    this.sort = next
    this.dispatchEvent(new CustomEvent('sort', {
      detail: { sort: next },
      bubbles: true,
      composed: true,
    }))
  }

  private _onCheckboxChange(e: Event) {
    e.stopPropagation()
    const cb = e.target as HTMLElement & { checked: boolean; indeterminate: boolean }
    this.checked = cb.checked
    this.indeterminate = cb.indeterminate
    this.dispatchEvent(new CustomEvent('select-all', {
      detail: { checked: this.checked },
      bubbles: true,
      composed: true,
    }))
  }

  render() {
    const chevron = this.sort === 'ascending' ? 'chevron-up' : 'chevron-down'
    const heading = html`<span class="heading" part="heading"><slot></slot></span>`
    const label = this.sortable
      ? html`<button class="sort" part="sort" type="button" @click=${this._onSort}>
          ${heading}
          ${featherIcon(chevron, { width: 16, height: 16 })}
        </button>`
      : heading

    return html`
      <div class="content" part="content">
        ${this.selectable
          ? html`<sc-checkbox
              part="checkbox"
              ?checked=${this.checked}
              ?indeterminate=${this.indeterminate}
              @change=${this._onCheckboxChange}
            ></sc-checkbox>`
          : nothing}
        ${label}
      </div>
      ${this.hideDivider ? nothing : html`<span class="divider" part="divider"></span>`}
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-table-head': ScTableHead
  }
}
