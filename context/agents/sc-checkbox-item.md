---
tag: sc-checkbox-item
class: ScCheckboxItem
category: forms
documentedWith: sc-checkbox
import: @scale-ds/scale-design-system/components/sc-checkbox-item
props:
  checked: { type: boolean, default: false }
  disabled: { type: boolean, default: false }
  indeterminate: { type: boolean, default: false }
  state: { type: enum, default: default, values: [default, negative] }
  required: { type: boolean, default: false }
events: [change]
cssParts: [button, icon-check, icon-dash]
roles: [checkbox]
source:
  guidance: guidance/components/checkbox.html
  docs: "https://scaledesignsystem.com/components/checkbox/"
---

# sc-checkbox-item

Standalone checkbox visual primitive (square + tick) without a label or form binding

Documented on the same page as `sc-checkbox`, which carries the shared
examples, guidelines and accessibility contract. See `sc-checkbox.md`.
