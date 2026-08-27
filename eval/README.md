# Eval

Measures whether the Scale agent guidance actually changes what a model writes.

Everything else in this repo asserts that it helps. This is the part that puts a
number on it, and it is built so that "it barely helped" would be a visible
result rather than one that gets absorbed.

## What it measures

30 prompts, phrased the way someone would really ask, run twice:

| Condition | System prompt |
|---|---|
| `baseline` | "this project uses Scale" and nothing else |
| `guided` | the same, plus the `scale-build` rules and the component catalog |

Both are told Scale exists — otherwise the baseline answers in React and the
comparison measures mind-reading rather than guidance.

**The guided condition does not get the guidance file for the component the
prompt is about.** Handing over the answer would measure transcription, and the
resulting number would be useless for deciding whether any of this was worth
building. No prompt names an `sc-*` tag either, for the same reason.

## What counts as a failure

Every check is structural and deterministic. An LLM grader would score the same
response differently across runs, and an eval whose numbers move when nothing
changed measures nothing.

| Check | Why it matters |
|---|---|
| `hardcoded-color` | The one that silently breaks dark mode |
| `hardcoded-space` / `-motion` / `-type` | A token exists; a literal was written instead |
| `raw-control` | `<button>` where `sc-button` exists |
| `unknown-component` | A hallucinated tag. Worse than a raw control: it renders as an inert unknown element and looks like it worked |
| `invalid-prop` | `type="danger"`. Renders the default rather than erroring, so it never surfaces |
| `missing-import` | The one loud failure — the element renders unstyled |
| `no-code` | The response contained no code at all |

## Running it

The grader has its own test suite and no API cost. Run that first — an eval is
only as good as its grader, and a grader nobody checked is a number generator:

```
npm run check:grader
```

The full run costs real tokens and is never automatic:

```
npm install --no-save @anthropic-ai/sdk
npm run eval
```

The Anthropic SDK is deliberately not a dependency — the eval is opt-in and the
shipped library has no use for an API client.

Options:

```
node eval/run.mjs --only pricing-page      one prompt, for iterating
node eval/run.mjs --condition guided       one condition
node eval/run.mjs --model claude-sonnet-5  default is claude-opus-5
```

Credentials resolve the usual way: `ANTHROPIC_API_KEY`, `ANTHROPIC_AUTH_TOKEN`,
or an `ant auth login` profile. An unset key does not mean there are none —
`ant auth status` shows what is active.

Results land in `eval/results/<timestamp>.json`, git-ignored, with every
response kept so a finding can be traced back to the text that produced it.

## Reading the result

The summary prints clean-rate per condition and the delta between them. Treat
one run as a sample, not a measurement — 30 prompts is enough to see a large
effect and not enough to resolve a small one. If the delta is within a couple of
prompts either way, say so rather than reporting it as an improvement.
