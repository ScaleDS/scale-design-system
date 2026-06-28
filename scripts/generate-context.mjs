#!/usr/bin/env node
import { readFileSync, readdirSync, writeFileSync } from 'fs'
import { join } from 'path'

const componentsDir = join(process.cwd(), 'components')
const outputFile = join(process.cwd(), 'context', 'components.json')

const pkg = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8'))

const STRICT = process.argv.includes('--strict') || process.env.CI === 'true'

// Dev-only / internal custom elements that aren't part of the public catalog.
const EXCLUDE = new Set(['sc-edit-layer'])

const componentFiles = readdirSync(componentsDir)
  .filter(f => f.endsWith('.ts'))
  .filter(f => !EXCLUDE.has(f.replace(/\.ts$/, '')))
  .filter(f => {
    // Only files that actually register a custom element are components.
    const content = readFileSync(join(componentsDir, f), 'utf-8')
    return /@customElement\('sc-[^']+'\)/.test(content)
  })

const categoryMap = {
  'sc-accordion': 'navigation',
  'sc-alert': 'feedback',
  'sc-avatar': 'content',
  'sc-avatar-group': 'content',
  'sc-badge': 'feedback',
  'sc-banner': 'feedback',
  'sc-breadcrumbs': 'navigation',
  'sc-button': 'actions',
  'sc-button-icon': 'actions',
  'sc-button-pill': 'actions',
  'sc-card-image': 'content',
  'sc-card-pricing': 'content',
  'sc-checkbox': 'forms',
  'sc-checkbox-item': 'forms',
  'sc-divider': 'layout',
  'sc-footer': 'layout',
  'sc-header': 'layout',
  'sc-help-text': 'feedback',
  'sc-hero': 'sections',
  'sc-input': 'forms',
  'sc-logo': 'brand',
  'sc-menu-dropdown': 'navigation',
  'sc-menu-item': 'navigation',
  'sc-radio': 'forms',
  'sc-radio-item': 'forms',
  'sc-row': 'layout',
  'sc-section-bento': 'sections',
  'sc-section-content': 'sections',
  'sc-section-faq': 'sections',
  'sc-section-feature': 'sections',
  'sc-section-pricing': 'sections',
  'sc-section-signup': 'sections',
  'sc-status-icon': 'feedback',
  'sc-toggle': 'forms',
  'sc-button-group': 'actions',
  'sc-card': 'content',
  'sc-card-selector': 'forms',
  'sc-date-picker': 'forms',
  'sc-file-upload': 'forms',
  'sc-file-upload-item': 'forms',
  'sc-input-pin': 'forms',
  'sc-modal': 'feedback',
  'sc-page-controls': 'navigation',
  'sc-progress-bar': 'feedback',
  'sc-segmented-control': 'forms',
  'sc-signup': 'forms',
  'sc-slider': 'forms',
  'sc-spinner': 'feedback',
  'sc-status-indicator': 'feedback',
  'sc-tab': 'navigation',
  'sc-tab-panel': 'navigation',
  'sc-table-basic': 'data-display',
  'sc-table-cell': 'data-display',
  'sc-table-dynamic': 'data-display',
  'sc-table-footer': 'data-display',
  'sc-table-head': 'data-display',
  'sc-table-row': 'data-display',
  'sc-tabs': 'navigation',
  'sc-tag': 'content',
  'sc-text-area': 'forms',
  'sc-toast': 'feedback',
  'sc-tooltip': 'feedback',
}

