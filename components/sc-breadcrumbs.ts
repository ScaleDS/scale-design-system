import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { linkM, textM } from '@scale-ds/scale-design-system/scss/typography'
import { focusRing } from './sc-focus-ring'
import { reset } from './reset'

export interface Crumb {
  label: string
  href?: string
}

@customElement('sc-breadcrumbs')
export class ScBreadcrumbs extends LitElement {
  @property({ type: Array }) crumbs: Crumb[] = []
  @property() current = ''

  static styles = [reset, focusRing, css`
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
      ${linkM}
      color: var(--sc-color-text-link);
      text-decoration: none;
      cursor: pointer;
    }

    .link:hover {
      text-decoration: underline;
    }

    .separator {
      ${textM}
      color: var(--sc-color-text-tertiary);
      user-select: none;
    }

    .current {
      ${textM}
      color: var(--sc-color-text-secondary);
    }
  `]

  private _onCrumbClick(e: Event, crumb: Crumb, index: number) {
    // Only intercept when there's no href — let real links navigate.
    if (!crumb.href) e.preventDefault()
    this.dispatchEvent(new CustomEvent('navigate', {
      detail: { label: crumb.label, href: crumb.href, index },
      bubbles: true,
      composed: true,
    }))
  }

  render() {
    return html`
      <nav aria-label="Breadcrumb">
        <ol>
          ${this.crumbs.map((c, i) => {
            const hasFollowing = i < this.crumbs.length - 1 || !!this.current
            return html`
              <li>
                <a
                  class="link"
                  href=${c.href ?? '#'}
                  @click=${(e: Event) => this._onCrumbClick(e, c, i)}
                >${c.label}</a>
                ${hasFollowing ? html`<span class="separator" aria-hidden="true">/</span>` : ''}
              </li>
            `
          })}
          ${this.current ? html`
            <li aria-current="page">
              <span class="current">${this.current}</span>
            </li>
          ` : ''}
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
