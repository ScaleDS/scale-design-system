---
name: scale-migrate
description: Convert existing UI to the Scale Design System — Tailwind utility classes, plain HTML/CSS, Bootstrap, MUI, or another component library into `sc-*` components and `--sc-*` tokens. Use when the user asks to migrate, port, convert, or adopt Scale in code that currently uses something else, or asks what it would take to move a page or component over.
---

# Migrating to Scale

Migration goes wrong in one of two directions: a mechanical find-and-replace
that produces markup nobody would have written, or a rewrite that quietly
changes behaviour while claiming to be a port. Avoid both by working component
by component and checking each one renders the same thing.

Read `scale-build` first if you have not — everything it says about looking up
guidance before using a component applies here, and applies more, because you
are working from an existing design rather than a blank page.

## Before you start

Agree the scope and the order with the user. Migrations are best done in
reviewable pieces: one page, one section, one component family. Say which piece
you are doing.

Establish what the source is using. `package.json` plus a look at the markup
will tell you: Tailwind classes, a component library, bare CSS, or a mix. The
mix is the common case.

Install Scale if it isn't there:

```
npm install @scale-ds/scale-design-system
```

```scss
@use '@scale-ds/scale-design-system/scss/main';  // once, per app
```

## The order that works

### 1. Inventory first, convert second

List every distinct control and surface in the scope before changing anything.
Map each to a Scale component, or mark it unmapped. Show the user the mapping
and the unmapped list before you start editing.

This is worth the step because the unmapped items are the whole risk. A
migration that is 90% mechanical and 10% "there is no Scale equivalent for
this" needs a decision on that 10% from the user, not an improvisation from
you.

### 2. Structure before style

Replace the elements first, leaving layout CSS alone. `<button class="px-4 py-2
bg-blue-600 rounded">` becomes `<sc-button type="primary">` — the padding,
colour and radius all come with it, so delete those utilities rather than
translating them.

Resist the urge to keep the original classes "just in case". Utilities left on
a Scale component fight its own styling and produce bugs that look like Scale
bugs.

### 3. Translate what is left into tokens

Only the layout and spacing that genuinely belongs to your page survives step 2.
Convert it:

| Source | Scale |
|---|---|
| `p-4`, `padding: 16px` | `var(--sc-space-m)` |
| `text-gray-600`, `#6b7280` | a `--sc-color-text-*` token |
| `rounded-lg`, `border-radius: 8px` | a `--sc-border-radius-*` token |
| `shadow-md` | a `--sc-shadow-*` token |
| `transition-all duration-200` | a `--sc-motion-transition-*` composite |

Never map by eyeballing the pixel value alone. Read the foundation's guidance
file (`spacing`, `color`, `elevation`, `motion`) and pick by role — the token
that means "space between related items", not the one that happens to be 16px.

### 4. Theming

This is where migrations most often end up half-done. A source design usually
has one theme baked in as literal colours; Scale's semantic tokens carry both.

After converting, check the result in dark mode explicitly. Any colour that
only reads correctly in one theme is a leftover literal that step 3 missed.

### 5. Verify each piece

Run `scale-build`'s `references/checks.md` over everything you touched, then
compare against the original rendering. State any deliberate visual differences
— a migration that silently changes spacing because a token was close enough is
a migration the user cannot trust.

## Reporting

For each piece: what was converted, what was left unmapped and why, and any
visual difference from the original. Unmapped items are design system gaps
worth collecting and reporting as a list at the end — they are the most useful
output of a migration after the code itself.
