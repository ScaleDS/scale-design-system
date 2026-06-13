import { LitElement, html, css, type PropertyValues } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { labelM, textM } from '@scale/design-system/scss/typography'
import { focusRing } from './sc-focus-ring'
import './sc-button-icon'
import './sc-button'

type FirstDayOfWeek = 'monday' | 'sunday'
type DatePickerMode = 'single' | 'range'

// ---- Date helpers (no external dependency) ----

/** Parse a `YYYY-MM-DD` string into a local-midnight Date, or null if invalid. */
function parseISO(value: string): Date | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim())
  if (!m) return null
  const [, y, mo, d] = m
  const date = new Date(Number(y), Number(mo) - 1, Number(d))
  // Reject overflow like 2024-02-31 → March
  if (date.getFullYear() !== Number(y) || date.getMonth() !== Number(mo) - 1 || date.getDate() !== Number(d)) {
    return null
  }
  return date
}

/** Format a Date as `YYYY-MM-DD`. */
function toISO(date: Date): string {
  const y = String(date.getFullYear()).padStart(4, '0')
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function isSameDay(a: Date | null, b: Date | null): boolean {
  return !!a && !!b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
}

function addDays(date: Date, n: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + n)
}

function addMonths(date: Date, n: number): Date {
  const target = new Date(date.getFullYear(), date.getMonth() + n, 1)
  // Clamp the day to the last day of the target month (e.g. Jan 31 → Feb 28).
  const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0).getDate()
  target.setDate(Math.min(date.getDate(), lastDay))
  return target
}

/**
 * A self-contained, accessible calendar date picker.
 *
 * Follows the WAI-ARIA APG date-picker grid pattern: the calendar is a
 * `role="grid"` of `gridcell` day buttons with roving tabindex, full keyboard
 * navigation, `aria-selected` on the chosen day, and a polite live region that
 * announces month changes.
 *
 * In `range` mode, a start and end date are chosen on successive clicks and the
 * days in between render with the range fill; `value` holds the start and `end`
 * holds the end (both ISO `YYYY-MM-DD`).
 *
 * @fires change - In `single` mode: `detail: { value }`. In `range` mode (once
 *   both ends are set): `detail: { start, end }`. All ISO `YYYY-MM-DD`.
 * @fires cancel - The Cancel action was pressed (only when `show-actions`).
 */
@customElement('sc-date-picker')
export class ScDatePicker extends LitElement {
  static formAssociated = true

  /** Selection mode: a single date, or a start–end range. */
  @property({ reflect: true }) mode: DatePickerMode = 'single'
  /** Selected date (`single` mode) or range start (`range` mode), ISO `YYYY-MM-DD`. */
  @property() value = ''
  /** Range end date (`range` mode only), ISO `YYYY-MM-DD`. */
  @property() end = ''
  /** Earliest selectable date (ISO `YYYY-MM-DD`). Days before it are disabled. */
  @property() min = ''
  /** Latest selectable date (ISO `YYYY-MM-DD`). Days after it are disabled. */
  @property() max = ''
  /** Form-association name. */
  @property() name = ''
  /** BCP-47 locale for month and weekday names. */
  @property() locale = 'en-US'
  /** Which day the week starts on. */
  @property({ attribute: 'first-day-of-week', reflect: true }) firstDayOfWeek: FirstDayOfWeek = 'monday'
  /** Show Cancel / Confirm actions; selection becomes pending until confirmed. */
  @property({ type: Boolean, attribute: 'show-actions', reflect: true }) showActions = false
  /** Disable the entire picker. */
  @property({ type: Boolean, reflect: true }) disabled = false

  // Committed selection.
  @state() private _selected: Date | null = null
  // Pending selection shown while actions are visible (before Confirm).
  @state() private _draft: Date | null = null
  // Range mode endpoints.
  @state() private _rangeStart: Date | null = null
  @state() private _rangeEnd: Date | null = null
  // Hovered day used to preview the in-progress range (range mode).
  @state() private _hoverDate: Date | null = null
  // The displayed month.
  @state() private _viewYear = new Date().getFullYear()
  @state() private _viewMonth = new Date().getMonth()
  // The day that holds tabindex=0 within the grid (roving focus).
  @state() private _focusDate: Date = new Date()

