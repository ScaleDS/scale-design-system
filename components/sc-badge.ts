import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { textS } from '@scale-ds/scale-design-system/scss/typography'
import { featherIcon } from './feather'

type BadgeStatus = 'default' | 'info' | 'warning' | 'negative' | 'positive' | 'mono' | 'disabled'

@customElement('sc-badge')
export class ScBadge extends LitElement {
  @property({ reflect: true }) status: BadgeStatus = 'default'
  @property() icon = ''

  static styles = css`
    :host {
      display: inline-flex;
    }

    .badge {
      display: inline-flex;
      align-items: center;
      gap: var(--sc-space-xs);
      padding: var(--sc-space-xs) var(--sc-space-s);
      border-radius: var(--sc-border-radius-l);
      border: var(--sc-border-width-s) solid transparent;
      ${textS}
      white-space: nowrap;
    }

    /* ---- Status variants ---- */

    :host([status='default']) .badge {
      background: var(--sc-color-background-primary);
      border-color: var(--sc-color-border-primary);
      color: var(--sc-color-text-primary);
    }

    :host([status='info']) .badge {
      background: var(--sc-color-background-info-subtle);
      border-color: var(--sc-color-border-info);
      color: var(--sc-color-text-secondary);
    }

    :host([status='warning']) .badge {
      background: var(--sc-color-background-warning-subtle);
      border-color: var(--sc-color-border-warning);
      color: var(--sc-color-text-secondary);
    }

    :host([status='negative']) .badge {
      background: var(--sc-color-background-negative-subtle);
      border-color: var(--sc-color-border-negative);
      color: var(--sc-color-text-secondary);
    }

    :host([status='positive']) .badge {
      background: var(--sc-color-background-positive-subtle);
      border-color: var(--sc-color-border-positive);
      color: var(--sc-color-text-secondary);
    }

    :host([status='mono']) .badge {
      background: var(--sc-color-background-inverse);
      border-color: transparent;
      color: var(--sc-color-text-primary-inverse);
    }

    :host([status='disabled']) .badge {
      background: var(--sc-color-background-disabled);
      border-color: var(--sc-color-border-disabled);
      color: var(--sc-color-text-disabled);
      cursor: not-allowed;
    }

    svg {
      display: block;
      flex-shrink: 0;
      width: 16px;
      height: 16px;
    }
  `

  render() {
    return html`
      <span class="badge">
        <slot></slot>
        ${featherIcon(this.icon)}
      </span>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-badge': ScBadge
  }
}
