import { LitElement, html, css, nothing, type TemplateResult } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { ThemeController } from './theme-controller'
// Scale Edit's own chrome is built from real design-system components.
import './sc-button'
import './sc-button-icon'
import './sc-badge'

/** One captured annotation or edit, mirrored to `.scale/edits.json` by the bridge. */
export interface EditItem {
  id: string
  kind: 'comment' | 'edit'
  /** Free-text note (comment kind) */
  comment?: string
  /** Structured visual change (edit kind) */
  edit?: EditIntent
  anchor: EditAnchor
  status: 'pending' | 'resolved'
  createdAt: string
  pageUrl: string
}

/** Everything an agent needs to find the source behind a clicked element. */
export interface EditAnchor {
  tagName: string
  isScComponent: boolean
  /** `data-sc-loc="file:line:col"` stamped by the Vite plugin, if present. */
  sourceLoc?: string
  cssSelector: string
  domPath: string
  id?: string
  className?: string
  attributes: Record<string, string>
  text?: string
  rect: { x: number; y: number; width: number; height: number }
  viewport: { width: number; height: number }
}

/** A single structured change the agent will apply to source. */
export interface EditIntent {
  /** What kind of thing changed. `textStyle` = a `sc-typography-*` mixin / typed export. */
  target: 'attribute' | 'property' | 'style' | 'text' | 'textStyle'
  /** Attribute name / prop name / CSS property / text-style name (omitted for plain text). */
  name?: string
  from?: string
  to?: string
  /** `to` is a `--sc-*` design token (so the agent writes the token, not a raw value). */
  isToken?: boolean
}

interface Token {
  name: string
  value: string
  /** Browser-computed value (rgb / px) used to reverse-match an element's current style. */
  canonical?: string
}

/** Token buckets the style controls offer — each control is constrained to one family. */
interface TokenSets {
  /** Semantic colour roles only (text/background/border/icon/surface/overlay) — never primitive ramps. */
  color: Token[]
  space: Token[]
  radius: Token[]
}

/** Documented prop from components.json. */
interface PropDef {
  type: string
  default?: unknown
  attribute: string
  reflect?: boolean
}
interface ComponentDef {
  tag: string
  props?: Record<string, PropDef>
}

/** A named type style's token references (from `scss/typography.ts`). */
interface TextStyleDef {
  fontFamily?: string
  fontSize?: string
  lineHeight?: string
  fontWeight?: string
  letterSpacing?: string
}

const IGNORE_TAG = 'sc-edit-layer'

/** Which token bucket + CSS property each style control edits (text style is handled separately).
 *  `role` narrows a colour bucket to the semantic family that fits the property. */
const STYLE_CONTROLS: { label: string; css: string; bucket: keyof TokenSets; role?: RegExp }[] = [
  { label: 'Text colour', css: 'color', bucket: 'color', role: /^--sc-color-text/ },
  { label: 'Background', css: 'background-color', bucket: 'color', role: /^--sc-color-(background|surface|overlay)/ },
  { label: 'Padding', css: 'padding', bucket: 'space' },
  { label: 'Border radius', css: 'border-radius', bucket: 'radius' },
]

// Named typography styles == the `sc-typography-*` SCSS mixins / typed `css` exports.
// Mirrors the DS naming (heading: 3 weights, text: 2 weights); the agent applies the real mixin.
const HEADING_SIZES = ['5xl', '4xl', '3xl', '2xl', 'xl', 'l', 'm', 's', 'xs', '2xs']
const TEXT_SIZES = ['2xl', 'xl', 'l', 'm', 's', 'xs']
const TEXT_STYLES: string[] = [
  ...HEADING_SIZES.flatMap((s) => ['light', 'regular', 'semi-bold'].map((w) => `heading-${s}-${w}`)),
  ...TEXT_SIZES.flatMap((s) => ['regular', 'semi-bold'].map((w) => `text-${s}-${w}`)),
]

@customElement('sc-edit-layer')
export class ScEditLayer extends LitElement {
  /** Bridge endpoint to read/write items. */
  @property() endpoint = '/__scale/edits'

  private theme = new ThemeController(this)

  @state() private active = false
  @state() private mode: 'annotate' | 'edit' = 'annotate'
  @state() private hoverRect: DOMRect | null = null
  @state() private selectedRect: DOMRect | null = null
  @state() private items: EditItem[] = []
  @state() private draft = ''
  @state() private showInbox = false
  @state() private openPin: string | null = null
  /** Re-render tick when the selected element's live attributes change. */
  @state() private inspectVersion = 0
  /** Adding a new attribute via the panel. */

  private tokens: TokenSets = { color: [], space: [], radius: [] }
  private schema = new Map<string, ComponentDef>()
  /** Text style applied to an element this session, for exact preselect. */
  private appliedTextStyle = new WeakMap<Element, string>()
  /** Real named type styles (kebab name → token refs), from the typography bridge endpoint. */
  private typography: Record<string, TextStyleDef> = {}
  /** Each style resolved to computed px + weight, for matching an element's current font. */
  private typeStyleResolved: { name: string; px: string; weight: string }[] = []
  /** Computed px → size suffix (full scale) for labelling out-of-scale sizes. */
  private typeScale: { sizes: Map<string, string>; weights: Map<string, string> } | null = null
  private selectedEl: Element | null = null
  private rafId = 0

