---
title: "When FLOPs stop being the binding spec: the HBM roofline for LLM inference"
dek: "Peak PFLOPS describe an arithmetic ceiling. LLM serving can hit a lower HBM ceiling first. A Roofline model shows where the boundary sits, why single-token decode is far left of it, and how batching and prefill move the workload."
slug: "when-flops-stop-mattering-hbm-roofline-llm-inference"
section: "Compute"
format: "PROOF"
author: "Aditya"
publishedAt: "2026-08-10"
status: "published"
firstPass:
  - "A fair dense-BF16 comparison puts NVIDIA B300 at 281.25 FLOP/byte of machine balance and AMD MI355X at 312.5 FLOP/byte, using current vendor peak specifications."
  - "In an idealized dense single-token weight-stream model, decode intensity is approximately 2 divided by bytes per weight: 1 FLOP/byte at BF16, 2 at an 8-bit payload and 4 at a 4-bit payload. Model parameter count cancels."
  - "For BF16, the same ideal weight-reuse model needs q*=281.25 concurrent tokens on B300 and q*=312.5 on MI355X to reach the theoretical machine-balance point. Those are Roofline thresholds, not recommended serving batch sizes."
  - "Prefill is a different phase: an illustrative BF16 GEMM with m=2048 and k=n=8192 has a simple one-pass arithmetic intensity of about 1,365 FLOP/byte, above both BF16 ridge points."
  - "For Qwen2.5-72B-Instruct, a 72.7B-parameter BF16 payload is 145.4 GB in the ideal model. At 8 TB/s, the weight-stream ceiling is about 55 tokens/s while B300's 2P arithmetic ceiling is about 15,475 tokens/s; both are theoretical upper bounds, not measured throughput."
featured: true
featuredRank: 3
editorialOrder: 3
demo: false
tags:
  - "LLM inference"
  - "HBM bandwidth"
  - "Roofline model"
  - "NVIDIA B300"
  - "AMD MI355X"
  - "arithmetic intensity"
  - "AI infrastructure"
hero: ""
heroAlt: ""
adPolicy: "none"
sources:
  - label: "NVIDIA HGX Platform"
    url: "https://www.nvidia.com/en-in/data-center/hgx/"
    type: "primary"
    note: "HGX B300 peak compute and dense/sparse footnotes."
  - label: "NVIDIA HGX AI Factory — Components"
    url: "https://docs.nvidia.com/enterprise-reference-architectures/hgx-ai-factory/latest/components.html"
    type: "primary"
    note: "B300 per-GPU HBM capacity and peak HBM bandwidth."
  - label: "AMD Instinct MI355X"
    url: "https://www.amd.com/en/products/accelerators/instinct/mi350/mi355x.html"
    type: "primary"
    note: "MI355X dense/sparse matrix compute, HBM capacity and peak bandwidth."
  - label: "Berkeley Lab — Roofline Model"
    url: "https://amcr.lbl.gov/departments/computer-science-department/ppan/roofline-performance-model/"
    type: "primary"
    note: "Roofline model and arithmetic-intensity foundation."
  - label: "Qwen2.5-72B-Instruct"
    url: "https://huggingface.co/Qwen/Qwen2.5-72B-Instruct"
    type: "primary"
    note: "Dense model case: parameter count, layers, GQA heads and context."
  - label: "Qwen2.5-72B-Instruct config"
    url: "https://huggingface.co/Qwen/Qwen2.5-72B-Instruct/blob/main/config.json"
    type: "primary"
    note: "Hidden size and architecture configuration."
changeLog:
  - at: "2026-08-10"
    type: "published"
    note: "Initial publication."
seoTitle: "When FLOPs stop being the binding spec for LLM inference"
seoDescription: "A mathematical HBM Roofline model for LLM inference: B300 and MI355X machine balance, dense decode arithmetic intensity, ridge batch, prefill, KV traffic and procurement implications."
---

A GPU can do arithmetic only after the data arrives.

Peak FLOPs tell you how fast its arithmetic engines could work under a stated precision and configuration. HBM bandwidth tells you how fast data can move between high-bandwidth memory and those engines.

