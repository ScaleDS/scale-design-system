import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import './sc-button'
import './sc-page-controls'

// Table Footer — pagination row: Prev button, page-control dots, Next button.
// Composes the shared <sc-button> and <sc-page-controls>. Emits `page-change`
// with the new zero-based `current` whenever the page changes by any control.
@customElement('sc-table-footer')
export class ScTableFooter extends LitElement {
  /** Total number of pages. */
  @property({ type: Number, reflect: true }) total = 6
  /** Zero-based index of the current page. */
  @property({ type: Number, reflect: true }) current = 0
  /** Label for the previous-page button. */
  @property({ attribute: 'prev-label' }) prevLabel = 'Prev'
  /** Label for the next-page button. */
  @property({ attribute: 'next-label' }) nextLabel = 'Next'
  /** Accessible name for the pagination region. */
  @property() label = 'Pagination'

  connectedCallback() {
    super.connectedCallback()
    if (!this.hasAttribute('role')) this.setAttribute('role', 'navigation')
  }

  protected updated() {
    this.setAttribute('aria-label', this.label)
  }

  private get _count() {
    return Math.max(1, Math.floor(this.total))
  }

  static styles = css`
    :host {
      display: block;
    }

    .footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--sc-space-s);
      padding: var(--sc-space-m) var(--sc-space-l);
    }
  `

  private _go(index: number) {
    const next = Math.min(Math.max(0, index), this._count - 1)
    if (next === this.current) return
    this.current = next
    this.dispatchEvent(new CustomEvent('page-change', {
      detail: { current: next },
      bubbles: true,
      composed: true,
    }))
  }

  private _onDots(e: Event) {
    e.stopPropagation()
    const detail = (e as CustomEvent<{ index: number }>).detail
    this._go(detail.index)
  }

  render() {
    return html`
      <div class="footer" part="footer">
        <sc-button
          part="prev"
          type="text-mono"
          size="m"
          leading-icon="chevron-left"
          ?disabled=${this.current <= 0}
          @click=${() => this._go(this.current - 1)}
        >${this.prevLabel}</sc-button>

        <sc-page-controls
          part="dots"
          total=${this.total}
          current=${this.current}
          @change=${this._onDots}
        ></sc-page-controls>

        <sc-button
          part="next"
          type="text-mono"
          size="m"
          trailing-icon="chevron-right"
          ?disabled=${this.current >= this._count - 1}
          @click=${() => this._go(this.current + 1)}
        >${this.nextLabel}</sc-button>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-table-footer': ScTableFooter
  }
}