  connectedCallback() {
    super.connectedCallback()
    window.addEventListener('keydown', this.onKeydown, true)
    // Keep pins glued to their elements as the page scrolls/resizes.
    window.addEventListener('scroll', this.onReposition, true)
    window.addEventListener('resize', this.onReposition, true)
    void this.loadItems()
  }

  disconnectedCallback() {
    super.disconnectedCallback()
    window.removeEventListener('keydown', this.onKeydown, true)
    window.removeEventListener('scroll', this.onReposition, true)
    window.removeEventListener('resize', this.onReposition, true)
    this.teardownPicking()
  }

  // ---- activation ---------------------------------------------------------

  private onKeydown = (e: KeyboardEvent) => {
    if (e.metaKey && e.shiftKey && e.code === 'KeyE') {
      e.preventDefault()
      this.toggle()
    } else if (e.key === 'Escape' && this.active) {
      if (this.selectedEl) this.clearSelection()
      else this.toggle()
    }
  }

  private toggle() {
    this.active = !this.active
    if (this.active) this.setupPicking()
    else this.teardownPicking()
  }

  private setupPicking() {
    window.addEventListener('mousemove', this.onMouseMove, true)
    window.addEventListener('click', this.onClick, true)
    if (this.tokens.color.length === 0) this.tokens = scanTokens()
    if (!this.typeScale) this.typeScale = scanTypeScale()
    if (this.schema.size === 0) void this.loadSchema()
    if (Object.keys(this.typography).length === 0) void this.loadTypography()
  }

  private async loadTypography() {
    try {
      const res = await fetch('/__scale/typography')
      if (!res.ok) return
      const data = await res.json()
      this.typography = data.styles ?? {}
      // Resolve each style's font-size token → px and weight token → value, for matching.
      const probe = document.createElement('span')
      probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none'
      document.body.appendChild(probe)
      this.typeStyleResolved = Object.entries(this.typography)
        .filter(([n]) => /^(heading|text)-/.test(n))
        .map(([name, def]) => {
          probe.style.fontSize = def.fontSize ? `var(${def.fontSize})` : ''
          probe.style.fontWeight = def.fontWeight ? `var(${def.fontWeight})` : ''
          const cs = getComputedStyle(probe)
          return { name, px: cs.fontSize, weight: cs.fontWeight }
        })
      probe.remove()
      this.requestUpdate()
    } catch {
      /* typography optional — Text style control falls back to the static list */
    }
  }

  private async loadSchema() {
    try {
      const res = await fetch('/__scale/components')
      if (!res.ok) return
      const data = await res.json()
      for (const c of data.components ?? []) this.schema.set(c.tag, c)
      this.requestUpdate()
    } catch {
      /* schema optional — panel still shows live attributes + style controls */
    }
  }

  private teardownPicking() {
    window.removeEventListener('mousemove', this.onMouseMove, true)
    window.removeEventListener('click', this.onClick, true)
    this.hoverRect = null
    this.clearSelection()
  }

  private onReposition = () => {
    if (this.items.length) this.requestUpdate()
  }

  // ---- element picking ----------------------------------------------------

  private onMouseMove = (e: MouseEvent) => {
    if (this.rafId) return
    this.rafId = requestAnimationFrame(() => {
      this.rafId = 0
      const el = this.topElementAt(e.clientX, e.clientY)
      this.hoverRect = el ? el.getBoundingClientRect() : null
    })
  }

  private onClick = (e: MouseEvent) => {
    const el = this.topElementAt(e.clientX, e.clientY)
    if (!el) return
    // Selecting a page element: swallow the click so links/buttons don't fire.
    e.preventDefault()
    e.stopPropagation()
    this.selectedEl = el
    this.selectedRect = el.getBoundingClientRect()
    this.draft = ''
  }

  /** elementFromPoint, ignoring our own overlay UI. */
  private topElementAt(x: number, y: number): Element | null {
    const el = document.elementFromPoint(x, y)
    if (!el) return null
    if (el.tagName.toLowerCase() === IGNORE_TAG) return null
    return el
  }

  private clearSelection() {
    this.selectedEl = null
    this.selectedRect = null
    this.draft = ''
  }

  // ---- persistence --------------------------------------------------------

  private async loadItems() {
    try {
      const res = await fetch(this.endpoint)
      if (!res.ok) return
      const data = await res.json()
      this.items = Array.isArray(data?.items) ? data.items : []
    } catch {
      /* bridge not running (e.g. production preview) — overlay still works in-memory */
    }
  }

