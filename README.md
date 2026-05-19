# Scale Design System

A Lit-based agentic design system with machine-readable context for AI and human developers.

## Installation

```bash
npm install @scale/design-system
```

## Quick Start

```html
<!DOCTYPE html>
<html data-theme="light">
<head>
  <script type="module">
    import '@scale/design-system/components/sc-button.js'
    import '@scale/design-system/components/sc-input.js'
  </script>
</head>
<body>
  <sc-button type="primary" size="l">Get Started</sc-button>
</body>
</html>
```

## Components

23 Lit web components across 7 categories:

| Category | Components |
|----------|-----------|
| Actions | `sc-button`, `sc-button-icon`, `sc-button-pill` |
| Forms | `sc-input`, `sc-toggle` |
| Feedback | `sc-badge`, `sc-help-text`, `sc-status-icon` |
| Content | `sc-card-image`, `sc-card-pricing` |
| Layout | `sc-divider`, `sc-footer`, `sc-header`, `sc-logo`, `sc-row` |
| Navigation | `sc-accordion` |
| Sections | `sc-hero`, `sc-section-bento`, `sc-section-content`, `sc-section-faq`, `sc-section-feature`, `sc-section-pricing`, `sc-section-signup` |

## Design Tokens

All components use CSS custom properties for theming:

```css
:root {
  --sc-color-brand-500: #3355ff;
  --sc-space-l: 16px;
  --sc-border-radius-m: 12px;
}
```

Import the full SCSS token set:

```scss
@use '@scale/design-system/scss/main.scss';
```

## AI Agent Integration

Scale ships with machine-readable context for AI agents:

### `context/components.json`
Full component catalog with props, slots, events, and usage examples.

### `context/tokens.json`
W3C DTCG format design tokens for colors, spacing, typography, borders, and shadows.

### `context/patterns.json`
Common composition patterns with ready-to-use templates.

### `context/AGENTS.md`
Agent instructions and rules for using the design system correctly.

### MCP Server
For IDE integration (Cursor, Claude Code, etc.):

```bash
cd mcp
npm install
npm run build
```

Configure in your MCP client:
```json
{
  "mcpServers": {
    "scale-design-system": {
      "command": "npx",
      "args": ["@scale/design-system-mcp"]
    }
  }
}
```

## Development

```bash
npm run build          # Compile TypeScript
npm run build:watch    # Watch mode
npm run generate:context  # Regenerate components.json from source
```

## Publishing

```bash
npm version patch
npm publish --access public
```

## License

MIT
