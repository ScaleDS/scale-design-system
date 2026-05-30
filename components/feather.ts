import { html, type TemplateResult } from 'lit'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { icons } from 'feather-icons'

// feather-icons' typings don't reliably export FeatherAttributes across versions;
// toSvg accepts an attribute bag, so model the options as a plain string/number map.
export type FeatherOptions = Record<string, string | number>

export function featherIcon(name: string, opts?: FeatherOptions): TemplateResult | null {
  const icon = icons[name as keyof typeof icons]
  if (!icon) return null
  return html`${unsafeHTML(icon.toSvg(opts as Record<string, string | number>))}`
}