  private async persist(item: EditItem) {
    this.items = [...this.items, item]
    try {
      await fetch(this.endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(item),
      })
    } catch {
      /* offline / no bridge — kept in memory and localStorage only */
    }
  }

  private async resolve(id: string) {
    const item = this.items.find((i) => i.id === id)
    if (item) this.revertEdit(item) // deleting an edit undoes its live preview
    this.items = this.items.filter((i) => i.id !== id)
    try {
      await fetch(`${this.endpoint}/${id}`, { method: 'DELETE' })
    } catch {
      /* no bridge */
    }
  }

  /** Restore the element to its pre-edit state using the intent's captured `from`. */
  private revertEdit(it: EditItem) {
    const e = it.edit
    if (it.kind !== 'edit' || !e) return // comments made no DOM change
    let el: HTMLElement | null = null
    try {
      el = document.querySelector(it.anchor.cssSelector) as HTMLElement | null
    } catch {
      /* invalid selector */
    }
    if (!el) return
    switch (e.target) {
      case 'attribute':
        if (e.from == null) el.removeAttribute(e.name as string)
        else el.setAttribute(e.name as string, e.from)
        break
      case 'style':
        if (!e.from) el.style.removeProperty(e.name as string)
        else el.style.setProperty(e.name as string, e.from)
        break
      case 'text':
        el.textContent = e.from ?? ''
        break
      case 'textStyle': {
        const [ff, fs, lh, fw, ls] = (e.from ?? '||||').split('|')
        const set = (p: string, v: string) => (v ? el!.style.setProperty(p, v) : el!.style.removeProperty(p))
        set('font-family', ff)
        set('font-size', fs)
        set('line-height', lh)
        set('font-weight', fw)
        set('letter-spacing', ls)
        break
      }
    }
    if (this.selectedEl === el) this.selectedRect = el.getBoundingClientRect()
    this.inspectVersion++
  }

  // ---- actions ------------------------------------------------------------

  private saveComment() {
    if (!this.selectedEl || !this.draft.trim()) return
    void this.persist({
      id: uid(),
      kind: 'comment',
      comment: this.draft.trim(),
      anchor: buildAnchor(this.selectedEl),
      status: 'pending',
      createdAt: new Date().toISOString(),
      pageUrl: location.pathname + location.search,
    })
    this.clearSelection()
  }

  /** Record an edit intent (applied live to the DOM by the caller) to the queue. */
  private recordEdit(edit: EditIntent) {
    const el = this.selectedEl
    if (!el) return
    this.selectedRect = el.getBoundingClientRect()
    this.inspectVersion++
    void this.persist({
      id: uid(),
      kind: 'edit',
      edit,
      anchor: buildAnchor(el),
      status: 'pending',
      createdAt: new Date().toISOString(),
      pageUrl: location.pathname + location.search,
    })
  }

  private applyStyle(css: string, token: Token) {
    const el = this.selectedEl as HTMLElement | null
    if (!el) return
    const from = el.style.getPropertyValue(css) || undefined
    el.style.setProperty(css, `var(${token.name})`)
    this.recordEdit({ target: 'style', name: css, from, to: token.name, isToken: true })
  }

  /** Apply a named text style using the design system's *real* token mapping (from the typography endpoint). */
  private applyTextStyle(name: string) {
    const el = this.selectedEl as HTMLElement | null
    if (!el || !name) return
    // Snapshot the inline font props we touch, so the edit can be reverted (family|size|line-height|weight|spacing).
    const s = el.style
    const from = [s.fontFamily, s.fontSize, s.lineHeight, s.fontWeight, s.letterSpacing].join('|')
    const def = this.typography[name]
    if (def) {
      const setVar = (prop: string, tok?: string) => tok && s.setProperty(prop, `var(${tok})`)
      setVar('font-family', def.fontFamily)
      setVar('font-size', def.fontSize)
      setVar('line-height', def.lineHeight)
      setVar('font-weight', def.fontWeight)
      setVar('letter-spacing', def.letterSpacing)
    }
    this.appliedTextStyle.set(el, name)
    this.recordEdit({ target: 'textStyle', name: `sc-typography-${name}`, from })
  }

  /** The element's current named text style — exact if applied this session, else matched from its computed font. */
  private currentTextStyle(el: HTMLElement): string {
    const exact = this.appliedTextStyle.get(el)
    if (exact) return exact
    const cs = getComputedStyle(el)
    const matches = this.typeStyleResolved.filter((r) => r.px === cs.fontSize && r.weight === cs.fontWeight)
    if (matches.length === 0) return ''
    // A size+weight can belong to both a heading and a text style; prefer the one that fits the tag.
    const heading = /^h[1-6]$/.test(el.tagName.toLowerCase())
    return (matches.find((m) => m.name.startsWith(heading ? 'heading' : 'text')) ?? matches[0]).name
  }

  private applyAttribute(name: string, value: string) {
    const el = this.selectedEl as HTMLElement | null
    if (!el) return
    const from = el.getAttribute(name) ?? undefined
    if (value === '') el.removeAttribute(name)
    else el.setAttribute(name, value)
    this.recordEdit({ target: 'attribute', name, from, to: value })
  }

  private applyBoolean(attr: string, present: boolean) {
    const el = this.selectedEl as HTMLElement | null
    if (!el) return
    // `from` follows the attribute convention (undefined = was absent) so revert works;
    // `to` stays human-readable for the inbox/skill.
    const from = el.hasAttribute(attr) ? (el.getAttribute(attr) ?? '') : undefined
    if (present) el.setAttribute(attr, '')
    else el.removeAttribute(attr)
    this.recordEdit({ target: 'attribute', name: attr, from, to: present ? 'true' : 'false' })
  }

  private applyText(value: string) {
    const el = this.selectedEl as HTMLElement | null
    if (!el) return
    const from = el.textContent ?? undefined
    el.textContent = value
    this.recordEdit({ target: 'text', from, to: value })
  }


  // ---- render -------------------------------------------------------------

  render() {
    return html`
      ${this.active ? this.renderOverlays() : nothing}
      ${this.renderPins()}
      ${this.renderLauncher()}
      ${this.active ? this.renderToolbar() : nothing}
      ${this.active && this.mode === 'annotate' && this.selectedRect ? this.renderPopover() : nothing}
      ${this.active && this.mode === 'edit' ? this.renderPanel() : nothing}
      ${this.active && this.showInbox ? this.renderInbox() : nothing}
    `
  }

  /** Numbered pins anchored to each item's element — visible whenever there are items. */
  private renderPins() {
    const here = location.pathname + location.search
    const onPage = this.items.filter((it) => it.pageUrl === here) // pin only on the page it was made
    return onPage.map((it, i) => {
      const r = this.rectForItem(it)
      if (!r) return nothing
      const open = this.openPin === it.id
      const desc = describeItem(it)
      return html`
        <div class="pin" style="top:${r.top}px;left:${r.left}px">
          <button
            class="pin-dot ${it.kind}"
            title=${desc ?? ''}
            @click=${() => (this.openPin = open ? null : it.id)}
          >
            ${i + 1}
          </button>
          ${open
            ? html`
                <div class="pin-bubble">
                  <code>${it.anchor.tagName}</code>
                  <div class="pin-desc">${desc}</div>
                  <sc-button-icon
                    class="del"
                    size="s"
                    type="tertiary"
                    icon="trash-2"
                    label="Delete annotation"
                    @click=${() => this.resolvePin(it.id)}
                  ></sc-button-icon>
                </div>
              `
            : nothing}
        </div>
      `
    })
  }

  private resolvePin(id: string) {
    this.openPin = null
    void this.resolve(id)
  }

  /** Live element rect (re-resolved by selector) so pins track the element; falls back to the captured rect. */
  private rectForItem(it: EditItem): { top: number; left: number } | null {
    try {
      const el = document.querySelector(it.anchor.cssSelector)
      if (el) {
        const r = el.getBoundingClientRect()
        return { top: r.top, left: r.left }
      }
    } catch {
      /* invalid selector — fall through */
    }
    const r = it.anchor.rect
    return r ? { top: r.y, left: r.x } : null
  }

  private renderLauncher() {
    const count = this.items.length
    return html`
      <div class="launcher-wrap">
        <sc-button-icon
          icon=${this.active ? 'x' : 'edit-2'}
          label="Scale Edit (⌘⇧E)"
          type="mono"
          @click=${() => this.toggle()}
        ></sc-button-icon>
        ${count ? html`<sc-badge class="count" status="negative">${count}</sc-badge>` : nothing}
      </div>
    `
  }

  private renderToolbar() {
    return html`
      <div class="toolbar">
        <span class="brand">Scale Edit</span>
        <sc-button size="s" type=${this.mode === 'annotate' ? 'primary' : 'tertiary'} @click=${() => (this.mode = 'annotate')}>
          Comment
        </sc-button>
        <sc-button size="s" type=${this.mode === 'edit' ? 'primary' : 'tertiary'} @click=${() => (this.mode = 'edit')}>
          Edit
        </sc-button>
        <sc-button size="s" type="tertiary" @click=${() => (this.showInbox = !this.showInbox)}>
          Inbox (${this.items.length})
        </sc-button>
        <sc-button-icon size="s" type="tertiary-mono" icon="x" label="Close Scale Edit" @click=${() => this.toggle()}></sc-button-icon>
      </div>
    `
  }

  private renderOverlays() {
    return html`
      ${this.hoverRect ? html`<div class="hl hover" style=${rectStyle(this.hoverRect)}></div>` : nothing}
      ${this.selectedRect ? html`<div class="hl sel" style=${rectStyle(this.selectedRect)}></div>` : nothing}
    `
  }

  private renderPopover(): TemplateResult {
    const r = this.selectedRect as DOMRect
    const top = Math.min(r.bottom + 8, window.innerHeight - 220)
    const left = Math.min(r.left, window.innerWidth - 320)
    const tag = this.selectedEl?.tagName.toLowerCase() ?? ''
    return html`
      <div class="popover" style="top:${top}px;left:${left}px">
        <div class="pop-head">
          <code>${tag}</code>
          <sc-button-icon size="s" type="tertiary" icon="x" label="Close" @click=${() => this.clearSelection()}></sc-button-icon>
        </div>
        ${this.renderCommentForm()}
      </div>
    `
  }

  private renderCommentForm() {
    return html`
      <textarea
        class="ta"
        placeholder="Describe the change…"
        .value=${this.draft}
        @input=${(e: Event) => (this.draft = (e.target as HTMLTextAreaElement).value)}
      ></textarea>
      <sc-button class="primary" type="primary" ?disabled=${!this.draft.trim()} @click=${() => this.saveComment()}>
        Pin comment
      </sc-button>
    `
  }

  /** Docked right-hand inspector — edits content, props, attributes and token styles of the selected element. */
  private renderPanel(): TemplateResult {
    const el = this.selectedEl as HTMLElement | null
    void this.inspectVersion // re-render when live attributes change
    return html`
      <aside class="panel">
        <div class="panel-head">
          <strong>Inspect</strong>
          <sc-button-icon size="s" type="tertiary-mono" icon="x" label="Close" @click=${() => this.toggle()}></sc-button-icon>
        </div>
        ${el ? this.renderInspector(el) : html`<p class="empty pad">Click an element on the page to edit it.</p>`}
      </aside>
    `
  }

  private renderInspector(el: HTMLElement): TemplateResult {
    const tag = el.tagName.toLowerCase()
    const def = this.schema.get(tag)
    const hasText = hasDirectText(el)
    return html`
      <div class="panel-sub">
        <code>${tag}</code>${def ? html`<span class="chip">component</span>` : nothing}
      </div>
      <div class="panel-body">
        ${hasText ? this.renderTextSection(el) : nothing}
        ${def?.props ? this.renderPropsSection(el, def) : nothing}
        ${this.renderStyleSection(el)}
      </div>
    `
  }

  private section(title: string, body: TemplateResult): TemplateResult {
    return html`<section class="sec"><div class="sec-title">${title}</div>${body}</section>`
  }

  private renderTextSection(el: HTMLElement): TemplateResult {
    return this.section(
      'Content',
      html`<textarea
        class="field"
        .value=${el.textContent ?? ''}
        @change=${(e: Event) => this.applyText((e.target as HTMLTextAreaElement).value)}
      ></textarea>`,
    )
  }

  private renderPropsSection(el: HTMLElement, def: ComponentDef): TemplateResult {
    const props = Object.entries(def.props as Record<string, PropDef>)
    return this.section(
      'Properties',
      html`${props.map(([name, p]) => {
        const attr = p.attribute || name
        // Show the effective current value — explicit attribute if set, else the component default.
        const cur = el.getAttribute(attr) ?? (p.default != null ? String(p.default) : '')
        if (p.type === 'boolean') {
          return html`<label class="row-field">
            <span>${name}</span>
            <input
              type="checkbox"
              .checked=${el.hasAttribute(attr) || p.default === true}
              @change=${(e: Event) => this.applyBoolean(attr, (e.target as HTMLInputElement).checked)}
            />
          </label>`
        }
        return html`<label class="row-field">
          <span>${name}</span>
          <input
            class="field sm"
            .value=${cur}
            placeholder=${p.type}
            @change=${(e: Event) => this.applyAttribute(attr, (e.target as HTMLInputElement).value)}
          />
        </label>`
      })}`,
    )
  }

  private renderStyleSection(el: HTMLElement): TemplateResult {
    return this.section(
      'Style (tokens)',
      html`
        ${(() => {
          const curStyle = this.currentTextStyle(el)
          // No named style? Still show the element's current type (size token + weight) so it's never blank.
          const cs = getComputedStyle(el)
          const sizeTok = this.typeScale?.sizes.get(cs.fontSize)
          const weightTok = this.typeScale?.weights.get(cs.fontWeight)
          const raw = sizeTok ? `type-size-${sizeTok}${weightTok ? ` · ${weightTok}` : ''}` : cs.fontSize
          const styleNames = Object.keys(this.typography).filter((n) => /^(heading|text)-/.test(n))
          const list = styleNames.length ? styleNames : TEXT_STYLES
          return html`<label class="row-field">
            <span>Text style</span>
            <select class="field sm" @change=${(e: Event) => this.applyTextStyle((e.target as HTMLSelectElement).value)}>
              ${curStyle ? nothing : html`<option value="" selected>current: ${raw}</option>`}
              ${list.map((s) => html`<option value=${s} ?selected=${s === curStyle}>${s}</option>`)}
            </select>
          </label>`
        })()}
        ${STYLE_CONTROLS.map((c) => {
        const opts = c.role ? this.tokens[c.bucket].filter((t) => c.role!.test(t.name)) : this.tokens[c.bucket]
        // Resolve the element's current token: an inline `var(--sc-…)` if set, else
        // reverse-match the *effective* computed value to a token. `raw` is the
        // computed value shown when nothing maps to a token.
        const inline = el.style.getPropertyValue(c.css).match(/var\((--sc-[\w-]+)\)/)?.[1]
        const raw = currentStyleValue(el, c.css)
        const cur = inline ?? opts.find((o) => o.canonical && o.canonical === raw)?.name ?? ''
        return html`<label class="row-field">
          <span>${c.label}</span>
          <select
            class="field sm"
            @change=${(e: Event) => {
              const v = (e.target as HTMLSelectElement).value
              const t = opts.find((o) => o.name === v)
              if (t) this.applyStyle(c.css, t)
            }}
          >
            ${cur
              ? nothing
              : html`<option value="" selected>${raw && raw !== 'rgba(0, 0, 0, 0)' ? `current: ${raw}` : '—'}</option>`}
            ${opts.map((o) => html`<option value=${o.name} ?selected=${o.name === cur}>${o.name.replace('--sc-', '')}</option>`)}
          </select>
        </label>`
      })}`,
    )
  }

  private renderInbox() {
    return html`
      <div class="inbox">
        <div class="pop-head"><strong>Pending (${this.items.length})</strong></div>
        ${this.items.length === 0 ? html`<p class="empty">No items yet.</p>` : nothing}
        ${this.items.map(
          (i) => html`
            <div class="row">
              <div class="row-main">
                <code>${i.anchor.tagName}</code>
                <span class="row-desc">${describeItem(i)}</span>
                ${i.anchor.sourceLoc ? html`<span class="loc">${i.anchor.sourceLoc}</span>` : nothing}
              </div>
              <sc-button-icon
                class="del"
                size="s"
                type="tertiary"
                icon="trash-2"
                label="Delete annotation"
                @click=${() => this.resolve(i.id)}
              ></sc-button-icon>
            </div>
          `,
        )}
      </div>
    `
  }

  static styles = css`
    :host {
      position: fixed;
      inset: 0;
      pointer-events: none;
      z-index: 2147483000;
      font-family: var(--sc-type-family-base, system-ui, sans-serif);
      color: var(--sc-color-text-primary, #111);
    }
    button {
      font: inherit;
      cursor: pointer;
    }
    .hl {
      position: fixed;
      pointer-events: none;
      border-radius: 3px;
    }
    .hl.hover {
      outline: 2px solid var(--sc-color-brand-500, #5b8cff);
      background: color-mix(in srgb, var(--sc-color-brand-500, #5b8cff) 8%, transparent);
    }
    .hl.sel {
      outline: 2px dashed var(--sc-color-brand-600, #3366ff);
    }
    .launcher-wrap {
      position: fixed;
      right: var(--sc-space-l);
      bottom: var(--sc-space-l);
      pointer-events: auto;
    }
    /* Keep the round FAB affordance on the real sc-button-icon. */
    .launcher-wrap sc-button-icon::part(button) {
      border-radius: var(--sc-border-radius-circle, 50%);
      box-shadow: var(--sc-shadow-m, 0 4px 16px rgba(0, 0, 0, 0.2));
    }
    .count {
      position: absolute;
      top: calc(-1 * var(--sc-space-2xs));
      right: calc(-1 * var(--sc-space-2xs));
      pointer-events: none;
    }
    .toolbar {
      position: fixed;
      left: 50%;
      bottom: var(--sc-space-l);
      transform: translateX(-50%);
      pointer-events: auto;
      display: flex;
      align-items: center;
      gap: var(--sc-space-xs);
      padding: var(--sc-space-xs) var(--sc-space-s);
      border-radius: var(--sc-border-radius-m, 12px);
      background: var(--sc-color-background-primary, #fff);
      border: 1px solid var(--sc-color-border-primary, #e3e3e3);
      box-shadow: var(--sc-shadow-l, 0 8px 28px rgba(0, 0, 0, 0.18));
    }
    .brand {
      font-weight: 600;
      margin-right: var(--sc-space-2xs);
    }
    .popover,
    .inbox {
      position: fixed;
      pointer-events: auto;
      width: 300px;
      padding: var(--sc-space-m);
      border-radius: var(--sc-border-radius-m, 12px);
      background: var(--sc-color-background-primary, #fff);
      border: 1px solid var(--sc-color-border-primary, #e3e3e3);
      box-shadow: var(--sc-shadow-l, 0 8px 28px rgba(0, 0, 0, 0.18));
    }
    .inbox {
      right: var(--sc-space-l);
      bottom: 72px;
      max-height: 60vh;
      overflow: auto;
    }
    .pop-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: var(--sc-space-s);
    }
    code {
      font-family: ui-monospace, monospace;
      font-size: 12px;
      color: var(--sc-color-text-secondary, #555);
    }
    .ta {
      width: 100%;
      min-height: 72px;
      resize: vertical;
      box-sizing: border-box;
      padding: var(--sc-space-s);
      border: 1px solid var(--sc-color-border-primary, #e3e3e3);
      border-radius: var(--sc-border-radius-s, 8px);
      font: inherit;
    }
    .primary {
      display: block;
      margin-top: var(--sc-space-s);
    }
    .primary::part(button) {
      width: 100%;
    }
    .row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--sc-space-s);
      padding: var(--sc-space-s) 0;
      border-top: 1px solid var(--sc-color-border-primary, #eee);
    }
    .row-main {
      display: flex;
      flex-direction: column;
      gap: var(--sc-space-2xs);
      min-width: 0;
    }
    .loc {
      font-family: ui-monospace, monospace;
      color: var(--sc-color-text-link, #3366ff);
    }
    .empty {
      color: var(--sc-color-text-secondary, #777);
    }
    .del {
      flex-shrink: 0;
    }
    .pin {
      position: fixed;
      pointer-events: none;
      z-index: 1;
    }
    .pin-dot {
      pointer-events: auto;
      transform: translate(-50%, -50%);
      width: 22px;
      height: 22px;
      border-radius: 50% 50% 50% 2px;
      border: 2px solid #fff;
      background: var(--sc-color-brand-600, #3366ff);
      color: #fff;
      font-size: 12px;
      font-weight: 600;
      line-height: 1;
      box-shadow: var(--sc-shadow-s, 0 2px 6px rgba(0, 0, 0, 0.3));
    }
    .pin-dot.edit {
      background: var(--sc-color-background-positive, #2e7d32);
    }
    .pin-bubble {
      pointer-events: auto;
      position: absolute;
      top: 14px;
      left: 6px;
      width: 220px;
      padding: var(--sc-space-s);
      border-radius: var(--sc-border-radius-s, 8px);
      background: var(--sc-color-background-primary, #fff);
      border: 1px solid var(--sc-color-border-primary, #e3e3e3);
      box-shadow: var(--sc-shadow-l, 0 8px 28px rgba(0, 0, 0, 0.18));
    }
    .pin-desc {
      margin: var(--sc-space-xs) 0 var(--sc-space-s);
    }
    /* All panel text uses the Text S type style. */
    .panel {
      font-size: var(--sc-type-size-s);
      line-height: var(--sc-type-line-height-s);
      font-weight: var(--sc-type-weight-regular);
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      width: 280px;
      pointer-events: auto;
      display: flex;
      flex-direction: column;
      background: var(--sc-color-background-primary, #fff);
      border-left: 1px solid var(--sc-color-border-primary, #e3e3e3);
      box-shadow: -8px 0 28px rgba(0, 0, 0, 0.12);
    }
    .panel-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--sc-space-m);
      border-bottom: 1px solid var(--sc-color-border-primary, #eee);
    }
    .panel-sub {
      display: flex;
      align-items: center;
      gap: var(--sc-space-s);
      padding: var(--sc-space-s) var(--sc-space-m);
      border-bottom: 1px solid var(--sc-color-border-primary, #eee);
    }
    .panel-body {
      overflow: auto;
      padding: var(--sc-space-xs) var(--sc-space-m) var(--sc-space-xl);
    }
    /* Inherit Text S everywhere inside the panel (incl. code + inputs). */
    .panel code,
    .panel .field,
    .panel .chip,
    .panel .sec-title {
      font-size: inherit;
      line-height: inherit;
    }
    .chip {
      padding: var(--sc-space-2xs) var(--sc-space-xs);
      border-radius: var(--sc-border-radius-xs, 4px);
      background: var(--sc-color-background-info-subtle, #eef);
      color: var(--sc-color-text-secondary, #556);
    }
    .sec {
      padding: var(--sc-space-m) 0;
      border-bottom: 1px solid var(--sc-color-border-primary, #f0f0f0);
    }
    .sec-title {
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--sc-color-text-secondary, #888);
      margin-bottom: var(--sc-space-s);
    }
    .row-field {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: var(--sc-space-s);
      margin-bottom: var(--sc-space-xs);
    }
    .row-field > span {
      flex: 0 0 40%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .mono {
      font-family: ui-monospace, monospace;
      font-size: 12px;
    }
    .field {
      box-sizing: border-box;
      width: 100%;
      padding: var(--sc-space-xs) var(--sc-space-s);
      border: 1px solid var(--sc-color-border-primary, #e3e3e3);
      border-radius: var(--sc-border-radius-xs, 4px);
      font: inherit;
    }
    .field.sm {
      flex: 1 1 auto;
      min-width: 0;
    }
    textarea.field {
      min-height: 56px;
      resize: vertical;
    }
    .pad {
      padding: var(--sc-space-l) var(--sc-space-m);
    }
  `
}

