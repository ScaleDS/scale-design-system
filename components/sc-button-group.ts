import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

type ButtonGroupGap = 'xs' | 's' | 'm' | 'l'
type ButtonGroupOrientation = 'horizontal' | 'vertical'
type ButtonGroupAlign = 'start' | 'center' | 'end' | 'stretch'

@customElement('sc-button-group')
export class ScButtonGroup extends LitElement {
  @property({ reflect: true }) gap: ButtonGroupGap = 'm'
  @property({ reflect: true }) orientation: ButtonGroupOrientation = 'horizontal'
  @property({ reflect: true }) align: ButtonGroupAlign = 'start'
  @property({ type: Boolean, reflect: true }) nowrap = false
  @property({ type: Boolean, reflect: true }) selectable = false
  @property({ reflect: true }) value = ''
  @property() label = ''

  static styles = css`
    :host {
      display: inline-flex;
    }

    .group {
      display: flex;
      flex-wrap: wrap;
      gap: var(--sc-space-m);
      align-items: flex-start;
      align-content: flex-start;
    }

    :host([orientation='vertical']) .group {
      flex-direction: column;
    }

    :host([gap='xs']) .group { gap: var(--sc-space-xs); }
    :host([gap='s']) .group  { gap: var(--sc-space-s); }
    :host([gap='m']) .group  { gap: var(--sc-space-m); }
    :host([gap='l']) .group  { gap: var(--sc-space-l); }

    :host([align='start']) .group   { align-items: flex-start; }
    :host([align='center']) .group  { align-items: center; }
    :host([align='end']) .group     { align-items: flex-end; }
    :host([align='stretch']) .group { align-items: stretch; }

    :host([nowrap]) .group {
      flex-wrap: nowrap;
    }
  `

  private _getSelectableChildren(): HTMLElement[] {
    const slot = this.shadowRoot?.querySelector('slot') as HTMLSlotElement | null
    if (!slot) return []
    return slot
      .assignedElements({ flatten: true })
      .filter((el): el is HTMLElement => el instanceof HTMLElement && el.hasAttribute('value'))
  }

  private _applySelection() {
    if (!this.selectable) return
    const children = this._getSelectableChildren()
    for (const child of children) {
      const isActive = child.getAttribute('value') === this.value
      child.setAttribute('type', isActive ? 'primary' : 'secondary')
      child.setAttribute('aria-checked', String(isActive))
      child.setAttribute('role', 'radio')
    }
  }

  private _onClick = (e: MouseEvent) => {
    if (!this.selectable) return
    const path = e.composedPath()
    const pill = path.find(
      n => n instanceof HTMLElement && n.hasAttribute && n.hasAttribute('value') && this.contains(n),
    ) as HTMLElement | undefined
    if (!pill) return
    if (pill.hasAttribute('disabled')) return
    const value = pill.getAttribute('value') || ''
    if (value === this.value) return
    this.value = value
    this.dispatchEvent(new CustomEvent('change', {
      detail: { value },
      bubbles: true,
      composed: true,
    }))
  }

  private _onSlotChange = () => {
    this._applySelection()
  }

  protected updated(changed: Map<string, unknown>) {
    if (changed.has('value') || changed.has('selectable')) {
      this._applySelection()
    }
  }

  render() {
    return html`
      <div
        class="group"
        role=${this.selectable ? 'radiogroup' : 'group'}
        aria-label=${this.label || (this.selectable ? 'Selection' : 'Button group')}
        aria-orientation=${this.orientation}
        @click=${this._onClick}
      >
        <slot @slotchange=${this._onSlotChange}></slot>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-button-group': ScButtonGroup
  }
}
