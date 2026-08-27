#!/usr/bin/env node
// Emits one agent-readable Markdown file per tag into context/agents/, from the
// same guidance fragments that render the human guidelines pages.
//
// The fragment is the only authored artifact. The HTML page a person reads and
// the Markdown file an agent reads are both outputs of it, so the two cannot
// drift: an agent file is not a description of the page, it *is* the page.
//
// Frontmatter carries the contract (props with real values, slots, events, CSS
// API) and comes from context/components.json. The body carries the judgment
// (when to use, do, don't, examples, accessibility) and comes from the
// fragment. Nothing is authored twice, and nothing here is hand-written.
//
// Run via `npm run generate:agents`, and by prepublishOnly alongside
// generate-context.

import { readFileSync, readdirSync, writeFileSync, mkdirSync, rmSync } from 'fs'
import { join } from 'path'

const root = process.cwd()
const guidanceDir = join(root, 'guidance')
const outDir = join(root, 'context', 'agents')

const catalog = JSON.parse(readFileSync(join(root, 'context', 'components.json'), 'utf-8'))
const byTag = new Map(catalog.components.map(c => [c.tag, c]))

const pkg = JSON.parse(readFileSync(join(root, 'package.json'), 'utf-8'))

/* ---------------------------------------------------------------- text ---- */

const ENTITIES = {
  '&rsquo;': '’', '&lsquo;': '‘', '&ldquo;': '“', '&rdquo;': '”',
  '&mdash;': '—', '&ndash;': '–', '&hellip;': '…', '&nbsp;': ' ',
  '&lt;': '<', '&gt;': '>', '&quot;': '"', '&amp;': '&',
  '&times;': '×', '&le;': '≤', '&ge;': '≥', '&ne;': '≠', '&minus;': '−',
  '&plusmn;': '±', '&deg;': '°', '&middot;': '·', '&bull;': '•', '&infin;': '∞',
  '&rarr;': '→', '&larr;': '←', '&uarr;': '↑', '&darr;': '↓',
  '&copy;': '©', '&reg;': '®', '&trade;': '™',
}

/**
 * `&amp;` is decoded last, so a `&` that comes out of one entity can't be
 * re-read as the opening of another.
 *
 * Numeric escapes are handled generically rather than enumerated — the
 * fragments are hand-written, and the named list will always be a step behind
 * whatever an author types next. Anything still unresolved is reported by the
 * run, so a new entity shows up as a warning instead of as mojibake in a file
 * nobody reads closely.
 */
function decode(s) {
  let out = s
  for (const [entity, char] of Object.entries(ENTITIES)) {
    if (entity !== '&amp;') out = out.split(entity).join(char)
  }
  out = out
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
  return out.split('&amp;').join('&')
}

const collapse = (s) => s.replace(/\s+/g, ' ').trim()

/**
 * Prose as Markdown: the few inline elements the fragments actually use are
 * converted, everything else is dropped to text.
 *
 * Internal links flatten to the thing they point at rather than surviving as
 * URLs — an agent has no browser, and "use `sc-button-icon`" is the actionable
 * form of "use [Button Icon](/components/button-icon/)".
 */
function inline(html, links) {
  return collapse(decode(
    html
      .replace(/<a\s+href="\/([a-z-]+)\/([a-z-]+)\/"[^>]*>([\s\S]*?)<\/a>/g,
        (_, section, slug, label) => {
          const target = links.get(`${section}/${slug}`)
          return target ? `\`${target}\`` : collapse(label.replace(/<[^>]+>/g, ''))
        })
      .replace(/<(?:code|kbd)[^>]*>([\s\S]*?)<\/(?:code|kbd)>/g, (_, t) => `\`${collapse(t.replace(/<[^>]+>/g, ''))}\``)
      .replace(/<strong[^>]*>([\s\S]*?)<\/strong>/g, (_, t) => `**${collapse(t.replace(/<[^>]+>/g, ''))}**`)
      .replace(/<[^>]+>/g, ' '),
  ))
}

/** The `<li>` bodies of the first `<ul>` in a chunk, as Markdown lines. */
function listItems(chunk, links) {
  const ul = chunk.match(/<ul[^>]*>([\s\S]*?)<\/ul>/)
  if (!ul) return []
  return [...ul[1].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/g)]
    .map(m => inline(m[1], links))
    .filter(Boolean)
}

