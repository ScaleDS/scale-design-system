import { LitElement, html, css, nothing, type PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'

// Slider — a continuous range control. Built on a native <input type="range">
// so role="slider", aria-valuemin/max/now, full keyboard support (arrows,
// Home/End, PageUp/Down), pointer drag, touch, and form participation all come
// for free; we only restyle the track, fill and thumb with design tokens.
//
// Anatomy (Figma): 4px track (Border Width/XL) — subtle-grey unfilled
// (Border/Subtle), brand-blue filled (Border/Brand) — with a 16px brand circle
// handle carrying Shadow/L2.
//
// The shared focusRing module isn't used here: it targets `:focus-visible` on
// the host's focusable element, which on a range input would ring the entire
// full-width track. We instead ring the thumb via the vendor pseudo-elements,
// reusing the same dashed-mono token so it matches the rest of the system.
@customElement('sc-slider')
export class ScSlider extends LitElement {
  static formAssociated = true

  /** Current value. Clamped to [min, max]. */
  @property({ type: Number, reflect: true }) value = 0
  /** Minimum value. */
  @property({ type: Number, reflect: true }) min = 0
  /** Maximum value. */
  @property({ type: Number, reflect: true }) max = 100
  /** Step increment. */
  @property({ type: Number, reflect: true }) step = 1
  /** Accessible name (applied as aria-label to the range input). */
  @property() label = ''
  /** Form field name. */
  @property() name = ''
  /** Disables the control. */
  @property({ type: Boolean, reflect: true }) disabled = false

  private _internals = this.attachInternals()
  private _initialValue = 0

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
    if (changed.has('value')) this._internals.setFormValue(String(this.value))
  }

  formResetCallback() {
    this.value = this._initialValue
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled
  }

  private get _pct(): number {
    const span = this.max - this.min
    if (!(span > 0)) return 0
    const clamped = Math.min(this.max, Math.max(this.min, this.value))
    return ((clamped - this.min) / span) * 100
  }

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .slider {
      -webkit-appearance: none;
      appearance: none;
      width: 100%;
      height: 16px;
      margin: 0;
      background: transparent;
      cursor: pointer;
    }

    /* ---- Track (WebKit) — fill via a hard-stop gradient at --pct ---- */
    .slider::-webkit-slider-runnable-track {
      height: var(--sc-border-width-xl);
      border-radius: var(--sc-border-radius-pill);
      background: linear-gradient(
        to right,
        var(--sc-color-border-brand) var(--pct),
        var(--sc-color-border-subtle) var(--pct)
      );
    }

    /* ---- Thumb (WebKit) — centre the 16px handle on the 4px track ---- */
    .slider::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 16px;
      height: 16px;
      border: none;
      border-radius: var(--sc-border-radius-pill);
      background: var(--sc-color-background-brand);
      box-shadow: var(--sc-shadow-l2);
      margin-top: calc((var(--sc-border-width-xl) - 16px) / 2);
    }

    /* ---- Track + fill + thumb (Firefox) ---- */
    .slider::-moz-range-track {
      height: var(--sc-border-width-xl);
      border-radius: var(--sc-border-radius-pill);
      background: var(--sc-color-border-subtle);
    }
    .slider::-moz-range-progress {
      height: var(--sc-border-width-xl);
      border-radius: var(--sc-border-radius-pill);
      background: var(--sc-color-border-brand);
    }
    .slider::-moz-range-thumb {
      width: 16px;
      height: 16px;
      border: none;
      border-radius: var(--sc-border-radius-pill);
      background: var(--sc-color-background-brand);
      box-shadow: var(--sc-shadow-l2);
    }

    /* ---- Keyboard focus ring on the thumb (matches focusRing's token) ---- */
    .slider:focus-visible {
      outline: none;
    }
    .slider:focus-visible::-webkit-slider-thumb {
      outline: 2px dashed var(--sc-color-border-mono);
      outline-offset: 2px;
    }
    .slider:focus-visible::-moz-range-thumb {
      outline: 2px dashed var(--sc-color-border-mono);
      outline-offset: 2px;
    }

    /* ---- Disabled ---- */
    :host([disabled]) .slider {
      cursor: not-allowed;
    }
    :host([disabled]) .slider::-webkit-slider-runnable-track {
      background: linear-gradient(
        to right,
        var(--sc-color-border-disabled) var(--pct),
        var(--sc-color-border-subtle) var(--pct)
      );
    }
    :host([disabled]) .slider::-webkit-slider-thumb {
      background: var(--sc-color-border-disabled);
      box-shadow: none;
    }
    :host([disabled]) .slider::-moz-range-progress {
      background: var(--sc-color-border-disabled);
    }
    :host([disabled]) .slider::-moz-range-thumb {
      background: var(--sc-color-border-disabled);
      box-shadow: none;
    }
  `

  /** Move focus to the slider. */
  focus(options?: FocusOptions) {
    this.shadowRoot?.querySelector<HTMLInputElement>('.slider')?.focus(options)
  }

  private _onInput(e: Event) {
    this.value = Number((e.target as HTMLInputElement).value)
    this.dispatchEvent(new CustomEvent('input', { detail: { value: this.value }, bubbles: true, composed: true }))
  }

  private _onChange(e: Event) {
    this.value = Number((e.target as HTMLInputElement).value)
    this.dispatchEvent(new CustomEvent('change', { detail: { value: this.value }, bubbles: true, composed: true }))
  }

  render() {
    return html`
      <input
        class="slider"
        part="input"
        type="range"
        style="--pct: ${this._pct}%"
        min=${this.min}
        max=${this.max}
        step=${this.step}
        .value=${String(this.value)}
        name=${this.name || nothing}
        ?disabled=${this.disabled}
        aria-label=${this.label || nothing}
        @input=${this._onInput}
        @change=${this._onChange}
      />
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-slider': ScSlider
  }
}
