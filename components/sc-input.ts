import { LitElement, html, css, type PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { labelL, textL } from '@scale/design-system/scss/typography'
import '@scale/design-system/components/sc-help-text'
import { focusRing } from './sc-focus-ring'
import { featherIcon } from './feather'
import type { DateKind } from './kinds/date'

type InputState = 'default' | 'negative' | 'positive' | 'disabled'
type InputKind = 'default' | 'date'
type DateMode = 'single' | 'range'

/** Parse `YYYY-MM-DD` into a local Date, or null. Used only for date-kind display. */
function parseISO(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim())
  if (!m) return null
  const d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]))
  return Number.isNaN(d.getTime()) ? null : d
}

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

  // ---- Date kind (kind="date") ----
  /** Behavioral kind. `default` is a text field; `date` opens a date-picker dropdown. */
  @property({ reflect: true }) kind: InputKind = 'default'
  /** Date selection mode. */
  @property() mode: DateMode = 'single'
  /** Range end date (mode="range"), ISO `YYYY-MM-DD`. */
  @property() end = ''
  /** Earliest selectable date, ISO `YYYY-MM-DD`. */
  @property() min = ''
  /** Latest selectable date, ISO `YYYY-MM-DD`. */
  @property() max = ''
  /** Locale for date display + calendar. */
  @property() locale = 'en-US'
  /** Week start for the calendar. */
  @property({ attribute: 'first-day-of-week' }) firstDayOfWeek: 'monday' | 'sunday' = 'monday'

  private _internals = this.attachInternals()
  private _initialValue = ''
  // Lazily created when kind="date" first activates (dynamic import — keeps the
  // calendar out of the base sc-input bundle).
  private _dateKind?: DateKind

  // Pointer-vs-keyboard focus tracking. Browsers treat text inputs as always
  // :focus-visible (since you need the keyboard to type once focused), so we
  // can't use CSS alone — we flag pointer-originated focus and suppress the
  // ring for those cases.
  @state() private _kbdFocus = false
  private _focusedByPointer = false

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
    if (['value', 'end', 'mode', 'kind', 'required', 'type', 'pattern'].some(k => changed.has(k))) this._syncFormState()
    // Lazily load the date-picker dropdown only when this input is a date field.
    if (this.kind === 'date') this._ensureDateKind()
  }

  private _syncFormState() {
    const formValue = (this.kind === 'date' && this.mode === 'range')
      ? (this.value && this.end ? `${this.value}/${this.end}` : null)
      : (this.value || null)
    this._internals.setFormValue(formValue)
    const input = this.shadowRoot?.querySelector('input') ?? undefined
    if (this.required && !this.value) {
      this._internals.setValidity({ valueMissing: true }, 'Please fill out this field.', input)
    } else if (input && !input.validity.valid) {
      // Mirror the inner input's native constraint validation (type="email"
      // typeMismatch, pattern mismatch, too short/long, …) onto the host —
      // shadow-DOM validity doesn't propagate to ElementInternals on its own.
      // (Date kind renders a button, not an input, so this branch is skipped.)
      this._internals.setValidity(input.validity, input.validationMessage, input)
    } else {
      this._internals.setValidity({})
    }
  }

  private async _ensureDateKind() {
    if (this._dateKind) return
    const { DateKind } = await import('./kinds/date.js')
    this._dateKind = new DateKind(this)
    this.requestUpdate()
  }

  private async _onDateOpen() {
    if (this.state === 'disabled') return
    await this._ensureDateKind()
    this._dateKind!.toggle()
  }

  formResetCallback() {
    this.value = this._initialValue
  }

  formDisabledCallback(disabled: boolean) {
    this.state = disabled ? 'disabled' : 'default'
  }

  private _onPointerDown = () => {
    this._focusedByPointer = true
    // Reset on next tick — the focus event fires synchronously after this and
    // will consume the flag; anything later (e.g. unrelated pointerdown that
    // didn't land on the input) shouldn't poison the next keyboard focus.
    setTimeout(() => { this._focusedByPointer = false }, 0)
  }

  private _onInputFocus = () => {
    this._kbdFocus = !this._focusedByPointer
  }

  private _onInputBlur = () => {
    this._kbdFocus = false
  }

  static styles = [
    focusRing,
    css`
    :host {
      display: flex;
      flex-direction: column;
      gap: var(--sc-space-s);
      width: 100%;
      position: relative;
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

    /* Keyboard-only focus ring — toggled by JS (input :focus-visible matches
       even on mouse click for text inputs, so we can't rely on CSS alone). */
    .field.kbd-focus {
      outline: 2px dashed var(--sc-color-border-mono);
      outline-offset: 1px;
      border-color: var(--sc-color-border-selected);
      box-shadow: 0 0 0 1px var(--sc-color-border-selected);
    }

    /* Mouse focus — keep the subtle "this is focused" border, no loud outline. */
    .field:focus-within:not(.kbd-focus) {
      border-color: var(--sc-color-border-selected);
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

    /* ---- Date field (kind="date") ---- */
    button.field {
      cursor: pointer;
      text-align: left;
      font: inherit;
    }

    .field[aria-expanded='true'] {
      border-color: var(--sc-color-border-selected);
      box-shadow: 0 0 0 1px var(--sc-color-border-selected);
    }

    .field:disabled {
      cursor: not-allowed;
    }

    .value {
      ${textL}
      flex: 1;
      min-width: 0;
      color: var(--sc-color-text-secondary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .value.placeholder {
      color: var(--sc-color-text-tertiary);
    }

    .field:disabled .value,
    .field:disabled .value.placeholder {
      color: var(--sc-color-text-disabled);
    }

    /* Wrapper around just the field + dropdown so the popover anchors to the
       field's bottom (not the host's, which sits below any help text). */
    .date-field {
      position: relative;
      width: 100%;
    }

    .popover {
      position: absolute;
      top: calc(100% + var(--sc-space-s));
      left: 0;
      z-index: 20;
      /* Dropdown surface: the date picker itself is transparent, so the popover
         wrapper provides the floating-layer background, border, and elevation. */
      background: var(--sc-color-surface-l2);
      border: var(--sc-border-width-s) solid var(--sc-color-border-subtle);
      border-radius: var(--sc-border-radius-m);
      padding: var(--sc-space-l);
      box-shadow: var(--sc-shadow-l2);
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
    return html`
      ${this.showLabel ? html`<p class="label" id="input-label">${this.label}</p>` : ''}

      ${this.kind === 'date' ? this._renderDateField() : this._renderTextField()}

      ${this.showHelpText ? html`
        <sc-help-text
          size="m"
          status=${this._helpTextStatus()}
          text=${this.helpText}
        ></sc-help-text>
      ` : ''}
    `
  }

  private _renderTextField() {
    const disabled = this.state === 'disabled'
    return html`
      <div
        class="field ${this._kbdFocus ? 'kbd-focus' : ''}"
        @pointerdown=${this._onPointerDown}
      >
        ${this.leadingIcon ? html`<span class="icon">${featherIcon(this.leadingIcon, { width: 20, height: 20 })}</span>` : ''}

        <input
          .value=${this.value}
          placeholder=${this.placeholder}
          ?disabled=${disabled}
          ?required=${this.required}
          type=${this.type}
          name=${this.name}
          autocomplete=${this.autocomplete}
          inputmode=${ifDefined(this.inputmode || undefined)}
          pattern=${ifDefined(this.pattern || undefined)}
          @input=${this._onInput}
          @change=${this._onChange}
          @focus=${this._onInputFocus}
          @blur=${this._onInputBlur}
        />

        ${this.trailingIcon ? html`<span class="icon">${featherIcon(this.trailingIcon, { width: 20, height: 20 })}</span>` : ''}
      </div>
    `
  }

  private _formatDisplay(): string {
    const fmt = (iso: string) => {
      const d = parseISO(iso)
      return d ? new Intl.DateTimeFormat(this.locale, { dateStyle: 'medium' }).format(d) : ''
    }
    if (this.mode === 'range') {
      const start = fmt(this.value)
      const end = fmt(this.end)
      return start && end ? `${start} – ${end}` : start
    }
    return fmt(this.value)
  }

  private _renderDateField() {
    const disabled = this.state === 'disabled'
    const display = this._formatDisplay()
    return html`
      <div class="date-field">
        <button
          class="field"
          type="button"
          aria-haspopup="dialog"
          aria-expanded=${this._dateKind?.open ? 'true' : 'false'}
          aria-labelledby=${this.showLabel ? 'input-label' : ''}
          ?disabled=${disabled}
          @click=${this._onDateOpen}
          @keydown=${(e: KeyboardEvent) => this._dateKind?.onKeyDown(e)}
        >
          <span class="value ${display ? '' : 'placeholder'}">${display || this.placeholder}</span>
          <span class="icon">${featherIcon('calendar', { width: 20, height: 20 })}</span>
        </button>
        ${this._dateKind?.renderOverlay() ?? ''}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-input': ScInput
  }
}
