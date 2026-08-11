---
title: "Tokens per second is not an inference benchmark"
dek: "A bare tokens-per-second number does not identify request capacity, individual streaming speed, latency or SLO-compliant capacity. Before two inference results can be compared, the metric contract and operating point have to be attached."
slug: "tokens-per-second-is-not-an-inference-benchmark"
section: "Research"
format: "PROOF"
author: "Aditya"
publishedAt: "2026-08-11"
status: "published"
firstPass:
  - "The label tokens/s is under-specified until its numerator, denominator, scope, aggregation rule and timing boundaries are known."
  - "Output token throughput cannot determine request throughput without output length: 1,000 output tok/s is 10 req/s at 100 output tokens/request but only 1 req/s at 1,000."
  - "Aggregate output throughput cannot identify one user's streaming rate: a constructed 400 tok/s steady state can be 20 users at 20 tok/s/user or 80 users at 5."
  - "Aggregate token throughput does not contain the event timing required to recover TTFT, TPOT/ITL or tail latency, so equal TPS can coexist with very different service behavior."
  - "A buyer-facing benchmark record should pair the metric contract with workload, load, system, latency, SLO goodput, failures and a quality gate before the number becomes comparison-safe."
featured: false
featuredRank: 0
editorialOrder: 1
demo: false
tags:
  - "LLM inference"
  - "benchmarking"
  - "tokens per second"
  - "vLLM"
  - "AIPerf"
  - "MLPerf"
  - "TensorRT-LLM"
  - "SGLang"
hero: "/research/tokens-per-second-benchmark/charts/chart-02-same-tps-request-capacity.svg"
heroAlt: "Both systems produce 1,000 output tokens per second. At mean OSL 100, System A completes 10 requests per second; at OSL 1,000, System B completes 1 request per second."
adPolicy: "none"
sources:
  - label: "vLLM — bench serve source/API"
    url: "https://docs.vllm.ai/en/latest/api/vllm/benchmarks/serve/"
    type: "primary"
    note: "Current formulas for request throughput, goodput, output throughput, total token throughput and latency distributions."
  - label: "NVIDIA — AIPerf Metrics Reference"
    url: "https://docs.nvidia.com/aiperf/reference/ai-perf-metrics-reference"
    type: "primary"
    note: "Current aggregate, per-user, reasoning-token, latency and goodput definitions."
  - label: "MLCommons — MLPerf Inference Rules"
    url: "https://github.com/mlcommons/inference_policies/blob/master/inference_rules.adoc"
    type: "primary"
    note: "Server/Interactive and Offline scenarios, latency constraints, quality requirements and LoadGen rules."
  - label: "NVIDIA — TensorRT-LLM Performance Overview"
    url: "https://nvidia.github.io/TensorRT-LLM/performance/perf-overview.html"
    type: "primary"
    note: "Current throughput-mode reporting distinguishes total output throughput, per-user speed, TTFT and TPOT."
  - label: "SGLang — Bench Serving Guide"
    url: "https://github.com/sgl-project/sglang/blob/main/docs/developer_guide/bench_serving.md"
    type: "primary"
    note: "Current serving benchmark reports request/input/output/total throughput plus latency and load controls."
changeLog:
  - at: "2026-08-11"
    type: "published"
    note: "Initial publication."
seoTitle: "Tokens per second is not an inference benchmark"
seoDescription: "A proof of why bare tokens/s cannot identify request capacity, user speed, latency or SLO goodput—and the minimum benchmark record buyers should demand."
---

A benchmark claim such as:

**4,000 tokens/sec**

is not yet a complete result.

The number may be correct. The problem is that the label does not tell us what was counted, what time interval was used, which requests were included, whether the rate is aggregate or per user, what load produced it, or whether the requests met an interactive latency target.

That missing context is not cosmetic.

It changes what the number means.

Current benchmark tools make this visible. vLLM's current `bench serve` calculates request throughput, request goodput, output token throughput and total token throughput as separate fields. NVIDIA AIPerf separately defines aggregate output token throughput and output-token throughput per user—and explicitly says the two are not directly comparable. TensorRT-LLM's current throughput output puts total output throughput beside request throughput, per-user output speed, TTFT and TPOT. SGLang likewise reports request, input-token, output-token and total-token throughput together with latency metrics.

The problem is therefore not that **tokens/s is useless**.

The problem is that:

