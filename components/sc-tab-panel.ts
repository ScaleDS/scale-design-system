import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { textL } from '@scale/design-system/scss/typography'

/**
 * The content panel paired with an `sc-tab`. Goes in the default slot of
 * `sc-tabs`; its `name` must match the controlling tab's `panel`. `sc-tabs`
 * toggles `active` to show/hide it and wires `aria-labelledby` back to the tab.
 */
@customElement('sc-tab-panel')
export class ScTabPanel extends LitElement {
  /** Unique name within the `sc-tabs` group; referenced by a tab's `panel`. */
  @property({ reflect: true }) name = ''
  /** Whether this panel is currently shown. Managed by `sc-tabs`. */
  @property({ type: Boolean, reflect: true }) active = false

  static styles = css`
    :host {
      display: block;
      ${textL}
      color: var(--sc-color-text-secondary);
    }

    :host(:not([active])) {
      display: none;
    }

    ::slotted(*) {
      margin-block: 0;
    }
  `

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('role', 'tabpanel')
    // APG: a tabpanel with no inherently focusable content is itself focusable.
    if (!this.hasAttribute('tabindex')) this.setAttribute('tabindex', '0')
  }

  updated() {
    this.setAttribute('aria-hidden', this.active ? 'false' : 'true')
  }

  render() {
    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-tab-panel': ScTabPanel
  }
}
