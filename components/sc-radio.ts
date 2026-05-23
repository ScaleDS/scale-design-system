import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { type ScRadioItem } from '@scale/design-system/components/sc-radio-item'
import '@scale/design-system/components/sc-radio-item'

type RadioState = 'default' | 'negative'

@customElement('sc-radio')
export class ScRadio extends LitElement {
  @property({ type: Boolean, reflect: true }) checked = false
  @property({ type: Boolean, reflect: true }) disabled = false
  @property({ reflect: true }) state: RadioState = 'default'
  @property() value = ''
  @property() name = ''

  static styles = css`
    :host {
      display: inline-flex;
      align-items: flex-start;
      gap: var(--sc-space-s);
    }

    .label {
      font-family: var(--sc-type-family-inter), system-ui, sans-serif;
      font-size: var(--sc-type-size-l);
      line-height: var(--sc-type-line-height-l);
      font-weight: var(--sc-type-weight-regular);
      letter-spacing: var(--sc-type-letter-spacing-none);
      color: var(--sc-color-text-secondary);
      cursor: pointer;
      user-select: none;
    }

    :host([disabled]) .label {
      color: var(--sc-color-text-disabled);
      cursor: not-allowed;
    }
  `

  connectedCallback() {
    super.connectedCallback()
    if (this.checked && this.name) {
      const siblings = document.querySelectorAll(`sc-radio[name="${this.name}"]`)
      siblings.forEach((sib: HTMLElement) => {
        if (sib !== this) {
          const radio = sib as ScRadio
          radio.checked = false
        }
      })
    }
  }

  private _item(): ScRadioItem | null {
    return this.shadowRoot?.querySelector('sc-radio-item') ?? null
  }

  private _onItemChange(e: CustomEvent) {
    e.stopPropagation()
    this.checked = e.detail.checked

    if (this.checked && this.name) {
      const siblings = document.querySelectorAll(`sc-radio[name="${this.name}"]`)
      siblings.forEach((sib: HTMLElement) => {
        if (sib !== this) {
          const radio = sib as ScRadio
          radio.checked = false
        }
      })
    }

    this.dispatchEvent(new CustomEvent('change', {
      detail: { checked: this.checked, value: this.value, name: this.name },
      bubbles: true,
      composed: true,
    }))
  }

  private _onLabelClick() {
    const item = this._item()
    if (!item) return
    item.focus()
    item.toggle()
  }

  render() {
    const itemState = this.state === 'negative' ? 'negative' : 'default'

    return html`
      <sc-radio-item
        ?checked=${this.checked}
        ?disabled=${this.disabled}
        state=${itemState}
        @change=${this._onItemChange}
      ></sc-radio-item>
      <span class="label" @click=${this._onLabelClick}><slot></slot></span>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-radio': ScRadio
  }
}
