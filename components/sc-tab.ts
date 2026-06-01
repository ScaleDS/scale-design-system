import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { labelS } from '@scale/design-system/scss/typography'

/**
 * A single tab in an `sc-tabs` nav. Goes in the `nav` slot of `sc-tabs` and is
 * paired with an `sc-tab-panel` via the `panel` attribute (which must match the
 * panel's `name`). The host itself carries `role="tab"` and the roving tabindex —
 * `sc-tabs` owns selection, focus, and ARIA wiring, so most consumers never set
 * `active`/`controls` directly.
 *
 * Mirrors the Figma "Tab Item": default (tertiary text), hover (hover bg +
 * secondary text), and selected (secondary text + 2px brand underline).
 */
@customElement('sc-tab')
export class ScTab extends LitElement {
  /** Name of the `sc-tab-panel` this tab controls (matches the panel's `name`). */
  @property({ reflect: true }) panel = ''
  /** Whether this tab is the active/selected one. Managed by `sc-tabs`. */
  @property({ type: Boolean, reflect: true }) active = false
  /** Disables the tab — not selectable or focusable. */
  @property({ type: Boolean, reflect: true }) disabled = false
  /** id of the controlled panel, for `aria-controls`. Set by `sc-tabs`. */
  @property({ attribute: false }) controls = ''

  static styles = css`
    :host {
      box-sizing: border-box;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--sc-space-xs);
      height: 40px;
      padding: 0 var(--sc-space-s);
      /* 2px selected indicator; transparent by default so there's no layout
         shift between states. Pulled down 1px to overlap the nav's bottom line. */
      border-bottom: var(--sc-border-width-l) solid transparent;
      margin-bottom: calc(-1 * var(--sc-border-width-s));
      ${labelS}
      color: var(--sc-color-text-tertiary);
      white-space: nowrap;
      cursor: pointer;
      user-select: none;
      outline: none;
      transition: background 200ms ease, color 200ms ease, border-color 150ms ease;
    }

    :host(:hover:not([disabled])) {
      background: var(--sc-color-background-hover);
      color: var(--sc-color-text-secondary);
    }

    :host([active]) {
      color: var(--sc-color-text-secondary);
      border-bottom-color: var(--sc-color-border-selected);
    }

    :host([disabled]) {
      color: var(--sc-color-text-disabled);
      cursor: not-allowed;
    }

    /* The host is the focusable role="tab"; reuse the shared ring tokens. */
    :host(:focus-visible) {
      outline: var(--sc-border-width-l) dashed var(--sc-color-border-mono);
      outline-offset: var(--sc-border-width-l);
    }

    ::slotted([slot='prefix']),
    ::slotted([slot='suffix']) {
      display: inline-flex;
      width: 24px;
      height: 24px;
    }
  `

  connectedCallback() {
    super.connectedCallback()
    this.setAttribute('role', 'tab')
    this._sync()
  }

  updated() {
    this._sync()
  }

  private _sync() {
    this.setAttribute('aria-selected', this.active ? 'true' : 'false')
    this.setAttribute('tabindex', this.active && !this.disabled ? '0' : '-1')
    if (this.disabled) this.setAttribute('aria-disabled', 'true')
    else this.removeAttribute('aria-disabled')
    if (this.controls) this.setAttribute('aria-controls', this.controls)
  }

  render() {
    return html`
      <slot name="prefix"></slot>
      <slot></slot>
      <slot name="suffix"></slot>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-tab': ScTab
  }
}
