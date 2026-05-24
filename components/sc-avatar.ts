import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { icons } from 'feather-icons'

type AvatarSize = 'xl' | 'l' | 'm' | 's' | 'xs'

@customElement('sc-avatar')
export class ScAvatar extends LitElement {
  @property({ reflect: true }) size: AvatarSize = 'm'
  @property() src = ''
  @property() alt = ''
  @property({ type: Boolean, reflect: true }) disabled = false

  static styles = css`
    :host {
      display: inline-flex;
    }

    .avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      overflow: hidden;
      background: var(--sc-color-background-neutral);
      color: var(--sc-color-text-secondary);
      flex-shrink: 0;
    }

    .avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    .initials {
      font-weight: var(--sc-type-weight-regular);
      line-height: 1;
      user-select: none;
    }

    svg {
      display: block;
      color: var(--sc-color-icon-secondary);
    }

    /* ---- Disabled ---- */
    :host([disabled]) .avatar {
      opacity: 0.4;
    }

    /* ---- Sizes ---- */
    :host([size='xl']) .avatar {
      width: 96px;
      height: 96px;
    }
    :host([size='xl']) .initials {
      font-size: var(--sc-type-size-2xl);
    }
    :host([size='xl']) svg {
      width: 40px;
      height: 40px;
    }

    :host([size='l']) .avatar {
      width: 48px;
      height: 48px;
    }
    :host([size='l']) .initials {
      font-size: var(--sc-type-size-l);
    }
    :host([size='l']) svg {
      width: 24px;
      height: 24px;
    }

    :host([size='m']) .avatar {
      width: 32px;
      height: 32px;
    }
    :host([size='m']) .initials {
      font-size: var(--sc-type-size-s);
    }
    :host([size='m']) svg {
      width: 16px;
      height: 16px;
    }

    :host([size='s']) .avatar {
      width: 24px;
      height: 24px;
    }
    :host([size='s']) .initials {
      font-size: 11px;
    }
    :host([size='s']) svg {
      width: 12px;
      height: 12px;
    }

    :host([size='xs']) .avatar {
      width: 16px;
      height: 16px;
    }
    :host([size='xs']) svg {
      width: 8px;
      height: 8px;
    }
  `

  private _getInitial(): string {
    return this.alt ? this.alt.charAt(0).toUpperCase() : ''
  }

  render() {
    const hasSrc = !!this.src
    const hasAlt = !!this.alt
    const initial = this._getInitial()

    let content
    if (hasSrc) {
      content = html`<img src="${this.src}" alt="${this.alt}" />`
    } else if (initial) {
      content = html`<span class="initials" aria-hidden="true">${initial}</span>`
    } else {
      content = html`${unsafeHTML(icons['user'].toSvg())}`
    }

    return html`
      <div class="avatar" role="img" aria-label="${this.alt || 'Avatar'}">
        ${content}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-avatar': ScAvatar
  }
}
