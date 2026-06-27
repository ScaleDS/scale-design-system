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

You'll get a styled, themed page built from `<sc-*>` web components, with a
working light/dark toggle.

## What's wired up (the three things you'd otherwise have to discover)

1. **Theme attribute** — `index.html` sets `<html data-theme="light">`. Scale's
   tokens are defined per theme on `<html>`; without this, components render
   unstyled. `src/main.ts` toggles it and persists to `localStorage`.
2. **Design tokens** — `src/styles.scss` does
   `@use '@scale-ds/scale-design-system/scss/main'` to define every `--sc-*`
   custom property. (That's why `sass` is a dev dependency.)
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
index.html        <html data-theme> + the sample page markup
src/main.ts       token import, component registration, theme toggle
src/styles.scss   @use Scale tokens + page layout
vite.config.ts    Scale Edit plugin (opt-in)
```

## Build

```bash
npm run build      # → dist/
npm run preview
```
