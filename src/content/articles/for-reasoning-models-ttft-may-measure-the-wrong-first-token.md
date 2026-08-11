---
title: "For reasoning models, TTFT may measure the wrong first token"
dek: "Reasoning-aware APIs can emit progress before answer text. If a benchmark clocks the first content of any type, TTFT and time to first answer can become different measurements—and even rank systems differently."
slug: "for-reasoning-models-ttft-may-measure-the-wrong-first-token"
section: "Research"
format: "SECOND PASS"
author: "Aditya"
publishedAt: "2026-08-11"
status: "published"
firstPass:
  - "TTFT is not one universal event: in current NVIDIA AIPerf it is the first non-empty content response and can include separately exposed reasoning, while TTFO is the first non-reasoning output."
  - "Hidden reasoning does not automatically create a TTFT/TTFO gap. If the client sees no pre-answer reasoning content, first-any-content and first-answer-output can be the same event."
  - "The reasoning-to-output gap is observable only when the stream exposes a pre-answer content event; it is not a measurement of hidden chain-of-thought duration."
  - "Metric choice can reverse a latency ranking: a system can win on first-any-content and lose on first-answer-output without either measurement being mathematically wrong."
  - "Reasoning-model benchmarks should preserve event semantics, reasoning settings, parser/tool version, TTFT and TTFO where applicable, plus E2E and token accounting."
featured: false
featuredRank: 0
editorialOrder: 2
demo: false
tags: ["reasoning models", "latency", "benchmarking", "TTFT", "TTFO"]
hero: "/research/reasoning-ttft-ttfo/charts/chart-03-rank-reversal.svg"
heroAlt: "Two systems whose latency ranking reverses when measured by TTFT versus TTFO."
adPolicy: "none"
sources:
  - label: "NVIDIA AIPerf — Metrics Reference"
    url: "https://docs.nvidia.com/aiperf/reference/ai-perf-metrics-reference"
    type: "primary"
    note: "Current TTFT and TTFO definitions and streaming metric semantics."
  - label: "NVIDIA AIPerf — Migrating from GenAI-Perf"
    url: "https://docs.nvidia.com/aiperf/getting-started/migrating-from-gen-ai-perf"
    type: "primary"
    note: "Reasoning-aware TTFT/TTFO and OSL migration mapping."
  - label: "OpenAI — Responses streaming events"
    url: "https://platform.openai.com/docs/api-reference/responses-streaming"
    type: "primary"
    note: "Reasoning-summary/output event families and reasoning token accounting."
  - label: "Google Gemini — Streaming interactions"
    url: "https://ai.google.dev/gemini-api/docs/streaming"
    type: "primary"
    note: "Thought/thought-summary and model-output step semantics."
  - label: "Google Gemini — Thinking"
    url: "https://ai.google.dev/gemini-api/docs/thinking"
    type: "primary"
    note: "Thinking configuration and thought-summary exposure."
  - label: "Google Gemini — Token accounting"
    url: "https://ai.google.dev/gemini-api/docs/tokens"
    type: "primary"
    note: "Thought-token and output-token accounting separation."
  - label: "vLLM — Reasoning Outputs"
    url: "https://docs.vllm.ai/en/stable/features/reasoning_outputs/"
    type: "primary"
    note: "Separate reasoning and final content fields, including streaming."
  - label: "MLCommons — reasoning inference benchmark update"
    url: "https://mlcommons.org/2026/03/mlperf-inference-gpt-oss/"
    type: "primary"
    note: "Current context showing TTFT remains an operational reasoning-workload metric."
changeLog:
  - at: "2026-08-11"
    type: "published"
    note: "Initial publication."
seoTitle: "For reasoning models, TTFT may measure the wrong first token"
seoDescription: "A measurement-level analysis of TTFT, TTFO, reasoning streams, rank reversal and benchmark migration for reasoning-model latency."
---

The first token arrived in 150 milliseconds.

That sounds fast. But what arrived?

For a normal streaming chat model, the first non-empty content chunk is often the beginning of the answer. For some reasoning-capable systems, the stream can contain a different kind of content first: exposed reasoning, a reasoning summary, or another progress-like event. The answer text may begin much later.

That distinction is no longer theoretical. NVIDIA's current AIPerf documentation defines **Time to First Token (TTFT)** as the time from request start to the first non-empty content response. Its reasoning-aware path can count a reasoning token as that first token. AIPerf separately defines **Time to First Output Token (TTFO)** as time to the first non-reasoning output token.

