import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import '@scale/design-system/components/sc-avatar'

type AvatarGroupSize = 'l' | 'm' | 's'

// One overflow member as surfaced in the dropdown menu.
interface OverflowMember {
  src: string
  name: string
}

// Avatars stack with the first one painting on top. Bounded by the max
// supported value of the `max` attribute (controls hide-past-N rules below).
const STACK_MAX = 20

const stackingRules = unsafeCSS(
  Array.from({ length: STACK_MAX }, (_, i) =>
    `::slotted(sc-avatar:nth-child(${i + 1})) { z-index: ${STACK_MAX - i}; }`
  ).join('\n')
)

const hidingRules = unsafeCSS(
  Array.from({ length: STACK_MAX }, (_, i) =>
    `:host([max="${i + 1}"]) ::slotted(sc-avatar:nth-child(n+${i + 2})) { display: none; }`
  ).join('\n')
)

@customElement('sc-avatar-group')
export class ScAvatarGroup extends LitElement {
  @property({ reflect: true }) size: AvatarGroupSize = 'm'
  @property({ type: Number, reflect: true }) max = 4
  @state() private _overflow = 0
  @state() private _members: OverflowMember[] = []
  @state() private _open = false

  static styles = css`
    :host {
      display: inline-flex;
      position: relative;
    }

    .group {
      display: flex;
      align-items: center;
    }

    slot {
      display: contents;
    }

    ::slotted(sc-avatar) {
      border: 2px solid var(--sc-color-background-primary);
      border-radius: 50%;
      flex-shrink: 0;
      position: relative;
      margin-left: -4px;
    }

    ::slotted(sc-avatar:first-child) {
      margin-left: 0;
    }

    ${stackingRules}
    ${hidingRules}

    .overflow {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: var(--sc-color-background-neutral);
      color: var(--sc-color-text-secondary);
      font-weight: var(--sc-type-weight-regular);
      line-height: 1;
      flex-shrink: 0;
      border: 2px solid var(--sc-color-background-primary);
      position: relative;
      z-index: 0;
      margin: 0;
      padding: 0;
      font-family: inherit;
      cursor: pointer;
    }

    .overflow:hover {
      background: var(--sc-color-background-neutral-hover);
    }

    .overflow:focus-visible {
      outline: 2px solid var(--sc-color-border-focus);
      outline-offset: 2px;
    }

    /* ---- Overflow dropdown ---- */
    .menu {
      position: absolute;
      top: calc(100% + var(--sc-space-xs));
      right: 0;
      z-index: 100;
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 200px;
      padding: var(--sc-space-xs);
      box-sizing: border-box;
      background: var(--sc-color-background-primary);
      border: 1px solid var(--sc-color-border-subtle);
      border-radius: var(--sc-border-radius-m);
      box-shadow: var(--sc-shadow-l3);
    }

    .menu-item {
      display: flex;
      align-items: center;
      gap: var(--sc-space-s);
      width: 100%;
      padding: var(--sc-space-xs) var(--sc-space-s);
      margin: 0;
      border: none;
      border-radius: var(--sc-border-radius-s);
      background: none;
      font-family: inherit;
      font-size: var(--sc-type-size-s);
      color: var(--sc-color-text-primary);
      text-align: left;
      white-space: nowrap;
      cursor: pointer;
    }

    .menu-item:hover {
      background: var(--sc-color-background-hover);
    }

    .menu-item:focus-visible {
      outline: 2px solid var(--sc-color-border-focus);
      outline-offset: -2px;
    }

    :host([size='l']) .overflow {
      width: 48px;
      height: 48px;
      font-size: var(--sc-type-size-s);
    }

    :host([size='m']) .overflow {
      width: 32px;
      height: 32px;
      font-size: 11px;
    }

    :host([size='s']) .overflow {
      width: 24px;
      height: 24px;
      font-size: 10px;
    }
  `

  // Recompute the overflow count and the hidden members surfaced in the menu.
  private _recompute() {
    const slot = this.shadowRoot?.querySelector('slot')
    if (!slot) return
    const assigned = slot.assignedElements()
    this._overflow = Math.max(0, assigned.length - this.max)
    this._members = assigned.slice(this.max).map((el) => ({
      src: el.getAttribute('src') || '',
      name: el.getAttribute('alt') || '',
    }))
    if (this._overflow === 0) this._open = false
  }

  private _onSlotChange() {
    this._recompute()
  }

  firstUpdated() {
    this._recompute()
  }

  protected updated(changed: Map<string, unknown>) {
    if (changed.has('max')) this._recompute()
  }

  connectedCallback() {
    super.connectedCallback()
    document.addEventListener('click', this._onDocClick)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    document.removeEventListener('click', this._onDocClick)
  }

  // Close when a click lands outside this element.
  private _onDocClick = (e: MouseEvent) => {
    if (this._open && !e.composedPath().includes(this)) this._open = false
  }

  private _toggle() {
    this._open = !this._open
  }

  private _onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape' && this._open) {
      this._open = false
      ;(this.shadowRoot?.querySelector('.overflow') as HTMLElement | null)?.focus()
    }
  }

  render() {
    return html`
      <div class="group" role="group" aria-label="Avatar group" @keydown=${this._onKeyDown}>
        <slot @slotchange=${this._onSlotChange}></slot>
        ${this._overflow > 0 ? html`
          <button
            class="overflow"
            type="button"
            aria-haspopup="menu"
            aria-expanded=${this._open}
            aria-label="${this._overflow} more"
            @click=${this._toggle}
          >+${this._overflow}</button>
        ` : null}
        ${this._open && this._members.length ? html`
          <div class="menu" role="menu" aria-label="More people">
            ${this._members.map((m) => html`
              <button class="menu-item" type="button" role="menuitem">
                <sc-avatar size="s" src=${m.src} alt=${m.name}></sc-avatar>
                <span>${m.name}</span>
              </button>
            `)}
          </div>
        ` : null}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-avatar-group': ScAvatarGroup
  }
}
