import { LitElement, html, css, isServer } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { textM } from '@scale-ds/scale-design-system/scss/typography'

type TooltipPlacement = 'top' | 'bottom' | 'left' | 'right'

let tooltipId = 0

/**
 * Tooltip — a small dark overlay that briefly describes the element it wraps,
 * shown on hover or keyboard focus (Figma "Tooltip").
 *
 * Wrap the trigger in the default slot; set the tip text via the `content`
 * attribute (or the `content` slot for rich markup). The tip is positioned
 * with `position: fixed` against the trigger's viewport rect, so it escapes
 * `overflow: hidden` ancestors, and flips to the opposite side when there
 * isn't room in the requested `placement`.
 *
 * Accessibility (WAI-ARIA APG tooltip pattern):
 * - the tip carries `role="tooltip"` and a unique id; the first focusable
 *   slotted trigger gets `aria-describedby` pointing at it.
 * - shows on pointer hover AND keyboard focus.
 * - Escape dismisses while open.
 *
 * Keep tooltips text-only — never place interactive content (buttons, links,
 * form fields) inside, since the tip is not part of the focus order.
 */
@customElement('sc-tooltip')
export class ScTooltip extends LitElement {
  /** Tip text. Ignored when content is supplied via the `content` slot. */
  @property() content = ''
  /** Side of the trigger the tip prefers; flips on collision. */
  @property({ reflect: true }) placement: TooltipPlacement = 'top'
  /** Disables the tooltip — it never opens. */
  @property({ type: Boolean, reflect: true }) disabled = false
  /** Open state. Reflected; set directly when `trigger="manual"`. */
  @property({ type: Boolean, reflect: true }) open = false
  /** Hide the little arrow. */
  @property({ type: Boolean, attribute: 'without-arrow', reflect: true }) withoutArrow = false
  /** Gap in px between trigger and tip (arrow sits in this gap). */
  @property({ type: Number }) distance = 8
  /** Show delay in ms (avoids flicker on quick pointer passes). */
  @property({ type: Number, attribute: 'show-delay' }) showDelay = 150
  /** Hide delay in ms. */
  @property({ type: Number, attribute: 'hide-delay' }) hideDelay = 0
  /**
   * Space-separated activation triggers: any of `hover`, `focus`, `click`.
   * Use `manual` to control purely via the `open` property / show()/hide().
   */
  @property() trigger = 'hover focus'

  /** Resolved placement after collision flipping; drives arrow direction. */
  @state() private _placement: TooltipPlacement = 'top'

  private _id = `sc-tooltip-${++tooltipId}`
  private _showTimer?: ReturnType<typeof setTimeout>
  private _hideTimer?: ReturnType<typeof setTimeout>
  private _describedEl: Element | null = null

  static styles = css`
    /* inline-block (not display:contents) so the host has a real box —
       getBoundingClientRect on a display:contents element returns an empty
       rect, which would pin every tip to the viewport's top-left corner. */
    :host {
      display: inline-block;
    }

    .tooltip {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 1100;
      max-width: var(--sc-tooltip-max-width, 240px);
      box-sizing: border-box;
      padding: var(--sc-space-xs) var(--sc-space-s);
      border-radius: var(--sc-border-radius-s);
      background: var(--sc-color-background-inverse);
      color: var(--sc-color-text-secondary-inverse);
      box-shadow: var(--sc-shadow-l3);
      ${textM}
      text-align: center;
      word-break: break-word;
      /* Hidden until opened; pointer-events off so the tip never steals hover. */
      pointer-events: none;
      opacity: 0;
      visibility: hidden;
      transition: opacity 150ms ease;
    }

    .tooltip.is-open {
      opacity: 1;
      visibility: visible;
    }

    .arrow {
      position: absolute;
      width: 0;
      height: 0;
    }

    /* Resolved placement drives which edge the arrow sits on and its
       direction. 8px base (4+4) wide, 4px tall — matches Figma. */
    .tooltip[data-placement='top'] .arrow {
      bottom: -4px;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-top: 4px solid var(--sc-color-background-inverse);
    }
    .tooltip[data-placement='bottom'] .arrow {
      top: -4px;
      border-left: 4px solid transparent;
      border-right: 4px solid transparent;
      border-bottom: 4px solid var(--sc-color-background-inverse);
    }
    .tooltip[data-placement='left'] .arrow {
      right: -4px;
      border-top: 4px solid transparent;
      border-bottom: 4px solid transparent;
      border-left: 4px solid var(--sc-color-background-inverse);
    }
    .tooltip[data-placement='right'] .arrow {
      left: -4px;
      border-top: 4px solid transparent;
      border-bottom: 4px solid transparent;
      border-right: 4px solid var(--sc-color-background-inverse);
    }

    @media (prefers-reduced-motion: reduce) {
      .tooltip {
        transition: none;
      }
    }
  `