  private _internals = this.attachInternals()
  private _initialized = false
  private _focusPending = false

  get form() { return this._internals.form }

  willUpdate(changed: PropertyValues) {
    if (changed.has('value') || changed.has('end') || changed.has('mode') || !this._initialized) {
      const start = parseISO(this.value)
      if (this.mode === 'range') {
        this._rangeStart = start
        this._rangeEnd = parseISO(this.end)
        this._internals.setFormValue(start && this._rangeEnd ? `${this.value}/${this.end}` : null)
      } else {
        this._selected = start
        this._draft = start
        this._internals.setFormValue(this.value || null)
      }
      const anchor = start ?? this._clamp(new Date())
      this._viewYear = anchor.getFullYear()
      this._viewMonth = anchor.getMonth()
      this._focusDate = anchor
      this._initialized = true
    }
  }

  updated() {
    if (this._focusPending) {
      this._focusPending = false
      const iso = toISO(this._focusDate)
      this.shadowRoot?.querySelector<HTMLButtonElement>(`button[data-iso="${iso}"]`)?.focus()
    }
  }

  /** Move focus to the currently focusable day (the roving-tabindex cell). */
  focus(options?: FocusOptions) {
    this.shadowRoot?.querySelector<HTMLButtonElement>('button.day[tabindex="0"]')?.focus(options)
  }

  static styles = [
    focusRing,
    css`
    :host {
      display: inline-block;
      box-sizing: border-box;
      width: 256px;
      border-radius: var(--sc-border-radius-m);
    }

    :host([disabled]) {
      opacity: 0.6;
      pointer-events: none;
    }

    .calendar {
      display: flex;
      flex-direction: column;
      gap: var(--sc-space-s);
    }

    /* ---- Month navigation header ---- */
    .month {
      display: flex;
      align-items: center;
    }

    .month-label {
      ${labelM}
      flex: 1;
      margin: 0;
      text-align: center;
      color: var(--sc-color-text-secondary);
    }

    /* ---- Grid ---- */
    table {
      width: 100%;
      border-collapse: collapse;
      table-layout: fixed;
    }

    th {
      ${labelM}
      padding: var(--sc-space-xs);
      color: var(--sc-color-text-secondary);
      font-weight: var(--sc-type-weight-semi-bold);
      text-align: center;
    }

    td {
      padding: 0;
      text-align: center;
    }

    .day {
      ${textM}
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      padding: 0;
      margin: 0 auto;
      border: none;
      border-radius: var(--sc-border-radius-l);
      background: transparent;
      color: var(--sc-color-text-secondary);
      cursor: pointer;
      transition: background-color 200ms ease, color 200ms ease;
    }

    /* Days belonging to the previous/next month. */
    .day.outside {
      color: var(--sc-color-text-disabled);
    }

    .day:hover:not(:disabled):not(.selected) {
      background: var(--sc-color-background-hover);
    }

    /* Today indicator (only when not selected or within a range). */
    .day.today:not(.selected):not(.range) {
      box-shadow: inset 0 0 0 var(--sc-border-width-s) var(--sc-color-border-primary);
    }

    /* Days between the range endpoints. */
    .day.range {
      background: var(--sc-color-background-selected);
      color: var(--sc-color-text-secondary);
    }

    /* Selected day, and range start/end caps. */
    .day.selected {
      background: var(--sc-color-background-brand);
      color: var(--sc-color-text-primary-inverse);
    }

    .day:disabled {
      color: var(--sc-color-text-disabled);
      cursor: not-allowed;
    }

    /* ---- Actions ---- */
    .actions {
      display: flex;
      gap: var(--sc-space-s);
      padding-top: var(--sc-space-l);
    }

    .actions sc-button {
      flex: 1;
      --sc-button-width: 100%;
    }
  `]

  // ---- Range / clamp helpers ----

  private get _minDate(): Date | null { return this.min ? parseISO(this.min) : null }
  private get _maxDate(): Date | null { return this.max ? parseISO(this.max) : null }

  private _isDisabledDay(date: Date): boolean {
    const min = this._minDate
    const max = this._maxDate
    if (min && date < min) return true
    if (max && date > max) return true
    return false
  }

