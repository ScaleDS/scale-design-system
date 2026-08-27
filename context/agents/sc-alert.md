---
tag: sc-alert
class: ScAlert
category: feedback
import: @scale-ds/scale-design-system/components/sc-alert
dependencies: [sc-status-icon]
props:
  status: { type: enum, default: info, values: [info, warning, negative, positive] }
  showHeading: { type: boolean, default: true, attr: show-heading }
  showActions: { type: boolean, default: true, attr: show-actions }
  showAction2: { type: boolean, default: true, attr: show-action-2 }
slots: [heading, default, action, action-2]
roles: [alert]
useInstead: [sc-banner, sc-toast]
source:
  guidance: guidance/components/alert.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-alert.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=3464-5445"
  framer: "https://scaleframer.framer.website/components/alert"
  docs: "https://scaledesignsystem.com/components/alert/"
---

# sc-alert

Inline messages that surface important information, warnings, errors, or success states right where the user needs them.

## When to use

persistent inline alerts inside a panel or card. For a full-width page-level bar use `sc-banner`; for transient feedback use `sc-toast`.

## When not to use

- Don’t use an alert for page-level announcements — use `sc-banner`.
- Don’t use it for transient confirmations — use `sc-toast`.

## Do

- Match the status to the message — positive for success, negative for errors.
- Keep the heading short and the body to a sentence or two.
- Place the alert inline, beside the content it refers to.

## Don't

- Don’t use an alert for page-level announcements — use `sc-banner`.
- Don’t use it for transient confirmations — use `sc-toast`.
- Don’t stack many alerts at once; surface the most important message.

## Examples

### Info

```html
<sc-alert status="info"><span slot="heading">Info heading</span>Information message text.</sc-alert>
```

### Warning

```html
<sc-alert status="warning"><span slot="heading">Warning heading</span>Warning message text.</sc-alert>
```

### Negative

```html
<sc-alert status="negative"><span slot="heading">Error heading</span>Error message text.</sc-alert>
```

### Positive

```html
<sc-alert status="positive"><span slot="heading">Success heading</span>Success message text.</sc-alert>
```

### Without heading

Set `show-heading="false"` for a single-line message with no title.

```html
<sc-alert status="info" show-heading="false">Message without a heading.</sc-alert>
```

### Without actions

Set `show-actions="false"` to drop the action buttons entirely.

```html
<sc-alert status="warning" show-actions="false"><span slot="heading">Warning</span>Message with no action buttons.</sc-alert>
```

### Single action

Slot one action and set `show-action-2="false"` to keep a single button.

```html
<sc-alert status="negative" show-action-2="false"><span slot="heading">Error</span>Error with one action.<span slot="action">Dismiss</span></sc-alert>
```

### Custom actions

Slot one or two actions with your own labels.

```html
<sc-alert status="info"><span slot="heading">Update available</span>A new version is ready to install.<span slot="action">Install</span><span slot="action-2">Later</span></sc-alert>
```

## Accessibility

- **Role:** the container is `role="alert"`, so assistive tech announces it as soon as it appears.
- **Not colour alone:** each status pairs its accent colour with a distinct `sc-status-icon`, so meaning never relies on colour.
- **Actions:** rendered as native `<button>`s — focusable and activated with `Enter` / `Space`.
- **Focus:** action buttons show the global keyboard focus ring.