const descriptions = {
  'sc-accordion': 'Vertically stacked sections that expand and collapse with progressive disclosure pattern',
  'sc-alert': 'Bordered alert card with status icon, heading, body text, and up to two action buttons',
  'sc-avatar': 'User avatar with image, initials, or icon fallback across 5 sizes',
  'sc-avatar-group': 'Grouped overlapping avatars with overflow count indicator',
  'sc-badge': 'Status indicators displayed inline with content or on top of another element',
  'sc-banner': 'Full-width inline banner with status icon, text, optional link, and dismiss control',
  'sc-breadcrumbs': 'Inline breadcrumb trail with chevron separators showing navigation hierarchy',
  'sc-button': 'Primary action element with 13 visual variants, 3 sizes, loading and disabled states',
  'sc-button-icon': 'Icon-only button without a label, used for secondary actions like search, theme toggle, close',
  'sc-button-pill': 'Button with fully rounded ends (pill shape), used for CTAs and navigation',
  'sc-card-image': 'Card surface with image area and content slots, supports default and fill layouts',
  'sc-card-pricing': 'Pricing plan card with header, feature rows, and action area',
  'sc-checkbox': 'Checkbox form control with label and form-association — emits change events',
  'sc-checkbox-item': 'Standalone checkbox visual primitive (square + tick) without a label or form binding',
  'sc-divider': 'Thin horizontal line separating content sections',
  'sc-footer': 'Site footer with brand logo, copyright text, and licence link',
  'sc-header': 'Fixed top navigation bar with logo, nav links, theme toggle, and CTA buttons',
  'sc-help-text': 'Small descriptive text near form fields with optional status icons',
  'sc-hero': 'Full-width hero section with background image, heading, subtitle, CTAs, and optional email form',
  'sc-input': 'Single-line text input field with label, icons, help text, and validation states',
  'sc-logo': 'Scale brand logo with mark and wordmark, supports sizes and inverse style',
  'sc-menu-dropdown': 'Elevated dropdown surface that hosts sc-menu-item children',
  'sc-menu-item': 'Menu row with leading/trailing icons, label, link or button behaviour, and selection states',
  'sc-radio': 'Radio form control with label and form-association — emits change events',
  'sc-radio-item': 'Standalone radio visual primitive (circle + dot) without a label or form binding',
  'sc-row': 'Horizontal list item with optional leading/trailing icons and a divider',
  'sc-section-bento': 'Bento grid section with 4 card slots in a Z-pattern layout',
  'sc-section-content': 'Simple content section with heading and subtext, centered or left-aligned',
  'sc-section-faq': 'FAQ section with heading on the left and accordion items on the right',
  'sc-section-feature': 'Feature section with text column and image column, supports reverse layout',
  'sc-section-pricing': 'Pricing section with heading and 3 pricing cards in a responsive grid',
  'sc-section-signup': 'Card-based signup section with heading, subtext, input, and action button',
  'sc-status-icon': 'Status indicator icon with info, warning, error, and success variants in 3 sizes',
  'sc-toggle': 'On/off switch toggle for settings and preferences',
  'sc-button-group': 'Container for grouped buttons with configurable orientation, gap, alignment, and optional single-select value',
  'sc-card': 'Lightweight surface container with configurable elevation, border radius, and padding tokens',
  'sc-card-selector': 'Selectable card with a checkbox or radio indicator that participates in form selection',
  'sc-date-picker': 'Calendar date picker supporting a single date or a range, with keyboard navigation and optional confirm actions',
  'sc-file-upload': 'Drag-and-drop upload zone with per-file progress, error states, and single or multiple file support',
  'sc-file-upload-item': 'A single file row showing name, size, progress bar, and status with a remove control',
  'sc-input-pin': 'Multi-digit code input with individual cells, keyboard navigation, paste support, and validation states',
  'sc-modal': 'Modal dialog built on the native dialog element with heading, body, and an optional actions footer',
  'sc-page-controls': 'Pagination dots with previous/next controls for moving between pages or slides',
  'sc-progress-bar': 'Horizontal progress bar with a 0–100% value and status colours (uploading, positive, negative)',
  'sc-segmented-control': 'Pill of 2–4 mutually-exclusive segments, optionally icon-only, with full keyboard support',
  'sc-signup': 'Inline email-capture form pairing a text input with a primary button, wrapping on narrow screens',
  'sc-slider': 'Continuous range input with a draggable thumb, keyboard support, and native form participation',
  'sc-spinner': 'Animated indeterminate loading indicator with 2 sizes and 4 colour variants',
  'sc-status-indicator': 'Small coloured status dot, decorative beside text or semantic with an accessible label',
  'sc-tab': 'A single tab within sc-tabs, with selection and focus managed by the parent',
  'sc-tab-panel': 'Content panel paired with a tab, shown or hidden by the parent sc-tabs',
  'sc-table-basic': 'Accessible table using CSS subgrid columns with sortable headers, row selection, and optional pagination',
  'sc-table-cell': 'Table body cell with optional leading/trailing icons, secondary text, link rendering, and a selection checkbox',
  'sc-table-dynamic': 'Data-driven table that builds rows and columns from column definitions and row-data arrays',
  'sc-table-footer': 'Table footer with previous/next pagination buttons and page indicator dots',
  'sc-table-head': 'Table header cell with an optional sort control and select-all checkbox',
  'sc-table-row': 'Table row container using CSS subgrid for column alignment, in body or header variants',
  'sc-tabs': 'Tabbed interface (WAI-ARIA APG pattern) managing tab selection, focus, and panel visibility',
  'sc-tag': 'Small chip for categories or filters, optionally selectable or removable, with an optional icon or avatar',
  'sc-text-area': 'Multi-line text field with label, help text, validation states, and configurable resize behaviour',
  'sc-toast': 'Fixed-position notification with an optional status icon, link, and auto-dismiss timer',
  'sc-tooltip': 'Popover shown on hover or focus that auto-flips when it would collide with the viewport edge',
}