**tokens/s alone is under-specified.**

## / QUESTION

When someone says:

**"This system does 4,000 tokens/s."**

Ask:

**4,000 what tokens?**

Input?

Output?

Input plus output?

Reasoning plus visible output?

Aggregate across every request?

Per request?

Over what start/end interval?

At what request rate or concurrency?

At what input and output length?

With what TTFT and TPOT?

How many requests failed?

How many met the SLO?

How many GPUs produced the number?

Until those questions have answers, the number cannot uniquely identify the serving behavior a buyer usually cares about.

## A metric needs a contract

SECOND / PASS uses a proposed measurement representation:

$$
M
=
(N,D,S,A,E)
$$

where:

- `N` = numerator;
- `D` = denominator;
- `S` = scope or population;
- `A` = aggregation rule;
- `E` = event boundaries.

This is a **SECOND / PASS measurement framework**, not an industry standard.

For aggregate output token throughput, one possible contract is:

**OUTPUT_TOKENS / WALL_SECOND / AGGREGATE / COMPLETED_REQUESTS**

The numerator is completed output tokens.

The denominator is benchmark wall time.

The scope is the benchmark's completed/successful requests.

The aggregation is a sum.

The event boundary says when that wall clock starts and stops.

Compare that with:

**OUTPUT_TOKENS / ITL_SECOND / PER_REQUEST**

The unit can still be called tokens/s.

The metric is different.

![Definition plate separates input tokens per wall second, output tokens per wall second, total tokens per wall second, per-user output rate based on ITL, and SLO request goodput.](/research/tokens-per-second-benchmark/charts/chart-01-what-tps-means.svg "The same unit label can describe different numerators, denominators and scopes. PROPOSED FRAMEWORK — not an official standard.")

## Current tools already distinguish the definitions

Current vLLM `bench serve` computes:

- request throughput = completed requests / benchmark duration;
- request goodput = requests satisfying configured TTFT/TPOT/E2E SLOs / benchmark duration;
- output token throughput = actual output tokens / benchmark duration;
- total token throughput = input tokens + actual output tokens / benchmark duration.

The current CLI separately lets the benchmark choose request rate, arrival burstiness, latency percentile metrics and goodput thresholds.

That alone is enough to reject the idea that one generic "throughput" field captures the run.

AIPerf goes further.

Its aggregate **Output Token Throughput** is total output sequence length divided by benchmark duration.

Its **Output Token Throughput Per User** is a per-request record metric based on inverse ITL.

AIPerf says those metrics are not directly comparable because the per-user metric excludes TTFT and answers an individual streaming question, while aggregate output throughput answers a system-capacity question.

Reasoning-capable models add another semantic trap.

Current AIPerf migration documentation says AIPerf TTFT is time to the first token of any type, including reasoning, while TTFO is time to the first non-reasoning output token. It also distinguishes OSL—which can include separately exposed reasoning tokens—from Output Token Count, which excludes those reasoning tokens.

So even "first token" and "output tokens" can need a metric definition before two tools are aligned.

### The current tools are not disagreeing; they are measuring different objects

That distinction matters editorially.

Different benchmark definitions are not automatically wrong.

vLLM's aggregate output throughput is useful for measuring how many generated tokens the tested serving system finishes over the benchmark wall clock. Its total token throughput answers a different workload-rate question because it adds input tokens. Its request goodput answers another question again: how many completed requests also satisfy the configured latency conditions.

AIPerf's per-user output rate intentionally moves to a request-level denominator based on inter-token latency. It is trying to describe what an individual stream experiences after the first token, not total system generation capacity.

TensorRT-LLM's current performance output makes the same separation visible in one report: maximum-load total output throughput can be high while per-user output speed, TTFT and TPOT tell a different story about each request.

SGLang's serving benchmark similarly records the load controls that produced the result, including request rate and concurrency, next to request/token throughput and latency metrics.

MLPerf goes further by standardizing the scenario itself. Its Server/Interactive result is produced under generated request arrivals and latency rules. Its Offline result measures a different operating regime.

The correct conclusion is therefore not:

**one tool has the right TPS definition.**

It is:

**a comparison has to know which measurement each tool made.**

That is why the workbook uses a semantic ID rather than matching only the printed metric label.

## Base quantities

Suppose `N` requests complete during benchmark duration `T`.

Request `i` has:

input tokens:

$$
I_i
$$

