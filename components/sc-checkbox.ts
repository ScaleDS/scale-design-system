import { LitElement, html, css, type PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { type ScCheckboxItem } from '@scale/design-system/components/sc-checkbox-item'
import '@scale/design-system/components/sc-checkbox-item'

type CheckboxState = 'default' | 'negative' | 'positive'

@customElement('sc-checkbox')
export class ScCheckbox extends LitElement {
  static formAssociated = true

  @property({ type: Boolean, reflect: true }) checked = false
  @property({ type: Boolean, reflect: true }) disabled = false
  @property({ type: Boolean, reflect: true }) indeterminate = false
  @property({ type: Boolean, reflect: true }) required = false
  @property({ reflect: true }) state: CheckboxState = 'default'
  @property() value = 'on'
  @property() name = ''

  private _internals = this.attachInternals()
  private _initialChecked = false

  get form() { return this._internals.form }
  get validity() { return this._internals.validity }
  get validationMessage() { return this._internals.validationMessage }
  get willValidate() { return this._internals.willValidate }
  checkValidity() { return this._internals.checkValidity() }
  reportValidity() { return this._internals.reportValidity() }

  connectedCallback() {
    super.connectedCallback()
    this._initialChecked = this.checked
  }

  protected updated(changed: PropertyValues) {
    if (changed.has('checked') || changed.has('required')) {
      this._internals.setFormValue(this.checked ? this.value : null)
      const anchor = this.shadowRoot?.querySelector('sc-checkbox-item') ?? undefined
      if (this.required && !this.checked) {
        this._internals.setValidity({ valueMissing: true }, 'Please check this box if you want to proceed.', anchor as HTMLElement | undefined)
      } else {
        this._internals.setValidity({})
      }
    }
  }

  formResetCallback() {
    this.checked = this._initialChecked
    this.indeterminate = false
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled
  }

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

  private _item(): ScCheckboxItem | null {
    return this.shadowRoot?.querySelector('sc-checkbox-item') ?? null
  }

  private _onItemChange(e: CustomEvent) {
    // Stop sc-checkbox-item's own event from escaping — sc-checkbox fires its own
    e.stopPropagation()
    this.checked = e.detail.checked
    this.indeterminate = false
    this.dispatchEvent(new CustomEvent('change', {
      detail: { checked: this.checked, value: this.value },
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
      <sc-checkbox-item
        ?checked=${this.checked}
        ?disabled=${this.disabled}
        ?indeterminate=${this.indeterminate}
        state=${itemState}
        @change=${this._onItemChange}
      ></sc-checkbox-item>
      <span class="label" @click=${this._onLabelClick}><slot></slot></span>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-checkbox': ScCheckbox
  }
}
