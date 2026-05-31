import { LitElement, html, css, type PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'

type SpinnerSize = 'l' | 's'
type SpinnerType = 'primary' | 'negative' | 'mono' | 'inverse'

// Spinner — an indeterminate loading indicator: a 270° arc that rotates. Purely
// presentational (no focusable element, so no focusRing); it exposes role=status
// + an aria-label on the host so assistive tech announces the loading state, and
// the decorative SVG is aria-hidden.
//
// The viewBox is sized 1:1 with the host (24 or 48) so stroke-width maps directly
// to the Border Width tokens — XL (4) at size L, L (2) at size S — with no
// scaling tricks. Colours come from the Border/* tokens.
@customElement('sc-spinner')
export class ScSpinner extends LitElement {
  /** Diameter: `l` = 48px, `s` = 24px. */
  @property({ reflect: true }) size: SpinnerSize = 'l'
  /** Colour variant. `inverse` is for dark backgrounds. */
  @property({ reflect: true }) type: SpinnerType = 'primary'
  /** Accessible name announced while spinning. */
  @property() label = 'Loading'

  connectedCallback() {
    super.connectedCallback()
    if (!this.hasAttribute('role')) this.setAttribute('role', 'status')
  }

  protected updated(changed: PropertyValues) {
    if (changed.has('label')) this.setAttribute('aria-label', this.label)
  }

  static styles = css`
    :host {
      display: inline-flex;
    }

    :host([size='l']) { width: 48px; height: 48px; }
    :host([size='s']) { width: 24px; height: 24px; }

    svg {
      width: 100%;
      height: 100%;
      transform-origin: center;
      animation: sc-spinner-rotate 800ms linear infinite;
    }

    circle {
      fill: none;
      stroke-linecap: round;
    }

    :host([size='l']) circle { stroke-width: var(--sc-border-width-xl); }
    :host([size='s']) circle { stroke-width: var(--sc-border-width-l); }

    :host([type='primary']) circle { stroke: var(--sc-color-border-brand); }
    :host([type='negative']) circle { stroke: var(--sc-color-border-negative); }
    :host([type='mono']) circle { stroke: var(--sc-color-border-mono); }
    :host([type='inverse']) circle { stroke: var(--sc-color-border-inverse); }

    @keyframes sc-spinner-rotate {
      to { transform: rotate(360deg); }
    }

    /* Honour reduced-motion by slowing (not stopping — the motion is the
       indicator's meaning, so it must still convey "in progress"). */
    @media (prefers-reduced-motion: reduce) {
      svg { animation-duration: 2000ms; }
    }
  `

  render() {
    // 1:1 viewBox with the host px size; stroke sits fully inside the box.
    const box = this.size === 's' ? 24 : 48
    const strokeInset = this.size === 's' ? 2 : 4
    const r = (box - strokeInset) / 2
    const circumference = 2 * Math.PI * r
    const arc = circumference * 0.75 // visible 270° arc
    return html`
      <svg viewBox="0 0 ${box} ${box}" part="svg" aria-hidden="true">
        <circle
          cx=${box / 2}
          cy=${box / 2}
          r=${r}
          stroke-dasharray="${arc} ${circumference - arc}"
        ></circle>
      </svg>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-spinner': ScSpinner
  }
}
