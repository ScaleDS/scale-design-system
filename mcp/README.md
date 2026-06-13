# Scale Design System MCP Server

An MCP (Model Context Protocol) server that gives AI coding agents direct access to the Scale design system — components, tokens, and patterns.

## What it does

Instead of guessing or searching the web, AI agents (Claude, Cursor, Codex, etc.) can query Scale directly for:

- **Component APIs** — props, slots, events, and usage examples
- **Design tokens** — colors, spacing, typography, borders, shadows
- **Composition patterns** — proven layouts with ready-to-use templates

## Quick start

### 1. Install

```bash
npm install @scale/design-system
```

### 2. Configure your AI client

**Claude Desktop** (`claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "scale": {
      "command": "npx",
      "args": ["@scale/design-system"]
    }
  }
}
```

**Cursor** (`.cursor/mcp.json`):
```json
{
  "mcpServers": {
    "scale": {
      "command": "npx",
      "args": ["@scale/design-system"]
    }
  }
}
```

**Claude Code** (`.mcp.json`):
```json
{
  "mcpServers": {
    "scale": {
      "command": "npx",
      "args": ["@scale/design-system"]
    }
  }
}
```

### 3. Use it

Once connected, ask your AI agent questions like:

| Prompt | What the agent does |
|--------|-------------------|
| "Add a button" | Calls `search-components("button")` → finds `sc-button`, gets props, generates correct HTML |
| "What color should I use for errors?" | Calls `get-tokens("color")` → returns `--sc-color-text-negative`, `--sc-color-border-negative` |
| "Build me a pricing section" | Calls `get-patterns("pricing")` → returns full template with `sc-section-pricing`, `sc-card-pricing`, `sc-row` |
| "Make this button destructive" | Calls `get-component("sc-button")` → finds `type="negative-primary"` |
| "What spacing between cards?" | Calls `get-tokens("spacing")` → returns `--sc-space-l` (16px), `--sc-space-xl` (24px) |

## Available tools

| Tool | Description | Parameters |
|------|-------------|------------|
| `list-components` | Lists all 62 components with category and description | _(none)_ |
| `get-component` | Full API for a specific component: props, slots, events, example, whenToUse | `tag` (e.g. `"sc-button"`) |
| `search-components` | Find components by keyword in description, category, or whenToUse | `query` (e.g. `"form"`) |
| `get-tokens` | Design tokens in W3C DTCG format | `category` (optional: `color`, `spacing`, `typography`, `borderRadius`, `borderWidth`, `shadow`, `unit`, `breakpoint`) |
| `get-patterns` | Common composition patterns with templates | `name` (optional, e.g. `"Hero Section"`) |
| `get-component-example` | Ready-to-use HTML for a component | `tag` (e.g. `"sc-button"`) |
| `get-dependencies` | Internal component dependencies | `tag` (e.g. `"sc-card-pricing"`) |

## Before vs after

**Without MCP** — AI guesses:
```html
<!-- AI generates generic HTML -->
<button class="btn-primary">Click</button>
```

**With MCP** — AI knows Scale:
```html
<!-- AI queries Scale, gets exact API -->
<sc-button type="primary" size="l" leading-icon="arrow-right">Click</sc-button>
```

## Architecture

The MCP server reads from `context/` files that ship with the package:

```
@scale/design-system/
├── context/
│   ├── components.json    ← Component catalog (props, slots, events, examples)
│   ├── tokens.json        ← W3C DTCG design tokens
│   └── patterns.json      ← Composition patterns with templates
└── mcp/
    └── src/index.ts       ← MCP server implementation
```

No network calls, no API keys — everything runs locally from the installed package.
