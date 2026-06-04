import { LitElement, html, css, type PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { labelL, textL, text2xl } from '@scale-ds/scale-design-system/scss/typography'
import { focusRing } from './sc-focus-ring.js'
import '@scale-ds/scale-design-system/components/sc-help-text'

type PinSize = 'l' | 'xl'
type PinState = 'default' | 'negative' | 'positive'

let _uid = 0

@customElement('sc-input-pin')
export class ScInputPin extends LitElement {
  static formAssociated = true

  /** Number of digit cells. */
  @property({ type: Number, reflect: true }) length = 4
  @property({ reflect: true }) size: PinSize = 'l'
  @property({ reflect: true }) state: PinState = 'default'
  @property() label = 'Label'
  @property({ type: Boolean, attribute: 'show-label', reflect: true }) showLabel = true
  @property({ attribute: 'help-text' }) helpText = 'Help text'
  @property({ type: Boolean, attribute: 'show-help-text', reflect: true }) showHelpText = true
  @property() name = ''
  @property({ type: Boolean, reflect: true }) required = false
  @property({ type: Boolean, reflect: true }) disabled = false

  /** Per-cell digits (source of truth; `value` is derived). */
  @state() private _cells: string[] = []

  private _internals = this.attachInternals()
  private readonly _uid = ++_uid

  /** The entered code, e.g. `"1234"`. */
  get value(): string {
    return this._cells.join('')
  }
  set value(v: string) {
    const digits = (v ?? '').replace(/\D/g, '').split('')
    this._cells = Array.from({ length: this.length }, (_, i) => digits[i] ?? '')
    this.requestUpdate()
  }

  get form() { return this._internals.form }
  get validity() { return this._internals.validity }
  get validationMessage() { return this._internals.validationMessage }
  get willValidate() { return this._internals.willValidate }
  checkValidity() { return this._internals.checkValidity() }
  reportValidity() { return this._internals.reportValidity() }

  connectedCallback() {
    super.connectedCallback()
    if (!this._cells.length) {
      const attr = this.getAttribute('value') ?? ''
      const digits = attr.replace(/\D/g, '').split('')
      this._cells = Array.from({ length: this.length }, (_, i) => digits[i] ?? '')
    }
  }

  protected willUpdate(changed: PropertyValues) {
    // Keep the cell array sized to `length`, preserving existing digits.
    if (changed.has('length')) {
      const cur = this._cells
      this._cells = Array.from({ length: this.length }, (_, i) => cur[i] ?? '')
    }
  }

  protected updated() {
    this._syncForm()
  }

  formResetCallback() {
    this.value = ''
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled
  }

  static styles = [
    focusRing,
    css`
    :host {
      display: inline-block;
    }

    .root {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: var(--sc-space-s);
    }

    .label {
      ${labelL}
      color: var(--sc-color-text-secondary);
      cursor: default;
    }

    .fields {
      display: flex;
      gap: var(--sc-space-s);
    }

    .cell {
      box-sizing: border-box;
      text-align: center;
      padding: var(--sc-space-m) var(--sc-space-s);
      margin: 0;
      background: var(--sc-color-background-primary);
      border: var(--sc-border-width-s) solid var(--sc-color-border-primary);
      border-radius: var(--sc-border-radius-m);
      color: var(--sc-color-text-secondary);
      caret-color: var(--sc-color-border-focus);
      font-family: var(--sc-type-family-inter), system-ui, sans-serif;
      transition: border-color 150ms ease, box-shadow 150ms ease;
    }

    :host([size='l']) .cell {
      width: 48px;
      height: 48px;
      ${textL}
    }

    :host([size='xl']) .cell {
      width: 56px;
      height: 56px;
      ${text2xl}
    }

    /* Coloured 2px borders for validation states (border-box keeps the cell size
       fixed, so the row doesn't shift between states). */
    :host([state='negative']) .cell {
      border-width: var(--sc-border-width-l);
      border-color: var(--sc-color-border-negative);
    }

    :host([state='positive']) .cell {
      border-width: var(--sc-border-width-l);
      border-color: var(--sc-color-border-positive);
    }

    :host([disabled]) .cell {
      background: var(--sc-color-background-disabled);
      border-color: var(--sc-color-border-disabled);
      color: var(--sc-color-text-disabled);
      cursor: not-allowed;
    }

    /* Zero-specificity reset so the shared focusRing :focus-visible ring wins. */
    :where(.cell) {
      outline: none;
    }
  `]

  private _inputs(): HTMLInputElement[] {
    return Array.from(this.shadowRoot?.querySelectorAll<HTMLInputElement>('input.cell') ?? [])
  }

  private _focusCell(i: number) {
    const el = this._inputs()[Math.max(0, Math.min(this.length - 1, i))]
    el?.focus()
    el?.select()
  }

  private _commit(cells: string[]) {
    this._cells = cells
    const value = this.value
    this.dispatchEvent(new CustomEvent('input', { detail: { value }, bubbles: true, composed: true }))
    this.dispatchEvent(new CustomEvent('change', { detail: { value }, bubbles: true, composed: true }))
    if (value.length === this.length) {
      this.dispatchEvent(new CustomEvent('complete', { detail: { value }, bubbles: true, composed: true }))
    }
  }

  private _onInput(e: InputEvent, i: number) {
    const input = e.target as HTMLInputElement
    const digit = input.value.replace(/\D/g, '').slice(-1)
    input.value = digit // strip any non-digit / extra chars from the DOM
    const cells = [...this._cells]
    cells[i] = digit
    this._commit(cells)
    if (digit && i < this.length - 1) this._focusCell(i + 1)
  }

  private _onKeyDown(e: KeyboardEvent, i: number) {
    const input = e.target as HTMLInputElement
    switch (e.key) {
      case 'Backspace':
        if (!input.value && i > 0) {
          e.preventDefault()
          const cells = [...this._cells]
          cells[i - 1] = ''
          this._commit(cells)
          this._focusCell(i - 1)
        }
        break
      case 'ArrowLeft':
        e.preventDefault()
        this._focusCell(i - 1)
        break
      case 'ArrowRight':
        e.preventDefault()
        this._focusCell(i + 1)
        break
      case 'Home':
        e.preventDefault()
        this._focusCell(0)
        break
      case 'End':
        e.preventDefault()
        this._focusCell(this.length - 1)
        break
    }
  }

  private _onPaste(e: ClipboardEvent, i: number) {
    e.preventDefault()
    const pasted = (e.clipboardData?.getData('text') ?? '').replace(/\D/g, '')
    if (!pasted) return
    const cells = [...this._cells]
    let idx = i
    for (const ch of pasted) {
      if (idx >= this.length) break
      cells[idx++] = ch
    }
    this._commit(cells)
    this._focusCell(Math.min(idx, this.length - 1))
  }

  private _syncForm() {
    const value = this.value
    this._internals.setFormValue(value || null)
    if (this.required && value.length < this.length) {
      this._internals.setValidity({ valueMissing: true }, 'Please enter all digits.', this._inputs()[0])
    } else {
      this._internals.setValidity({})
    }
  }

  render() {
    const labelId = `pin-label-${this._uid}`
    const helpId = `pin-help-${this._uid}`
    const showHelp = this.showHelpText && !!this.helpText
    const cells = Array.from({ length: this.length }, (_, i) => this._cells[i] ?? '')

    return html`
      <div class="root">
        ${this.showLabel && this.label
          ? html`<span class="label" id=${labelId}>${this.label}</span>`
          : null}
        <div
          class="fields"
          part="fields"
          role="group"
          aria-labelledby=${this.showLabel && this.label ? labelId : ''}
          aria-describedby=${showHelp ? helpId : ''}
        >
          ${cells.map((digit, i) => html`
            <input
              class="cell"
              part="cell"
              type="text"
              inputmode="numeric"
              autocomplete=${i === 0 ? 'one-time-code' : 'off'}
              maxlength="1"
              .value=${digit}
              aria-label=${`Digit ${i + 1} of ${this.length}`}
              ?disabled=${this.disabled}
              @input=${(e: InputEvent) => this._onInput(e, i)}
              @keydown=${(e: KeyboardEvent) => this._onKeyDown(e, i)}
              @paste=${(e: ClipboardEvent) => this._onPaste(e, i)}
              @focus=${(e: FocusEvent) => (e.target as HTMLInputElement).select()}
            />
          `)}
        </div>
        ${showHelp
          ? html`<sc-help-text
              id=${helpId}
              part="help-text"
              size="m"
              status=${this.state}
              text=${this.helpText}
              aria-live="polite"
            ></sc-help-text>`
          : null}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-input-pin': ScInputPin
  }
}
