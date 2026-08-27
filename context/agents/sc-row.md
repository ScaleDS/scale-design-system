---
tag: sc-row
class: ScRow
category: layout
import: @scale-ds/scale-design-system/components/sc-row
dependencies: [sc-divider]
props:
  leadingIcon: { type: string, default: "", attr: leading-icon }
  trailingIcon: { type: string, default: "", attr: trailing-icon }
  hideDivider: { type: boolean, default: false, attr: hide-divider }
slots: [default]
cssProperties: [--sc-row-divider-display]
useInstead: [sc-card]
source:
  guidance: guidance/components/row.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-row.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=892-5435"
  framer: available
  docs: "https://scaledesignsystem.com/components/row/"
---

# sc-row

A horizontal list item with optional leading/trailing icons and a built-in `sc-divider` beneath it.

## When to use

pricing feature lists, settings rows, and any horizontal label-value pair. Used for the feature lines in `sc-card-pricing`.

## When not to use

- Don’t pack multi-line or complex content into a row — use a `sc-card`.

## Do

- Use rows for short, scannable label or label-value lines.
- Use a trailing chevron only when the row navigates somewhere.
- Set `hide-divider` on the final row, or hide all dividers via `--sc-row-divider-display: none` on the container.

## Don't

- Don’t pack multi-line or complex content into a row — use a `sc-card`.
- Don’t imply interactivity with a chevron if the row doesn’t act.
- Don’t rely on the icon alone to convey meaning — keep the label.

## Examples

### Icons

Add a `leading-icon` and/or `trailing-icon`; the label fills the space between.

```html
<div style="width:320px">
  <sc-row>List item</sc-row>
  <sc-row leading-icon="check-circle">Verified</sc-row>
  <sc-row trailing-icon="chevron-right">View details</sc-row>
  <sc-row leading-icon="user" trailing-icon="external-link">Profile</sc-row>
</div>
```

### No divider

`hide-divider` removes the line below a single row — useful for the last item in a list.

```html
<div style="width:320px">
  <sc-row hide-divider>No divider below</sc-row>
</div>
```

## Accessibility

- **Semantics:** Row is a presentational container — for a true list, place rows inside a `<ul>` / `<li>` so it’s announced as a list.
- **Icons:** the leading/trailing icons are decorative; the label text must carry the meaning.
- **Interactivity:** Row isn’t focusable on its own — if it should act, wrap the content in a real `sc-button` or link.
- **Divider:** the built-in subtle divider is decorative; don’t depend on it to group content for assistive tech.
