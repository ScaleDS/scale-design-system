import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { textS, linkS } from '@scale-ds/scale-design-system/scss/typography'
import '@scale-ds/scale-design-system/components/sc-logo'
import { reset } from './reset.js'

@customElement('sc-footer')
export class ScFooter extends LitElement {
  @property({ attribute: 'copyright' }) copyright = ''
  @property({ attribute: 'licence-label' }) licenceLabel = 'Licence Agreement'
  @property({ attribute: 'licence-href' }) licenceHref = '#'

  static styles = [reset, css`
    :host {
      display: block;
      width: 100%;
    }

    .container {
      width: 100%;
      padding: 0 var(--sc-space-2xl);
    }

    .content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--sc-space-xl);
      padding: var(--sc-space-2xl) 0 var(--sc-space-5xl);
    }

    .trailing {
      display: flex;
      align-items: center;
      gap: var(--sc-space-xs);
    }

    .copyright {
      ${textS}
      color: var(--sc-color-text-secondary);
    }

    .licence {
      ${linkS}
      color: var(--sc-color-text-link);
      text-decoration: none;
      transition: color 150ms ease;
    }

    .licence:hover {
      color: var(--sc-color-text-link-hover);
    }

    .leading sc-logo {
      --sc-logo-mark-size: 32px;
    }

    @media (max-width: 402px) {
      .trailing {
        flex-direction: column;
        align-items: center;
        gap: var(--sc-space-s);
      }
    }
  `]

  render() {
    return html`
      <div class="container">
        <div class="content">
          <div class="leading">
            <sc-logo size="m" hide-text></sc-logo>
          </div>
          <div class="trailing">
            ${this.copyright ? html`<span class="copyright">${this.copyright}</span>` : ''}
            <a class="licence" href=${this.licenceHref}>${this.licenceLabel}</a>
          </div>
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-footer': ScFooter
  }
}
