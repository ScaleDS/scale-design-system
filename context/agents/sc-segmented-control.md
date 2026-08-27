---
tag: sc-segmented-control
class: ScSegmentedControl
category: forms
import: @scale-ds/scale-design-system/components/sc-segmented-control
dependencies: [sc-tooltip]
props:
  items: { type: SegmentedItem[], default: "[]" }
  value: { type: string, default: "" }
  name: { type: string, default: "" }
  disabled: { type: boolean, default: false }
  iconOnly: { type: boolean, default: false, attr: icon-only }
  label: { type: string, default: "" }
  tooltipDelay: { type: number, default: 150, attr: tooltip-delay }
events: [change]
cssParts: [control, segment, label]
roles: [button, group]
formAssociated: true
useInstead: [sc-tabs]
source:
  guidance: guidance/components/segmented-control.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-segmented-control.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=81768-10721"
  docs: "https://scaledesignsystem.com/components/segmented-control/"
---

# sc-segmented-control

Inline toggle with two or more exclusive options — ideal for switching views or filtering content.

## When to use

a compact, in-place switch between a few alternative views or modes of one content area. For page-level content sections or larger sets, reach for `sc-tabs` instead; for a binary on/off, use a `sc-toggle`.

## When not to use

- Don’t use it to navigate between pages or for many sections — use `sc-tabs`.

## Do

- Use it to switch between peer views of the same content, in place.
- Keep to two–five short, similar-length segments on a single line.
- Always keep one segment selected, matching the content on screen.

## Don't

- Don’t use it to navigate between pages or for many sections — use `sc-tabs`.
- Don’t mix text-only and icon-only segments in one control, or let labels wrap.
- Don’t use it to trigger actions or for multi-select.

## Examples

### Switching views

The control is the switcher; you swap the content. Set `items` (an array of `{ label, value, icon? }`) and listen for the `change` event to show the matching view — keep the selected segment and the visible content in sync.

```html
<div style="width:100%">
  <sc-segmented-control id="scd-seg-view" value="list" style="margin-bottom: var(--sc-space-l)"></sc-segmented-control>
  <div>
    <div data-seg-panel="list" style="border:1px solid var(--sc-color-border-subtle); border-radius: var(--sc-border-radius-m); padding: var(--sc-space-l);">
      <h4 style="margin:0 0 var(--sc-space-s)">List</h4>
      <p style="margin:0; color:var(--sc-color-text-secondary)">A dense, scannable list of every task, one row at a time.</p>
    </div>
    <div data-seg-panel="board" hidden style="border:1px solid var(--sc-color-border-subtle); border-radius: var(--sc-border-radius-m); padding: var(--sc-space-l);">
      <h4 style="margin:0 0 var(--sc-space-s)">Board</h4>
      <p style="margin:0; color:var(--sc-color-text-secondary)">Cards grouped into columns by status, for drag-and-drop flow.</p>
    </div>
    <div data-seg-panel="timeline" hidden style="border:1px solid var(--sc-color-border-subtle); border-radius: var(--sc-border-radius-m); padding: var(--sc-space-l);">
      <h4 style="margin:0 0 var(--sc-space-s)">Timeline</h4>
      <p style="margin:0; color:var(--sc-color-text-secondary)">Tasks plotted across a schedule to see overlap and sequence.</p>
    </div>
  </div>
</div>
```

### Two to five segments

Keep it to a small, balanced set — two to five short, parallel options that fit on one line.

```html
<sc-segmented-control id="scd-seg-two" value="overview"></sc-segmented-control>
<sc-segmented-control id="scd-seg-three" value="week"></sc-segmented-control>
<sc-segmented-control id="scd-seg-four" value="day"></sc-segmented-control>
```

### Icon and text

Give an item an `icon` (a Feather icon name) to render it before the label. Use icons consistently across every segment, not just some.

```html
<sc-segmented-control id="scd-seg-icons" value="board"></sc-segmented-control>
```

### Icon only

Set `icon-only` to render icons alone — each item’s `label` becomes its accessible name. Best for universally-understood views where the icons need no caption.

```html
<sc-segmented-control id="scd-seg-icononly" icon-only value="grid"></sc-segmented-control>
```

### Disabled

Set `disabled` to disable the whole control, or mark an individual item `disabled: true` when a view isn’t available yet.

```html
<sc-segmented-control id="scd-seg-disabled" disabled value="week"></sc-segmented-control>
<sc-segmented-control id="scd-seg-disabled-item" value="day"></sc-segmented-control>
```

## Accessibility

- **Pattern:** a view switcher, not a tabbed interface — the container is a `role="group"` of native `<button>`s (label it via `label`), with the active one marked `aria-current="true"`. When you need full tab semantics (arrow-key roving, associated `tabpanel`s), use `sc-tabs` instead.
- **Keyboard:** every segment is in the tab order; `Tab` / `Shift`+`Tab` moves between them and `Enter` / `Space` switches the view. There is no arrow-key roving.
- **Content sync:** update the shown content immediately on `change` so the selected segment always reflects what’s visible.
- **Focus:** visible focus ring on keyboard focus; never removed.
- **Icon only:** each item’s `label` becomes the button’s accessible name, so screen-reader users still hear the view name.
