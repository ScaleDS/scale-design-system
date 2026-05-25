import { LitElement, html, css, unsafeCSS } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

type AvatarGroupSize = 'l' | 'm' | 's'

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

  private _onSlotChange(e: Event) {
    const assigned = (e.target as HTMLSlotElement).assignedElements()
    this._overflow = Math.max(0, assigned.length - this.max)
  }

  firstUpdated() {
    const slot = this.shadowRoot?.querySelector('slot')
    if (slot) {
      const assigned = slot.assignedElements()
      this._overflow = Math.max(0, assigned.length - this.max)
    }
  }

  protected updated(changed: Map<string, unknown>) {
    if (changed.has('max')) {
      const slot = this.shadowRoot?.querySelector('slot')
      if (slot) {
        const assigned = slot.assignedElements()
        this._overflow = Math.max(0, assigned.length - this.max)
      }
    }
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
