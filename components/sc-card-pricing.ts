import { LitElement, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import { headingXl, textM } from '@scale/design-system/scss/typography'
import '@scale/design-system/components/sc-divider'
import { reset } from './reset'

@customElement('sc-card-pricing')
export class ScCardPricing extends LitElement {
  static styles = [reset, css`
    :host {
      display: block;
      background: var(--sc-color-surface-l1);
      border-radius: 16px;
      overflow: hidden;
      box-shadow: var(--sc-shadow-l1);
    }

    .header {
      display: flex;
      flex-direction: column;
      gap: var(--sc-space-l);
      padding: var(--sc-space-2xl);
    }

    .plan {
      ${headingXl}
      color: var(--sc-color-text-primary);
    }

    .description {
      ${textM}
      color: var(--sc-color-text-secondary);
    }

    .rows {
      display: flex;
      flex-direction: column;
      padding: var(--sc-space-2xl);
      --sc-row-divider-display: none;
    }

    .footer {
      padding: 0 var(--sc-space-2xl) var(--sc-space-2xl);
      --sc-button-width: 100%;
    }

    .footer ::slotted(a) {
      display: block;
      text-decoration: none;
      outline: none;
    }
  `]

  render() {
    return html`
      <div class="header">
        <slot name="badge"></slot>
        <span class="plan"><slot name="plan"></slot></span>
        <p class="description"><slot name="description"></slot></p>
      </div>

      <sc-divider variant="subtle"></sc-divider>

      <div class="rows">
        <slot></slot>
      </div>

      <div class="footer">
        <slot name="actions"></slot>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-card-pricing': ScCardPricing
  }
}
