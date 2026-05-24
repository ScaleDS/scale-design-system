import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

type AvatarGroupSize = 'l' | 'm' | 's'

@customElement('sc-avatar-group')
export class ScAvatarGroup extends LitElement {
  @property({ reflect: true }) size: AvatarGroupSize = 'm'
  @property({ type: Number }) max = 4
  @state() private _overflow = 0

  static styles = css`
    :host {
      display: inline-flex;
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
    }

    ::slotted(sc-avatar.hidden) {
      display: none;
    }

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

  private _updateOverflow(slot: HTMLSlotElement) {
    const assigned = slot.assignedElements()
    this._overflow = assigned.length > this.max ? assigned.length - this.max : 0
    assigned.forEach((el, i) => {
      const hidden = i >= this.max
      el.classList.toggle('hidden', hidden)
      el.style.marginRight = hidden ? '' : '-4px'
      el.style.zIndex = hidden ? '' : `${assigned.length - i + 1}`
    })
  }

  private _onSlotChange(e: Event) {
    this._updateOverflow(e.target as HTMLSlotElement)
  }

  firstUpdated() {
    const slot = this.shadowRoot?.querySelector('slot')
    if (slot) this._updateOverflow(slot)
  }

  render() {
    return html`
      <div class="group" role="group" aria-label="Avatar group">
        <slot @slotchange=${this._onSlotChange}></slot>
        ${this._overflow > 0 ? html`<span class="overflow" aria-label="${this._overflow} more" role="img">+${this._overflow}</span>` : null}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-avatar-group': ScAvatarGroup
  }
}
