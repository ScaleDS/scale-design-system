import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { headingS, textL } from '@scale-ds/scale-design-system/scss/typography'
import '@scale-ds/scale-design-system/components/sc-divider'
import { focusRing } from './sc-focus-ring.js'
import { featherIcon } from './feather.js'

@customElement('sc-accordion')
export class ScAccordion extends LitElement {
  @property({ type: Boolean, reflect: true }) open = false
  @property() heading = 'Heading'

  private _id = Math.random().toString(36).slice(2, 11)

  static styles = [
    focusRing,
    css`
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    .header {
      display: flex;
      align-items: flex-start;
      gap: var(--sc-space-s);
      padding: var(--sc-space-m) var(--sc-space-m) var(--sc-space-m) var(--sc-space-l);
      background: none;
      border: none;
      cursor: pointer;
      text-align: left;
      width: 100%;
      color: var(--sc-color-text-primary);
      outline: none;
    }

    .header:hover {
      background: var(--sc-color-background-hover);
    }

    h6 {
      ${headingS}
      flex: 1;
      min-width: 0;
      margin: 0;
    }

    .body {
      display: grid;
      grid-template-rows: 0fr;
      transition: grid-template-rows 200ms ease;
    }

    :host([open]) .body {
      grid-template-rows: 1fr;
    }

    .body-inner {
      overflow: hidden;
      min-height: 0;
    }

    p {
      ${textL}
      padding: 0 var(--sc-space-l) var(--sc-space-l) var(--sc-space-l);
      color: var(--sc-color-text-primary);
      margin: 0;
    }

    .chevron {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: transform 200ms ease;
      color: var(--sc-color-icon-primary);
    }

    :host([open]) .chevron {
      transform: rotate(180deg);
    }

    .chevron svg {
      display: block;
      width: 24px;
      height: 24px;
    }

    @media (prefers-reduced-motion: reduce) {
      .body {
        transition: none;
      }
      .chevron {
        transition: none;
      }
    }
  `]

  private toggle() {
    this.open = !this.open
    this.dispatchEvent(new CustomEvent('toggle', { detail: { open: this.open } }))
  }

  render() {
    const headerId = `sc-accordion-header-${this._id}`
    const contentId = `sc-accordion-content-${this._id}`

    return html`
      <button
        class="header"
        id=${headerId}
        aria-expanded=${this.open ? 'true' : 'false'}
        aria-controls=${contentId}
        @click=${this.toggle}
      >
        <h6>${this.heading}</h6>
        <span class="chevron">
          ${featherIcon('chevron-down')}
        </span>
      </button>
      <div class="body" id=${contentId} role="region" aria-labelledby=${headerId}>
        <div class="body-inner">
          <p><slot></slot></p>
        </div>
      </div>
      <sc-divider variant="subtle"></sc-divider>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-accordion': ScAccordion
  }
}
