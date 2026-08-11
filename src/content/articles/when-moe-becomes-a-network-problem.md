---
title: "When MoE becomes a network problem: the expert-parallel all-to-all budget"
dek: "Expert-parallel MoE becomes network-constrained when the routed token payload cannot be dispatched and combined inside the time budget left by sparse expert compute. Using a source-backed DeepSeek-V3-like shape (H=7168, top-8, 8K tokens, FP8 dispatch, BF16 combine), the logical forward routed payload is about 1.409 GB; with a HOUSE 50% remote-routing fraction on a 45 GB/s effective fabric, the modeled break-even bandwidth is about 57.06 GB/s — above the available 45 GB/s, so the sparse-compute advantage is lost in this HOUSE case."
slug: "when-moe-becomes-a-network-problem"
section: "Compute"
format: "PROOF"
author: "Aditya"
publishedAt: "2026-08-11"
status: "published"
firstPass:
  - "Megatron Core 0.17.0 states that expert-parallel all-to-all can consume 30–40% of training time without optimization, but the documentation does not attach that percentage to a named workload, GPU, network or batch size. Treat it as current NVIDIA engineering guidance, not a universal measured constant, and never transfer it to inference latency."
  - "Logical routed bytes are not physical network bytes. For a DeepSeek-V3-like 8K-token, H=7168, top-8 shape with FP8 dispatch and BF16 combine, the forward routed payload is about 1.409 GB; the bytes that actually cross the constrained fabric are that times p_remote, the remote-routing fraction."
  - "Under a HOUSE 50% remote-routing case the cross-fabric payload is about 0.705 GB; on a 45 GB/s effective network with 0.05 ms startup the raw network time is about 15.71 ms, leaving about 13.31 ms of exposed communication after 30% overlap — which exceeds the 10 ms compute budget and consumes the sparse advantage."
  - "The modeled break-even bandwidth for this HOUSE case is about 57.06 GB/s. A 400 Gb/s NIC is 50 GB/s nominal before protocol, topology, contention and collective overhead — not 400 GB/s and not directly comparable to a 900 GB/s NVLink specification."
  - "Locality, topology, routing skew and overlap can each move the boundary enough to reverse the conclusion. The decision output is COMMUNICATION FITS BUDGET, COMMUNICATION EXCEEDS BUDGET, or INSUFFICIENT MEASUREMENT — not a universal network-bound percentage."
featured: false
featuredRank: 0
editorialOrder: 1
demo: false
adPolicy: "none"
tags:
  - "MoE"
  - "expert-parallel"
  - "all-to-all"
  - "network-bandwidth"
  - "DeepSeek-V3"
  - "DeepEP"
  - "Megatron"
sources:
  - label: "NVIDIA Megatron Core 0.17.0 — Mixture of Experts"
    url: "https://docs.nvidia.com/megatron-core/developer-guide/0.17.0/user-guide/features/moe.html"
    type: "primary"
    note: "EP all-to-all can consume 30–40% of training time without optimization; FP8 dispatch cuts EP dispatch volume by 50% vs BF16; keep EP×TP within NVLink where possible."
  - label: "NVIDIA Megatron Bridge — Communication Overlap"
    url: "https://docs.nvidia.com/nemo/megatron-bridge/latest/training/communication-overlap.html"
    type: "primary"
    note: "EP overlap hides dispatch/combine under expert compute; Qwen3 30B-A3B EP16 H100 step time 41.25s → 31.31s; workload-sensitive."
  - label: "DeepSeek-AI DeepEP repository"
    url: "https://github.com/deepseek-ai/DeepEP"
    type: "primary"
    note: "V2 EP dispatch/combine benchmark: V3-like 8K tokens, H=7168, top-8, FP8 dispatch, BF16 combine; reports logical bottleneck bandwidth for NVLink and CX7/RDMA configurations."
  - label: "NVIDIA NCCL 2.30.7 documentation"
    url: "https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/index.html"
    type: "primary"
    note: "Current NCCL includes topology-aware collective and point-to-point primitives including AlltoAll."
  - label: "NVIDIA H100 product specifications"
    url: "https://www.nvidia.com/en-us/data-center/h100/"
    type: "primary"
    note: "H100 SXM lists fourth-generation NVLink at 900 GB/s GPU-to-GPU interconnect; vendor interconnect specification, not application-level all-to-all bandwidth."
  - label: "NVIDIA ConnectX-7 InfiniBand adapters"
    url: "https://www.nvidia.com/en-us/networking/infiniband-adapters/"
    type: "primary"
    note: "ConnectX-7 up to 400 Gb/s; ConnectX-8 up to 800 Gb/s; units are bits/s and require /8 conversion for nominal GB/s."
  - label: "DeepSeek-V3 config.json"
    url: "https://huggingface.co/deepseek-ai/DeepSeek-V3/blob/main/config.json"
    type: "primary"
    note: "Source-backed configuration: hidden_size 7168, 256 routed experts, 1 shared expert, 8 experts per token, 61 hidden layers, first 3 dense."
  - label: "DeepSeek-V3 Technical Report (DeepSeek-AI, 2024-12-27)"
    url: "https://arxiv.org/abs/2412.19437"
    type: "paper"
    note: "671B total parameters, 37B activated/token, trained on 2,048 H800 GPUs."
  - label: "vLLM — Expert Parallel Deployment"
    url: "https://docs.vllm.ai/en/latest/serving/expert_parallel_deployment/"
    type: "primary"
    note: "Inference EP separates high-throughput multi-node prefill (deepep_high_throughput) from low-latency multi-node decode (deepep_low_latency) backends."
  - label: "NCCL EP: Towards a Unified Expert Parallel Communication API for NCCL (2026-03-13)"
    url: "https://arxiv.org/abs/2603.13606"
    type: "paper"
    note: "Separates low-latency mode for 1–128 token decode batches from hierarchical high-throughput mode for 4096+ token prefill/training batches."
