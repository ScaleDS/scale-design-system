---
tag: sc-file-upload-item
class: ScFileUploadItem
category: forms
documentedWith: sc-file-upload
import: @scale-ds/scale-design-system/components/sc-file-upload-item
dependencies: [sc-progress-bar, sc-status-icon]
props:
  name: { type: string, default: "" }
  text: { type: string, default: "" }
  state: { type: enum, default: uploaded, values: [uploaded, uploading, positive, negative] }
  value: { type: number, default: 0 }
  disabled: { type: boolean, default: false }
events: [remove]
cssParts: [remove, name, text, progress, row, icon]
source:
  guidance: guidance/components/file-upload.html
  docs: "https://scaledesignsystem.com/components/file-upload/"
---

# sc-file-upload-item

A single file row showing name, size, progress bar, and status with a remove control

Documented on the same page as `sc-file-upload`, which carries the shared
examples, guidelines and accessibility contract. See `sc-file-upload.md`.
