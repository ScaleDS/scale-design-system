import { LitElement, html, css } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'
import { linkL, textL, textM } from '@scale-ds/scale-design-system/scss/typography'
import { focusRing } from './sc-focus-ring.js'
import { featherIcon } from './feather.js'
import '@scale-ds/scale-design-system/components/sc-file-upload-item'

type FileUploadLayout = 'vertical' | 'horizontal'

type ItemState = 'uploaded' | 'uploading' | 'negative'

interface TrackedFile {
  id: number
  file: File
  state: ItemState
  progress: number
  error?: string
}

@customElement('sc-file-upload')
export class ScFileUpload extends LitElement {
  static formAssociated = true

  /** Vertical = desktop dropzone (centred, large icon); horizontal = compact row. */
  @property({ reflect: true }) layout: FileUploadLayout = 'vertical'
  /** Mirrors the native input `accept` attribute, e.g. `image/*,.pdf`. */
  @property() accept = ''
  @property({ type: Boolean, reflect: true }) multiple = false
  @property({ type: Boolean, reflect: true }) disabled = false
  @property({ type: Boolean, reflect: true }) required = false
  /** Form field name. Each selected file is appended under this name. */
  @property() name = ''
  /** Max size per file in bytes. `0` disables the check. */
  @property({ type: Number, attribute: 'max-size' }) maxSize = 0
  /** Helper copy under the Browse line. */
  @property({ attribute: 'secondary-text' }) secondaryText = 'Files can be up to 5mb.'
  @property({ type: Boolean, attribute: 'show-secondary-text', reflect: true }) showSecondaryText = true

  @state() private _files: TrackedFile[] = []
  @state() private _dragover = false
  @state() private _announce = ''

  private _internals = this.attachInternals()
  private _nextId = 0
  private _timers = new Map<number, number>()

  disconnectedCallback() {
    super.disconnectedCallback()
    this._timers.forEach((t) => window.clearInterval(t))
    this._timers.clear()
  }

  get form() { return this._internals.form }
  get validity() { return this._internals.validity }
  get validationMessage() { return this._internals.validationMessage }
  get willValidate() { return this._internals.willValidate }
  checkValidity() { return this._internals.checkValidity() }
  reportValidity() { return this._internals.reportValidity() }

  /** Currently accepted (non-errored) files. */
  get files(): File[] {
    return this._files.filter((f) => !f.error).map((f) => f.file)
  }

  formResetCallback() {
    this._timers.forEach((t) => window.clearInterval(t))
    this._timers.clear()
    this._files = []
    this._announce = ''
    this._syncForm()
  }

  formDisabledCallback(disabled: boolean) {
    this.disabled = disabled
  }

