# Scale starter

A minimal [Vite](https://vitejs.dev) + TypeScript project wired up with the
[Scale Design System](https://www.npmjs.com/package/@scale-ds/scale-design-system) —
the fastest way to see Scale running in a real app.

## Quick start

```bash
npx degit ScaleDS/scale-design-system/examples/starter my-app
cd my-app
npm install
npm run dev          # → http://localhost:5173
```

You'll get a themed welcome screen built with Scale components (`<sc-logo>`,
`<sc-button>`) and styled entirely by Scale tokens — your starting point for
building. Clear `index.html` and start dropping in components.

## What's wired up (the three things you'd otherwise have to discover)

1. **Theme attribute** — `index.html` sets `<html data-theme="light">`. Scale's
   tokens are defined per theme on `<html>`; without this, components render
   unstyled. `src/main.ts` restores any saved choice from `localStorage`.
2. **Design tokens + the Inter typeface** — `src/styles.scss` does
   `@use '@scale-ds/scale-design-system/scss/main'`, which defines every `--sc-*`
   custom property, the base `body`/heading typography, **and** the bundled
   Inter `@font-face` (self-hosted in the package — no Google Fonts, no setup).
   (That's why `sass` is a dev dependency.)
3. **Component registration** — components are side-effect imports in
   `src/main.ts` (`import '@scale-ds/scale-design-system/components/sc-button'`).
   Import only what you use; the bundle stays small.

## Scale Edit (optional)

[Scale Edit](https://www.npmjs.com/package/@scale-ds/scale-design-system) is an
in-page overlay for pinning comments and making token-aware tweaks, then handing
them to a coding agent. It's pre-wired in `vite.config.ts` but **off by default** —
turn it on for a run:

```bash
npm run dev:edit     # = SCALE_EDIT=1 vite
```

## Project layout

```
index.html        <html data-theme> + the welcome screen markup
src/main.ts       token import, component registration, theme restore, copy action
src/styles.scss   @use Scale tokens + welcome screen layout
vite.config.ts    Scale Edit plugin (opt-in)
```

## Build

```bash
npm run build      # → dist/
npm run preview
```
