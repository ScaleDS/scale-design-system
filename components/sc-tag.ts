import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { textS } from '@scale-ds/scale-design-system/scss/typography'
import { focusRing } from './sc-focus-ring.js'
import { featherIcon } from './feather.js'

/**
 * Tag / chip — a small element for categorising or filtering content, often
 * dismissible or clickable (Figma "Tag").
 *
 * Three independent capabilities, mix as needed:
 * - `selectable` — the tag is a toggle button (`role="button"`,
 *   `aria-pressed`); clicking or Enter/Space flips `selected` and emits
 *   `change`. Use for filter chips.
 * - `removable` — adds a trailing close (×) button that emits `remove`;
 *   Delete/Backspace on a focused tag also removes it.
 * - plain — a static label (no interactivity).
 *
 * A leading `leading-icon` (Feather name) or `avatar` (image src) sits before
 * the label (avatar wins if both are set). Visual states match Figma:
 * default (white, subtle border), hover, pressed, and selected (brand-subtle
 * fill, no border).
 */
@customElement('sc-tag')
export class ScTag extends LitElement {
  /** Selected (pressed) state. Reflected for styling and `aria-pressed`. */
  @property({ type: Boolean, reflect: true }) selected = false
  /** Makes the tag a clickable toggle button (filter chip). */
  @property({ type: Boolean, reflect: true }) selectable = false
  /** Shows a trailing × button that emits `remove`. */
  @property({ type: Boolean, reflect: true }) removable = false
  /** Disables all interaction. */
  @property({ type: Boolean, reflect: true }) disabled = false
  /** Feather icon name shown before the label. */
  @property({ attribute: 'leading-icon' }) leadingIcon = ''
  /** Image URL for a 16px leading avatar (takes precedence over `leading-icon`). */
  @property() avatar = ''
  /** Alt text for the avatar image. */
  @property({ attribute: 'avatar-alt' }) avatarAlt = ''
  /** Optional value, surfaced in `change` / `remove` event detail. */
  @property() value = ''
  /** Accessible label for the remove button (default: "Remove"). */
  @property({ attribute: 'remove-label' }) removeLabel = 'Remove'

  static styles = [focusRing, css`
    :host {
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      gap: var(--sc-space-xs);
      padding: var(--sc-space-xs) var(--sc-space-s);
      border-radius: var(--sc-border-radius-xs);
      border: var(--sc-border-width-s) solid var(--sc-color-border-primary);
      background: var(--sc-color-background-primary);
      color: var(--sc-color-text-secondary);
      ${textS}
      white-space: nowrap;
      vertical-align: middle;
    }

    :host([selectable]) {
      cursor: pointer;
      user-select: none;
    }

    :host([selectable]:hover:not([selected]):not([disabled])) {
      background: var(--sc-color-background-hover);
    }

    :host([selectable]:active:not([selected]):not([disabled])) {
      background: var(--sc-color-background-pressed);
    }

    :host([selected]) {
      background: var(--sc-color-background-selected);
      border-color: transparent;
    }

    :host([disabled]) {
      background: var(--sc-color-background-disabled);
      border-color: var(--sc-color-border-disabled);
      color: var(--sc-color-text-disabled);
      cursor: not-allowed;
    }

    /* Host is the focusable toggle when selectable; reuse the shared ring. */
    :host([selectable]:focus-visible) {
      outline: var(--sc-border-width-l) dashed var(--sc-color-border-mono);
      outline-offset: var(--sc-border-width-l);
    }

    .icon,
    .close {
      display: inline-flex;
      flex-shrink: 0;
      width: 16px;
      height: 16px;
      color: var(--sc-color-icon-primary);
    }

    .icon svg,
    .close svg {
      display: block;
      width: 16px;
      height: 16px;
    }

    .avatar {
      flex-shrink: 0;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      object-fit: cover;
    }

    .label {
      display: inline-flex;
    }

    .close {
      padding: 0;
      border: none;
      background: none;
      border-radius: var(--sc-border-radius-xs);
      cursor: pointer;
    }

    :host([disabled]) .icon,
    :host([disabled]) .close {
      color: var(--sc-color-text-disabled);
    }

    :host([disabled]) .close {
      cursor: not-allowed;
    }
  `]

  connectedCallback() {
    super.connectedCallback()
    this.addEventListener('click', this._onHostClick)
    this.addEventListener('keydown', this._onHostKeyDown)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this.removeEventListener('click', this._onHostClick)
    this.removeEventListener('keydown', this._onHostKeyDown)
  }

  updated() {
    if (this.selectable) {
      this.setAttribute('role', 'button')
      this.setAttribute('aria-pressed', this.selected ? 'true' : 'false')
      if (this.disabled) {
        this.setAttribute('aria-disabled', 'true')
        this.removeAttribute('tabindex')
      } else {
        this.removeAttribute('aria-disabled')
        this.setAttribute('tabindex', '0')
      }
    } else {
      this.removeAttribute('role')
      this.removeAttribute('aria-pressed')
      this.removeAttribute('tabindex')
      if (this.disabled) this.setAttribute('aria-disabled', 'true')
      else this.removeAttribute('aria-disabled')
    }
  }

  private _fromClose(e: Event): boolean {
    const target = e.composedPath()[0] as HTMLElement | undefined
    return !!target?.closest?.('.close')
  }

  private _toggle() {
    if (this.disabled || !this.selectable) return
    this.selected = !this.selected
    this.dispatchEvent(new CustomEvent('change', {
      detail: { selected: this.selected, value: this.value },
      bubbles: true,
      composed: true,
    }))
  }

  private _emitRemove() {
    if (this.disabled) return
    this.dispatchEvent(new CustomEvent('remove', {
      detail: { value: this.value },
      bubbles: true,
      composed: true,
    }))
  }

  private _onHostClick = (e: MouseEvent) => {
    if (!this.selectable || this._fromClose(e)) return
    this._toggle()
  }

  private _onHostKeyDown = (e: KeyboardEvent) => {
    if (this._fromClose(e)) return
    if (this.selectable && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      this._toggle()
    } else if (this.removable && (e.key === 'Delete' || e.key === 'Backspace')) {
      e.preventDefault()
      this._emitRemove()
    }
  }

  private _onRemoveClick = (e: MouseEvent) => {
    e.stopPropagation()
    this._emitRemove()
  }

  render() {
    const showAvatar = !!this.avatar
    const showIcon = !showAvatar && !!this.leadingIcon

    return html`
      ${showAvatar
        ? html`<img class="avatar" part="avatar" src=${this.avatar} alt=${this.avatarAlt} />`
        : ''}
      ${showIcon
        ? html`<span class="icon" part="icon">${featherIcon(this.leadingIcon, { width: 16, height: 16 })}</span>`
        : ''}
      <span class="label" part="label"><slot></slot></span>
      ${this.removable
        ? html`<button
            class="close"
            part="close"
            type="button"
            aria-label=${this.removeLabel}
            ?disabled=${this.disabled}
            @click=${this._onRemoveClick}
          >${featherIcon('x', { width: 16, height: 16 })}</button>`
        : ''}
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-tag': ScTag
  }
}
