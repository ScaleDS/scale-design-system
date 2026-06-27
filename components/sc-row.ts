import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { textL } from '@scale-ds/scale-design-system/scss/typography'
import '@scale-ds/scale-design-system/components/sc-divider'
import { featherIcon } from './feather'
import { reset } from './reset'

@customElement('sc-row')
export class ScRow extends LitElement {
  @property({ attribute: 'leading-icon' }) leadingIcon = ''
  @property({ attribute: 'trailing-icon' }) trailingIcon = ''
  @property({ type: Boolean, attribute: 'hide-divider', reflect: true }) hideDivider = false

  static styles = [reset, css`
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

    .label {
      flex: 1;
    }

    svg {
      display: block;
      flex-shrink: 0;
      color: var(--sc-color-icon-primary);
    }

    sc-divider {
      display: var(--sc-row-divider-display, block);
    }

    :host([hide-divider]) sc-divider {
      display: none;
    }
  `]

  render() {
    return html`
      <div class="content">
        ${featherIcon(this.leadingIcon, { width: 24, height: 24 })}
        <span class="label"><slot></slot></span>
        ${featherIcon(this.trailingIcon, { width: 24, height: 24 })}
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
