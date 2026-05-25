import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { linkM } from '@scale/design-system/scss/typography'
import '@scale/design-system/components/sc-logo'
import '@scale/design-system/components/sc-button'
import '@scale/design-system/components/sc-button-icon'
import { featherIcon } from './feather'
import { ThemeController } from './theme-controller'

export interface NavLink {
  label: string
  href: string
}

type NavAlign = 'leading' | 'center' | 'trailing'

@customElement('sc-header')
export class ScHeader extends LitElement {
  @property({ type: Array, attribute: 'nav-links' }) navLinks: NavLink[] = []
  @property({ reflect: true, attribute: 'nav-align' }) navAlign: NavAlign = 'center'
  @property({ attribute: 'primary-label' }) primaryLabel = 'Buy now'
  @property({ attribute: 'primary-href' }) primaryHref = ''
  @property({ attribute: 'secondary-label' }) secondaryLabel = ''
  @property({ attribute: 'secondary-href' }) secondaryHref = ''
  @property({ type: Boolean, reflect: true, attribute: 'show-search' }) showSearch = false

  @state() private _mobile = false

  private _theme = new ThemeController(this)
  private _mq = window.matchMedia('(max-width: 810px)')
  private _onMqChange = (e: MediaQueryListEvent) => { this._mobile = e.matches }

  connectedCallback() {
    super.connectedCallback()
    this._mobile = this._mq.matches
    this._mq.addEventListener('change', this._onMqChange)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this._mq.removeEventListener('change', this._onMqChange)
  }

  static styles = css`
    :host {
      display: block;
      position: fixed;
      top: 0;
      z-index: 100;
      width: 100%;
    }

    /* ---- Shell ---- */

    .header {
      display: flex;
      align-items: center;
      height: 96px;
      padding: 0 var(--sc-space-2xl);
    }

    .header-bg {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: var(--sc-header-bg-bottom, -96px);
      z-index: -1;
      transition: bottom 300ms ease;
      background: linear-gradient(
        to bottom,
        color-mix(in srgb, var(--sc-color-surface-l3) 20%, transparent) 0%,
        transparent 100%
      );
      backdrop-filter: blur(24px);
      -webkit-backdrop-filter: blur(24px);
      mask-image: linear-gradient(to bottom, black 16px, transparent 100%);
      -webkit-mask-image: linear-gradient(to bottom, black 16px, transparent 100%);
      pointer-events: none;
    }

    /* ---- Three-column grid for leading / nav / trailing ---- */


    .leading {
      display: flex;
      align-items: center;
      flex: 1;
    }

    .logo-link {
      display: flex;
      align-items: center;
      text-decoration: none;
    }

    .nav {
      display: flex;
      align-items: center;
      gap: var(--sc-space-xs);
    }

    /* nav-align variants */
    :host([nav-align='leading']) .header {
      justify-content: flex-start;
      gap: var(--sc-space-xl);
    }
    :host([nav-align='leading']) .leading { flex: 0 0 auto; }

    :host([nav-align='center']) .nav {
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    }

    :host([nav-align='trailing']) .nav {
      margin-left: auto;
      margin-right: var(--sc-space-l);
    }

    /* ---- Nav links ---- */

    .nav-link {
      ${linkM}
      display: flex;
      align-items: center;
      padding: var(--sc-space-m) var(--sc-space-l);
      border-radius: var(--sc-border-radius-s);
      color: var(--sc-color-text-secondary);
      text-decoration: none;
      transition: background 150ms ease, color 150ms ease;
    }

    .nav-link:hover {
      background: var(--sc-color-background-hover);
      color: var(--sc-color-text-primary);
    }

    .nav-link:active {
      background: var(--sc-color-background-pressed);
    }

    .nav-link[aria-current='page'] {
      color: var(--sc-color-text-primary);
      background: var(--sc-color-background-subtle);
    }

    /* ---- Trailing ---- */

    .trailing {
      display: flex;
      align-items: center;
      gap: var(--sc-space-l);
      margin-left: auto;
    }

    /* ---- Theme toggle ---- */

    .theme-toggle {
      position: relative;
      display: flex;
      align-items: center;
      border-radius: 999px;
      padding: 3px;
      border: none;
      cursor: pointer;
    }

    .theme-toggle-thumb {
      position: absolute;
      left: 3px;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: var(--sc-color-surface-l4);
      box-shadow: var(--sc-shadow-l1);
      transition: transform 250ms ease;
      pointer-events: none;
    }

    .theme-toggle-thumb.dark {
      transform: translateX(28px);
    }

    .theme-toggle-icon {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      color: var(--sc-color-icon-subtle);
      transition: color 150ms ease;
    }

    .theme-toggle-icon svg {
      display: block;
      width: 14px;
      height: 14px;
    }

    .theme-toggle-icon.active {
      color: var(--sc-color-icon-primary);
    }

    /* ---- Actions ---- */

    .actions {
      display: flex;
      align-items: center;
      gap: var(--sc-space-s);
    }

    /* ---- Responsive ---- */

    @media (max-width: 810px) {
      .header {
        height: 64px;
        padding: 0 20px;
      }

      sc-logo {
        --sc-logo-mark-size: 32px;
      }

      .nav {
        display: none;
      }

      :host([nav-align='center']) .nav {
        position: static;
        transform: none;
      }

    }
  `

  render() {
    return html`
      <header class="header">
        <div class="header-bg"></div>

        <div class="leading">
          <a class="logo-link" href="./">
            <sc-logo size="m" ?hide-text=${this._mobile}></sc-logo>
          </a>
        </div>

        <div class="trailing">

          <button
            class="theme-toggle"
            part="theme-toggle"
            role="switch"
            aria-checked=${this._theme.theme === 'dark'}
            aria-label="Toggle theme"
            title=${this._theme.theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
            @click=${() => this._theme.set(this._theme.theme === 'light' ? 'dark' : 'light')}
          >
            <span class="theme-toggle-thumb ${this._theme.theme}"></span>
            <span class="theme-toggle-icon ${this._theme.theme === 'light' ? 'active' : ''}">${featherIcon('sun', { width: 14, height: 14 })}</span>
            <span class="theme-toggle-icon ${this._theme.theme === 'dark' ? 'active' : ''}">${featherIcon('moon', { width: 14, height: 14 })}</span>
          </button>

          ${this.showSearch ? html`
            <sc-button-icon type="tertiary" size="l" icon="search" label="Search"></sc-button-icon>
          ` : null}

          <div class="actions">
            ${this.secondaryLabel ? html`
              <sc-button type="secondary" size="m"
                @click=${() => this.secondaryHref && (window.location.href = this.secondaryHref)}>
                ${this.secondaryLabel}
              </sc-button>
            ` : null}
            ${this.primaryLabel ? html`
              <sc-button type="primary" size="m"
                @click=${() => this.primaryHref && window.open(this.primaryHref, '_blank', 'noopener,noreferrer')}>
                ${this.primaryLabel}
              </sc-button>
            ` : null}
          </div>

        </div>

        <nav class="nav" aria-label="Main">
          ${this.navLinks.map(link => html`
            <a class="nav-link" href=${link.href}>${link.label}</a>
          `)}
        </nav>
      </header>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-header': ScHeader
  }
}
