import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { textL, linkL } from '@scale-ds/scale-design-system/scss/typography'
import '@scale-ds/scale-design-system/components/sc-status-icon'
import { focusRing } from './sc-focus-ring.js'
import { featherIcon } from './feather.js'

type BannerStatus = 'info' | 'warning' | 'negative' | 'positive' | 'mono'

const statusIconMap: Partial<Record<BannerStatus, string>> = {
  info: 'info',
  warning: 'warning',
  negative: 'error',
  positive: 'success',
}

@customElement('sc-banner')
export class ScBanner extends LitElement {
  @property({ reflect: true }) status: BannerStatus = 'info'
  @property({ type: Boolean, attribute: 'hide-close', reflect: true }) hideClose = false
  @property({ type: Boolean, attribute: 'hide-link', reflect: true }) hideLink = false
  @property({ attribute: 'link-href' }) linkHref = ''
  @property() link = ''
  @property() text = ''

  @state() private _exiting = false

  static styles = [
    focusRing,
    css`
    :host {
      display: block;
      width: 100%;
    }

    .banner {
      display: flex;
      width: 100%;
      align-items: center;
      gap: var(--sc-space-s);
      padding: var(--sc-space-m) var(--sc-space-l);
      min-height: 56px;
      box-sizing: border-box;
      /* Enter/exit — the same gesture as sc-toast, which this deliberately
         mirrors: fade plus an 8px nudge from above. Overlay-class surface, so
         the fade is l-sized; the travel is only a nudge, so it takes the
         s-sized slide.

         The enter comes from @starting-style rather than a class flipped on the
         next frame. A rAF can land in the same frame as Lit's first render, so
         the hidden state is never painted and the transition has nothing to run
         from — the element just appears. @starting-style is the platform's
         answer to exactly that, and sc-modal already depends on it.

         Both properties share ONE composite. Fade and nudge are a single
         gesture, and giving them different durations makes the movement stop
         dead while the fade carries on — visibly unfinished. */
      opacity: 1;
      translate: none;
      transition:
        opacity var(--sc-motion-transition-fade-in-l),
        translate var(--sc-motion-transition-fade-in-l);
    }

    @starting-style {
      .banner {
        opacity: 0;
        translate: 0 calc(-1 * var(--sc-motion-distance-nudge));
      }
    }

    .banner.is-exiting {
      opacity: 0;
      translate: 0 calc(-1 * var(--sc-motion-distance-nudge));
      transition:
        opacity var(--sc-motion-transition-fade-out-l),
        translate var(--sc-motion-transition-fade-out-l);
    }

    /* ---- Status backgrounds ---- */
    :host([status='info']) .banner {
      background: var(--sc-color-background-info);
    }
    :host([status='warning']) .banner {
      background: var(--sc-color-background-warning);
    }
    :host([status='negative']) .banner {
      background: var(--sc-color-background-negative);
    }
    :host([status='positive']) .banner {
      background: var(--sc-color-background-positive);
    }
    :host([status='mono']) .banner {
      background: var(--sc-color-background-mono);
    }

    /* ---- Icon ---- */
    .icon {
      flex-shrink: 0;
      display: flex;
      align-items: center;
    }

    /* Warning sits on a light surface, so its icon disc uses the dark static
       colour (like the static text/link/close below) while the "!" glyph keeps
       the warning accent. After sc-status-icon's inverse swap the disc fill
       resolves --sc-color-icon-inverse, so re-point that token for this icon. */
    :host([status='warning']) .icon sc-status-icon {
      --sc-color-icon-inverse: var(--sc-color-icon-primary-static);
    }

    /* ---- Text ---- */
    .text {
      ${textL}
      color: var(--sc-color-text-secondary-inverse);
      margin: 0;
      flex: 1 0 0;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    :host([status='warning']) .text {
      color: var(--sc-color-text-secondary-static);
    }

    /* ---- Trailing ---- */
    .trailing {
      display: flex;
      align-items: center;
      gap: var(--sc-space-s);
      flex-shrink: 0;
    }

    .link {
      ${linkL}
      color: var(--sc-color-text-secondary-inverse);
      text-decoration: none;
      white-space: nowrap;
      cursor: pointer;
    }

    :host([status='warning']) .link {
      color: var(--sc-color-text-secondary-static);
    }

    .link:hover {
      opacity: 0.85;
    }

    .link:focus-visible {
      border-radius: var(--sc-border-radius-xs);
    }

    /* ---- Close button ---- */
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
      color: var(--sc-color-text-secondary-inverse);
      flex-shrink: 0;
    }

    :host([status='warning']) .close {
      color: var(--sc-color-text-secondary-static);
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
  `]

  private _onClose() {
    if (this._exiting) return
    this.dispatchEvent(new CustomEvent('close', {
      bubbles: true,
      composed: true,
    }))
    this._exiting = true
    this._detachAfterExit()
  }

  /**
   * Detach once the exit has actually finished.
   *
   * A setTimeout matched to the token duration looks right and isn't: the timer
   * starts when the class is set, but the transition doesn't begin until the
   * next frame, so the node is pulled out of the DOM while still ~15% visible —
   * a visible flicker. Listening for the real transitionend removes the race and
   * stops the duration being hardcoded in two places.
   */
  private _detachAfterExit() {
    // Reduced motion zeroes the tokens, and a zero-duration transition fires no
    // transitionend at all, so there is nothing to wait for.
    const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      this.remove()
      return
    }

    void this.updateComplete.then(() => {
      const box = this.renderRoot.querySelector('.banner')
      if (!box) {
        this.remove()
        return
      }

      let fallback = 0
      const done = () => {
        clearTimeout(fallback)
        box.removeEventListener('transitionend', onEnd)
        this.remove()
      }
      const onEnd = (e: Event) => {
        if ((e as TransitionEvent).propertyName === 'opacity') done()
      }

      box.addEventListener('transitionend', onEnd)
      // Safety net: an element that never painted (hidden tab, detached tree)
      // never transitions, and must not leak.
      fallback = window.setTimeout(done, 1000)
    })
  }

  private _onKeyDown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      this._onClose()
    }
  }

  render() {
    const iconStatus = statusIconMap[this.status]
    const showLink = !this.hideLink && !!this.link
    const showClose = !this.hideClose
    const hasTrailing = showLink || showClose

    return html`
      <div
        class="banner ${this._exiting ? 'is-exiting' : ''}"
        role="status"
        aria-label="Notification"
        @keydown=${this._onKeyDown}
      >
        ${this.status !== 'mono' && iconStatus ? html`
          <span class="icon">
            <sc-status-icon status=${iconStatus} size="24" inverse></sc-status-icon>
          </span>
        ` : ''}
        <p class="text">${this.text}</p>
        ${hasTrailing ? html`
          <div class="trailing">
            ${showLink ? html`
              ${this.linkHref ? html`
                <a class="link" href=${this.linkHref}>${this.link}</a>
              ` : html`
                <span class="link">${this.link}</span>
              `}
            ` : ''}
            ${showClose ? html`
              <button class="close" type="button" aria-label="Close notification" @click=${this._onClose}>
                ${featherIcon('x')}
              </button>
            ` : ''}
          </div>
        ` : ''}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-banner': ScBanner
  }
}