const whenToUse = {
  'sc-accordion': 'FAQ sections, settings panels, content that should be hidden by default but accessible on demand',
  'sc-alert': 'Persistent inline alerts inside a panel or card — info/warning/negative/positive states with optional actions',
  'sc-avatar': 'User profile pictures, comment sections, user lists, team members, any place a user representation is needed',
  'sc-avatar-group': 'Team rosters, shared document viewers, multi-user presence indicators, collaborator lists',
  'sc-badge': 'Status labels, category tags, notification counts, feature flags',
  'sc-banner': 'Full-width page-level announcements, system status, marketing banners, dismissable notices',
  'sc-breadcrumbs': 'Navigation trails on deep pages, app hierarchy indication, location context',
  'sc-button': 'Primary user actions, form submissions, navigation triggers, any interactive CTA',
  'sc-button-icon': 'Toolbar actions, icon buttons where the icon is self-explanatory, space-constrained UIs',
  'sc-button-pill': 'Hero CTAs, pill-shaped navigation, floating action buttons, tag-like actions',
  'sc-card-image': 'Feature cards, blog post previews, product showcases, any content with image + text',
  'sc-card-pricing': 'Pricing pages, plan comparison, subscription tiers',
  'sc-checkbox': 'Form fields for multi-select options, terms acceptance, settings toggles that need a label and form binding',
  'sc-checkbox-item': 'Custom layouts that need the checkbox visual without label or form-association (e.g. cards, list items)',
  'sc-divider': 'Section separators, list item dividers, visual grouping boundaries',
  'sc-footer': 'Page footers, bottom of marketing sites, legal pages',
  'sc-header': 'Site-wide navigation, marketing site headers, app top bars',
  'sc-help-text': 'Form field hints, validation messages, input guidance, error/success feedback',
  'sc-hero': 'Landing page top section, product introductions, conversion-focused entry points',
  'sc-input': 'Form fields, search inputs, email capture, any single-line text entry',
  'sc-logo': 'Headers, footers, brand references, any place the Scale logo is needed',
  'sc-menu-dropdown': 'Floating menu surface for header nav menus, user menus, action menus — wraps sc-menu-item children',
  'sc-menu-item': 'Individual menu rows inside sc-menu-dropdown or standalone lists — supports row/button/link types',
  'sc-radio': 'Form fields for single-select choices that need a label and form binding',
  'sc-radio-item': 'Custom layouts that need the radio visual without label or form-association (e.g. cards, list items)',
  'sc-row': 'Pricing feature lists, settings rows, menu items, any horizontal label-value pair',
  'sc-section-bento': 'Feature showcases, product highlights, portfolio displays, visual grid layouts',
  'sc-section-content': 'Text-only sections, section headers, standalone content blocks',
  'sc-section-faq': 'FAQ pages, help sections, common questions about a product or feature',
  'sc-section-feature': 'Feature highlights, product walkthroughs, alternating text-image sections',
  'sc-section-pricing': 'Pricing pages, plan comparison sections, subscription tiers',
  'sc-section-signup': 'Email capture sections, newsletter signup, call-to-action blocks',
  'sc-status-icon': 'Validation feedback, status indicators, alert icons, help text icons',
  'sc-toggle': 'Settings toggles, feature flags, preference switches, enable/disable controls',
  'sc-button-group': 'Grouping related buttons, action toolbars, single-select button sets',
  'sc-card': 'Content containers, card layouts, grouping related content on a surface',
  'sc-card-selector': 'Card-based selection, plan or option pickers, form choices with rich visuals',
  'sc-date-picker': 'Date selection, date ranges, booking calendars, event scheduling',
  'sc-file-upload': 'File uploads, document collection, asset management, media uploads',
  'sc-file-upload-item': 'Showing uploaded or in-progress file rows inside a file upload',
  'sc-input-pin': 'One-time codes, PIN verification, multi-digit code entry, 2FA inputs',
  'sc-modal': 'Confirmations, critical decisions, focused interruptions, blocking actions',
  'sc-page-controls': 'Carousel pagination, slide navigation, step indicators, page dots',
  'sc-progress-bar': 'File uploads, loading states, operation progress, completion tracking',
  'sc-segmented-control': 'Filter toggles, view-mode switches, binary or ternary choices',
  'sc-signup': 'Newsletter signup, lead capture, email list collection, simple mailing forms',
  'sc-slider': 'Continuous value selection, volume and range controls, numeric adjustment',
  'sc-spinner': 'Loading states, in-progress indicators, async feedback, busy states',
  'sc-status-indicator': 'Status dots, connection or presence indicators, state visualization',
  'sc-tab': 'Individual tabs inside an sc-tabs tabbed interface',
  'sc-tab-panel': 'Tab content panels inside an sc-tabs tabbed interface',
  'sc-table-basic': 'Structured data, records, sortable columns, paginated datasets',
  'sc-table-cell': 'Rendering cell content within table rows',
  'sc-table-dynamic': 'Tabular data from arrays or objects, avoiding hand-written table markup',
  'sc-table-footer': 'Paginated table navigation, page selection in data tables',
  'sc-table-head': 'Sortable column headers, header cells for data tables',
  'sc-table-row': 'Individual table rows and header rows in data tables',
  'sc-tabs': 'Tabbed content, multi-view interfaces, organized content sections',
  'sc-tag': 'Tags, filter chips, category labels, dismissible tokens',
  'sc-text-area': 'Long-form text entry, comments, descriptions, message and feedback fields',
  'sc-toast': 'Temporary notifications, success or error messages, action confirmations',
  'sc-tooltip': 'Help text, icon descriptions, supplementary hints, form field guidance',
}

