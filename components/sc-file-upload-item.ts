import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { textL, textM } from '@scale-ds/scale-design-system/scss/typography'
import { focusRing } from './sc-focus-ring.js'
import { featherIcon } from './feather.js'
import '@scale-ds/scale-design-system/components/sc-progress-bar'
import '@scale-ds/scale-design-system/components/sc-status-icon'

type FileUploadItemState = 'uploaded' | 'uploading' | 'positive' | 'negative'

@customElement('sc-file-upload-item')
export class ScFileUploadItem extends LitElement {
  /** File name shown on the first line. */
  @property() name = ''
  /** Secondary line — file size, status, or an error message. */
  @property() text = ''
  /**
   * Row state:
   * - `uploaded` — resting, file icon + remove button (default)
   * - `uploading` — file icon + progress bar, no remove button
   * - `positive` — success icon, full green bar, remove button
   * - `negative` — error icon, full red bar, remove button
   */
  @property({ reflect: true }) state: FileUploadItemState = 'uploaded'
  /** Upload progress 0–100 (used when state is `uploading`). */
  @property({ type: Number, reflect: true }) value = 0
  @property({ type: Boolean, reflect: true }) disabled = false

  private get _pct(): number {
    if (!Number.isFinite(this.value)) return 0
    return Math.min(100, Math.max(0, this.value))
  }

  static styles = [
    focusRing,
    css`
    :host {
      display: block;
    }

    .row {
      display: flex;
      gap: var(--sc-space-l);
      align-items: flex-start;
      padding: var(--sc-space-l);
      background: var(--sc-color-background-primary);
      border: var(--sc-border-width-s) solid var(--sc-color-border-primary);
      border-radius: var(--sc-border-radius-s);
      box-sizing: border-box;
    }

    /* Positive / negative get a 2px coloured border. The inset shadow supplies
       the second pixel so the row height stays put when state changes. */
    :host([state='positive']) .row {
      border-color: var(--sc-color-border-positive);
      box-shadow: inset 0 0 0 var(--sc-border-width-s) var(--sc-color-border-positive);
    }

    :host([state='negative']) .row {
      border-color: var(--sc-color-border-negative);
      box-shadow: inset 0 0 0 var(--sc-border-width-s) var(--sc-color-border-negative);
    }

    .leading {
      color: var(--sc-color-icon-primary);
      flex-shrink: 0;
      line-height: 0;
    }

    .leading svg,
    .remove svg {
      display: block;
    }

    .content {
      flex: 1 1 0;
      min-width: 0;
      display: flex;
      flex-direction: column;
      gap: var(--sc-space-m);
    }

    .text-block {
      display: flex;
      flex-direction: column;
      gap: var(--sc-space-xs);
      min-width: 0;
    }

    .text-delete {
      display: flex;
      gap: var(--sc-space-m);
      align-items: flex-start;
      width: 100%;
    }

    .text-delete .text-block {
      flex: 1 1 0;
    }

    .name {
      ${textL}
      color: var(--sc-color-text-secondary);
      word-break: break-word;
    }

    .text {
      ${textM}
      color: var(--sc-color-text-tertiary);
    }

    sc-progress-bar {
      display: block;
      width: 100%;
    }

    .remove {
      flex-shrink: 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      padding: 0;
      border: none;
      background: transparent;
      color: var(--sc-color-icon-primary);
      border-radius: var(--sc-border-radius-xs);
      cursor: pointer;
      line-height: 0;
      transition: color 150ms ease;
    }

    /* Zero-specificity reset so the shared focusRing :focus-visible ring wins
       on keyboard focus while no outline shows for pointer focus. */
    :where(.remove) {
      outline: none;
    }

    .remove:disabled {
      color: var(--sc-color-text-disabled);
      cursor: not-allowed;
      pointer-events: none;
    }
  `]

  private _onRemove() {
    if (this.disabled) return
    this.dispatchEvent(new CustomEvent('remove', { bubbles: true, composed: true }))
  }

  private _trash() {
    return html`
      <button
        class="remove"
        type="button"
        part="remove"
        aria-label=${`Remove ${this.name || 'file'}`}
        ?disabled=${this.disabled}
        @click=${this._onRemove}
      >${featherIcon('trash-2', { width: 24, height: 24 })}</button>
    `
  }

  private _textBlock() {
    return html`
      <div class="text-block">
        <span class="name" part="name">${this.name}</span>
        ${this.text ? html`<span class="text" part="text">${this.text}</span>` : null}
      </div>
    `
  }

  private _progress(status: 'uploading' | 'positive' | 'negative') {
    const value = status === 'uploading' ? this._pct : 100
    return html`
      <sc-progress-bar
        part="progress"
        value=${value}
        status=${status}
        label=${`${this.name || 'File'} upload progress`}
      ></sc-progress-bar>
    `
  }

  render() {
    if (this.state === 'positive' || this.state === 'negative') {
      const icon = this.state === 'positive' ? 'success' : 'error'
      return html`
        <div class="row" part="row">
          <span class="leading" part="icon">
            <sc-status-icon status=${icon} size="24"></sc-status-icon>
          </span>
          <div class="content">
            <div class="text-delete">
              ${this._textBlock()}
              ${this._trash()}
            </div>
            ${this._progress(this.state)}
          </div>
        </div>
      `
    }

    // uploaded | uploading — file icon, no status icon
    return html`
      <div class="row" part="row">
        <span class="leading" part="icon">${featherIcon('file', { width: 24, height: 24 })}</span>
        <div class="content">
          ${this._textBlock()}
          ${this.state === 'uploading' ? this._progress('uploading') : null}
        </div>
        ${this.state === 'uploaded' ? this._trash() : null}
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-file-upload-item': ScFileUploadItem
  }
}
