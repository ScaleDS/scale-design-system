import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { unsafeHTML } from 'lit/directives/unsafe-html.js'

const info16 = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><svg x="1" y="1" width="14" height="14" viewBox="0 0 14 14"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 0C10.866 0 14 3.13401 14 7C14 10.866 10.866 14 7 14C3.13401 14 0 10.866 0 7C0 3.13401 3.13401 0 7 0Z" fill="var(--sc-color-icon-info)"/></svg><svg x="7.5" y="3.433" width="1" height="9.067" viewBox="0 0 1 9.06689"><path d="M0.5 8.56689V2.56689M0.5 0.566667V0.5" stroke="var(--sc-color-icon-inverse)" stroke-linecap="round"/></svg></svg>`
const info24 = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><svg x="2" y="2" width="20" height="20" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0Z" fill="var(--sc-color-icon-info)"/></svg><svg x="11.25" y="6.25" width="1.5" height="11.5" viewBox="0 0 1.5 11.5"><path d="M0.75 10.75V3.75M0.75 0.85V0.75" stroke="var(--sc-color-icon-inverse)" stroke-width="1.5" stroke-linecap="round"/></svg></svg>`
const info32 = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><svg x="2" y="2" width="28" height="28" viewBox="0 0 28 28"><path d="M14 0C21.732 0 28 6.26801 28 14C28 21.732 21.732 28 14 28C6.26801 28 0 21.732 0 14C0 6.26801 6.26801 0 14 0Z" fill="var(--sc-color-icon-info)"/></svg><svg x="15" y="7.867" width="2" height="16.133" viewBox="0 0 2 16.1334"><path d="M1 15.1334V5.13337M1 1.13333V1" stroke="var(--sc-color-icon-inverse)" stroke-width="2" stroke-linecap="round"/></svg></svg>`

const warning16 = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><svg x="1" y="1" width="14" height="14" viewBox="0 0 14 14"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.64388 0.820538C5.99629 0.106734 6.88905 -0.199612 7.63791 0.136296C7.90835 0.257604 8.1335 0.45271 8.2858 0.695368L8.35576 0.820538L13.857 11.9634C14.2094 12.6772 13.888 13.5281 13.1392 13.864C12.9795 13.9357 12.8081 13.9797 12.633 13.9945L12.5011 14H1.49858C0.670935 14 0 13.3605 0 12.5716C0 12.4034 0.0311709 12.2368 0.0917324 12.0795L0.142636 11.9634L5.64388 0.820538Z" fill="var(--sc-color-icon-warning)"/></svg><svg x="7.5" y="4.5" width="1" height="9" viewBox="0 0 1 9"><g transform="translate(0,9) scale(1,-1)"><path d="M0.5 8.5V2.5M0.5 0.566667V0.5" stroke="var(--sc-color-icon-inverse)" stroke-linecap="round"/></g></svg></svg>`
const warning24 = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><svg x="2" y="2" width="20" height="20" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.06269 1.1722C8.56613 0.152477 9.8415 -0.28516 10.9113 0.194709C11.2976 0.368005 11.6193 0.646729 11.8369 0.993383L11.9368 1.1722L19.7957 17.0905C20.2992 18.1102 19.84 19.3259 18.7702 19.8058C18.5421 19.9081 18.2973 19.971 18.0471 19.9921L17.8587 20H2.14082C0.958479 20 0 19.0864 0 17.9594C0 17.7191 0.0445299 17.4812 0.131046 17.2564L0.203766 17.0905L8.06269 1.1722Z" fill="var(--sc-color-icon-warning)"/></svg><svg x="11.25" y="7.25" width="1.5" height="11.6" viewBox="0 0 1.5 11.6"><path d="M0.75 7.75V0.75M0.75 10.85V10.75" stroke="var(--sc-color-icon-inverse)" stroke-width="1.5" stroke-linecap="round"/></svg></svg>`
const warning32 = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><svg x="2" y="2" width="28" height="28" viewBox="0 0 28 28"><path fill-rule="evenodd" clip-rule="evenodd" d="M11.2878 1.64108C11.9926 0.213467 13.7781 -0.399224 15.2758 0.272592C15.8167 0.515208 16.267 0.90542 16.5716 1.39074L16.7115 1.64108L27.714 23.9267C28.4188 25.3543 27.776 27.0563 26.2783 27.7281C25.9589 27.8713 25.6162 27.9594 25.266 27.9889L25.0021 28H2.99715C1.34187 28 0 26.721 0 25.1432C0 24.8067 0.0623419 24.4736 0.183465 24.159L0.285273 23.9267L11.2878 1.64108Z" fill="var(--sc-color-icon-warning)"/></svg><svg x="15" y="10" width="2" height="16.133" viewBox="0 0 2 16.1333"><path d="M1 11V1M1 15.1333V15" stroke="var(--sc-color-icon-inverse)" stroke-width="2" stroke-linecap="round"/></svg></svg>`

const error16 = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><svg x="1" y="1" width="14" height="14" viewBox="0 0 14 14"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 0C10.866 0 14 3.13401 14 7C14 10.866 10.866 14 7 14C3.13401 14 0 10.866 0 7C0 3.13401 3.13401 0 7 0Z" fill="var(--sc-color-icon-negative)"/></svg><svg x="7.5" y="3.5" width="1" height="9" viewBox="0 0 1 9"><g transform="translate(0,9) scale(1,-1)"><path d="M0.5 8.5V2.5M0.5 0.566667V0.5" stroke="var(--sc-color-icon-inverse)" stroke-linecap="round"/></g></svg></svg>`
const error24 = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><svg x="2" y="2" width="20" height="20" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0Z" fill="var(--sc-color-icon-negative)"/></svg><svg x="11.25" y="6.25" width="1.5" height="11.5" viewBox="0 0 1.5 11.5"><path d="M0.75 0.75V7.75M0.75 10.65V10.75" stroke="var(--sc-color-icon-inverse)" stroke-width="1.5" stroke-linecap="round"/></svg></svg>`
const error32 = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><svg x="2" y="2" width="28" height="28" viewBox="0 0 28 28"><path fill-rule="evenodd" clip-rule="evenodd" d="M14 0C21.732 0 28 6.26801 28 14C28 21.732 21.732 28 14 28C6.26801 28 0 21.732 0 14C0 6.26801 6.26801 0 14 0Z" fill="var(--sc-color-icon-negative)"/></svg><svg x="15" y="8" width="2" height="16.133" viewBox="0 0 2 16.1333"><path d="M1 1V11M1 15V15.1333" stroke="var(--sc-color-icon-inverse)" stroke-width="2" stroke-linecap="round"/></svg></svg>`

const success16 = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><svg x="1" y="1" width="14" height="14" viewBox="0 0 14 14"><path fill-rule="evenodd" clip-rule="evenodd" d="M7 0C10.866 0 14 3.13401 14 7C14 10.866 10.866 14 7 14C3.13401 14 0 10.866 0 7C0 3.13401 3.13401 0 7 0Z" fill="var(--sc-color-icon-positive)"/></svg><svg x="4.167" y="4.833" width="7.667" height="6.333" viewBox="0 0 7.6667 6.33336"><path d="M7.16667 0.500029L3.16667 5.83336L0.5 3.1667" stroke="var(--sc-color-icon-inverse)" stroke-linecap="round" stroke-linejoin="round"/></svg></svg>`
const success24 = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><svg x="2" y="2" width="20" height="20" viewBox="0 0 20 20"><path fill-rule="evenodd" clip-rule="evenodd" d="M10 0C15.5228 0 20 4.47715 20 10C20 15.5228 15.5228 20 10 20C4.47715 20 0 15.5228 0 10C0 4.47715 4.47715 0 10 0Z" fill="var(--sc-color-icon-positive)"/></svg><svg x="6.25" y="7.25" width="11.5" height="9.5" viewBox="0 0 11.5 9.50005"><path d="M10.75 0.750044L4.75 8.75004L0.75 4.75004" stroke="var(--sc-color-icon-inverse)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg></svg>`
const success32 = `<svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><svg x="2" y="2" width="28" height="28" viewBox="0 0 28 28"><path fill-rule="evenodd" clip-rule="evenodd" d="M14 0C21.732 0 28 6.26801 28 14C28 21.732 21.732 28 14 28C6.26801 28 0 21.732 0 14C0 6.26801 6.26801 0 14 0Z" fill="var(--sc-color-icon-positive)"/></svg><svg x="8" y="9" width="16" height="13" viewBox="0 0 16 13.0001"><path d="M15 1.00005L6.5 12L1 6.50005" stroke="var(--sc-color-icon-inverse)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></svg>`

