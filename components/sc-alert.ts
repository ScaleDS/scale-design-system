import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { headingXs, textL } from '@scale-ds/scale-design-system/scss/typography'
import '@scale-ds/scale-design-system/components/sc-status-icon'
import { focusRing } from './sc-focus-ring.js'

type AlertStatus = 'info' | 'warning' | 'negative' | 'positive'

/**
 * Boolean attribute that respects an explicit string value. Unlike Lit's
 * built-in Boolean converter (where any present attribute is `true`), this
 * treats `="false"` as `false`, so `show-heading="false"` works as written.
 */
const booleanString = {
  fromAttribute: (value: string | null) => value !== null && value !== 'false',
  toAttribute: (value: boolean) => (value ? null : 'false'),
}

const statusIconMap: Record<AlertStatus, string> = {
  info: 'info',
  warning: 'warning',
  negative: 'error',
  positive: 'success',
}

@customElement('sc-alert')
export class ScAlert extends LitElement {
  @property({ reflect: true }) status: AlertStatus = 'info'
  @property({ attribute: 'show-heading', converter: booleanString, reflect: true }) showHeading: boolean = true
  @property({ attribute: 'show-actions', converter: booleanString, reflect: true }) showActions: boolean = true
  @property({ attribute: 'show-action-2', converter: booleanString, reflect: true }) showAction2: boolean = true

  static styles = [
    focusRing,
    css`
    :host {
      display: block;
    }

    .alert {
      display: flex;
      align-items: flex-start;
      gap: var(--sc-space-m);
      padding: var(--sc-space-l);
      border-radius: var(--sc-border-radius-s);
      min-width: 370px;
      max-width: 370px;
      box-sizing: border-box;
    }

    /* ---- Status backgrounds ---- */
    :host([status='info']) .alert {
      background: var(--sc-color-background-info-subtle);
    }
    :host([status='warning']) .alert {
      background: var(--sc-color-background-warning-subtle);
    }
    :host([status='negative']) .alert {
      background: var(--sc-color-background-negative-subtle);
    }
    :host([status='positive']) .alert {
      background: var(--sc-color-background-positive-subtle);
    }

    /* ---- Icon ---- */
    .icon {
      flex-shrink: 0;
    }

    /* ---- Content ---- */
    .content {
      display: flex;
      flex: 1 0 0;
      flex-direction: column;
      gap: var(--sc-space-s);
      align-items: flex-start;
      min-width: 0;
    }

    .text-group {
      display: flex;
      flex-direction: column;
      gap: var(--sc-space-xs);
      width: 100%;
      word-break: break-word;
    }

    .heading {
      ${headingXs}
      color: var(--sc-color-text-primary);
      margin: 0;
    }

    .body {
      ${textL}
      color: var(--sc-color-text-secondary);
      margin: 0;
    }

    /* ---- Actions ---- */
    .actions {
      display: flex;
      gap: var(--sc-space-l);
      align-items: flex-start;
    }

    .action {
      display: flex;
      flex-direction: column;
      gap: 0;
      align-items: center;
      padding: var(--sc-space-xs) 0;
      cursor: pointer;
      background: none;
      border: none;
      font-family: inherit;
      ${headingXs}
      font-size: var(--sc-type-size-m);
      line-height: var(--sc-type-line-height-m);
      letter-spacing: var(--sc-type-letter-spacing-none);
      color: var(--sc-color-text-link);
      text-decoration: none;
      white-space: nowrap;
    }

    .action:hover {
      color: var(--sc-color-text-link-hover);
    }

    .action:focus-visible {
      border-radius: var(--sc-border-radius-xs);
    }
  `]

  render() {
    const iconStatus = statusIconMap[this.status]

    return html`
      <div class="alert" role="alert">
        <span class="icon">
          <sc-status-icon status=${iconStatus} size="24"></sc-status-icon>
        </span>
        <div class="content">
          <div class="text-group">
            ${this.showHeading ? html`<h4 class="heading"><slot name="heading">Heading</slot></h4>` : ''}
            <p class="body"><slot>Text</slot></p>
          </div>
          ${this.showActions ? html`
            <div class="actions">
              <button class="action" type="button"><slot name="action">Action</slot></button>
              ${this.showAction2 ? html`<button class="action" type="button"><slot name="action-2">Action 2</slot></button>` : ''}
            </div>
          ` : ''}
        </div>
      </div>
    `
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-alert': ScAlert
  }
}
