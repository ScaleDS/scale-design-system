import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

type CardImageVariant = 'default' | 'fill'

@customElement('sc-card-image')
export class ScCardImage extends LitElement {
  @property({ reflect: true }) variant: CardImageVariant = 'default'
  @property({ attribute: 'image-src' }) imageSrc = ''
  @property({ attribute: 'image-src-dark' }) imageSrcDark = ''
  @property({ attribute: 'image-alt' }) imageAlt = ''

  @state() private _theme: 'light' | 'dark' = 'light'

  private _onThemeChange = (e: Event) => {
    this._theme = (e as CustomEvent).detail.theme
  }

  connectedCallback() {
    super.connectedCallback()
    this._theme = (document.documentElement.dataset.theme as 'light' | 'dark') ?? 'light'
    window.addEventListener('theme-change', this._onThemeChange)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    window.removeEventListener('theme-change', this._onThemeChange)
  }

  static styles = css`
    :host {
      display: block;
      height: 100%;
    }

    .card {
      background: var(--sc-color-surface-l1);
      border-radius: 16px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      height: 100%;
      box-shadow: var(--sc-shadow-l1);
    }

    /* ---- Default variant ---- */

    :host([variant='default']) .image-wrap {
      width: 100%;
      aspect-ratio: 16 / 9;
      flex-shrink: 0;
      position: relative;
    }

    :host([variant='default']) .image-wrap img {
      width: 100%;
      height: 100%;
      object-fit: var(--sc-card-object-fit, cover);
      object-position: var(--sc-card-object-position, left top);
      display: block;
    }

    :host([variant='default']) .content {
      padding: var(--sc-space-xl);
      display: flex;
      flex-direction: column;
      gap: var(--sc-space-s);
    }

    /* ---- Fill variant ---- */

    /*
     * Fill: content (heading + description) sits at the top;
     * image fills the remaining vertical space below.
     */

    :host([variant='fill']) .content {
      padding: var(--sc-space-xl);
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      gap: var(--sc-space-s);
    }

    :host([variant='fill']) .card {
      padding-bottom: var(--sc-space-xl);
      box-sizing: border-box;
    }

    :host([variant='fill']) .image-wrap {
      flex: 1;
      min-height: 0;
      position: relative;
      display: flex;
      flex-direction: column;
    }

    :host([variant='fill']) .image-wrap img {
      flex: 1;
      min-height: 0;
      width: 100%;
      object-fit: var(--sc-card-object-fit, cover);
      object-position: var(--sc-card-object-position, left top);
      display: block;
    }

    @media (max-width: 810px) {
      :host([variant='default']) .image-wrap img,
      :host([variant='fill']) .image-wrap img {
        object-position: left top;
      }
    }

  `

  render() {
    const src = this.imageSrcDark && this._theme === 'dark' ? this.imageSrcDark : this.imageSrc

    const imageWrap = html`
      <div class="image-wrap">
        ${src ? html`<img src=${src} alt=${this.imageAlt} />` : null}
      </div>
    `

    const content = html`
      <div class="content">
        <slot name="heading"></slot>
        <slot name="description"></slot>
        <slot></slot>
      </div>
    `

    return html`
      <div class="card">
        ${this.variant === 'fill' ? html`${content}${imageWrap}` : html`${imageWrap}${content}`}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-card-image': ScCardImage
  }
}
