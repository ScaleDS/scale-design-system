import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { icons } from 'feather-icons'
import '@scale/design-system/components/sc-help-text'
import { focusRing } from './sc-focus-ring'

type InputState = 'default' | 'negative' | 'positive' | 'disabled'

@customElement('sc-input')
export class ScInput extends LitElement {
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
  @property({ type: Boolean, reflect: true }) required = false

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
      font-family: var(--sc-type-family-inter), system-ui, sans-serif;
      font-size: var(--sc-type-size-l);
      line-height: var(--sc-type-line-height-l);
      font-weight: var(--sc-type-weight-semi-bold);
      letter-spacing: var(--sc-type-letter-spacing-none);
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
      flex: 1;
      min-width: 0;
      border: none;
      background: none;
      outline: none;
      font-family: var(--sc-type-family-inter), system-ui, sans-serif;
      font-size: var(--sc-type-size-l);
      line-height: var(--sc-type-line-height-l);
      font-weight: var(--sc-type-weight-regular);
      letter-spacing: var(--sc-type-letter-spacing-none);
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

  reportValidity(): boolean {
    return (this.shadowRoot!.querySelector('input') as HTMLInputElement).reportValidity()
  }

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

  private _icon(name: string) {
    const icon = icons[name as keyof typeof icons]
    if (!icon) return ''
    return unsafeHTML(icon.toSvg({ width: 20, height: 20 }))
  }

  render() {
    const disabled = this.state === 'disabled'

    return html`
      ${this.showLabel ? html`<p class="label">${this.label}</p>` : ''}

      <div class="field">
        ${this.leadingIcon ? html`<span class="icon">${this._icon(this.leadingIcon)}</span>` : ''}

        <input
          .value=${this.value}
          placeholder=${this.placeholder}
          ?disabled=${disabled}
          ?required=${this.required}
          type=${this.type}
          @input=${this._onInput}
          @change=${this._onChange}
        />

        ${this.trailingIcon ? html`<span class="icon">${this._icon(this.trailingIcon)}</span>` : ''}
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
