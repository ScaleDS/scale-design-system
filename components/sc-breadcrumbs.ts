import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { focusRing } from './sc-focus-ring'

@customElement('sc-breadcrumbs')
export class ScBreadcrumbs extends LitElement {
  @property({ attribute: 'page-1' }) page1 = 'Page 1'
  @property({ attribute: 'page-2' }) page2 = 'Page 2'
  @property({ attribute: 'page-3' }) page3 = 'Page 3'
  @property({ attribute: 'page-4' }) page4 = 'Page 4'
  @property({ type: Boolean, attribute: 'show-page-2', reflect: true }) showPage2 = true
  @property({ type: Boolean, attribute: 'show-page-3', reflect: true }) showPage3 = true
  @property({ type: Boolean, attribute: 'show-page-4', reflect: true }) showPage4 = true
  @property({ attribute: 'current-page' }) currentPage = 'Current page'

  static styles = [focusRing, css`
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :host {
      display: block;
    }

    nav {
      display: flex;
      align-items: center;
      gap: var(--sc-space-xs);
    }

    ol {
      display: flex;
      align-items: center;
      gap: var(--sc-space-xs);
      list-style: none;
    }

    li {
      display: flex;
      align-items: center;
      gap: var(--sc-space-xs);
    }

    .link {
      font-family: var(--sc-type-family-inter), system-ui, sans-serif;
      font-size: var(--sc-type-size-m);
      line-height: var(--sc-type-line-height-m);
      font-weight: var(--sc-type-weight-semi-bold);
      letter-spacing: var(--sc-type-letter-spacing-none);
      color: var(--sc-color-text-link);
      text-decoration: none;
      cursor: pointer;
    }

    .link:hover {
      text-decoration: underline;
    }

    .separator {
      font-family: var(--sc-type-family-inter), system-ui, sans-serif;
      font-size: var(--sc-type-size-m);
      line-height: var(--sc-type-line-height-m);
      font-weight: var(--sc-type-weight-regular);
      letter-spacing: var(--sc-type-letter-spacing-none);
      color: var(--sc-color-text-tertiary);
      user-select: none;
    }

    .current {
      font-family: var(--sc-type-family-inter), system-ui, sans-serif;
      font-size: var(--sc-type-size-m);
      line-height: var(--sc-type-line-height-m);
      font-weight: var(--sc-type-weight-regular);
      letter-spacing: var(--sc-type-letter-spacing-none);
      color: var(--sc-color-text-secondary);
    }
  `]

  private _onPageClick(e: Event, page: string) {
    this.dispatchEvent(new CustomEvent('navigate', {
      detail: { page },
      bubbles: true,
      composed: true,
    }))
  }

  private _renderPage(page: string) {
    return html`
      <li>
        <a
          class="link"
          href="#"
          @click=${(e: Event) => { e.preventDefault(); this._onPageClick(e, page) }}
        >
          ${page}
        </a>
        <span class="separator" aria-hidden="true">/</span>
      </li>
    `
  }

  render() {
    return html`
      <nav aria-label="Breadcrumb">
        <ol>
          ${this._renderPage(this.page1)}
          ${this.showPage2 ? this._renderPage(this.page2) : null}
          ${this.showPage3 ? this._renderPage(this.page3) : null}
          ${this.showPage4 ? this._renderPage(this.page4) : null}
          <li aria-current="page">
            <span class="current">${this.currentPage}</span>
          </li>
        </ol>
      </nav>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-breadcrumbs': ScBreadcrumbs
  }
}