The two numbers answer different questions.

TTFT can answer: **How quickly did the stream produce any content that the benchmark recognizes?**

TTFO can answer: **How long until non-reasoning output began?**

Neither is automatically the correct product SLO. The correct metric depends on what the product considers useful first output.

The important change is measurement semantics. A benchmark engineer can no longer assume that the label "first token" identifies the same event across reasoning models, serving stacks and tool versions.

## The timeline needs names before it needs acronyms

Start at the client boundary:

$$
t0 = request send time
$$

Then record only events the client can actually observe:

- `t_any`: first non-empty content-bearing chunk of any recognized type;
- `t_reason`: first exposed reasoning-content event, if the interface provides one;
- `t_summary`: first reasoning-summary event, if the interface provides one;
- `t_out`: first non-reasoning answer/output chunk;
- `t_end`: completion.

A response-created event, metadata envelope or empty chunk is not automatically a first token. A benchmark needs an explicit rule for which event stops the clock.

Also, a network chunk is not necessarily one tokenizer token. Current AIPerf documentation is careful here: TTFT is first token **or chunk of tokens**, implemented from the first non-empty content response. That is the observable boundary a client can timestamp.

![Timeline showing three reasoning visibility cases: hidden reasoning where first content equals first answer, exposed reasoning where a reasoning event precedes answer output, and summary case where a reasoning summary event precedes answer output.](/research/reasoning-ttft-ttfo/charts/chart-01-reasoning-stream-timeline.svg "Observable stream patterns. Hidden internal reasoning is not timestamped — the figure shows only what a client can observe.")

## / CALCULATION — What does AIPerf TTFT measure?

Under current AIPerf semantics:

$$
TTFT = t_any - t0
$$

and:

$$
TTFO = t_out - t0
$$

AIPerf states that TTFO is the first non-reasoning output token. For models without separately exposed reasoning, TTFO and TTFT are equivalent.

That last sentence matters. **Reasoning inside the model does not by itself create two client-visible clocks.** The gap exists only when the interface and parser expose an earlier content event that TTFT counts.

## Hidden reasoning: no observable gap is required

Suppose a model performs internal reasoning, but the API emits nothing to the client until answer text starts at 650 ms.

Then the observable stream can be:

$$
t_any = t_out = 650 ms
$$

and therefore:

$$
TTFT = TTFO = 650 ms
$$

The model may have done substantial internal work. The client cannot timestamp its start from the response stream. A usage field reporting reasoning tokens still does not reveal when those tokens were produced.

This is why **reasoning-token accounting and reasoning-stream visibility must be separate columns in benchmark data**.

## Exposed reasoning: the two clocks can split

Now take a system that emits reasoning content at 150 ms and answer text at 2,200 ms.

A reasoning-aware parser may see:

- request sent: 0 ms;
- first reasoning content: 150 ms;
- first answer output: 2,200 ms;
- completion: 4,200 ms.

Under AIPerf-style event semantics:

$$
TTFT = 150 ms
$$

$$
TTFO = 2200 ms
$$

The proposed **reasoning-to-output gap** is:

$$
\Delta_{R\to O} = TTFO - TTFT
$$

so:

$$
\Delta_{R\to O} = 2050 ms
$$

This is not a new industry metric. It is an analytical field that makes the event difference visible.

It also does **not** mean the model "reasoned for 2.05 seconds." It means the client waited another 2.05 seconds between the benchmark's first-any-content event and first non-reasoning output. There may be buffering, networking, mixed event types or implementation-specific behavior inside that interval.

That caveat is the difference between an observable measurement and a story about hidden internals.

![Two-bar comparison showing TTFT at 150 ms and TTFO at 2,200 ms with the 2,050 ms reasoning-to-output gap highlighted between them.](/research/reasoning-ttft-ttfo/charts/chart-02-ttft-vs-ttfo.svg "SCENARIO. The 2,050 ms gap is client-observed first-content to first-answer delay, not hidden reasoning duration.")

## A reasoning summary is another event class

Google's current Gemini Interactions documentation provides a useful third case. When thinking summaries are enabled, streaming can emit `thought_summary` deltas during a thought step. A `thought_signature` is a separate encrypted representation of model state. The model output appears in a later `model_output` step.

Google describes thought summaries as summaries of the model's reasoning, not as the raw internal thoughts themselves. Usage can separately report thought tokens and output tokens.

So a benchmark could observe a summary before the answer. That gives the product a choice.

