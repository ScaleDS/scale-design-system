// 1. Design tokens + bundled Inter typeface (needs `sass`).
import './styles.scss'

// 2. Register the components this page uses. Each import is a side effect that
//    defines the custom element — import only what you need.
import '@scale-ds/scale-design-system/components/sc-logo'
import '@scale-ds/scale-design-system/components/sc-button'

// 3. Theme: Scale reads it from <html data-theme>. Restore any saved choice.
const STORAGE_KEY = 'sc-theme'
try {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'light' || saved === 'dark') document.documentElement.dataset.theme = saved
} catch {
  /* private mode — ignore */
}

// 4. Copy the command snippet to the clipboard.
const cmd = document.getElementById('cmd')
const copy = document.getElementById('copy')
copy?.addEventListener('click', async () => {
  if (!cmd?.textContent) return
  try {
    await navigator.clipboard.writeText(cmd.textContent.trim())
    copy.textContent = 'Copied'
    setTimeout(() => (copy.textContent = 'Copy'), 1500)
  } catch {
    /* clipboard blocked — no-op */
  }
})