and output tokens:

$$
O_i.
$$

Total input:

$$
I
=
\sum_{i=1}^{N}I_i
$$

Total output:

$$
O
=
\sum_{i=1}^{N}O_i.
$$

Now the basic rates become explicit.

Request throughput:

$$
R_{\text{req}}
=
\frac{N}{T}.
$$

Input token throughput:

$$
R_{\text{in}}
=
\frac{I}{T}.
$$

Output token throughput:

$$
R_{\text{out}}
=
\frac{O}{T}.
$$

Total token throughput:

$$
R_{\text{total}}
=
\frac{I+O}{T}.
$$

The last two are numerically different whenever input tokens are nonzero.

## / CALCULATION — output TPS and total TPS are different

Take one 1-second run.

System X processes:

- 1,500 input tokens;
- 500 output tokens.

Then:

**output TPS = 500**

but:

**total TPS = 2,000.**

System Y processes:

- 500 input tokens;
- 1,500 output tokens.

Then:

**output TPS = 1,500**

and:

**total TPS = 2,000.**

The systems have identical **total TPS** and 3× different **output TPS**.

This does not mean output tokens and input tokens have a universal 3× compute relationship.

The proof is narrower:

**the numerator composition matters.**

A bare "2,000 tokens/s" cannot tell us which run we are looking at.

## / CALCULATION — proof #1: same output TPS, different request capacity

Mean output sequence length is:

$$
\bar O
=
\frac{O}{N}.
$$

From the definitions:

$$
R_{\text{out}}
=
\frac{O}{T}
=
\frac{N}{T}
\frac{O}{N}.
$$

Therefore:

$$
R_{\text{out}}
=
R_{\text{req}}\bar O.
$$

Rearrange:

$$
R_{\text{req}}
=
\frac{R_{\text{out}}}{\bar O}.
$$

Now build two purely mathematical systems.

### System A

Output throughput:

**1,000 output tok/s**

Mean OSL:

**100 tokens/request**

Therefore:

$$
R_{\text{req}}
=
\frac{1000}{100}
=
10\text{ req/s}.
$$

### System B

Output throughput:

**1,000 output tok/s**

Mean OSL:

**1,000 tokens/request**

Therefore:

$$
R_{\text{req}}
=
\frac{1000}{1000}
=
1\text{ req/s}.
$$

Same output TPS.

**10× different request throughput.**

Nothing about the output-TPS number itself tells us which request capacity is present.

![Both systems produce 1,000 output tokens per second. At mean OSL 100, System A completes 10 requests per second; at OSL 1,000, System B completes 1 request per second.](/research/tokens-per-second-benchmark/charts/chart-02-same-tps-request-capacity.svg "Output TPS determines request throughput only when mean output length is known. MATHEMATICAL SCENARIO — no production systems measured.")

This is the first non-identifiability result:

**output token throughput does not uniquely identify request throughput without output length.**

## / CALCULATION — proof #2: aggregate TPS does not identify user speed

Now construct a steady-state serving example.

This is deliberately not a general queueing equation.

Assume active streams continuously emit at the stated constant rate with no queue/drain transients.

### System A

20 active users.

20 output tok/s/user.

Aggregate:

$$
20\times20
=
400\text{ output tok/s}.
$$

### System B

80 active users.

5 output tok/s/user.

Aggregate:

$$
80\times5
=
400\text{ output tok/s}.
$$

Same aggregate output rate.

**4× different individual streaming rate.**

![Two constructed systems both produce 400 output tokens per second. One has 20 active users at 20 tokens per second per user; the other has 80 users at 5 tokens per second per user.](/research/tokens-per-second-benchmark/charts/chart-03-aggregate-vs-user.svg "Same aggregate rate, four-times different individual stream rate. CONSTRUCTED STEADY-STATE SCENARIO — do not infer general continuous-batching identity.")

This is not a claim that arbitrary continuous-batching systems satisfy aggregate throughput = concurrency × one constant user rate.

The constructed example proves only the non-uniqueness:

**the same aggregate token rate can coexist with different per-user token pacing.**

AIPerf's metric split exists for exactly this reason: aggregate Output Token Throughput and per-request Output Token Throughput Per User answer different questions.

## Tokens/s cannot identify TTFT

Aggregate output throughput uses total output tokens and a run-level time denominator.

TTFT needs the event time when each request's first token appears.