changeLog:
  - at: "2026-08-11"
    type: "published"
    note: "Initial publication."
seoTitle: "When MoE becomes a network problem: the expert-parallel all-to-all budget"
seoDescription: "A budget model for expert-parallel MoE communication: logical routed bytes, remote-routing fraction, exposed communication after overlap, and the break-even bandwidth that decides whether sparse compute survives the network hop."
socialStat: "57.06 GB/s"
socialStatLabel: "HOUSE break-even bandwidth — V3-like top-8 case"
---

Sparse experts save compute only when the routed token data can move through the relevant fabric inside the communication budget created by that compute saving. The headline is not that mixture-of-experts is network-bound. The headline is conditional: MoE can become network-constrained for a particular payload, topology, placement, routing distribution and compute budget. The decision output is a budget inequality, not a percentage.

### / ASSUMPTION — "Primary HOUSE scenario"

The primary HOUSE case uses source-backed DeepSeek-V3-like architecture values as *inputs* to a HOUSE calculation. The HOUSE output is not a DeepSeek-V3 production-performance measurement.

- **Model shape (SOURCE-BACKED).** Hidden size <imath>H = 7168</imath>, 256 routed experts, 8 active experts per token, 1 shared expert, 61 hidden layers. From DeepSeek-V3 `config.json`.
- **Batch (DEEPEP-LIKE).** <imath>N = 8192</imath> tokens per MoE layer step, matching the DeepEP V3-like benchmark.
- **Communication precision.** FP8 dispatch (1 byte/element) and BF16 combine (2 bytes/element), also matching DeepEP's benchmark shape.
- **Remote routing (HOUSE ASSUMPTION).** <imath>p_{\text{remote}} = 0.50</imath> — half of routed assignments cross the constrained fabric. This is a HOUSE value, not a DeepSeek measurement.
- **Network (HOUSE ASSUMPTION).** 45 GB/s effective all-to-all bandwidth, 0.05 ms startup overhead.
- **Compute (HOUSE ASSUMPTION).** Sparse expert compute <imath>T_e = 8</imath> ms; dense-equivalent compute <imath>T_d = 18</imath> ms; overlap efficiency <imath>\eta = 0.30</imath>.

## One token's path

Current Megatron Core documentation describes the expert-parallel path as router → dispatch to the GPU that owns the assigned expert → expert compute → combine to restore token order. NCCL exposes `AlltoAll` and arbitrary point-to-point patterns. Megatron's FlexDispatcher can use DeepEP/HybridEP for cross-node or fine-grained MoE.

