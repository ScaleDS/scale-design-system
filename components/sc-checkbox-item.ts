import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { icons } from 'feather-icons'
import { focusRing } from './sc-focus-ring'

type CheckboxItemState = 'default' | 'negative'

@customElement('sc-checkbox-item')
export class ScCheckboxItem extends LitElement {
  @property({ type: Boolean, reflect: true }) checked = false
  @property({ type: Boolean, reflect: true }) disabled = false
  @property({ type: Boolean, reflect: true }) indeterminate = false
  @property({ reflect: true }) state: CheckboxItemState = 'default'

  static styles = [
    focusRing,
    css`
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
      border-radius: var(--sc-border-radius-s);
      border: 1px solid var(--sc-color-border-primary);
      background: var(--sc-color-background-primary);
      cursor: pointer;
      transition: border-color 150ms ease, background 150ms ease, box-shadow 150ms ease;
      box-sizing: border-box;
      outline: none;
    }

    button:disabled {
      cursor: not-allowed;
    }

    /* ---- Hover: unchecked ---- */
    button:not(:disabled):hover {
      border-color: var(--sc-color-border-selected);
    }

    /* ---- Checked / Indeterminate ---- */
    :host([checked]) button,
    :host([indeterminate]) button {
      background: var(--sc-color-background-brand);
      border-color: var(--sc-color-border-brand);
    }

    /* ---- Hover: checked / indeterminate ---- */
    :host([checked]) button:not(:disabled):hover,
    :host([indeterminate]) button:not(:disabled):hover {
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

    /* ---- Disabled: checked / indeterminate ---- */
    :host([checked][disabled]) button,
    :host([indeterminate][disabled]) button {
      background: var(--sc-color-background-disabled);
      border-color: var(--sc-color-border-disabled);
    }

    /* ---- Focus ---- */
    /* Unchecked + focused: thicker selected border */
    :host(:not([checked]):not([indeterminate])) button:focus-visible {
      border-color: var(--sc-color-border-selected);
      border-width: 2px;
    }

    /* ---- Icons ---- */
    .icon {
      display: none;
      color: var(--sc-color-icon-inverse);
      line-height: 0;
      pointer-events: none;
    }

    .icon svg {
      display: block;
      width: 16px;
      height: 16px;
    }

    :host([checked]) .icon-check,
    :host([indeterminate]) .icon-dash {
      display: block;
    }

    :host([checked][disabled]) .icon,
    :host([indeterminate][disabled]) .icon {
      color: var(--sc-color-icon-disabled);
    }
  `]

  toggle() {
    if (this.disabled) return
    this.checked = !this.checked
    this.indeterminate = false
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
        role="checkbox"
        aria-checked=${this.indeterminate ? 'mixed' : this.checked ? 'true' : 'false'}
        ?disabled=${this.disabled}
        @click=${this._onClick}
        @keydown=${this._onKeyDown}
        part="button"
      >
        <span class="icon icon-check" part="icon-check">
          ${unsafeHTML(icons['check'].toSvg({ width: 16, height: 16 }))}
        </span>
        <span class="icon icon-dash" part="icon-dash">
          ${unsafeHTML(icons['minus'].toSvg({ width: 16, height: 16 }))}
        </span>
      </button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-checkbox-item': ScCheckboxItem
  }
}
