import { LitElement, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import '@scale-ds/scale-design-system/components/sc-accordion'
import { reset } from './reset.js'

@customElement('sc-section-faq')
export class ScSectionFaq extends LitElement {

  static styles = [reset, css`
    :host {
      display: flex;
      justify-content: center;
      width: 100%;
    }

    .container {
      width: 100%;
      max-width: 1168px;
      padding: var(--sc-section-faq-padding-y, var(--sc-space-2xl)) var(--sc-space-l);
      display: flex;
      flex-wrap: wrap;
      gap: var(--sc-space-l) var(--sc-space-2xl);
      align-items: flex-start;
    }

    .header {
      flex: 1;
      min-width: 370px;
      display: flex;
      flex-direction: column;
      gap: var(--sc-space-l);
    }

    .accordions {
      flex: 1;
      min-width: 370px;
      display: flex;
      flex-direction: column;
    }
  `]

  render() {
    return html`
      <div class="container">
        <div class="header">
          <slot name="heading"></slot>
          <slot name="subtext"></slot>
        </div>
        <div class="accordions">
          <slot></slot>
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-section-faq': ScSectionFaq
  }
}
