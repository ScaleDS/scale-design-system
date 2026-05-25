import { css } from 'lit'

// Shared variant table for sc-button and sc-button-pill. Covers the 10 type
// variants they have in common, plus disabled, loading, and the spinner.
// sc-button extends with text/text-mono/negative-text variants locally.
// sc-button-icon intentionally doesn't use this — its colors and semantics differ.
export const buttonVariants = css`
  /* ---- Types ---- */

  /* Primary */
  :host([type='primary']) button {
    background: var(--sc-color-background-brand);
    color: var(--sc-color-text-primary-inverse);
  }
  :host([type='primary']) button:hover {
    background: var(--sc-color-background-brand-hover);
  }
  :host([type='primary']) button:active {
    background: var(--sc-color-background-brand-pressed);
  }

  /* Secondary */
  :host([type='secondary']) button {
    background: var(--sc-color-background-neutral);
    color: var(--sc-color-text-primary);
  }
  :host([type='secondary']) button:hover {
    background: var(--sc-color-background-neutral-hover);
  }
  :host([type='secondary']) button:active {
    background: var(--sc-color-background-neutral-pressed);
  }

  /* Tertiary */
  :host([type='tertiary']) button {
    background: transparent;
    color: var(--sc-color-text-primary);
  }
  :host([type='tertiary']) button:hover {
    background: var(--sc-color-background-hover);
  }
  :host([type='tertiary']) button:active {
    background: var(--sc-color-background-pressed);
  }

  /* Tertiary Mono */
  :host([type='tertiary-mono']) button {
    background: transparent;
    color: var(--sc-color-text-primary);
  }
  :host([type='tertiary-mono']) button:hover {
    background: var(--sc-color-background-hover);
  }
  :host([type='tertiary-mono']) button:active {
    background: var(--sc-color-background-pressed);
  }

  /* Inverse */
  :host([type='inverse']) button {
    background: var(--sc-color-background-inverse);
    color: var(--sc-color-text-primary-inverse);
  }
  :host([type='inverse']) button:hover {
    opacity: 0.9;
  }
  :host([type='inverse']) button:active {
    opacity: 0.8;
  }

  /* Mono */
  :host([type='mono']) button {
    background: var(--sc-color-background-mono);
    color: var(--sc-color-text-primary-inverse);
  }
  :host([type='mono']) button:hover {
    background: var(--sc-color-background-mono-hover);
  }
  :host([type='mono']) button:active {
    background: var(--sc-color-background-mono-pressed);
  }

  /* Outline */
  :host([type='outline']) button {
    background: transparent;
    color: var(--sc-color-text-primary);
    border: var(--sc-border-width-s) solid var(--sc-color-border-primary);
  }
  :host([type='outline']) button:hover {
    background: var(--sc-color-background-hover);
  }
  :host([type='outline']) button:active {
    background: var(--sc-color-background-pressed);
  }

  /* Outline Mono */
  :host([type='outline-mono']) button {
    background: transparent;
    color: var(--sc-color-text-primary);
    border: var(--sc-border-width-s) solid var(--sc-color-border-mono);
  }
  :host([type='outline-mono']) button:hover {
    background: var(--sc-color-background-hover);
  }
  :host([type='outline-mono']) button:active {
    background: var(--sc-color-background-pressed);
  }

  /* Negative Primary */
  :host([type='negative-primary']) button {
    background: var(--sc-color-background-negative);
    color: var(--sc-color-text-primary-inverse);
  }
  :host([type='negative-primary']) button:hover {
    background: var(--sc-color-background-negative-hover);
  }
  :host([type='negative-primary']) button:active {
    background: var(--sc-color-background-negative-pressed);
  }

  /* Negative Outline */
  :host([type='negative-outline']) button {
    background: transparent;
    color: var(--sc-color-text-negative);
    border: var(--sc-border-width-s) solid var(--sc-color-border-negative);
  }
  :host([type='negative-outline']) button:hover {
    background: var(--sc-color-background-negative-subtle);
  }
  :host([type='negative-outline']) button:active {
    background: var(--sc-color-background-negative-subtle);
  }

  /* ---- Disabled ---- */
  :host([disabled]) button {
    background: var(--sc-color-background-disabled);
    color: var(--sc-color-text-disabled);
    border-color: var(--sc-color-border-disabled);
    cursor: not-allowed;
    pointer-events: none;
  }

  /* ---- Loading ---- */
  :host([loading]) button {
    cursor: not-allowed;
    pointer-events: none;
  }

  .spinner {
    display: none;
    width: 16px;
    height: 16px;
    border: 2px solid currentColor;
    border-top-color: transparent;
    border-radius: 50%;
    animation: spin 0.75s linear infinite;
    position: absolute;
    inset: 0;
    margin: auto;
  }

  :host([loading]) .spinner {
    display: block;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`
