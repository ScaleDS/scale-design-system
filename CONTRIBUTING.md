# Contributing to Scale

Thanks for your interest in improving Scale. This guide explains what kinds of
contributions we can accept, how the three Scale products stay in sync, and the
mechanics of getting a change merged.

## Code of conduct

Be civil, be polite, be constructive — in issues, PRs, reviews, everywhere.
This project has a **zero-tolerance** policy on abusive behaviour: violations
mean an immediate ban, no warnings. See the
[Code of Conduct](CODE_OF_CONDUCT.md).

## How Scale is structured (read this first)

Scale is one design system shipped as three products on a shared foundation of
tokens, components, and patterns:

- **Lit web components** (this repo) — open source, MIT.
- **Figma library** — commercial, maintained by the Scale team, mapped 1:1 to
  the code via Figma variables and variants.
- **Framer system** — commercial, maintained by the Scale team.

**Code is the source of truth.** Component APIs, design tokens, and behaviour
are defined here; the Figma and Framer versions mirror them. Because every
change to that shared surface must be rebuilt by hand in two other products,
the fundamentals of the system — tokens, component APIs, visual design — are
**maintainer-led**: ideas are welcome, but changes to them start as issues,
not PRs, and the maintainers make the final call on shape and timing.

### What this means for your contribution

| Change type | Examples | Process |
|---|---|---|
| **No design impact** | Bug fixes, accessibility, performance, build/packaging, docs, types, tests | **Open a PR directly** — these are the contributions we're after. |
| **Design tokens / variables** | Adding, renaming, or retuning a token; changing scales or theme values | **Issue first, honest odds: low.** The token set is the contract binding all three products and maps 1:1 to Figma variables, so it changes on the Scale team's design cycle. A well-argued issue can influence that cycle; a token value that's plainly wrong is a bug report. |
| **Component props / API** | New props, slots, events; renames; removals; changed defaults | **Issue first.** Props map to Figma variant properties and Framer property controls, so API shape is a cross-product decision. Describe the *problem* you're solving; if the maintainers agree the API should grow, they'll agree the design with you and you're welcome to build it. |
| **Visual changes** | Spacing, colour, typography tweaks | **Issue first** — same parity cost. Exception: a rendering *bug* (something that clearly doesn't match the component's intended design or its Figma counterpart) is a bug fix; open a PR with before/after screenshots. |
| **New components** | Anything adding an `sc-*` element | **Proposal issue first** — see below. |

