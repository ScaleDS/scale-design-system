import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { icons } from 'feather-icons'

type ButtonIconSize = 'l' | 's'
type ButtonIconType =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'tertiary-mono'
  | 'inverse'
  | 'mono'
  | 'outline'
  | 'outline-mono'

@customElement('sc-button-icon')
export class ScButtonIcon extends LitElement {
  @property({ reflect: true }) size: ButtonIconSize = 'l'
  @property({ reflect: true }) type: ButtonIconType = 'primary'
  @property({ type: Boolean, reflect: true }) disabled = false
  @property() icon = 'circle'
  @property() label = ''

  static styles = css`
    :host {
      display: inline-flex;
    }

    button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border: none;
      cursor: pointer;
      transition: background-color 200ms ease, color 200ms ease, border-color 200ms ease;
      outline: none;
      position: relative;
    }

    button:focus-visible {
      outline: 2px solid var(--sc-color-border-focus);
      outline-offset: 2px;
    }

    /* ---- Sizes ---- */

    :host([size='l']) button {
      padding: var(--sc-space-m);
      border-radius: var(--sc-border-radius-xl);
    }
    :host([size='l']) svg {
      width: 24px;
      height: 24px;
    }

    :host([size='s']) button {
      padding: var(--sc-space-s);
      border-radius: var(--sc-border-radius-l);
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
      color: var(--sc-color-icon-brand);
    }
    :host([type='tertiary']) button:hover {
      background: var(--sc-color-background-neutral-hover);
    }
    :host([type='tertiary']) button:active {
      background: var(--sc-color-background-neutral-pressed);
    }

    /* Tertiary Mono */
    :host([type='tertiary-mono']) button {
      background: transparent;
      color: var(--sc-color-icon-primary);
    }
    :host([type='tertiary-mono']) button:hover {
      background: var(--sc-color-background-neutral-hover);
    }
    :host([type='tertiary-mono']) button:active {
      background: var(--sc-color-background-neutral-pressed);
    }

    /* Inverse */
    :host([type='inverse']) button {
      background: var(--sc-color-background-primary);
      color: var(--sc-color-icon-brand);
    }
    :host([type='inverse']) button:hover {
      background: var(--sc-color-background-hover);
    }
    :host([type='inverse']) button:active {
      background: var(--sc-color-background-pressed);
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
      color: var(--sc-color-icon-brand);
      border: var(--sc-border-width-s) solid var(--sc-color-border-brand);
    }
    :host([type='outline']) button:hover {
      background: var(--sc-color-background-neutral-hover);
    }
    :host([type='outline']) button:active {
      background: var(--sc-color-background-neutral-pressed);
    }

    /* Outline Mono */
    :host([type='outline-mono']) button {
      background: transparent;
      color: var(--sc-color-icon-primary);
      border: var(--sc-border-width-s) solid var(--sc-color-border-primary);
    }
    :host([type='outline-mono']) button:hover {
      background: var(--sc-color-background-neutral-hover);
    }
    :host([type='outline-mono']) button:active {
      background: var(--sc-color-background-neutral-pressed);
    }

    /* ---- Disabled ---- */
    :host([disabled]) button {
      background: var(--sc-color-background-disabled);
      color: var(--sc-color-text-disabled);
      border-color: var(--sc-color-border-disabled);
      cursor: not-allowed;
      pointer-events: none;
    }

    svg {
      display: block;
      flex-shrink: 0;
    }
  `

  render() {
    const icon = icons[this.icon as keyof typeof icons]
    if (!icon) return null

    return html`
      <button
        type="button"
        ?disabled=${this.disabled}
        aria-label=${this.label || this.icon}
      >
        ${unsafeHTML(icon.toSvg())}
      </button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-button-icon': ScButtonIcon
  }
}