If the UI deliberately shows the summary as useful progress, time to first summary may matter to perceived responsiveness. If the user is waiting for the answer itself, first answer output remains the relevant event.

The benchmark should therefore record the event type rather than silently putting all content into one bucket called "first token."

## OpenAI exposes enough event structure to make the same point

The current OpenAI Responses streaming reference has distinct event families for reasoning summaries and output text. It also reports reasoning-token usage separately inside output token details and exposes reasoning-effort and summary configuration.

That is enough to establish the measurement rule: **timestamp the events actually emitted by the selected model/API configuration; do not infer a hidden reasoning start time from token counts, encrypted state or summaries.**

The Responses event schema also includes reasoning-related content event types, but availability is model- and configuration-dependent. A benchmark contract should therefore record what was actually observable in the run rather than promoting one schema field into a universal provider behavior.

This article does not use private chain-of-thought content. It only normalizes public API event semantics.

## vLLM gives the clearest exposed-reasoning serving case

Current vLLM documentation separates `reasoning` from final `content` for supported reasoning models and can stream the reasoning field in response deltas. The field used to be called `reasoning_content` and has been renamed to `reasoning`.

That is exactly the type of interface where a client parser can distinguish:

1. first exposed reasoning content;
2. first final-answer content.

It is also a warning about historical benchmark lineage. A parser written around one field name, one model template or one tool version can change what it sees without the model itself changing.

## / CALCULATION — The winner can reverse

Consider two synthetic systems. These are not provider benchmarks.

**System A** exposes reasoning quickly:

- TTFT: 150 ms;
- TTFO: 2,200 ms.

**System B** exposes no pre-answer reasoning:

- TTFT: 600 ms;
- TTFO: 600 ms.

Rank by TTFT:

**A wins.** 150 ms is lower than 600 ms.

Rank by first answer output:

**B wins.** 600 ms is lower than 2,200 ms.

Nothing about model execution changed between the two rankings. We changed the event being scored.

Let each system's gap be:

$$
\Delta_A = TTFO_A - TTFT_A
$$

$$
\Delta_B = TTFO_B - TTFT_B
$$

A rank reversal occurs when A wins TTFT but loses TTFO:

$$
TTFT_A < TTFT_B
$$

and:

$$
TTFT_A + \Delta_A > TTFT_B + \Delta_B
$$

Rearranging:

$$
\Delta_A - \Delta_B > TTFT_B - TTFT_A
$$

For the scenario:

- left side = 2,050 ms;
- right side = 450 ms.

The inequality holds, so the ranking flips.

This is the most important practical result in the article. A procurement table that stores only "TTFT" without storing the event definition can rank two systems on the wrong product question.

![Grouped bar chart showing System A winning on TTFT (150 ms vs 600 ms) but losing on TTFO (2,200 ms vs 600 ms), demonstrating rank reversal.](/research/reasoning-ttft-ttfo/charts/chart-03-rank-reversal.svg "SCENARIO. The TTFT winner and TTFO winner are different systems. This is not a provider speed comparison.")

## The model can stay identical while the benchmark number changes

NVIDIA's current migration guide from GenAI-Perf to AIPerf provides a real semantic example.

For reasoning-capable models with reasoning in a separate field, the guide says GenAI-Perf did not parse the reasoning tokens. It waited for the first non-reasoning output token before recording TTFT.

AIPerf parses reasoning and defines TTFT as first token of any type. It introduces TTFO for first non-reasoning output.

NVIDIA therefore instructs users migrating historical reasoning benchmarks to compare:

**GenAI-Perf TTFT ↔ AIPerf TTFO**

not:

**GenAI-Perf TTFT ↔ AIPerf TTFT.**

## / CALCULATION — Same trace, different reported "TTFT"

Take one synthetic trace:

- first exposed reasoning: 180 ms;
- first answer output: 950 ms;
- completion: 2,400 ms.

Process it with the documented semantics:

- GenAI-Perf TTFT: **950 ms**;
- AIPerf TTFT: **180 ms**;
- AIPerf TTFO: **950 ms**.

The model did not become 770 ms faster. The tool changed which event carries the TTFT label.

This is why benchmark history needs **metric lineage**: tool, tool version, parser, endpoint and the exact start/stop event definition.

The same migration issue appears in token counts. NVIDIA says AIPerf Output Sequence Length includes reasoning plus output tokens, while AIPerf Output Token Count excludes reasoning and is the comparable field to GenAI-Perf OSL for reasoning-capable models.

