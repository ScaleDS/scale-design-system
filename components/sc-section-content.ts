import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

@customElement('sc-section-content')
export class ScSectionContent extends LitElement {
  @property({ reflect: true }) align: 'center' | 'left' = 'center'

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
      max-width: 1440px;
      padding: var(--sc-space-8xl) var(--sc-space-l) var(--sc-space-2xl);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--sc-space-l);
      text-align: center;
    }

    :host([align='left']) .container {
      align-items: flex-start;
      text-align: left;
    }

    @media (max-width: 402px) {
      .container {
        padding-top: var(--sc-space-2xl);
        text-align: left;
        align-items: flex-start;
      }
    }
  `

  render() {
    return html`
      <div class="container">
        <slot name="heading"></slot>
        <slot name="subtext"></slot>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-section-content': ScSectionContent
  }
}
