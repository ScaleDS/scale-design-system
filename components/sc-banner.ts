import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { textL, linkL } from '@scale/design-system/scss/typography'
import '@scale/design-system/components/sc-status-icon'
import { focusRing } from './sc-focus-ring'
import { featherIcon } from './feather'

type BannerStatus = 'info' | 'warning' | 'negative' | 'positive' | 'mono'

const statusIconMap: Partial<Record<BannerStatus, string>> = {
  info: 'info',
  warning: 'warning',
  negative: 'error',
  positive: 'success',
}

@customElement('sc-banner')
export class ScBanner extends LitElement {
  @property({ reflect: true }) status: BannerStatus = 'info'
  @property({ type: Boolean, attribute: 'hide-close', reflect: true }) hideClose = false
  @property({ type: Boolean, attribute: 'hide-link', reflect: true }) hideLink = false
  @property({ attribute: 'link-href' }) linkHref = ''
  @property() link = ''
  @property() text = ''

  static styles = [
    focusRing,
    css`
    :host {
      display: block;
      width: 100%;
    }

    .banner {
      display: flex;
      width: 100%;
      align-items: center;
      gap: var(--sc-space-s);
      padding: var(--sc-space-m) var(--sc-space-l);
      min-height: 56px;
      box-sizing: border-box;
    }

    /* ---- Status backgrounds ---- */
    :host([status='info']) .banner {
      background: var(--sc-color-background-info);
    }
    :host([status='warning']) .banner {
      background: var(--sc-color-background-warning);
    }
    :host([status='negative']) .banner {
      background: var(--sc-color-background-negative);
    }
    :host([status='positive']) .banner {
      background: var(--sc-color-background-positive);
    }
    :host([status='mono']) .banner {
      background: var(--sc-color-background-mono);
    }

    /* ---- Icon ---- */
    .icon {
      flex-shrink: 0;
      display: flex;
      align-items: center;
    }

    /* ---- Text ---- */
    .text {
      ${textL}
      color: var(--sc-color-text-secondary-inverse);
      margin: 0;
      flex: 1 0 0;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    :host([status='warning']) .text {
      color: var(--sc-color-text-secondary-static);
    }

    /* ---- Trailing ---- */
    .trailing {
      display: flex;
      align-items: center;
      gap: var(--sc-space-s);
      flex-shrink: 0;
    }

    .link {
      ${linkL}
      color: var(--sc-color-text-secondary-inverse);
      text-decoration: none;
      white-space: nowrap;
      cursor: pointer;
    }

    :host([status='warning']) .link {
      color: var(--sc-color-text-secondary-static);
    }

    .link:hover {
      opacity: 0.85;
    }

    .link:focus-visible {
      border-radius: var(--sc-border-radius-xs);
    }

    /* ---- Close button ---- */
    .close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      padding: 0;
      border: none;
      background: none;
      cursor: pointer;
      color: var(--sc-color-text-secondary-inverse);
      flex-shrink: 0;
    }

    :host([status='warning']) .close {
      color: var(--sc-color-text-secondary-static);
    }

    .close:hover {
      opacity: 0.85;
    }

    .close:focus-visible {
      border-radius: var(--sc-border-radius-xs);
    }

    svg {
      display: block;
    }

    @media (prefers-reduced-motion: reduce) {
      .link,
      .close {
        transition: none;
      }
    }
  `]

  private _onClose() {
    this.dispatchEvent(new CustomEvent('close', {
      bubbles: true,
      composed: true,
    }))
    this.remove()
  }

  private _onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      this._onClose()
    }
  }

  render() {
    const iconStatus = statusIconMap[this.status]
    const showLink = !this.hideLink && !!this.link
    const showClose = !this.hideClose
    const hasTrailing = showLink || showClose

    return html`
      <div class="banner" role="status" aria-label="Notification" @keydown=${this._onKeyDown}>
        ${this.status !== 'mono' && iconStatus ? html`
          <span class="icon">
            <sc-status-icon status=${iconStatus} size="24"></sc-status-icon>
          </span>
        ` : ''}
        <p class="text">${this.text}</p>
        ${hasTrailing ? html`
          <div class="trailing">
            ${showLink ? html`
              ${this.linkHref ? html`
                <a class="link" href=${this.linkHref}>${this.link}</a>
              ` : html`
                <span class="link">${this.link}</span>
              `}
            ` : ''}
            ${showClose ? html`
              <button class="close" type="button" aria-label="Close notification" @click=${this._onClose}>
                ${featherIcon('x')}
              </button>
            ` : ''}
          </div>
        ` : ''}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-banner': ScBanner
  }
}
