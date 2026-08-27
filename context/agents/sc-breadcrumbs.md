---
tag: sc-breadcrumbs
class: ScBreadcrumbs
category: navigation
import: @scale-ds/scale-design-system/components/sc-breadcrumbs
props:
  crumbs: { type: array, default: "[]" }
  current: { type: string, default: "" }
events: [navigate]
source:
  guidance: guidance/components/breadcrumbs.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-breadcrumbs.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=9709-25353"
  framer: "https://scaleframer.framer.website/components/breadcrumbs"
  docs: "https://scaledesignsystem.com/components/breadcrumbs/"
---

# sc-breadcrumbs

Trail of linked pages showing users exactly where they are within the site hierarchy.

## When to use

navigation trails on deep pages and to give location context inside an app hierarchy.

## Do

- Start at the site root and end at the current page.
- Use short labels that match the destination page titles.
- Keep the trail on one line; truncate long paths rather than wrap.

## Don't

- Don’t use breadcrumbs as a page’s primary navigation.
- Don’t make the current page a clickable link.
- Don’t show them on top-level pages with no hierarchy.

## Examples

### Default

Pass `crumbs` as an array of `{ label, href }` and set `current` for the active page. A crumb with no `href` fires a `navigate` event instead of following a link.

```html
<sc-breadcrumbs id="scd-bc-1" current="Running" style="max-width:100%"></sc-breadcrumbs>
```

### Without a current page

Omit `current` and the trailing separator is suppressed.

```html
<sc-breadcrumbs id="scd-bc-2" style="max-width:100%"></sc-breadcrumbs>
```

## Accessibility

- **Landmark:** the trail is a `<nav>` labelled “Breadcrumb” wrapping an ordered list.
- **Current page:** marked `aria-current="page"` and rendered as plain text, not a link.
- **Separators:** the “/” dividers are `aria-hidden`, so screen readers skip them.
- **Crumbs:** each is a keyboard-focusable link (`Enter` activates); a crumb with no `href` fires a `navigate` event instead of following a URL.
