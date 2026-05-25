import { css } from 'lit'

// Shared variant table for sc-button and sc-button-pill. Covers the 10 type
// variants they have in common, plus disabled, loading, and the spinner.
// sc-button extends with text/text-mono/negative-text variants locally.
// sc-button-icon intentionally doesn't use this — its colors and semantics differ.
export const buttonVariants = css`
  /* ---- Types ---- */

  /* Primary */
  :host([type='primary']) :is(button, a) {
    background: var(--sc-color-background-brand);
    color: var(--sc-color-text-primary-inverse);
  }
  :host([type='primary']) :is(button, a):hover {
    background: var(--sc-color-background-brand-hover);
  }
  :host([type='primary']) :is(button, a):active {
    background: var(--sc-color-background-brand-pressed);
  }

  /* Secondary */
  :host([type='secondary']) :is(button, a) {
    background: var(--sc-color-background-neutral);
    color: var(--sc-color-text-primary);
  }
  :host([type='secondary']) :is(button, a):hover {
    background: var(--sc-color-background-neutral-hover);
  }
  :host([type='secondary']) :is(button, a):active {
    background: var(--sc-color-background-neutral-pressed);
  }

  /* Tertiary */
  :host([type='tertiary']) :is(button, a) {
    background: transparent;
    color: var(--sc-color-text-primary);
  }
  :host([type='tertiary']) :is(button, a):hover {
    background: var(--sc-color-background-hover);
  }
  :host([type='tertiary']) :is(button, a):active {
    background: var(--sc-color-background-pressed);
  }

  /* Tertiary Mono */
  :host([type='tertiary-mono']) :is(button, a) {
    background: transparent;
    color: var(--sc-color-text-primary);
  }
  :host([type='tertiary-mono']) :is(button, a):hover {
    background: var(--sc-color-background-hover);
  }
  :host([type='tertiary-mono']) :is(button, a):active {
    background: var(--sc-color-background-pressed);
  }

  /* Inverse */
  :host([type='inverse']) :is(button, a) {
    background: var(--sc-color-background-inverse);
    color: var(--sc-color-text-primary-inverse);
  }
  :host([type='inverse']) :is(button, a):hover {
    opacity: 0.9;
  }
  :host([type='inverse']) :is(button, a):active {
    opacity: 0.8;
  }

  /* Mono */
  :host([type='mono']) :is(button, a) {
    background: var(--sc-color-background-mono);
    color: var(--sc-color-text-primary-inverse);
  }
  :host([type='mono']) :is(button, a):hover {
    background: var(--sc-color-background-mono-hover);
  }
  :host([type='mono']) :is(button, a):active {
    background: var(--sc-color-background-mono-pressed);
  }

  /* Outline */
  :host([type='outline']) :is(button, a) {
    background: transparent;
    color: var(--sc-color-text-primary);
    border: var(--sc-border-width-s) solid var(--sc-color-border-primary);
  }
  :host([type='outline']) :is(button, a):hover {
    background: var(--sc-color-background-hover);
  }
  :host([type='outline']) :is(button, a):active {
    background: var(--sc-color-background-pressed);
  }

  /* Outline Mono */
  :host([type='outline-mono']) :is(button, a) {
    background: transparent;
    color: var(--sc-color-text-primary);
    border: var(--sc-border-width-s) solid var(--sc-color-border-mono);
  }
  :host([type='outline-mono']) :is(button, a):hover {
    background: var(--sc-color-background-hover);
  }
  :host([type='outline-mono']) :is(button, a):active {
    background: var(--sc-color-background-pressed);
  }

  /* Negative Primary */
  :host([type='negative-primary']) :is(button, a) {
    background: var(--sc-color-background-negative);
    color: var(--sc-color-text-primary-inverse);
  }
  :host([type='negative-primary']) :is(button, a):hover {
    background: var(--sc-color-background-negative-hover);
  }
  :host([type='negative-primary']) :is(button, a):active {
    background: var(--sc-color-background-negative-pressed);
  }

  /* Negative Outline */
  :host([type='negative-outline']) :is(button, a) {
    background: transparent;
    color: var(--sc-color-text-negative);
    border: var(--sc-border-width-s) solid var(--sc-color-border-negative);
  }
  :host([type='negative-outline']) :is(button, a):hover {
    background: var(--sc-color-background-negative-subtle);
  }
  :host([type='negative-outline']) :is(button, a):active {
    background: var(--sc-color-background-negative-subtle);
  }

  /* ---- Disabled ---- */
  :host([disabled]) :is(button, a) {
    background: var(--sc-color-background-disabled);
    color: var(--sc-color-text-disabled);
    border-color: var(--sc-color-border-disabled);
    cursor: not-allowed;
    pointer-events: none;
  }

  /* ---- Loading ---- */
  :host([loading]) :is(button, a) {
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
