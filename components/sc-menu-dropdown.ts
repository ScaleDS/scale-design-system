import { LitElement, html, css } from 'lit'
import { customElement, query } from 'lit/decorators.js'
import { ScMenuItem } from '@scale-ds/scale-design-system/components/sc-menu-item'

@customElement('sc-menu-dropdown')
export class ScMenuDropdown extends LitElement {
  @query('slot') private _slot!: HTMLSlotElement

  static styles = css`
    :host {
      display: inline-block;
      background: var(--sc-color-surface-l2);
      border-radius: var(--sc-border-radius-s);
      box-shadow: var(--sc-shadow-l2);
      min-width: 370px;
      overflow: clip;
    }

    .menu {
      display: block;
      box-sizing: border-box;
      width: 100%;
      padding: var(--sc-space-s);
    }

    .items {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      width: 100%;
    }

    ::slotted(sc-menu-item) {
      width: 100%;
      flex-shrink: 0;
      min-width: 0;
    }
  `

  private _getItems() {
    return this._slot?.assignedElements().filter(
      (el): el is ScMenuItem => el instanceof ScMenuItem
    ) ?? []
  }

  private _onKeyDown(e: KeyboardEvent) {
    const items = this._getItems()
    if (items.length === 0) return

    const current = items.indexOf(items.find(el => el === this.shadowRoot?.activeElement || el.matches(':focus-within')) ?? items[0])

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      const next = (current + 1) % items.length
      items[next]?.focus()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      const prev = (current - 1 + items.length) % items.length
      items[prev]?.focus()
    } else if (e.key === 'Home') {
      e.preventDefault()
      items[0]?.focus()
    } else if (e.key === 'End') {
      e.preventDefault()
      items[items.length - 1]?.focus()
    } else if (e.key === 'Escape') {
      this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }))
    }
  }

  render() {
    return html`
      <div
        class="menu"
        role="menu"
        @keydown=${this._onKeyDown}
      >
        <div class="items">
          <slot></slot>
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-menu-dropdown': ScMenuDropdown
  }
}
