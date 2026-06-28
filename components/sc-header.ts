import { LitElement, html, css, nothing } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { linkM, textM, headingM } from '@scale-ds/scale-design-system/scss/typography'
import '@scale-ds/scale-design-system/components/sc-logo'
import '@scale-ds/scale-design-system/components/sc-button'
import '@scale-ds/scale-design-system/components/sc-button-icon'
import { featherIcon } from './feather.js'
import { ThemeController } from './theme-controller.js'

export interface NavLink {
  label: string
  href: string
}

/** A page the header search can match against. */
export interface SearchItem {
  label: string
  href: string
  /** Optional group label shown muted after the page title (e.g. "Components"). */
  group?: string
}

/** A top-level entry in the mobile menu. Sections carry child `entries` (which
 *  surface as a second-level panel); plain links omit them. */
export interface NavTreeSection {
  id?: string
  label: string
  href: string
  entries?: NavLink[]
}

type NavAlign = 'leading' | 'center' | 'trailing'

const MAX_RESULTS = 8

@customElement('sc-header')
export class ScHeader extends LitElement {
  @property({ type: Array, attribute: 'nav-links' }) navLinks: NavLink[] = []
  @property({ reflect: true, attribute: 'nav-align' }) navAlign: NavAlign = 'center'
  /** Href for the logo link. Defaults to the current directory. */
  @property({ attribute: 'logo-href' }) logoHref = './'
  @property({ attribute: 'primary-label' }) primaryLabel = 'Buy now'
  @property({ attribute: 'primary-href' }) primaryHref = ''
  @property({ attribute: 'secondary-label' }) secondaryLabel = ''
  @property({ attribute: 'secondary-href' }) secondaryHref = ''
  @property({ type: Boolean, reflect: true, attribute: 'show-search' }) showSearch = false
  /** Pages the search overlay matches against. Set as a property (`.searchItems`). */
  @property({ attribute: false }) searchItems: SearchItem[] = []
  /** Two-level nav for the mobile menu. Falls back to `navLinks` (flat) if unset. */
  @property({ attribute: false }) navTree: NavTreeSection[] = []
  /** Href of the current page — marks the matching menu item selected. */
  @property({ attribute: 'active-href' }) activeHref = ''
  /** Id of the active section — marks the matching L1 item selected. */
  @property({ attribute: 'active-section' }) activeSection = ''

  @state() private _mobile = false
  @state() private _searchOpen = false
  @state() private _menuOpen = false
  /** Which section's content is rendered in the L2 panel. Kept while sliding
   *  back to L1 so the panel stays visible during the transition. */
  @state() private _drawerSection: string | null = null
  /** Whether the L2 panel is slid into view; drives the slide independently of
   *  `_drawerSection` so the content can outlive the back animation. */
  @state() private _showL2 = false
  @state() private _query = ''
  @state() private _activeIndex = -1
  private _wasSearchOpen = false

  private _theme = new ThemeController(this)
  private _mq?: MediaQueryList
  private _onMqChange = (e: MediaQueryListEvent) => { this._mobile = e.matches }

  connectedCallback() {
    super.connectedCallback()
    this._mq = window.matchMedia('(max-width: 810px)')
    this._mobile = this._mq.matches
    this._mq.addEventListener('change', this._onMqChange)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this._mq?.removeEventListener('change', this._onMqChange)
  }

  // ---- Search ----

  private get _results(): SearchItem[] {
    const q = this._query.trim().toLowerCase()
    if (!q) return []
    return this.searchItems
      .filter((item) => item.label.toLowerCase().includes(q))
      .slice(0, MAX_RESULTS)
  }

  private _openSearch() {
    this._searchOpen = true
    this._menuOpen = false
  }

  private _toggleMenu() {
    this._menuOpen = !this._menuOpen
    this._drawerSection = null
    this._showL2 = false
    if (this._menuOpen) this._closeSearch()
  }

  // Mobile menu second level (sections with child pages).
  private get _menuItems(): NavTreeSection[] {
    return this.navTree.length ? this.navTree : this.navLinks
  }