/**
 * The markup inside a `<scd-demo>`, dedented, as it appears on the page.
 *
 * Reproduced in full rather than trimmed to a representative few. The rule the
 * whole approach rests on is that the agent file and the human page say the
 * same thing; capping the examples would quietly make that false, and an agent
 * that has seen only 6 of 13 variants will confidently use the 6.
 */
function demoCode(body) {
  const lines = decode(body).replace(/^\n+|\s+$/g, '').split('\n')
  const indent = Math.min(
    ...lines.filter(l => l.trim()).map(l => l.match(/^ */)[0].length),
  )
  return lines.map(l => l.slice(indent)).join('\n').trim()
}

/* ------------------------------------------------------------- fragment ---- */

/**
 * Slices a fragment at its `<h2>` boundaries.
 *
 * The page's own nesting is not a reliable guide — an Examples run is several
 * sibling `.scd-section` divs sharing one heading — but the h2s are exactly the
 * logical sections, so cutting between them recovers the structure the author
 * intended regardless of how it was wrapped.
 */
function sections(html) {
  const heads = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>/g)]
  return heads.map((h, i) => ({
    title: collapse(decode(h[1].replace(/<[^>]+>/g, ''))),
    body: html.slice(h.index + h[0].length, i + 1 < heads.length ? heads[i + 1].index : html.length),
  }))
}

function parseFragment(html, links) {
  // Everything before the first content section. Matching the header div by its
  // own closing tag does not work — it wraps another div and the resources
  // element — and falling back to "the first N characters" silently pulls
  // Examples prose into the lead.
  const start = html.indexOf('<div class="scd-page-header">')
  const end = html.indexOf('<div class="scd-section">')
  const headerHtml = start === -1 ? '' : html.slice(start, end === -1 ? html.length : end)

  const title = collapse(decode((headerHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1] ?? '').replace(/<[^>]+>/g, '')))
  const lead = [...headerHtml.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)].map(m => inline(m[1], links)).filter(Boolean)

  const resources = {}
  const res = html.match(/<scd-resources([\s\S]*?)>/)
  if (res) {
    for (const key of ['lit', 'figma', 'framer']) {
      const v = res[1].match(new RegExp(`${key}="([^"]+)"`))
      if (v) resources[key] = v[1]
    }
  }

  const parsed = { title, lead, resources, examples: [], guidance: {}, a11y: [], install: '' }

  for (const section of sections(html)) {
    const name = section.title.toLowerCase()

    if (name === 'install') {
      parsed.install = decode(section.body.match(/<scd-demo\s+code="([^"]*)"/)?.[1] ?? '')
      continue
    }

    if (name === 'accessibility') {
      parsed.a11y = listItems(section.body, links)
      continue
    }

    if (name === 'guidelines') {
      // The Usage paragraph sits before the Do/Don't blocks and answers "when
      // would I reach for this", which is the first thing an agent needs.
      const intro = section.body.split('<div class="scd-guidelines"')[0]
      parsed.guidance.usage = [...intro.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)]
        .map(m => inline(m[1], links)).filter(Boolean).join(' ')

      for (const block of section.body.split('<div class="scd-guideline">').slice(1)) {
        const heading = collapse(decode((block.match(/<h3[^>]*>([\s\S]*?)<\/h3>/)?.[1] ?? '').replace(/<[^>]+>/g, '')))
        const items = listItems(block, links)
        if (/^don/i.test(heading)) parsed.guidance.dont = items
        else if (/^do/i.test(heading)) parsed.guidance.do = items
      }
      continue
    }

    if (name === 'examples') {
      parsed.examples.push(...parseExamples(section.body, links))
      continue
    }

    // Foundation pages use free-form h2s (Scale, Levels, Duration…). Keep the
    // prose; their tables are token data that tokens.json already carries.
    const prose = [...section.body.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)]
      .map(m => inline(m[1], links)).filter(Boolean).join(' ')
    if (prose) (parsed.notes ??= []).push({ title: section.title, prose })
  }

  return parsed
}

