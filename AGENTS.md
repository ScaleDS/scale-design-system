# Scale Design System — agent instructions

This file is for agents **working on** this repo. `context/AGENTS.md` is a different
document: it ships to consumers and describes how to *use* Scale in their projects.
Don't confuse the two, and don't merge them.

**Read [CONTRIBUTING.md](CONTRIBUTING.md) before writing any component code.** It carries the
coding standards (one element per file, closed string-literal unions for variant props,
`reflect` what styles, no raw hex or magic `px`, no new runtime dependencies) and the rules
for every PR. This file covers only what that document doesn't: the repo's mechanics, the
non-obvious traps, and how a change reaches the outside world.

## What this repo is

Lit web components plus SCSS design tokens, MIT licensed, published to npm as
`@scale-ds/scale-design-system`. It has two consumers with different expectations:

- **npm consumers** install a published version.
- **The docs site** (`../scale-docs`) installs this repo's **`main` branch directly** as a git
  dependency, and its CI runs `prepare` (the build) on install.

That second one drives most of the rules below.

## Repo map

| Path | What |
|---|---|
| `components/` | One `sc-*` element per file. 63 elements, 62 of them public — `sc-edit-layer` is Scale Edit tooling and is deliberately kept out of the catalog |
| `components/*.ts` (no element) | Shared helpers: `feather.ts`, `reset.ts`, `button-variants.ts`, `sc-focus-ring.ts`, `theme-controller.ts`, `sc-motion.ts`. Reuse, don't duplicate |
| `scss/` | Token variables and mixins. `main.scss` is the global entry |
| `context/` | The AI layer: `AGENTS.md`, `components.json`, `tokens.json`, `patterns.json`. **Ships in the npm tarball** |
| `mcp/` | Bundled MCP server, `src/index.ts` → `dist/` |
| `scripts/` | `generate-context.mjs`, `build-motion-tokens.mjs`, `check-motion-drift.mjs` |
| `examples/starter` | The `degit` target from the README |
| `dist/`, `mcp/dist/` | Build output, gitignored. Never edit by hand |

## Commands

```bash
npm run build             # tsc && tsc -p mcp
npm run lint              # eslint, with the lit + wc rule sets. Must pass clean
npm run generate:context  # regenerate context/components.json from source
npm run check:motion      # guard the keyframe mirror and the generated motion tokens
```

`prepare` runs the build on install, which is what lets a `git+…#main` install resolve
`components/*.js` with no manual build step. `prepublishOnly` runs build, `check:motion`, and
the context generator in `--strict` mode, so a stale `components.json` fails the release.

There is no unit-test suite here yet. The Playwright suite lives in `../scale-docs/site/tests/`
and runs against the docs guidelines pages; motion has dedicated coverage there in
`motion.spec.ts`. Exercise changes in a real page, in both themes.

## After changing a component

1. `npm run generate:context` and commit the updated `context/` files. This is not optional —
   `components.json` is what the MCP server, the docs API tables, and every consuming agent
   read.
2. If the docs site needs the change, copy `context/components.json` into
   `../scale-docs/context/`. The two are kept byte-identical.

## Motion

Four tiers, each built on the one below: variables (durations, easings) → transitions (named
composites) → mixins → choreography. Choreography stays out of `main.scss`, so consumers opt
into multi-element motion when they want it.

Two pieces are generated, which is what keeps them trustworthy:

- **Keyframes live in both `scss/sc-motion-transitions.scss` and `components/sc-motion.ts`**,
  since `@keyframes` don't cross a shadow boundary while custom properties do. Edit both, and
  `npm run check:motion` confirms they agree.
- **The `motion` group in `context/tokens.json`** is built from the SCSS by
  `scripts/build-motion-tokens.mjs`, so regenerate it rather than typing values in.

`prefers-reduced-motion` zeroes every duration except the ambient loops, so a spinner keeps
spinning.

## `main` must always be green

The docs site installs this branch and builds it on install, so **every commit on `main` must
compile**. `npm run build` and `npm run lint` both passing is the floor for merging.

The corollary: anything the docs site references must be pushed here **before, or with**, the
docs change that uses it. DS first, docs second, every time.

## Releases are decided by your commit message

[release-please](https://github.com/googleapis/release-please) watches conventional commits on
`main` and maintains a standing release PR that bumps `package.json` and `CHANGELOG.md`.

| Prefix | Result |
|---|---|
| `fix:` | patch |
| `feat:` | minor |
| `feat!:` / `BREAKING CHANGE:` | major |
| `docs:`, `chore:`, `ci:` | **no release at all** |

So the version is a consequence of how you word the commit. A release that should be a minor
needs a `feat:` commit; there is no manual version bump to fall back on.

Merging the release PR tags the release and the workflow publishes to npm via trusted
publishing (OIDC, no token in CI). That publish depends on a one-time setup on npmjs.com
(package → Settings → Trusted publisher → GitHub Actions / `ScaleDS/scale-design-system` /
`release-please.yml`) which **is not currently configured** — until it is, release PRs tag
correctly but `npm publish` fails.

## Don't

- **Don't edit `dist/` or `mcp/dist/`.** Generated on build.
- **Don't hand-edit the `motion` group in `tokens.json`.** Regenerate it.
- **Don't put research or scratch notes in `context/`.** The whole directory ships to every
  npm consumer. Prose research belongs in `../scale-docs/site-md/`.
- **Don't add a runtime dependency** without an issue first. Lit is the runtime.
- **Don't change design fundamentals unilaterally** — tokens, component APIs, and visual design
  are maintainer-led and start as issues, so the Figma and Framer versions stay in lockstep.
  See CONTRIBUTING.md.
