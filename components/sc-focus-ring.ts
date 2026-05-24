import { css } from 'lit'

export const focusRing = css`
  :focus-visible {
    outline: 2px dashed var(--sc-color-border-mono);
    outline-offset: 2px;
  }
`
