---
tag: sc-file-upload
class: ScFileUpload
category: forms
import: @scale-ds/scale-design-system/components/sc-file-upload
dependencies: [sc-file-upload-item]
props:
  layout: { type: enum, default: vertical, values: [vertical, horizontal] }
  accept: { type: string, default: "" }
  multiple: { type: boolean, default: false }
  disabled: { type: boolean, default: false }
  required: { type: boolean, default: false }
  name: { type: string, default: "" }
  maxSize: { type: number, default: 0, attr: max-size }
  secondaryText: { type: string, default: "Files can be up to 5mb.", attr: secondary-text }
  showSecondaryText: { type: boolean, default: true, attr: show-secondary-text }
events: [remove, change]
cssParts: [dropzone, icon, browse, list]
roles: [status]
formAssociated: true
source:
  guidance: guidance/components/file-upload.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-file-upload.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=31988-140033"
  docs: "https://scaledesignsystem.com/components/file-upload/"
---

# sc-file-upload

A form-associated upload control. The dashed dropzone wraps a real `<input type="file">`, so the keyboard “Browse” button opens the native picker; drag-and-drop is a progressive enhancement on top.

## When to use

document and image uploads in forms. Selected files render as `sc-file-upload-item` rows that show progress and flag over-size files.

## Do

- State accepted formats and the size limit in `secondary-text` up front.
- Set `accept` and `max-size` so invalid files are caught early.
- Use `multiple` only when several files are genuinely expected.

## Don't

- Don’t rely on drag-and-drop alone — the Browse button is the accessible path.
- Don’t hide upload progress or failure; let the file rows carry it.
- Don’t accept files you can’t process — filter with `accept` rather than rejecting after upload.

## Examples

### Vertical (desktop)

The default `vertical` layout is a centred dropzone with a large icon. Try dropping or browsing a file to see the `sc-file-upload-item` rows appear.

```html
<sc-file-upload style="max-width:448px"></sc-file-upload>
```

### Horizontal (compact)

`layout="horizontal"` packs the icon and browse line into a single row for tighter spaces.

```html
<sc-file-upload layout="horizontal" style="max-width:370px"></sc-file-upload>
```

### Multiple & accept

`multiple` keeps every selected file; `accept` mirrors the native filter; and `secondary-text` sets the helper line.

```html
<sc-file-upload multiple accept="image/*" secondary-text="PNG or JPG, up to 5mb." style="max-width:448px"></sc-file-upload>
```

### Max size

`max-size` (bytes) flags files that are too large as a negative row instead of accepting them.

```html
<sc-file-upload multiple max-size="1048576" secondary-text="Each file up to 1 MB." style="max-width:448px"></sc-file-upload>
```

### Disabled

```html
<sc-file-upload disabled style="max-width:448px"></sc-file-upload>
```

### File rows (sc-file-upload-item)

The component renders these rows for you, but you can use them standalone when wiring a real upload. `state` drives the visual, and `value` is the upload percentage.

```html
<div style="display:flex;flex-direction:column;gap:var(--sc-space-s);max-width:448px">
  <sc-file-upload-item state="uploading" value="50" name="annual-report.pdf" text="1.2 MB"></sc-file-upload-item>
  <sc-file-upload-item state="positive" name="annual-report.pdf" text="Upload complete"></sc-file-upload-item>
  <sc-file-upload-item state="negative" name="huge-video.mov" text="File exceeds the 5 MB limit."></sc-file-upload-item>
  <sc-file-upload-item name="annual-report.pdf" text="1.2 MB"></sc-file-upload-item>
  <sc-file-upload-item disabled name="locked.txt" text="2 KB"></sc-file-upload-item>
</div>
```

## Accessibility

- **Keyboard:** the visible **Browse** button is a real `<button>` that opens the native file picker; the underlying `<input type="file">` is hidden from the tab order.
- **Drag-and-drop:** a progressive enhancement only — every action is reachable without it.
- **Announcements:** added and removed files are reported through a polite `role="status"` live region.
- **Form:** form-associated — `required` sets `valueMissing` validity, and files post under `name`.
- **File rows:** each row exposes a remove control and conveys `uploading` / `positive` / `negative` state with text, not colour alone.