![Six-stage horizontal flow: ROUTER → PERMUTE → DISPATCH (network, Signal Blue) → REMOTE EXPERT → COMBINE (network, Signal Blue) → UNPERMUTE. Local stages are Ink; stages that cross the constrained fabric are Signal Blue. Arrows between stages are labeled 'network' or 'local'.](/research/moe-alltoall-budget/charts/chart-01-token-path.svg "One routed token: where the network crosses. Only DISPATCH and COMBINE move data across the fabric; PERMUTE, REMOTE EXPERT and UNPERMUTE are local to the rank that owns the expert. HOUSE PATH SCHEMATIC — Signal Blue marks cross-fabric stages.")

A token's hidden vector becomes network data whenever its selected expert lives across the fabric level being studied. Routing is a per-token, per-layer decision; the same model can produce very different cross-fabric payloads under different expert placements.

## / CALCULATION — "Logical routed payload"

**QUESTION**

How many bytes are routed per MoE layer step?

**EQUATION**

For <imath>N</imath> tokens, hidden dimension <imath>H</imath>, top-<imath>k</imath> routing, and <imath>s</imath> bytes per communicated element:

$$
D_{\text{logical}} = N \, k \, H \, s
$$

**DIMENSIONAL ANALYSIS**

$$
\text{tokens} \times \frac{\text{assignments}}{\text{token}} \times \frac{\text{elements}}{\text{assignment}} \times \frac{\text{bytes}}{\text{element}} = \text{bytes}
$$

**RESULT**

For the source-backed V3-like shape (<imath>N = 8192</imath>, <imath>H = 7168</imath>, <imath>k = 8</imath>), with FP8 dispatch (<imath>s_d = 1</imath> byte) and BF16 combine (<imath>s_c = 2</imath> bytes):

$$
D_{\text{dispatch}} = 8192 \times 8 \times 7168 \times 1 = 469{,}762{,}048 \text{ bytes} \approx 0.470 \text{ GB}
$$

$$
D_{\text{combine}} = 8192 \times 8 \times 7168 \times 2 = 939{,}524{,}096 \text{ bytes} \approx 0.940 \text{ GB}
$$

$$
D_{\text{logical}} = D_{\text{dispatch}} + D_{\text{combine}} = 1{,}409{,}286{,}144 \text{ bytes} \approx 1.409 \text{ GB}
$$

**SO WHAT**

About 1.409 GB of hidden-state data is routed per MoE layer step. That is the logical payload. **Logical routed bytes are not automatically physical cross-node bytes.** A token whose selected expert lives on its own rank does not cross the fabric at all.

## Remote routing: the physical payload

Introduce <imath>p_{\text{remote}}</imath>, the fraction of assignments that cross the network level being studied:

$$
D_{\text{network}} = N \, k \, H \, s \, p_{\text{remote}}
$$

For uniform EP16 spread across two 8-GPU nodes, a teaching approximation for *cross-node* routing is 0.5. For EP32 across four identical nodes it is about 0.75. Topology-aware placement or expert replication can lower it. The 0.50 used in the primary HOUSE case is **HOUSE ASSUMPTION**, not a DeepSeek measurement.

With <imath>p_{\text{remote}} = 0.50</imath>, the cross-fabric payload is approximately <imath>0.704643072</imath> GB. This is the number that has to fit inside the communication budget.

## Network time and the overlap budget

Raw network time follows a simple transfer model:

$$
T_n \approx T_{\text{startup}} + \frac{D_{\text{network}}}{B_{\text{effective}}}
$$

For the HOUSE 0.705 GB payload at 45 GB/s effective bandwidth with 0.05 ms startup:

$$
T_n \approx 0.05 + \frac{0.7046}{45} \times 1000 \approx 15.7087 \text{ ms}
$$

But raw network time is not what appears on the critical path. Communication overlap can hide part of <imath>T_n</imath> behind expert compute. A HOUSE teaching model for the overlap is:

$$
T_{\text{overlap}} = \eta \, \min(T_e, T_n), \qquad 0 \le \eta \le 1
$$

$$
T_{\text{stage}} = T_e + T_n - T_{\text{overlap}}
$$

With <imath>\eta = 0.30</imath> and <imath>T_e = 8</imath> ms, the overlap hides <imath>0.30 \times 8 = 2.4</imath> ms of communication. Exposed communication is:

$$
T_{\text{exposed}} = T_n - \eta \, \min(T_e, T_n) \approx 15.7087 - 2.4 \approx 13.3087 \text{ ms}
$$

