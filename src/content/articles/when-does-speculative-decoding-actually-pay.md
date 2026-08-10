---
title: "When does speculative decoding actually pay?"
dek: "Speculative decoding wins only when the useful tokens emitted per speculative cycle are worth more than drafting, target verification and runtime overhead. Acceptance rate matters—but cycle cost, speculation depth, load and SLO goodput decide whether the production economics survive."
slug: "when-does-speculative-decoding-actually-pay"
section: "Systems"
format: "SECOND PASS"
author: "Aditya"
publishedAt: "2026-08-10"
status: "published"
firstPass:
  - "Acceptance alone is not enough. The core latency test is E[Y] > c_k, where E[Y] is useful output tokens per cycle and c_k is speculative-cycle time normalized by one baseline target-token time."
  - "Under the original linear speculative-sampling semantics and an iid teaching model, k=4 and alpha=0.80 produce E[Y]=3.3616. In the primary scenario, c_4=1.875, so modeled speedup is 1.79×."
  - "The primary break-even acceptance threshold is alpha*=0.4803. Below that, the same k=4 cycle costs more target-equivalent time than its useful-token multiplier repays."
  - "More speculative tokens are not automatically faster. With the primary timing curve, modeled speedup peaks at k*=4 and then falls as verification and proposal cost grow faster than marginal accepted-token gain."
  - "The production metric is SLO goodput and cost per SLO-compliant request. The same four-GPU primary case favors speculation; the high-load counter-case favors standard decode."
featured: true
demo: false
tags:
  - "speculative decoding"
  - "LLM inference"
  - "vLLM"
  - "TensorRT-LLM"
  - "SGLang"
  - "EAGLE"
  - "MTP"
  - "inference economics"
hero: ""
heroAlt: ""
adPolicy: "none"
sources:
  - label: "Leviathan et al. — Fast Inference from Transformers via Speculative Decoding"
    url: "https://proceedings.mlr.press/v202/leviathan23a.html"
    type: "primary"
    note: "Original distribution-preserving algorithm, expected-token model and simplified wall-time theorem."
  - label: "vLLM — Speculative Decoding"
    url: "https://docs.vllm.ai/en/latest/features/speculative_decoding/"
    type: "primary"
    note: "Current method support, workload dependence and lossless/numerical caveats."
  - label: "vLLM — Dynamic Speculative Decoding"
    url: "https://docs.vllm.ai/en/latest/features/speculative_decoding/dynamic_speculative_decoding/"
    type: "primary"
    note: "Current load-aware speculation-depth behavior and limitations."
  - label: "TensorRT-LLM — Speculative Decoding"
    url: "https://nvidia.github.io/TensorRT-LLM/examples/llm_speculative_decoding.html"
    type: "primary"
    note: "Current MTP, EAGLE3, draft-target and n-gram examples."
  - label: "SGLang — Speculative Decoding"
    url: "https://github.com/sgl-project/sglang/blob/main/docs_new/docs/advanced_features/speculative_decoding.mdx"
    type: "primary"
    note: "Current EAGLE, MTP, DFLASH, draft-model and n-gram support."
changeLog:
  - at: "2026-08-10"
    type: "published"
    note: "Initial publication."
seoTitle: "When does speculative decoding actually pay?"
seoDescription: "A quantitative break-even model for speculative decoding: acceptance, cycle cost, optimal speculation depth, load, SLO goodput and cost per SLO-compliant request."
---

Speculative decoding sounds like free time.

A cheaper mechanism guesses several future tokens. The expensive target model verifies them together. If enough guesses survive, one costly target cycle can advance the output by several tokens.

The trap is the word **enough**.

Drafting consumes time and memory. Verification is not free. Acceptance falls with the target–proposer mismatch. Deeper proposals can add work faster than they add useful tokens. Under load, the target may already be using the GPU efficiently enough that larger verification batches hurt rather than help.

So the production question is not:

**Does speculative decoding work?**

