import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { ifDefined } from 'lit/directives/if-defined.js'
import { focusRing } from './sc-focus-ring'
import { featherIcon } from './feather'

type MenuItemType = 'row' | 'button' | 'link'
type MenuItemState = 'default' | 'selected' | 'selected-open' | 'disabled'

@customElement('sc-menu-item')
export class ScMenuItem extends LitElement {
  @property({ reflect: true }) type: MenuItemType = 'row'
  @property({ reflect: true }) state: MenuItemState = 'default'
  @property({ type: Boolean, reflect: true }) destructive = false
  @property() link = ''
  @property() href = ''
  @property({ attribute: 'leading-icon' }) leadingIcon = ''
  @property({ attribute: 'trailing-icon' }) trailingIcon = ''
  @property({ attribute: 'aria-label' }) ariaLabel = ''
  @property({ type: Boolean, attribute: 'show-leading-icon', reflect: true }) showLeadingIcon = false
  @property({ type: Boolean, attribute: 'show-trailing-icon', reflect: true }) showTrailingIcon = false

  static styles = [
    focusRing,
    css`
    :host {
      display: block;
      min-width: 0;
    }

    .item {
      display: flex;
      align-items: flex-start;
      gap: var(--sc-space-s);
      width: 100%;
      border: none;
      background: none;
      cursor: pointer;
      font-family: var(--sc-type-family-inter), system-ui, sans-serif;
      text-align: left;
      text-decoration: none;
      color: inherit;
      box-sizing: border-box;
      min-width: 0;
      transition: background 200ms ease;
    }

    :host([type='row']) .item {
      border-radius: var(--sc-border-radius-s);
      padding: var(--sc-space-m) var(--sc-space-l);
    }

    :host([type='button']) .item {
      border-radius: var(--sc-border-radius-xs);
      padding: var(--sc-space-s) var(--sc-space-m);
    }

    :host([type='link']) .item {
      border-radius: var(--sc-border-radius-xs);
      padding: var(--sc-space-xs);
    }

    .content {
      display: flex;
      align-items: flex-start;
      gap: var(--sc-space-s);
      flex: 1;
      min-width: 0;
    }

    .icon {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      color: var(--sc-color-icon-primary);
    }

    .icon svg {
      display: block;
      width: 20px;
      height: 20px;
    }

    .label {
      flex: 1;
      min-width: 0;
      word-break: break-word;
      margin: 0;
    }

    :host([type='row']) .label,
    :host([type='button']) .label {
      font-size: var(--sc-type-size-l);
      line-height: var(--sc-type-line-height-l);
      font-weight: var(--sc-type-weight-semi-bold);
      letter-spacing: var(--sc-type-letter-spacing-none);
      color: var(--sc-color-text-secondary);
    }

    :host([type='link']) .label {
      font-size: var(--sc-type-size-m);
      line-height: var(--sc-type-line-height-m);
      font-weight: var(--sc-type-weight-semi-bold);
      letter-spacing: var(--sc-type-letter-spacing-none);
      color: var(--sc-color-text-secondary);
    }

    :host([type='row']) .item:not(:disabled):hover,
    :host([type='button']) .item:not(:disabled):hover {
      background: var(--sc-color-background-hover);
    }

    :host([type='row']) .item:not(:disabled):hover .label,
    :host([type='button']) .item:not(:disabled):hover .label {
      color: var(--sc-color-text-primary);
    }

    :host([type='row']) .item:not(:disabled):active,
    :host([type='button']) .item:not(:disabled):active {
      background: var(--sc-color-background-pressed);
    }

    :host([type='row']) .item:not(:disabled):active .label,
    :host([type='button']) .item:not(:disabled):active .label {
      color: var(--sc-color-text-primary);
    }

    :host([state='selected']) .item {
      background: var(--sc-color-background-selected);
    }

    :host([state='selected']) .label {
      color: var(--sc-color-text-primary);
    }

    :host([state='selected']) .icon {
      color: var(--sc-color-icon-primary);
    }

    :host([state='selected-open']) .label {
      color: var(--sc-color-text-brand);
    }

    :host([state='selected-open']) .icon {
      color: var(--sc-color-icon-brand);
    }

    :host([state='disabled']) .item {
      cursor: not-allowed;
    }

    :host([state='disabled']) .label {
      color: var(--sc-color-text-disabled);
    }

    :host([state='disabled']) .icon {
      color: var(--sc-color-icon-disabled);
    }

    :host([destructive]) .label {
      color: var(--sc-color-text-negative);
    }

    :host([destructive]) .icon {
      color: var(--sc-color-icon-negative);
    }

    :host([type='row'][destructive]) .item:not(:disabled):hover,
    :host([type='button'][destructive]) .item:not(:disabled):hover {
      background: var(--sc-color-background-negative-subtle);
    }

    :host([destructive]) .item:not(:disabled):hover .label {
      color: var(--sc-color-text-negative-hover);
    }

    :host([destructive]) .item:not(:disabled):hover .icon {
      color: var(--sc-color-icon-negative);
    }

    @media (prefers-reduced-motion: reduce) {
      .item { transition: none; }
    }
  `]

  focus(options?: FocusOptions) {
    this.shadowRoot?.querySelector('.item')?.focus(options)
  }

  private _onClick(e: Event) {
    if (this.state === 'disabled') {
      e.preventDefault()
      return
    }
    this.dispatchEvent(new CustomEvent('select', {
      detail: { value: this.link },
      bubbles: true,
      composed: true,
    }))
  }

  private _onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      this._onClick(e)
    }
  }

  private _icon(name: string) {
    return featherIcon(name, { width: 20, height: 20 })
  }

  render() {
    const disabled = this.state === 'disabled'
    const hasHref = !!(this.href)

    if (hasHref || this.type === 'link') {
      return html`
        <a
          class="item"
          role="menuitem"
          aria-label=${ifDefined(this.ariaLabel || undefined)}
          href=${this.href || '#'}
          tabindex=${disabled ? '-1' : '0'}
          ?aria-disabled=${disabled}
          @click=${this._onClick}
          @keydown=${this._onKeyDown}
        >
          <span class="content">
            ${this.showLeadingIcon && this.leadingIcon ? html`<span class="icon">${this._icon(this.leadingIcon)}</span>` : ''}
            <span class="label">${this.link}</span>
            ${this.showTrailingIcon && this.trailingIcon ? html`<span class="icon">${this._icon(this.trailingIcon)}</span>` : ''}
          </span>
        </a>
      `
    }

    return html`
      <button
        class="item"
        type="button"
        role="menuitem"
        aria-label=${ifDefined(this.ariaLabel || undefined)}
        tabindex=${disabled ? '-1' : '0'}
        ?disabled=${disabled}
        ?aria-disabled=${disabled}
        @click=${this._onClick}
        @keydown=${this._onKeyDown}
      >
        <span class="content">
          ${this.showLeadingIcon && this.leadingIcon ? html`<span class="icon">${this._icon(this.leadingIcon)}</span>` : ''}
          <span class="label">${this.link}</span>
          ${this.showTrailingIcon && this.trailingIcon ? html`<span class="icon">${this._icon(this.trailingIcon)}</span>` : ''}
        </span>
      </button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-menu-item': ScMenuItem
  }
}