The MoE stage time becomes <imath>T_e + T_{\text{exposed}} = 8 + 13.3087 \approx 21.3087</imath> ms. The dense-equivalent stage is 18 ms. So in this HOUSE case:

$$
T_{\text{stage}} \;(\approx 21.31 \text{ ms}) \;>\; T_d \;(\approx 18 \text{ ms})
$$

**The sparse-compute advantage is lost.**

![Grouped stacked bars of MoE stage time across four HOUSE scenarios A through D. Each bar shows expert compute (Graphite) plus exposed communication (Signal Blue), with a Signal Blue dashed line marking the 18 ms dense-equivalent budget. Scenario A stays under budget (9.04 ms, YES); B (21.31 ms), C (29.14 ms) and D (41.86 ms) exceed the budget (NO).](/research/moe-alltoall-budget/charts/chart-02-step-time.svg "Compute vs exposed expert-parallel communication across four HOUSE scenarios. Only Scenario A (intra-node NVLink domain, 1.233 GB at 600 GB/s) keeps the sparse advantage. B, C and D all exceed the dense-equivalent budget. HOUSE SCENARIOS / DERIVED RESULT.")

## / CALCULATION — "Cross-node break-even bandwidth"

**QUESTION**

What effective all-to-all bandwidth does the cross-node payload need to keep the sparse advantage?

**EQUATION**

The compute saving before communication is <imath>T_d - T_e = 18 - 8 = 10</imath> ms. With overlap, the allowable raw network time is:

$$
T_n < T_d - (1 - \eta) T_e = 18 - 0.7 \times 8 = 12.4 \text{ ms}
$$

After subtracting startup, the available transfer window is <imath>12.4 - 0.05 = 12.35</imath> ms. The required payload bandwidth is:

$$
B_{\text{required}} = \frac{D_{\text{network}}}{T_{\text{available}}} = \frac{0.704643072 \text{ GB}}{0.01235 \text{ s}} \approx 57.06 \text{ GB/s}
$$

**RESULT**

The HOUSE break-even bandwidth is about **57.06 GB/s**. The HOUSE path supplies 45 GB/s.

$$
57.06 \text{ GB/s} \;>\; 45 \text{ GB/s} \;\Rightarrow\; \text{COMMUNICATION EXCEEDS BUDGET}
$$

**SO WHAT**

The 45 GB/s HOUSE path misses the budget. Change compute time, overlap, locality or bandwidth and the answer changes. With better overlap (<imath>\eta = 0.6</imath>) the boundary falls to about 33.6 GB/s and the same 45 GB/s path would fit. With <imath>p_{\text{remote}} = 0.25</imath> the payload halves to about 0.352 GB and the boundary falls to about 28.5 GB/s.

![Three-line chart of the maximum payload (GB) that fits inside a given effective all-to-all bandwidth (GB/s), for three budget windows: 8 ms (Graphite), 12.4 ms (Signal Blue, the HOUSE budget), and 18 ms (Graphite dashed). The HOUSE point at 0.705 GB / 45 GB/s is marked with a Signal Blue circle; the required break-even bandwidth is annotated at 57.06 GB/s.](/research/moe-alltoall-budget/charts/chart-03-break-even-boundary.svg "Break-even network boundary for expert-parallel all-to-all. The HOUSE cross-node case (0.705 GB at 45 GB/s) sits above the 12.4 ms budget curve; the modeled break-even bandwidth is about 57.06 GB/s. DERIVED — T_available = T_d − (1−η)·T_e. NOT a DeepSeek-V3 production measurement.")

**CAVEAT**

This is a teaching boundary. It is not a DeepSeek-V3 benchmark. <imath>T_d</imath>, <imath>T_e</imath>, <imath>\eta</imath>, <imath>p_{\text{remote}}</imath> and <imath>B_{\text{effective}}</imath> are all HOUSE inputs. The 0.705 GB payload is source-backed-shape × HOUSE locality, not a measured remote-routing fraction.

## / CALCULATION — "Cost of exposed network delay"

**QUESTION**

What does exposed communication time cost when it stalls GPUs that are not separately billed for the network?

**EQUATION**

For <imath>G</imath> GPUs stalled by an exposed per-step delay <imath>\Delta t</imath> over <imath>S</imath> steps:

$$
H_{\text{GPU,idle}} = \frac{G \, \Delta t \, S}{3600}
$$