Those timestamps are absent from `O/T`.

Construct two 10-second timelines with the same:

- completed request count;
- output token total;
- benchmark duration.

Both therefore have the same output TPS.

In timeline A, each request emits its first token after 100 ms and then generates slowly.

In timeline B, each request waits 2 seconds before its first token, then emits the remaining tokens faster enough that the same total output is still completed inside the same 10-second benchmark.

`N`, `O` and `T` can be identical.

The TTFT distribution is different.

Therefore:

**TTFT is not identifiable from aggregate output TPS.**

### An explicit event-timeline proof

Make the non-identifiability concrete.

Assume two benchmark runs both last 10 seconds, complete 10 requests and produce 1,000 output tokens.

Both have:

**100 output tok/s.**

Now assign different first-token events.

In Run A, all ten requests receive their first token at 0.2 seconds after their own request start. The remaining output is paced so every request still completes inside the 10-second run.

In Run B, all ten requests receive their first token at 2.0 seconds. After that delay, their remaining tokens are emitted quickly enough that the same 1,000 tokens still finish before the same benchmark end.

The aggregate tuple used by output TPS is unchanged:

- `O = 1,000`;
- `T = 10 seconds`.

The first-token event distribution changed by 10×.

No transformation of `O/T` can recover which timeline occurred because the first-token timestamps were never included in the numerator or denominator.

The same construction can be made for a tail.

Nine requests can receive the first token quickly while one request waits much longer. A different run can distribute the same total work evenly. If both still finish the same number of tokens inside the same wall interval, aggregate TPS can remain identical while p99-like service behavior differs sharply.

That is an information problem, not merely a correlation problem.

The aggregate metric does not contain the missing event timestamps.

## Tokens/s cannot identify TPOT or ITL

The same argument applies to token spacing.

A run can use many concurrent streams with slow token spacing and still produce the same aggregate output rate as a run with fewer streams and faster individual pacing.

AIPerf currently defines ITL from request latency minus TTFT, divided across the decode token intervals, while its per-user output rate is the inverse of that ITL.

That information does not exist inside one aggregate `O/T` number.

So:

**aggregate output TPS does not uniquely identify TPOT/ITL.**

It also cannot identify p95 or p99 TTFT, TPOT, ITL or end-to-end latency. Tail percentiles require the request-level distribution.

## Little's Law does not rescue the missing information

At steady state, Little's Law is:

$$
L
=
\lambda W.
$$

`L` is average population in the system.

`lambda` is request arrival/completion rate under the stability assumptions.

`W` is average time in the system.

A bare output token throughput number supplies neither request-rate `lambda` nor system population `L`.

Without OSL, it does not even determine request throughput.

So Little's Law cannot reconstruct request latency from raw token throughput alone.

The missing variables remain missing.

## Load is part of the measurement

Current vLLM `bench serve` can send requests at a configured request rate; finite rates use a generated arrival process, while infinite rate sends requests immediately.

SGLang's current serving benchmark exposes both request rate and maximum concurrency.

NVIDIA's current NIM benchmarking guidance likewise treats concurrency and request rate as load controls and warns that throughput can saturate while latency continues rising.

A throughput claim without its offered load therefore omits the operating point.

This article does not attempt the full workload-transferability problem.

The narrower point is:

**a benchmark number needs the load at which it was measured.**

## Offline and serving are different questions

vLLM has separate online `bench serve` and offline `bench throughput` commands.

SGLang likewise separates its online serving benchmark from offline throughput measurement.

TensorRT-LLM's current performance overview labels its throughput table as a maximum-load experiment where a local client feeds requests at an infinite rate.

MLPerf makes the distinction formal.

In current MLPerf Inference rules, Server/Interactive sends new queries according to a Poisson process and finds the maximum supported throughput under benchmark-specific latency constraints.

Offline sends the benchmark samples at once and measures throughput without the same interactive latency requirement.

A buyer can legitimately care about either.

But:

**offline maximum throughput and online serving throughput are not automatically comparison-equivalent.**

## / CALCULATION — proof #3: same TPS, different SLO goodput

Now make the enterprise consequence explicit.

Two mathematical scenario systems use:

- the same four GPUs;
- the same 100-second duration;
- the same 1,000 completed requests;
- the same mean OSL = 100;
- the same 100,000 output tokens.

Both therefore produce:

**1,000 output tok/s**

and:

