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
      /* The 0fr->1fr grid technique, kept — it animates to the content's real
         height with no measurement. Only the timing comes from the tokens, and
         it's the in-place pair: the panel is visible before and after, so there's
         no arrival or departure to imply. */
      transition: grid-template-rows var(--sc-motion-transition-collapse);
    }

    :host([open]) .body {
      grid-template-rows: 1fr;
      transition: grid-template-rows var(--sc-motion-transition-expand);
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
      /* rotate, not transform, so the flip composes with anything else the
         chevron might animate later. */
      transition: rotate var(--sc-motion-transition-control);
      color: var(--sc-color-icon-primary);
    }

    :host([open]) .chevron {
      rotate: 180deg;
    }

    .chevron svg {
      display: block;
      width: 24px;
      height: 24px;
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
