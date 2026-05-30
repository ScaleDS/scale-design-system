import { LitElement, html, css, type PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'

type ProgressStatus = 'uploading' | 'positive' | 'negative'

// Presentational status indicator — like sc-divider it has no focusable element,
// so no focusRing. It exposes the WAI-ARIA progressbar role + value attributes on
// the host so assistive tech announces completion.
@customElement('sc-progress-bar')
export class ScProgressBar extends LitElement {
  /** Completion percentage, 0–100. Values outside the range are clamped. */
  @property({ type: Number, reflect: true }) value = 0
  /** Colour of the filled portion. */
  @property({ reflect: true }) status: ProgressStatus = 'uploading'
  /** Accessible name announced by screen readers. */
  @property() label = ''

  private get _pct(): number {
    if (!Number.isFinite(this.value)) return 0
    return Math.min(100, Math.max(0, this.value))
  }

  connectedCallback() {
    super.connectedCallback()
    if (!this.hasAttribute('role')) this.setAttribute('role', 'progressbar')
    this.setAttribute('aria-valuemin', '0')
    this.setAttribute('aria-valuemax', '100')
  }

  protected updated(changed: PropertyValues) {
    if (changed.has('value')) {
      this.setAttribute('aria-valuenow', String(Math.round(this._pct)))
    }
    if (changed.has('label')) {
      if (this.label) this.setAttribute('aria-label', this.label)
      else this.removeAttribute('aria-label')
    }
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .track {
      position: relative;
      width: 100%;
      height: var(--sc-border-width-xl);
      background: var(--sc-color-border-subtle);
      border-radius: var(--sc-border-radius-xs);
      overflow: hidden;
    }

    .fill {
      position: absolute;
      inset: 0 auto 0 0;
      height: 100%;
      border-radius: var(--sc-border-radius-xs);
      background: var(--sc-color-border-brand);
      transition: width 200ms ease, background 200ms ease;
    }

    :host([status='positive']) .fill {
      background: var(--sc-color-border-positive);
    }

    :host([status='negative']) .fill {
      background: var(--sc-color-border-negative);
    }
  `

  render() {
    return html`
      <div class="track" part="track">
        <div class="fill" part="fill" style="width: ${this._pct}%"></div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-progress-bar': ScProgressBar
  }
}
