import { LitElement, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'
import { headingL, textL } from '@scale-ds/scale-design-system/scss/typography'
import { reset } from './reset.js'

@customElement('sc-section-signup')
export class ScSectionSignup extends LitElement {

  static styles = [reset, css`
    :host {
      display: flex;
      justify-content: center;
      width: 100%;
    }

    .container {
      width: 100%;
      max-width: 1168px;
      padding: var(--sc-space-2xl) var(--sc-space-l);
    }

    .card {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--sc-space-s);
      padding: var(--sc-space-2xl);
      background: var(--sc-color-surface-l1);
      border-radius: 16px;
      border: 1px solid var(--sc-color-border-subtle);
      overflow: hidden;
    }

    .content {
      flex: 1;
      min-width: 200px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--sc-space-s);
    }

    .heading {
      ${headingL}
      color: var(--sc-color-text-primary);
      width: 100%;
    }

    .subtext {
      ${textL}
      color: var(--sc-color-text-secondary);
      width: 100%;
    }

    .form {
      flex: 1;
      min-width: 200px;
      display: flex;
      align-items: flex-start;
      gap: var(--sc-space-l);
    }

    .form ::slotted([slot='input']) {
      flex: 1;
    }

    @media (max-width: 810px) {
      .card {
        flex-direction: column;
        align-items: flex-start;
        gap: var(--sc-space-xl);
      }

      .content {
        align-items: flex-start;
      }

      .form {
        width: 100%;
      }
    }

    @media (max-width: 402px) {
      .card {
        padding: var(--sc-space-xl);
      }

      .form {
        flex-direction: column;
      }

      .form ::slotted([slot='input']),
      .form ::slotted([slot='action']) {
        width: 100%;
      }
    }
  `]

  render() {
    return html`
      <div class="container">
        <div class="card">
          <div class="content">
            <span class="heading"><slot name="heading"></slot></span>
            <span class="subtext"><slot name="subtext"></slot></span>
          </div>
          <div class="form">
            <slot name="input"></slot>
            <slot name="action"></slot>
          </div>
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-section-signup': ScSectionSignup
  }
}