**10 raw req/s.**

Define one request SLO:

- TTFT <= 500 ms;
- TPOT <= 50 ms/token.

### System A

900 of 1,000 requests satisfy all SLO requirements.

Therefore:

$$
G_{\text{SLO,A}}
=
\frac{900}{100}
=
9\text{ good req/s}.
$$

Per GPU:

$$
G_{\text{SLO/GPU,A}}
=
\frac{9}{4}
=
2.25.
$$

### System B

500 of 1,000 requests satisfy the same SLO.

Therefore:

$$
G_{\text{SLO,B}}
=
\frac{500}{100}
=
5\text{ good req/s}.
$$

Per GPU:

$$
G_{\text{SLO/GPU,B}}
=
1.25.
$$

Same output TPS.

Same raw request throughput.

Same GPU count.

**80% more SLO-compliant request capacity in System A.**

![Both four-GPU systems produce 1,000 output tokens per second and 10 raw requests per second, but one delivers 9 SLO-compliant requests per second and the other 5.](/research/tokens-per-second-benchmark/charts/chart-04-tps-vs-goodput.svg "Headline throughput can remain identical while useful service capacity changes sharply. MATHEMATICAL SCENARIO — SLO pass values are not measured systems.")

That is why a procurement decision can change even when the headline throughput does not.

Current vLLM and AIPerf both expose request goodput concepts based on user-defined latency constraints rather than forcing the buyer to treat every completed request as equally useful.

## Failures cannot disappear behind token throughput

Suppose 1,000 requests are issued.

If 900 complete and 100 fail, reporting only the token rate of the successful 900 hides the failed workload.

A benchmark record should therefore disclose at least:

- issued;
- completed;
- failed;
- SLO-compliant.

AIPerf's current good-request fraction explicitly includes errored requests in the attempted-request denominator so a backend cannot look better merely because dropped traffic disappeared from the latency distribution.

That is a useful design principle even when a company uses another tool.

## Quality is a gate

A faster output is not an equivalent result if the comparison changes the model quality target.

Current MLPerf rules combine performance measurement with benchmark-specific quality requirements. Its run definition includes meeting the scenario's quality requirement, not just completing work quickly.

A buyer does not need to copy MLPerf's exact quality methodology for every internal benchmark.

The lesson is simpler:

**performance numbers should be compared under an intended quality/accuracy gate.**

Model revision, precision/quantization, reasoning mode and output policy therefore belong in benchmark identity.

## The counterpoint: sometimes tokens/s is exactly right

Do not overcorrect.

Suppose the actual buyer objective is:

**maximize aggregate output generation for a fixed offline batch.**

The benchmark pins:

- the same model and revision;
- the same quality requirement;
- the same hardware footprint;
- the same precision;
- the same input/output workload;
- the same output rule;
- the same benchmark timing boundary.

Interactive TTFT is irrelevant to that purchase objective.

In that case:

**aggregate output tokens/s can be an excellent primary metric.**

The proof is not:

**tokens/s is bad.**

The proof is:

**tokens/s alone is not a complete inference benchmark.**

## The minimum benchmark record

A comparable performance claim should attach enough information to reconstruct what the number actually measures.

SECOND / PASS proposes this minimum record:

### Metric

- metric name;
- metric definition;
- semantic ID;
- numerator;
- denominator;
- aggregation;
- timing start/end boundary.

### Workload

- ISL;
- OSL;
- dataset/task identity where relevant;
- sampling/output rule.

### Load

- offline or serving;
- request rate and/or concurrency;
- duration;
- warmup policy.

### System

- model and revision;
- precision/quantization;
- runtime and version;
- parallelism;
- accelerator model and count;
- host count/interconnect.

### Latency

- TTFT;
- TPOT/ITL;
- E2E where relevant;
- the percentiles relevant to the buyer.

### Goodput

- SLO thresholds;
- SLO-compliant requests/s;
- per-GPU normalization where useful;
- issued/completed/failed request counts.

### Quality

- quality or accuracy gate;
- pass/fail/status.

![Technical specification plate lists metric, workload, load, system, latency, goodput and quality information required for a comparison record.](/research/tokens-per-second-benchmark/charts/chart-05-benchmark-record.svg "A throughput value becomes comparison-safe only after its measurement contract and operating point are attached. PROPOSED SECOND / PASS FRAMEWORK — not an official vLLM/NVIDIA/MLPerf schema.")

