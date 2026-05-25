import { html, type TemplateResult } from 'lit'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'
import { icons, type FeatherAttributes } from 'feather-icons'

export type FeatherOptions = Partial<FeatherAttributes>

export function featherIcon(name: string, opts?: FeatherOptions): TemplateResult | null {
  const icon = icons[name as keyof typeof icons]
  if (!icon) return null
  return html`${unsafeHTML(icon.toSvg(opts))}`
}
