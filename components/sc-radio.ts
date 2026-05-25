import { LitElement, html, css, type PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { type ScRadioItem } from '@scale/design-system/components/sc-radio-item'
import '@scale/design-system/components/sc-radio-item'

type RadioState = 'default' | 'negative'

@customElement('sc-radio')
export class ScRadio extends LitElement {
  static formAssociated = true

  @property({ type: Boolean, reflect: true }) checked = false
  @property({ type: Boolean, reflect: true }) disabled = false
  @property({ type: Boolean, reflect: true }) required = false
  @property({ reflect: true }) state: RadioState = 'default'
  @property() value = ''
  @property() name = ''

  private _internals = this.attachInternals()
  private _initialChecked = false

  get form() { return this._internals.form }
  get validity() { return this._internals.validity }
  get validationMessage() { return this._internals.validationMessage }
  get willValidate() { return this._internals.willValidate }
  checkValidity() { return this._internals.checkValidity() }
  reportValidity() { return this._internals.reportValidity() }

  protected updated(changed: PropertyValues) {
    if (changed.has('checked') || changed.has('required')) {
      this._internals.setFormValue(this.checked ? this.value : null)
      if (this.required && !this.checked && !this._anyGroupMemberChecked()) {
        this._internals.setValidity({ valueMissing: true }, 'Please select one of these options.')
      } else {
        this._internals.setValidity({})
      }
    }
  }

  formResetCallback() {
    this.checked = this._initialChecked
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled
  }

  // Scope sibling-lookup to the containing form (if any), then to the root node.
  // Never falls back to `document` — that would cross unrelated radio groups.
  private _groupSiblings(): ScRadio[] {
    if (!this.name) return []
    const scope: ParentNode = this._internals.form ?? (this.getRootNode() as ParentNode)
    return Array.from(scope.querySelectorAll(`sc-radio[name="${CSS.escape(this.name)}"]`)) as ScRadio[]
  }

  private _anyGroupMemberChecked(): boolean {
    return this._groupSiblings().some(r => r.checked)
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

  connectedCallback() {
    super.connectedCallback()
    this._initialChecked = this.checked
    if (this.checked) this._uncheckGroupSiblings()
  }

  private _item(): ScRadioItem | null {
    return this.shadowRoot?.querySelector('sc-radio-item') ?? null
  }

  private _uncheckGroupSiblings() {
    this._groupSiblings().forEach(sib => {
      if (sib !== this) sib.checked = false
    })
  }

  private _onItemChange(e: CustomEvent) {
    e.stopPropagation()
    this.checked = e.detail.checked
    if (this.checked) this._uncheckGroupSiblings()

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
