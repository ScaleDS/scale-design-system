import type { ReactiveController, ReactiveControllerHost } from 'lit'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'sc-theme'
const EVENT = 'theme-change'

// Shared controller for theme state. Consumers get a reactive `theme` field
// that re-renders the host on change. The publisher calls `set(theme)` to
// update the document attribute, persist to localStorage, and notify everyone.
export class ThemeController implements ReactiveController {
  theme: Theme = 'light'

  constructor(private host: ReactiveControllerHost) {
    host.addController(this)
  }

  hostConnected() {
    this.theme = (document.documentElement.dataset.theme as Theme) ?? 'light'
    window.addEventListener(EVENT, this._onChange)
  }

  hostDisconnected() {
    window.removeEventListener(EVENT, this._onChange)
  }

  set(theme: Theme) {
    if (theme === this.theme) return
    this.theme = theme
    document.documentElement.dataset.theme = theme
    localStorage.setItem(STORAGE_KEY, theme)
    window.dispatchEvent(new CustomEvent(EVENT, { detail: { theme } }))
    this.host.requestUpdate()
  }

  private _onChange = (e: Event) => {
    const theme = (e as CustomEvent).detail.theme as Theme
    if (theme === this.theme) return
    this.theme = theme
    this.host.requestUpdate()
  }
}
