---
tag: sc-tabs
class: ScTabs
category: navigation
import: @scale-ds/scale-design-system/components/sc-tabs
dependencies: [sc-tab, sc-tab-panel]
props:
  active: { type: string, default: "" }
  activation: { type: enum, default: auto, values: [auto, manual] }
  placement: { type: enum, default: top, values: [top, bottom] }
slots: [nav, default]
events: [sc-tab-hide, sc-tab-show, change]
roles: [tablist]
useInstead: [sc-menu-dropdown]
source:
  guidance: guidance/components/tabs.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-tabs.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=893-6273"
  framer: "https://scaleframer.framer.website/components/tabs"
  docs: "https://scaledesignsystem.com/components/tabs/"
---

# sc-tabs

Selectable labels that switch between content panels, showing one at a time without a page reload.

## When to use

switching between peer views of the same context. The group owns selection, roving focus, and keyboard interaction (`←`/`→` between tabs, `Home`/`End` to the ends). For stacked, independently-expandable sections use an `sc-accordion`.

## When not to use

- Don’t overflow into too many tabs; consider a `sc-menu-dropdown` or sub-nav.

## Do

- Use tabs for peer views of the same object, not a sequence of steps.
- Keep tab labels short — one or two words — and order them by importance.
- Always have one tab active; default to the most common view.

## Don't

- Don’t use tabs for a linear flow — use a stepper or pages.
- Don’t overflow into too many tabs; consider a `sc-menu-dropdown` or sub-nav.
- Don’t put unrelated content behind tabs just to save space.

## Examples

### Default

Slot `sc-tab`s into `nav` and matching `sc-tab-panel`s; `active` sets the open panel by its `panel` / `name`.

```html
<sc-tabs active="overview" style="max-width:520px">
  <sc-tab slot="nav" panel="overview">Overview</sc-tab>
  <sc-tab slot="nav" panel="activity">Activity</sc-tab>
  <sc-tab slot="nav" panel="settings">Settings</sc-tab>
  <sc-tab-panel name="overview">A high-level summary of the project and its current status.</sc-tab-panel>
  <sc-tab-panel name="activity">Recent activity, comments, and history appear here.</sc-tab-panel>
  <sc-tab-panel name="settings">Configuration and preferences for this workspace.</sc-tab-panel>
</sc-tabs>
```

### Many tabs

```html
<sc-tabs active="t1" style="max-width:520px">
  <sc-tab slot="nav" panel="t1">Tab 1</sc-tab>
  <sc-tab slot="nav" panel="t2">Tab 2</sc-tab>
  <sc-tab slot="nav" panel="t3">Tab 3</sc-tab>
  <sc-tab slot="nav" panel="t4">Tab 4</sc-tab>
  <sc-tab slot="nav" panel="t5">Tab 5</sc-tab>
  <sc-tab slot="nav" panel="t6">Tab 6</sc-tab>
  <sc-tab slot="nav" panel="t7">Tab 7</sc-tab>
  <sc-tab slot="nav" panel="t8">Tab 8</sc-tab>
  <sc-tab-panel name="t1">Content for tab 1.</sc-tab-panel>
  <sc-tab-panel name="t2">Content for tab 2.</sc-tab-panel>
  <sc-tab-panel name="t3">Content for tab 3.</sc-tab-panel>
  <sc-tab-panel name="t4">Content for tab 4.</sc-tab-panel>
  <sc-tab-panel name="t5">Content for tab 5.</sc-tab-panel>
  <sc-tab-panel name="t6">Content for tab 6.</sc-tab-panel>
  <sc-tab-panel name="t7">Content for tab 7.</sc-tab-panel>
  <sc-tab-panel name="t8">Content for tab 8.</sc-tab-panel>
</sc-tabs>
```

### Disabled tab

```html
<sc-tabs active="one" style="max-width:520px">
  <sc-tab slot="nav" panel="one">One</sc-tab>
  <sc-tab slot="nav" panel="two" disabled>Two</sc-tab>
  <sc-tab slot="nav" panel="three">Three</sc-tab>
  <sc-tab-panel name="one">First panel.</sc-tab-panel>
  <sc-tab-panel name="two">Second panel.</sc-tab-panel>
  <sc-tab-panel name="three">Third panel.</sc-tab-panel>
</sc-tabs>
```

### Manual activation

`activation="manual"` — arrow keys move focus, `Enter`/`Space` selects (vs the default `auto`, which selects on focus).

```html
<sc-tabs active="a" activation="manual" style="max-width:520px">
  <sc-tab slot="nav" panel="a">Account</sc-tab>
  <sc-tab slot="nav" panel="b">Billing</sc-tab>
  <sc-tab slot="nav" panel="c">Team</sc-tab>
  <sc-tab-panel name="a">Account details.</sc-tab-panel>
  <sc-tab-panel name="b">Billing and invoices.</sc-tab-panel>
  <sc-tab-panel name="c">Team members and roles.</sc-tab-panel>
</sc-tabs>
```

### Bottom placement

`placement="bottom"` puts the nav below the panels.

```html
<sc-tabs active="map" placement="bottom" style="max-width:520px">
  <sc-tab slot="nav" panel="map">Map</sc-tab>
  <sc-tab slot="nav" panel="list">List</sc-tab>
  <sc-tab-panel name="map">Map view of results.</sc-tab-panel>
  <sc-tab-panel name="list">List view of results.</sc-tab-panel>
</sc-tabs>
```

## Accessibility

- **Pattern:** follows the WAI-ARIA Tabs pattern — a `role="tablist"` of `role="tab"` controls, each wired to a `role="tabpanel"` via `aria-controls` / `aria-labelledby`.
- **Selection:** the active tab carries `aria-selected="true"`; its panel is shown while the others are `aria-hidden`.
- **Keyboard:** roving tabindex — `←`/`→` move between tabs, `Home`/`End` jump to the ends; in `manual` mode `Enter`/`Space` activates.
- **Disabled:** a `disabled` tab sets `aria-disabled` and is skipped.
- **Panel focus:** each panel is focusable (`tabindex="0"`) so keyboard users can reach its content.
