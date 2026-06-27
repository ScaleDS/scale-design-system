import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { type ScTab } from '@scale-ds/scale-design-system/components/sc-tab'
import { type ScTabPanel } from '@scale-ds/scale-design-system/components/sc-tab-panel'
import '@scale-ds/scale-design-system/components/sc-tab'
import '@scale-ds/scale-design-system/components/sc-tab-panel'

type TabActivation = 'auto' | 'manual'
type TabPlacement = 'top' | 'bottom'

let tabsUid = 0

/**
 * Tabbed interface (WAI-ARIA APG Tabs pattern). Composes `sc-tab` items (in the
 * `nav` slot) with `sc-tab-panel` panels (default slot); a tab's `panel` links
 * to a panel's `name`. The group owns selection, roving focus, ARIA wiring and
 * keyboard interaction.
 *
 * - `active` — name of the shown panel (controlled or initial).
 * - `activation` — `auto` (default; arrow keys select on focus) or `manual`
 *   (arrow keys move focus only, Enter/Space selects).
 * - `placement` — `top` (default) or `bottom` (nav below the panels).
 *
 * Emits `sc-tab-show` / `sc-tab-hide` (`detail.name`) and a convenience
 * `change` event when the active tab changes via user interaction.
 */
@customElement('sc-tabs')
export class ScTabs extends LitElement {
  /** Name of the active panel. Reflects the current selection. */
  @property({ reflect: true }) active = ''
  /** When tabs activate during keyboard navigation. */
  @property({ reflect: true }) activation: TabActivation = 'auto'
  /** Where the tab nav sits relative to the panels. */
  @property({ reflect: true }) placement: TabPlacement = 'top'

  private _uid = ++tabsUid

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    :host([placement='bottom']) {
      flex-direction: column-reverse;
    }

    .nav {
      display: flex;
      align-items: flex-end;
      gap: var(--sc-space-s);
      border-bottom: var(--sc-border-width-s) solid var(--sc-color-border-subtle);
    }

    :host([placement='bottom']) .nav {
      border-bottom: none;
      border-top: var(--sc-border-width-s) solid var(--sc-color-border-subtle);
    }

    .body {
      padding-block: var(--sc-space-l);
    }
  `

  private _tabs(): ScTab[] {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>('slot[name="nav"]')
    return (slot?.assignedElements() ?? []).filter(
      (el): el is ScTab => el.tagName.toLowerCase() === 'sc-tab',
    )
  }

  private _panels(): ScTabPanel[] {
    const slot = this.shadowRoot?.querySelector<HTMLSlotElement>('slot:not([name])')
    return (slot?.assignedElements() ?? []).filter(
      (el): el is ScTabPanel => el.tagName.toLowerCase() === 'sc-tab-panel',
    )
  }

  private _enabledTabs(): ScTab[] {
    return this._tabs().filter(t => !t.disabled)
  }

  private _panelFor(name: string): ScTabPanel | undefined {
    return this._panels().find(p => p.name === name)
  }

  // Assign stable ids + ARIA cross-links, then apply the active selection.
  private _sync() {
    const tabs = this._tabs()
    tabs.forEach((tab, i) => {
      if (!tab.id) tab.id = `sc-tab-${this._uid}-${i}`
      const panel = this._panelFor(tab.panel)
      if (panel) {
        if (!panel.id) panel.id = `sc-tab-panel-${this._uid}-${i}`
        tab.controls = panel.id
        panel.setAttribute('aria-labelledby', tab.id)
      }
    })

    // Resolve the active name: keep it if still valid, else first enabled tab.
    const enabled = this._enabledTabs()
    const validActive = tabs.some(t => t.panel === this.active && !t.disabled)
    const name = validActive ? this.active : enabled[0]?.panel ?? ''
    this._applyActive(name)
  }

  private _applyActive(name: string) {
    this.active = name
    for (const tab of this._tabs()) tab.active = tab.panel === name
    for (const panel of this._panels()) panel.active = panel.name === name
  }

  private _select(name: string, { focus = false } = {}) {
    if (!name || name === this.active) {
      if (focus) this._tabFor(name)?.focus()
      return
    }
    const prev = this.active
    this._applyActive(name)

    if (focus) this._tabFor(name)?.focus()

    if (prev) {
      this.dispatchEvent(new CustomEvent('sc-tab-hide', {
        detail: { name: prev }, bubbles: true, composed: true,
      }))
    }
    this.dispatchEvent(new CustomEvent('sc-tab-show', {
      detail: { name }, bubbles: true, composed: true,
    }))
    this.dispatchEvent(new CustomEvent('change', {
      detail: { name }, bubbles: true, composed: true,
    }))
  }

  private _tabFor(name: string): ScTab | undefined {
    return this._tabs().find(t => t.panel === name)
  }

  private _onClick(e: Event) {
    const tab = (e.target as HTMLElement).closest('sc-tab') as ScTab | null
    if (!tab || tab.disabled || !this._tabs().includes(tab)) return
    this._select(tab.panel, { focus: true })
  }

  private _onKeyDown(e: KeyboardEvent) {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End', 'Enter', ' ']
    if (!keys.includes(e.key)) return

    const enabled = this._enabledTabs()
    if (!enabled.length) return

    const current = (e.target as HTMLElement).closest('sc-tab') as ScTab | null
    const currentIndex = current ? enabled.indexOf(current) : -1

    if (e.key === 'Enter' || e.key === ' ') {
      if (current && !current.disabled) {
        e.preventDefault()
        this._select(current.panel, { focus: true })
      }
      return
    }

    e.preventDefault()
    let next = currentIndex
    if (e.key === 'ArrowRight') next = (currentIndex + 1) % enabled.length
    else if (e.key === 'ArrowLeft') next = (currentIndex - 1 + enabled.length) % enabled.length
    else if (e.key === 'Home') next = 0
    else if (e.key === 'End') next = enabled.length - 1

    const target = enabled[next]
    if (!target) return
    if (this.activation === 'auto') {
      this._select(target.panel, { focus: true })
    } else {
      target.focus()
    }
  }

  render() {
    return html`
      <div
        class="nav"
        role="tablist"
        aria-orientation="horizontal"
        @click=${this._onClick}
        @keydown=${this._onKeyDown}
      >
        <slot name="nav" @slotchange=${this._sync}></slot>
      </div>
      <div class="body">
        <slot @slotchange=${this._sync}></slot>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-tabs': ScTabs
  }
}
