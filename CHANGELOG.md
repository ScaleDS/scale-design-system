# Changelog

All notable changes to Scale are documented here. This file is the canonical
changelog from 4.0.0 onwards — the Lit package's semver is the system's
version, and the Figma and Framer counterparts track it at major.minor.

Design-history for releases before 4.0 (the Figma-only 1.0–3.2 line) lives on
the [site changelog](https://scaledesignsystem.com/get-started/changelog/).

## [4.2.0](https://github.com/ScaleDS/scale-design-system/compare/v4.1.0...v4.2.0) (2026-08-29)


### Features

* **eval:** add a lookup condition, and record the result ([d9623dd](https://github.com/ScaleDS/scale-design-system/commit/d9623dd00992c8aebd73a88e845fa0ed62b56324))
* **plugin:** ship scale-build, scale-review and scale-migrate ([248ff76](https://github.com/ScaleDS/scale-design-system/commit/248ff7659975fb8a9c163d3ab8f06c65ed75e545))


### Bug Fixes

* **ci:** bump the catalog version with the package version ([d99e8ea](https://github.com/ScaleDS/scale-design-system/commit/d99e8eac31da8d3976233d9fa4385ab97c48dfe0))
* **eval:** don't report a delta when requests failed ([cac6374](https://github.com/ScaleDS/scale-design-system/commit/cac6374959ddf55f7e0406fc06f6be7cb5e282fd))
* **eval:** isolate the CLI runs from the machine's MCP config ([8c8a738](https://github.com/ScaleDS/scale-design-system/commit/8c8a738871d29edb5dcc4b52f3d1b2a8c2e5f66e))
* **plugin:** add the marketplace manifest, without which it cannot be installed ([e73df89](https://github.com/ScaleDS/scale-design-system/commit/e73df894120b43f8882fdbf7c4ab8ad463a09ef4))

### Agent tooling (4.2)

The bulk of this release landed as `chore:` commits and so is absent from the
generated sections above. It is the substance of 4.2:

New:

- 70 per-component and per-foundation guidance files in `context/agents/`,
  generated from `guidance/` rather than written by hand, so an agent file
  cannot drift from the page a person reads
- Claude Code plugin bundling the MCP server with three skills: `scale-build`,
  `scale-review`, `scale-migrate`
- `get-component-guidance` on the MCP server, roughly a thousand tokens for one
  component against twenty-six thousand for the whole catalog
- `guidance/` ships in the package, so the docs site and any consumer read the
  same authored source
- Published on the site at `<page-url>agent.md`, indexed by `/llms.txt`, with
  the catalog at `/context/*.json`

Updated:

- `components.json` now resolves union types to their accepted values, recovers
  81 props the generator was silently dropping (`href`, `target` and `rel` on
  `sc-button` among them), de-duplicates CSS parts, and adds per-component CSS
  custom properties and derived accessibility data
- The site's Properties tables show accepted values instead of TypeScript type
  names, and gained a CSS Properties table for the eleven components that
  expose one
- Typography foundation gained an accessibility section
- `npm run check:agents` fails the build when a guidance file goes stale, and
  the repo gained its first CI workflow beyond release automation

Measured effect on agent output, 30 prompts graded for hardcoded values, raw
HTML where a component exists, hallucinated tags and invalid prop values:
37% clean with no guidance, 57% with the rules and catalog, 93% with lookup.
Findings fell from 161 to 3. Treat it as a large effect with an imprecise
magnitude; repeat runs move by several points.

## [4.1.0](https://github.com/ScaleDS/scale-design-system/compare/v4.0.0...v4.1.0) (2026-08-16)


### Features

* **motion:** choreographed motion system ([cf3a471](https://github.com/ScaleDS/scale-design-system/commit/cf3a4713373d31e5b367e3c302e88878ce8dd109))


### Bug Fixes

* **hero:** reduce mobile hero height to 88vh ([dcfc28d](https://github.com/ScaleDS/scale-design-system/commit/dcfc28dce7f24d23a0fe46ec2768ada2a8edc00c))
* **mcp:** advertise motion in get-tokens ([1e7c3e1](https://github.com/ScaleDS/scale-design-system/commit/1e7c3e1627318156ff062b17e85ac59bc9e4d554))
* **mcp:** report real package version; chore(starter): depend on ^4.0.0 ([739628e](https://github.com/ScaleDS/scale-design-system/commit/739628e06f47fe81d63f498aefff161d8211524e))

### Figma counterpart (4.1)

New:

- Motion variables, split across two collections: `Motion: Duration`, with
  `Standard` and `Reduced` modes, and `Motion: Easing`
- Code syntax on all 13 durations, mapping each to its `--sc-motion-duration-*`
  token, so a duration picked in Figma names the CSS variable to use in code
- Motion — Choreography page, documenting the choreography patterns as live
  animated demos

Updated:

- The demo labelled "Shared axis" was in fact a push transition. It is now named
  Push, with a faithful shared-axis demo alongside it
- Reduced motion collapses every product duration to 0, except the looping 1000
  and 5000, which keep their timing: a 0ms loop removes the loading affordance
  rather than calming it

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
