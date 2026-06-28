import { LitElement, html, css, nothing } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { focusRing } from './sc-focus-ring.js'

// Page controls — the pagination dots used to indicate and switch between
// pages/slides in a carousel or stepper. Built as the WAI-ARIA APG "grouped
// button" carousel slide-picker pattern (native <button> per dot inside a
// role="group"): user testing found this more intuitive for dot pickers than
// the tablist pattern, since dots don't visually read as tabs. The active dot
// carries aria-current="true".
@customElement('sc-page-controls')
export class ScPageControls extends LitElement {
  /** Total number of pages/indicators. Clamped to a minimum of 1. */
  @property({ type: Number, reflect: true }) total = 6
  /** Zero-based index of the active page. Clamped to [0, total - 1]. */
  @property({ type: Number, reflect: true }) current = 0
  /** Accessible name for the indicator group. */
  @property() label = 'Page controls'
  /** Disables all indicators. */
  @property({ type: Boolean, reflect: true }) disabled = false

  private get _count() {
    return Math.max(1, Math.floor(this.total))
  }

  private get _active() {
    return Math.min(Math.max(0, Math.floor(this.current)), this._count - 1)
  }

  static styles = [
    focusRing,
    css`
    :host {
      display: inline-flex;
    }

    .controls {
      display: inline-flex;
      align-items: center;
      gap: var(--sc-space-s);
    }

    .indicator {
      position: relative;
      width: var(--sc-space-s);
      height: var(--sc-space-s);
      padding: 0;
      border: none;
      border-radius: var(--sc-border-radius-xs);
      background: var(--sc-color-background-subtle);
      cursor: pointer;
      transition: background-color 200ms ease;
    }

    /* Expand the tap/hit target to ~24px without affecting the 8px layout box. */
    .indicator::before {
      content: '';
      position: absolute;
      inset: calc(-1 * var(--sc-space-s));
    }

    .indicator:hover {
      background: var(--sc-color-background-neutral-hover);
    }

    .indicator[aria-current='true'] {
      background: var(--sc-color-background-brand);
    }
    .indicator[aria-current='true']:hover {
      background: var(--sc-color-background-brand-hover);
    }

    /* Reset native outline at zero specificity so focusRing's :focus-visible wins. */
    :where(.indicator) {
      outline: none;
    }

    :host([disabled]) .indicator,
    :host([disabled]) .indicator[aria-current='true'] {
      background: var(--sc-color-background-disabled);
      cursor: not-allowed;
      pointer-events: none;
    }
  `]

  /** Move focus to the currently-active indicator. */
  focus(options?: FocusOptions) {
    this.shadowRoot
      ?.querySelector<HTMLButtonElement>('.indicator[aria-current="true"]')
      ?.focus(options)
  }

  private _select(index: number) {
    if (this.disabled || index === this._active) return
    this.current = index
    this.dispatchEvent(
      new CustomEvent('change', {
        detail: { index },
        bubbles: true,
        composed: true,
      }),
    )
  }

  render() {
    const active = this._active
    return html`
      <div class="controls" role="group" aria-label=${this.label}>
        ${Array.from({ length: this._count }, (_, i) => {
          const isActive = i === active
          return html`
            <button
              class="indicator"
              type="button"
              part=${isActive ? 'indicator indicator-active' : 'indicator'}
              aria-label=${`Go to page ${i + 1}`}
              aria-current=${isActive ? 'true' : nothing}
              ?disabled=${this.disabled}
              @click=${() => this._select(i)}
            ></button>
          `
        })}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-page-controls': ScPageControls
  }
}
