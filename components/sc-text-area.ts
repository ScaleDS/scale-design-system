import { LitElement, html, css, type PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { labelL, textL } from '@scale-ds/scale-design-system/scss/typography'
import '@scale-ds/scale-design-system/components/sc-help-text'
import { focusRing } from './sc-focus-ring.js'

type TextAreaState = 'default' | 'negative' | 'positive' | 'disabled'
type TextAreaResize = 'vertical' | 'none' | 'both' | 'horizontal'

/**
 * Multi-line text field for longer-form input (messages, comments,
 * descriptions). The multi-line counterpart to `sc-input` — same label /
 * help-text / state API and form-association, with a resizable `<textarea>`
 * instead of a single-line input.
 *
 * States mirror Figma: default, negative, positive, disabled (focus/filled are
 * runtime states, handled with CSS). Form-associated, so it participates in
 * native `<form>` submission and validation.
 */
@customElement('sc-text-area')
export class ScTextArea extends LitElement {
  static formAssociated = true

  @property({ reflect: true }) state: TextAreaState = 'default'
  @property() label = 'Label'
  @property() placeholder = 'Text'
  @property() value = ''
  @property({ attribute: 'help-text' }) helpText = 'Help text'
  @property({ type: Boolean, attribute: 'show-label', reflect: true }) showLabel = true
  @property({ type: Boolean, attribute: 'show-help-text', reflect: true }) showHelpText = true
  /** Number of visible text rows (initial height). */
  @property({ type: Number }) rows = 3
  /** User resize affordance. Reflected so CSS can apply it. */
  @property({ reflect: true }) resize: TextAreaResize = 'vertical'
  @property() name = ''
  @property() autocomplete = ''
  @property({ type: Number }) maxlength: number | undefined
  @property({ type: Number }) minlength: number | undefined
  @property({ type: Boolean, reflect: true }) required = false

  private _internals = this.attachInternals()
  private _initialValue = ''

  // Keyboard-vs-pointer focus tracking. Browsers treat text controls as always
  // :focus-visible (you need the keyboard to type once focused), so CSS alone
  // can't tell a click from a Tab — flag pointer-originated focus and suppress
  // the loud ring for those. Mirrors sc-input.
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
    if (['value', 'required'].some(k => changed.has(k))) this._syncFormState()
  }

  private _syncFormState() {
    this._internals.setFormValue(this.value || null)
    const el = this.shadowRoot?.querySelector('textarea') ?? undefined
    if (this.required && !this.value) {
      this._internals.setValidity({ valueMissing: true }, 'Please fill out this field.', el)
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

  private _onPointerDown = () => {
    this._focusedByPointer = true
    setTimeout(() => { this._focusedByPointer = false }, 0)
  }

  private _onFocus = () => {
    this._kbdFocus = !this._focusedByPointer
  }

  private _onBlur = () => {
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
      padding: var(--sc-space-m) var(--sc-space-l);
      border-radius: var(--sc-border-radius-m);
      /* Border stays 1px in every state; the extra "2px" emphasis comes from an
         inset box-shadow so the content box never shifts. */
      border: var(--sc-border-width-s) solid var(--sc-color-border-primary);
      background: var(--sc-color-background-primary);
      transition: border-color 150ms ease, box-shadow 150ms ease;
      width: 100%;
      box-sizing: border-box;
    }

    /* Keyboard-only focus ring (textarea :focus-visible matches on click too). */
    .field.kbd-focus {
      outline: var(--sc-border-width-l) dashed var(--sc-color-border-mono);
      outline-offset: var(--sc-border-width-s);
      border-color: var(--sc-color-border-selected);
      box-shadow: 0 0 0 var(--sc-border-width-s) var(--sc-color-border-selected);
    }

    .field:focus-within:not(.kbd-focus) {
      border-color: var(--sc-color-border-selected);
      box-shadow: 0 0 0 var(--sc-border-width-s) var(--sc-color-border-selected);
    }

    :host([state='negative']) .field {
      border-color: var(--sc-color-border-negative);
      box-shadow: 0 0 0 var(--sc-border-width-s) var(--sc-color-border-negative);
    }

    :host([state='positive']) .field {
      border-color: var(--sc-color-border-positive);
      box-shadow: 0 0 0 var(--sc-border-width-s) var(--sc-color-border-positive);
    }

    :host([state='disabled']) .field {
      background: var(--sc-color-background-disabled);
      border-color: var(--sc-color-border-disabled);
      box-shadow: none;
    }

    /* ---- Textarea ---- */
    textarea {
      ${textL}
      flex: 1;
      min-width: 0;
      /* 3 lines of 24px line-height ≈ Figma's 96px min field height. */
      min-height: calc(3 * var(--sc-type-line-height-l));
      border: none;
      background: none;
      outline: none;
      padding: 0;
      margin: 0;
      color: var(--sc-color-text-secondary);
      width: 100%;
      resize: vertical;
      font: inherit;
    }

    :host([resize='none']) textarea { resize: none; }
    :host([resize='both']) textarea { resize: both; }
    :host([resize='horizontal']) textarea { resize: horizontal; }

    textarea:focus-visible {
      outline: none;
    }

    textarea::placeholder {
      color: var(--sc-color-text-tertiary);
    }

    textarea:disabled {
      color: var(--sc-color-text-disabled);
      cursor: not-allowed;
      resize: none;
    }

    textarea:disabled::placeholder {
      color: var(--sc-color-text-disabled);
    }

    @media (prefers-reduced-motion: reduce) {
      .field { transition: none; }
    }
  `]

  private _onInput(e: Event) {
    this.value = (e.target as HTMLTextAreaElement).value
    this.dispatchEvent(new CustomEvent('input', { detail: { value: this.value }, bubbles: true, composed: true }))
  }

  private _onChange(e: Event) {
    this.value = (e.target as HTMLTextAreaElement).value
    this.dispatchEvent(new CustomEvent('change', { detail: { value: this.value }, bubbles: true, composed: true }))
  }

  private _helpTextStatus() {
    if (this.state === 'negative') return 'negative'
    if (this.state === 'positive') return 'positive'
    if (this.state === 'disabled') return 'disabled'
    return 'default'
  }

  /** Focus the textarea. */
  focus(options?: FocusOptions) {
    this.shadowRoot?.querySelector('textarea')?.focus(options)
  }

  render() {
    const disabled = this.state === 'disabled'
    return html`
      ${this.showLabel ? html`<p class="label" id="textarea-label">${this.label}</p>` : ''}

      <div class="field ${this._kbdFocus ? 'kbd-focus' : ''}" @pointerdown=${this._onPointerDown}>
        <textarea
          part="textarea"
          .value=${this.value}
          placeholder=${this.placeholder}
          rows=${this.rows}
          ?disabled=${disabled}
          ?required=${this.required}
          name=${this.name}
          autocomplete=${this.autocomplete}
          maxlength=${this.maxlength ?? ''}
          minlength=${this.minlength ?? ''}
          aria-labelledby=${this.showLabel ? 'textarea-label' : ''}
          @input=${this._onInput}
          @change=${this._onChange}
          @focus=${this._onFocus}
          @blur=${this._onBlur}
        ></textarea>
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
    'sc-text-area': ScTextArea
  }
}