This is not an official standard.

It is a buyer-facing comparison record designed to stop under-specified metrics from becoming capacity decisions.

### What "comparable" should mean

The workbook deliberately has three outputs rather than a green/red score.

**COMPARABLE** means the metric semantics align and the decision-critical benchmark identity fields are compatible.

It does not mean the two systems are equally good.

It means the numerical difference can be interpreted as a difference under the declared comparison contract.

**NOT DIRECTLY COMPARABLE** means the results can both be valid, but a controlling dimension differs—for example output TPS versus total TPS, Server versus Offline mode, a different model/quality gate, or a materially different output rule.

That is not a command to discard either result.

It is a warning not to calculate a ratio such as "System A is 1.4× faster" as though both numbers measured the same object.

**INSUFFICIENT METADATA** means the comparison cannot yet be evaluated because a field required for the intended inference is missing.

For example, output TPS without mean OSL cannot be converted into request throughput. A serving result with a latency SLO but no relevant latency percentile cannot establish whether that SLO was met. A throughput result with no accelerator count cannot support a per-GPU capacity comparison.

This third state matters because missing information is not evidence of equality and is not evidence of failure.

It is simply missing.

## / CLAIM CHECK — "System A has more tokens/sec, so it can serve more users."

**CLAIM**

"System A has more tokens/sec, so it can serve more users."

**SECOND / PASS**

NOT NECESSARILY.

Need at least:

OSL, load, latency/SLO and system size.

Higher output TPS can come from a different output-length mix or operating point.

## / CLAIM CHECK — "Tokens/sec is throughput, so latency does not matter."

**CLAIM**

"Tokens/sec is throughput, so latency does not matter."

**SECOND / PASS**

INCOMPLETE FOR INTERACTIVE SERVICE.

Throughput answers work rate.

Interactive capacity asks how much useful work survives the latency requirement.

That is why SLO goodput exists as a separate metric.

## / CLAIM CHECK — "Per-user tokens/sec and aggregate tokens/sec are basically the same."

**CLAIM**

"Per-user tokens/sec and aggregate tokens/sec are basically the same."

**SECOND / PASS**

NO.

AIPerf explicitly defines them separately.

One is run-level aggregate system capacity.

The other is request/user streaming rate based on token spacing.

## How to compare two benchmark claims

1. Write the exact metric semantic ID for both results.
2. Verify numerator and denominator.
3. Verify aggregate versus per-request scope.
4. Verify timing boundaries.
5. Check whether output tokens, total tokens or reasoning-inclusive tokens are counted.
6. Match model/revision/quality.
7. Record GPU/host/system size.
8. Record ISL/OSL and output rule.
9. Record offline versus serving mode.
10. Record request rate and/or concurrency.
11. Record TTFT and TPOT/ITL at relevant percentiles.
12. Record issued, completed and failed requests.
13. Calculate SLO goodput if the purchase has a latency requirement.
14. If a decision-critical field is missing, call the comparison **INSUFFICIENT METADATA**.
15. If the metric contract or benchmark regime differs, call it **NOT DIRECTLY COMPARABLE** instead of silently "normalizing" unlike tests.

## The second pass

"4,000 tokens/sec" is a number.

A benchmark is a measurement contract plus an operating point.

The core proof is algebraic:

$$
R_{\text{out}}
=
R_{\text{req}}\bar O.
$$

Without mean OSL, output TPS cannot identify request throughput.

The second proof is constructive:

the same aggregate output rate can coexist with different per-user generation rates.

The third proof is event-based:

aggregate output count divided by wall time contains no request-level timing information, so it cannot uniquely recover TTFT, TPOT/ITL or tail latency.

And the enterprise proof is SLO-based:

two systems can produce the same output TPS on the same hardware while one completes far more requests inside the service objective.

So the next time a benchmark says:

**X tokens per second**

the complete question is:

**X WHAT TOKENS / PER WHAT TIME / ACROSS WHAT REQUESTS / AT WHAT LOAD / WITH WHAT LATENCY / UNDER WHAT SLO?**

That is the benchmark.

---

## / INTELLIGENCE

Comparing inference systems from benchmark reports that use different throughput definitions?

SECOND / PASS can normalize the metric contracts, workload assumptions and SLO results before those numbers become a capacity or procurement decision.

[START A RESEARCH BRIEF →](/intelligence)