  private _openL2(id: string) {
    this._drawerSection = id
    this._showL2 = true
  }

  // Slide back to L1 but keep the L2 content mounted so it stays visible as it
  // animates off to the right; clear it once the slide finishes.
  private _backToL1() {
    this._showL2 = false
    setTimeout(() => {
      if (!this._showL2) this._drawerSection = null
    }, 500)
  }

  private _closeSearch() {
    this._searchOpen = false
    this._query = ''
    this._activeIndex = -1
  }

  private _toggleSearch() {
    this._searchOpen ? this._closeSearch() : this._openSearch()
  }

  private _onSearchInput(e: Event) {
    this._query = (e.target as HTMLInputElement).value
    this._activeIndex = -1
  }

  private _onSearchKeydown(e: KeyboardEvent) {
    const results = this._results
    switch (e.key) {
      case 'Escape':
        e.preventDefault()
        this._closeSearch()
        break
      case 'ArrowDown':
        if (!results.length) return
        e.preventDefault()
        this._activeIndex = (this._activeIndex + 1) % results.length
        break
      case 'ArrowUp':
        if (!results.length) return
        e.preventDefault()
        this._activeIndex = this._activeIndex <= 0 ? results.length - 1 : this._activeIndex - 1
        break
      case 'Enter': {
        const target = results[this._activeIndex] ?? results[0]
        if (target) {
          e.preventDefault()
          window.location.href = target.href
        }
        break
      }
    }
  }

