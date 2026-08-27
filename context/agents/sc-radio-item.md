---
tag: sc-radio-item
class: ScRadioItem
category: forms
documentedWith: sc-radio
import: @scale-ds/scale-design-system/components/sc-radio-item
props:
  checked: { type: boolean, default: false }
  disabled: { type: boolean, default: false }
  state: { type: enum, default: default, values: [default, negative] }
  required: { type: boolean, default: false }
events: [change]
cssParts: [button, dot]
roles: [radio]
source:
  guidance: guidance/components/radio.html
  docs: "https://scaledesignsystem.com/components/radio/"
---

# sc-radio-item

Standalone radio visual primitive (circle + dot) without a label or form binding

Documented on the same page as `sc-radio`, which carries the shared
examples, guidelines and accessibility contract. See `sc-radio.md`.
