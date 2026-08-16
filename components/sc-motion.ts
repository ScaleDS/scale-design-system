import { css, unsafeCSS, type CSSResult } from 'lit'

/* Scale: Motion — the shadow-DOM half of the motion system.
 *
 * WHY THIS FILE EXISTS
 * Custom properties inherit through a shadow boundary, so every --sc-motion-*
 * duration, easing, composite and distance defined in scss/sc-motion-variables.scss
 * and scss/sc-motion-transitions.scss reaches components for free — including the
 * reduced-motion zeroing, which is why the token design needs no per-component
 * opt-out. @keyframes do NOT inherit. A shadow root can only use keyframes
 * declared inside its own styles, so the global ones are invisible to every sc-*
 * element. This module re-declares them as Lit CSSResults, following the
 * sc-focus-ring.ts precedent, so a component can pull in the families it needs.
 *
 * The SCSS remains the source of truth for humans; scripts/check-motion-drift.mjs
 * fails the build if the two ever disagree.
 *
 * TWO KINDS OF EXPORT, USED IN DIFFERENT PLACES
 *   - Keyframes and motionRtl are complete stylesheets → put them in `static styles`.
 *   - motionTransition() and motionAnimate() return DECLARATIONS, mirroring the
 *     SCSS mixins → interpolate them INSIDE a rule, never at the top level.
 *   - motionSurface() returns whole rules → top level of a css block.
 *
 *     static styles = [
 *       slideKeyframes,
 *       css`
 *         .panel {
 *           ${motionTransition('enter-xl', 'translate')}
 *         }
 *       `,
 *     ]
 */

/* ---------------------------------------------------------------------------
   Token names — the compile-time half of the guardrails.

   The SCSS mixins @error on an unknown name at build time; these unions do the
   same at edit time, in the editor, with autocomplete. Keep them in sync with the
   --sc-motion-transition-* / --sc-motion-animation-* tokens in
   scss/sc-motion-transitions.scss (the drift check enforces this).
   --------------------------------------------------------------------------- */

/** Composite transition tokens: a duration and an easing, chosen for a role. */
export type MotionTransition =
  /* state changes — nothing moves */
  | 'micro'
  | 'control'
  /* fades, sized by surface */
  | 'fade-in-s'
  | 'fade-out-s'
  | 'fade-in-m'
  | 'fade-out-m'
  | 'fade-in-l'
  | 'fade-out-l'
  /* slides — xl is the full-edge drawer, Scale's signature curve */
  | 'enter-s'
  | 'exit-s'
  | 'enter-l'
  | 'exit-l'
  | 'enter-xl'
  | 'exit-xl'
  /* scales */
  | 'scale-in'
  | 'scale-out'
  /* in-place */
  | 'expand'
  | 'collapse'
  | 'reposition'
  /* springs — spatial only, see SpringTransition */
  | 'spring-subtle'
  | 'spring'
  | 'spring-bouncy'

/** Looping animation tokens. Each pairs with the `sc-motion-<name>` keyframe. */
export type MotionAnimation = 'spin' | 'pulse' | 'shimmer'

/** The springs, which overshoot past their target and so are geometry-only. */
export type SpringTransition = 'spring-subtle' | 'spring' | 'spring-bouncy'

/* Properties a spring may animate. Deliberately CLOSED (no `string & {}` escape
   hatch): a spring overshoots past 1, which is meaningless for opacity and colour
   — Compose damps its `effects` springs to 1.0 for the same reason. The SCSS can
   only @warn about this; here it is a type error. */
export type SpatialProperty =
  | 'translate'
  | 'scale'
  | 'rotate'
  | 'transform'
  | 'width'
  | 'height'
  | 'block-size'
  | 'inline-size'
  | 'grid-template-rows'
  | 'offset-distance'

/* Everything else. The `string & {}` member keeps autocomplete for the common
   cases while still accepting any animatable property. */
export type MotionProperty =
  | SpatialProperty
  | 'opacity'
  | 'color'
  | 'background-color'
  | 'border-color'
  | 'box-shadow'
  | 'filter'
  | 'backdrop-filter'
  | (string & {})

/* ---------------------------------------------------------------------------
   Keyframes — mirrors of scss/sc-motion-transitions.scss.

   Exported per family so a component includes only what it uses; a tooltip has no
   reason to carry the drawer's eight slide keyframes. All translation uses the
   individual `translate` property rather than `transform`, so a slide and a scale
   compose instead of fighting over one value, and neither clobbers a hover
   transform. Nothing here animates a layout property.
   --------------------------------------------------------------------------- */