At a HOUSE GPU-hour price <imath>c_g</imath>:

$$
C_{\text{idle}} = H_{\text{GPU,idle}} \, c_g
$$

**DIMENSIONAL ANALYSIS**

$$
\text{GPUs} \times \frac{\text{s}}{\text{step}} \times \text{steps} \times \frac{1}{3600 \, \text{s/hour}} = \text{GPU-hours}
$$

**RESULT**

HOUSE example: <imath>G = 256</imath> GPUs, <imath>\Delta t = 5</imath> ms/step, <imath>S = 1{,}000{,}000</imath> steps, <imath>c_g = \$4.00</imath>/GPU-hour.

$$
H_{\text{GPU,idle}} = \frac{256 \times 0.005 \times 1{,}000{,}000}{3600} \approx 355.56 \text{ GPU-hours}
$$

$$
C_{\text{idle}} \approx 355.56 \times \$4.00 \approx \$1{,}422.22
$$

**SO WHAT**

Network delay consumes GPU time even when the network itself is not separately billed. A 5 ms exposed delay per step accumulates to about 356 GPU-hours across a million-step training run on 256 GPUs. That is opportunity-cost exposure, not a cloud invoice prediction — it assumes the delay stalls all <imath>G</imath> GPUs equivalently, which depends on the overlap schedule and the stall pattern.

**CAVEAT**

This calculation is only meaningful when the dossier inputs support a real workload. It is not added to invent a number; it is added because the HOUSE 256-GPU, 5 ms, 1M-step example is a defensible illustration of the cost-of-exposed-communication mechanism. A real buyer model would use measured <imath>\Delta t</imath>, real <imath>G</imath>, and a real step count from the training or inference workload under study.

## / CLAIM CHECK — "Expert-parallel all-to-all consumes 30–40% of training time"

**CLAIM**

Expert-parallel all-to-all can consume 30–40% of training time without optimization.

**WHAT IS TRUE**

Current Megatron Core 0.17.0 documentation states this as engineering guidance for EP all-to-all without optimization.

**WHAT IS MISSING**

The current documentation does not attach that percentage to a named model, GPU, network, EP degree or batch size. It is current NVIDIA engineering guidance, not a measured constant on a named configuration.

**WHAT THAT MEASURES**

A rough order-of-magnitude for unoptimized EP communication share in training, before overlap, FP8 dispatch or topology-aware placement.

**WHAT IT DOES NOT MEASURE**

It is not a universal measured share of training time. It is not an inference latency estimate. It is not directly transferable to decode, where token batches can be one to two orders of magnitude smaller and startup latency can dominate over raw byte transfer.

**SECOND / PASS**

Cite the 30–40% figure with its qualification. Do not apply it to inference. Do not treat it as a benchmark constant.

## / CLAIM CHECK — "A 400 Gb/s NIC delivers 400 GB/s"

**CLAIM**

A 400 Gb/s NIC gives 400 GB/s of network bandwidth.

**WHAT IS TRUE**

The NIC's port rate is 400 gigabits per second.

**WHAT IS MISSING**

Bits are not bytes. The nominal conversion is:

$$
400 \text{ Gb/s} \div 8 = 50 \text{ GB/s}
$$

before protocol, topology, contention and collective overhead. Vendor physical link specification, nominal bit/byte conversion, sustainable fabric bandwidth, and application-level all-to-all bandwidth are not the same number. DeepEP explicitly warns that its reported *logical* bandwidth can include local-rank traffic, so those figures must not be treated as raw NIC line rate either.

![Horizontal log-scale bar chart comparing three vendor interconnect specifications: H100 SXM NVLink (900 GB/s, Graphite, scale-up), ConnectX-7 NDR (400 Gb/s → 50 GB/s nominal, Signal Blue, scale-out), and ConnectX-8 (800 Gb/s → 100 GB/s nominal, Graphite, scale-out). Each bar carries a caveat that the rate is a vendor specification, not an application all-to-all measurement.](/research/moe-alltoall-budget/charts/chart-05-topology-budget.svg "Scale-up and scale-out are not one bandwidth number. NVLink and NIC specifications are vendor rates; protocol, topology, contention and collective overhead reduce the application-level throughput. The two classes of number are not interchangeable.")

**WHAT THAT MEASURES**

A vendor port specification in bits per second, converted to a nominal byte rate.

**WHAT IT DOES NOT MEASURE**