If a workload produces one FLOP for every byte it moves, while the accelerator needs hundreds of FLOPs per HBM byte to keep its peak arithmetic units fed, the first bottleneck is not the headline PFLOPS number.

That does not mean FLOPs are useless. It means **FLOPs are not always the binding specification**.

This PROOF builds the boundary.

## / QUESTION

**For an LLM inference workload, what arithmetic intensity are we generating, where is the accelerator's machine-balance point, and is compute or local HBM bandwidth the tighter theoretical roof?**

The answer changes with phase, precision, batch, context shape and implementation. Single-token decode can sit on one side of the Roofline. Prefill can sit on the other. Continuous batching moves the workload. KV-cache traffic can pull it back toward memory.

The Roofline is a screening model, not an oracle for end-to-end server latency.

![The LLM inference Roofline](/research/hbm-roofline-llm-inference/charts/chart-01-inference-roofline.svg)

## Roofline in plain English

The original Roofline work by Williams, Waterman and Patterson combines arithmetic intensity, memory bandwidth and peak arithmetic throughput into one bound. Berkeley Lab describes arithmetic intensity as the ratio of floating-point operations to bytes moved. The [Berkeley Lab Roofline material](https://amcr.lbl.gov/departments/computer-science-department/ppan/roofline-performance-model/) is the primary foundation used here.

Define arithmetic intensity:

$$
I=\frac{F}{D}
$$

where `F` is useful floating-point work and `D` is bytes transferred from the memory level being modeled.

For this article, that memory level is **local HBM**.

With peak compute `P_peak` and HBM bandwidth `B_HBM`:

$$
P_{\text{roof}}
\le
\min(
P_{\text{peak}},
B_{\text{HBM}}I
)
$$

The two roofs meet at the machine-balance point:

$$
I^*
=
\frac{P_{\text{peak}}}{B_{\text{HBM}}}
$$

Below `I*`, the memory-bandwidth roof is lower in this simplified model. Above it, the arithmetic roof can become lower.

That sentence needs two qualifiers.

First, vendor specifications are **peak ceilings**. Sustained bandwidth and sustained compute can be lower.

Second, a Roofline applies to a defined workload or kernel and a defined memory boundary. An LLM server also has attention, normalization, sampling, CPU work, scheduler overhead, KV-cache management, kernel launches and, in multi-GPU systems, collectives and network traffic.

The local-HBM Roofline is necessary information. It is not the whole serving system.

There is also a second version of every roof: the one the machine actually sustains.

If a representative kernel sustains only a fraction `eta_c` of peak compute and `eta_b` of peak HBM bandwidth:

$$
P_{\text{eff}}
=
\eta_c P_{\text{peak}}
$$

and:

$$
B_{\text{eff}}
=
\eta_b B_{\text{peak}}
$$

Then the effective machine balance is:

$$
I^*_{\text{eff}}
=
\frac{P_{\text{eff}}}{B_{\text{eff}}}
$$

This matters because a machine can miss its arithmetic peak and its bandwidth peak by different fractions. The ridge can therefore move.

This package does not invent universal efficiency numbers. The workbook accepts measured sustained compute and measured sustained HBM bandwidth when a company has them. Otherwise its efficiency fields are visibly labeled scenario inputs.

That separation prevents another common error: taking a vendor's peak bandwidth, multiplying it by a theoretical workload intensity, and presenting the answer as measured tokens per second.

## / CALCULATION — the current BF16 machine balance

A cross-vendor comparison is useful only if the precision and sparsity semantics match.

For NVIDIA, the current [HGX platform specification](https://www.nvidia.com/en-in/data-center/hgx/) publishes **36 PFLOPS of FP16/BF16 Tensor Core performance for the eight-GPU HGX B300 system** and states that this figure is sparse; dense is half the sparse specification.

So:

$$
P_{\text{B300,dense,node}}
=
18\text{ PFLOP/s}
$$

Normalize the eight-GPU system to one GPU-equivalent:

$$
P_{\text{B300,dense}}
=
\frac{18}{8}
=
2.25\text{ PFLOP/s}
$$

NVIDIA's current [HGX AI Factory reference architecture](https://docs.nvidia.com/enterprise-reference-architectures/hgx-ai-factory/latest/components.html) gives B300 **288 GB HBM3e per GPU** and **up to 8 TB/s** of GPU memory bandwidth.

Therefore:

$$
I^*_{\text{B300}}
=
\frac{2.25\times10^{15}}
{8\times10^{12}}
=
281.25
\text{ FLOP/byte}
$$

AMD's current [MI355X product specification](https://www.amd.com/en/products/accelerators/instinct/mi350/mi355x.html) directly publishes **2.5 PFLOPS dense BF16 matrix performance**, **5 PFLOPS with structured sparsity**, **288 GB HBM3E**, and **8 TB/s peak memory bandwidth**.

So:

$$
I^*_{\text{MI355X}}
=
\frac{2.5\times10^{15}}
{8\times10^{12}}
=
312.5
\text{ FLOP/byte}
$$

The dense BF16 comparison is therefore valid at the level intended here:

| Hardware | Dense BF16 peak | Peak HBM bandwidth | Machine balance |
|---|---:|---:|---:|
| NVIDIA B300, normalized per GPU | 2.25 PFLOP/s | up to 8 TB/s | 281.25 FLOP/B |
| AMD MI355X | 2.5 PFLOP/s | 8 TB/s | 312.5 FLOP/B |

This table does **not** say which GPU is faster in production. It says how much arithmetic work per HBM byte each theoretical BF16 compute roof needs before compute becomes the tighter simple Roofline bound.

Equal peak HBM bandwidth also does not imply equal real bandwidth. Memory efficiency, cache hierarchy, scheduling, kernels, software and topology remain outside this peak comparison.

## / CLAIM CHECK

### “GPU A has twice the FLOPs, so it should serve this model twice as fast.”

**WHAT THAT MEASURES**

A ratio of peak arithmetic ceilings at a stated precision and sparsity configuration.

**WHAT IT DOES NOT MEASURE**

Workload arithmetic intensity, HBM traffic, sustained bandwidth, kernel efficiency, batching, KV traffic, latency SLO or communication.

**SECOND / PASS**

If the workload is below the memory roof on both accelerators, the FLOP ratio is not the expected serving-speed ratio. The lower resource boundary is moving bytes, not performing more arithmetic.

## The decode cancellation

Now simplify a dense transformer decode step.

Let `P` be a parameter count used as a proxy for the dominant dense linear-layer work.

A matrix multiply commonly counts a multiply-add as two FLOPs, so a teaching approximation is:

$$
F_{\text{token}}
\approx
2P
$$

This is not an exact model-wide FLOP count. Embeddings, attention, normalization, activations and other operations exist.

Let `b_w` be ideal payload bytes per weight. If the step streams the model weights once from HBM:

$$
D_{\text{weights}}
\approx
Pb_w
$$

Again, this is not total HBM traffic. It omits metadata, KV cache, activations and runtime workspaces.

Divide:

$$
I_{\text{decode}}
\approx
\frac{2P}{Pb_w}
=
\frac{2}{b_w}
$$

**The parameter count cancels.**

Under this intentionally narrow weight-only model, the single-token decode arithmetic intensity depends mainly on payload bytes per weight, not whether the dense model has 7 billion or 70 billion parameters.

Ideal payload cases:

- BF16/FP16: `b_w = 2` → **1 FLOP/byte**
- 8-bit payload: `b_w = 1` → **2 FLOP/byte**
- 4-bit payload: `b_w = 0.5` → **4 FLOP/byte**

These are not checkpoint sizes and they are not promises of quantized speedup.

![Decode intensity versus precision-specific ridges](/research/hbm-roofline-llm-inference/charts/chart-02-decode-intensity.svg)

The scale difference is the point.

At BF16, `I≈1` versus a B300 ridge of 281.25 and an MI355X ridge of 312.5.

The theoretical fraction of peak arithmetic ceiling that the HBM Roofline can feed is:

$$
U_r
=
\min
\left(
1,
\frac{I}{I^*}
\right)
$$

For the BF16 single-token idealization:

B300:

$$
U_r
=
\frac{1}{281.25}
\approx
0.00356
=
0.356\%
$$

MI355X:

$$
U_r
=
\frac{1}{312.5}
=
0.0032
=
0.320\%
$$

Call this the **Roofline compute-ceiling fraction**.

It is not SM utilization. It is not observed GPU utilization. It is the fraction of the theoretical arithmetic roof exposed by the memory roof at that modeled arithmetic intensity.

This is the mathematical reason a huge PFLOPS number can be economically secondary for low-intensity decode.

## Lower precision does not automatically solve the ridge

A smaller payload increases ideal decode intensity.

But modern accelerators also increase their low-precision compute ceiling.

That can move the hardware ridge farther right at the same time.

For B300, NVIDIA's system table gives a dense FP4 figure of 108 PFLOPS for eight GPUs. Normalized, that is 13.5 PFLOPS per GPU-equivalent. With the same 8 TB/s peak HBM figure:

$$
I^*_{\text{B300,FP4}}
=
1687.5
\text{ FLOP/byte}
$$

An ideal four-bit single-token payload is only:

$$
I\approx4
\text{ FLOP/byte}
$$

AMD publishes 10.1 PFLOPS for MI355X MXFP4, which gives a separate machine-balance calculation of 1262.5 FLOP/byte at 8 TB/s.

Those two four-bit rows are **not a direct vendor comparison**. NVIDIA FP4/NVFP4 and AMD MXFP4 are not treated here as interchangeable numerical formats.

The useful insight is narrower: **quantization reduces bytes per weight, but peak low-precision compute can rise too.** Fewer bytes do not guarantee that a single-token weight stream gets close to the compute ridge.

## Batching moves decode to the right

Single-token decode is only one serving regime.

Suppose `q` concurrent token positions reuse a model's weights during a matrix operation.

The simple arithmetic becomes:

$$
F_{\text{step}}
\approx
2Pq
$$

while ideal weight traffic remains:

$$
D_{\text{weights}}
\approx
Pb_w
$$

So:

$$
I_{\text{batch}}
\approx
\frac{2q}{b_w}
$$

At BF16, `b_w=2`, which reduces to:

$$
I_{\text{batch,BF16}}
\approx
q
$$

Set the workload intensity equal to the machine-balance point:

$$
\frac{2q^*}{b_w}
=
I^*
$$

Therefore:

$$
q^*
=
\frac{b_w I^*}{2}
=
\frac{b_w P_{\text{peak}}}
{2B_{\text{HBM}}}
$$

For BF16:

- B300: **q*=281.25**
- MI355X: **q*=312.5**

If `q` must be an integer, the first integer at or above the simplified ridge is 282 and 313 respectively.

![Batching and the BF16 ridge](/research/hbm-roofline-llm-inference/charts/chart-03-batch-ridge.svg)

This result has another useful cancellation: **model parameter count is absent from q*.**

Under the ideal weight-only assumptions, the amount of batch reuse required to reach the ridge depends on bytes per weight and the accelerator's machine balance, not on model size.

But q* is not a recommended production concurrency.

Real serving pays for higher concurrency with KV memory, queueing, inter-token latency and scheduler behavior. Weight reuse may be imperfect. Activations and KV traffic remain. A latency SLO can make a theoretical q* operationally unacceptable.

The point is not “just batch more.”

The point is that **batching trades latency and memory capacity for arithmetic intensity**.

## Prefill is a different workload

This is where the phrase “LLM inference is memory-bound” breaks.

Prefill processes many prompt tokens through matrix-matrix operations. Weight reuse can be much greater than in low-batch decode.

For a simplified GEMM:

$$
A_{m\times k}
B_{k\times n}
\rightarrow
C_{m\times n}
$$

the arithmetic is approximately:

$$
F
\approx
2mkn
$$

A deliberately simple one-pass traffic model is:

$$
D
\approx
b_A mk
+
b_B kn
+
b_C mn
$$

So:

$$
I_{\text{GEMM}}
\approx
\frac{2mkn}
{b_A mk+b_B kn+b_C mn}
$$

Take one illustrative BF16 matrix multiply:

- `m=2048`
- `k=8192`
- `n=8192`
- `b_A=b_B=b_C=2`

The result is:

$$
I_{\text{GEMM}}
\approx
1365.33
\text{ FLOP/byte}
$$

That is above both BF16 machine-balance points in the simple model.

It does **not** prove that full Qwen prefill runs compute-bound. Cache hierarchy, tiling, fused kernels and the rest of the model change actual data movement.

It proves the mechanism: the same accelerator can see a very different arithmetic-intensity regime when matrix dimensions allow much more reuse.

![Prefill versus decode arithmetic intensity](/research/hbm-roofline-llm-inference/charts/chart-05-prefill-vs-decode.svg)

The useful sentence is therefore:

**parts of low-batch autoregressive decode can be strongly HBM-bandwidth-limited, while prefill and higher-batch operations can move toward or beyond the compute ridge.**

## A 72.7B dense model case

Use a real dense architecture to instantiate the token ceilings.

The official [Qwen2.5-72B-Instruct model card](https://huggingface.co/Qwen/Qwen2.5-72B-Instruct) gives:

- 72.7B total parameters
- 70.0B non-embedding parameters
- 80 layers
- GQA with 64 query heads and 8 KV heads
- full context up to 131,072 tokens.

Its official [configuration](https://huggingface.co/Qwen/Qwen2.5-72B-Instruct/blob/main/config.json) gives hidden size 8192.

For a transparent teaching case, use the **72.7B total parameter count as the 2P proxy**. That slightly exposes the approximation because the model card separately tells us only 70.0B are non-embedding parameters.

At BF16 payload:

$$
W_{\text{ideal}}
=
72.7\times10^9
\times2
=
145.4\text{ GB}
$$

This is an ideal payload calculation in decimal GB. It is not a checkpoint-size claim or total runtime HBM allocation.

At 8 TB/s peak HBM bandwidth:

$$
T_{\text{HBM}}
\lesssim
\frac{8\times10^{12}}
{145.4\times10^9}
=
55.02
\text{ tokens/s}
$$

For the normalized B300 BF16 dense peak:

$$
T_{\text{compute}}
\lesssim
\frac{2.25\times10^{15}}
{2\times72.7\times10^9}
=
15474.55
\text{ tokens/s}
$$

The simple lower roof is:

**about 55.0 tokens/s from ideal weight streaming.**

![Theoretical token roofs for the dense model case](/research/hbm-roofline-llm-inference/charts/chart-04-token-roofs.svg)

This is emphatically **not a B300 Qwen benchmark**.

The 55 tokens/s number assumes peak 8 TB/s is usable for weight traffic and ignores every other byte. It is an ideal upper bound for the weight-streaming part of the model.

At an assumed 80% bandwidth efficiency, the same arithmetic becomes roughly **44.0 tokens/s**. At 40%, roughly **22.0 tokens/s**.

Those efficiency ratios are sensitivity inputs, not claims about typical hardware behavior.

The workbook lets a company replace peak bandwidth with a measured sustained value.

## / CLAIM CHECK

### “An 8 TB/s GPU can stream 8 TB of model weights every second.”

**WHAT IS TRUE**

8 TB/s is the current vendor **peak memory-bandwidth specification** for both hardware cases used here.

**WHAT IS MISSING**

Sustained bandwidth, the access pattern, other HBM traffic, controller behavior, caching and kernel efficiency.

**SECOND / PASS**

Use peak HBM bandwidth as the upper memory roof until a representative measured sustained bandwidth exists.

Peak bandwidth is not a measured inference trace.

## KV cache is the correction, not the main story

The weight-only derivation is deliberately optimistic.

For conventional full-attention GQA, a useful bounded approximation for KV bytes read per decode token is:

$$
D_{\text{KV}}
\approx
2L n_{\text{kv}} d_h S b_{\text{kv}}
$$

For the Qwen case:

- `L=80`
- `n_kv=8`
- `d_h=8192/64=128`
- BF16 KV payload `b_kv=2`
- example context `S=8192`.

That yields approximately **2.684 GB of KV read traffic per token** under the conventional all-layer full-context HBM-read approximation.

The number is not promoted to a headline because real kernels use cache hierarchy and optimized attention paths, and architectures with sliding-window, latent or compressed attention need different treatment.

It is enough to make one point:

**KV traffic can make the weight-only HBM ceiling more optimistic, especially as context and concurrency grow.**

The detailed concurrency-budget analysis belongs in the dedicated KV-cache follow-up.

## HBM capacity is not HBM bandwidth

Both hardware cases publish 288 GB of HBM3E per accelerator.

That number answers a fit question:

**How much state can reside?**

The 8 TB/s specification answers a movement question:

**How fast can data move at the peak memory interface?**

A model can fit and still be bandwidth-limited.

A model can also have enough bandwidth in aggregate but fail to fit its weights, KV state and runtime buffers on one device.

Do not substitute capacity for speed.

Do not substitute HBM bandwidth for NVLink, Infinity Fabric, PCIe, Ethernet or InfiniBand bandwidth either. This PROOF is about the **local accelerator HBM boundary**.

A multi-GPU server adds communication constraints. Aggregate compute and HBM can scale while collectives become the new limit. That is a separate COMPUTE problem.

## The procurement rule

A company buying inference hardware should not start with PFLOPS per dollar.

Start with the workload.

**1. Separate prefill and decode.**  
Do not model the whole request as one arithmetic-intensity point.

**2. Record the actual precision.**  
Do not compare a BF16 workload with an FP4 peak or a dense workload with a sparse peak.

**3. Estimate or measure bytes moved at the relevant memory boundary.**

**4. Calculate arithmetic intensity.**

$$
WI=\frac{F}{D}
$$

**5. Calculate the candidate accelerator's machine balance.**

$$
MB=\frac{P_{\text{peak}}}{B_{\text{HBM}}}
$$

**6. Compare them.**

Define a simple feed ratio:

$$
R_f=\frac{WI}{MB}
$$

If `R_f<1`, the HBM roof is tighter in the simplified model.

If `R_f>=1`, compute can become the tighter roof.

**7. If HBM is tighter, test the levers that move bytes or reuse them.**  
Weight compression, batching, kernel memory efficiency and architecture choices can matter more than adding arithmetic ceiling.

**8. If compute is tighter, peak arithmetic throughput becomes more relevant.**

**9. Replace vendor peaks with measured sustained ceilings whenever representative measurements exist.**

**10. Validate under the actual latency SLO before making the purchase.**

Only after that should a company turn throughput into dollars.

If GPU-hour price is `C_h` and representative measured throughput is `T` tokens/s:

$$
C_{\text{1M tokens}}
=
\frac{10^6 C_h}{3600T}
$$

The workbook includes the formula but leaves GPU price optional.

More importantly, its default token rate is labeled **theoretical**, not production goodput.

## The second pass

Peak FLOPs are valuable when the workload can feed them.

That is the whole proof.

For current dense BF16 peak specifications, B300's machine balance is 281.25 FLOP/byte and MI355X's is 312.5 FLOP/byte.

The ideal single-token weight-stream decode model starts at 1 FLOP/byte.

That gap is large enough that the first-order Roofline question is not which accelerator has the bigger arithmetic headline. It is whether the workload can generate enough reuse, batching or phase-specific intensity to move toward the ridge.

Prefill can.

Higher batch can.

Quantization moves bytes, but the hardware compute roof can move too.

Long context adds KV traffic.

Real kernels may reach only a fraction of either vendor peak.

So the procurement sheet needs one row before PFLOPS:

**workload arithmetic intensity.**

If the workload is below the machine-balance point, more peak arithmetic capacity is not the binding Roofline resource.

The expensive mistake is not buying a GPU with too few FLOPs.

It is buying FLOPs the serving workload cannot yet feed.

---

## / INTELLIGENCE

Evaluating inference hardware for a real model and latency target?

SECOND / PASS runs source-backed infrastructure research sprints that replace the peak Roofline with measured model, batch, context, precision and serving data.

[START A RESEARCH BRIEF →](/intelligence)
