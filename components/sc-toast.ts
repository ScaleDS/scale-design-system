import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { textM, linkM } from '@scale-ds/scale-design-system/scss/typography'
import '@scale-ds/scale-design-system/components/sc-status-icon'
import { focusRing } from './sc-focus-ring.js'
import { featherIcon } from './feather.js'

type ToastStatus = 'default' | 'info' | 'negative' | 'positive'
type ToastPlacement =
  | 'top-start' | 'top-center' | 'top-end'
  | 'bottom-start' | 'bottom-center' | 'bottom-end'

interface ToastShowOptions {
  status?: ToastStatus
  text?: string
  link?: string
  linkHref?: string
  hideClose?: boolean
  hideLink?: boolean
  /** Auto-dismiss delay in ms. `0` keeps the toast until dismissed. Default 4000. */
  duration?: number
  placement?: ToastPlacement
}

// Status → sc-status-icon name. `default` (mono/inverse surface) shows no icon.
const statusIconMap: Partial<Record<ToastStatus, string>> = {
  info: 'info',
  negative: 'error',
  positive: 'success',
}

// Fixed-position styles per corner. Bottom rows reverse so the newest toast
// sits nearest the edge and older ones push inward.
const placementStyles: Record<ToastPlacement, string> = {
  'top-start':     'top:0;left:0;align-items:flex-start;',
  'top-center':    'top:0;left:50%;transform:translateX(-50%);align-items:center;',
  'top-end':       'top:0;right:0;align-items:flex-end;',
  'bottom-start':  'bottom:0;left:0;align-items:flex-start;flex-direction:column-reverse;',
  'bottom-center': 'bottom:0;left:50%;transform:translateX(-50%);align-items:center;flex-direction:column-reverse;',
  'bottom-end':    'bottom:0;right:0;align-items:flex-end;flex-direction:column-reverse;',
}

// One fixed stack per placement, created lazily and shared across toasts.
function getStack(placement: ToastPlacement): HTMLElement {
  const id = `sc-toast-stack-${placement}`
  let stack = document.getElementById(id)
  if (!stack) {
    stack = document.createElement('div')
    stack.id = id
    stack.className = 'sc-toast-stack'
    // pointer-events:none lets clicks fall through the gaps; each toast re-enables them.
    stack.style.cssText =
      `position:fixed;z-index:1000;display:flex;flex-direction:column;gap:var(--sc-space-s);` +
      `padding:var(--sc-space-l);pointer-events:none;${placementStyles[placement]}`
    document.body.appendChild(stack)
  }
  return stack
}

@customElement('sc-toast')
export class ScToast extends LitElement {
  @property({ reflect: true }) status: ToastStatus = 'default'
  @property({ reflect: true }) placement: ToastPlacement = 'top-end'
  /** Auto-dismiss delay in ms. `0` keeps the toast until dismissed. */
  @property({ type: Number, reflect: true }) duration = 4000
  @property({ type: Boolean, attribute: 'hide-close', reflect: true }) hideClose = false
  @property({ type: Boolean, attribute: 'hide-link', reflect: true }) hideLink = false
  @property({ attribute: 'link-href' }) linkHref = ''
  @property() link = ''
  @property() text = ''

  @state() private _visible = false
  private _timer?: ReturnType<typeof setTimeout>
  private _closing = false

  /**
   * Imperatively show a toast: appends it to the (lazily-created) corner stack
   * for `placement`, animates it in, and auto-dismisses after `duration` ms
   * (default 4000; pass 0 to keep it until dismissed). Returns the element.
   */
  static show(options: ToastShowOptions = {}): ScToast {
    const placement = options.placement ?? 'top-end'
    const toast = document.createElement('sc-toast') as ScToast
    toast.status = options.status ?? 'default'
    toast.text = options.text ?? ''
    toast.link = options.link ?? ''
    toast.linkHref = options.linkHref ?? ''
    toast.hideLink = options.hideLink ?? !toast.link
    toast.hideClose = options.hideClose ?? false
    toast.duration = options.duration ?? 4000
    toast.placement = placement
    toast.style.pointerEvents = 'auto'
    getStack(placement).appendChild(toast)
    return toast
  }

