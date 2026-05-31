import { LitElement, html, css, type PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'

type StatusIndicatorStatus =
  | 'default'
  | 'brand'
  | 'info'
  | 'warning'
  | 'negative'
  | 'positive'
  | 'inverse'
  | 'disabled'

// Status Indicator — a small 8×8 coloured dot that conveys a status by colour.
// Purely presentational (no focusable element, so no focusRing). Because colour
// alone isn't an accessible signal, it's decorative by default (aria-hidden) and
// meant to sit beside a visible text label; pass `label` to expose it as an
// `img` with an accessible name when it stands alone.
@customElement('sc-status-indicator')
export class ScStatusIndicator extends LitElement {
  /** Colour variant. */
  @property({ reflect: true }) status: StatusIndicatorStatus = 'default'
  /** Accessible name. When set, the dot is exposed as `role="img"`; when empty
   *  it's decorative (the colour supplements adjacent text). */
  @property() label = ''

  protected updated(changed: PropertyValues) {
    if (changed.has('label')) {
      if (this.label) {
        this.setAttribute('role', 'img')
        this.setAttribute('aria-label', this.label)
        this.removeAttribute('aria-hidden')
      } else {
        this.removeAttribute('role')
        this.removeAttribute('aria-label')
        this.setAttribute('aria-hidden', 'true')
      }
    }
  }

  static styles = css`
    :host {
      display: inline-flex;
      flex-shrink: 0;
    }

    .dot {
      /* Fixed 8px diameter — the dot has no size token in the design system.
         Border-radius xs (4px) on an 8px box yields a full circle. The
         transparent border keeps the footprint stable across the disabled
         variant (which adds a visible border) via border-box. */
      box-sizing: border-box;
      width: 8px;
      height: 8px;
      border-radius: var(--sc-border-radius-xs);
      border: var(--sc-border-width-s) solid transparent;
    }

    :host([status='default']) .dot {
      background: var(--sc-color-background-neutral);
    }
    :host([status='brand']) .dot {
      background: var(--sc-color-background-brand);
    }
    :host([status='info']) .dot {
      background: var(--sc-color-background-info);
    }
    :host([status='warning']) .dot {
      background: var(--sc-color-background-warning);
    }
    :host([status='negative']) .dot {
      background: var(--sc-color-background-negative);
    }
    :host([status='positive']) .dot {
      background: var(--sc-color-background-positive);
    }
    :host([status='inverse']) .dot {
      background: var(--sc-color-background-inverse);
    }
    :host([status='disabled']) .dot {
      background: var(--sc-color-background-disabled);
      border-color: var(--sc-color-border-disabled);
    }
  `

  render() {
    return html`<span class="dot" part="dot"></span>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-status-indicator': ScStatusIndicator
  }
}
