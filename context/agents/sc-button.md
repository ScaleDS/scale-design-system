---
tag: sc-button
class: ScButton
category: actions
import: @scale-ds/scale-design-system/components/sc-button
dependencies: [sc-spinner]
props:
  size: { type: enum, default: l, values: [l, m, s] }
  type: { type: enum, default: primary, values: [primary, secondary, tertiary, tertiary-mono, inverse, mono, outline, outline-mono, text, text-mono, negative-primary, negative-outline, negative-text] }
  loading: { type: boolean, default: false }
  disabled: { type: boolean, default: false }
  leadingIcon: { type: string, default: "", attr: leading-icon }
  trailingIcon: { type: string, default: "", attr: trailing-icon }
  href: { type: string, default: "" }
  target: { type: enum, default: "", values: [_self, _blank, _parent, _top, ""] }
  rel: { type: string, default: "" }
slots: [default]
cssParts: [button]
cssProperties: [--sc-button-width]
useInstead: [sc-button-icon]
source:
  guidance: guidance/components/button.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-button.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=891-3479"
  framer: "https://scaleframer.framer.website/components/button"
  docs: "https://scaledesignsystem.com/components/button/"
---

# sc-button

The go-to element for triggering actions — tappable, clickable, and hard to miss.

## When to use

primary user actions, form submissions, navigation triggers — any interactive call to action.

## When not to use

- Don’t ship icon-only buttons here — use `sc-button-icon`.

## Do

- Lead each view with a single primary action.
- Use a clear, action-led verb for the label — “Save”, “Download”.
- Pair a high-emphasis primary with lower-emphasis secondary or tertiary buttons.

## Don't

- Don’t stack several primary buttons competing for attention.
- Don’t ship icon-only buttons here — use `sc-button-icon`.
- Don’t disable a button without making the reason obvious nearby.

## Examples

### Types

Thirteen visual types, ordered by emphasis. Pair the highest-emphasis `primary` with lower-emphasis variants so a single action stands out.

```html
<sc-button type="primary">Primary</sc-button>
<sc-button type="secondary">Secondary</sc-button>
<sc-button type="tertiary">Tertiary</sc-button>
<sc-button type="tertiary-mono">Tertiary mono</sc-button>
<sc-button type="inverse">Inverse</sc-button>
<sc-button type="mono">Mono</sc-button>
<sc-button type="outline">Outline</sc-button>
<sc-button type="outline-mono">Outline mono</sc-button>
<sc-button type="text">Text</sc-button>
<sc-button type="text-mono">Text mono</sc-button>
<sc-button type="negative-primary">Negative primary</sc-button>
<sc-button type="negative-outline">Negative outline</sc-button>
<sc-button type="negative-text">Negative text</sc-button>
```

### Sizes

```html
<sc-button size="l" type="primary">Large</sc-button>
<sc-button size="m" type="primary">Medium</sc-button>
<sc-button size="s" type="primary">Small</sc-button>
```

### States

```html
<sc-button type="primary" disabled>Disabled</sc-button>
<sc-button type="primary" loading>Loading</sc-button>
```

### With icons

Add a `leading-icon` or `trailing-icon` to reinforce the action. Keep labels — icon-only actions belong in `sc-button-icon`.

```html
<sc-button type="primary" leading-icon="download">Download</sc-button>
<sc-button type="secondary" trailing-icon="arrow-right">Learn more</sc-button>
<sc-button type="outline" leading-icon="external-link" trailing-icon="chevron-right">Open</sc-button>
```

## Accessibility

- **Element:** renders a native `<button>`; with an `href` it renders an `<a>` link instead — both keyboard focusable.
- **Activation:** `Enter` / `Space` activates a button; a link follows on `Enter`.
- **Busy / disabled:** `loading` and `disabled` set `aria-busy` / the disabled state and block activation.
- **Label:** the visible text carries the meaning — keep a label rather than relying on an icon alone.
- **Focus:** shows the global keyboard focus ring.
