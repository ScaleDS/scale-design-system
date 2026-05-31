import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import './sc-input'
import './sc-button'

type SignupState = 'default' | 'negative' | 'positive'

// Signup — the standalone inline email-capture form from Figma: an sc-input
// paired with a primary "Sign up" sc-button, laid out horizontally and wrapping
// on narrow widths. A composition wrapper (no focusable element of its own —
// the focus rings come from the composed sc-input/sc-button), so no focusRing.
// For the full marketing block with heading + subtext, use sc-section-signup.
@customElement('sc-signup')
export class ScSignup extends LitElement {
  /** Placeholder shown in the input. */
  @property() placeholder = 'Email address'
  /** Label rendered inside the button. */
  @property({ attribute: 'button-label' }) buttonLabel = 'Sign up'
  /** Current input value. */
  @property() value = ''
  /** Form field name for the captured value. */
  @property() name = 'email'
  /** Native input type — email by default for signup capture. */
  @property() type = 'email'
  /** Validation state forwarded to the input (drives border + help-text colour). */
  @property({ reflect: true }) state: SignupState = 'default'
  /** Optional help/validation message shown beneath the field when non-empty. */
  @property({ attribute: 'help-text' }) helpText = ''
  /** Disables the whole control. */
  @property({ type: Boolean, reflect: true }) disabled = false
  /** Puts the button into its loading state (e.g. while submitting). */
  @property({ type: Boolean, reflect: true }) loading = false

  static styles = css`
    :host {
      display: block;
      width: 100%;
    }

    .signup {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-start;
      gap: var(--sc-space-m);
    }

    /* Input grows to fill; button hugs. On narrow widths the button wraps below. */
    .input {
      flex: 1 1 200px;
      min-width: 0;
    }
  `

  /** Move focus to the input field. */
  focus(options?: FocusOptions) {
    this.shadowRoot?.querySelector<HTMLElement>('sc-input')?.focus(options)
  }

  // sc-input emits its own composed `input` CustomEvent, but the underlying
  // native <input> also fires a composed InputEvent that bubbles out here — and
  // its `detail` is the UIEvent click-count (0), not `{ value }`. Read the value
  // straight off the sc-input element instead, which is correct for both events.
  private _onInput(e: Event) {
    this.value = (e.target as HTMLInputElement).value
  }

  private _onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      this._submit()
    }
  }

  private _submit() {
    if (this.disabled || this.loading) return
    this.dispatchEvent(
      new CustomEvent('submit', {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    )
  }

  render() {
    return html`
      <div class="signup" part="container">
        <sc-input
          class="input"
          part="input"
          .value=${this.value}
          placeholder=${this.placeholder}
          name=${this.name}
          type=${this.type}
          state=${this.disabled ? 'disabled' : this.state}
          help-text=${this.helpText}
          .showLabel=${false}
          .showHelpText=${!!this.helpText}
          @input=${this._onInput}
          @keydown=${this._onKeyDown}
        ></sc-input>
        <sc-button
          part="button"
          size="l"
          type="primary"
          ?disabled=${this.disabled}
          ?loading=${this.loading}
          @click=${this._submit}
        >${this.buttonLabel}</sc-button>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-signup': ScSignup
  }
}
