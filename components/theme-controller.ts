import type { ReactiveController, ReactiveControllerHost } from 'lit'

export type Theme = 'light' | 'dark'

export interface ThemeControllerOptions {
  /** `data-*` attribute name on `<html>` to read/write. Default: `theme` (i.e. `data-theme`). */
  documentAttribute?: string
  /** `localStorage` key for persistence. Pass `null` to disable persistence. Default: `'sc-theme'`. */
  storageKey?: string | null
  /** Custom-event name used for cross-instance notification. Default: `'theme-change'`. */
  eventName?: string
}

const DEFAULTS: Required<Omit<ThemeControllerOptions, 'storageKey'>> & { storageKey: string | null } = {
  documentAttribute: 'theme',
  storageKey: 'sc-theme',
  eventName: 'theme-change',
}

// Shared controller for theme state. Consumers get a reactive `theme` field
// that re-renders the host on change. The publisher calls `set(theme)` to
// update the document attribute, persist to localStorage, and notify everyone.
//
// All defaults match the in-tree convention (data-theme + sc-theme +
// 'theme-change'), so existing components don't pass options. External
// consumers embedding sc-header in a different app can override any of them.
export class ThemeController implements ReactiveController {
  theme: Theme = 'light'

  private readonly documentAttribute: string
  private readonly storageKey: string | null
  private readonly eventName: string

  constructor(private host: ReactiveControllerHost, options: ThemeControllerOptions = {}) {
    this.documentAttribute = options.documentAttribute ?? DEFAULTS.documentAttribute
    this.storageKey = options.storageKey === undefined ? DEFAULTS.storageKey : options.storageKey
    this.eventName = options.eventName ?? DEFAULTS.eventName
    host.addController(this)
  }

  hostConnected() {
    this.theme = this._readInitial()
    window.addEventListener(this.eventName, this._onChange)
  }

  hostDisconnected() {
    window.removeEventListener(this.eventName, this._onChange)
  }

  set(theme: Theme) {
    if (theme === this.theme) return
    this.theme = theme
    document.documentElement.dataset[this.documentAttribute] = theme
    if (this.storageKey) {
      try { localStorage.setItem(this.storageKey, theme) } catch { /* private mode, quota, etc. */ }
    }
    window.dispatchEvent(new CustomEvent(this.eventName, { detail: { theme } }))
    this.host.requestUpdate()
  }

  private _readInitial(): Theme {
    const attr = document.documentElement.dataset[this.documentAttribute] as Theme | undefined
    if (attr === 'light' || attr === 'dark') return attr
    if (this.storageKey) {
      try {
        const stored = localStorage.getItem(this.storageKey) as Theme | null
        if (stored === 'light' || stored === 'dark') return stored
      } catch { /* ignore */ }
    }
    return 'light'
  }

  private _onChange = (e: Event) => {
    const theme = (e as CustomEvent).detail.theme as Theme
    if (theme === this.theme) return
    this.theme = theme
    this.host.requestUpdate()
  }
}
