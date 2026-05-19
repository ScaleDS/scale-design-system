import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { icons } from 'feather-icons'
import { textL } from '@scale/design-system/scss/typography'
import '@scale/design-system/components/sc-divider'

@customElement('sc-row')
export class ScRow extends LitElement {
  @property({ attribute: 'leading-icon' }) leadingIcon = ''
  @property({ attribute: 'trailing-icon' }) trailingIcon = ''
  @property({ type: Boolean, attribute: 'hide-divider', reflect: true }) hideDivider = false
  @property({ type: Boolean, reflect: true }) disabled = false

  static styles = css`
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :host {
      display: block;
    }

    .content {
      display: flex;
      align-items: center;
      gap: var(--sc-space-s);
      padding: var(--sc-space-m) 0;
      width: 100%;
      color: var(--sc-color-text-primary);
      ${textL}
    }

    :host([disabled]) .content {
      color: var(--sc-color-text-disabled);
    }

    .label {
      flex: 1;
    }

    svg {
      display: block;
      flex-shrink: 0;
      color: var(--sc-color-icon-primary);
    }

    :host([disabled]) svg {
      color: var(--sc-color-icon-disabled);
    }

    sc-divider {
      display: var(--sc-row-divider-display, block);
    }

    :host([hide-divider]) sc-divider {
      display: none;
    }
  `

  private renderIcon(name: string) {
    const icon = icons[name as keyof typeof icons]
    if (!icon) return null
    return unsafeHTML(icon.toSvg({ width: 24, height: 24 }))
  }

  render() {
    return html`
      <div class="content">
        ${this.leadingIcon ? this.renderIcon(this.leadingIcon) : null}
        <span class="label"><slot></slot></span>
        ${this.trailingIcon ? this.renderIcon(this.trailingIcon) : null}
      </div>
      <sc-divider variant="subtle"></sc-divider>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-row': ScRow
  }
}
