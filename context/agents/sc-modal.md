---
tag: sc-modal
class: ScModal
category: feedback
import: @scale-ds/scale-design-system/components/sc-modal
dependencies: [sc-button-icon]
props:
  open: { type: boolean, default: false }
  heading: { type: string, default: "" }
  closeLabel: { type: string, default: Close, attr: close-label }
  noDismiss: { type: boolean, default: false, attr: no-dismiss }
slots: [heading, default, actions]
events: [sc-open, sc-close]
cssParts: [dialog, modal, header, heading, close, body, actions]
roles: [document]
source:
  guidance: guidance/components/modal.html
  lit: "https://github.com/ScaleDS/scale-design-system/blob/main/components/sc-modal.ts"
  figma: "https://www.figma.com/design/BDgzx7fkrNoRK87uZX6sFw/Scale.Design-System--3.2.0-?node-id=6757-14019"
  framer: "https://scaleframer.framer.website/components/modal"
  docs: "https://scaledesignsystem.com/components/modal/"
---

# sc-modal

A full-focus overlay window for critical information, forms, or workflows that need undivided attention. Built on the native `<dialog>` element, so focus trapping, top-layer rendering, and focus restoration come for free.

## When to use

confirmations, focused tasks, and short forms that must interrupt the current flow. Call `show()` to open and `close()` to dismiss — Escape and backdrop clicks also dismiss unless `no-dismiss` is set.

## Do

- Reserve modals for tasks that genuinely must interrupt the flow.
- Give a clear `heading` and put the primary action last.
- Keep content short; for long flows use a dedicated page instead.

## Don't

- Don’t stack modals on modals — finish one before opening another.
- Don’t use `no-dismiss` unless an action is truly required.
- Don’t bury critical info in a modal the user will reflexively dismiss.

## Examples

### With actions

Slot footer buttons into `actions`; the footer hides itself when empty.

```html
<div>
  <sc-button onclick="this.nextElementSibling.show()">Open modal</sc-button>
  <sc-modal heading="Heading">
    <p style="margin:0;color:var(--sc-color-text-secondary)">Modal body content goes here. Background content is inert while the modal is open, and focus is trapped within it.</p>
    <sc-button slot="actions" type="secondary" onclick="this.closest('sc-modal').close()">Cancel</sc-button>
    <sc-button slot="actions" type="primary" onclick="this.closest('sc-modal').close()">Confirm</sc-button>
  </sc-modal>
</div>
```

### Slotted — radio group

```html
<div>
  <sc-button onclick="this.nextElementSibling.show()">Open modal</sc-button>
  <sc-modal heading="Choose a plan">
    <div role="radiogroup" aria-label="Plan" style="display:flex;flex-direction:column;gap:var(--sc-space-s)">
      <sc-radio name="modal-plan" value="free" checked>Free</sc-radio>
      <sc-radio name="modal-plan" value="starter">Starter</sc-radio>
      <sc-radio name="modal-plan" value="pro">Pro</sc-radio>
      <sc-radio name="modal-plan" value="team">Team</sc-radio>
      <sc-radio name="modal-plan" value="enterprise">Enterprise</sc-radio>
    </div>
    <sc-button slot="actions" type="secondary" onclick="this.closest('sc-modal').close()">Cancel</sc-button>
    <sc-button slot="actions" type="primary" onclick="this.closest('sc-modal').close()">Confirm</sc-button>
  </sc-modal>
</div>
```

### Slotted — login form

Flags empty required fields and only closes when valid.

```html
<div>
  <sc-button onclick="this.nextElementSibling.show()">Open modal</sc-button>
  <sc-modal heading="Sign in">
    <div style="display:flex;flex-direction:column;gap:var(--sc-space-l)">
      <sc-button type="secondary" style="width:100%"><svg slot="" width="18" height="18" viewBox="0 0 18 18" aria-hidden="true"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"/></svg>Continue with Google</sc-button>
      <div style="display:flex;align-items:center;gap:var(--sc-space-m)">
        <sc-divider variant="subtle" style="flex:1"></sc-divider>
        <span style="color:var(--sc-color-text-secondary);font-size:var(--sc-type-size-m)">or</span>
        <sc-divider variant="subtle" style="flex:1"></sc-divider>
      </div>
      <sc-input data-signin-field label="Email" type="email" placeholder="you@example.com" required show-help-text="false"></sc-input>
      <sc-input data-signin-field label="Password" type="password" placeholder="••••••••" required show-help-text="false"></sc-input>
    </div>
    <sc-button slot="actions" type="primary" data-signin-submit>Sign in</sc-button>
  </sc-modal>
</div>
```

### Slotted — date picker

```html
<div>
  <sc-button onclick="this.nextElementSibling.show()">Open modal</sc-button>
  <sc-modal heading="Select a date">
    <sc-date-picker mode="single" value="2011-04-15" style="width:100%"></sc-date-picker>
    <sc-button slot="actions" type="secondary" onclick="this.closest('sc-modal').close()">Cancel</sc-button>
    <sc-button slot="actions" type="primary" onclick="this.closest('sc-modal').close()">Confirm</sc-button>
  </sc-modal>
</div>
```

### Single action

```html
<div>
  <sc-button onclick="this.nextElementSibling.show()">Open modal</sc-button>
  <sc-modal heading="Delete file?">
    <p style="margin:0;color:var(--sc-color-text-secondary)">This action cannot be undone.</p>
    <sc-button slot="actions" type="primary" onclick="this.closest('sc-modal').close()">Got it</sc-button>
  </sc-modal>
</div>
```

### Body only

With no `actions` slot, the footer is hidden.

```html
<div>
  <sc-button onclick="this.nextElementSibling.show()">Open modal</sc-button>
  <sc-modal heading="About">
    <p style="margin:0;color:var(--sc-color-text-secondary)">A modal with no footer actions — dismiss with the close button, Escape, or a backdrop click.</p>
  </sc-modal>
</div>
```

### Non-dismissable

`no-dismiss` disables Escape and backdrop clicks — the user must choose an action.

```html
<div>
  <sc-button onclick="this.nextElementSibling.show()">Open modal</sc-button>
  <sc-modal heading="Action required" no-dismiss>
    <p style="margin:0;color:var(--sc-color-text-secondary)">Escape and backdrop clicks are disabled — you must choose an action.</p>
    <sc-button slot="actions" type="primary" onclick="this.closest('sc-modal').close()">Acknowledge</sc-button>
  </sc-modal>
</div>
```

## Accessibility

- **Native dialog:** built on `<dialog>.showModal()` — focus is trapped, background content is inert, and focus returns to the trigger on close (WAI-ARIA APG Dialog pattern).
- **Heading:** the `heading` renders an `<h2>` that names the dialog; always provide one.
- **Dismiss:** `Esc` and backdrop clicks close it (unless `no-dismiss`); the close button is a labelled `sc-button-icon`.
- **Scroll lock:** body scrolling is locked while open so the page behind doesn’t move.
- **Events:** emits `sc-open` and `sc-close` for wiring side effects.