It does not measure application-level all-to-all throughput. A 900 GB/s H100 SXM NVLink vendor interconnect specification is also not equivalent to a measured collective result. The slowest relevant cut matters: cross-node assignments can leave a 900 GB/s scale-up domain and encounter a tens-of-GB/s scale-out budget.

**SECOND / PASS**

Do not place 900 GB/s NVLink and nominal NIC GB/s side by side as if they were direct benchmark results. Convert bits to bytes first, then apply protocol, topology, contention and collective overhead, then measure the actual collective bandwidth at the message size the workload uses.

## Routing skew: the busiest expert sets the critical link

Let expert <imath>j</imath> receive <imath>n_j</imath> assignments, with <imath>\sum_{j=1}^{E} n_j = Nk</imath>. Perfect balance gives <imath>\bar{n} = Nk/E</imath>. The HOUSE imbalance diagnostic is:

$$
I_{\text{load}} = \frac{\max_j n_j}{Nk/E}
$$

<imath>I_{\text{load}} = 1</imath> is perfect balance. A larger value means the busiest expert gets more assignments than average. For the source-backed shape (<imath>N = 8192</imath>, <imath>k = 8</imath>, <imath>E = 256</imath>), the mean is 256 assignments per expert. At <imath>I_{\text{load}} = 2</imath>, the busiest expert receives 512 — twice the mean — and the critical receiver or link can carry up to twice its share of work.

![Vertical bar chart of busiest-expert assignments against the HOUSE load-imbalance diagnostic I_load, from I_load=1 (256 assignments, Graphite) to I_load=3 (768 assignments, Signal Blue). A Graphite dashed line marks the mean of 256 (perfect balance). Bars above I_load=1 are Signal Blue because they exceed the perfect-balance reference.](/research/moe-alltoall-budget/charts/chart-04-routing-skew.svg "Routing skew: the busiest expert can set the critical link. All-to-all completion can follow the busiest receiver, not the mean. HOUSE TEACHING DIAGNOSTIC — I_load is a SECOND / PASS metric, not an industry standard.")

This is not a standardized industry metric. It is useful because all-to-all can finish at the pace of the busiest receiver, congested physical path or slowest NIC — not at the mean. The diagnostic makes that visible.

## Top-k sensitivity, first-order

At first order, payload scales linearly with top-<imath>k</imath>:

$$
D \propto k
$$

The HOUSE sensitivity file sweeps top-<imath>k</imath> from 1 to 16 on the same source-backed shape. At top-8, the cross-node payload is 0.705 GB and the raw network time at 45 GB/s is about 15.66 ms. At top-16 it doubles to 1.409 GB and 31.32 ms; at top-4 it halves to 0.352 GB and 7.83 ms.

Do not write that top-2 always doubles physical traffic. Actual traffic also depends on placement, locality, shared experts, implementation, fused dispatch and topology. The first-order relation is a teaching scaling, not a measured MoE performance curve.

![Two-axis log-x chart of remote payload (GB, Signal Blue, left axis) and raw network time at 45 GB/s (ms, Graphite, right axis) against top-k from 1 to 16. Both scale linearly with k in this HOUSE model. The top-8 HOUSE case is marked with an Ink circle.](/research/moe-alltoall-budget/charts/chart-06-topk-sensitivity.svg "Top-k first-order payload scaling. The top-8 HOUSE case (0.705 GB / 15.66 ms @ 45 GB/s) sits on the linear regime. Physical traffic depends on placement, locality, fusion and topology — this is a teaching model, not a measured MoE performance curve.")

## Training and inference are not interchangeable

Training has large token batches and forward dispatch/combine plus backward communication. NVIDIA's 30–40% statement is explicitly about training time. The Qwen3 EP16 H100 step-time improvement from 41.25 s to 31.31 s in Megatron Bridge is training evidence. Do not transfer a training communication-share percentage to inference.

Inference needs separate treatment. vLLM currently recommends different EP backends for multi-node prefill (`deepep_high_throughput`, for 4096+ token batches) and multi-node decode (`deepep_low_latency`, for 1–128 token decode batches). Small decode groups make startup latency and synchronization more important even when bytes are modest. A training throughput share is not a decode latency estimate.

## What would reverse the conclusion

