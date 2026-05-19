#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const contextDir = join(__dirname, '..', 'context')

const components = JSON.parse(readFileSync(join(contextDir, 'components.json'), 'utf-8'))
const tokens = JSON.parse(readFileSync(join(contextDir, 'tokens.json'), 'utf-8'))
const patterns = JSON.parse(readFileSync(join(contextDir, 'patterns.json'), 'utf-8'))

const server = new McpServer({
  name: '@scale/design-system',
  version: '1.0.0',
})

server.tool('list-components', 'List all available Scale Design System components', {}, async () => {
  const list = components.components.map(c => ({
    tag: c.tag,
    category: c.category,
    description: c.description,
  }))
  return {
    content: [{ type: 'text', text: JSON.stringify(list, null, 2) }],
  }
})

server.tool('get-component', 'Get detailed information about a specific component including props, slots, events, and usage examples', {
  tag: { type: 'string', description: 'Component tag name (e.g., sc-button, sc-input)' },
}, async ({ tag }) => {
  const component = components.components.find(c => c.tag === tag)
  if (!component) {
    return {
      content: [{ type: 'text', text: `Component "${tag}" not found. Available components: ${components.components.map(c => c.tag).join(', ')}` }],
    }
  }
  return {
    content: [{ type: 'text', text: JSON.stringify(component, null, 2) }],
  }
})

server.tool('search-components', 'Find components by keyword in their description, category, or whenToUse field', {
  query: { type: 'string', description: 'Search query (e.g., "form", "button", "section")' },
}, async ({ query }) => {
  const q = query.toLowerCase()
  const results = components.components.filter(c =>
    c.tag.toLowerCase().includes(q) ||
    c.description.toLowerCase().includes(q) ||
    c.category.toLowerCase().includes(q) ||
    c.whenToUse.toLowerCase().includes(q)
  )
  if (results.length === 0) {
    return {
      content: [{ type: 'text', text: `No components found matching "${query}". Try: ${components.components.map(c => c.tag).slice(0, 5).join(', ')}` }],
    }
  }
  return {
    content: [{ type: 'text', text: JSON.stringify(results.map(c => ({ tag: c.tag, category: c.category, description: c.description, whenToUse: c.whenToUse })), null, 2) }],
  }
})

server.tool('get-tokens', 'Get design tokens (colors, spacing, typography, borders, shadows) in W3C DTCG format', {
  category: { type: 'string', description: 'Token category: color, spacing, typography, borderRadius, borderWidth, shadow, unit, breakpoint', optional: true },
}, async ({ category }) => {
  if (category && tokens[category]) {
    return {
      content: [{ type: 'text', text: JSON.stringify({ [category]: tokens[category] }, null, 2) }],
    }
  }
  if (category) {
    return {
      content: [{ type: 'text', text: `Category "${category}" not found. Available: ${Object.keys(tokens).join(', ')}` }],
    }
  }
  return {
    content: [{ type: 'text', text: JSON.stringify(tokens, null, 2) }],
  }
})

server.tool('get-patterns', 'List common component composition patterns with templates', {
  name: { type: 'string', description: 'Pattern name (e.g., "Hero Section", "Pricing Section")', optional: true },
}, async ({ name }) => {
  if (name) {
    const pattern = patterns.patterns.find(p => p.name.toLowerCase().includes(name.toLowerCase()))
    if (!pattern) {
      return {
        content: [{ type: 'text', text: `Pattern "${name}" not found. Available: ${patterns.patterns.map(p => p.name).join(', ')}` }],
      }
    }
    return {
      content: [{ type: 'text', text: JSON.stringify(pattern, null, 2) }],
    }
  }
  return {
    content: [{ type: 'text', text: JSON.stringify(patterns.patterns.map(p => ({ name: p.name, description: p.description, components: p.components })), null, 2) }],
  }
})

server.tool('get-component-example', 'Get a ready-to-use HTML example for a component', {
  tag: { type: 'string', description: 'Component tag name' },
}, async ({ tag }) => {
  const component = components.components.find(c => c.tag === tag)
  if (!component) {
    return {
      content: [{ type: 'text', text: `Component "${tag}" not found` }],
    }
  }
  return {
    content: [{ type: 'text', text: component.example }],
  }
})

server.tool('get-dependencies', 'Get the dependency tree for a component (which other components it uses internally)', {
  tag: { type: 'string', description: 'Component tag name' },
}, async ({ tag }) => {
  const component = components.components.find(c => c.tag === tag)
  if (!component) {
    return {
      content: [{ type: 'text', text: `Component "${tag}" not found` }],
    }
  }
  const deps = component.dependencies
  if (deps.length === 0) {
    return {
      content: [{ type: 'text', text: `${tag} has no internal dependencies` }],
    }
  }
  return {
    content: [{ type: 'text', text: `${tag} depends on: ${deps.join(', ')}` }],
  }
})

const transport = new StdioServerTransport()
await server.connect(transport)