// ---- helpers --------------------------------------------------------------

function rectStyle(r: DOMRect): string {
  return `top:${r.top}px;left:${r.left}px;width:${r.width}px;height:${r.height}px`
}

/** One-line human description of a queue item for pins/inbox. */
function describeItem(it: EditItem): string {
  if (it.kind === 'comment') return it.comment ?? ''
  const e = it.edit
  if (!e) return 'edit'
  if (e.target === 'text') return `text → “${(e.to ?? '').slice(0, 24)}”`
  if (e.target === 'textStyle') return `text style → ${e.name}`
  return `${e.name} → ${e.to ?? ''}`
}

/** Probe each `--sc-type-size-*` / `--sc-type-weight-*` token so a computed font can be reverse-mapped to a style. */
function scanTypeScale(): { sizes: Map<string, string>; weights: Map<string, string> } {
  const probe = document.createElement('span')
  probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none'
  document.body.appendChild(probe)
  // Full size scale (not just named-style sizes) so we can also label out-of-scale
  // display sizes. Order matters: 'l' before its 16px alias '2xs'.
  const sizes = new Map<string, string>()
  const SIZE_SUFFIXES = ['xs', 's', 'm', 'l', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl', '10xl', '2xs']
  for (const suf of SIZE_SUFFIXES) {
    probe.style.fontSize = `var(--sc-type-size-${suf})`
    const px = getComputedStyle(probe).fontSize
    if (px && px !== '0px' && !sizes.has(px)) sizes.set(px, suf)
  }
  const weights = new Map<string, string>()
  for (const w of ['light', 'regular', 'semi-bold']) {
    probe.style.fontWeight = `var(--sc-type-weight-${w})`
    weights.set(getComputedStyle(probe).fontWeight, w)
  }
  probe.remove()
  return { sizes, weights }
}

/** The element's effective (computed) value for a style control's CSS property. */
function currentStyleValue(el: Element, css: string): string {
  const cs = getComputedStyle(el)
  switch (css) {
    case 'color':
      return cs.color
    case 'background-color':
      return cs.backgroundColor
    case 'padding':
      return cs.paddingTop
    case 'border-radius':
      return cs.borderTopLeftRadius
    default:
      return cs.getPropertyValue(css)
  }
}

/** Does the element hold its own text (not just nested elements)? */
function hasDirectText(el: Element): boolean {
  for (const n of Array.from(el.childNodes)) {
    if (n.nodeType === Node.TEXT_NODE && (n.textContent ?? '').trim()) return true
  }
  return el.children.length === 0 && (el.textContent ?? '').trim().length > 0
}

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function buildAnchor(el: Element): EditAnchor {
  const tagName = el.tagName.toLowerCase()
  const attrs: Record<string, string> = {}
  for (const a of Array.from(el.attributes)) attrs[a.name] = a.value
  const text = (el.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 120)
  return {
    tagName,
    isScComponent: tagName.startsWith('sc-'),
    sourceLoc: nearestSourceLoc(el),
    cssSelector: cssSelector(el),
    domPath: domPath(el),
    id: el.id || undefined,
    className: typeof el.className === 'string' ? el.className || undefined : undefined,
    attributes: attrs,
    text: text || undefined,
    rect: rectFrom(el),
    viewport: { width: window.innerWidth, height: window.innerHeight },
  }
}

function rectFrom(el: Element) {
  const r = el.getBoundingClientRect()
  return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) }
}

