import { LitElement, html, css, type PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { focusRing } from './sc-focus-ring.js'
import { featherIcon } from './feather.js'

type CardSelectorType = 'checkbox' | 'radio'

@customElement('sc-card-selector')
export class ScCardSelector extends LitElement {
  @property({ reflect: true }) type: CardSelectorType = 'checkbox'
  @property({ type: Boolean, reflect: true }) checked = false
  @property({ type: Boolean, reflect: true }) disabled = false
  @property() name = ''
  @property() value = ''
  @property({ type: Boolean, attribute: 'hide-indicator', reflect: true }) hideIndicator = false

  static styles = [
    focusRing,
    css`
    :host {
      display: block;
    }

    button {
      display: flex;
      align-items: flex-start;
      gap: var(--sc-space-m);
      width: 100%;
      padding: var(--sc-space-l);
      background: var(--sc-color-background-primary);
      color: var(--sc-color-text-primary);
      border-radius: var(--sc-border-radius-s);
      /*
       * "Border" is an inset box-shadow rather than a real CSS border so the
       * 1px→2px thickening on :checked doesn't take layout space — content
       * stays anchored at exactly var(--sc-space-l) from the edge in every
       * state, and the transition can't introduce a sub-150ms layout jiggle.
       */
      border: none;
      box-shadow: inset 0 0 0 var(--sc-border-width-s) var(--sc-color-border-primary);
      cursor: pointer;
      font: inherit;
      text-align: left;
      box-sizing: border-box;
      transition: box-shadow 150ms ease;
    }

    /*
     * Hover does NOT change the card-level border (per Figma — only the
     * indicator highlights). Keeps the surface calm and draws attention
     * to the actual selection control instead.
     */

    /* checked */
    :host([checked]) button {
      box-shadow: inset 0 0 0 var(--sc-border-width-l) var(--sc-color-border-selected);
    }

    /* disabled */
    :host([disabled]) button {
      cursor: not-allowed;
      opacity: 0.5;
    }

    .content {
      flex: 1;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: var(--sc-space-xs);
    }

    .indicator {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      background: var(--sc-color-background-primary);
      border: var(--sc-border-width-s) solid var(--sc-color-border-primary);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      color: var(--sc-color-icon-inverse);
      box-sizing: border-box;
      transition: background 150ms ease, border-color 150ms ease, border-width 150ms ease;
    }

    :host([type='checkbox']) .indicator { border-radius: var(--sc-border-radius-s); }
    :host([type='radio']) .indicator    { border-radius: 50%; }

    /* indicator follows the card border treatment on hover/checked */
    button:hover:not(:disabled) .indicator {
      border-width: var(--sc-border-width-l);
      border-color: var(--sc-color-border-selected);
    }

    :host([checked]) .indicator {
      background: var(--sc-color-background-brand);
      border-color: var(--sc-color-background-brand);
      border-width: var(--sc-border-width-s);
    }

    .indicator svg {
      display: block;
      width: 16px;
      height: 16px;
      stroke-width: 3;
    }

    /* Radio dot when checked */
    .radio-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--sc-color-icon-inverse);
    }
  `]

  protected updated(changed: PropertyValues) {
    if (changed.has('checked') || changed.has('disabled') || changed.has('type')) {
      // Surface the semantic state on the host for assistive tech that reads the host directly.
      this.setAttribute('aria-checked', String(this.checked))
      if (this.disabled) this.setAttribute('aria-disabled', 'true')
      else this.removeAttribute('aria-disabled')
    }
  }

  focus(options?: FocusOptions) {
    this.shadowRoot?.querySelector('button')?.focus(options)
  }

  private _onClick(e: Event) {
    if (this.disabled) return
    e.preventDefault()
    if (this.type === 'radio') {
      if (this.checked) return
      this._uncheckSiblings()
      this.checked = true
    } else {
      this.checked = !this.checked
    }
    this.dispatchEvent(new CustomEvent('change', {
      detail: { checked: this.checked, value: this.value },
      bubbles: true,
      composed: true,
    }))
  }

  private _uncheckSiblings() {
    if (!this.name) return
    const root = this.getRootNode() as Document | ShadowRoot
    const siblings = root.querySelectorAll<ScCardSelector>(
      `sc-card-selector[type='radio'][name='${this.name}']`,
    )
    siblings.forEach(s => { if (s !== this && s.checked) s.checked = false })
  }

  render() {
    const role = this.type === 'radio' ? 'radio' : 'checkbox'
    const indicator = this.hideIndicator
      ? null
      : html`
        <span class="indicator" aria-hidden="true">
          ${this.checked
            ? (this.type === 'checkbox'
                ? featherIcon('check', { width: 16, height: 16 })
                : html`<span class="radio-dot"></span>`)
            : null}
        </span>
      `
    return html`
      <button
        type="button"
        role=${role}
        aria-checked=${this.checked ? 'true' : 'false'}
        ?disabled=${this.disabled}
        @click=${this._onClick}
      >
        <span class="content"><slot></slot></span>
        ${indicator}
      </button>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-card-selector': ScCardSelector
  }
}
