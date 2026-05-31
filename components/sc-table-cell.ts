import { LitElement, html, css, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { textL, textM, linkL } from '@scale/design-system/scss/typography'
import { focusRing } from './sc-focus-ring'
import { featherIcon } from './feather'
import './sc-checkbox'

type TableCellAlign = 'leading' | 'trailing'

// Table Cell — a body cell. The default slot holds the primary content: plain
// text, or composed children like <sc-badge>, <sc-toggle>, <sc-button>,
// <sc-avatar>, or a link. `secondary-text` adds a muted second line; the
// leading/trailing icon attrs and `selectable` checkbox mirror the Figma
// anatomy. The host carries role="cell"; the parent table/row supplies
// role="table"/"row".
@customElement('sc-table-cell')
export class ScTableCell extends LitElement {
  /** Horizontal alignment of the cell content. */
  @property({ reflect: true }) align: TableCellAlign = 'leading'
  /** Renders a leading row-select checkbox. */
  @property({ type: Boolean, reflect: true }) selectable = false
  /** Checkbox checked state (when `selectable`). */
  @property({ type: Boolean, reflect: true }) checked = false
  /** Leading Feather icon name. */
  @property({ attribute: 'leading-icon' }) leadingIcon = ''
  /** Trailing Feather icon name. */
  @property({ attribute: 'trailing-icon' }) trailingIcon = ''
  /** Muted second line rendered under the primary content. */
  @property({ attribute: 'secondary-text' }) secondaryText = ''
  /** When set, the primary content renders as a real link (Link L Semi Bold,
   *  Text Link colour) instead of plain text. */
  @property() href = ''
  /** Link target (used with `href`). */
  @property() target: '_self' | '_blank' | '_parent' | '_top' | '' = ''
  /** Link rel (used with `href`). */
  @property() rel = ''
  /** Hides the bottom divider. */
  @property({ type: Boolean, attribute: 'hide-divider', reflect: true }) hideDivider = false

  connectedCallback() {
    super.connectedCallback()
    if (!this.hasAttribute('role')) this.setAttribute('role', 'cell')
  }

  static styles = [focusRing, css`
    :host {
      display: flex;
      flex-direction: column;
      justify-content: center;
      position: relative;
    }

    .content {
      display: flex;
      align-items: center;
      gap: var(--sc-space-s);
      padding: var(--sc-space-m) var(--sc-space-l);
      box-sizing: border-box;
      width: 100%;
    }

    :host([align='trailing']) .content {
      justify-content: flex-end;
    }

    .text {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }

    :host([align='trailing']) .text {
      align-items: flex-end;
      text-align: right;
    }

    .primary {
      color: var(--sc-color-text-secondary);
      word-break: break-word;
      ${textL}
    }

    .secondary {
      color: var(--sc-color-text-tertiary);
      word-break: break-word;
      ${textM}
    }

    /* Link variant — a real anchor styled Link L Semi Bold / Text Link. */
    .link {
      color: var(--sc-color-text-link);
      text-decoration: none;
      word-break: break-word;
      border-radius: var(--sc-border-radius-xs);
      ${linkL}
    }
    .link:hover {
      color: var(--sc-color-text-link-hover);
      text-decoration: underline;
    }
    .link:active {
      color: var(--sc-color-text-link-pressed);
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
      background: var(--sc-color-border-subtle);
    }
  `]

  private _onCheckboxChange(e: Event) {
    e.stopPropagation()
    const cb = e.target as HTMLElement & { checked: boolean }
    this.checked = cb.checked
    this.dispatchEvent(new CustomEvent('select', {
      detail: { checked: this.checked },
      bubbles: true,
      composed: true,
    }))
  }

  render() {
    return html`
      <div class="content" part="content">
        ${this.selectable
          ? html`<sc-checkbox
              part="checkbox"
              ?checked=${this.checked}
              @change=${this._onCheckboxChange}
            ></sc-checkbox>`
          : nothing}
        ${this.leadingIcon ? featherIcon(this.leadingIcon, { width: 24, height: 24 }) : nothing}
        <div class="text" part="text">
          ${this.href
            ? html`<a
                class="link"
                part="link"
                href=${this.href}
                target=${this.target || nothing}
                rel=${(this.target === '_blank' ? this.rel || 'noopener noreferrer' : this.rel) || nothing}
              ><slot></slot></a>`
            : html`<span class="primary"><slot></slot></span>`}
          ${this.secondaryText
            ? html`<span class="secondary" part="secondary">${this.secondaryText}</span>`
            : nothing}
        </div>
        ${this.trailingIcon ? featherIcon(this.trailingIcon, { width: 24, height: 24 }) : nothing}
      </div>
      ${this.hideDivider ? nothing : html`<span class="divider" part="divider"></span>`}
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-table-cell': ScTableCell
  }
}