/** Walk up to the nearest element carrying a `data-sc-loc` stamp. */
function nearestSourceLoc(el: Element): string | undefined {
  let cur: Element | null = el
  while (cur) {
    const loc = cur.getAttribute('data-sc-loc')
    if (loc) return loc
    cur = cur.parentElement
  }
  return undefined
}

/** A reasonably-unique CSS selector for fallback source location. */
function cssSelector(el: Element): string {
  if (el.id) return `#${CSS.escape(el.id)}`
  const parts: string[] = []
  let cur: Element | null = el
  while (cur && cur.nodeType === 1 && parts.length < 5) {
    let part = cur.tagName.toLowerCase()
    const cls = typeof cur.className === 'string' ? cur.className.trim().split(/\s+/).filter(Boolean) : []
    if (cls.length) part += '.' + cls.slice(0, 2).map((c) => CSS.escape(c)).join('.')
    const parent = cur.parentElement
    if (parent) {
      const sibs = Array.from(parent.children).filter((c) => c.tagName === cur!.tagName)
      if (sibs.length > 1) part += `:nth-of-type(${sibs.indexOf(cur) + 1})`
    }
    parts.unshift(part)
    if (cur.id) {
      parts[0] = `#${CSS.escape(cur.id)}`
      break
    }
    cur = cur.parentElement
  }
  return parts.join(' > ')
}

