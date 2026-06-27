// @scale-ds/scale-design-system/vite — dev-only bridge for the Scale Edit overlay.
//
//   import { scaleEdit } from '@scale-ds/scale-design-system/vite'
//   export default defineConfig({ plugins: [scaleEdit()] })
//
// Responsibilities:
//  1. Inject the overlay (`@scale-ds/scale-design-system/edit`) in dev.
//  2. Serve a tiny REST bridge backed by `<root>/.scale/edits.json` — the
//     single storage boundary, so JSON can later become SQLite/NDJSON without
//     touching the overlay or the agent skill.
//  3. Stamp `data-sc-loc="file:line"` onto HTML so the agent can locate source.
import { mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, relative, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const DEFAULT_ENDPOINT = '/__scale/edits'
const COMPONENTS_ROUTE = '/__scale/components'
const TYPOGRAPHY_ROUTE = '/__scale/typography'
// This plugin file sits at the package root; the generated schema is alongside it.
const PKG_DIR = dirname(fileURLToPath(import.meta.url))

/**
 * @param {{ endpoint?: string, store?: string, stampSource?: boolean }} [options]
 * @returns {import('vite').Plugin}
 */
export function scaleEdit(options = {}) {
  const endpoint = options.endpoint ?? DEFAULT_ENDPOINT
  const stampSource = options.stampSource ?? true
  let root = process.cwd()
  let storePath = ''

  const readStore = () => {
    try {
      if (existsSync(storePath)) return JSON.parse(readFileSync(storePath, 'utf8'))
    } catch {
      /* corrupt/missing — fall through to empty */
    }
    return { items: [] }
  }
  const writeStore = (data) => {
    mkdirSync(join(root, '.scale'), { recursive: true })
    writeFileSync(storePath, JSON.stringify(data, null, 2))
  }

  // Bootstrap is served as a virtual module (not inline) so Vite puts it in the
  // module graph and rewrites the bare `@scale-ds/scale-design-system/edit` import. Inline
  // injected scripts are NOT import-analysed, so a bare specifier would 404.
  const VIRTUAL_ID = 'virtual:scale-edit'
  const RESOLVED_ID = '\0' + VIRTUAL_ID

  return {
    name: 'scale-edit',
    apply: 'serve',

    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },

    load(id) {
      if (id === RESOLVED_ID) {
        return `import { enableEdit } from '@scale-ds/scale-design-system/edit'\nenableEdit({ endpoint: ${JSON.stringify(
          endpoint,
        )} })`
      }
    },

    configResolved(config) {
      root = config.root
      storePath = options.store ? join(root, options.store) : join(root, '.scale', 'edits.json')
    },

    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = (req.url || '').split('?')[0]
        if (!url.startsWith(endpoint) && url !== COMPONENTS_ROUTE && url !== TYPOGRAPHY_ROUTE) return next()

        const send = (code, body) => {
          res.statusCode = code
          res.setHeader('content-type', 'application/json')
          res.end(JSON.stringify(body))
        }

        // Design-system component schema (props/slots) drives the inspector panel.
        if (req.method === 'GET' && url === COMPONENTS_ROUTE) {
          try {
            return send(200, JSON.parse(readFileSync(join(PKG_DIR, 'context', 'components.json'), 'utf8')))
          } catch {
            return send(200, { components: [] })
          }
        }

        // Real named type styles (font-size/line-height/weight tokens) drive the Text style control.
        if (req.method === 'GET' && url === TYPOGRAPHY_ROUTE) {
          try {
            return send(200, { styles: parseTypeStyles(readFileSync(join(PKG_DIR, 'scss', 'typography.ts'), 'utf8')) })
          } catch {
            return send(200, { styles: {} })
          }
        }

        if (req.method === 'GET' && url === endpoint) {
          return send(200, readStore())
        }

        if (req.method === 'POST' && url === endpoint) {
          let raw = ''
          req.on('data', (c) => (raw += c))
          req.on('end', () => {
            try {
              const item = JSON.parse(raw)
              const store = readStore()
              const idx = store.items.findIndex((i) => i.id === item.id)
              if (idx >= 0) store.items[idx] = item
              else store.items.push(item)
              writeStore(store)
              send(200, { ok: true, count: store.items.length })
            } catch (err) {
              send(400, { error: String(err) })
            }
          })
          return
        }

        if (req.method === 'DELETE' && url.startsWith(endpoint + '/')) {
          const id = decodeURIComponent(url.slice(endpoint.length + 1))
          const store = readStore()
          store.items = store.items.filter((i) => i.id !== id)
          writeStore(store)
          return send(200, { ok: true, count: store.items.length })
        }

        return next()
      })
    },

    transformIndexHtml(html, ctx) {
      const inject = {
        html,
        tags: [
          {
            tag: 'script',
            attrs: { type: 'module', src: `/@id/__x00__${VIRTUAL_ID}` },
            injectTo: 'body',
          },
        ],
      }
      if (!stampSource) return inject
      try {
        const file = ctx?.filename ? relative(root, ctx.filename) : 'index.html'
        inject.html = stamp(html, file)
      } catch {
        /* never break the page over a source stamp */
      }
      return inject
    },
  }
}

/** Add `data-sc-loc="file:line"` to opening tags that don't already have it. */
function stamp(html, file) {
  let line = 1
  return html.replace(/<([a-zA-Z][\w-]*)((?:\s[^<>]*?)?)(\/?)>/g, (match, tag, attrs, slash, offset) => {
    // advance the running line counter to this match
    line = 1 + countNewlines(html, 0, offset)
    const skip = tag === 'script' || tag === 'style' || tag === '!doctype' || /\bdata-sc-loc=/.test(attrs)
    if (skip) return match
    return `<${tag}${attrs} data-sc-loc="${file}:${line}"${slash}>`
  })
}

function countNewlines(s, from, to) {
  let n = 0
  for (let i = from; i < to; i++) if (s.charCodeAt(i) === 10) n++
  return n
}

const WEIGHT_KEBAB = { Light: 'light', Regular: 'regular', SemiBold: 'semi-bold' }

/** Parse generated `scss/typography.ts` into a map of kebab style name → its token references. */
function parseTypeStyles(src) {
  const out = {}
  // export const heading5xlSemiBold = css`font-family: var(--…); font-size: var(--…); …`
  const re = /export const (\w+) = css`([^`]*)`/g
  let m
  while ((m = re.exec(src))) {
    const [, camel, body] = m
    const k = camel.match(/^(heading|text|link)(.+?)(Light|Regular|SemiBold)$/)
    if (!k) continue
    const name = `${k[1]}-${k[2].toLowerCase()}-${WEIGHT_KEBAB[k[3]]}`
    const grab = (prop) => body.match(new RegExp(prop + ':\\s*var\\((--[\\w-]+)\\)'))?.[1]
    out[name] = {
      fontFamily: grab('font-family'),
      fontSize: grab('font-size'),
      lineHeight: grab('line-height'),
      fontWeight: grab('font-weight'),
      letterSpacing: grab('letter-spacing'),
    }
  }
  return out
}

export default scaleEdit