/** Each `<h3>` under Examples, with its prose and its demo markup. */
function parseExamples(body, links) {
  const heads = [...body.matchAll(/<h3[^>]*>([\s\S]*?)<\/h3>/g)]
  const out = []

  for (let i = 0; i < heads.length; i++) {
    const chunk = body.slice(
      heads[i].index + heads[i][0].length,
      i + 1 < heads.length ? heads[i + 1].index : body.length,
    )
    const demo = chunk.match(/<scd-demo(?:\s[^>]*)?>([\s\S]*?)<\/scd-demo>/)
    if (!demo) continue

    out.push({
      title: collapse(decode(heads[i][1].replace(/<[^>]+>/g, ''))),
      prose: [...chunk.split('<scd-demo')[0].matchAll(/<p[^>]*>([\s\S]*?)<\/p>/g)]
        .map(m => inline(m[1], links)).filter(Boolean).join(' '),
      code: demoCode(demo[1]),
    })
  }
  return out
}

/* ----------------------------------------------------------------- yaml ---- */

/** Quote only where YAML would otherwise misread the value. */
function scalar(v) {
  if (typeof v === 'boolean' || typeof v === 'number') return String(v)
  const s = String(v)
  if (s === '') return '""'
  if (/^[\w./@-]+$/.test(s) && !/^(y|n|yes|no|true|false|on|off|null)$/i.test(s)) return s
  return `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
}

const flowList = (items) => `[${items.map(scalar).join(', ')}]`

/* ------------------------------------------------------------- emitting ---- */

function propLine(name, def) {
  const parts = [`type: ${def.values ? 'enum' : (def.type ?? 'string')}`]
  if (def.default !== undefined) parts.push(`default: ${scalar(def.default)}`)
  if (def.attribute && def.attribute !== name) parts.push(`attr: ${scalar(def.attribute)}`)
  if (def.values) parts.push(`values: ${flowList(def.values)}`)
  return `  ${name}: { ${parts.join(', ')} }`
}

function frontmatter(fields) {
  const out = ['---']
  for (const [key, value] of fields) {
    if (value === undefined || value === null) continue
    if (Array.isArray(value)) {
      if (!value.length) continue
      out.push(`${key}: ${flowList(value)}`)
    } else if (typeof value === 'object') {
      const entries = Object.entries(value).filter(([, v]) => v !== undefined && v !== '')
      if (!entries.length) continue
      out.push(`${key}:`)
      for (const [k, v] of entries) out.push(`  ${k}: ${scalar(v)}`)
    } else {
      out.push(`${key}: ${scalar(value)}`)
    }
  }
  out.push('---')
  return out.join('\n')
}

/**
 * A Don't bullet that points at another component is a redirect: the author
 * has already written down what to reach for instead.
 *
 * Frontmatter gets the tags only. Rewriting "Don't ship icon-only buttons
 * here" into a noun phrase means guessing at grammar, and the guesses read
 * badly enough to be worse than useless; the sentence itself survives intact
 * in the "When not to use" section, where it is quoted rather than parsed.
 */
function useInstead(dont) {
  return [...new Set(
    (dont ?? []).flatMap(line => [...line.matchAll(/`(sc-[a-z-]+)`/g)].map(m => m[1])),
  )]
}

/** The Don't bullets that name an alternative, kept verbatim. */
const redirectRules = (dont) => (dont ?? []).filter(line => /`sc-[a-z-]+`/.test(line))

function componentDoc({ tag, parsed, slug, section }) {
  const c = byTag.get(tag)
  const redirects = useInstead(parsed.guidance.dont)

  const fm = frontmatter([
    ['tag', tag],
    ['class', c?.class],
    ['category', c?.category],
    ['import', `${pkg.name}/components/${tag}`],
    ['dependencies', c?.dependencies ?? []],
  ])

  const lines = [fm]

  if (c && Object.keys(c.props ?? {}).length) {
    lines[0] = lines[0].replace(/\n---$/, '\nprops:\n' +
      Object.entries(c.props).map(([n, d]) => propLine(n, d)).join('\n') + '\n---')
  }

  const extras = frontmatter([
    ['slots', (c?.slots ?? []).map(s => s.split(' - ')[0])],
    ['events', (c?.events ?? []).map(e => e.name)],
    ['cssParts', (c?.cssParts ?? []).map(p => p.name)],
    ['cssProperties', (c?.cssProperties ?? []).map(p => p.name)],
    ['roles', c?.a11y?.roles ?? []],
    ['formAssociated', c?.a11y?.formAssociated],
  ]).replace(/^---\n?/, '').replace(/\n?---$/, '')

  if (extras.trim()) lines[0] = lines[0].replace(/\n---$/, `\n${extras}\n---`)

  if (redirects.length) {
    lines[0] = lines[0].replace(/\n---$/, `\nuseInstead: ${flowList(redirects)}\n---`)
  }

  const source = frontmatter([['source', {
    guidance: `guidance/${section}/${slug}.html`,
    lit: parsed.resources.lit,
    figma: parsed.resources.figma,
    framer: parsed.resources.framer,
    docs: `https://scaledesignsystem.com/${section}/${slug}/`,
  }]]).replace(/^---\n?/, '').replace(/\n?---$/, '')
  lines[0] = lines[0].replace(/\n---$/, `\n${source}\n---`)

  lines.push('', `# ${tag}`, '')
  if (parsed.lead.length) lines.push(parsed.lead.join(' '), '')

  if (parsed.guidance.usage) lines.push('## When to use', '', parsed.guidance.usage, '')

  const rules = redirectRules(parsed.guidance.dont)
  if (rules.length) lines.push('## When not to use', '', ...rules.map(r => `- ${r}`), '')

  if (parsed.guidance.do?.length) lines.push('## Do', '', ...parsed.guidance.do.map(d => `- ${d}`), '')
  if (parsed.guidance.dont?.length) lines.push("## Don't", '', ...parsed.guidance.dont.map(d => `- ${d}`), '')

  if (parsed.examples.length) {
    lines.push('## Examples', '')
    for (const ex of parsed.examples) {
      lines.push(`### ${ex.title}`, '')
      if (ex.prose) lines.push(ex.prose, '')
      lines.push('```html', ex.code, '```', '')
    }
  }

  if (parsed.a11y.length) lines.push('## Accessibility', '', ...parsed.a11y.map(a => `- ${a}`), '')

  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n'
}

