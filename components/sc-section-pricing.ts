import { LitElement, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('sc-section-pricing')
export class ScSectionPricing extends LitElement {

  static styles = css`
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :host {
      display: flex;
      justify-content: center;
      width: 100%;
    }

    .container {
      width: 100%;
      max-width: 1168px;
      padding: var(--sc-space-2xl) var(--sc-space-l);
      display: flex;
      flex-direction: column;
      gap: var(--sc-space-2xl);
    }

    .header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--sc-space-l);
      text-align: center;
    }

    .cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: var(--sc-space-2xl);
      align-items: start;
    }

    @media (max-width: 810px) {
      .cards {
        grid-template-columns: 1fr;
        gap: var(--sc-space-l);
      }
    }

    @media (max-width: 402px) {
      .header {
        align-items: flex-start;
        text-align: left;
      }
    }
  `

  render() {
    return html`
      <div class="container">
        <div class="header">
          <slot name="heading"></slot>
          <slot name="subtext"></slot>
        </div>
        <div class="cards">
          <slot name="card-1"></slot>
          <slot name="card-2"></slot>
          <slot name="card-3"></slot>
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-section-pricing': ScSectionPricing
  }
}
