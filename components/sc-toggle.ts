import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('sc-toggle')
export class ScToggle extends LitElement {
  @property({ type: Boolean, reflect: true }) checked = false
  @property({ type: Boolean, reflect: true }) disabled = false

  static styles = css`
    :host {
      display: inline-flex;
    }

    button {
      position: relative;
      width: 66px;
      height: 28px;
      border-radius: 999px;
      border: none;
      padding: 0;
      cursor: pointer;
      background: var(--sc-color-background-neutral);
      transition: background 200ms ease;
      flex-shrink: 0;
    }

    :host([checked]) button {
      background: var(--sc-color-background-brand);
    }

    :host([disabled]) button {
      opacity: 0.4;
      cursor: not-allowed;
    }

    .knob {
      position: absolute;
      top: 2px;
      left: 2px;
      width: 40px;
      height: 24px;
      border-radius: 999px;
      background: white;
      box-shadow:
        0px 0px 2px 0px rgba(0, 0, 0, 0.08),
        0px 6px 4px -4px rgba(0, 0, 0, 0.08);
      transition: transform 200ms ease;
    }

    :host([checked]) .knob {
      /* track(66) - knob(40) - right-margin(2) - left-start(2) = 22px */
      transform: translateX(22px);
    }
  `

  private _onClick() {
    if (this.disabled) return
    this.checked = !this.checked
    this.dispatchEvent(new CustomEvent('change', { detail: { checked: this.checked }, bubbles: true, composed: true }))
  }

  render() {
    return html`
      <button
        role="switch"
        aria-checked=${this.checked}
        ?disabled=${this.disabled}
        @click=${this._onClick}
      >
        <span class="knob"></span>
      </button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-toggle': ScToggle
  }
}