  updated() {
    // Focus the field as the overlay opens.
    if (this._searchOpen && !this._wasSearchOpen) {
      this.renderRoot.querySelector<HTMLInputElement>('.search-input')?.focus()
    }
    this._wasSearchOpen = this._searchOpen
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

    /* Match the shared global focus ring (sc-focus-ring.ts) on the header's own
       light chrome. The sc-button-icon toggles carry their own ring, and the
       search input keeps its outline:none treatment. */
    .logo-link:focus-visible,
    .theme-toggle:focus-visible,
    .nav-link:focus-visible {
      outline: 2px dashed var(--sc-color-border-mono);
      outline-offset: 2px;
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
      gap: var(--sc-space-s);
      margin-left: auto;
    }

    /* ---- Theme toggle ---- */

    .theme-toggle {
      position: relative;
      display: flex;
      align-items: center;
      border-radius: 999px;
      padding: 3px;
      /* 4px space after the toggle without widening the pill (padding would
         shift the thumb track off-centre). */
      margin-right: var(--sc-space-xs);
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

    /* ---- Search overlay ---- */

    /* Crossfade: nav fades out, the centered search field fades in to replace it. */
    .nav {
      transition: opacity 200ms ease;
    }
    .header.searching .nav,
    .header.searching .theme-toggle,
    .header.searching .actions {
      opacity: 0;
      pointer-events: none;
    }

    .search {
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      width: clamp(280px, 50vw, 520px);
      opacity: 0;
      pointer-events: none;
      transition: opacity 200ms ease;
    }
    .header.searching .search {
      opacity: 1;
      pointer-events: auto;
    }

    .search-bar {
      display: flex;
      align-items: center;
      gap: var(--sc-space-xs);
      width: 100%;
    }

    /* The dedicated close button only appears in the mobile overlay; on desktop
       the trailing search-toggle doubles as the close (X) control. */
    .search-close {
      display: none;
    }

    .search-field {
      display: flex;
      flex: 1;
      min-width: 0;
      align-items: center;
      gap: var(--sc-space-s);
      padding: var(--sc-space-m) var(--sc-space-l);
      background: var(--sc-color-background-primary);
      border: var(--sc-border-width-s) solid var(--sc-color-border-primary);
      border-radius: var(--sc-border-radius-m);
    }

    .search-input {
      flex: 1;
      min-width: 0;
      border: none;
      outline: none;
      background: transparent;
      ${linkM}
      color: var(--sc-color-text-primary);
      font-weight: 400;
    }
    .search-input::placeholder {
      color: var(--sc-color-text-tertiary);
    }

    .search-field-icon {
      display: flex;
      flex-shrink: 0;
      color: var(--sc-color-icon-primary);
    }
    .search-field-icon svg {
      display: block;
      width: 24px;
      height: 24px;
    }

    .search-dropdown {
      position: absolute;
      top: calc(100% + var(--sc-space-s));
      left: 0;
      width: 100%;
      box-sizing: border-box;
      padding: var(--sc-space-s);
      background: var(--sc-color-surface-l2);
      border-radius: var(--sc-border-radius-s);
      box-shadow: var(--sc-shadow-l2);
      animation: search-fade-in 150ms ease;
    }

    @keyframes search-fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .search-result {
      display: flex;
      align-items: baseline;
      gap: var(--sc-space-s);
      padding: var(--sc-space-m) var(--sc-space-l);
      border-radius: var(--sc-border-radius-s);
      ${linkM}
      color: var(--sc-color-text-secondary);
      text-decoration: none;
      cursor: pointer;
    }
    .search-result:hover,
    .search-result.active {
      background: var(--sc-color-background-hover);
      color: var(--sc-color-text-primary);
    }
    .search-result-group {
      margin-left: auto;
      ${textM}
      color: var(--sc-color-text-tertiary);
    }

    /* ---- Responsive ---- */

    @media (max-width: 810px) {
      .header {
        height: 64px;
        /* Logo gets 16px breathing room; the trailing icon buttons carry their
           own 12px padding, sitting 8px in from the right edge. */
        padding: 0 var(--sc-space-s) 0 var(--sc-space-l);
      }

      sc-logo {
        --sc-logo-mark-size: 24px;
      }

      .nav {
        display: none;
      }

      :host([nav-align='center']) .nav {
        position: static;
        transform: none;
      }

      /* The search field has no inner icon on mobile, and section tags are
         dropped to keep results compact. */
      .search-field-icon,
      .search-result-group {
        display: none;
      }

      .search-close {
        display: inline-flex;
      }

      /* The search is an overlay spanning the bar (logo padding on the left,
         room for the close button on the right). It crossfades in over the bar
         the same way the desktop overlay does — opacity, never display. */
      .search {
        position: absolute;
        /* Right inset = header right padding (s) so the search close button's
           right edge lands on exactly the same spot as the menu/hamburger X,
           which is the rightmost trailing item sitting at the padding edge.
           Both are the same size-l icon button, so the X glyphs coincide. */
        inset: 0 var(--sc-space-s) 0 var(--sc-space-l);
        transform: none;
        display: flex;
        align-items: center;
        width: auto;
        max-width: none;
      }

      /* Crossfade: the closed-bar controls fade out as the overlay fades in. */
      .leading,
      .theme-toggle,
      .menu-toggle,
      .search-toggle {
        transition: opacity 200ms ease;
      }
      .header.searching .leading,
      .header.searching .theme-toggle,
      .header.searching .menu-toggle,
      .header.searching .search-toggle {
        opacity: 0;
        pointer-events: none;
      }

      /* On mobile the header fill becomes a solid Surface L2 — matching the
         results panel / menu below it rather than the translucent blurred
         gradient. Confined to the header height. */
      .header.searching .header-bg,
      .header.menu-open .header-bg {
        bottom: 0;
        background: var(--sc-color-surface-l2);
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        mask-image: none;
        -webkit-mask-image: none;
      }

      /* Results fill a full-width panel below the header rather than a
         floating card. */
      .header.searching .search-dropdown {
        position: fixed;
        top: 64px;
        left: 0;
        right: 0;
        bottom: 0;
        width: auto;
        padding: var(--sc-space-l);
        border-radius: 0;
        box-shadow: none;
        overflow-y: auto;
        animation: none;
      }

      /* ---- Mobile menu (two-level drawer) ---- */

      /* Open menu keeps the logo + the menu-toggle (now an X); the theme and
         search controls fade out. */
      .header.menu-open .theme-toggle,
      .header.menu-open .search-toggle {
        opacity: 0;
        pointer-events: none;
      }

      /* Full-bleed panel below the header. L1 fades in on open. */
      .drawer {
        position: fixed;
        top: 64px;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--sc-color-surface-l2);
        overflow: hidden;
        animation: search-fade-in 200ms ease;
      }
      .drawer[hidden] {
        display: none;
      }

      /* Two stacked panels; sliding the rail one panel left reveals L2. */
      .drawer-views {
        display: flex;
        width: 200%;
        height: 100%;
        transform: translateX(0);
        /* easeInOutQuart — gentler acceleration in and deceleration out than the
           default ease-in-out, so the slide lingers at both ends. */
        transition: transform 500ms cubic-bezier(0.76, 0, 0.24, 1);
      }
      .drawer-views.show-l2 {
        transform: translateX(-50%);
      }
      .drawer-view {
        flex: 0 0 50%;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      }

      /* The list is the scroll container, so the L2 heading/back action above it
         stays pinned while the pages scroll. */
      .drawer-list {
        display: flex;
        flex-direction: column;
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        padding: var(--sc-space-l);
      }
      /* L2 page list is indented under the heading. */
      .drawer-sublist {
        padding: 0 var(--sc-space-l) var(--sc-space-l) var(--sc-space-4xl);
      }

      .drawer-item {
        display: flex;
        align-items: center;
        gap: var(--sc-space-s);
        width: 100%;
        box-sizing: border-box;
        padding: var(--sc-space-m) var(--sc-space-l);
        border: none;
        border-radius: var(--sc-border-radius-s);
        background: transparent;
        text-align: left;
        text-decoration: none;
        cursor: pointer;
        ${linkM}
        color: var(--sc-color-text-secondary);
        transition: background 150ms ease, color 150ms ease;
      }
      .drawer-item > span {
        flex: 1;
        min-width: 0;
      }
      .drawer-item svg {
        flex-shrink: 0;
        width: 24px;
        height: 24px;
      }
      .drawer-item:hover {
        background: var(--sc-color-background-hover);
        color: var(--sc-color-text-primary);
      }
      .drawer-item.selected {
        background: var(--sc-color-background-subtle);
        color: var(--sc-color-text-primary);
      }

      .drawer-heading {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        gap: var(--sc-space-s);
        padding: var(--sc-space-l) var(--sc-space-l) var(--sc-space-s) var(--sc-space-s);
      }
      .drawer-heading h4 {
        flex: 1;
        min-width: 0;
        margin: 0;
        ${headingM}
        color: var(--sc-color-text-primary);
      }
    }
  `

  render() {
    return html`
      <header class="header ${this._searchOpen ? 'searching' : ''} ${this._menuOpen ? 'menu-open' : ''}">
        <div class="header-bg"></div>

        <div class="leading">
          <a class="logo-link" href=${this.logoHref}>
            <sc-logo size="m" ?hide-text=${this._mobile}></sc-logo>
          </a>
        </div>

        <nav class="nav" aria-label="Main">
          ${this.navLinks.map(link => html`
            <a class="nav-link" href=${link.href}>${link.label}</a>
          `)}
        </nav>

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
            <sc-button-icon
              class="search-toggle"
              type="tertiary-mono"
              size="l"
              icon=${this._searchOpen ? 'x' : 'search'}
              label=${this._searchOpen ? 'Close search' : 'Search'}
              @click=${this._toggleSearch}
            ></sc-button-icon>
          ` : null}

          ${this._mobile && this.navLinks.length ? html`
            <sc-button-icon
              class="menu-toggle"
              type="tertiary-mono"
              size="l"
              icon=${this._menuOpen ? 'x' : 'menu'}
              label=${this._menuOpen ? 'Close menu' : 'Menu'}
              aria-expanded=${this._menuOpen}
              @click=${this._toggleMenu}
            ></sc-button-icon>
          ` : null}

          ${this.secondaryLabel || this.primaryLabel ? html`
            <div class="actions">
              ${this.secondaryLabel ? html`
                <sc-button
                  type="secondary"
                  size="m"
                  href=${this.secondaryHref || ''}
                >${this.secondaryLabel}</sc-button>
              ` : null}
              ${this.primaryLabel ? html`
                <sc-button
                  type="primary"
                  size="m"
                  href=${this.primaryHref || ''}
                  target="_blank"
                >${this.primaryLabel}</sc-button>
              ` : null}
            </div>
          ` : null}

        </div>

        ${this.showSearch ? this._renderSearch() : null}
        ${this._mobile && this._menuItems.length ? this._renderMenu() : null}
      </header>
    `
  }

