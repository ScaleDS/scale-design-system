import { LitElement, html, css } from 'lit'
import { customElement } from 'lit/decorators.js'

@customElement('sc-section-bento')
export class ScSectionBento extends LitElement {

  static styles = css`
    *, *::before, *::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    :host {
      display: flex;
      justify-content: center;
      width: 100%;
    }

    .container {
      width: 100%;
      max-width: 1440px;
      padding: var(--sc-space-2xl) var(--sc-space-l);
      display: flex;
      flex-direction: column;
      gap: var(--sc-space-2xl);
    }

    /* ---- Section header (Center variant — text-align center) ---- */

    .header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--sc-space-l);
      align-self: center;
      text-align: center;
    }

    /* ---- Bento grid ---- */

    /*
     * Desktop & Tablet: 5-column, 2-row Z-pattern
     * Row 1: Card 1 (span 3) | Card 2 (span 2)
     * Row 2: Card 3 (span 2) | Card 4 (span 3)
     */

    .grid {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      grid-template-rows: 560px 560px;
      gap: var(--sc-space-2xl);
    }

    .cell { min-width: 0; min-height: 0; }

    .cell-1 { grid-column: span 3; grid-row: 1; }
    .cell-2 { grid-column: span 2; grid-row: 1; }
    .cell-3 { grid-column: span 2; grid-row: 2; }
    .cell-4 { grid-column: span 3; grid-row: 2; }

    /* Pass dimensions down to slotted sc-card-image */
    .cell ::slotted(*) {
      display: block;
      width: 100%;
      height: 100%;
    }

    /* ---- Tablet (≤ 810px) — same 5-col Z-pattern, reduced row height ---- */

    @media (max-width: 810px) {
      .grid {
        grid-template-rows: 408px 408px;
        gap: var(--sc-space-l);
      }
    }

    /* ---- Mobile (≤ 402px) — single column, 4 rows ---- */

    @media (max-width: 402px) {
      .container {
        padding: var(--sc-space-xl) var(--sc-space-l);
      }

      .grid {
        grid-template-columns: 1fr;
        grid-template-rows: repeat(4, 408px);
        gap: var(--sc-space-l);
      }

      .cell-1, .cell-2,
      .cell-3, .cell-4 {
        grid-column: 1;
        grid-row: auto;
      }
    }
  `

  render() {
    return html`
      <div class="container">
        <div class="header">
          <slot name="heading"></slot>
          <slot name="subtext"></slot>
        </div>
        <div class="grid">
          <div class="cell cell-1"><slot name="card-1"></slot></div>
          <div class="cell cell-2"><slot name="card-2"></slot></div>
          <div class="cell cell-3"><slot name="card-3"></slot></div>
          <div class="cell cell-4"><slot name="card-4"></slot></div>
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-section-bento': ScSectionBento
  }
}
