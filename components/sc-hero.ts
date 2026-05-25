import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '@scale/design-system/components/sc-badge'
import '@scale/design-system/components/sc-button'
import '@scale/design-system/components/sc-input'
import { ThemeController } from './theme-controller'

@customElement('sc-hero')
export class ScHero extends LitElement {
  @property() badge = ''
  @property({ attribute: 'primary-label' }) primaryLabel = ''
  @property({ attribute: 'primary-href' }) primaryHref = ''
  @property({ attribute: 'primary-leading-icon' }) primaryLeadingIcon = ''
  @property({ attribute: 'secondary-label' }) secondaryLabel = ''
  @property({ attribute: 'secondary-href' }) secondaryHref = ''
  @property({ attribute: 'secondary-leading-icon' }) secondaryLeadingIcon = ''
  @property({ attribute: 'image-src' }) imageSrc = ''
  @property({ attribute: 'image-src-dark' }) imageSrcDark = ''
  @property({ attribute: 'image-alt' }) imageAlt = ''
  @property({ type: Boolean, attribute: 'show-form' }) showForm = false
  @property({ attribute: 'form-placeholder' }) formPlaceholder = 'Enter your email'
  @property({ attribute: 'form-button-label' }) formButtonLabel = 'Subscribe'

  private _theme = new ThemeController(this)

  static styles = css`
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :host {
      display: block;
      position: relative;
      overflow: hidden;
      width: 100%;
      height: 90vh;
    }

    /* ---- Background image ---- */

    .image {
      position: absolute;
      inset: 0;
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      z-index: 0;
    }

    /* ---- Bottom gradient overlay ---- */

    .gradient {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 160px;
      background: linear-gradient(to top, var(--sc-color-surface-l0) 0%, rgb(from var(--sc-color-surface-l0) r g b / 0) 100%);
      z-index: 0;
      pointer-events: none;
    }

    /* ---- Layout ---- */

    .container {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: flex-end;
      height: 100%;
      max-width: 1440px;
      margin: 0 auto;
      padding: var(--sc-space-2xl) var(--sc-space-l);
    }

    /* ---- Content column ---- */

    .content {
      display: flex;
      flex-direction: column;
      min-width: 320px;
      max-width: 688px;
      width: 100%;
      gap: var(--sc-space-l);
    }

    /* ---- Actions ---- */

    .actions {
      display: flex;
      gap: var(--sc-space-m);
      flex-wrap: wrap;
      margin-top: var(--sc-space-l);
    }

    /* ---- Email form ---- */

    .form {
      display: flex;
      gap: var(--sc-space-m);
      flex-wrap: wrap;
      align-items: flex-end;
      width: 370px;
      max-width: 100%;
      margin-top: var(--sc-space-2xl);
    }

    .form sc-input {
      flex: 1;
      min-width: 200px;
    }

    /* ---- Responsive ---- */

    @media (max-width: 810px) {
      .container {
        padding: var(--sc-space-4xl) 20px;
        align-items: flex-end;
      }

      .content {
        min-width: 0;
        max-width: 100%;
      }
    }

    @media (max-width: 402px) {
      :host {
        height: 92vh;
      }

      .container {
        padding-bottom: var(--sc-space-2xl);
      }

      .actions {
        flex-direction: column;
      }

      .actions sc-button {
        --sc-button-width: 100%;
      }

      .image {
        height: 80%;
        object-position: -80px center;
      }
    }

  `

  render() {
    return html`
      ${this.imageSrc ? html`
        <img class="image" src=${this.imageSrcDark && this._theme.theme === 'dark' ? this.imageSrcDark : this.imageSrc} alt=${this.imageAlt} />
        <div class="gradient"></div>
      ` : null}

      <div class="container">
        <div class="content">

          ${this.badge ? html`
            <sc-badge>${this.badge}</sc-badge>
          ` : null}

          <slot name="heading"></slot>
          <slot name="subtext"></slot>

          ${(this.primaryLabel || this.secondaryLabel) ? html`
            <div class="actions">
              ${this.primaryLabel ? html`
                <sc-button
                  type="secondary"
                  size="l"
                  leading-icon=${this.primaryLeadingIcon || ''}
                  href=${this.primaryHref || ''}
                  target="_blank"
                >${this.primaryLabel}</sc-button>
              ` : null}
              ${this.secondaryLabel ? html`
                <sc-button
                  type="secondary"
                  size="l"
                  leading-icon=${this.secondaryLeadingIcon || ''}
                  href=${this.secondaryHref || ''}
                  target="_blank"
                >${this.secondaryLabel}</sc-button>
              ` : null}
            </div>
          ` : null}

          ${this.showForm ? html`
            <div class="form">
              <sc-input
                type="email"
                label="Email address"
                placeholder=${this.formPlaceholder}
              ></sc-input>
              <sc-button type="primary">${this.formButtonLabel}</sc-button>
            </div>
          ` : null}

          <slot></slot>

        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-hero': ScHero
  }
}
