import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import '@scale/design-system/components/sc-status-icon'

type HelpTextStatus = 'default' | 'info' | 'warning' | 'negative' | 'positive' | 'disabled'
type HelpTextSize = 'l' | 'm' | 's'

const statusIconMap: Partial<Record<HelpTextStatus, string>> = {
  info:     'info',
  warning:  'warning',
  negative: 'error',
  positive: 'success',
}

@customElement('sc-help-text')
export class ScHelpText extends LitElement {
  @property({ reflect: true }) status: HelpTextStatus = 'default'
  @property({ reflect: true }) size: HelpTextSize = 'l'
  @property() text = 'Help text'

  static styles = css`
    :host {
      display: flex;
      align-items: flex-start;
      gap: 0;
    }

    :host([status='info']),
    :host([status='warning']),
    :host([status='negative']),
    :host([status='positive']) {
      gap: var(--sc-space-s);
    }

    .icon {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      flex-shrink: 0;
    }

    /* M and S sizes need a small top offset to align icon with first line of text */
    :host([size='m']) .icon,
    :host([size='s']) .icon {
      padding-top: var(--sc-space-2xs);
    }

    p {
      font-family: var(--sc-type-family-inter), system-ui, sans-serif;
      font-weight: var(--sc-type-weight-regular);
      letter-spacing: var(--sc-type-letter-spacing-none);
      color: var(--sc-color-text-secondary);
      margin: 0;
      flex: 1;
    }

    :host([size='l']) p {
      font-size: var(--sc-type-size-l);
      line-height: var(--sc-type-line-height-l);
    }

    :host([size='m']) p {
      font-size: var(--sc-type-size-m);
      line-height: var(--sc-type-line-height-m);
    }

    :host([size='s']) p {
      font-size: var(--sc-type-size-s);
      line-height: var(--sc-type-line-height-s);
    }

    :host([status='disabled']) p {
      color: var(--sc-color-text-disabled);
    }
  `

  render() {
    const iconStatus = statusIconMap[this.status]
    const iconSize = this.size === 'l' ? 24 : 16

    return html`
      ${iconStatus ? html`
        <span class="icon">
          <sc-status-icon status=${iconStatus} size=${iconSize}></sc-status-icon>
        </span>
      ` : ''}
      <p>${this.text}</p>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-help-text': ScHelpText
  }
}