  connectedCallback() {
    super.connectedCallback()
    if (isServer) return
    this.addEventListener('mouseenter', this._onPointerEnter)
    this.addEventListener('mouseleave', this._onPointerLeave)
    this.addEventListener('focusin', this._onFocusIn)
    this.addEventListener('focusout', this._onFocusOut)
    this.addEventListener('click', this._onClick)
    this.addEventListener('keydown', this._onKeyDown)
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    clearTimeout(this._showTimer)
    clearTimeout(this._hideTimer)
    this._removeReposition()
    if (isServer) return
    this.removeEventListener('mouseenter', this._onPointerEnter)
    this.removeEventListener('mouseleave', this._onPointerLeave)
    this.removeEventListener('focusin', this._onFocusIn)
    this.removeEventListener('focusout', this._onFocusOut)
    this.removeEventListener('click', this._onClick)
    this.removeEventListener('keydown', this._onKeyDown)
  }

  private _has(trigger: string) {
    return this.trigger.split(/\s+/).includes(trigger)
  }

  private _onPointerEnter = () => { if (this._has('hover')) this._scheduleShow() }
  private _onPointerLeave = () => { if (this._has('hover')) this._scheduleHide() }
  private _onFocusIn = () => { if (this._has('focus')) this.show() }
  private _onFocusOut = () => { if (this._has('focus')) this.hide() }
  private _onClick = () => { if (this._has('click')) (this.open ? this.hide() : this.show()) }