function parseComponent(filePath) {
  const content = readFileSync(filePath, 'utf-8')
  const fileName = filePath.split('/').pop().replace('.ts', '')

  const tagMatch = content.match(/@customElement\('([^']+)'\)/)
  const classMatch = content.match(/export class (\w+) extends LitElement/)
  const tagName = tagMatch ? tagMatch[1] : `sc-${fileName.replace('sc-', '')}`
  const className = classMatch ? classMatch[1] : ''

  const props = {}
  const propRegex = /@property\(\{([^}]*)\}\)\s*(?:private\s+)?(\w+)(?::\s*([^=\n]+))?\s*=\s*([^;\n]+)/g
  let match
  while ((match = propRegex.exec(content)) !== null) {
    const attrs = match[1]
    const name = match[2]
    const typeStr = match[3] || ''
    const defaultVal = match[4].trim()

    let type = typeStr.replace(/\n/g, '').trim() || 'string'
    if (attrs.includes('type: Boolean')) type = 'boolean'
    if (attrs.includes('type: Number')) type = 'number'
    if (attrs.includes('type: Array')) type = 'array'

    const isReflect = attrs.includes('reflect: true')
    const attributeName = attrs.match(/attribute:\s*'([^']+)'/)?.[1] || name

    props[name] = {
      type,
      default: defaultVal === 'false' ? false : defaultVal === 'true' ? true : defaultVal.replace(/^['"]|['"]$/g, ''),
      attribute: attributeName,
      reflect: isReflect,
    }
  }

  const slots = []
  const slotRegex = /<slot(?:\s+name="([^"]*)")?/g
  let slotMatch
  while ((slotMatch = slotRegex.exec(content)) !== null) {
    const name = slotMatch[1] || 'default'
    if (!slots.includes(name)) slots.push(name)
  }

  const events = []
  const eventRegex = /new CustomEvent\('([^']+)'/g
  let eventMatch
  while ((eventMatch = eventRegex.exec(content)) !== null) {
    events.push(eventMatch[1])
  }

  const deps = []
  const escapedName = pkg.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const importRegex = new RegExp(
    `import[^'"]*['"](?:${escapedName}/components/|\\./)(sc-[^'"]+)['"]`,
    'g',
  )
  let importMatch
  while ((importMatch = importRegex.exec(content)) !== null) {
    const dep = importMatch[1].replace(/\.js$/, '')
    if (dep !== tagName && !deps.includes(dep)) deps.push(dep)
  }

  const cssParts = []
  const partRegex = /part="([^"]+)"/g
  let partMatch
  while ((partMatch = partRegex.exec(content)) !== null) {
    cssParts.push(partMatch[1])
  }

  return {
    tag: tagName,
    class: className,
    category: categoryMap[tagName] || 'unknown',
    description: descriptions[tagName] || '',
    whenToUse: whenToUse[tagName] || '',
    props,
    slots: slots.map(s => s === 'default' ? 'default - Content' : `${s} - Named slot`),
    events: events.map(e => ({ name: e, detail: '{}' })),
    cssParts: cssParts.map(p => ({ name: p, description: '' })),
    dependencies: deps,
    example: `<${tagName}></${tagName}>`,
  }
}

