# Pre-completion checks

Run these over every file you touched.

## 1. No raw controls where Scale has a component

```
grep -nE '<(button|input|select|textarea|table|dialog|progress)\b' <files>
```

Each hit must be justified — inside a slot with no Scale equivalent, or a
native element a Scale component intentionally wraps. Otherwise replace it.

## 2. No hardcoded design values

```
grep -nE '#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(' <files>          # colour
grep -nE '(margin|padding|gap|border-radius)[^;]*[0-9]+px' <files>  # space & radius
grep -nE 'transition[^;]*[0-9]+m?s|animation[^;]*[0-9]+m?s' <files> # motion
grep -nE 'font-(family|size|weight)\s*:' <files>                 # type
```

Every hit should be a `var(--sc-*)` instead. Exceptions are rare: `0`, `1px`
hairlines, and `100%`/`auto`.

## 3. Every enum prop value is valid

For each `sc-*` element you wrote, check its attributes against the `props`
frontmatter of its guidance file. An invalid value does not error — it renders
the default, so this will not show up at runtime.

## 4. Accessibility contract met

Re-read the Accessibility section of each component's guidance file and confirm
you have honoured it. Most commonly missed:

- an icon-only control with no accessible name
- a `disabled` control with no nearby explanation of why
- a modal or menu opened without moving focus into it
- a status colour used as the only signal, with no text or icon

## 5. Imports present

Every `sc-*` tag used has a matching import, and the app imports
`@scale-ds/scale-design-system/scss/main` exactly once.

## Reporting

State plainly what you checked and what you changed. If you left a violation in
place, say which and why — do not quietly leave it.
