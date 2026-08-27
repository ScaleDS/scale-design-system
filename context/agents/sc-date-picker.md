---
tag: sc-date-picker
class: ScDatePicker
category: forms
import: @scale-ds/scale-design-system/components/sc-date-picker
dependencies: [sc-button-icon, sc-button]
props:
  mode: { type: enum, default: single, values: [single, range] }
  value: { type: string, default: "" }
  end: { type: string, default: "" }
  min: { type: string, default: "" }
  max: { type: string, default: "" }
  name: { type: string, default: "" }
  locale: { type: string, default: en-US }
  firstDayOfWeek: { type: enum, default: monday, attr: first-day-of-week, values: [monday, sunday] }
  showActions: { type: boolean, default: false, attr: show-actions }
  disabled: { type: boolean, default: false }
events: [change, change, cancel]
roles: [grid, gridcell]
formAssociated: true
useInstead: [sc-input]
source:
  guidance: guidance/components/date-picker.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-date-picker.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=6052-10156"
  framer: "https://scaleframer.framer.website/components/form"
  docs: "https://scaledesignsystem.com/components/date-picker/"
---

# sc-date-picker

An accessible calendar for choosing a single date or a range, with full keyboard grid navigation, roving focus, and an optional confirm/cancel flow. Follows the WAI-ARIA date-picker grid pattern.

## When to use

date and range selection in forms, filters, and scheduling flows. For free-text date entry, pair it with an `sc-input`.

## When not to use

- Don’t use a calendar for a far-past date like birth year — a typed `sc-input` is faster.

## Do

- Use `min` / `max` to rule out impossible dates rather than validating after the fact.
- Set `show-actions` when a selection should be deliberate (e.g. inside a popover).
- Match `locale` and `first-day-of-week` to the user’s region.

## Don't

- Don’t use a calendar for a far-past date like birth year — a typed `sc-input` is faster.
- Don’t hide the selected value — echo it back near the field.
- Don’t disable arbitrary days without telling the user why they’re unavailable.

## Examples

### Single date

Set `value` as an ISO date (`YYYY-MM-DD`), or leave it empty for no initial selection. The component fires `change` with `{ value }`.

```html
<sc-date-picker value="2011-04-15"></sc-date-picker>
```

### Range

`mode="range"` selects a start (`value`) and `end` date; `change` then carries `{ start, end }`.

```html
<sc-date-picker mode="range" value="2011-04-08" end="2011-04-19"></sc-date-picker>
```

### With actions and limits

`show-actions` adds a confirm/cancel footer (the selection stays pending until confirmed); `min` / `max` constrain the window; and `first-day-of-week` sets the week start.

```html
<sc-date-picker value="2011-04-15" show-actions min="2011-04-04" max="2011-04-22" first-day-of-week="sunday"></sc-date-picker>
```

### Localized

Pass a BCP-47 `locale` to translate the month and weekday names; combine with `first-day-of-week` for regional conventions.

```html
<sc-date-picker value="2011-04-15" locale="de-DE" first-day-of-week="monday"></sc-date-picker>
```

## Accessibility

- **Grid:** the calendar is a `role="grid"` of `gridcell` day buttons with roving `tabindex` — one tab stop for the whole grid.
- **Keyboard:** `←` `→` day, `↑` `↓` week, `Home` / `End` week edges, `Page Up` / `Page Down` month, `Shift`+`Page Up` / `Page Down` year.
- **Selection:** the chosen day (and range endpoints/fill) carry `aria-selected`; today is marked `aria-current="date"`.
- **Announcements:** the month label is a polite live region, so month changes are read out.
- **Month nav:** the prev/next arrows are labelled `sc-button-icon`s (“Previous month” / “Next month”).
- **Disabled days:** dates outside `min`/`max` render as `disabled` buttons, skipped by activation.