/**
 * A tag that shares a page with another — sc-tab under sc-tabs, but also
 * sc-table-basic alongside sc-table-dynamic. It gets the full contract,
 * because that is what a lookup on the tag is for, and a pointer rather than a
 * copy of the shared judgment, which is written about the group and reads
 * wrong when lifted out of it.
 *
 * The wording says "documented with" rather than "part of" deliberately. Some
 * of these are true sub-parts, but sc-table-basic is a standalone API with no
 * dependencies that merely happens to be described next to the composite, and
 * calling it a part of one would be false.
 */
function subPartDoc({ tag, parent, slug, section }) {
  const c = byTag.get(tag)
  const fm = frontmatter([
    ['tag', tag],
    ['class', c?.class],
    ['category', c?.category],
    ['documentedWith', parent],
    ['import', `${pkg.name}/components/${tag}`],
    ['dependencies', c?.dependencies ?? []],
  ])

  let out = fm
  if (c && Object.keys(c.props ?? {}).length) {
    out = out.replace(/\n---$/, '\nprops:\n' +
      Object.entries(c.props).map(([n, d]) => propLine(n, d)).join('\n') + '\n---')
  }
  const extras = frontmatter([
    ['slots', (c?.slots ?? []).map(s => s.split(' - ')[0])],
    ['events', (c?.events ?? []).map(e => e.name)],
    ['cssParts', (c?.cssParts ?? []).map(p => p.name)],
    ['cssProperties', (c?.cssProperties ?? []).map(p => p.name)],
    ['roles', c?.a11y?.roles ?? []],
    ['source', { guidance: `guidance/${section}/${slug}.html`, docs: `https://scaledesignsystem.com/${section}/${slug}/` }],
  ]).replace(/^---\n?/, '').replace(/\n?---$/, '')
  if (extras.trim()) out = out.replace(/\n---$/, `\n${extras}\n---`)

  return [
    out, '',
    `# ${tag}`, '',
    `${c?.description || `Documented with \`${parent}\`.`}`, '',
    `Documented on the same page as \`${parent}\`, which carries the shared`,
    `examples, guidelines and accessibility contract. See \`${parent}.md\`.`, '',
  ].join('\n')
}

