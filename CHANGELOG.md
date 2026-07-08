# Changelog

All notable changes to Scale are documented here. This file is the canonical
changelog from 4.0.0 onwards — the Lit package's semver is the system's
version, and the Figma and Framer counterparts track it at major.minor.

Design-history for releases before 4.0 (the Figma-only 1.0–3.2 line) lives on
the [site changelog](https://scaledesignsystem.com/get-started/changelog/).

## 4.0.0 — 2026-07-08

Scale goes multi-platform. Until now Scale was a Figma + Framer design system;
4.0.0 adds this open-source **Lit web components** implementation with
agent-ready context, making it a design system you can design with *and* ship
with.

### Added

- **Lit web components version of Scale** — 62 components plus the full
  foundations token set, MIT-licensed, published to npm as
  `@scale-ds/scale-design-system`
- **Agentic layer** — machine-readable component catalog
  (`context/components.json`, `context/tokens.json`) and a bundled MCP server
  (`npx @scale-ds/scale-design-system`) so AI coding agents can discover,
  understand and correctly use Scale components
- **Bundled Inter typeface** — importing the tokens gives the typeface with
  zero consumer setup
- **Scale Edit** — opt-in dev overlay for capturing token-aware visual edits
  and comments on a running site, applied to source by your agent
- **Material surfaces** — composable `sc-material-*` / `sc-material-tint-*`
  classes
- **Starter template** — Vite + TypeScript scaffold via
  `npx degit ScaleDS/scale-design-system/examples/starter`
- **Guidelines site** — [scaledesignsystem.com](https://scaledesignsystem.com)
  documents Foundations, Components and Sections with live examples, a Quick
  Start and a Scale Edit guide

### Figma counterpart (4.0)

New:

- Specs on every component — the conversion source of truth for the Lit build
- Segmented Controller component for Web, and a fix for the App one

Updated:

- Card Selector: hover-state border colour corrected — only the selected state
  changes to blue
- Background Selected: light blue → light grey
- Materials: "Ultathin" → "Ultrathin" typo fix; Chrome and Thick value swap in
  light mode
