---
name: scale-review
description: Audit existing code for Scale Design System violations — raw HTML controls where an `sc-*` component exists, hardcoded colours/spacing/durations/fonts instead of `--sc-*` tokens, invalid enum prop values, missing imports, and unmet accessibility contracts. Use when the user asks to review, audit, lint, or check code in a project that depends on @scale-ds/scale-design-system, when they ask whether code follows the design system, or before shipping a change that touches UI.
---

# Reviewing code against Scale

This is an audit, not a rewrite. Find what is wrong, say so precisely, and fix
only what the user asks you to fix.

The point is that Scale violations are quiet. An invalid enum value renders the
default rather than throwing. A hardcoded hex looks right in whichever theme
you happened to be in. Nothing here fails at runtime, so nothing surfaces
without someone going looking.

## Scope

Establish what you are reviewing before you start: a diff, a directory, a
single file. If the user hasn't said, ask rather than guessing — auditing a
whole repo when they meant one component wastes both your time and theirs.

Confirm the project actually uses Scale (`@scale-ds/scale-design-system` in
`package.json`). If it doesn't, say so and stop.

## The five checks

Work through all five. Report per finding: file, line, what's wrong, what it
should be.

### 1. Raw controls where Scale has a component

```
grep -rnE '<(button|input|select|textarea|table|dialog|progress)\b' <scope>
```

Each hit is a finding unless it is inside a slot with no Scale equivalent, or a
native element a Scale component intentionally wraps. Name the replacement:
`<button>` → `sc-button`, `<input type="checkbox">` → `sc-checkbox`, a hand-rolled
`<table>` → `sc-table-basic` or `sc-table-dynamic`.

Use `search-components` or `list-components` when you are unsure whether a
component exists for something. Do not conclude "Scale has nothing for this"
from memory.

### 2. Hardcoded design values

```
grep -rnE '#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(' <scope>              # colour
grep -rnE '(margin|padding|gap|border-radius)[^;]*[0-9]+px' <scope>  # space & radius
grep -rnE 'transition[^;]*[0-9]+m?s|animation[^;]*[0-9]+m?s' <scope> # motion
grep -rnE 'font-(family|size|weight)\s*:' <scope>                    # type
```

Every hit should be a `var(--sc-*)`. Genuine exceptions are rare: `0`, `1px`
hairlines, `100%`/`auto`, and values inside a `@media` query's own condition.

Name the actual token, not "use a token" — look it up with `get-tokens` or the
foundation's guidance file. A finding the reader has to research themselves is
half a finding.

Hardcoded colour is the highest-severity item in this whole audit, because it
is the one that silently breaks dark mode.

### 3. Invalid enum prop values

For each `sc-*` element in scope, read its guidance file (`get-component-guidance`,
or `node_modules/@scale-ds/scale-design-system/context/agents/<tag>.md`) and check
every attribute against the `props` frontmatter.

This is the check that most needs doing mechanically rather than by eye.
`type="danger"`, `size="md"`, `status="error"` all look plausible and all
silently render the default.

### 4. Accessibility contract

Re-read the Accessibility section of each component's guidance file and confirm
the code honours it. Most commonly missed:

- an icon-only control with no accessible name
- a `disabled` control with no nearby explanation of why
- a modal or menu opened without moving focus into it
- a status colour used as the only signal, with no text or icon
- heading levels chosen by size rather than by document outline

### 5. Imports

Every `sc-*` tag used has a matching import, and the app imports
`@scale-ds/scale-design-system/scss/main` exactly once. A missing import is the
one failure here that is loud — the element renders as an unstyled unknown tag.

## Reporting

Order findings by severity: hardcoded colour and missing accessibility first,
then invalid props, then raw controls, then everything else.

Say what you checked, including what came back clean. A review that lists only
problems leaves the reader unable to tell thorough from lucky.

If you found nothing, say that plainly rather than inventing marginal findings
to look useful.
