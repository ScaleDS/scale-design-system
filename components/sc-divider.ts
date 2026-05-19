import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

type DividerVariant = 'default' | 'subtle' | 'selected'

@customElement('sc-divider')
export class ScDivider extends LitElement {
  @property({ reflect: true }) variant: DividerVariant = 'default'

  static styles = css`
    :host {
      display: block;
      width: 100%;
      height: 1px;
      flex-shrink: 0;
    }

    .line {
      width: 100%;
      height: 1px;
    }

    :host([variant='default']) .line,
    :host(:not([variant])) .line {
      background: var(--sc-color-border-primary);
    }

    :host([variant='subtle']) .line {
      background: var(--sc-color-border-subtle);
    }

    :host([variant='selected']) .line {
      background: var(--sc-color-border-selected);
    }
  `

  render() {
    return html`<div class="line" role="separator"></div>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-divider': ScDivider
  }
}