  static styles = [
    focusRing,
    css`
    :host {
      display: block;
    }

    .root {
      display: flex;
      flex-direction: column;
      gap: var(--sc-space-s);
    }

    .dropzone {
      display: flex;
      gap: var(--sc-space-l);
      background: var(--sc-color-background-primary);
      border: var(--sc-border-width-s) dashed var(--sc-color-border-primary);
      border-radius: var(--sc-border-radius-s);
      box-sizing: border-box;
      cursor: pointer;
      position: relative;
      transition: border-color 150ms ease, background 150ms ease, box-shadow 150ms ease;
    }

    :host([layout='vertical']) .dropzone {
      flex-direction: column;
      align-items: center;
      text-align: center;
      padding: var(--sc-space-xl);
    }

    :host([layout='horizontal']) .dropzone {
      flex-direction: row;
      align-items: flex-start;
      justify-content: center;
      padding: var(--sc-space-l);
    }

    :host(:not([disabled])) .dropzone:hover,
    .dropzone[data-dragover] {
      background: var(--sc-color-background-hover);
      border-style: solid;
      border-color: var(--sc-color-border-focus);
      /* Keep border at 1px so the content box doesn't shift; the inset shadow
         adds the second pixel to match Figma's 2px solid hover border. */
      box-shadow: inset 0 0 0 var(--sc-border-width-s) var(--sc-color-border-focus);
    }

    :host([disabled]) .dropzone {
      cursor: not-allowed;
      background: var(--sc-color-background-disabled);
      border-color: var(--sc-color-border-disabled);
    }

    .cloud {
      color: var(--sc-color-icon-primary);
      flex-shrink: 0;
      line-height: 0;
    }

    .cloud svg {
      display: block;
    }

    :host([disabled]) .cloud {
      color: var(--sc-color-text-disabled);
    }

    .content {
      display: flex;
      flex-direction: column;
      gap: var(--sc-space-xs);
    }

    :host([layout='vertical']) .content {
      align-items: center;
      width: 100%;
    }

    :host([layout='horizontal']) .content {
      flex: 1 1 0;
      min-width: 0;
      align-items: flex-start;
    }

    .browse-line {
      display: flex;
      flex-wrap: wrap;
      gap: var(--sc-space-xs);
      justify-content: center;
    }

    :host([layout='horizontal']) .browse-line {
      justify-content: flex-start;
    }

    .browse {
      ${linkL}
      margin: 0;
      padding: 0;
      border: none;
      background: none;
      color: var(--sc-color-text-link);
      cursor: pointer;
    }

    /* Zero-specificity reset so the shared focusRing :focus-visible ring wins
       on keyboard focus while no outline shows for pointer focus. */
    :where(.browse) {
      outline: none;
    }

    :host(:not([disabled])) .browse:hover {
      color: var(--sc-color-text-link-hover);
      text-decoration: underline;
    }

    :host([disabled]) .browse {
      color: var(--sc-color-text-disabled);
      cursor: not-allowed;
    }

    .muted {
      ${textL}
      color: var(--sc-color-text-secondary);
    }

    .secondary {
      ${textM}
      color: var(--sc-color-text-tertiary);
    }

    :host([disabled]) .muted,
    :host([disabled]) .secondary {
      color: var(--sc-color-text-disabled);
    }

    .list {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: var(--sc-space-s);
    }

    .native,
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      white-space: nowrap;
      border: 0;
    }
  `]

  private _input(): HTMLInputElement | null {
    return this.shadowRoot?.querySelector('input.native') ?? null
  }

  private _dropzoneEl(): HTMLElement | undefined {
    return (this.shadowRoot?.querySelector('.dropzone') as HTMLElement) ?? undefined
  }

  private _open = () => {
    if (this.disabled) return
    this._input()?.click()
  }

  private _onInputChange(e: Event) {
    const input = e.target as HTMLInputElement
    this._addFiles(input.files)
    // Reset so selecting the same file again still fires `change`.
    input.value = ''
  }

  private _onDragOver(e: DragEvent) {
    if (this.disabled) return
    e.preventDefault()
    this._dragover = true
  }

  private _onDragLeave(e: DragEvent) {
    // Ignore leaves that move onto a child element of the dropzone.
    if (e.relatedTarget && (e.currentTarget as Node).contains(e.relatedTarget as Node)) return
    this._dragover = false
  }

  private _onDrop(e: DragEvent) {
    e.preventDefault()
    this._dragover = false
    if (this.disabled) return
    this._addFiles(e.dataTransfer?.files)
  }

  private _addFiles(list?: FileList | null) {
    if (this.disabled || !list || !list.length) return
    const incoming = Array.from(list)
    const next: TrackedFile[] = this.multiple ? [...this._files] : []
    const started: number[] = []
    const added: string[] = []
    for (const file of incoming) {
      const tooBig = this.maxSize > 0 && file.size > this.maxSize
      const id = this._nextId++
      if (tooBig) {
        next.push({ id, file, state: 'negative', progress: 100, error: `File exceeds the ${this._formatSize(this.maxSize)} limit.` })
      } else {
        next.push({ id, file, state: 'uploading', progress: 0 })
        started.push(id)
      }
      added.push(file.name)
      if (!this.multiple) break
    }
    this._files = next
    this._announce = `${added.join(', ')} added`
    this._syncForm()
    this._emitChange()
    // Drive each new file's progress; consumers wiring a real upload can stop
    // the simulation by removing/replacing the element's behaviour.
    started.forEach((id) => this._startUpload(id))
  }