function foundationDoc({ slug, parsed }) {
  const fm = frontmatter([
    ['foundation', slug],
    ['title', parsed.title],
    ['source', {
      guidance: `guidance/foundations/${slug}.html`,
      tokens: 'context/tokens.json',
      docs: `https://scaledesignsystem.com/foundations/${slug}/`,
    }],
  ])

  const lines = [fm, '', `# ${parsed.title}`, '']
  if (parsed.lead.length) lines.push(parsed.lead.join(' '), '')

  for (const note of parsed.notes ?? []) lines.push(`## ${note.title}`, '', note.prose, '')
  if (parsed.guidance.do?.length) lines.push('## Do', '', ...parsed.guidance.do.map(d => `- ${d}`), '')
  if (parsed.guidance.dont?.length) lines.push("## Don't", '', ...parsed.guidance.dont.map(d => `- ${d}`), '')
  if (parsed.a11y.length) lines.push('## Accessibility', '', ...parsed.a11y.map(a => `- ${a}`), '')

  lines.push('The full token set for this foundation is in `context/tokens.json`.', '')
  return lines.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n'
}

/* ------------------------------------------------------------------ run ---- */

const fragments = []
for (const section of ['components', 'sections', 'foundations']) {
  for (const file of readdirSync(join(guidanceDir, section)).filter(f => f.endsWith('.html'))) {
    const slug = file.replace(/\.html$/, '')
    const html = readFileSync(join(guidanceDir, section, file), 'utf-8')
    const tags = (html.match(/<scd-api\s+tags="([^"]+)"/)?.[1] ?? '')
      .split(/[,\s]+/).map(t => t.trim()).filter(Boolean)
    fragments.push({ section, slug, html, tags })
  }
}

// `/components/button-icon/` in a Don't bullet has to become `sc-button-icon`,
// which needs every page's primary tag known before any page is rendered.
const links = new Map(
  fragments.filter(f => f.tags.length).map(f => [`${f.section}/${f.slug}`, f.tags[0]]),
)

rmSync(outDir, { recursive: true, force: true })
mkdirSync(outDir, { recursive: true })

let written = 0
const missingContract = []

for (const fragment of fragments) {
  const parsed = parseFragment(fragment.html, links)

  if (fragment.section === 'foundations') {
    writeFileSync(join(outDir, `${fragment.slug}.md`), foundationDoc({ slug: fragment.slug, parsed }), 'utf-8')
    written++
    continue
  }

  const [primary, ...subParts] = fragment.tags
  if (!primary) continue

  if (!byTag.has(primary)) missingContract.push(primary)
  writeFileSync(
    join(outDir, `${primary}.md`),
    componentDoc({ tag: primary, parsed, slug: fragment.slug, section: fragment.section }),
    'utf-8',
  )
  written++

  for (const tag of subParts) {
    if (!byTag.has(tag)) missingContract.push(tag)
    writeFileSync(
      join(outDir, `${tag}.md`),
      subPartDoc({ tag, parent: primary, slug: fragment.slug, section: fragment.section }),
      'utf-8',
    )
    written++
  }
}

console.log(`Emitted ${written} agent files → ${outDir}`)

// Every tag in the catalog should be reachable by name, or a lookup returns
// nothing for a component the design system genuinely ships.
const documented = new Set(readdirSync(outDir).map(f => f.replace(/\.md$/, '')))
const undocumented = catalog.components.map(c => c.tag).filter(t => !documented.has(t))

// An entity that survived decoding means the map is missing a name the authors
// have started using. Cheap to catch here, invisible otherwise.
const stray = new Set()
for (const file of readdirSync(outDir)) {
  for (const m of readFileSync(join(outDir, file), 'utf-8').matchAll(/&[a-zA-Z]{2,10};/g)) stray.add(m[0])
}
if (stray.size) {
  console.warn(`\n⚠ undecoded HTML entities in the output: ${[...stray].join(' ')} — add them to ENTITIES.`)
}

if (missingContract.length) {
  console.warn(`\n⚠ referenced by a fragment but absent from components.json: ${[...new Set(missingContract)].join(', ')}`)
}
if (undocumented.length) {
  console.warn(`\n⚠ ${undocumented.length} catalog tags have no agent file: ${undocumented.join(', ')}`)
} else {
  console.log(`✓ all ${catalog.components.length} catalog tags have an agent file.`)
}
