import { LitElement, html, css } from 'lit'
import { customElement, property } from 'lit/decorators.js'

type CardSurface = 'none' | 'subtle' | 'l1' | 'l2' | 'l3' | 'l4'
type CardRadius = 'none' | 'xs' | 's' | 'm' | 'l' | 'xl' | '2xl'
type CardPadding = 'none' | 's' | 'm' | 'l' | 'xl'

@customElement('sc-card')
export class ScCard extends LitElement {
  @property({ reflect: true }) surface: CardSurface = 'l1'
  @property({ reflect: true }) radius: CardRadius = 'm'
  @property({ reflect: true }) padding: CardPadding = 'none'

  static styles = css`
    :host {
      display: flex;
      flex-direction: column;
      align-items: stretch;
      overflow: hidden;
      position: relative;
      box-sizing: border-box;
      transition: background-color 200ms ease, box-shadow 200ms ease;
    }

    /* Surface */
    :host([surface='subtle']) { background: var(--sc-color-background-subtle); }
    :host([surface='l1']) { background: var(--sc-color-surface-l1); box-shadow: var(--sc-shadow-l1); }
    :host([surface='l2']) { background: var(--sc-color-surface-l2); box-shadow: var(--sc-shadow-l2); }
    :host([surface='l3']) { background: var(--sc-color-surface-l3); box-shadow: var(--sc-shadow-l3); }
    :host([surface='l4']) { background: var(--sc-color-surface-l4); box-shadow: var(--sc-shadow-l4); }

    /* Radius */
    :host([radius='xs'])  { border-radius: var(--sc-border-radius-xs); }
    :host([radius='s'])   { border-radius: var(--sc-border-radius-s); }
    :host([radius='m'])   { border-radius: var(--sc-border-radius-m); }
    :host([radius='l'])   { border-radius: var(--sc-border-radius-l); }
    :host([radius='xl'])  { border-radius: var(--sc-border-radius-xl); }
    :host([radius='2xl']) { border-radius: var(--sc-border-radius-2xl); }

    /* Padding */
    :host([padding='s'])  { padding: var(--sc-space-s); }
    :host([padding='m'])  { padding: var(--sc-space-m); }
    :host([padding='l'])  { padding: var(--sc-space-l); }
    :host([padding='xl']) { padding: var(--sc-space-xl); }
  `

  render() {
    return html`<slot></slot>`
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'sc-card': ScCard
  }
}