const components = componentFiles.map(f => parseComponent(join(componentsDir, f)))
const componentTags = new Set(components.map(c => c.tag))
for (const c of components) c.dependencies = c.dependencies.filter(d => componentTags.has(d))

const output = {
  name: pkg.name,
  version: pkg.version,
  framework: 'lit',
  description: pkg.description,
  components,
}

writeFileSync(outputFile, JSON.stringify(output, null, 2), 'utf-8')
console.log(`Generated ${components.length} components → ${outputFile}`)

// Surface components missing hand-authored metadata.
const uncovered = components
  .map(c => {
    const missing = []
    if (!categoryMap[c.tag]) missing.push('category')
    if (!descriptions[c.tag]) missing.push('description')
    if (!whenToUse[c.tag]) missing.push('whenToUse')
    return missing.length ? { tag: c.tag, missing } : null
  })
  .filter(Boolean)

if (uncovered.length) {
  const lines = uncovered.map(u => `  - ${u.tag} (missing: ${u.missing.join(', ')})`)
  const msg =
    `\n${uncovered.length} of ${components.length} components are missing hand-authored metadata ` +
    `in scripts/generate-context.mjs (categoryMap / descriptions / whenToUse):\n${lines.join('\n')}\n` +
    `These ship as category:"unknown" with empty description/whenToUse, degrading the ` +
    `machine-readable context. Add them to the maps above.`
  if (STRICT) {
    console.error(`\n✖ generate-context (strict):${msg}`)
    process.exit(1)
  }
  console.warn(`\n⚠ generate-context:${msg}`)
} else {
  console.log('✓ All components have category, description, and whenToUse metadata.')
}
