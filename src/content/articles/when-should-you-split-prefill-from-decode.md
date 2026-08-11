---
title: "When should you split prefill from decode?"
dek: "Prefill/decode disaggregation can isolate latency and scale the two phases independently. It also creates a KV handoff, two queues and a replica-granularity tax. The right question is whether SLO goodput improves enough to pay for those new costs."
slug: "when-should-you-split-prefill-from-decode"
section: "Systems"
format: "SECOND PASS"
author: "Aditya"
publishedAt: "2026-08-10"
status: "published"
firstPass:
  - "Disaggregation is not automatically faster. The first latency test is simple: phase interference and queueing avoided must exceed the newly exposed KV-transfer, routing and handoff overhead."
  - "Size xP:yD from measured phase capacity, not intuition. In the primary scenario, 5.6 requests/s at an 80% target requires 1 prefill worker and 2 decode workers, or 6 GPUs with the stated 2-GPU worker granularity."
  - "Pool granularity is a real low-load tax. In the counter-case, continuous phase demand is only 0.5625 GPU, but the minimum split deployment still needs two 2-GPU pools, producing 4 GPUs of actual allocation."
  - "KV transfer has a deadline. In the primary 2 GB case, a 25 ms transfer budget with a 0.5 ms fixed term requires about 81.6 GB/s effective bandwidth; if the budget is at or below the fixed term, no finite bandwidth satisfies the lower-bound model."
  - "The enterprise comparison is cost per SLO-compliant completion. Under the sustained-load scenario disaggregation is cheaper; under the low-load counter-case aggregated serving is cheaper."
featured: true
featuredRank: 5
editorialOrder: 3
demo: false
tags:
  - "prefill decode disaggregation"
  - "LLM serving"
  - "NVIDIA Dynamo"
  - "vLLM"
  - "TensorRT-LLM"
  - "SGLang"
  - "NIXL"
  - "inference infrastructure"
hero: ""
heroAlt: ""
adPolicy: "none"
sources:
  - label: "NVIDIA Dynamo — Disaggregated Serving"
    url: "https://docs.nvidia.com/dynamo/latest/user-guides/disaggregated-serving"
    type: "primary"
    note: "Aggregated/disaggregated architecture, KV-transfer critical path and deployment guidance."
  - label: "NVIDIA Dynamo — Disaggregated Serving Design"
    url: "https://docs.nvidia.com/dynamo/dev/knowledge-base/concepts/system-architecture/disaggregated-serving"
    type: "primary"
    note: "xPyD, NIXL transfer, low-load fragmentation and capacity tradeoffs."
  - label: "NVIDIA Dynamo — Sizing with AIConfigurator"
    url: "https://docs.nvidia.com/dynamo/dev/user-guides/disaggregated-serving/sizing-with-ai-configurator"
    type: "primary"
    note: "Current tooling compares aggregated and disaggregated layouts against ISL/OSL and TTFT/TPOT targets."
  - label: "vLLM — Disaggregated Prefilling"
    url: "https://docs.vllm.ai/en/stable/features/disagg_prefill/"
    type: "primary"
    note: "Experimental vLLM feature, separate TTFT/ITL tuning and connector architecture."
  - label: "TensorRT-LLM — Disaggregated Serving"
    url: "https://nvidia.github.io/TensorRT-LLM/features/disagg-serving.html"
    type: "primary"
    note: "KV exchange and overlap optimization."
  - label: "SGLang — PD Disaggregation"
    url: "https://docs.sglang.ai/backend/pd_disaggregation.html"
    type: "primary"
    note: "Unified-scheduling interference mechanism and NIXL/Mooncake transfer support."
changeLog:
  - at: "2026-08-10"
    type: "published"
    note: "Initial publication."
seoTitle: "When should you split prefill from decode?"
seoDescription: "A workload-specific prefill/decode disaggregation model covering xP:yD sizing, KV transfer budgets, pool granularity, SLO goodput and cost per SLO-compliant request."
---

One GPU pool is simple.

The same workers accept prompts, build KV cache, and generate output tokens.

Then traffic changes.

Some requests arrive with long prompts. Others keep decoding for hundreds of tokens. The two phases start asking for different things from the scheduler, GPU memory and parallelism.

Splitting them looks attractive:

**prefill workers here, decode workers there.**

But the split creates a new problem before it solves the old one.

The KV state has to move.

Now there are two pools, two capacity floors, extra routing, and a handoff that can land directly on time-to-first-token.

