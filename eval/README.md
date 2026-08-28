# Eval

Measures whether the Scale agent guidance actually changes what a model writes.

Everything else in this repo asserts that it helps. This is the part that puts a
number on it, and it is built so that "it barely helped" would be a visible
result rather than one that gets absorbed.

## What it measures

30 prompts, phrased the way someone would really ask, run under three
conditions:

| Condition | What the agent has |
|---|---|
| `baseline` | "this project uses Scale" and nothing else |
| `guided` | the same, plus the `scale-build` rules and the component catalog |
| `guided-lookup` | the same as `guided`, plus the Scale MCP server, so it can act on the skill's instruction to read a component's guidance before using it |

The third condition is the one that isolates the plan's central bet — that an
MCP server is inert until something tells the agent to reach for it. `guided`
and `guided-lookup` share a system prompt byte for byte; the only difference is
whether the lookup can actually happen.

All three are told Scale exists — otherwise the baseline answers in React and
the comparison measures mind-reading rather than guidance.

**No condition is handed the guidance file for the component the prompt is
about, and no prompt names an `sc-*` tag.** `guided-lookup` can fetch guidance,
but it has to work out what to fetch, which is the part being measured. Injecting
the answer would measure transcription and produce a number useless for deciding
whether any of this was worth building.

Runs happen in an empty temp directory with every built-in tool denied and no
inherited MCP config. Both matter: from inside a Scale checkout the baseline
could simply read `context/agents/` and `CLAUDE.md` — exactly the guidance it is
defined as not having.

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

## Result (2026-08-28, `opus` via the CLI transport)

| | clean | findings | used `sc-*` |
|---|---|---|---|
| `baseline` | 11/30 (37%) | 161 | 0/30 |
| `guided` | 17/30 (57%) | 26 | 30/30 |
| `guided-lookup` | **28/30 (93%)** | **3** | 29/30 |

| check | baseline | guided | guided-lookup |
|---|---|---|---|
| `hardcoded-space` | 75 | 0 | 0 |
| `hardcoded-type` | 42 | 0 | 0 |
| `hardcoded-color` | 33 | 3 | 0 |
| `hardcoded-motion` | 7 | 0 | 1 |
| `raw-control` | 4 | 0 | 2 |
| `invalid-prop` | 0 | 15 | 0 |
| `missing-import` | 0 | 6 | 0 |
| `unknown-component` | 0 | 2 | 0 |

Rules and a catalog are worth +20 points. Being able to *look a component up* is
worth +57, and takes total findings from 161 to 3.

`invalid-prop` is the clearest single line. `guided` produced 15 of them —
`size="large"`, `type="ghost"`, `status="success"` — because it knows which
component to reach for but has to guess prop values. `guided-lookup` produced
none: it read the enum values the catalog carries. Phase 0 and Phase 3 are
load-bearing for each other, and neither shows its value without the other.

**Baseline's zero `invalid-prop` is not a strength.** It used an `sc-*`
component in 0 of 30 responses. It cannot misuse an API it never touches, and
any per-check comparison that ignores the usage column will read backwards.

### How much to trust it

**Large effect, imprecise magnitude.** Across repeat runs on identical settings,
baseline landed 8–11/30 and `guided` 17–22/30. Read this as "roughly doubles,
and roughly triples with lookup", not as 37 → 93.

**It measures a coding agent, not a raw model.** The CLI transport carries
Claude Code's own system prompt and harness. That is the realistic setting for
this guidance, but it is not an API call.

**It took four runs to get one worth reporting**, and both discards were harness
faults rather than anything about the model: inherited MCP config stealing 8
prompts to permission requests, then an open stdin making the longest runs
flaky. Both are fixed in `run.mjs`, and the fixes are commented there so they
are not reintroduced.

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
node eval/run.mjs --only pricing-page          one prompt, for iterating
node eval/run.mjs --condition guided-lookup    one condition
node eval/run.mjs --model sonnet               default: opus (cli) / claude-opus-5 (api)
node eval/run.mjs --via cli                    force a transport
```

### Two transports, because they bill differently

`--via api` uses the Anthropic SDK and needs **API credits**. `--via cli` shells
out to `claude -p` and runs on a **Claude Pro/Max subscription** — a separate
product. The default is `api` when `ANTHROPIC_API_KEY` is set, `cli` otherwise.

They do not measure the same thing: the CLI carries Claude Code's own system
prompt and harness, so it measures a coding agent rather than a bare model. The
transport is recorded in every results file.

For `api`, credentials resolve the usual way — `ANTHROPIC_API_KEY`,
`ANTHROPIC_AUTH_TOKEN`, or an `ant auth login` profile. An unset key does not
mean there are none; `ant auth status` shows what is active.

Results land in `eval/results/<timestamp>.json`, git-ignored, with every
response kept so a finding can be traced back to the text that produced it.

## Reading the result

The summary prints clean-rate per condition and the delta between them. Treat
one run as a sample, not a measurement — 30 prompts is enough to see a large
effect and not enough to resolve a small one. If the delta is within a couple of
prompts either way, say so rather than reporting it as an improvement.