type Status = 'info' | 'warning' | 'error' | 'success'
type IconSize = 16 | 24 | 32

const icons: Record<Status, Record<IconSize, string>> = {
  info:    { 16: info16,    24: info24,    32: info32 },
  warning: { 16: warning16, 24: warning24, 32: warning32 },
  error:   { 16: error16,   24: error24,   32: error32 },
  success: { 16: success16, 24: success24, 32: success32 },
}

// The fill token each status uses for its disc (the glyph always uses
// --sc-color-icon-inverse). Inverse mode swaps the two so the disc becomes
// white and the glyph picks up the status colour — used on coloured surfaces
// like sc-toast where the default (coloured disc / white glyph) would vanish.
const discToken: Record<Status, string> = {
  info:    '--sc-color-icon-info',
  warning: '--sc-color-icon-warning',
  error:   '--sc-color-icon-negative',
  success: '--sc-color-icon-positive',
}

@customElement('sc-status-icon')
export class ScStatusIcon extends LitElement {
  @property({ reflect: true }) status: Status = 'info'
  @property({ type: Number, reflect: true }) size: IconSize = 24
  /** Swap disc/glyph colours for use on a status-coloured surface (e.g. sc-toast). */
  @property({ type: Boolean, reflect: true }) inverse = false

  static styles = css`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    svg { display: block; }
  `

  render() {
    let svg = icons[this.status]?.[this.size] ?? icons.info[24]
    if (this.inverse) {
      const disc = discToken[this.status] ?? discToken.info
      // Swap disc colour ↔ inverse glyph colour via a sentinel so the two
      // replacements don't clobber each other.
      svg = svg
        .split(disc).join('__SC_TMP__')
        .split('--sc-color-icon-inverse').join(disc)
        .split('__SC_TMP__').join('--sc-color-icon-inverse')
    }
    return html`${unsafeHTML(svg)}`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-status-icon': ScStatusIcon
  }
}
