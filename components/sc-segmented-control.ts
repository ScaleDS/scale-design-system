import { LitElement, html, css, nothing, type PropertyValues } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { labelM } from '@scale/design-system/scss/typography'
import { focusRing } from './sc-focus-ring'
import { featherIcon } from './feather'

/** One selectable segment. `value` is required; `label` shows the text (and
 *  doubles as the accessible name when icon-only), `icon` is a Feather name. */
export interface SegmentedItem {
  label?: string
  value: string
  icon?: string
  disabled?: boolean
}

/**
 * Segmented control — a pill container holding 2–4 mutually-exclusive segments,
 * one selected at a time. Following the segmented-control a11y pattern (Primer /
 * not a radiogroup or tablist): every segment is a real `<button>` in the tab
 * order, the selected one carries `aria-current="true"`, and selection happens
 * on activation (click / Enter / Space) — no arrow-key roving.
 *
 * Form-associated: submits the selected `value` under `name`.
 */
@customElement('sc-segmented-control')
export class ScSegmentedControl extends LitElement {
  static formAssociated = true

  /** The segments to render. Set as a property: `.items=${[...]}`. */
  @property({ attribute: false }) items: SegmentedItem[] = []
  /** The selected segment's `value`. */
  @property({ reflect: true }) value = ''
  /** Form field name (for form submission). */
  @property() name = ''
  /** Disables the whole control. */
  @property({ type: Boolean, reflect: true }) disabled = false
  /** Render segments as icon-only (label becomes the accessible name). */
  @property({ type: Boolean, reflect: true, attribute: 'icon-only' }) iconOnly = false
  /** Accessible label for the group. */
  @property({ attribute: 'label' }) label = ''

  private _internals = this.attachInternals()
  private _initialValue = ''

  get form() { return this._internals.form }
  get validity() { return this._internals.validity }
  get validationMessage() { return this._internals.validationMessage }
  get willValidate() { return this._internals.willValidate }
  checkValidity() { return this._internals.checkValidity() }
  reportValidity() { return this._internals.reportValidity() }

  connectedCallback() {
    super.connectedCallback()
    this._initialValue = this.value
  }

  protected updated(changed: PropertyValues) {
    if (changed.has('value')) this._internals.setFormValue(this.value || null)
  }

  formResetCallback() {
    this.value = this._initialValue
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled
  }

  /** Move keyboard focus to the selected segment (or the first enabled one). */
  focus(options?: FocusOptions) {
    const root = this.shadowRoot
    const selected = root?.querySelector<HTMLButtonElement>('button[aria-current="true"]')
    const target = selected ?? root?.querySelector<HTMLButtonElement>('button:not(:disabled)')
    target?.focus(options)
  }

  private _select(item: SegmentedItem) {
    if (this.disabled || item.disabled || item.value === this.value) return
    this.value = item.value
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true,
    }))
  }

  static styles = [focusRing, css`
    :host {
      display: inline-flex;
    }

    .control {
      display: inline-flex;
      align-items: center;
      gap: var(--sc-space-xs);
      padding: var(--sc-space-xs);
      background: var(--sc-color-background-neutral);
      border-radius: var(--sc-border-radius-pill);
      box-sizing: border-box;
    }

    .segment {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: var(--sc-space-xs);
      padding: var(--sc-space-xs) var(--sc-space-m);
      border: none;
      border-radius: var(--sc-border-radius-pill);
      background: transparent;
      color: var(--sc-color-text-secondary);
      cursor: pointer;
      white-space: nowrap;
      ${labelM}
      transition: background 200ms ease, color 200ms ease;
    }

    /* Reset the native outline at zero specificity so the focusRing wins. */
    :where(.segment) { outline: none; }

    .segment svg {
      display: block;
      width: 20px;
      height: 20px;
      color: currentColor;
    }

    /* Hover / pressed feedback only on unselected segments — otherwise these
       (higher-specificity) rules paint over the selected segment's white thumb,
       leaving it looking pressed rather than selected. */
    .segment:not(:disabled):not([aria-current='true']):hover {
      background: var(--sc-color-background-neutral-hover);
      color: var(--sc-color-text-primary);
    }

    .segment:not(:disabled):not([aria-current='true']):active {
      background: var(--sc-color-background-neutral-pressed);
    }

    /* Selected — the white "thumb". aria-current is the source of truth. */
    .segment[aria-current='true'] {
      background: var(--sc-color-background-primary);
      color: var(--sc-color-text-primary);
    }

    .segment:disabled {
      color: var(--sc-color-text-disabled);
      cursor: not-allowed;
    }

    /* Whole-control disabled: every segment reads disabled. */
    :host([disabled]) .segment {
      color: var(--sc-color-text-disabled);
      cursor: not-allowed;
      pointer-events: none;
    }
  `]

  render() {
    return html`
      <div class="control" part="control" role="group" aria-label=${this.label || nothing}>
        ${this.items.map((item) => {
          const selected = item.value === this.value
          const showIcon = !!item.icon
          const showText = !this.iconOnly && !!item.label
          // Icon-only segments take their accessible name from the label.
          const ariaLabel = this.iconOnly && item.label ? item.label : nothing
          return html`
            <button
              class="segment"
              part="segment"
              type="button"
              role="button"
              aria-current=${selected ? 'true' : nothing}
              aria-label=${ariaLabel}
              ?disabled=${this.disabled || !!item.disabled}
              @click=${() => this._select(item)}
            >
              ${showIcon ? featherIcon(item.icon as string, { width: 20, height: 20 }) : nothing}
              ${showText ? html`<span part="label">${item.label}</span>` : nothing}
            </button>
          `
        })}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-segmented-control': ScSegmentedControl
  }
}