  private _onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.open && this.trigger !== 'manual') {
      e.stopPropagation()
      this.hide()
    }
  }

  private _scheduleShow() {
    clearTimeout(this._hideTimer)
    if (this.showDelay > 0) {
      this._showTimer = setTimeout(() => this.show(), this.showDelay)
    } else {
      this.show()
    }
  }

  private _scheduleHide() {
    clearTimeout(this._showTimer)
    if (this.hideDelay > 0) {
      this._hideTimer = setTimeout(() => this.hide(), this.hideDelay)
    } else {
      this.hide()
    }
  }

  /** Show the tooltip (no-op when disabled or empty). */
  show() {
    clearTimeout(this._showTimer)
    clearTimeout(this._hideTimer)
    if (this.disabled || this.open) return
    this.open = true
    this.dispatchEvent(new CustomEvent('show', { bubbles: true, composed: true }))
  }

  /** Hide the tooltip. */
  hide() {
    clearTimeout(this._showTimer)
    clearTimeout(this._hideTimer)
    if (!this.open) return
    this.open = false
    this.dispatchEvent(new CustomEvent('hide', { bubbles: true, composed: true }))
  }

  updated(changed: Map<string, unknown>) {
    if (changed.has('open')) {
      if (this.open) {
        this._reposition()
        this._addReposition()
      } else {
        this._removeReposition()
      }
    }
    this._syncAria()
  }

  // ---- Positioning ---------------------------------------------------------

  private _addReposition() {
    if (isServer) return
    window.addEventListener('scroll', this._scheduleReposition, true)
    window.addEventListener('resize', this._scheduleReposition)
  }

  private _removeReposition() {
    if (isServer) return
    window.removeEventListener('scroll', this._scheduleReposition, true)
    window.removeEventListener('resize', this._scheduleReposition)
  }

  // Coalesce scroll/resize bursts into one reposition on the next animation
  // frame. Repositioning synchronously on the resize tick can read mid-reflow
  // layout (stale rect/width) and miss the collision flip — rAF guarantees the
  // measurements are settled, and debounces rapid scroll for free.
  private _rafPending = false
  private _scheduleReposition = () => {
    if (this._rafPending || isServer) return
    this._rafPending = true
    requestAnimationFrame(() => {
      this._rafPending = false
      this._reposition()
    })
  }

  private _reposition = () => {
    const tip = this.shadowRoot?.querySelector('.tooltip') as HTMLElement | null
    if (!tip || !this.open) return

    const t = this.getBoundingClientRect()
    // Park the tip at the origin first so it takes its NATURAL width (bounded
    // only by max-width) before we measure. Measuring it while clamped against
    // a viewport edge would report the wrapped/narrowed width, which can make
    // the collision check think it fits and skip the flip. All in one JS task,
    // so the browser only paints the final position — no flash.
    tip.style.left = '0px'
    tip.style.top = '0px'
    const tw = tip.offsetWidth
    const th = tip.offsetHeight
    const vw = window.innerWidth
    const vh = window.innerHeight
    const d = this.distance
    const margin = 4

    // Flip to the opposite side when the requested placement overflows.
    let placement = this.placement
    const fits = {
      top: t.top - th - d >= 0,
      bottom: t.bottom + th + d <= vh,
      left: t.left - tw - d >= 0,
      right: t.right + tw + d <= vw,
    }
    const opposite: Record<TooltipPlacement, TooltipPlacement> =
      { top: 'bottom', bottom: 'top', left: 'right', right: 'left' }
    if (!fits[placement] && fits[opposite[placement]]) placement = opposite[placement]
    this._placement = placement

    let left: number
    let top: number
    if (placement === 'top' || placement === 'bottom') {
      left = t.left + t.width / 2 - tw / 2
      top = placement === 'top' ? t.top - th - d : t.bottom + d
    } else {
      top = t.top + t.height / 2 - th / 2
      left = placement === 'left' ? t.left - tw - d : t.right + d
    }

    // Clamp to the viewport so the tip never bleeds off-screen.
    left = Math.max(margin, Math.min(left, vw - tw - margin))
    top = Math.max(margin, Math.min(top, vh - th - margin))

    tip.style.left = `${Math.round(left)}px`
    tip.style.top = `${Math.round(top)}px`

    // Re-centre the arrow on the trigger after clamping.
    const arrow = tip.querySelector('.arrow') as HTMLElement | null
    if (arrow && !this.withoutArrow) {
      if (placement === 'top' || placement === 'bottom') {
        const center = t.left + t.width / 2 - left
        arrow.style.left = `${Math.max(8, Math.min(center, tw - 8)) - 4}px`
        arrow.style.top = ''
      } else {
        const center = t.top + t.height / 2 - top
        arrow.style.top = `${Math.max(8, Math.min(center, th - 8)) - 4}px`
        arrow.style.left = ''
      }
    }
  }

  // ---- ARIA ----------------------------------------------------------------

  private _syncAria() {
    // Describe the first focusable slotted element so SR users hear the tip.
    const slot = this.shadowRoot?.querySelector('slot:not([name])') as HTMLSlotElement | null
    const assigned = slot?.assignedElements({ flatten: true }) ?? []
    const el = assigned.find(n => n.matches('a,button,input,select,textarea,[tabindex]')) ?? assigned[0] ?? null
    if (el !== this._describedEl) {
      if (this._describedEl?.getAttribute('aria-describedby') === this._id) {
        this._describedEl.removeAttribute('aria-describedby')
      }
      this._describedEl = el
    }
    if (el && !this.disabled) el.setAttribute('aria-describedby', this._id)
    else if (el && el.getAttribute('aria-describedby') === this._id) el.removeAttribute('aria-describedby')
  }

  render() {
    return html`
      <slot></slot>
      <div
        class="tooltip ${this.open ? 'is-open' : ''}"
        part="popup"
        role="tooltip"
        id=${this._id}
        data-placement=${this._placement}
        aria-hidden=${this.open ? 'false' : 'true'}
      >
        <span part="body"><slot name="content">${this.content}</slot></span>
        ${this.withoutArrow ? '' : html`<span class="arrow" part="arrow"></span>`}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-tooltip': ScTooltip
  }
}
