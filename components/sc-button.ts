import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { labelL, labelM, labelS } from '@scale/design-system/scss/typography'
import { focusRing } from './sc-focus-ring'
import { buttonVariants } from './button-variants'
import { featherIcon } from './feather'

type ButtonSize = 'l' | 'm' | 's'
type ButtonType =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'tertiary-mono'
  | 'inverse'
  | 'mono'
  | 'outline'
  | 'outline-mono'
  | 'text'
  | 'text-mono'
  | 'negative-primary'
  | 'negative-outline'
  | 'negative-text'

@customElement('sc-button')
export class ScButton extends LitElement {
  @property({ reflect: true }) size: ButtonSize = 'l'
  @property({ reflect: true }) type: ButtonType = 'primary'
  @property({ type: Boolean, reflect: true }) loading = false
  @property({ type: Boolean, reflect: true }) disabled = false
  @property({ attribute: 'leading-icon' }) leadingIcon = ''
  @property({ attribute: 'trailing-icon' }) trailingIcon = ''
  @property() href = ''
  @property() target: '_self' | '_blank' | '_parent' | '_top' | '' = ''
  @property() rel = ''

  static styles = [
    focusRing,
    buttonVariants,
    css`
    :host {
      display: inline-flex;
      width: var(--sc-button-width, auto);
    }

    :is(button, a) {
      display: inline-flex;
      width: 100%;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
      white-space: nowrap;
      text-decoration: none;
      transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease;
      outline: none;
      position: relative;
      box-sizing: border-box;
      color: inherit;
    }

    /* ---- Sizes ---- */

    :host([size='l']) :is(button, a) {
      padding: var(--sc-space-m);
      border-radius: var(--sc-border-radius-m);
      ${labelL}
    }
    :host([size='l']) svg {
      width: 24px;
      height: 24px;
    }

    :host([size='m']) :is(button, a) {
      padding: var(--sc-space-s);
      border-radius: var(--sc-border-radius-s);
      ${labelM}
    }
    :host([size='m']) svg {
      width: 20px;
      height: 20px;
    }

    :host([size='s']) :is(button, a) {
      padding: var(--sc-space-xs);
      border-radius: var(--sc-border-radius-s);
      ${labelS}
    }
    :host([size='s']) svg {
      width: 16px;
      height: 16px;
    }

    /* ---- Text-only type variants (specific to sc-button) ---- */

    /* Text */
    :host([type='text']) :is(button, a) {
      background: transparent;
      color: var(--sc-color-text-link);
    }
    :host([type='text']) :is(button, a):hover {
      color: var(--sc-color-text-link-hover);
    }
    :host([type='text']) :is(button, a):active {
      color: var(--sc-color-text-link-pressed);
    }

    /* Text Mono */
    :host([type='text-mono']) :is(button, a) {
      background: transparent;
      color: var(--sc-color-text-secondary);
    }
    :host([type='text-mono']) :is(button, a):hover {
      color: var(--sc-color-text-primary);
    }
    :host([type='text-mono']) :is(button, a):active {
      color: var(--sc-color-text-primary);
    }

    /* Negative Text */
    :host([type='negative-text']) :is(button, a) {
      background: transparent;
      color: var(--sc-color-text-negative);
    }
    :host([type='negative-text']) :is(button, a):hover {
      color: var(--sc-color-text-negative-hover);
    }
    :host([type='negative-text']) :is(button, a):active {
      color: var(--sc-color-text-negative-pressed);
    }

    /* ---- Label / spinner positioning (specific to sc-button) ---- */

    .label {
      display: inline-flex;
      align-items: center;
      gap: var(--sc-space-s);
      margin: 0 var(--sc-space-xs);
    }

    :host([loading]) .label {
      visibility: hidden;
      position: absolute;
    }

    svg {
      display: block;
      flex-shrink: 0;
    }
  `]

  render() {
    const inactive = this.disabled || this.loading
    const inner = html`
      <span class="spinner"></span>
      <span class="label">
        ${featherIcon(this.leadingIcon)}
        <slot></slot>
        ${featherIcon(this.trailingIcon)}
      </span>
    `

    if (this.href && !inactive) {
      const rel = this.target === '_blank'
        ? (this.rel || 'noopener noreferrer')
        : (this.rel || undefined)
      return html`
        <a
          part="button"
          href=${this.href}
          target=${this.target || '_self'}
          rel=${rel ?? ''}
          aria-busy=${this.loading ? 'true' : 'false'}
        >${inner}</a>
      `
    }

    return html`
      <button
        part="button"
        type="button"
        ?disabled=${inactive}
        aria-busy=${this.loading ? 'true' : 'false'}
      >${inner}</button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-button': ScButton
  }
}