  private _clamp(date: Date): Date {
    const min = this._minDate
    const max = this._maxDate
    if (min && date < min) return min
    if (max && date > max) return max
    return date
  }

  private get _weekStart(): number {
    return this.firstDayOfWeek === 'monday' ? 1 : 0
  }

  // ---- Derived calendar data ----

  private _weekdays(): { short: string; long: string }[] {
    const shortFmt = new Intl.DateTimeFormat(this.locale, { weekday: 'short' })
    const longFmt = new Intl.DateTimeFormat(this.locale, { weekday: 'long' })
    // 2021-08-01 is a Sunday — a stable reference for weekday indexing.
    const days: { short: string; long: string }[] = []
    for (let i = 0; i < 7; i++) {
      const ref = new Date(2021, 7, 1 + ((this._weekStart + i) % 7))
      days.push({
        short: shortFmt.format(ref).slice(0, 2),
        long: longFmt.format(ref),
      })
    }
    return days
  }

  private _weeks(): Date[][] {
    const firstOfMonth = new Date(this._viewYear, this._viewMonth, 1)
    const offset = (firstOfMonth.getDay() - this._weekStart + 7) % 7
    const gridStart = addDays(firstOfMonth, -offset)
    const weeks: Date[][] = []
    for (let w = 0; w < 6; w++) {
      const week: Date[] = []
      for (let d = 0; d < 7; d++) week.push(addDays(gridStart, w * 7 + d))
      weeks.push(week)
    }
    return weeks
  }

  // ---- Interaction ----

  private _setFocusDate(date: Date, moveFocus: boolean) {
    const clamped = this._clamp(date)
    this._focusDate = clamped
    this._viewYear = clamped.getFullYear()
    this._viewMonth = clamped.getMonth()
    if (moveFocus) this._focusPending = true
  }

  private _changeMonth(delta: number) {
    this._setFocusDate(addMonths(this._focusDate, delta), false)
  }

  private _onGridKeydown(e: KeyboardEvent) {
    let next: Date | null = null
    switch (e.key) {
      case 'ArrowLeft': next = addDays(this._focusDate, -1); break
      case 'ArrowRight': next = addDays(this._focusDate, 1); break
      case 'ArrowUp': next = addDays(this._focusDate, -7); break
      case 'ArrowDown': next = addDays(this._focusDate, 7); break
      case 'Home': next = addDays(this._focusDate, -((this._focusDate.getDay() - this._weekStart + 7) % 7)); break
      case 'End': next = addDays(this._focusDate, 6 - ((this._focusDate.getDay() - this._weekStart + 7) % 7)); break
      case 'PageUp': next = addMonths(this._focusDate, e.shiftKey ? -12 : -1); break
      case 'PageDown': next = addMonths(this._focusDate, e.shiftKey ? 12 : 1); break
      default: return
    }
    e.preventDefault()
    this._setFocusDate(next, true)
  }

  private _onDayClick(date: Date) {
    if (this._isDisabledDay(date)) return
    this._focusDate = date

    if (this.mode === 'range') {
      if (!this._rangeStart || this._rangeEnd) {
        // Start a fresh range.
        this._rangeStart = date
        this._rangeEnd = null
        this._hoverDate = null
      } else if (date < this._rangeStart) {
        // Clicked before the start — restart from the earlier day.
        this._rangeStart = date
      } else {
        // Complete the range.
        this._rangeEnd = date
        this._hoverDate = null
        this._commitRange()
      }
      return
    }

    if (this.showActions) {
      this._draft = date
    } else {
      this._commit(date)
    }
  }

  // The endpoints to paint, accounting for an in-progress hover preview and
  // for the user picking the end before the start. Returns null when nothing
  // is selected yet.
  private _effectiveRange(): { start: Date; end: Date } | null {
    let start = this._rangeStart
    let end = this._rangeEnd
    if (start && !end && this._hoverDate) end = this._hoverDate
    if (!start || !end) return null
    return end < start ? { start: end, end: start } : { start, end }
  }

