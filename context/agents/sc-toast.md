---
tag: sc-toast
class: ScToast
category: feedback
import: @scale-ds/scale-design-system/components/sc-toast
dependencies: [sc-status-icon]
props:
  status: { type: enum, default: default, values: [default, info, negative, positive] }
  placement: { type: enum, default: top-end, values: [top-start, top-center, top-end, bottom-start, bottom-center, bottom-end] }
  duration: { type: number, default: 4000 }
  hideClose: { type: boolean, default: false, attr: hide-close }
  hideLink: { type: boolean, default: false, attr: hide-link }
  linkHref: { type: string, default: "", attr: link-href }
  link: { type: string, default: "" }
  text: { type: string, default: "" }
events: [close]
cssParts: [icon, text, link, close]
roles: [link]
useInstead: [sc-modal, sc-banner]
source:
  guidance: guidance/components/toast.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-toast.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=9710-61807"
  framer: "https://scaleframer.framer.website/components/toast"
  docs: "https://scaledesignsystem.com/components/toast/"
---

# sc-toast

Brief, self-dismissing notifications that pop up to confirm an action without interrupting the flow. Shown imperatively via `ScToast.show()`, which stacks toasts in a corner of the viewport.

## When to use

brief confirmations and feedback after an action (“Saved”, “Copied”). For persistent page-level messages, use a `sc-banner`; for inline contextual messages, an `sc-alert`.

## When not to use

- Don’t use a toast for critical errors that need acknowledgement — use a `sc-modal` or `sc-banner`.

## Do

- Keep the message to one short sentence — toasts disappear quickly.
- Pair a destructive confirmation with an action `link` (e.g. “Undo”).
- Use `duration: 0` when the toast carries an action the user must take.
- Pick one `placement` per app and stick with it.

## Don't

- Don’t use a toast for critical errors that need acknowledgement — use a `sc-modal` or `sc-banner`.
- Don’t put the only path to important content inside a toast — it auto-dismisses.
- Don’t fire toasts for every minor state change; reserve them for the result of a user action.

## Examples

### Status variants

Click a trigger — the toast appears in the top-end corner. `default` is a plain inverse surface; the other statuses add a leading `sc-status-icon`.

```html
<div style="display:flex;flex-wrap:wrap;gap:var(--sc-space-s)">
  <sc-button data-toast data-status="default" data-text="Your changes have been saved." data-link="Undo">Default</sc-button>
  <sc-button type="secondary" data-toast data-status="info" data-text="A new version is available." data-link="Refresh">Info</sc-button>
  <sc-button type="secondary" data-toast data-status="negative" data-text="Something went wrong. Please try again." data-link="Retry">Negative</sc-button>
  <sc-button type="secondary" data-toast data-status="positive" data-text="Your file uploaded successfully." data-link="View">Positive</sc-button>
</div>
```

### Placement

One stack per `placement` — six corners are available.

```html
<div style="display:flex;flex-wrap:wrap;gap:var(--sc-space-s)">
  <sc-button type="secondary" data-toast data-status="info" data-text="Top start." data-placement="top-start">Top start</sc-button>
  <sc-button type="secondary" data-toast data-status="info" data-text="Top center." data-placement="top-center">Top center</sc-button>
  <sc-button type="secondary" data-toast data-status="info" data-text="Top end (default)." data-placement="top-end">Top end</sc-button>
  <sc-button type="secondary" data-toast data-status="info" data-text="Bottom start." data-placement="bottom-start">Bottom start</sc-button>
  <sc-button type="secondary" data-toast data-status="info" data-text="Bottom center." data-placement="bottom-center">Bottom center</sc-button>
  <sc-button type="secondary" data-toast data-status="info" data-text="Bottom end." data-placement="bottom-end">Bottom end</sc-button>
</div>
```

### Duration

Each toast auto-dismisses after `duration` ms (default 4000); `0` keeps it until dismissed.

```html
<div style="display:flex;flex-wrap:wrap;gap:var(--sc-space-s)">
  <sc-button type="secondary" data-toast data-status="default" data-text="Auto-dismisses after 4 seconds." data-link="Undo">4s (default)</sc-button>
  <sc-button type="secondary" data-toast data-status="default" data-text="Stays until you dismiss it." data-link="Got it" data-duration="0">Persistent (0)</sc-button>
  <sc-button type="secondary" data-toast data-status="info" data-text="Gone in 1 second." data-duration="1000">1s</sc-button>
</div>
```

## Accessibility

- **Announcements:** `status="negative"` renders `role="alert"` (assertive); all other statuses use `role="status"` (polite).
- **Keyboard:** `Esc` dismisses a focused toast; the close × is a real `<button>` labelled “Close notification”.
- **Link:** with `link-href` it’s a real `<a>`; without one it’s a focusable `role="link"` for click handling.
- **Reduced motion:** the exit animation is skipped under `prefers-reduced-motion`.
- **Timing:** auto-dismiss can hide content before it’s read — keep messages short, or use `duration: 0` for anything actionable.
