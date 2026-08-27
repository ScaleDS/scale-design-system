---
foundation: motion
title: Motion
source:
  guidance: guidance/foundations/motion.html
  tokens: context/tokens.json
  docs: "https://scaledesignsystem.com/foundations/motion/"
---

# Motion

Motion is how the interface explains itself, and how the brand behaves. Get the first right and the product is easy to follow. Get both right and it feels alive.

## Duration

How long a movement takes. Fast enough to feel like a reply, slow enough to follow: under about 100ms a change reads as instant, and past half a second it's stopped feeling like movement and started feeling like waiting. The further something travels, the longer it should take. Everything a user waits on lives here. Click any demo to replay it. For animation that loops, never for transitions. Reduced motion doesn't zero these two. A loop with no duration just stops, and a frozen spinner no longer says “working”, so looping components slow down instead. The spinner drops to 2s and keeps turning. Loops pair with an `--sc-motion-animation-*` shorthand, which adds the easing and the iteration count. The demos below start paused, because looping motion doesn't belong in a reading path. Click one to run it.

## Easing

How a movement speeds up and slows down. Nothing in the real world starts or stops at a constant speed, so anything on screen that does looks wrong before you can say why. Easing is what separates movement that feels alive from movement that feels like a machine part. Every curve in the system, starting with the four defaults. Click any demo to replay it. Movement that settles like a real object, overshooting a little before it comes to rest. Elastic and bounce are real delight on the right element and toy-like on a button, so keep them for brand moments and illustration.

## Design handoff

Curve names are shared with Figma so a curve keeps its identity across tools. Two things don't travel, and are worth knowing before a handoff: Durations sync across to Figma as number variables, but easings have nowhere to bind on a prototype transition, so they travel as documentation rather than as bound variables.

## Transitions

Reach for these first. Each one pairs a timing with a curve for a specific job, so picking the job gets you the timing for free. Drop them straight after the property in a `transition`: Each demo below plays its entrance, holds, then plays its exit, so one click shows the pair back to back. The recipe underneath highlights the half you're watching. Confirming a tap, a hover, a selection. The control stays exactly where it is and only its colour changes, because the user is already looking at it and moving it would be noise. Something appears that was not there before, without claiming to have come from anywhere. A toast is the clearest case: it shows up where it will sit, says its piece and goes. A surface with a home off-screen. It comes in from the edge it lives on and leaves the same way, so the user always knows where it went and where to find it again. A dialog belongs to the whole screen rather than to one side of it, so it grows into the middle instead of sliding in from somewhere arbitrary. Content that was already there becoming more or less of itself. Reposition moves an element that stays on screen the whole way. Durations and easings below are read live from the tokens themselves.

## Movement

Transitions supply the how long and what curve . Keyframes and distances supply the what moves . Pair them: The slide keyframes don't have a distance baked in. Each one reads `--sc-motion-slide-distance` off the element it's animating, so the same eight keyframes cover both an 8px nudge and a full off-screen exit. How far a surface is from full size when it starts or ends. Fades, three sizes of scale, and eight directions of slide, each with a matching counterpart. The table shows the shapes rather than every name. The rest follow from these: swap `in` for `out`, and `top` for any of the eight edges. Direction names the edge the element comes from (or goes to ), and the inline-axis pair follows the writing mode, so `inline-start` is the left edge in LTR and the right edge in RTL.

## Choreography

Motion across more than one element. A transition handles a single thing arriving or leaving; these handle two things trading places, or a group arriving together. They're mixins rather than tokens because each one puts its elements on different sub-durations inside a single shared total, which no one custom property can hold. They aren't in the main stylesheet, so import them where you need them: A group arriving together, but not all at once. The eye gets a moment to take in each item instead of meeting the whole list at the same instant. Siblings start 20ms apart, the interval Carbon measured as the smallest that meaningfully reduces effort. Past 25 children the interval compresses so the total never runs beyond 500ms. The preview runs slower than that on purpose. Five rows at the real interval are done in 80ms, over before the eye reads it as a sequence. Switching between two places with no relationship to each other, like top-level nav destinations. Nothing slides, because there's no direction that would mean anything. The two halves run in sequence rather than together: the old view is gone before the new one starts. Overlapping them would put two semi-transparent screens on top of each other, which reads as a glitch. Moving between two places that are related: forward and back through a hierarchy, or side to side between peers. Both views travel the same axis, so the direction tells the user which way they went. Three axes: `x` for lateral moves, `y` for vertical, and `z` for depth, where the outgoing view grows and recedes while the incoming one comes forward. Pass `$direction: backward` to reverse it. Both views travel a short distance and cross-fade, which keeps them reading as two parts of one screen. When the new view is a whole screen of its own, use Push. One whole view replacing another, sliding edge to edge. It's what mobile platforms do between screens. Reach for it when the thing arriving is a place of its own, not a change inside the current one. Nothing fades. Both views stay opaque for the whole move, so the change reads as replacement rather than a blend. Give the container `overflow: hidden` so the view that leaves is clipped at the edge. Two axes: `x` and `y`, with `$direction: backward` to reverse it. There's no `z`, because push is lateral by definition. Use shared axis when you want depth. A card growing into the thing it opens, so the user keeps hold of what they tapped. The browser does the work through the View Transitions API: give both elements a matching name and it morphs the bounds, position and content between them. The demo above runs the timing the mixin sets, but moves the card's bounds by hand. That's the argument for letting the browser do it: bounds are a layout property, and animating layout is the one thing this page tells you not to do. The View Transitions API morphs the same shape without touching layout. The mixin only swaps the browser's defaults for Scale's timing:

## Accessibility

- The **loop durations** (1000/5000) are never zeroed: a 0ms loop doesn't run at all, and a stopped spinner stops communicating “in progress”. The spinner instead slows to 2s and keeps turning.
- A **shimmer** is large-area repeating movement and the most likely vestibular trigger in the set, so it degrades to a still gradient rather than a faster one.

The full token set for this foundation is in `context/tokens.json`.
