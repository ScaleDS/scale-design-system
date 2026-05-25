import { css } from 'lit'

// Local CSS reset applied inside each component's Shadow DOM. Shadow boundaries
// don't inherit page-level resets, so each component that lays out its own
// content tree needs this to behave predictably regardless of consumer styles.
export const reset = css`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
`
