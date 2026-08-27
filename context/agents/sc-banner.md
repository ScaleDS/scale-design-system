---
tag: sc-banner
class: ScBanner
category: feedback
import: @scale-ds/scale-design-system/components/sc-banner
dependencies: [sc-status-icon]
props:
  status: { type: enum, default: info, values: [info, warning, negative, positive, mono] }
  hideClose: { type: boolean, default: false, attr: hide-close }
  hideLink: { type: boolean, default: false, attr: hide-link }
  linkHref: { type: string, default: "", attr: link-href }
  link: { type: string, default: "" }
  text: { type: string, default: "" }
events: [close]
roles: [status]
useInstead: [sc-alert, sc-toast]
source:
  guidance: guidance/components/banner.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-banner.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=9704-76167"
  framer: "https://scaleframer.framer.website/components/banner"
  docs: "https://scaledesignsystem.com/components/banner/"
---

# sc-banner

Full-width messages pinned to the top of the page for system-wide announcements or important notices.

## When to use

page-level announcements, system status, marketing messages, and dismissable notices. For alerts scoped to a card use `sc-alert`.

## When not to use

- Don’t use a banner for card- or section-scoped messages — use `sc-alert`.
- Don’t use it for transient confirmations — use `sc-toast`.

## Do

- Reserve banners for page-level, system-wide messages.
- Show one at a time and let the reader dismiss it.
- Keep it to a single line with one optional link.

## Don't

- Don’t use a banner for card- or section-scoped messages — use `sc-alert`.
- Don’t stack multiple banners on a page.
- Don’t use it for transient confirmations — use `sc-toast`.

## Examples

### Status variants

Click a trigger — the banner fades in full-width at the top of the page. Five semantic statuses set the icon and background colour. Banners are persistent: only one shows at a time, and it stays until the reader dismisses it with the close button (or `Esc` while focused).

```html
<div style="display:flex;flex-wrap:wrap;gap:var(--sc-space-s)">
  <sc-button data-banner data-status="info" data-text="Information message text." data-link="Learn more">Info</sc-button>
  <sc-button type="secondary" data-banner data-status="warning" data-text="Warning message text." data-link="Learn more">Warning</sc-button>
  <sc-button type="secondary" data-banner data-status="negative" data-text="Error message text." data-link="Learn more">Negative</sc-button>
  <sc-button type="secondary" data-banner data-status="positive" data-text="Success message text." data-link="Learn more">Positive</sc-button>
  <sc-button type="secondary" data-banner data-status="mono" data-text="Mono banner text." data-link="Learn more">Mono</sc-button>
</div>
```

### Options

Drop the trailing link with `hide-link`, or turn the link into a real anchor with `link-href`.

```html
<div style="display:flex;flex-wrap:wrap;gap:var(--sc-space-s)">
  <sc-button type="secondary" data-banner data-status="info" data-text="Banner without a link." data-hide-link>Without link</sc-button>
  <sc-button type="secondary" data-banner data-status="info" data-text="Click the link to learn more." data-link="Learn more" data-link-href="#">With link href</sc-button>
</div>
```

## Accessibility

- **Role:** the banner is `role="status"` labelled “Notification”, so it’s announced politely without stealing focus.
- **Dismiss:** a close button removes it; `Esc` closes it while focused.
- **Not colour alone:** each status pairs its colour with a distinct `sc-status-icon`.
- **Focus:** the link and close button show the global keyboard focus ring.