A label without its semantics is not a complete benchmark record.

![Three bars showing GenAI-Perf TTFT at 950 ms, AIPerf TTFT at 180 ms, and AIPerf TTFO at 950 ms — same underlying trace, different metric semantics.](/research/reasoning-ttft-ttfo/charts/chart-04-metric-migration.svg "FACT MAPPING + SYNTHETIC TRACE. Same model trace; metric parser semantics differ. The apparent -770 ms shift is a label change, not a speed change.")

## TTFO is not the new magic number

The obvious reaction is to throw away TTFT and standardize on TTFO.

That would lose information.

Suppose two products both begin answer output at 1,000 ms. One displays useful reasoning progress at 150 ms; the other shows nothing until 1,000 ms. TTFO calls the answer-start experience equal. A product that intentionally exposes useful progress may care about the earlier event.

Conversely, two systems can have the same 150 ms TTFT while one starts its answer at 500 ms and another at 4,000 ms. A TTFT-only dashboard calls them equal even though answer-start latency differs by 8×.

The correct response is not to replace one single metric with another. It is to **measure the timeline**.

## What should the SLO actually say?

For a conventional streaming chat product with no exposed pre-answer content, "TTFT under 500 ms" may be an understandable responsiveness target because TTFT and first answer output are the same observable event.

For a reasoning product that displays progress, define two product-level events in plain English:

**FIRST PROGRESS CONTENT**

and:

**FIRST ANSWER OUTPUT.**

Then attach SLOs to the events:

$$
TTFT <= S_{progress}
$$

$$
TTFO <= S_{answer}
$$

only if the benchmark's TTFT truly maps to first useful progress.

Also keep end-to-end latency. A model can start the final answer quickly and still take a long time to finish it.

For capacity work, the benchmark can calculate first-answer goodput:

$$
G_{TTFO} = N_{TTFO\text{-SLO}} / T
$$

where the numerator counts requests meeting the chosen first-answer threshold and `T` is the measurement interval.

This is useful when a system serves many requests concurrently: raw throughput can rise while the percentage of requests meeting the answer-start target falls.

Do not pick universal thresholds from this article. The product owns the thresholds.

## Reasoning configuration belongs in every latency record

OpenAI exposes reasoning-effort settings. Gemini exposes thinking configuration such as thinking levels or budgets depending on model generation. vLLM supports model-specific thinking controls and reasoning parsers.

Those settings can change the amount of reasoning work, latency and potentially quality.

A latency comparison that changes the reasoning setting is not a clean systems comparison.

The minimum reasoning-latency record should contain:

- provider/API;
- model;
- reasoning enabled or disabled;
- reasoning effort/level/budget;
- whether reasoning content is exposed;
- whether a reasoning summary is exposed;
- benchmark tool and version;
- parser or endpoint type where material;
- TTFT event definition;
- TTFT;
- TTFO when observable;
- E2E latency;
- TPOT/ITL semantics;
- reasoning-token count when supplied;
- answer/output-token count;
- SLO definitions and attainment.

Missing event data should be `NOT OBSERVABLE` or `UNKNOWN`, never zero.

Zero is a measurement. Missing is not.

![Specification plate listing the minimum reasoning-latency benchmark record fields: model and API, token accounting, reasoning configuration, stream rate, visibility, lineage, metric semantics, SLO, and latency.](/research/reasoning-ttft-ttfo/charts/chart-05-reasoning-latency-record.svg "EDITORIAL SYNTHESIS / PROPOSED RECORD. Not an official provider schema — a buyer-facing comparison record for reasoning-model latency.")

## / CLAIM CHECK — "TTFT is always the time until the user sees the answer."

**CLAIM**

"TTFT is always the time until the user sees the answer."

**SECOND / PASS**

NO.

Current AIPerf is a direct counterexample for reasoning-capable interfaces: TTFT can stop on a reasoning token while TTFO stops on the first non-reasoning output.

## / CLAIM CHECK — "A lower TTFT means a reasoning model answers sooner."

**CLAIM**

"A lower TTFT means a reasoning model answers sooner."

**SECOND / PASS**

NOT NECESSARILY.

System A in the rank-reversal scenario has the lower TTFT and the higher TTFO. The first answer arrives later.

## / CLAIM CHECK — "TTFO should replace TTFT."

**CLAIM**

"TTFO should replace TTFT."

**SECOND / PASS**

NO.