  // Simulates upload progress for a tracked file: ticks to 100, then settles
  // into the resting `uploaded` state. SSR-safe — only runs after a user adds a file.
  private _startUpload(id: number) {
    const timer = window.setInterval(() => {
      const tf = this._files.find((f) => f.id === id)
      if (!tf) {
        window.clearInterval(timer)
        this._timers.delete(id)
        return
      }
      tf.progress = Math.min(100, tf.progress + 10)
      if (tf.progress >= 100) {
        tf.state = 'uploaded'
        window.clearInterval(timer)
        this._timers.delete(id)
      }
      this._files = [...this._files]
    }, 150)
    this._timers.set(id, timer)
  }

  private _removeId(id: number) {
    const timer = this._timers.get(id)
    if (timer !== undefined) {
      window.clearInterval(timer)
      this._timers.delete(id)
    }
    const removed = this._files.find((f) => f.id === id)
    this._files = this._files.filter((f) => f.id !== id)
    this._announce = removed ? `${removed.file.name} removed` : ''
    this._syncForm()
    this._emitChange()
    this.dispatchEvent(new CustomEvent('remove', {
      detail: { file: removed?.file },
      bubbles: true,
      composed: true,
    }))
  }

  private _emitChange() {
    this.dispatchEvent(new CustomEvent('change', {
      detail: { files: this.files },
      bubbles: true,
      composed: true,
    }))
  }

  private _syncForm() {
    const valid = this._files.filter((f) => !f.error)
    if (!valid.length) {
      this._internals.setFormValue(null)
    } else {
      const data = new FormData()
      const field = this.name || 'files'
      for (const f of valid) data.append(field, f.file)
      this._internals.setFormValue(data)
    }
    if (this.required && !valid.length) {
      this._internals.setValidity({ valueMissing: true }, 'Please select a file.', this._dropzoneEl())
    } else {
      this._internals.setValidity({})
    }
  }

  private _formatSize(bytes: number): string {
    const units = ['B', 'KB', 'MB', 'GB']
    let n = bytes
    let i = 0
    while (n >= 1024 && i < units.length - 1) {
      n /= 1024
      i++
    }
    return `${i === 0 ? n : n.toFixed(1)} ${units[i]}`
  }

  render() {
    const iconSize = this.layout === 'horizontal' ? 24 : 32
    const tail = this.layout === 'horizontal' ? 'to upload' : 'or drop to upload'

    return html`
      <div class="root">
        <div
          class="dropzone"
          part="dropzone"
          ?data-dragover=${this._dragover}
          @click=${this._open}
          @dragenter=${this._onDragOver}
          @dragover=${this._onDragOver}
          @dragleave=${this._onDragLeave}
          @drop=${this._onDrop}
        >
          <span class="cloud" part="icon">${featherIcon('upload-cloud', { width: iconSize, height: iconSize })}</span>
          <div class="content">
            <div class="browse-line">
              <button class="browse" type="button" part="browse" ?disabled=${this.disabled}>Browse</button>
              <span class="muted">${tail}</span>
            </div>
            ${this.showSecondaryText && this.secondaryText
              ? html`<span class="secondary">${this.secondaryText}</span>`
              : null}
          </div>
          <input
            class="native"
            type="file"
            tabindex="-1"
            aria-hidden="true"
            ?multiple=${this.multiple}
            ?disabled=${this.disabled}
            accept=${this.accept}
            @click=${(e: Event) => e.stopPropagation()}
            @change=${this._onInputChange}
          />
        </div>

        ${this._files.length
          ? html`
            <ul class="list" part="list">
              ${this._files.map((f) => html`
                <li>
                  <sc-file-upload-item
                    name=${f.file.name}
                    text=${f.error ?? this._formatSize(f.file.size)}
                    state=${f.state}
                    value=${f.progress}
                    ?disabled=${this.disabled}
                    @remove=${() => this._removeId(f.id)}
                  ></sc-file-upload-item>
                </li>
              `)}
            </ul>`
          : null}

        <div class="sr-only" role="status" aria-live="polite">${this._announce}</div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-file-upload': ScFileUpload
  }
}