It does.

The question is:

**When do the accepted output tokens repay the speculative cycle that produced them?**

## / QUESTION

For a specific target model, proposer, runtime, hardware, traffic distribution and SLO:

**does speculative decoding reduce useful latency enough to repay drafting, verification and runtime overhead?**

Then:

**what speculation depth should we use?**

And:

**does the gain survive SLO goodput and cost per useful request?**

![One speculative cycle](/research/speculative-decoding/charts/chart-01-speculative-cycle.svg "Speculation replaces some serial target steps with a proposer plus wider target verification. The win depends on useful tokens per cycle versus total cycle cost.")

## There is no single speculative-decoding cost model

Current [vLLM documentation](https://docs.vllm.ai/en/latest/features/speculative_decoding/) lists multiple proposer families: EAGLE, MTP, draft models, PARD/MLP-style methods, n-gram and suffix lookup, plus dynamic speculative decoding.

That matters because "speculative decoding" is not one fixed pipeline.

A separate draft model has weights, KV/cache and execution time.

Native MTP can reuse capabilities built into the target model.

EAGLE-style proposers have their own learned proposal path.

N-gram and suffix methods do lookup rather than running a smaller language model.

Current [TensorRT-LLM examples](https://nvidia.github.io/TensorRT-LLM/examples/llm_speculative_decoding.html) document MTP, EAGLE3, draft-target and n-gram modes. Current SGLang documentation covers EAGLE-2/3, MTP, DFLASH, standalone draft models and n-gram speculation.

So a universal statement such as:

**"drafting k tokens costs k times one draft-token call"**

is not production-safe.

Measure the proposer that is actually deployed.

### Current method shapes

A useful normalization is not "which method wins?" but **what work does the proposer add?**

**Separate draft model**

A smaller autoregressive model proposes tokens. The deployment pays for draft weights, draft KV/cache, workspace and draft execution. Acceptance depends on the target/draft pairing and sampling.

**EAGLE / learned proposer**

A learned proposal head/model predicts future token candidates using target-state information. Its acceptance and cycle cost are not interchangeable with a generic small draft model.

**Native MTP**

The target model exposes multi-token prediction capability. Current vLLM documentation notes that native MTP does not require a separate draft model in the same sense. Memory and timing accounting therefore differ.

**N-gram / suffix**

The proposer comes from prompt/history pattern lookup. There may be no neural draft-model forward pass, so the proposal-cost curve can be much smaller—but acceptance depends heavily on repetition and workload structure.

**Dynamic speculation**

The method changes depth as the operating point changes. Current vLLM documentation explicitly supports a batch-size-to-K policy for selected proposer families. TensorRT-LLM's current APIs likewise expose draft-length schedules, acceptance windows/thresholds and concurrency controls.

This is why a method leaderboard would be misleading without one workload and one hardware budget.

The framework instead accepts whatever `T_d(k)`, `T_v(k)`, `T_o(k)` and acceptance profile the selected method actually produces.

## The serial baseline is a measurement too

Let:

$$
T_t
$$

be measured target-model time to advance one output token in the relevant operating regime.

For a teaching baseline with `N` output tokens:

$$
T_{\text{serial}}
\approx
NT_t.
$$

Production token time is not truly constant.

Context grows. Batch size changes. KV pressure changes. Scheduler state changes. A target token measured at low QPS can have a different wall time from one generated inside a saturated continuous batch.

So `T_t` belongs to the same workload bucket as the speculative cycle.

Do not compare a low-load speculative cycle with a high-throughput baseline and call the ratio speedup.

## What "lossless" means

The original Leviathan, Kalman and Matias algorithm is stronger than "usually close."

Under its assumptions, speculative sampling preserves the target model's output distribution even though a draft model proposes candidates.

That is an **algorithmic distribution guarantee**.

It is not a promise that every runtime execution produces the same literal string or bit pattern.

Current vLLM documentation makes that distinction explicit: speculative decoding is theoretically lossless up to hardware numerical precision, while floating-point differences, batching and runtime details can make log probabilities or sampled strings differ across runs.

For this article, "lossless" therefore means:

**the compatible speculative-sampling algorithm targets the same sampling distribution.**

It does not mean:

**bit-for-bit deterministic replay across every runtime configuration.**

Greedy-match acceptance, tree speculation and runtime-specific acceptance metrics must not be silently treated as the same stochastic acceptance probability.

### / CALCULATION — useful tokens per cycle

**QUESTION**

How many useful tokens does one speculative cycle emit?

**ASSUMPTIONS**

- `k` = proposed draft tokens per speculative cycle
- `alpha` = constant per-position acceptance probability in a deliberately simplified iid model
- `A` = accepted draft-prefix length

Start with the original linear speculative-sampling shape.

A draft token at position `i` contributes only if every preceding proposal survived.

Therefore:

$$
P(A\ge i)
=
\alpha^i
$$

and:

$$
E[A]
=
\sum_{i=1}^{k}P(A\ge i)
=
\sum_{i=1}^{k}\alpha^i
$$

so, for `alpha != 1`:

$$
E[A]
=
\frac{
\alpha(1-\alpha^k)
}{
1-\alpha
}
$$

The original linear algorithm emits the accepted draft prefix **plus one target token** from the verification/correction step.

Under those compatible semantics:

$$
E[Y]
=
1+E[A]
=
\sum_{i=0}^{k}\alpha^i
=
\frac{
1-\alpha^{k+1}
}{
1-\alpha
}
$$

At `alpha=1`, the limits are:

$$
E[A]=k
$$

and:

$$
E[Y]=k+1.
$$

**RESULT**

This is an **IID TEACHING MODEL**. Real acceptance is not generally independent or constant with depth.

![Acceptance curve](/research/speculative-decoding/charts/chart-02-acceptance-curve.svg "Curves for k 1, 2, 4 and 8 show expected emitted tokens per cycle rising with constant acceptance alpha. The primary alpha 0.8, k 4 scenario emits 3.3616 tokens per cycle in expectation.")

## The production acceptance curve

For real measurements, let:

$$
p_i
=
P(
\text{proposal i accepted}
\mid
\text{proposals 1..i-1 accepted}
)
$$

Then the probability that the accepted prefix reaches position `i` is:

$$
\prod_{j=1}^{i}p_j
$$

so:

$$
E[A]
=
\sum_{i=1}^{k}
\prod_{j=1}^{i}p_j.
$$

If the selected method has the same compatible "accepted prefix plus one target token" emission semantics:

$$
E[Y]
=
1+
\sum_{i=1}^{k}
\prod_{j=1}^{i}p_j.
$$

For EAGLE/tree/MTP/lookup variants, use the runtime's measured accepted/emitted-token semantics instead of forcing this equation onto a different algorithm.

That is why the workbook supports either constant alpha or depth-specific `p_i`.

## Acceptance is a workload measurement

Acceptance is not a property of the target model alone.

It can change with:

- target/draft pairing;
- task and domain;
- sampling temperature and sampling mode;
- prompt context;
- output style;
- speculation depth;
- model family;
- quantization;
- proposer method;
- runtime implementation.

This matters especially when comparing stochastic speculative sampling with greedy-match metrics.

A greedy acceptance length answers:

**how long did the proposal match the target's greedy path?**

A stochastic rejection-sampling acceptance probability answers a different question tied to the proposal and target distributions.

Do not put both numbers in one column called "acceptance rate" and compare them as if identical.

For production, collect an acceptance profile by depth:

`p1, p2, ... pk`

or use the runtime's empirical emitted/accepted-token metric after verifying its semantics.

The workbook blocks the iid formula if the selected semantics are not marked compatible.

That is intentional.

A wrong numerator can make a perfectly calculated break-even ratio meaningless.

## Rejected proposals are not the whole cost

With `k` proposed tokens:

$$
E[W_d]
=
k-E[A].
$$

A useful diagnostic is:

$$
f_{\text{rejected}}
=
\frac{k-E[A]}{k}.
$$

Call it **rejected draft share**.

Do not call all of it wasted compute.

Some proposer implementations generate candidates in parallel. Verification still produced useful target information. Runtime work is not proportional to the count of rejected tokens alone.

The real denominator is time.

## What one speculative cycle costs

Let:

$$
T_d(k)
$$

be measured proposer time.

Let:

$$
T_v(k)
$$

be measured target verification time.

Let:

$$
T_o(k)
$$

cover accept/reject sampling, scheduler work, KV bookkeeping, synchronization, copying, tree construction or other runtime overhead.

Then:

$$
T_{\text{cycle}}(k)
=
T_d(k)
+
T_v(k)
+
T_o(k).
$$

Do not assume verification equals exactly one normal target-token time.

Do not assume draft cost is linear in `k`.

Both are measurements.

If the cycle emits `E[Y_k]` useful target-distribution tokens:

$$
T_{\text{spec/token}}
=
\frac{
T_{\text{cycle}}(k)
}{
E[Y_k]
}.
$$

Let `T_t` be measured target-model time for one baseline output token in the same workload regime.

Modeled latency speedup is:

$$
S(k)
=
\frac{
E[Y_k]T_t
}{
T_{\text{cycle}}(k)
}.
$$

## The break-even equation

Normalize the speculative cycle:

$$
c_k
=
\frac{
T_{\text{cycle}}(k)
}{
T_t
}.
$$

Then:

$$
S(k)
=
\frac{
E[Y_k]
}{
c_k
}.
$$

Speculation improves this modeled token-latency metric only if:

$$
E[Y_k]>c_k.
$$

That is the core rule:

> **The useful-token multiplier must exceed the speculative cycle's target-token-equivalent cost.**

Acceptance alone cannot answer the deployment question.

![Speculative decoding break-even](/research/speculative-decoding/charts/chart-03-break-even-surface.svg "Speculation pays on token latency only when E[Y] exceeds c_k.")

## The original paper is a special case

The original paper defines a narrower draft-model cost ratio `c`: one draft-model run divided by one target-model run.

Under its simplified wall-time assumptions:

- `k` sequential draft calls cost `kc` target-call equivalents;
- target verification costs one target-call equivalent.

Therefore:

$$
c_k
=
1+kc.
$$

Substituting into the general model gives:

$$
S(k)
=
\frac{
1-\alpha^{k+1}
}{
(1-\alpha)(1+kc)
},
$$

which is the original simplified theoretical form.

Our workbook's `c_k` is broader.

It can include non-linear drafting, verification shape changes and other runtime overhead.

Do not confuse the two definitions.

### / ASSUMPTION — primary scenario

Now use one transparent scenario.

None of the following timings, acceptance values, SLO rates or prices are public benchmarks.

They are **SCENARIO INPUTS**.

Same hardware both ways:

- target GPU group: 4 GPUs;
- extra speculative GPUs: 0;
- target baseline token time `T_t`: 20 ms;
- speculation depth `k`: 4;
- iid teaching acceptance `alpha`: 0.80;
- draft time: 7.5 ms;
- target verification: 28 ms;
- other overhead: 2 ms;
- arrival: 10 requests/s;
- OSL p50: 256 tokens;
- TTFT SLA: 250 ms;
- TPOT SLA: 20 ms/token.

Expected accepted draft tokens:

$$
E[A]
=
0.8+0.8^2+0.8^3+0.8^4
=
2.3616.
$$

Expected emitted tokens:

$$
E[Y]
=
3.3616.
$$

Rejected draft share:

$$
\frac{4-2.3616}{4}
=
40.96\%.
$$

Cycle time:

$$
T_{\text{cycle}}
=
7.5+28+2
=
37.5\text{ ms}.
$$

Normalized cycle cost:

$$
c_4
=
\frac{37.5}{20}
=
1.875.
$$

So:

$$
S
=
\frac{3.3616}{1.875}
=
1.793.
$$

Effective token time:

**11.16 ms/output token**, versus a 20 ms teaching baseline.

The latency model favors speculation.

### / CALCULATION — what acceptance rate is required?

**QUESTION**

At fixed k=4 and c₄=1.875, what per-position acceptance makes E[Y]=c₄?

**ASSUMPTIONS**

- k = 4 (fixed)
- c₄ = 1.875 (from the scenario timing)

Solve:

$$
1+\alpha+\alpha^2+\alpha^3+\alpha^4
=
1.875.
$$

Numerical bisection gives:

$$
\alpha^*
\approx
0.4803.
$$

**RESULT**

Under this iid teaching model and these cycle timings, per-position acceptance must exceed about 48.0% before k=4 crosses the token-latency break-even.

This is not a universal acceptance requirement.

Change `T_d`, `T_v`, `T_o`, target token time or method semantics and `alpha*` moves.

### / CALCULATION — how deep should we speculate?

**QUESTION**

What speculation depth maximizes modeled speedup under the scenario timing curve?

**ASSUMPTIONS**

- alpha = 0.80
- cycle components measured independently for each depth

The scenario sweep gives modeled speedups:

- k=1: **1.47x**
- k=2: **1.68x**
- k=3: **1.75x**
- k=4: **1.79x**
- k=5: **1.66x**
- k=6: **1.51x**
- k=7: **1.35x**
- k=8: **1.20x**

Therefore:

$$
k^*
=
4
$$

for this scenario.

**RESULT**

k\*=4 for the SCENARIO. Not a universal recommendation.

![Optimal speculation depth](/research/speculative-decoding/charts/chart-04-optimal-depth.svg "Modeled speedup rises from k1 through k4, peaks at about 1.79x at k4, then falls through k8 as cycle cost grows faster than additional expected emitted tokens.")

Why does speed fall after four?

Under constant alpha, increasing depth from `k` to `k+1` adds only:

$$
\alpha^{k+1}
$$

expected emitted-token benefit under the teaching model.

At the same time, draft and verification cost can keep rising.

**More speculative tokens are not automatically more speed.**

Current vLLM dynamic speculative decoding is evidence that production runtimes face the same kind of load-dependent depth problem: its current documentation reduces `K` as concurrency grows and can disable speculation at larger batch sizes when verification pressure hurts TPOT.

That does not make the scenario's `k*=4` portable.

It makes **measuring k by operating point** the portable lesson.

## Low load and high load are different experiments

Current vLLM documentation describes the strongest latency case around medium-to-low QPS memory-bound workloads, while also documenting methods intended to retain benefit at higher QPS.

So do not publish:

**"speculative decoding is a low-QPS technique."**

Instead benchmark at multiple load buckets.

At low or medium load, serial target decode may leave enough compute headroom for parallel verification to buy latency.

At high QPS, continuous batching can already use the GPU more efficiently. Proposal work enlarges the effective batch and adds memory, compute and scheduling pressure.

The same `alpha` and `k` can therefore have a different `T_v(k)` and a different `c_k` as load changes.

That is the production reason to measure cycle cost, not just acceptance.

## / CLAIM CHECK

### "Speculative decoding gives free tokens."

**WHAT IS TRUE**

Each verification cycle can emit more than one target-distribution token when proposals are accepted.

**WHAT IS MISSING**

The cost of drafting, verification and runtime overhead that produced those tokens.

**SECOND / PASS**

No. It exchanges serial target steps for proposer work, target verification and runtime overhead. The gain comes only when multiple useful tokens per verification cycle are cheaper than the serial target steps they replace.

### "Higher speculation depth is always faster."

**WHAT IS TRUE**

More draft tokens give a longer acceptance prefix on average.

**WHAT IS MISSING**

Verification and drafting cost can grow faster than marginal accepted-token gain.

**SECOND / PASS**

No. Expected token gain diminishes with depth while proposer and verification cost may keep growing. `k*` is a workload/runtime result.

### "Lossless means every run returns the exact same string."

**WHAT IS TRUE**

The original algorithm preserves the target sampling distribution under its assumptions.

**WHAT IS MISSING**

Operational determinism is a separate property affected by sampling, numerical precision, batching, kernels and runtime behavior.

**SECOND / PASS**

Too broad. Distribution preservation ≠ bit-for-bit replay across every runtime configuration.

## The high-load counter-case

Keep the same four-GPU hardware budget and same target/proposer concept.

Change the operating point:

- baseline target token time: 9 ms under higher batching efficiency;
- arrival: 40 requests/s;
- `k=4`;
- `alpha=.62`;
- draft time: 7 ms;
- verification: 19 ms;
- other overhead: 3 ms.

Now:

$$
E[Y]
=
1+0.62+0.62^2+0.62^3+0.62^4
=
2.3905.
$$

Cycle time:

**29 ms.**

Normalized cycle cost:

$$
c_4
=
\frac{29}{9}
=
3.222.
$$

Modeled speedup:

$$
S
=
\frac{2.3905}{3.222}
=
0.742.
$$

Speculation loses.

The break-even acceptance for this same `k` and cycle cost is:

$$
\alpha^*
\approx
0.7783.
$$

Actual scenario acceptance:

**0.62.**

The useful token multiplier cannot repay the verification/drafting cycle.

## Does the result survive the SLO?

Raw speedup is not the buyer result.

Let `N_SLO` be completed requests that satisfy the same TTFT and TPOT rule.

Then:

$$
G_{\text{SLO}}
=
\frac{N_{\text{SLO}}}{\Delta t}.
$$

GPU-normalized:

$$
G_{\text{SLO/GPU}}
=
\frac{N_{\text{SLO}}}{G\Delta t}.
$$

### Primary scenario

Same four GPUs.

Scenario p95:

Baseline:
- TTFT: 180 ms
- TPOT: 24 ms/token.

Speculative:
- TTFT: 185 ms
- TPOT: 15 ms/token.

Same SLO:
- TTFT <= 250 ms
- TPOT <= 20 ms/token.

Scenario SLO success:
- baseline: 82%
- speculative: 95%.

At 10 requests/s:

- baseline SLO goodput: **8.2 req/s**
- speculative: **9.5 req/s**.

GPU-normalized:

- baseline: **2.05 SLO req/s/GPU**
- speculative: **2.375**.

### Counter-case

Same four GPUs.

p95 TPOT:
- baseline: 13 ms
- speculative: 18 ms.

SLO:
- 15 ms/token.

Scenario SLO success:
- baseline: 94%
- speculative: 70%.

At 40 requests/s:

- baseline SLO goodput: **37.6 req/s**
- speculative: **28.0 req/s**.

The architecture flips under load.

![SLO economics](/research/speculative-decoding/charts/chart-05-slo-economics.svg "On the same four-GPU budget, the low/medium-load primary scenario has lower speculative cost per SLO request, while the high-load counter-case has lower baseline cost per SLO request.")

## Same hardware means the proposer is not free

A fair baseline/speculative comparison pins:

- target model;
- target-model precision;
- GPU model;
- GPU count;
- request distribution;
- sampling;
- ISL/OSL;
- traffic;
- SLO.

If a separate draft model needs another GPU, the speculative row gets another GPU.

If it fits in spare memory on the existing four-GPU group, count its memory and execution pressure even if GPU count stays unchanged.

If native MTP needs no separate draft-model weights, do not charge it the memory footprint of an imaginary draft model.

If n-gram lookup uses CPU/runtime state rather than neural draft execution, account for that path instead.

The primary scenario uses the same four GPUs and assumes 6 GB of draft-model memory fits inside 20 GB of available headroom.

That is a feasibility assumption, not evidence that every target/draft pair fits.

The workbook therefore has separate gates for:
- extra memory;
- extra GPU requirement;
- runtime support;
- acceptance measurement;
- timing measurement.

If one is unresolved, the output is:

**INSUFFICIENT MEASUREMENT.**

### / CALCULATION — cost per SLO-compliant request

**QUESTION**

What is the cost per SLO-compliant request under each mode?

**ASSUMPTIONS**

- 4 currency units/GPU-hour (input, not a market price)
- Same four GPUs, no extra speculative GPU

Let hourly infrastructure cost be `C_hour`.

Then:

$$
C_{\text{SLO}}
=
\frac{
C_{\text{hour}}
}{
3600G_{\text{SLO}}
}.
$$

The scenario uses:

**4 currency units/GPU-hour**.

That is an input, not a market price.

Both modes use the same four GPUs and no extra speculative GPU.

### Primary

Hourly cost:

**16.**

Baseline:

**0.000542 currency units/SLO request.**

Speculative:

**0.000468.**

**RESULT**

**Speculation is about 13.7% cheaper per SLO-compliant request** in the primary scenario.

Using OSL p50=256 as the explicit denominator:

- baseline cost/SLO output token: **0.000002117**
- speculative: **0.000001827**.

### High-load counter-case

Baseline:

**0.000118 currency units/SLO request.**

Speculative:

**0.000159.**

**RESULT**

**Speculation is about 34.3% more expensive per SLO-compliant request.**

A pretty low-load latency benchmark would not have revealed that reversal.

## Memory and extra hardware still count

The primary scenario assigns 6 GB of extra draft-model memory against 20 GB of available headroom.

So the simple memory gate passes.

If the proposer requires another GPU, add it.

If native MTP requires no separate draft weights, do not charge it a fake draft model.

If n-gram or suffix lookup replaces neural drafting, use its actual memory and runtime overhead.

The economics have to follow the selected method.

## How a company should decide

1. Measure baseline target decode under the real workload.
2. Pin target model, runtime/version, hardware, precision and sampling.
3. Choose one supported proposer method.
4. Measure acceptance by depth; do not borrow a "typical" alpha.
5. Confirm what the runtime's acceptance metric actually means.
6. Measure `T_d(k)` for each candidate depth.
7. Measure `T_v(k)` for each candidate depth.
8. Measure `T_o(k)` rather than silently setting it to zero.
9. Calculate `E[Y_k]` using method-compatible emission semantics.
10. Calculate `c_k` and the break-even `E[Y_k] > c_k`.
11. Sweep `k` instead of assuming more is better.
12. Repeat under representative QPS/concurrency buckets.
13. Compare the same hardware and the same SLO.
14. Count extra GPU/memory cost.
15. Enable speculation only where cost per SLO-compliant work improves.

## The second pass

Speculative decoding is an exchange.

You spend on proposals, verification and runtime complexity.

You receive a chance to advance several target-distribution tokens in one target cycle.

The exchange is profitable only when:

$$
\frac{
E[Y_k]
}{
c_k
}
>
1
$$

and that latency result still improves:

**SLO goodput**

and:

**cost per useful work.**

In the primary scenario, `alpha=.80`, `k=4` and `c_4=1.875` produce **1.79x modeled token-latency speedup**, higher SLO goodput and lower cost per SLO request.

In the high-load counter-case, lower acceptance and a more expensive verification cycle produce **0.74x**, worse SLO goodput and higher cost.

That is the deployment rule:

**measure acceptance × useful tokens ÷ cycle cost × SLO reality.**

Not:

**speculative decoding is faster.**

---

## / INTELLIGENCE

Evaluating speculative decoding for a production inference stack?

SECOND / PASS can apply this model to your acceptance traces, runtime timings, traffic distribution and SLOs.

**START A RESEARCH BRIEF →**

`/intelligence`