TTFO is better for the question "when does non-reasoning answer output begin?" TTFT can still describe time to first useful progress when the product exposes progress intentionally. End-to-end latency still describes something else again.

## Percentiles do not rescue an ambiguous event

Most production latency reviews do not use one request. They use distributions: median, p90, p95 or p99. That does not solve the semantic problem. It can hide it more neatly.

Suppose a dashboard shows p99 TTFT of 300 ms for one system and 700 ms for another. If the first system's parser stops on exposed reasoning while the second system's parser stops on answer text, the percentile calculation can be numerically perfect and still compare different events. The problem is upstream of statistics.

The benchmark contract should therefore bind each distribution to an event definition. Instead of storing only:

`p99_ttft_ms = 300`

store enough metadata to reconstruct the meaning:

- metric label: TTFT;
- stop event: first non-empty content of any recognized type;
- reasoning content included: yes;
- tool: AIPerf;
- tool version;
- endpoint/parser;
- reasoning configuration.

Do the same for TTFO. Then p99 TTFT and p99 TTFO become interpretable distributions instead of free-floating acronyms.

This also matters when a fleet contains mixed request types. If some requests expose reasoning and others do not, a single TTFT histogram can combine two different product experiences. Segmenting by reasoning visibility and configuration may be necessary before drawing conclusions. That is a measurement choice, not a claim that every deployment must use the same segmentation.

## Token accounting can drift with the latency metric

The AIPerf migration documentation shows that reasoning support changes more than first-token latency. It also changes sequence-length accounting. Current AIPerf separates **Reasoning Token Count** from **Output Token Count**, while its Output Sequence Length includes both reasoning and output tokens for reasoning-aware parsing. NVIDIA says GenAI-Perf OSL excluded the separately returned reasoning field, making AIPerf Output Token Count the like-for-like migration comparison.

That means a benchmark migration can move both axes of a performance chart at once: the latency event can change and the token denominator can change. A tokens-per-second number is not comparison-safe merely because its label stayed the same.

For provider APIs, usage accounting has its own semantics. OpenAI Responses reports reasoning tokens inside output-token details. Gemini reports thought tokens separately from output tokens. Neither field tells the benchmark when those hidden or summarized reasoning tokens appeared on the network. Token accounting and stream timing must therefore remain separate evidence streams.

A complete benchmark record should be able to answer two independent questions: **what did we count?** and **when did the client observe it?**

## What this changes economically

Latency numbers are used for architecture selection, provider comparison, capacity targets and procurement.

If the metric definition moves while the dashboard label stays the same, a company can make three mistakes.

First, it can report an apparent latency improvement caused by a parser migration rather than a faster system.

Second, it can select the system with the better first-progress number when the buyer actually values first-answer latency.

Third, it can compare token-throughput or sequence-length results whose reasoning-token inclusion rules differ.

Those are measurement-contract failures, not GPU failures.

The fix is cheap compared with a bad capacity decision: preserve the event trace, parser semantics and tool version alongside every benchmark result.

## A company procedure

1. Define what "first useful output" means for the product.
2. Capture raw client-observed streaming events with timestamps.
3. Classify each content-bearing event: reasoning, summary, answer/output or other.
4. Identify the first non-empty content event.
5. Identify the first answer/output event.
6. Record whether reasoning is hidden, separately exposed or summarized.
7. Record reasoning effort, level or budget.
8. Calculate TTFT and TTFO separately when both are observable.
9. Calculate the reasoning-to-output gap without calling it hidden reasoning duration.
10. Retain E2E and the exact TPOT/ITL definition.
11. Evaluate SLO goodput against product-defined targets.
12. Store tool/version/parser semantics with every benchmark row.

Then repeat the same workload under the same reasoning configuration.

## SECOND PASS

TTFT is not broken. **An unlabeled first-token event is.**

For reasoning models, the benchmark needs to say what arrived first.

If the interface exposes no pre-answer reasoning, TTFT may already be first answer output. If it exposes reasoning separately, current AIPerf can clock that earlier reasoning event while TTFO clocks the answer. If it exposes a summary, the summary is another observable event—not proof of raw chain-of-thought timing.

The measurement rule is simple:

**name the event, timestamp the event, preserve the parser semantics.**

Only then compare systems.

---

## / INTELLIGENCE

Benchmarking reasoning models across providers or serving stacks?

SECOND / PASS can normalize the stream-event semantics, reasoning configuration and SLO measurements before latency numbers are used for architecture or procurement decisions.

[START A RESEARCH BRIEF →](/intelligence)