function domPath(el: Element): string {
  const parts: string[] = []
  let cur: Element | null = el
  while (cur && cur.nodeType === 1) {
    parts.unshift(cur.tagName.toLowerCase())
    cur = cur.parentElement
  }
  return parts.join('/')
}

/** Collect `--sc-*` design tokens from same-origin stylesheets, bucketed for the style controls. */
function scanTokens(): TokenSets {
  const all = new Map<string, string>()
  const root = getComputedStyle(document.documentElement)
  for (const sheet of Array.from(document.styleSheets)) {
    let rules: CSSRuleList
    try {
      rules = sheet.cssRules
    } catch {
      continue // cross-origin
    }
    for (const rule of Array.from(rules)) {
      if (!(rule instanceof CSSStyleRule)) continue
      const style = rule.style
      for (let i = 0; i < style.length; i++) {
        const name = style[i]
        if (name.startsWith('--sc-') && !all.has(name)) {
          const resolved = root.getPropertyValue(name).trim()
          if (resolved) all.set(name, resolved)
        }
      }
    }
  }
  const pick = (re: RegExp) => Array.from(all, ([name, value]) => ({ name, value })).filter((t) => re.test(t.name))
  const sets: TokenSets = {
    // Semantic roles only — exclude primitive ramps (neutral/red/brand/blue/orange/green/purple).
    color: pick(/^--sc-color-(text|background|border|icon|surface|overlay)/),
    space: pick(/^--sc-space-/),
    radius: pick(/^--sc-border-radius-/),
  }
  // Compute each token's browser-normalised value (rgb / px) via a probe, so the
  // panel can reverse-match an element's *effective* style back to its token.
  const probe = document.createElement('span')
  probe.style.cssText = 'position:absolute;visibility:hidden;pointer-events:none'
  document.body.appendChild(probe)
  for (const t of sets.color) {
    probe.style.color = `var(${t.name})`
    t.canonical = getComputedStyle(probe).color
  }
  for (const t of [...sets.space, ...sets.radius]) {
    probe.style.paddingTop = `var(${t.name})`
    t.canonical = getComputedStyle(probe).paddingTop
  }
  probe.remove()
  return sets
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-edit-layer': ScEditLayer
  }
}
