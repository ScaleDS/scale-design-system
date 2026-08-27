---
tag: sc-tab
class: ScTab
category: navigation
documentedWith: sc-tabs
import: @scale-ds/scale-design-system/components/sc-tab
props:
  panel: { type: string, default: "" }
  active: { type: boolean, default: false }
  disabled: { type: boolean, default: false }
  controls: { type: string, default: "" }
slots: [prefix, default, suffix]
roles: [tab]
source:
  guidance: guidance/components/tabs.html
  docs: "https://scaledesignsystem.com/components/tabs/"
---

# sc-tab

A single tab within sc-tabs, with selection and focus managed by the parent

Documented on the same page as `sc-tabs`, which carries the shared
examples, guidelines and accessibility contract. See `sc-tabs.md`.
