---
tag: sc-progress-bar
class: ScProgressBar
category: feedback
import: @scale-ds/scale-design-system/components/sc-progress-bar
props:
  value: { type: number, default: 0 }
  status: { type: enum, default: uploading, values: [uploading, positive, negative] }
  label: { type: string, default: "" }
cssParts: [track, fill]
useInstead: [sc-spinner]
source:
  guidance: guidance/components/progress-bar.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-progress-bar.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=23278-206529"
  docs: "https://scaledesignsystem.com/components/progress-bar/"
---

# sc-progress-bar

A presentational completion indicator (`role="progressbar"`). `value` (0–100) drives the fill width; `status` sets the colour.

## When to use

file uploads, multi-step progress, and any determinate task. Pass `label` for an accessible name. For indeterminate waits, use a `sc-spinner`.

## When not to use

- Don’t use it for unknown-duration waits — use a `sc-spinner`.

## Do

- Use a progress bar when you can measure completion (determinate tasks).
- Update `label` to reflect the current state (“Uploading” → “Complete”).
- Use `positive` / `negative` to signal the final outcome.

## Don't

- Don’t use it for unknown-duration waits — use a `sc-spinner`.
- Don’t leave it stuck at a value without resolving to success or failure.
- Don’t rely on fill colour alone — keep a text label nearby.

## Examples

### Progress

`value` is the completion percentage, clamped to 0–100.

```html
<div style="display:flex;flex-direction:column;gap:var(--sc-space-l);width:370px">
  <sc-progress-bar value="0" label="Uploading file"></sc-progress-bar>
  <sc-progress-bar value="25" label="Uploading file"></sc-progress-bar>
  <sc-progress-bar value="50" label="Uploading file"></sc-progress-bar>
  <sc-progress-bar value="75" label="Uploading file"></sc-progress-bar>
  <sc-progress-bar value="100" label="Uploading file"></sc-progress-bar>
</div>
```

### Status

`status` colours the fill — `uploading`, `positive`, or `negative`.

```html
<div style="display:flex;flex-direction:column;gap:var(--sc-space-l);width:370px">
  <sc-progress-bar value="60" status="uploading" label="Uploading"></sc-progress-bar>
  <sc-progress-bar value="100" status="positive" label="Upload complete"></sc-progress-bar>
  <sc-progress-bar value="100" status="negative" label="Upload failed"></sc-progress-bar>
</div>
```

### Live upload

Drive `value` over time, then flip `status` and `label` on completion.

```html
<div class="sc-upload-demo" style="display:flex;flex-direction:column;gap:var(--sc-space-m);width:370px">
  <sc-progress-bar value="0" status="uploading" label="Uploading file"></sc-progress-bar>
  <sc-button type="secondary" size="m" leading-icon="upload-cloud" style="align-self:flex-start" data-start-upload>Start upload</sc-button>
</div>
```

## Accessibility

- **Role:** exposes `role="progressbar"` with `aria-valuemin="0"`, `aria-valuemax="100"`, and a live `aria-valuenow`.
- **Name:** `label` sets `aria-label`; always provide one so the bar isn’t anonymous.
- **Status:** colour conveys outcome — reinforce it in the `label` text (“failed”, “complete”).
- **Updates:** when value changes, screen readers announce the new percentage via `aria-valuenow`.
