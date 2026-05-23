import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

type RadioItemState = 'default' | 'negative'

@customElement('sc-radio-item')
export class ScRadioItem extends LitElement {
  @property({ type: Boolean, reflect: true }) checked = false
  @property({ type: Boolean, reflect: true }) disabled = false
  @property({ reflect: true }) state: RadioItemState = 'default'

  static styles = css`
    :host {
      display: inline-flex;
      flex-shrink: 0;
    }

    button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      padding: 0;
      appearance: none;
      -webkit-appearance: none;
      border-radius: 50%;
      border: 1px solid var(--sc-color-border-primary);
      background: var(--sc-color-background-primary);
      cursor: pointer;
      transition: border-color 150ms ease, background 150ms ease, box-shadow 150ms ease;
      box-sizing: border-box;
      outline: none;
      position: relative;
    }

    button:disabled {
      cursor: not-allowed;
    }

    /* ---- Hover: unchecked ---- */
    button:not(:disabled):hover {
      border-color: var(--sc-color-border-selected);
    }

    /* ---- Checked ---- */
    :host([checked]) button {
      background: var(--sc-color-background-brand);
      border-color: var(--sc-color-border-brand);
    }

    /* ---- Hover: checked ---- */
    :host([checked]) button:not(:disabled):hover {
      background: var(--sc-color-background-brand-hover);
      border-color: var(--sc-color-border-brand);
    }

    /* ---- Negative ---- */
    :host([state='negative']) button {
      border-color: var(--sc-color-border-negative);
      border-width: 2px;
    }

    /* ---- Disabled: unchecked ---- */
    :host([disabled]) button {
      background: var(--sc-color-background-disabled);
      border-color: var(--sc-color-border-disabled);
    }

    /* ---- Disabled: checked ---- */
    :host([checked][disabled]) button {
      background: var(--sc-color-background-disabled);
      border-color: var(--sc-color-border-disabled);
    }

    /* ---- Focus ---- */
    button:focus-visible {
      outline: 2px solid var(--sc-color-border-focus);
      outline-offset: 2px;
    }

    /* Unchecked + focused: thicker selected border */
    :host(:not([checked])) button:focus-visible {
      border-color: var(--sc-color-border-selected);
      border-width: 2px;
    }

    /* ---- Dot ---- */
    .dot {
      display: none;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: var(--sc-color-icon-inverse);
      pointer-events: none;
    }

    :host([checked]) .dot {
      display: block;
    }

    :host([checked][disabled]) .dot {
      background: var(--sc-color-icon-disabled);
    }
  `

  toggle() {
    if (this.disabled) return
    if (this.checked) return
    this.checked = true
    this.dispatchEvent(new CustomEvent('change', {
      detail: { checked: this.checked },
      bubbles: true,
      composed: true,
    }))
  }

  focus(options?: FocusOptions) {
    this.shadowRoot?.querySelector('button')?.focus(options)
  }

  private _onClick() {
    this.toggle()
  }

  private _onKeyDown(e: KeyboardEvent) {
    if (e.key === ' ') {
      e.preventDefault()
      this.toggle()
    }
    if (e.key === 'Enter') e.preventDefault()
  }

  render() {
    return html`
      <button
        type="button"
        role="radio"
        aria-checked=${this.checked ? 'true' : 'false'}
        ?disabled=${this.disabled}
        @click=${this._onClick}
        @keydown=${this._onKeyDown}
        part="button"
      >
        <span class="dot" part="dot"></span>
      </button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-radio-item': ScRadioItem
  }
}