export const fadeKeyframes = css`
  @keyframes sc-motion-fade-in {
    from {
      opacity: 0;
    }
  }

  @keyframes sc-motion-fade-out {
    to {
      opacity: 0;
    }
  }
`

export const scaleKeyframes = css`
  @keyframes sc-motion-scale-in-s {
    from {
      scale: var(--sc-motion-scale-s);
    }
  }

  @keyframes sc-motion-scale-out-s {
    to {
      scale: var(--sc-motion-scale-s);
    }
  }

  @keyframes sc-motion-scale-in-m {
    from {
      scale: var(--sc-motion-scale-m);
    }
  }

  @keyframes sc-motion-scale-out-m {
    to {
      scale: var(--sc-motion-scale-m);
    }
  }

  @keyframes sc-motion-scale-out-grow {
    to {
      scale: var(--sc-motion-scale-grow);
    }
  }
`

/* Slides. Magnitude is not in the names: each reads --sc-motion-slide-distance
   off the element, which defaults to the 8px nudge. Set it to
   var(--sc-motion-distance-full) on a drawer to park it off-screen — percentages
   on `translate` resolve against the element's own box, so that is exactly one
   of its own widths with no measurement.

   Inline-axis keyframes multiply by --sc-motion-inline-sign so `inline-start`
   means the left edge in LTR and the right edge in RTL. Include motionRtl below
   if the component can appear in an RTL subtree of an LTR document. */
export const slideKeyframes = css`
  @keyframes sc-motion-slide-in-from-top {
    from {
      translate: 0 calc(-1 * var(--sc-motion-slide-distance));
    }
  }

  @keyframes sc-motion-slide-in-from-bottom {
    from {
      translate: 0 var(--sc-motion-slide-distance);
    }
  }

  @keyframes sc-motion-slide-in-from-inline-start {
    from {
      translate: calc(-1 * var(--sc-motion-slide-distance) * var(--sc-motion-inline-sign)) 0;
    }
  }

  @keyframes sc-motion-slide-in-from-inline-end {
    from {
      translate: calc(var(--sc-motion-slide-distance) * var(--sc-motion-inline-sign)) 0;
    }
  }

  @keyframes sc-motion-slide-out-to-top {
    to {
      translate: 0 calc(-1 * var(--sc-motion-slide-distance));
    }
  }

  @keyframes sc-motion-slide-out-to-bottom {
    to {
      translate: 0 var(--sc-motion-slide-distance);
    }
  }

  @keyframes sc-motion-slide-out-to-inline-start {
    to {
      translate: calc(-1 * var(--sc-motion-slide-distance) * var(--sc-motion-inline-sign)) 0;
    }
  }

  @keyframes sc-motion-slide-out-to-inline-end {
    to {
      translate: calc(var(--sc-motion-slide-distance) * var(--sc-motion-inline-sign)) 0;
    }
  }
`

/* Loops. The reduced-motion shimmer override is part of this family on purpose:
   a shimmer is large-area repeating movement, the most likely vestibular trigger
   in the set, so it degrades to a still gradient. The spinner keeps turning
   because its motion IS the loading affordance — which is also why the ambient
   duration stops (1000/5000) are never zeroed. */
export const loopKeyframes = css`
  @keyframes sc-motion-spin {
    to {
      transform: rotate(360deg);
    }
  }

  @keyframes sc-motion-pulse {
    50% {
      opacity: 0.5;
    }
  }

  @keyframes sc-motion-shimmer {
    from {
      background-position: 0% 0%;
    }
    to {
      background-position: 200% 200%;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    @keyframes sc-motion-shimmer {
      from,
      to {
        background-position: 50% 50%;
      }
    }
  }
`

/* Choreography. The shared-axis pair reads its start and end offsets from custom
   properties set on the element, so one keyframe serves every axis and direction. */
export const choreographyKeyframes = css`
  @keyframes sc-motion-scale-in-fade-through {
    from {
      scale: var(--sc-motion-scale-fade-through);
    }
  }

  @keyframes sc-motion-shared-axis-in {
    from {
      translate: var(--sc-motion-shared-axis-from);
    }
  }

  @keyframes sc-motion-shared-axis-out {
    to {
      translate: var(--sc-motion-shared-axis-to);
    }
  }
`

/** Every family. Prefer the individual exports — this ships all 24 keyframes. */
export const motionKeyframes: CSSResult[] = [
  fadeKeyframes,
  scaleKeyframes,
  slideKeyframes,
  loopKeyframes,
  choreographyKeyframes,
]