  private _renderMenu() {
    const section = this._drawerSection
      ? this._menuItems.find((s) => (s.id ?? s.href) === this._drawerSection)
      : undefined

    return html`
      <div class="drawer" ?hidden=${!this._menuOpen}>
        <div class="drawer-views ${this._showL2 ? 'show-l2' : ''}">
          <!-- L1: top-level items, same as the desktop header nav -->
          <div class="drawer-view" aria-hidden=${this._showL2 ? 'true' : 'false'}>
            <div class="drawer-list">
              ${this._menuItems.map((item) => {
                const key = item.id ?? item.href
                const hasChildren = !!item.entries?.length
                const selected = item.id
                  ? item.id === this.activeSection
                  : item.href === this.activeHref
                return hasChildren
                  ? html`
                      <button
                        class="drawer-item ${selected ? 'selected' : ''}"
                        type="button"
                        aria-haspopup="true"
                        @click=${() => this._openL2(key)}
                      >
                        <span>${item.label}</span>
                        ${featherIcon('chevron-right')}
                      </button>
                    `
                  : html`
                      <a
                        class="drawer-item ${selected ? 'selected' : ''}"
                        href=${item.href}
                        aria-current=${selected ? 'page' : nothing}
                      >
                        <span>${item.label}</span>
                      </a>
                    `
              })}
            </div>
          </div>

          <!-- L2: the active section's pages -->
          <div class="drawer-view" aria-hidden=${this._showL2 ? 'false' : 'true'}>
            ${section
              ? html`
                  <div class="drawer-heading">
                    <sc-button-icon
                      class="drawer-back"
                      type="tertiary-mono"
                      size="l"
                      icon="chevron-left"
                      label="Back"
                      @click=${this._backToL1}
                    ></sc-button-icon>
                    <h4>${section.label}</h4>
                  </div>
                  <div class="drawer-list drawer-sublist">
                    ${section.entries?.map((e) => {
                      const selected = e.href === this.activeHref
                      return html`
                        <a
                          class="drawer-item ${selected ? 'selected' : ''}"
                          href=${e.href}
                          aria-current=${selected ? 'page' : nothing}
                        >
                          <span>${e.label}</span>
                        </a>
                      `
                    })}
                  </div>
                `
              : null}
          </div>
        </div>
      </div>
    `
  }