Issue-first protects your time: a PR that changes tokens or component APIs
without prior agreement will usually be closed, however good the code is,
because merging it would put the code ahead of the Figma and Framer libraries
with no one signed up to close the gap. With an agreed issue behind it, the
same PR lands smoothly. (And if you need Scale to be *fundamentally*
different, that's not a contribution — see [Forking](#forking).)

### Proposing a new component

New components are added sparingly — each one is built three times (Lit,
Figma, Framer) and maintained forever. If you think the catalog has a gap,
open an issue describing:

1. **The use case** — what real UI problem it solves that existing components
   (see `context/components.json` for the full catalog) don't, including why
   composition of existing components isn't enough.
2. **A sketch of the API** — tag name, props with their value sets, slots.
   Treat this as input rather than a spec: the maintainers shape the final API
   so it fits Figma variants and Framer property controls.

The bar is that the component earns its place in all three products, so some
pitches will be a "not now". If it's accepted, you're welcome to build it
against the agreed design, or the maintainers may take it on themselves.

### Versioning and parity

The npm package's semver is canonical. The Figma and Framer libraries track the
package's **major.minor** — a released `4.2.x` code line corresponds to a `4.2`
Figma/Framer library. Breaking changes to any published component API or token
are a major bump across all three products, which is why those surfaces stay
maintainer-led.

## Development setup

```bash
git clone https://github.com/ScaleDS/scale-design-system.git
cd scale-design-system
npm install         # also runs the TypeScript build via `prepare`
npm run build:watch # rebuild on change
npm run lint        # ESLint
```

Components live in `components/` (one file per `sc-*` element, importing
registers the custom element), design tokens in `scss/`, and the
machine-readable agent context in `context/`.

To exercise components in a real page, the easiest harness is the starter app:

```bash
npx degit ScaleDS/scale-design-system/examples/starter my-sandbox
```

then point its dependency at your local checkout (e.g. `npm link` or a `file:`
dependency).

## Coding standards

These conventions are what keep 60+ components behaving as one system — match
the existing code exactly rather than importing habits from elsewhere.

- **One element per file.** `components/sc-<name>.ts` defines and registers
  exactly one `@customElement('sc-<name>')` Lit element; importing the file is
  what registers it. Shared helpers (`feather.ts` icons, `reset.ts`,
  `button-variants.ts`, `kinds/`) live alongside — reuse them instead of
  duplicating.
- **Strict TypeScript, closed prop types.** The repo compiles with
  `strict: true`. Variant-style props are string-literal unions
  (`type BadgeStatus = 'default' | 'info' | …`), never open `string`s — those
  unions become the documented value sets in `context/components.json` and the
  variant values in Figma, so an unenumerable prop can't exist in the system.
- **Reflect what styles.** Props that drive appearance use
  `@property({ reflect: true })` and are styled via `:host([prop='value'])`
  selectors in `static styles` — no class-swapping in render logic for
  variants.
- **Shadow DOM + shared primitives.** Styles live in `static styles`.
  Typography comes from the shared mixins
  (`import { textS } from '…/scss/typography'`), icons from `feather.ts`, and
  every colour, space, radius, border, and shadow from a `--sc-*` custom
  property. A raw hex value or `px` magic number in component styles is a
  review blocker.
- **Events are plain `CustomEvent`s** with simple lowercase names (`change`),
  matching native semantics where one exists, so listeners and the context
  generator can rely on them.
- **No new runtime dependencies.** Lit is the runtime; treat adding a
  dependency as an architectural change that needs an issue first.
- **Lint is the floor.** `npm run lint` runs ESLint with the `lit` and `wc`
  recommended rule sets plus TypeScript rules; PRs must pass clean.
- **Verify in a real page.** There's no unit-test suite in this repo yet —
  exercise your change in the starter app (or the docs site) in both themes,
  and say in the PR what you checked.

## Rules for every PR

- **Regenerate the context.** If you add a component or change any prop, slot,
  event, or CSS part, run `npm run generate:context` and commit the updated
  `context/` files. Publishing runs the generator in `--strict` mode, so a
  stale `components.json` fails the release.
- **Keep `main` green.** Downstream consumers (including the Scale docs site)
  install this package from the `main` branch as a git dependency, and the
  `prepare` script builds on install. Every commit on `main` must compile —
  don't merge anything that doesn't pass `npm run build` and `npm run lint`.
- **Use Conventional Commits.** `feat(button): …`, `fix(material): …`,
  `docs(readme): …`, `chore: …` — scoped to the component or area touched.
  Release automation reads these to derive versions and changelogs.
- **One concern per PR.** Small, focused PRs review and land faster. Stacked
  PRs are welcome for larger efforts — note the ordering in each description.
- **Show visual changes.** Any PR that alters rendering needs before/after
  screenshots in **both light and dark themes**.
- **Meet the accessibility bar.** Interactive components must be fully
  keyboard-operable, use the shared focus-ring treatment, carry correct
  ARIA/roles, and (for inputs) participate in native `<form>` submission via
  form association, matching the existing form controls.

## After your PR merges

Maintainers handle the downstream work: syncing the Figma and Framer libraries,
cutting releases, and updating the docs site. Contributors are credited in the
[README](README.md#contributors) — significant contributions get a line
describing what you built.

## Forking

If you need Scale to be fundamentally different — your own token scale, your
own component APIs — forking is the right move, and the MIT licence fully
permits it: use, modify, and redistribute the code freely, commercially or
otherwise. Before you fork, though, check whether **theming** already gets you
there: every visual property resolves through CSS custom properties, and
retheming the brand scale covers most "we want it to look like us" needs
without giving up updates.

A few ground rules for **public** forks:

- **Rename it.** The MIT licence covers the code, not the Scale name, logo, or
  the scaledesignsystem.com brand. A public fork must not present itself as
  Scale or imply endorsement by, or parity with, the Scale products.
- **Re-prefix it.** Change the `sc-*` element prefix and `--sc-` token
  namespace. This is a technical requirement as much as a courtesy: custom
  elements share one global registry, so a forked `sc-button` and the real one
  can't coexist on a page, and keeping the prefix breaks interop for everyone
  downstream.
- **No Figma/Framer claims.** The Figma library and Framer system are
  separately licensed commercial products. A fork of this repo conveys no
  rights to redistribute them and must not claim compatibility or parity with
  them — parity is exactly what the maintained line provides and a fork gives
  up.

**Private and internal forks** need none of the above. Vendoring Scale into
your organisation and customising it internally is a normal, welcome use of
the licence — though if your customisation is really a bug fix, we'd love it
upstream.

## Questions

Not sure which bucket your idea falls into? Assume it needs an issue and ask —
a two-minute question beats a closed PR.
