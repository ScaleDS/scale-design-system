import { LitElement, html, css, isServer } from 'lit'
import { customElement, property, query } from 'lit/decorators.js'
import './sc-button-icon.js'

/**
 * sc-modal — a modal dialog built on the native `<dialog>` element.
 *
 * Native `<dialog>.showModal()` provides top-layer rendering, focus trapping,
 * Escape-to-close and focus restoration to the trigger (per the WAI-ARIA APG
 * Dialog (Modal) pattern), so we don't reimplement any of it.
 *
 * Slots:
 *  - (default) — the dialog body content
 *  - `heading` — optional rich heading content (overrides the `heading` property)
 *  - `actions` — footer buttons (e.g. `sc-button`); the footer is hidden when empty
 *
 * The heading uses the `3xl` type scale, which the responsive type tokens shrink
 * from 24/32 (Heading/M) to 20/28 (Heading/S) at ≤810px — matching the Figma
 * Desktop/Mobile device variants without a manual prop.
 */
@customElement('sc-modal')
export class ScModal extends LitElement {
  /** Whether the modal is open. */
  @property({ type: Boolean, reflect: true }) open = false
  /** Plain-text heading shown at the top of the modal. */
  @property() heading = ''
  /** Accessible label for the close button. */
  @property({ attribute: 'close-label' }) closeLabel = 'Close'
  /** Disable dismissing via the Escape key or a backdrop click. */
  @property({ type: Boolean, attribute: 'no-dismiss', reflect: true }) noDismiss = false

  @query('dialog') private _dialog!: HTMLDialogElement

  private _prevBodyOverflow = ''

  static styles = css`
    :host {
      display: contents;
    }

    dialog {
      box-sizing: border-box;
      margin: auto;
      padding: 0;
      border: none;
      background: transparent;
      color: inherit;
      max-width: none;
      max-height: none;
      overflow: visible;
      /* Fade in/out. display + overlay are animated with allow-discrete so the
         exit fade plays before display:none and the dialog stays in the top
         layer for the duration. */
      opacity: 0;
      transition: opacity 250ms ease, display 250ms allow-discrete, overlay 250ms allow-discrete;
    }

    dialog[open] {
      opacity: 1;
    }

    /* Entry start state — must be declared after the dialog[open] rule. */
    @starting-style {
      dialog[open] {
        opacity: 0;
      }
    }

    dialog::backdrop {
      background: var(--sc-color-overlay-70-inverse-static);
      opacity: 0;
      transition: opacity 250ms ease, display 250ms allow-discrete, overlay 250ms allow-discrete;
    }

    dialog[open]::backdrop {
      opacity: 1;
    }

    @starting-style {
      dialog[open]::backdrop {
        opacity: 0;
      }
    }

    .modal {
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: var(--sc-space-s);
      width: 608px;
      max-width: calc(100vw - 2 * var(--sc-space-xl));
      max-height: calc(100dvh - 2 * var(--sc-space-xl));
      padding: var(--sc-space-2xl);
      background: var(--sc-color-surface-l3);
      border-radius: var(--sc-border-radius-l);
      box-shadow: var(--sc-shadow-l3);
    }

    .header {
      display: flex;
      align-items: flex-start;
      gap: var(--sc-space-s);
    }

    .heading {
      flex: 1 0 0;
      min-width: 0;
      margin: 0;
      padding-top: var(--sc-space-s);
      word-break: break-word;
      color: var(--sc-color-text-primary);
      font-family: var(--sc-type-family-inter), sans-serif;
      font-size: var(--sc-type-size-3xl);
      line-height: var(--sc-type-line-height-3xl);
      letter-spacing: var(--sc-type-letter-spacing-s);
      font-weight: var(--sc-type-weight-semi-bold);
    }

    .body {
      flex: 1 1 auto;
      min-height: 0;
      overflow: auto;
      /* overflow:auto clips even when not scrolling, which would cut a slotted
         child's focus ring (2px outline + 2px offset). Pad the scroll box by
         that amount and pull it back with a negative margin so the ring has
         room while the body stays flush with the modal gap/padding. */
      padding: var(--sc-space-xs);
      margin: calc(-1 * var(--sc-space-xs));
    }

    .actions {
      display: flex;
      gap: var(--sc-space-s);
      padding-top: var(--sc-space-l);
    }

    /* Equal-width buttons that fill the footer (Desktop: secondary, primary). */
    .actions ::slotted(*) {
      flex: 1 0 0;
    }

    /* Hidden until something is slotted in. */
    .actions.empty {
      display: none;
    }

    /* Mobile: stack the actions, primary on top (reverse the DOM order). */
    @media (max-width: 810px) {
      .modal {
        padding: var(--sc-space-l);
      }
      .actions {
        flex-direction: column-reverse;
      }
      .actions ::slotted(*) {
        width: 100%;
      }
    }
  `

  /** Open the modal. */
  show() {
    this.open = true
  }

  /** Close the modal. */
  close() {
    this.open = false
  }

  private _syncDialog() {
    if (!this._dialog) return
    if (this.open && !this._dialog.open) {
      this._dialog.showModal()
      this._lockScroll()
      this.dispatchEvent(new CustomEvent('sc-open', { bubbles: true, composed: true }))
    } else if (!this.open && this._dialog.open) {
      this._dialog.close()
    }
  }

  private _lockScroll() {
    if (isServer) return
    this._prevBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }

  private _unlockScroll() {
    if (isServer) return
    document.body.style.overflow = this._prevBodyOverflow
  }

  // Fired by the native dialog on Escape; cancel it when dismissal is disabled.
  private _onCancel(e: Event) {
    if (this.noDismiss) {
      e.preventDefault()
      return
    }
  }

  // Native dialog `close` — the single source of truth for "now closed".
  private _onClose() {
    this._unlockScroll()
    if (this.open) this.open = false
    this.dispatchEvent(new CustomEvent('sc-close', { bubbles: true, composed: true }))
  }

  // A click whose target is the dialog itself is a click on the backdrop.
  private _onClick(e: MouseEvent) {
    if (this.noDismiss) return
    if (e.target === this._dialog) this.close()
  }

  private _onSlotChange(e: Event) {
    const slot = e.target as HTMLSlotElement
    const parent = slot.parentElement
    if (parent) parent.classList.toggle('empty', slot.assignedNodes({ flatten: true }).length === 0)
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has('open')) this._syncDialog()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    this._unlockScroll()
  }

  render() {
    return html`
      <dialog
        part="dialog"
        @cancel=${this._onCancel}
        @close=${this._onClose}
        @click=${this._onClick}
      >
        <div class="modal" part="modal" role="document">
          <div class="header" part="header">
            <h2 class="heading" part="heading"><slot name="heading">${this.heading}</slot></h2>
            <sc-button-icon
              part="close"
              type="tertiary-mono"
              size="l"
              icon="x"
              label=${this.closeLabel}
              @click=${this.close}
            ></sc-button-icon>
          </div>
          <div class="body" part="body"><slot></slot></div>
          <div class="actions empty" part="actions">
            <slot name="actions" @slotchange=${this._onSlotChange}></slot>
          </div>
        </div>
      </dialog>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-modal': ScModal
  }
}