So the decision is not:

**Are prefill and decode different?**

They are.

The decision is:

**Is that difference large enough to pay for a different serving architecture?**

## / QUESTION

Given a real prompt/output distribution, arrival rate, TTFT/TPOT targets, GPU fleet and KV-transfer path:

**should prefill and decode stay together, or should they run as independent worker pools?**

If they split:

**how many GPUs belong in each pool?**

And after counting transfer and replica granularity:

**which design has lower cost per request that actually meets the SLO?**

![Aggregated versus disaggregated serving](/research/prefill-decode-disaggregation/charts/chart-01-aggregated-vs-disaggregated.svg)

## What the current runtimes actually support

Current [NVIDIA Dynamo documentation](https://docs.nvidia.com/dynamo/latest/user-guides/disaggregated-serving) treats aggregated and disaggregated serving as separate deployment choices. In aggregated mode, one worker performs both phases. In disaggregated mode, prefill and decode run in separate pools and the KV state has to become available to the selected decode worker.

Dynamo's current design goes further: it supports runtime-reconfigurable **xP:yD** layouts, where `x` is the number of prefill workers and `y` is the number of decode workers. Its design documentation also says the net result depends on operating point: low concurrency can favor aggregated serving because it avoids transfer and pool fragmentation, while sustained contention can make phase isolation useful.

That is almost exactly the enterprise decision we need to calculate.

Current [vLLM documentation](https://docs.vllm.ai/en/stable/features/disagg_prefill/) calls disaggregated prefilling experimental. It says the split lets operators tune TTFT and inter-token latency separately and helps control tail ITL, but it also states that the feature does not improve throughput.

Current [Dynamo AIConfigurator documentation](https://docs.nvidia.com/dynamo/dev/user-guides/disaggregated-serving/sizing-with-ai-configurator), meanwhile, searches both aggregated and disaggregated layouts against a GPU budget, ISL/OSL and TTFT/TPOT targets.

Those statements are not a contradiction we should erase.

They tell us not to publish a universal winner.

**Architecture benefit is backend, workload, topology and SLO specific.**

TensorRT-LLM and SGLang reinforce the mechanism, not a universal result. TensorRT-LLM documents overlapping KV transfer with computation across independent requests. SGLang documents how unified scheduling can interrupt decode with prefill work and supports NIXL and Mooncake as transfer engines.

The useful conclusion is narrower:

**phase separation creates an opportunity for better isolation; the transfer and capacity model decides whether the opportunity is worth buying.**

## Prefill and decode, without the slogan

Prefill processes the input sequence and builds the initial KV state.

Decode generates output incrementally using that state.

For many transformer workloads, prompt processing can lean toward high arithmetic work while decode can put more pressure on memory capacity and movement.

But “prefill is compute-bound, decode is memory-bound” is not a law.

Model, precision, GPU, batching, sequence shape, attention implementation and serving engine all change the operating point.

The production model therefore should not derive universal phase capacity from peak FLOPs.

Measure it.

Let:

- `mu_p` = prefill requests/second per prefill worker for a defined workload shape and SLO;
- `mu_d` = decode request-equivalent capacity/second per decode worker for that same defined workload;
- `mu_a` = aggregated requests/second per worker.

If output lengths vary heavily, `mu_d` may need a token or work-unit definition instead of plain requests.

Every capacity number has to carry its workload shape with it.

## / CALCULATION — how many prefill and decode workers?

Let:

- arrival rate = `lambda`;
- target prefill utilization = `u_p`;
- target decode utilization = `u_d`.

A simple capacity sanity check is:

$$
\rho_p
=
\frac{\lambda}
{x\mu_p}
$$

and:

$$
\rho_d
=
\frac{\lambda}
{y\mu_d}
$$

This is not an M/M/1 queueing claim.

It is only a planning ratio.

Choose engineering utilization targets below saturation. Then:

$$
x_{\text{req}}
=
\left\lceil
\frac{\lambda}
{u_p\mu_p}
\right\rceil
$$

and:

$$
y_{\text{req}}
=
\left\lceil
\frac{\lambda}
{u_d\mu_d}
\right\rceil
$$

If each prefill worker uses `g_p` GPUs and each decode worker uses `g_d`:

$$
G_{\text{disagg}}
=
xg_p
+
yg_d
$$

Now use one transparent scenario.

### / ASSUMPTION — primary case

This is **not a public benchmark**.

The model/GPU/backend names are source-aligned with a current Dynamo sizing example, but every performance result below is a scenario input:

- model: Qwen3-32B-FP8
- GPU: H200 SXM
- backend: vLLM
- arrival: 5.6 requests/s
- ISL p50/p95: 4,000 / 8,000
- OSL p50/p95: 300 / 600
- TTFT SLA: 600 ms
- TPOT SLA: 25 ms/token
- `mu_a = 2.0 req/s` per 2-GPU aggregated worker
- `mu_p = 8.0 req/s` per 2-GPU prefill worker
- `mu_d = 4.0 request-equivalent/s` per 2-GPU decode worker
- target utilization: 80%.

Prefill:

$$
x_{\text{req}}
=
\left\lceil
\frac{5.6}
{0.8\times8}
\right\rceil
=
1
$$

Decode:

$$
y_{\text{req}}
=
\left\lceil
\frac{5.6}
{0.8\times4}
\right\rceil
=
2
$$

So:

$$
G_{\text{disagg}}
=
1\times2
+
2\times2
=
6
\text{ GPUs}
$$

Aggregated:

$$
a_{\text{req}}
=
\left\lceil
\frac{5.6}
{0.8\times2}
\right\rceil
=
4
\text{ workers}
$$

At two GPUs per worker:

**8 GPUs.**

Under these explicit capacity inputs, the minimum capacity-compliant deployment is therefore:

**aggregated: 8 GPUs**

versus:

**disaggregated: 1P:2D = 6 GPUs.**

That is not yet an architectural recommendation.

We still have to pay the transfer cost and verify the SLO.

## The hidden cost in `ceil()`

Before rounding, the primary scenario needs:

**1.75 continuous prefill GPUs**

and:

**3.50 continuous decode GPUs.**

Continuous ideal:

**5.25 GPUs.**

Actual split deployment:

**6 GPUs.**

Define worker-granularity overhead:

$$
F_{\text{granularity}}
=
\frac{
G_{\text{disagg}}
-
G_{\text{ideal}}
}{
G_{\text{ideal}}
}
$$

For the primary case:

$$
F_{\text{granularity}}
=
\frac{6-5.25}{5.25}
=
14.29\%
$$

That is manageable here.

At low load it becomes the whole story.

We will come back to it.

## xP:yD under a fixed GPU budget

Capacity planning and fixed-budget planning answer different questions.

For a total GPU budget `G`, let measured phase service demand per request be:

$$
d_p
=
\frac{g_p}{\mu_p}
$$

and:

$$
d_d
=
\frac{g_d}{\mu_d}
$$

Ignoring transfer and worker granularity, the continuous work-demand split is:

$$
G_p^*
=
G
\frac{d_p}
{d_p+d_d}
$$

and:

$$
G_d^*
=
G
\frac{d_d}
{d_p+d_d}
$$

For the primary scenario:

- `d_p = 2/8 = 0.25 GPU-s/request`
- `d_d = 2/4 = 0.50 GPU-s/request`.

With eight total GPUs:

$$
G_p^*
=
2.67
$$

and:

$$
G_d^*
=
5.33
$$

The worker granularity is two GPUs, so a practical same-budget approximation is:

**1P:3D = 2 prefill GPUs + 6 decode GPUs.**

![Prefill/decode allocation surface](/research/prefill-decode-disaggregation/charts/chart-03-prefill-decode-allocation.svg)

The figure exposes something intuition often hides.

At this workload, `1P:1D` fails on decode capacity.

`1P:2D` is the minimum feasible split.

With the full eight-GPU budget, `1P:3D` and `2P:2D` are both capacity-feasible, but the continuous work-demand ratio points toward more decode resource.

That is what xP:yD should mean:

**measured phase demand turned into capacity, then rounded through real worker topology.**

Not “prefill feels heavy, add two GPUs.”

## Pool balance moves over time

A static xP:yD is only a snapshot.

Prompt mix can change by hour. Output length can change by product surface. A burst of retrieval-heavy requests can push prefill while decode still has room. A long-generation burst can do the reverse.

For a snapshot, define observed phase utilization:

$$
u_p(t)
$$

and:

$$
u_d(t)
$$

A simple imbalance indicator is:

$$
I_{\text{pool}}
=
|u_p-u_d|
$$

This is not a new industry metric and it should not become a headline score.

It is a diagnostic.

If prefill sits near saturation while decode is half empty, the current split is not using the two pools evenly. The same is true in reverse.

Current Dynamo design is relevant here because xP:yD can be reconfigured at runtime, and its Planner supports scaling aggregated and disaggregated deployments from performance and load signals. That does not remove capacity planning. It means the production answer may be a range of useful splits rather than one permanent ratio.

This also explains why independent scaling is valuable only if the operator can actually use it.

A split architecture with fixed replica counts, slow provisioning, or hard topology constraints may still strand capacity even though its theoretical phase ratio looks better.

## Different parallelism is a mechanism, not a rule

Another benefit of separation is that prefill and decode do not have to use the same worker geometry.

A company can test:

- `TP_p` / `PP_p` for prefill;
- `TP_d` / `PP_d` for decode.

Dynamo's current design documentation explicitly gives different tensor-parallel choices as one reason specialized workers can help.

But do not convert that into:

**“use smaller TP for prefill and larger TP for decode.”**

That may be a useful candidate configuration for some models.

It is not a law.

Tensor parallelism can change model fit, KV capacity, communication overhead and throughput per GPU. A larger decode TP can expose more aggregate memory while also adding communication. A smaller prefill TP can reduce communication while changing per-worker service capacity.

The correct input to the xP:yD model remains the measured phase capacity after the parallelism choice has already been applied.

## Aggregated serving has its own tuning levers

Disaggregation is not the only way to reduce interference.

Current vLLM documentation points out that chunked prefill can also control tail inter-token latency, although choosing the chunk size can be difficult in practice.

That matters because an aggregated deployment has structural advantages:

- no cross-worker KV handoff;
- one shared capacity pool;
- fewer minimum replicas;
- simpler routing;
- easier low-load utilization.

If scheduler tuning, chunked prefill, prefix reuse or a different batching policy solves the SLO problem inside one pool, the company may not need a split at all.

That alternative belongs in the architecture review.

The test is not:

**disaggregated versus badly tuned aggregated.**

It is:

**best feasible aggregated versus best feasible disaggregated under the same workload and SLO.**

## KV transfer is a deadline

The split has now created a new critical object:

**KV state.**

Dynamo uses NIXL for direct data movement. NIXL itself abstracts multiple transfer backends. TensorRT-LLM documents transfer overlap, and SGLang supports NIXL/Mooncake paths.

None of those docs give us one universal transfer time.

So use a lower-bound model.

Let:

- `M_KV` = bytes transferred/request;
- `B_KV,eff` = effective transfer bandwidth;
- `L_KV` = fixed/startup transfer latency.

Then:

$$
T_{\text{KV}}
\gtrsim
L_{\text{KV}}
+
\frac{M_{\text{KV}}}
{B_{\text{KV,eff}}}
$$

The primary scenario uses:

- KV bytes: 2 GB decimal
- effective bandwidth: 100 GB/s
- fixed latency: 0.5 ms.

So:

$$
T_{\text{KV}}
=
0.5
+
\frac{2}{100}\times1000
=
20.5
\text{ ms}
$$

Suppose 12 ms can overlap other work.

Exposed transfer:

$$
T_{\text{KV,exposed}}
=
\max(
0,
20.5-12
)
=
8.5
\text{ ms}
$$

Add 1.5 ms exposed routing and 1.0 ms of other new critical-path work:

**new exposed handoff overhead H = 11 ms.**

## / CALCULATION — how fast must KV move?

If transfer may consume at most `T_KV,budget`:

$$
B_{\text{KV,req}}
\ge
\frac{M_{\text{KV}}}
{T_{\text{KV,budget}}-L_{\text{KV}}}
$$

provided:

$$
T_{\text{KV,budget}}
>
L_{\text{KV}}
$$

For the primary case:

- budget: 25 ms
- fixed latency: 0.5 ms
- KV state: 2 GB.

Therefore:

$$
B_{\text{KV,req}}
=
\frac{2}
{0.0245}
=
81.63
\text{ GB/s}
$$

The 100 GB/s scenario bandwidth clears this lower-bound transfer budget.

If the transfer budget were at or below 0.5 ms, no finite bandwidth could satisfy this simplified model.

![KV transfer bandwidth budget](/research/prefill-decode-disaggregation/charts/chart-04-kv-transfer-budget.svg)

This is the same kind of lesson as network sizing, but the object is specific:

**the KV state has to cross before its handoff budget expires.**

## / CLAIM CHECK — “Disaggregation adds a network copy, so it must be slower.”

**SECOND / PASS**

Too broad. The useful comparison is not zero copy versus one copy.

It is:

**phase interference and queueing avoided**

versus:

**new exposed KV + routing + handoff overhead.**

Define:

- `S` = interference/queueing time avoided;
- `H` = new exposed handoff/routing time.

Disaggregation improves the modeled latency only if:

$$
S>H
$$

Primary scenario:

- `S = 131 ms`
- `H = 11 ms`.

Net modeled latency benefit:

**120 ms.**

That matches the scenario TTFT move from 550 ms aggregated to 430 ms disaggregated.

Counter-case:

- `S = 4 ms`
- `H = 11 ms`.

The split adds 7 ms instead of saving time.

![Disaggregation break-even](/research/prefill-decode-disaggregation/charts/chart-02-disaggregation-break-even.svg)

This is why a universal prompt-length threshold is weak.

A long prompt matters only through measured service demand, interference, queueing and the transfer path it creates.

## SLO goodput, not raw throughput

Completed requests are not all equally useful.

Let:

- `N_total` = requests completed;
- `N_SLO` = requests meeting the defined TTFT and TPOT requirements.

Define:

$$
G_{\text{SLO}}
=
\frac{N_{\text{SLO}}}
{\Delta t}
$$

GPU-normalized:

$$
G_{\text{SLO/GPU}}
=
\frac{N_{\text{SLO}}}
{\Delta t\,G}
$$

In the primary scenario, both architectures are held to the same:

- TTFT SLA: 600 ms
- TPOT SLA: 25 ms/token.

Scenario p95 outcomes:

Aggregated:

- TTFT: 550 ms
- TPOT: 24 ms/token.

Disaggregated:

- TTFT: 430 ms
- TPOT: 21 ms/token.

Scenario SLO-success rates:

- aggregated: 84%
- disaggregated: 97%.

At 5.6 requests/s:

Aggregated SLO goodput:

**4.704 req/s.**

Disaggregated:

**5.432 req/s.**

At their minimum capacity-compliant GPU counts:

- aggregated: 4.704 / 8 = **0.588 SLO req/s/GPU**
- disaggregated: 5.432 / 6 = **0.905 SLO req/s/GPU**.

In this scenario, disaggregation produces about **54.0% more SLO goodput per allocated GPU**.

Again: scenario, not benchmark.

## Same-GPU comparison

Now hold hardware constant at eight GPUs.

Aggregated:

**4 aggregated workers ×2 GPUs = 8 GPUs.**

Disaggregated continuous demand points to 2.67 prefill GPUs and 5.33 decode GPUs.

With two-GPU worker granularity, use:

**1P:3D = 8 GPUs.**

Both have enough target-utilization capacity for the 5.6 req/s scenario.

Using the same scenario SLO-success rates:

- aggregated SLO goodput: 4.704 req/s
- disaggregated SLO goodput: 5.432 req/s.

The split did not win by receiving more accelerators.

It won this scenario by converting the same eight GPUs into more SLO-compliant completions.

## / CALCULATION — cost per SLO-compliant request

Let architecture `j` cost `C_hour,j` per hour.

Then:

$$
C_{\text{SLO},j}
=
\frac{C_{\text{hour},j}}
{3600G_{\text{SLO},j}}
$$

For transparency, use scenario economics:

- GPU cost: 4 currency units/GPU-hour
- extra disaggregated network cost: 1.2 currency units/hour.

These are not market prices.

### Minimum-GPU comparison

Aggregated:

- 8 GPUs
- cost/hour = 32
- SLO goodput = 4.704 req/s
- cost/SLO request = **0.001890**.

Disaggregated:

- 6 GPUs
- cost/hour = 25.2
- SLO goodput = 5.432 req/s
- cost/SLO request = **0.001289**.

Under these assumptions, the split is about **31.8% cheaper per SLO-compliant request.**

### Same eight-GPU comparison

Aggregated:

**0.001890 per SLO request.**

Disaggregated:

**0.001698.**

Even after adding the network-cost input, disaggregation is about **10.2% cheaper per SLO completion** in this sustained-load scenario.

![Cost per SLO-compliant request](/research/prefill-decode-disaggregation/charts/chart-05-slo-cost.svg)

## The low-load counter-case

Now hold the same phase-capacity inputs but drop arrival to:

**0.6 requests/s.**

Continuous disaggregated GPU demand becomes:

- prefill: 0.1875 GPU
- decode: 0.375 GPU
- total: **0.5625 GPU**.

But workers come in two-GPU units.

The split still needs:

- 1 prefill worker = 2 GPUs
- 1 decode worker = 2 GPUs.

Actual:

**4 GPUs.**

Worker-granularity overhead:

$$
\frac{4-0.5625}
{0.5625}
=
611.11\%
$$

Aggregated needs one two-GPU worker:

**2 GPUs.**

The low-load scenario also assumes phase isolation saves only 4 ms while the new exposed handoff cost remains 11 ms.

So the split is slower by 7 ms on the modeled TTFT path.

Both architectures remain inside the same 600 ms TTFT and 25 ms TPOT SLAs.

Scenario SLO success:

- aggregated: 99%
- disaggregated: 98%.

Cost per SLO-compliant request:

- aggregated: **0.003741**
- disaggregated: **0.008125**.

The split is about **117.2% more expensive** per SLO completion.

The architecture flips.

Not because prefill and decode stopped being different.

Because their difference was not valuable enough to pay the minimum two-pool cost.

## / CLAIM CHECK — “Prefill is compute-bound and decode is memory-bound, so they should always be separated.”

**SECOND / PASS**

Too broad. Different phase behavior is a mechanism.

It is not the decision.

Disaggregation is justified only when all of the following survive measurement:

1. phase isolation removes meaningful SLO pressure;
2. KV transfer fits its budget;
3. prefill and decode pools fit within GPU and topology constraints;
4. worker granularity does not waste more capacity than isolation saves;
5. the same-SLO or same-GPU comparison improves useful goodput;
6. cost per SLO-compliant request is lower.

If any required input is missing, the answer should be:

**INSUFFICIENT INPUT.**

That is what the workbook does.

## What to measure before changing the architecture

A production decision needs distributions, not one average request.

Collect:

**Traffic**
- arrival rate and burst factor
- request concurrency
- ISL p50/p95/p99
- OSL p50/p95/p99
- prefix-cache hit rate when relevant.

**SLO**
- TTFT target
- TPOT/ITL target
- percentile acceptance rule
- SLO success rate.

**Capacity**
- aggregated service capacity for that workload
- prefill service capacity
- decode service capacity or token-work equivalent
- GPU/worker and TP/PP layout.

**Transfer**
- runtime-reported KV bytes/request
- effective transfer bandwidth
- fixed/startup transfer latency
- overlap actually achieved
- route/handoff overhead
- transfer topology.

Then run two comparisons.

### Same-GPU

Hold total GPUs constant.

Ask which architecture produces more SLO goodput and better TTFT/TPOT under the same accelerator budget.

### Same-SLO

Find the minimum GPU topology that meets the same traffic and latency requirements for each architecture.

Then compare cost.

The second result is usually the buyer result.

## The second pass

Prefill/decode disaggregation is not an architecture fashion question.

It is a break-even calculation.

The phase split creates a benefit:

**less interference, better isolation, independent scaling, different worker geometry.**

It also creates costs:

**KV movement, routing, separate queues, minimum replicas and pool imbalance.**

The first latency test is:

$$
S>H
$$

The first capacity test is:

$$
x
=
\left\lceil
\frac{\lambda}
{u_p\mu_p}
\right\rceil
,\qquad
y
=
\left\lceil
\frac{\lambda}
{u_d\mu_d}
\right\rceil
$$

The transfer test is:

$$
B_{\text{KV,eff}}
\ge
\frac{M_{\text{KV}}}
{T_{\text{budget}}-L_{\text{KV}}}
$$

And the enterprise test is:

$$
\frac{C_{\text{disagg}}}
{N_{\text{SLO,disagg}}}
<
\frac{C_{\text{agg}}}
{N_{\text{SLO,agg}}}
$$

only among architectures that are actually feasible.

In the sustained-load scenario, all four tests favor the split.

In the low-load counter-case, pool granularity and handoff cost reverse the answer.

That is the useful rule:

**split prefill from decode only when measured phase isolation creates more SLO-compliant capacity than the KV handoff and two-pool architecture consume.**

---

## / INTELLIGENCE

Planning a production inference deployment?

SECOND / PASS can apply this decision model to your measured prompt/output distribution, SLOs, GPU fleet and transfer fabric.

[START A RESEARCH BRIEF →](/intelligence)
