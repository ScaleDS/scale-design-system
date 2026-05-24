import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { icons } from 'feather-icons'
import { labelL, labelM } from '@scale/design-system/scss/typography'
import { focusRing } from './sc-focus-ring'

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

    /* ---- Types ---- */

    /* Primary */
    :host([type='primary']) button {
      background: var(--sc-color-background-brand);
      color: var(--sc-color-text-primary-inverse);
    }
    :host([type='primary']) button:hover {
      background: var(--sc-color-background-brand-hover);
    }
    :host([type='primary']) button:active {
      background: var(--sc-color-background-brand-pressed);
    }

    /* Secondary */
    :host([type='secondary']) button {
      background: var(--sc-color-background-neutral);
      color: var(--sc-color-text-primary);
    }
    :host([type='secondary']) button:hover {
      background: var(--sc-color-background-neutral-hover);
    }
    :host([type='secondary']) button:active {
      background: var(--sc-color-background-neutral-pressed);
    }

    /* Tertiary */
    :host([type='tertiary']) button {
      background: transparent;
      color: var(--sc-color-text-primary);
    }
    :host([type='tertiary']) button:hover {
      background: var(--sc-color-background-hover);
    }
    :host([type='tertiary']) button:active {
      background: var(--sc-color-background-pressed);
    }

    /* Tertiary Mono */
    :host([type='tertiary-mono']) button {
      background: transparent;
      color: var(--sc-color-text-primary);
    }
    :host([type='tertiary-mono']) button:hover {
      background: var(--sc-color-background-hover);
    }
    :host([type='tertiary-mono']) button:active {
      background: var(--sc-color-background-pressed);
    }

    /* Inverse */
    :host([type='inverse']) button {
      background: var(--sc-color-background-inverse);
      color: var(--sc-color-text-primary-inverse);
    }
    :host([type='inverse']) button:hover {
      opacity: 0.9;
    }
    :host([type='inverse']) button:active {
      opacity: 0.8;
    }

    /* Mono */
    :host([type='mono']) button {
      background: var(--sc-color-background-mono);
      color: var(--sc-color-text-primary-inverse);
    }
    :host([type='mono']) button:hover {
      background: var(--sc-color-background-mono-hover);
    }
    :host([type='mono']) button:active {
      background: var(--sc-color-background-mono-pressed);
    }

    /* Outline */
    :host([type='outline']) button {
      background: transparent;
      color: var(--sc-color-text-primary);
      border: var(--sc-border-width-s) solid var(--sc-color-border-primary);
    }
    :host([type='outline']) button:hover {
      background: var(--sc-color-background-hover);
    }
    :host([type='outline']) button:active {
      background: var(--sc-color-background-pressed);
    }

    /* Outline Mono */
    :host([type='outline-mono']) button {
      background: transparent;
      color: var(--sc-color-text-primary);
      border: var(--sc-border-width-s) solid var(--sc-color-border-mono);
    }
    :host([type='outline-mono']) button:hover {
      background: var(--sc-color-background-hover);
    }
    :host([type='outline-mono']) button:active {
      background: var(--sc-color-background-pressed);
    }

    /* Negative Primary */
    :host([type='negative-primary']) button {
      background: var(--sc-color-background-negative);
      color: var(--sc-color-text-primary-inverse);
    }
    :host([type='negative-primary']) button:hover {
      background: var(--sc-color-background-negative-hover);
    }
    :host([type='negative-primary']) button:active {
      background: var(--sc-color-background-negative-pressed);
    }

    /* Negative Outline */
    :host([type='negative-outline']) button {
      background: transparent;
      color: var(--sc-color-text-negative);
      border: var(--sc-border-width-s) solid var(--sc-color-border-negative);
    }
    :host([type='negative-outline']) button:hover {
      background: var(--sc-color-background-negative-subtle);
    }
    :host([type='negative-outline']) button:active {
      background: var(--sc-color-background-negative-subtle);
    }

    /* ---- Disabled ---- */
    :host([disabled]) button {
      background: var(--sc-color-background-disabled);
      color: var(--sc-color-text-disabled);
      border-color: var(--sc-color-border-disabled);
      cursor: not-allowed;
      pointer-events: none;
    }

    /* ---- Loading ---- */
    :host([loading]) button {
      cursor: not-allowed;
      pointer-events: none;
    }

    .label {
      display: contents;
    }

    :host([loading]) .label {
      visibility: hidden;
      position: absolute;
    }

    .spinner {
      display: none;
      width: 16px;
      height: 16px;
      border: 2px solid currentColor;
      border-top-color: transparent;
      border-radius: 50%;
      animation: spin 0.75s linear infinite;
      position: absolute;
      inset: 0;
      margin: auto;
    }

    :host([loading]) .spinner {
      display: block;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    svg {
      display: block;
      flex-shrink: 0;
    }
  `]

  private renderIcon(name: string) {
    const icon = icons[name as keyof typeof icons]
    if (!icon) return null
    return html`${unsafeHTML(icon.toSvg())}`
  }

  render() {
    return html`
      <button
        type="button"
        ?disabled=${this.disabled || this.loading}
        aria-busy=${this.loading ? 'true' : 'false'}
      >
        <span class="spinner"></span>
        <span class="label">
          ${this.leadingIcon ? this.renderIcon(this.leadingIcon) : null}
          <slot></slot>
          ${this.trailingIcon ? this.renderIcon(this.trailingIcon) : null}
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