  private _renderSearch() {
    const results = this._results
    return html`
      <div class="search" role="search">
        <div class="search-bar">
          <div class="search-field">
            <input
              class="search-input"
              type="text"
              placeholder="Search"
              autocomplete="off"
              role="combobox"
              aria-expanded=${results.length > 0}
              aria-controls="header-search-results"
              aria-label="Search"
              .value=${this._query}
              @input=${this._onSearchInput}
              @keydown=${this._onSearchKeydown}
            />
            <span class="search-field-icon" aria-hidden="true">${featherIcon('search')}</span>
          </div>
          <sc-button-icon
            class="search-close"
            type="tertiary-mono"
            size="l"
            icon="x"
            label="Close search"
            @click=${this._closeSearch}
          ></sc-button-icon>
        </div>

        ${results.length ? html`
          <div class="search-dropdown" id="header-search-results" role="listbox">
            ${results.map((item, i) => html`
              <a
                class="search-result ${i === this._activeIndex ? 'active' : ''}"
                href=${item.href}
                role="option"
                aria-selected=${i === this._activeIndex}
                @mouseenter=${() => (this._activeIndex = i)}
              >
                <span class="search-result-label">${item.label}</span>
                ${item.group ? html`<span class="search-result-group">${item.group}</span>` : null}
              </a>
            `)}
          </div>
        ` : null}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-header': ScHeader
  }
}
