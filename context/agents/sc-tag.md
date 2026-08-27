---
tag: sc-tag
class: ScTag
category: content
import: @scale-ds/scale-design-system/components/sc-tag
props:
  selected: { type: boolean, default: false }
  selectable: { type: boolean, default: false }
  removable: { type: boolean, default: false }
  disabled: { type: boolean, default: false }
  leadingIcon: { type: string, default: "", attr: leading-icon }
  avatar: { type: string, default: "" }
  avatarAlt: { type: string, default: "", attr: avatar-alt }
  value: { type: string, default: "" }
  removeLabel: { type: string, default: Remove, attr: remove-label }
slots: [default]
events: [change, remove]
cssParts: [avatar, icon, label, close]
roles: [button]
useInstead: [sc-badge, sc-status-indicator]
source:
  guidance: guidance/components/tag.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-tag.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=3786-5372"
  docs: "https://scaledesignsystem.com/components/tag/"
---

# sc-tag

A small element for categorising or filtering content — often dismissible or clickable. Three independent capabilities: `selectable` (a toggle chip), `removable` (a trailing ×), or a plain static label.

## When to use

category labels, filter chips, and removable selections. Add a `leading-icon` or `avatar` before the label. For a status label, use a `sc-badge`.

## When not to use

- Don’t use a plain tag where a labelled `sc-badge` or `sc-status-indicator` fits better.

## Do

- Use `selectable` tags for filters and `removable` for chosen values.
- Keep labels short — a word or two.
- Handle the `remove` event to actually drop the tag from your data.

## Don't

- Don’t use a plain tag where a labelled `sc-badge` or `sc-status-indicator` fits better.
- Don’t make a tag both selectable and removable if the interactions compete confusingly.
- Don’t rely on colour alone for a selected filter — the fill plus state should read clearly.

## Examples

### Selectable

`selectable` makes a toggle chip — click or `Enter`/`Space` flips `selected` and emits `change`.

```html
<sc-tag>Text</sc-tag>
<sc-tag selectable>Text</sc-tag>
<sc-tag selectable selected>Text</sc-tag>
<sc-tag selectable disabled>Text</sc-tag>
```

### Leading content

Add a `leading-icon` or an `avatar` (the avatar wins if both are set).

```html
<sc-tag leading-icon="tag">Text</sc-tag>
<sc-tag avatar="https://i.pravatar.cc/32?img=12" avatar-alt="Jane">Jane Doe</sc-tag>
```

### Removable

`removable` adds a × that emits `remove` (`Delete`/`Backspace` on a focused tag also removes it). Handle `remove` to drop the tag — here the chips remove themselves.

```html
<sc-tag removable>Text</sc-tag>
<sc-tag leading-icon="tag" removable>Design</sc-tag>
```

### Filter group

```html
<div style="display:flex;gap:var(--sc-space-s);flex-wrap:wrap">
  <sc-tag selectable selected leading-icon="check">All</sc-tag>
  <sc-tag selectable>Active</sc-tag>
  <sc-tag selectable>Archived</sc-tag>
  <sc-tag selectable>Draft</sc-tag>
</div>
```

## Accessibility

- **Selectable:** becomes a `role="button"` with `aria-pressed` and a tab stop; `Enter`/`Space` toggles it.
- **Removable:** the × is a real `<button>` labelled by `remove-label`; `Delete`/`Backspace` on a focused tag also removes it.
- **Plain:** a non-selectable tag is static text with no role — keep its meaning in the label.
- **Disabled:** sets `aria-disabled` and drops the tab stop.
- **Avatar:** provide `avatar-alt` so the image has a text alternative.
