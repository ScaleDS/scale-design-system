import { html, type TemplateResult, type ReactiveController, type ReactiveControllerHost } from 'lit'
// Importing this module registers the calendar. Because sc-input only reaches
// this file through a dynamic import() (when kind="date" activates), the
// calendar and its button dependencies stay out of the base sc-input bundle.
import '../sc-date-picker'

/** The subset of `sc-input` that the date dropdown controller reads and writes. */
export interface DateKindHost extends ReactiveControllerHost {
  shadowRoot: ShadowRoot | null
  mode: 'single' | 'range'
  value: string
  end: string
  min: string
  max: string
  locale: string
  firstDayOfWeek: 'monday' | 'sunday'
  label: string
  dispatchEvent(event: Event): boolean
}

/**
 * Reactive controller that adds the date-picker dropdown behavior to `sc-input`
 * when `kind="date"`. It owns the open/close state, document click-outside,
 * Escape handling, and the `sc-date-picker` instance — the parts that depend on
 * the (lazily loaded) calendar. The field button and its display text are
 * rendered by `sc-input` itself, so the field paints with no calendar code.
 */
export class DateKind implements ReactiveController {
  open = false

  constructor(private host: DateKindHost) {
    host.addController(this)
  }

  hostDisconnected() {
    document.removeEventListener('pointerdown', this._onDocPointerDown)
  }

  // ---- Open / close ----

  toggle() {
    this.open ? this.close() : this.openDropdown()
  }

  openDropdown() {
    if (this.open) return
    this.open = true
    document.addEventListener('pointerdown', this._onDocPointerDown)
    this.host.requestUpdate()
    this.host.updateComplete.then(() => this._picker?.focus())
  }

  close(refocus = false) {
    if (!this.open) return
    this.open = false
    document.removeEventListener('pointerdown', this._onDocPointerDown)
    this.host.requestUpdate()
    if (refocus) this.host.updateComplete.then(() => this._field?.focus())
  }

  private get _picker(): (HTMLElement & { focus(): void }) | null {
    return this.host.shadowRoot?.querySelector('sc-date-picker') ?? null
  }

  private get _field(): HTMLElement | null {
    return this.host.shadowRoot?.querySelector('.field') ?? null
  }

  private _onDocPointerDown = (e: PointerEvent) => {
    if (!e.composedPath().includes(this.host as unknown as EventTarget)) this.close()
  }

  onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.open) {
      e.stopPropagation()
      this.close(true)
    }
  }

  private _onPickerChange = (e: Event) => {
    const detail = (e as CustomEvent).detail as { value?: string; start?: string; end?: string }
    if (this.host.mode === 'range') {
      this.host.value = detail.start ?? ''
      this.host.end = detail.end ?? ''
    } else {
      this.host.value = detail.value ?? ''
    }
    this.host.dispatchEvent(new CustomEvent('change', { detail, bubbles: true, composed: true }))
    this.close(true)
  }

  // ---- Overlay (the only part that needs sc-date-picker) ----

  renderOverlay(): TemplateResult | null {
    if (!this.open) return null
    return html`
      <div class="popover" role="dialog" aria-label=${this.host.label} @keydown=${this.onKeyDown}>
        <sc-date-picker
          mode=${this.host.mode}
          value=${this.host.value}
          end=${this.host.end}
          min=${this.host.min}
          max=${this.host.max}
          locale=${this.host.locale}
          first-day-of-week=${this.host.firstDayOfWeek}
          @change=${this._onPickerChange}
        ></sc-date-picker>
      </div>
    `
  }
}