The thesis is falsified for a measured workload if: <imath>T_{\text{exposed}}</imath> is consistently negligible relative to compute saving; the EP domain stays on a fabric with enough sustainable bandwidth and low startup latency; locality or replication drives <imath>p_{\text{remote}}</imath> near zero at the constrained network level; overlap hides nearly all dispatch/combine without creating another bottleneck; expert compute remains dominant after all current kernel optimizations; or an implementation removes or avoids the modeled token movement.

Current sources show that this happens in some regimes. DeepEP reports very high logical bandwidth on NVLink configurations. Megatron Bridge says small-EP all-to-all overlap can be flat or slower, implying communication was not necessarily the dominant wall. Megatron recommends keeping EP×TP inside NVLink. Overlap, FP8 dispatch and specialized dispatchers can move the boundary materially. A single vendor line-rate number is not enough to falsify the thesis; measured collective timing is required.

## What a company needs to measure

The HOUSE scenario is a teaching case. A real decision needs:

- model shape and MoE layer count;
- experts, shared experts and top-<imath>k</imath>;
- token batch (training, prefill, decode separately);
- dispatch and combine precision;
- EP, TP, PP, DP degrees;
- GPU and node topology, NIC topology, rail design;
- observed effective all-to-all bandwidth at the relevant message size;
- remote-routing fraction <imath>p_{\text{remote}}</imath>;
- routing skew distribution;
- sparse expert compute <imath>T_e</imath> and dense-equivalent <imath>T_d</imath>;
- overlap efficiency <imath>\eta</imath>;
- GPU price and training or inference SLO.

The reusable template is published as `company-moe-input-template.csv`. The decision output should be `COMMUNICATION FITS BUDGET`, `COMMUNICATION EXCEEDS BUDGET`, or `INSUFFICIENT MEASUREMENT` — not a universal network-bound percentage.

## Real benchmark evidence, and what it cannot tell us

Three current sources anchor the empirical picture, but they are not directly comparable.

| Source | Configuration | Result | Caveat |
|---|---|---|---|
| Megatron Core 0.17.0 | not specified | EP all-to-all can consume 30–40% of training time without optimization | No named workload; vendor guidance, not a measured constant. |
| Megatron Bridge (2026-05-18) | Qwen3 30B-A3B SFT, 16×H100, EP16, inter-node all-to-all | Step time 41.25 s → 31.31 s with EP overlap; overlap concurrent with GEMM/attention rose to 36.55% of comm time | Workload-sensitive; one short current-main benchmark. |
| DeepEP V2 (current README) | V3-like 8K tokens, H=7168, top-8, FP8 dispatch, BF16 combine, EP8x2 / EP8x4 / EP8, SM90 or SM100, CX7 RDMA or NVLink | 90/81 GB/s EP8x2; 61/61 GB/s EP8x4; 726/740 GB/s SM100 NVLink dispatch/combine | Logical bandwidth; can include local traffic; cross-config results not directly comparable. |

**NOT DIRECTLY COMPARABLE.** Do not merge these rows into one leaderboard. The model, GPU, topology, EP degree and measurement definitions all differ. The Megatron Bridge result is training; DeepEP reports logical bandwidth at a specific batch size; the 30–40% figure is engineering guidance without a named configuration.

## SECOND / PASS

Expert parallelism becomes a network problem when the routed token payload cannot be dispatched and combined inside the time budget left by sparse expert compute. The decision test is not a fixed percentage of training time. It is a budget inequality: <imath>T_{\text{exposed}} < T_d - T_e</imath>. Networking is a finite, topology-dependent budget created by sparse compute savings. Locality, overlap, FP8 dispatch, topology-aware placement and routing skew can each move the boundary enough to reverse the conclusion. The right answer for a specific deployment comes from measuring bytes, locality, collective bandwidth, overlap and cost on that deployment — not from a vendor line-rate number or a training-time percentage.

## / INTELLIGENCE

Designing or scaling an expert-parallel MoE deployment and want to know whether your routed payload will fit inside the communication budget created by sparse compute?

SECOND / PASS can apply this break-even model to your model shape, MoE layers, top-k, token batch, dispatch/combine precision, EP/TP/PP/DP layout, node and NIC topology, observed all-to-all bandwidth, remote-routing fraction, routing skew, overlap efficiency and SLO — and tell you whether the communication fits the budget or exceeds it, and which input would reverse the decision.

[START A RESEARCH BRIEF →](/intelligence)
