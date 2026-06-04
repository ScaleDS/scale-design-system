import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { labelL, labelM } from '@scale-ds/scale-design-system/scss/typography'
import { focusRing } from './sc-focus-ring.js'
import { buttonVariants, spinnerTypeForButton } from './button-variants.js'
import { featherIcon } from './feather.js'
import './sc-spinner.js'

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

    :is(button, a) {
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
      box-sizing: border-box;
      color: inherit;
    }

    /* ---- Sizes ---- */

    :host([size='l']) :is(button, a) {
      padding: var(--sc-space-m) var(--sc-space-l);
      border-radius: var(--sc-border-radius-xl);
      ${labelL}
    }
    :host([size='l']) svg {
      width: 24px;
      height: 24px;
    }

    :host([size='m']) :is(button, a) {
      padding: var(--sc-space-s);
      border-radius: var(--sc-border-radius-xl);
      ${labelM}
    }
    :host([size='m']) svg {
      width: 20px;
      height: 20px;
    }

    :host([size='s']) :is(button, a) {
      padding: var(--sc-space-xs);
      border-radius: var(--sc-border-radius-l);
      ${labelM}
    }
    :host([size='s']) svg {
      width: 16px;
      height: 16px;
    }

    /* ---- Label / spinner positioning (specific to sc-button-pill) ---- */

    /* The label carries its own 4px (space-xs) side padding — matching Figma's
       Label node — on top of the pill's own padding, so text sits space-l +
       space-xs in from the edge. */
    .label {
      display: inline-flex;
      align-items: center;
      gap: var(--sc-space-s);
      padding: 0 var(--sc-space-xs);
    }

    :host([loading]) .label {
      visibility: hidden;
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
        ${this.loading ? html`<sc-spinner class="spinner" size="s" type=${spinnerTypeForButton(this.type)}></sc-spinner>` : null}
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
