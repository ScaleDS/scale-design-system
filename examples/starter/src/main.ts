// 1. Design tokens. This SCSS entry defines every --sc-* custom property for
//    both themes; without it the components render unstyled. (Needs `sass`.)
import './styles.scss'

// 2. Register the components you use. Each import is a side effect that defines
//    the custom element — import only what you need so the bundle stays small.
import '@scale-ds/scale-design-system/components/sc-button'
import '@scale-ds/scale-design-system/components/sc-input'
import '@scale-ds/scale-design-system/components/sc-help-text'
import '@scale-ds/scale-design-system/components/sc-card'
import '@scale-ds/scale-design-system/components/sc-badge'
import '@scale-ds/scale-design-system/components/sc-toggle'

// 3. Theme toggle. Scale reads the theme from <html data-theme>. This mirrors
//    what the built-in ThemeController does (attribute + localStorage), but
//    plain DOM keeps the starter framework-free.
const STORAGE_KEY = 'sc-theme'
const root = document.documentElement

const applyTheme = (theme: 'light' | 'dark') => {
  root.dataset.theme = theme
  try {
    localStorage.setItem(STORAGE_KEY, theme)
  } catch {
    /* private mode / quota — ignore */
  }
}

// Restore the saved theme on load.
const saved = (() => {
  try {
    return localStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
})()
if (saved === 'light' || saved === 'dark') applyTheme(saved)

document.getElementById('theme-toggle')?.addEventListener('click', () => {
  applyTheme(root.dataset.theme === 'dark' ? 'light' : 'dark')
})

// 4. A tiny bit of interactivity. sc-input emits a composed `change` event with
//    `detail.value`; sc-button clicks bubble like any button.
const form = document.getElementById('demo-form') as HTMLFormElement | null
const status = document.getElementById('form-status')
form?.addEventListener('submit', (e) => e.preventDefault())
form?.querySelector('sc-button[type="primary"]')?.addEventListener('click', () => {
  status?.removeAttribute('hidden')
})
