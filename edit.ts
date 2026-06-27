// Scale Edit — in-page annotation + token-aware in-place editing layer.
//
// Dev-only overlay that lets a developer pin comments and make token-valid
// visual tweaks on a running Scale project, then hands those items to a coding
// agent (via the `@scale/design-system/vite` bridge + `.scale/edits.json`).
//
// Usage (normally injected automatically by the Vite plugin in dev):
//   import { enableEdit } from '@scale/design-system/edit'
//   enableEdit()
import './components/sc-edit-layer.js'

export interface EnableEditOptions {
  /** Bridge endpoint the overlay reads/writes. Default `/__scale/edits`. */
  endpoint?: string
}

let layer: HTMLElement | null = null

// Mounts the overlay. This is an explicit, dev-only call — the
// `@scale/design-system/vite` plugin only injects it under `apply: 'serve'`,
// so it never reaches a production bundle. Manual callers should likewise only
// invoke it in development.
export function enableEdit(opts: EnableEditOptions = {}): void {
  if (typeof document === 'undefined') return
  if (layer) return
  layer = document.createElement('sc-edit-layer')
  if (opts.endpoint) layer.setAttribute('endpoint', opts.endpoint)
  const mount = () => document.body.appendChild(layer as HTMLElement)
  if (document.body) mount()
  else document.addEventListener('DOMContentLoaded', mount, { once: true })
}

export function disableEdit(): void {
  layer?.remove()
  layer = null
}
