import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { labelL, labelM } from '@scale/design-system/scss/typography'
import { focusRing } from './sc-focus-ring'
import { buttonVariants } from './button-variants'
import { featherIcon } from './feather'

type ButtonPillSize = 'l' | 'm' | 's'
type ButtonPillType =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'tertiary-mono'
  | 'inverse'
  | 'mono'
  | 'outline'
  | 'outline-mono'
  | 'negative-primary'
  | 'negative-outline'

@customElement('sc-button-pill')
export class ScButtonPill extends LitElement {
  @property({ reflect: true }) size: ButtonPillSize = 'l'
  @property({ reflect: true }) type: ButtonPillType = 'primary'
  @property({ type: Boolean, reflect: true }) loading = false
  @property({ type: Boolean, reflect: true }) disabled = false
  @property({ attribute: 'leading-icon' }) leadingIcon = ''
  @property({ attribute: 'trailing-icon' }) trailingIcon = ''

  static styles = [
    focusRing,
    buttonVariants,
    css`
    :host {
      display: inline-flex;
    }

    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--sc-space-s);
      border: none;
      cursor: pointer;
      white-space: nowrap;
      text-decoration: none;
      transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease;
      outline: none;
      position: relative;
    }

    /* ---- Sizes ---- */

    :host([size='l']) button {
      padding: var(--sc-space-m) var(--sc-space-l);
      border-radius: var(--sc-border-radius-xl);
      ${labelL}
    }
    :host([size='l']) svg {
      width: 24px;
      height: 24px;
    }

    :host([size='m']) button {
      padding: var(--sc-space-s);
      border-radius: var(--sc-border-radius-xl);
      ${labelM}
    }
    :host([size='m']) svg {
      width: 20px;
      height: 20px;
    }

    :host([size='s']) button {
      padding: var(--sc-space-xs);
      border-radius: var(--sc-border-radius-l);
      ${labelM}
    }
    :host([size='s']) svg {
      width: 16px;
      height: 16px;
    }

    /* ---- Label / spinner positioning (specific to sc-button-pill) ---- */

    .label {
      display: contents;
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
    return html`
      <button
        type="button"
        ?disabled=${this.disabled || this.loading}
        aria-busy=${this.loading ? 'true' : 'false'}
      >
        <span class="spinner"></span>
        <span class="label">
          ${featherIcon(this.leadingIcon)}
          <slot></slot>
          ${featherIcon(this.trailingIcon)}
        </span>
      </button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-button-pill': ScButtonPill
  }
}