  private _commitRange() {
    if (!this._rangeStart || !this._rangeEnd) return
    // Normalize so value/end are always in chronological order.
    let [start, end] = [this._rangeStart, this._rangeEnd]
    if (end < start) [start, end] = [end, start]
    this._rangeStart = start
    this._rangeEnd = end
    this.value = toISO(start)
    this.end = toISO(end)
    this._internals.setFormValue(`${this.value}/${this.end}`)
    this.dispatchEvent(new CustomEvent('change', {
      detail: { start: this.value, end: this.end },
      bubbles: true,
      composed: true,
    }))
  }

  private _onDayHover(date: Date) {
    if (this.mode === 'range' && this._rangeStart && !this._rangeEnd) {
      this._hoverDate = date
    }
  }

  private _onGridLeave() {
    if (this._hoverDate) this._hoverDate = null
  }

  private _commit(date: Date) {
    this._selected = date
    this._draft = date
    this.value = toISO(date)
    this._internals.setFormValue(this.value)
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value: this.value },
      bubbles: true,
      composed: true,
    }))
  }

  private _onConfirm() {
    if (this._draft) this._commit(this._draft)
  }

  private _onCancel() {
    this._draft = this._selected
    this.dispatchEvent(new CustomEvent('cancel', { bubbles: true, composed: true }))
  }

  render() {
    const monthLabel = new Intl.DateTimeFormat(this.locale, { month: 'long', year: 'numeric' })
      .format(new Date(this._viewYear, this._viewMonth, 1))
    const weekdays = this._weekdays()
    const weeks = this._weeks()
    const today = new Date()
    const highlight = this.showActions ? this._draft : this._selected
    const range = this.mode === 'range' ? this._effectiveRange() : null

    return html`
      <div class="calendar">
        <div class="month">
          <sc-button-icon
            size="s"
            type="tertiary-mono"
            icon="chevron-left"
            label="Previous month"
            ?disabled=${this.disabled}
            @click=${() => this._changeMonth(-1)}
          ></sc-button-icon>
          <p class="month-label" id="month-label" aria-live="polite">${monthLabel}</p>
          <sc-button-icon
            size="s"
            type="tertiary-mono"
            icon="chevron-right"
            label="Next month"
            ?disabled=${this.disabled}
            @click=${() => this._changeMonth(1)}
          ></sc-button-icon>
        </div>

        <table role="grid" aria-labelledby="month-label" @keydown=${this._onGridKeydown} @mouseleave=${this._onGridLeave}>
          <thead>
            <tr>
              ${weekdays.map(d => html`<th scope="col" abbr=${d.long}>${d.short}</th>`)}
            </tr>
          </thead>
          <tbody>
            ${weeks.map(week => html`
              <tr>
                ${week.map(day => {
                  const outside = day.getMonth() !== this._viewMonth
                  const isDisabled = this.disabled || this._isDisabledDay(day)
                  const isToday = isSameDay(day, today)

                  // Endpoint = brand cap; between = light range fill.
                  const isCap = range
                    ? (isSameDay(day, range.start) || isSameDay(day, range.end))
                    : isSameDay(day, highlight)
                  const inRange = !!range && day > range.start && day < range.end
                  const isSelected = isCap

                  const classes = [
                    'day',
                    outside ? 'outside' : '',
                    inRange ? 'range' : '',
                    isCap ? 'selected' : '',
                    isToday ? 'today' : '',
                  ].filter(Boolean).join(' ')
                  return html`
                    <td role="gridcell" aria-selected=${isSelected || inRange ? 'true' : 'false'}>
                      <button
                        type="button"
                        class=${classes}
                        data-iso=${toISO(day)}
                        tabindex=${isSameDay(day, this._focusDate) ? '0' : '-1'}
                        ?disabled=${isDisabled}
                        aria-current=${isToday ? 'date' : 'false'}
                        @click=${() => this._onDayClick(day)}
                        @mouseenter=${() => this._onDayHover(day)}
                      >${day.getDate()}</button>
                    </td>
                  `
                })}
              </tr>
            `)}
          </tbody>
        </table>

        ${this.showActions ? html`
          <div class="actions">
            <sc-button size="m" type="secondary" ?disabled=${this.disabled} @click=${this._onCancel}>Cancel</sc-button>
            <sc-button size="m" type="primary" ?disabled=${this.disabled || !this._draft} @click=${this._onConfirm}>Confirm</sc-button>
          </div>
        ` : ''}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-date-picker': ScDatePicker
  }
}
