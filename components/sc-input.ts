import { LitElement, html, css, type PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { labelL, textL } from '@scale/design-system/scss/typography'
import '@scale/design-system/components/sc-help-text'
import { focusRing } from './sc-focus-ring'
import { featherIcon } from './feather'

type InputState = 'default' | 'negative' | 'positive' | 'disabled'

@customElement('sc-input')
export class ScInput extends LitElement {
  static formAssociated = true

  @property({ reflect: true }) state: InputState = 'default'
  @property() label = 'Label'
  @property() placeholder = 'Text'
  @property() value = ''
  @property({ attribute: 'help-text' }) helpText = 'Help text'
  @property({ type: Boolean, attribute: 'show-label', reflect: true }) showLabel = true
  @property({ type: Boolean, attribute: 'show-help-text', reflect: true }) showHelpText = true
  @property({ attribute: 'leading-icon' }) leadingIcon = ''
  @property({ attribute: 'trailing-icon' }) trailingIcon = ''
  @property() type = 'text'
  @property() name = ''
  @property() autocomplete = ''
  @property() inputmode: string | undefined
  @property() pattern: string | undefined
  @property({ type: Boolean, reflect: true }) required = false

  private _internals = this.attachInternals()
  private _initialValue = ''

  get form() { return this._internals.form }
  get validity() { return this._internals.validity }
  get validationMessage() { return this._internals.validationMessage }
  get willValidate() { return this._internals.willValidate }
  checkValidity() { return this._internals.checkValidity() }
  reportValidity() { return this._internals.reportValidity() }

  connectedCallback() {
    super.connectedCallback()
    this._initialValue = this.value
  }

  protected updated(changed: PropertyValues) {
    if (changed.has('value') || changed.has('required')) this._syncFormState()
  }

  private _syncFormState() {
    this._internals.setFormValue(this.value)
    const input = this.shadowRoot?.querySelector('input') ?? undefined
    if (this.required && !this.value) {
      this._internals.setValidity({ valueMissing: true }, 'Please fill out this field.', input)
    } else {
      this._internals.setValidity({})
    }
  }

  formResetCallback() {
    this.value = this._initialValue
  }

  formDisabledCallback(disabled: boolean) {
    this.state = disabled ? 'disabled' : 'default'
  }

  static styles = [
    focusRing,
    css`
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--sc-space-s);
      width: 100%;
    }

    /* ---- Label ---- */
    .label {
      ${labelL}
      color: var(--sc-color-text-secondary);
      margin: 0;
    }

    :host([state='disabled']) .label {
      color: var(--sc-color-text-disabled);
    }

    /* ---- Field ---- */
    .field {
      display: flex;
      align-items: center;
      gap: var(--sc-space-s);
      padding: calc(var(--sc-space-m) - 1px) var(--sc-space-l);
      border-radius: var(--sc-border-radius-m);
      border: 1px solid var(--sc-color-border-primary);
      background: var(--sc-color-background-primary);
      transition: border-color 150ms ease, box-shadow 150ms ease;
      width: 100%;
      box-sizing: border-box;
    }

    .field:focus-within {
      outline: 2px dashed var(--sc-color-border-mono);
      outline-offset: 1px;
      border-color: var(--sc-color-border-selected);
      box-shadow: 0 0 0 1px var(--sc-color-border-selected);
    }

    :host([state='negative']) .field {
      border-color: var(--sc-color-border-negative);
      box-shadow: 0 0 0 1px var(--sc-color-border-negative);
    }

    :host([state='positive']) .field {
      border-color: var(--sc-color-border-positive);
      box-shadow: 0 0 0 1px var(--sc-color-border-positive);
    }

    :host([state='disabled']) .field {
      background: var(--sc-color-background-disabled);
      border-color: var(--sc-color-border-disabled);
    }

    /* ---- Input ---- */
    input {
      ${textL}
      flex: 1;
      min-width: 0;
      border: none;
      background: none;
      outline: none;
      color: var(--sc-color-text-secondary);
      width: 100%;
    }

    input:focus-visible {
      outline: none;
    }

    input::placeholder {
      color: var(--sc-color-text-tertiary);
    }

    input:disabled {
      color: var(--sc-color-text-disabled);
      cursor: not-allowed;
    }

    input:disabled::placeholder {
      color: var(--sc-color-text-disabled);
    }

    /* ---- Icons ---- */
    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      color: var(--sc-color-icon-primary);
      width: 24px;
      height: 24px;
    }

    :host([state='disabled']) .icon {
      color: var(--sc-color-icon-disabled);
    }

    .icon svg {
      display: block;
      width: 20px;
      height: 20px;
    }
  `]

  private _onInput(e: Event) {
    this.value = (e.target as HTMLInputElement).value
    this.dispatchEvent(new CustomEvent('input', { detail: { value: this.value }, bubbles: true, composed: true }))
  }

  private _onChange(e: Event) {
    this.value = (e.target as HTMLInputElement).value
    this.dispatchEvent(new CustomEvent('change', { detail: { value: this.value }, bubbles: true, composed: true }))
  }

  private _helpTextStatus() {
    if (this.state === 'negative') return 'negative'
    if (this.state === 'positive') return 'positive'
    if (this.state === 'disabled') return 'disabled'
    return 'default'
  }

  render() {
    const disabled = this.state === 'disabled'

    return html`
      ${this.showLabel ? html`<p class="label">${this.label}</p>` : ''}

      <div class="field">
        ${this.leadingIcon ? html`<span class="icon">${featherIcon(this.leadingIcon, { width: 20, height: 20 })}</span>` : ''}

        <input
          .value=${this.value}
          placeholder=${this.placeholder}
          ?disabled=${disabled}
          ?required=${this.required}
          type=${this.type}
          name=${this.name}
          autocomplete=${this.autocomplete}
          inputmode=${this.inputmode ?? ''}
          pattern=${this.pattern ?? ''}
          @input=${this._onInput}
          @change=${this._onChange}
        />

        ${this.trailingIcon ? html`<span class="icon">${featherIcon(this.trailingIcon, { width: 20, height: 20 })}</span>` : ''}
      </div>

      ${this.showHelpText ? html`
        <sc-help-text
          size="m"
          status=${this._helpTextStatus()}
          text=${this.helpText}
        ></sc-help-text>
      ` : ''}
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-input': ScInput
  }
}