  static styles = [
    focusRing,
    css`
    :host {
      display: inline-block;
      width: 370px;
      max-width: 100%;
    }

    /* Every toast surface is dark or saturated and carries inverse text/icons,
       so the shared mono focus ring (dark) would be invisible. Flip just the
       ring colour to its inverse — dash/width/offset stay from focusRing. */
    :focus-visible {
      outline-color: var(--sc-color-border-inverse);
    }

    .toast {
      display: flex;
      align-items: flex-start;
      gap: var(--sc-space-s);
      padding: var(--sc-space-m) var(--sc-space-l);
      border-radius: var(--sc-border-radius-s);
      box-shadow: var(--sc-shadow-l3);
      box-sizing: border-box;
      /* Enter/exit animation — hidden by default, .is-visible reveals. */
      opacity: 0;
      transform: translateY(-8px);
      transition: opacity 200ms ease, transform 200ms ease;
    }

    :host([placement^='bottom']) .toast {
      transform: translateY(8px);
    }

    .toast.is-visible {
      opacity: 1;
      transform: none;
    }

    /* ---- Status backgrounds ---- */
    :host([status='default']) .toast {
      background: var(--sc-color-background-inverse);
    }
    :host([status='info']) .toast {
      background: var(--sc-color-background-info);
    }
    :host([status='negative']) .toast {
      background: var(--sc-color-background-negative);
    }
    :host([status='positive']) .toast {
      background: var(--sc-color-background-positive);
    }

    /* ---- Leading icon ---- */
    .icon {
      flex-shrink: 0;
      display: flex;
      align-items: flex-start;
    }

    /* ---- Content (text + inline link) ---- */
    .content {
      display: flex;
      flex: 1 0 0;
      min-width: 0;
      align-items: flex-start;
      gap: var(--sc-space-xs);
      padding-block: var(--sc-space-2xs);
      color: var(--sc-color-text-secondary-inverse);
    }

    .text {
      ${textM}
      margin: 0;
      flex: 1 0 0;
      min-width: 0;
      word-break: break-word;
    }

    .link {
      ${linkM}
      flex-shrink: 0;
      color: inherit;
      text-decoration: none;
      white-space: nowrap;
      cursor: pointer;
    }

    .link:hover {
      opacity: 0.85;
    }

    .link:focus-visible {
      border-radius: var(--sc-border-radius-xs);
    }

    /* ---- Trailing close ---- */
    .close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      padding: 0;
      border: none;
      background: none;
      cursor: pointer;
      color: var(--sc-color-icon-inverse);
      flex-shrink: 0;
    }

    .close:hover {
      opacity: 0.85;
    }

    .close:focus-visible {
      border-radius: var(--sc-border-radius-xs);
    }

    svg {
      display: block;
    }

    @media (prefers-reduced-motion: reduce) {
      .toast,
      .link,
      .close {
        transition: none;
      }
    }
  `]

  firstUpdated() {
    // Trigger the enter transition on the next frame (after the hidden first paint).
    requestAnimationFrame(() => { this._visible = true })
    if (this.duration > 0) {
      this._timer = setTimeout(() => this.dismiss(), this.duration)
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    clearTimeout(this._timer)
  }

  /** Dismiss with the exit animation, emit `close`, then remove from the DOM. */
  dismiss() {
    if (this._closing) return
    this._closing = true
    clearTimeout(this._timer)
    this.dispatchEvent(new CustomEvent('close', { bubbles: true, composed: true }))
    const stack = this.parentElement
    const remove = () => {
      this.remove()
      // Drop the shared stack once its last toast is gone.
      if (stack?.classList.contains('sc-toast-stack') && stack.childElementCount === 0) stack.remove()
    }
    const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
    this._visible = false
    setTimeout(remove, reduce ? 0 : 200)
  }

  private _onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      this.dismiss()
    }
  }

  render() {
    const iconStatus = statusIconMap[this.status]
    const showLink = !this.hideLink && !!this.link
    const showClose = !this.hideClose
    // Errors interrupt assertively; everything else announces politely.
    const role = this.status === 'negative' ? 'alert' : 'status'

    return html`
      <div class="toast ${this._visible ? 'is-visible' : ''}" role=${role} aria-label="Notification" @keydown=${this._onKeyDown}>
        ${iconStatus ? html`
          <span class="icon" part="icon">
            <sc-status-icon status=${iconStatus} size="24" inverse></sc-status-icon>
          </span>
        ` : ''}
        <div class="content">
          <p class="text" part="text">${this.text}</p>
          ${showLink ? html`
            ${this.linkHref ? html`
              <a class="link" part="link" href=${this.linkHref}>${this.link}</a>
            ` : html`
              <span class="link" part="link" role="link" tabindex="0">${this.link}</span>
            `}
          ` : ''}
        </div>
        ${showClose ? html`
          <button class="close" part="close" type="button" aria-label="Close notification" @click=${() => this.dismiss()}>
            ${featherIcon('x')}
          </button>
        ` : ''}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-toast': ScToast
  }
}