/* The global sheet flips --sc-motion-inline-sign on :root:dir(rtl), which only
   handles a document-wide direction. An RTL subtree inside an LTR page needs the
   flip per-element, which :host(:dir(rtl)) gives us. Include alongside
   slideKeyframes in any component that slides on the inline axis. */
export const motionRtl = css`
  :host(:dir(rtl)) {
    --sc-motion-inline-sign: -1;
  }
`

/* ---------------------------------------------------------------------------
   Helpers — the TS mirrors of the SCSS mixins.
   --------------------------------------------------------------------------- */

/**
 * A `transition` declaration built from a composite token, for interpolation
 * inside a rule. Every property shares the token's duration and easing; reach for
 * the raw `var(--sc-motion-transition-*)` when properties in the same rule need
 * different timings.
 *
 *     .tooltip { ${motionTransition('fade-in-s', 'opacity')} }
 *     .dialog  { ${motionTransition('scale-in', 'opacity', 'scale')} }
 *
 * Springs accept geometric properties only — `motionTransition('spring', 'opacity')`
 * is a compile-time error, not a runtime warning.
 */
export function motionTransition(
  name: SpringTransition,
  ...properties: [SpatialProperty, ...SpatialProperty[]]
): CSSResult
export function motionTransition(
  name: Exclude<MotionTransition, SpringTransition>,
  ...properties: [MotionProperty, ...MotionProperty[]]
): CSSResult
export function motionTransition(name: MotionTransition, ...properties: string[]): CSSResult {
  const list = properties.map((property) => `${property} var(--sc-motion-transition-${name})`).join(', ')
  return css`
    transition: ${unsafeCSS(list)};
  `
}

/**
 * An `animation` declaration pairing a loop token with its matching keyframe, for
 * interpolation inside a rule. Include `loopKeyframes` in the component's styles
 * or the animation has nothing to run.
 *
 *     .skeleton { ${motionAnimate('shimmer')} }
 */
export function motionAnimate(name: MotionAnimation): CSSResult {
  return css`
    animation: ${unsafeCSS(`sc-motion-${name} var(--sc-motion-animation-${name})`)};
  `
}

export interface MotionSurfaceOptions {
  /** The surface in its resting/closed state. Defaults to `:host`. */
  selector?: string
  /** The open state, e.g. `:host([open])` or `:host(.is-open)`. */
  open: string
  /** Transition token for entering. */
  enter: MotionTransition
  /** Transition token for exiting. Should be shorter than the enter (~0.7–0.8x). */
  exit: MotionTransition
  /** The hidden state — declarations only. Emitted twice; see below. */
  hidden: CSSResult
}

/**
 * A surface that enters and exits without JavaScript. Emits whole rules, so use
 * it at the top level of a css block.
 *
 * Animate `translate` and `scale`, never a layout property: the element is laid
 * out at its final on-screen position the whole time and these only offset the
 * paint, so the resting position is whatever layout says it is.
 *
 * The hidden state is emitted twice — once as the resting/closed state and once
 * inside `@starting-style` — which removes the duplication `@starting-style`
 * otherwise forces on every author. `display` and `overlay` transition with
 * `allow-discrete` so the element stays rendered, and stays in the top layer, for
 * the whole of its exit; without them a dialog vanishes the instant it closes and
 * the exit is never seen.
 *
 *     static styles = css`
 *       ${motionSurface({
 *         open: ':host([open])',
 *         enter: 'enter-xl',
 *         exit: 'exit-xl',
 *         hidden: css`translate: calc(-1 * var(--sc-motion-distance-full) * var(--sc-motion-inline-sign)) 0;`,
 *       })}
 *     `
 */
export function motionSurface({
  selector = ':host',
  open,
  enter,
  exit,
  hidden,
}: MotionSurfaceOptions): CSSResult {
  const base = unsafeCSS(selector)
  const openSelector = unsafeCSS(open)
  const enterToken = unsafeCSS(`var(--sc-motion-transition-${enter})`)
  const exitToken = unsafeCSS(`var(--sc-motion-transition-${exit})`)

  return css`
    ${base} {
      transition:
        opacity ${exitToken},
        translate ${exitToken},
        scale ${exitToken},
        overlay ${exitToken} allow-discrete,
        display ${exitToken} allow-discrete;
      ${hidden}
    }

    ${openSelector} {
      opacity: 1;
      translate: none;
      scale: none;
      transition:
        opacity ${enterToken},
        translate ${enterToken},
        scale ${enterToken};
    }

    @starting-style {
      ${openSelector} {
        ${hidden}
      }
    }
  `
}
