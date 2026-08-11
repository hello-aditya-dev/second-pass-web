---
title: "4-bit is not automatically cheaper: the quantization break-even surface"
dek: "Four-bit weights reduce raw weight bytes. They become economically better only when the resulting memory footprint, kernel path, GPU-count boundary, useful throughput, quality and SLO jointly improve the cost of successful work. Under one HOUSE 70B/H200 case the quantized path crosses a 2→1 GPU boundary and the quality break-even falls near 0.681; under a long-context HOUSE case the binding memory term is KV cache, not weights."
slug: "4-bit-is-not-automatically-cheaper"
section: "Compute"
format: "PROOF"
author: "Aditya"
publishedAt: "2026-08-11"
status: "published"
firstPass:
  - "4-bit is not one serving path. W4A16 (AWQ, GPTQ), FP8, NVFP4 and KV-cache quantization are different formats on different kernel paths with different hardware support; weight precision alone does not determine activation, KV or communication precision."
  - "Weight-byte reduction is not total-memory reduction. Model memory is weights plus KV cache plus activations plus workspace plus runtime plus fragmentation; in a long-context 70B HOUSE case, BF16 KV is about 85.9 GB and dominates the footprint, so compressing weights alone does not cross the one-GPU boundary."
  - "GPU-count is a ceiling, not a smooth curve. A 70B BF16 deployment that needs 2 H200s crosses to 1 H200 under a HOUSE W4A16 footprint; that discrete 2→1 step can dominate the economics more than any modest kernel speedup."
  - "Cost per successful task, not cost per token, is the right denominator. The economic condition is C_q/q_q < C_h/q_h, which rearranges to q_q/q_h > r_G/g; for a 32B same-GPU-count HOUSE case with 9.1% throughput gain, the quantized task success must stay above 90% of the higher-precision path."
  - "KV-cache precision, not weight precision, can be the binding boundary. In the long-context 70B HOUSE case, W4 weights plus FP8 KV crosses to one H200 where W4 weights plus BF16 KV does not; the economic headline is sometimes KV precision, not 4-bit weights."
featured: false
featuredRank: 0
editorialOrder: 2
demo: false
adPolicy: "none"
tags:
  - "quantization"
  - "inference"
  - "cost-economics"
  - "GPU-memory"
  - "AWQ"
  - "GPTQ"
  - "NVFP4"
sources:
  - label: "NVIDIA H100 product specifications"
    url: "https://www.nvidia.com/en-us/data-center/h100/"
    type: "primary"
    note: "80 GB HBM3, 3.35 TB/s, FP8 Tensor Core support."
  - label: "NVIDIA H200 product specifications"
    url: "https://www.nvidia.com/en-in/data-center/h200/"
    type: "primary"
    note: "141 GB HBM3e, 4.8 TB/s; used as the HOUSE capacity reference."
  - label: "NVIDIA A100 product specifications"
    url: "https://www.nvidia.com/en-us/data-center/a100/"
    type: "primary"
    note: "80 GB HBM2e, 2,039 GB/s; INT8 Tensor Core, no listed FP4 support."
  - label: "NVIDIA DGX B200 specifications"
    url: "https://www.nvidia.com/en-au/data-center/dgx-b200/"
    type: "primary"
    note: "Eight Blackwell GPUs, 1,440 GB HBM3e, 64 TB/s aggregate, FP4 Tensor Core."
  - label: "NVIDIA TensorRT-LLM — quantization documentation"
    url: "https://github.com/NVIDIA/TensorRT-LLM/blob/main/docs/source/features/quantization.md"
    type: "primary"
    note: "Documents FP4, FP8, FP8 KV, NVFP4 KV, W4A16/W4A8 AWQ and GPTQ paths and the hardware support matrix."
  - label: "NVIDIA TensorRT-LLM — quantization examples"
    url: "https://github.com/NVIDIA/TensorRT-LLM/blob/main/examples/quantization/README.md"
    type: "primary"
    note: "INT4 AWQ block sizes 64 and 128; NVFP4 examples gated to compute capability major version 10+."
  - label: "NVIDIA TensorRT-LLM — performance overview"
    url: "https://github.com/NVIDIA/TensorRT-LLM/blob/main/docs/source/developer-guide/perf-overview.md"
    type: "primary"
    note: "Llama 3.3 70B B200 TP1 FP4 and H200 TP2 FP8 throughput reference; architecture and TP differ, so the ratio is not a quantization speedup."
  - label: "NVIDIA TensorRT-LLM — FP8 performance tuning guide"
    url: "https://nvidia.github.io/TensorRT-LLM/performance/performance-tuning-guide/fp8-quantization.html"
    type: "primary"
    note: "FP8 KV cache example raises throughput from 3,389.53 tok/s to 5,299.64 tok/s; warns that more aggressive quantization can affect quality."
  - label: "vLLM — quantization support"
    url: "https://docs.vllm.ai/en/stable/features/quantization/"
    type: "primary"
    note: "Multiple W4A16 paths (AWQ, GPTQModel, Marlin, LLM Compressor) with implementation-specific hardware support."
  - label: "NVIDIA Transformer Engine — NVFP4 documentation"
    url: "https://docs.nvidia.com/deeplearning/transformer-engine/user-guide/features/low_precision_training/nvfp4/nvfp4.html"
    type: "primary"
    note: "NVFP4 stored value is E2M1 with hierarchical block and global scaling; weights use 2D scaling by default."
  - label: "AWQ: Activation-aware Weight Quantization (Lin et al., 2023)"
    url: "https://arxiv.org/abs/2306.00978"
    type: "paper"
    note: "Low-bit weight-only quantization; W4A16 CUDA kernels and group-size-128 examples."
  - label: "GPTQ: Accurate Post-Training Quantization (Frantar et al., 2022)"
    url: "https://arxiv.org/abs/2210.17323"
    type: "paper"
    note: "3/4-bit post-training weight quantization; custom kernels can be suboptimal on other hardware."
  - label: "SmoothQuant: Accurate and Efficient Post-Training Quantization (Xiao et al., 2022)"
    url: "https://arxiv.org/abs/2211.10438"
    type: "paper"
    note: "W8A8 result; demonstrates that activation quantization is a different problem from weight quantization."
changeLog:
  - at: "2026-08-11"
    type: "published"
    note: "Initial publication."
seoTitle: "4-bit is not automatically cheaper: the quantization break-even surface"
seoDescription: "A quality-adjusted cost model for 4-bit LLM serving: weight-byte reduction is not total-memory reduction, GPU-count is a ceiling, and the binding memory term in long-context cases is often KV-cache precision, not weight precision."
socialStat: "0.681"
socialStatLabel: "HOUSE quality break-even — 70B 2→1 GPU case"
---

Four times fewer weight bits is not four times cheaper serving. Four-bit quantization reduces raw weight bytes — that part is arithmetic. Whether those bytes translate into lower cost per successful task depends on the total memory budget, the GPU-count boundary, the kernel path, the achieved throughput, the task-quality change and the latency SLO. The nominal bit width alone does not identify the winner.

### / ASSUMPTION — "Primary teaching scenarios"

Three HOUSE scenarios anchor the article. Every numerical input below is a HOUSE ASSUMPTION unless a hardware specification is explicitly sourced.

- **Scenario A — interactive 70B / H200.** 80-layer, 8-KV-head, 4096 context, 8 concurrent sequences, BF16 KV, 8 GB other runtime, H200 141 GB, 90% usable-memory policy, $4/GPU-hour. BF16 total ≈ 158.74 GB (2 GPUs, 110 tok/s, q_h = 0.99); W4A16 total ≈ 54.83 GB (1 GPU, 80 tok/s, q_q modeled break-even 0.6806).
- **Scenario B — throughput-oriented 32B / same GPU.** 2048 context, 32 concurrent sequences, single H200 for both paths. BF16 650 tok/s; W4 715 tok/s; both at q_h = 0.99 / q_q = 0.975.
- **Scenario C — long-context 70B.** 32,768 context, 8 concurrent sequences, BF16 KV. KV cache ≈ 85.9 GB; BF16 total ≈ 235.9 GB; W4 + BF16 KV ≈ 132.0 GB (still 2 H200s); W4 + FP8 KV ≈ 89.04 GB (crosses to 1 H200).

The 70B and 32B HOUSE models are generic 80-layer / 8-KV-head / head-dim-128 architectures. They are not vendor benchmarks. The H200 capacity reference (141 GB HBM3e) and the H100 (80 GB HBM3, 3.35 TB/s) are sourced from NVIDIA product specifications. The 90% usable-memory policy and the $4/GPU-hour price are HOUSE inputs, not provider statistics.

## What "4-bit" actually means

Four-bit is a stored-weight description, not one execution path. Keeping the paths separate is the first analytical discipline.

- **W4A16.** Weights are 4-bit, activations are 16-bit. This is a *weight-only* quantization class. AWQ and GPTQ are common W4A16 methods; their kernels, group sizes and metadata layouts differ.
- **FP8.** Eight-bit floating point. Hopper Tensor Cores added native FP8 support; TensorRT-LLM exposes per-tensor, block-scaling and row-wise recipes. FP8 is not the same format as W4A16.
- **NVFP4.** NVIDIA's Blackwell FP4 format. Transformer Engine documentation defines the stored value as E2M1 with hierarchical block (FP8 E4M3 per 16 elements) and global (FP32 per tensor) scaling. The simple 1-D teaching cost is 4 + 8/16 = 4.5 bits/element before tensor-level amortization, but the documentation states weights use 2D scaling by default. Exact runtime memory depends on the serving implementation.
- **KV-cache quantization.** A separate persistent memory term. TensorRT-LLM supports FP8 KV cache and, on supported hardware, NVFP4 KV cache. Quantizing weights does not automatically quantize the KV cache.

INT4 and FP4 are different numerical formats and usually different kernel paths. An INT4 W4A16 kernel can unpack or dequantize weights into a higher-precision GEMM. Blackwell FP4 uses native FP4 Tensor Cores. They should not share one benchmark label. Weight precision alone does not tell us the precision of communicated activations or of the KV cache.

## Where GPU memory goes

Serving memory is not weights. It is:

$$
M_{\text{total}}
=
M_{\text{weights}}
+
M_{\text{KV}}
+
M_{\text{activations}}
+
M_{\text{workspace}}
+
M_{\text{runtime}}
+
M_{\text{fragmentation}}
$$

For a 70B model in BF16, raw weights alone are <imath>70 \times 10^9 \times 16/8 = 140</imath> GB. Under the HOUSE W4A16 model (group size 128, one 16-bit scale per group, no zero point), effective bits per weight are <imath>4 + 16/128 = 4.125</imath>, so weights fall to <imath>70 \times 10^9 \times 4.125/8 \approx 36.09</imath> GB. That is a 4× weight-byte reduction before metadata.

But total runtime memory includes KV cache. For the long-context HOUSE case (32,768 context, 8 concurrent sequences), the simple KV model gives:

$$
M_{\text{KV}} = 2 \, L \, H_{KV} \, D_h \, s_{KV} \, N \, B
$$

with <imath>L = 80</imath>, <imath>H_{KV} = 8</imath>, <imath>D_h = 128</imath>, BF16 <imath>s_{KV} = 2</imath> bytes, <imath>N = 32768</imath>, <imath>B = 8</imath>, producing about 85.9 GB of KV cache. The HOUSE long-context total is therefore about 235.9 GB in BF16 and about 132.0 GB under W4 weights plus BF16 KV. Weight compression alone did not cross the one-GPU boundary. Quantizing the KV cache to FP8 (1 byte/element) drops KV to about 42.95 GB and the total to about 89.04 GB, which fits one H200 under the 126.9 GB usable threshold.

![Stacked bar chart of three long-context 70B configurations: BF16 weights + BF16 KV at 235.9 GB on 2 H200s; W4A16 weights + BF16 KV at 132.0 GB on 2 H200s; W4A16 weights + FP8 KV at 89.0 GB on 1 H200. A Signal Blue dashed line marks the 126.9 GB 1-GPU usable threshold.](/research/quantization-break-even/charts/chart-01-memory-composition.svg "Where GPU memory goes — long-context 70B HOUSE case. BF16 KV dominates the footprint; W4 weights alone do not cross the 1-GPU boundary, but W4 + FP8 KV does. HOUSE MEMORY MODEL — not a TRT-LLM measured deployment.")

Sometimes the economic boundary is not weight precision. It is KV-cache precision.

## / CALCULATION — "GPU-count discontinuity"

**QUESTION**

How does a small byte saving translate into GPU count?

**EQUATION**

$$
G(b) = \left\lceil \frac{M_{\text{required}}(b)}{M_{\text{usable/GPU}}} \right\rceil
$$

**RESULT**

Under the HOUSE 90% usable-memory policy on H200 (141 GB), <imath>M_{\text{usable/GPU}} = 126.9</imath> GB.

For the interactive 70B case:

- BF16: <imath>140 + 10.74 + 8 = 158.74</imath> GB → <imath>G_h = \lceil 158.74 / 126.9 \rceil = 2</imath>
- W4A16: <imath>36.09 + 10.74 + 8 = 54.83</imath> GB → <imath>G_q = \lceil 54.83 / 126.9 \rceil = 1</imath>

The 2→1 GPU step matters more economically than any modest kernel speedup. At a $4/GPU-hour HOUSE price, the BF16 deployment costs $8/hour in compute and the W4 deployment costs $4/hour — a 50% reduction before throughput or quality enters the calculation.

**SO WHAT**

A 10% memory saving that does not cross a boundary can have little direct GPU-count effect. A 5% saving that crosses a boundary can remove a whole GPU. The function is a ceiling, not a smooth curve.

![Step chart of required H200 GPU count across model parameter counts from 20B to 300B, with two lines: BF16 in Graphite and W4A16 in Signal Blue. The 70B HOUSE point is marked: BF16 needs 2 GPUs, W4 needs 1. W4 crosses 1→2 GPUs at ~209 B parameters.](/research/quantization-break-even/charts/chart-03-gpu-count-discontinuity.svg "GPU-count discontinuity across parameter sweep. A 70B BF16 deployment needs 2 H200s; the W4A16 HOUSE footprint fits on 1. The ceiling function is what makes a small byte saving economically decisive. HOUSE WORKLOAD on H200 141 GB / 90% usable.")

**CAVEAT**

The 90% usable-memory policy is a HOUSE input, not a provider recommendation. Real deployments need headroom for activation spikes, fragmentation, framework overhead and operator workspace. The 4.125 bits/weight footprint assumes a specific AWQ-style group-128 layout; other formats have different effective footprints.

## Memory bandwidth and the dequantization budget

A weight-only 4-bit path is faster than BF16 only when the saved weight-traffic time exceeds the extra unpack, dequantization and kernel overhead. The teaching traffic model for the quantized and higher-precision paths is:

$$
T_q = T_{\text{memory},q} + T_{\text{dequant}} + T_{\text{matmul},q} + T_{\text{other},q}
$$

$$
T_h = T_{\text{memory},h} + T_{\text{matmul},h} + T_{\text{other},h}
$$

The dequantization budget is derived as a house object below.

## / CALCULATION — "Dequantization / memory-traffic budget"

**QUESTION**

How much extra unpack, dequantization and kernel overhead can a weight-only 4-bit path absorb before the saved weight-traffic time disappears?

**EQUATION**

Quantization is faster only when <imath>T_q < T_h</imath>. Rearranging:

$$
T_{\text{dequant}} + \Delta T_{\text{matmul}} + \Delta T_{\text{launch}} + \Delta T_{\text{comm}} + \Delta T_{\text{other}}
<
T_{\text{memory},h} - T_{\text{memory},q}
$$

The right side is the transfer-time budget available to pay for quantization overhead. Under the HOUSE low-batch decode approximation, where one weight stream is shared across <imath>B</imath> tokens in the scheduling step:

$$
\Delta T_{\text{transfer/token}} = \frac{M_{\text{weights},h} - M_{\text{weights},q}}{B_{\text{eff}} \, B}
$$

**DIMENSIONAL ANALYSIS**

$$
\frac{\text{bytes}}{(\text{bytes/s}) \times \text{tokens}} = \frac{\text{s}}{\text{token}}
$$

**RESULT**

For the 70B HOUSE weights (<imath>M_{\text{weights},h} = 140</imath> GB, <imath>M_{\text{weights},q} = 36.09</imath> GB), 103.91 GB are saved per weight stream. At <imath>B_{\text{eff}} = 3</imath> TB/s:

| batch <imath>B</imath> | max extra overhead <imath>\Delta T</imath> |
|---:|---:|
| 1 | 34.64 ms/token |
| 8 | 4.33 ms/token |
| 32 | 1.08 ms/token |
| 128 | 0.27 ms/token |

If unpack/dequant/kernel overhead is 5 ms/token in this teaching abstraction, the budget is exceeded at batch 7 and dominated at batch 32.

![Log-x line chart of the maximum extra quantization overhead that preserves a speedup, against batch tokens per decode step from 1 to 128. The budget shrinks as 1/B: 34.6 ms at batch 1, 4.33 ms at batch 8, 1.08 ms at batch 32. A Graphite dashed line marks a hypothetical 5 ms/token unpack overhead; it crosses the budget near batch 6.9.](/research/quantization-break-even/charts/chart-05-dequant-budget.svg "Dequantization budget shrinks as 1/B with batch. At low batch the weight-transfer saving easily absorbs unpack/dequant overhead; at high batch the budget becomes very small. HOUSE TEACHING TRAFFIC MODEL — not a measured H200 kernel benchmark; 3 TB/s effective HBM assumed.")

**SO WHAT**

The budget shrinks as 1/B. A weight-only W4A16 path can be strong in low-batch decode and less compelling in a high-batch compute-heavy regime. This matches TensorRT-LLM's guidance that weight-only quantization is most relevant to small-batch, memory-bandwidth-bound inference, while larger batches favor methods that quantize both weights and activations.

**CAVEAT**

This is a HOUSE teaching traffic model. It is not a measured H200 kernel benchmark. <imath>B_{\text{eff}} = 3</imath> TB/s is an assumed effective HBM bandwidth, not a sustained kernel measurement. The 5 ms/token unpack overhead is illustrative, not a profiled value.

## Three HOUSE cases, three different headlines

### Scenario A — interactive 70B / H200

BF16: 2 GPUs, 110 tok/s, q_h = 0.99 → about $20.20 per million output tokens. W4A16: 1 GPU, 80 tok/s, modeled q_q break-even = 0.6806 → about $13.89 per million output tokens.

The low quality break-even exists because this HOUSE case crosses a discrete 2→1 GPU boundary. It is *not* a recommended quality threshold. A production service that accepted 68% task success would lose most of its users.

### Scenario B — throughput-oriented 32B / same GPU count

Both paths fit on one H200. BF16 650 tok/s vs W4 715 tok/s. Cost per million tokens falls from about $1.71 to $1.55 — about 9.1% raw cost reduction. With higher-precision success at 99%, the quantized quality break-even is 90%.

This is the fragile region. A modest quality regression, a small TTFT increase, or a dequantization overhead can erase the throughput saving.

### Scenario C — long-context 70B

W4 weights plus BF16 KV still requires two H200s under the HOUSE usable-memory policy. Weight compression did not cross the GPU-count boundary. Quantizing the KV cache to FP8 is what crosses to one H200. The economic headline in this case is KV precision, not weight precision.

## / CALCULATION — "Quality-adjusted break-even"

**QUESTION**

What task-success probability does the quantized path need to beat the higher-precision path on cost per successful task?

**EQUATION**

Start from the per-successful-task cost condition:

$$
\frac{C_q}{q_q} < \frac{C_h}{q_h}
$$

Multiplying both sides by positive <imath>q_q \, q_h</imath> and dividing by positive <imath>C_h</imath>:

$$
q_q > q_h \, \frac{C_q}{C_h}
$$

When GPU count is unchanged and only throughput differs, <imath>C_q/C_h = R_h/R_q = 1/g</imath>. When quantization also halves GPU count, <imath>C_q/C_h = (G_q/G_h)(R_h/R_q) = r_G/g</imath>. The combined condition becomes:

$$
\frac{q_q}{q_h} > \frac{r_G}{g}
$$

where <imath>q_q</imath> is quantized task success, <imath>q_h</imath> is higher-precision task success, <imath>r_G = (G_q \, C_{\text{GPU},q})/(G_h \, C_{\text{GPU},h})</imath> is the replica GPU-cost ratio, and <imath>g = R_q/R_h</imath> is the throughput gain.

**RESULT**

- Scenario A: <imath>r_G = 0.5</imath>, <imath>g = 80/110 \approx 0.727</imath>, so <imath>q_q/q_h > 0.5/0.727 \approx 0.687</imath>. With <imath>q_h = 0.99</imath>, <imath>q_q > 0.6806</imath>.
- Scenario B: <imath>r_G = 1</imath>, <imath>g = 715/650 \approx 1.10</imath>, so <imath>q_q/q_h > 1/1.10 \approx 0.909</imath>. With <imath>q_h = 0.99</imath>, <imath>q_q > 0.90</imath>.

**SO WHAT**

The break-even surface is set by two ratios: the GPU-cost ratio and the throughput gain. When the GPU-count step is decisive (Scenario A), the model tolerates large quality loss. When the GPU count is unchanged (Scenario B), the model is fragile — small quality regressions erase the gain.

![Two-curve line chart of the minimum quality ratio q_q/q_h against quantized throughput gain g, for two GPU-cost ratios: r_G=1 (Graphite) and r_G=0.5 (Signal Blue). The curve is q_q/q_h  greater than  r_G/g. Scenario A is marked at g=0.727, r_G=0.5 → 0.687; Scenario B at g=1.10, r_G=1 → 0.909. Reference lines mark g=1 and q_q/q_h=1.](/research/quantization-break-even/charts/chart-02-break-even-surface.svg "Quantization break-even surface. The minimum acceptable quality ratio falls with throughput gain and falls faster when the GPU-count step halves the replica cost. DERIVED RESULT — q_q/q_h  greater than  r_G/g. Scenarios A and B plotted at HOUSE throughput ratios.")

![Line chart of cost per successful task against quantized task success q_q in Scenario B. The higher-precision cost is a flat Graphite line at $0.000884 per success; the quantized cost in Signal Blue declines with q_q and crosses the higher-precision line at q_q ≈ 0.90. Below the crossing, quantization loses; above, it wins.](/research/quantization-break-even/charts/chart-04-cost-per-success.svg "Cost per successful task — Scenario B (same GPU count). The 9.1% raw cost saving disappears when quantized task success falls below about 90% of the higher-precision baseline. HOUSE SCENARIO / DERIVED RESULT.")

**CAVEAT**

<imath>q_q</imath> is task-success probability for a specific workload, not a benchmark accuracy like MMLU. The model does not say quantization is safe at 68% task success. It says that under the HOUSE 2→1 GPU step, the algebraic break-even is low. The recommendation depends on whether the SLO is contractual.

## Fallback economics

A common production pattern is to run the quantized path first and fall back to higher precision on failure. With fallback success probability <imath>q_f</imath> and fallback cost <imath>C_f</imath>:

$$
E[C] = C_q + (1 - q_q) C_f, \qquad q_{\text{overall}} = q_q + (1 - q_q) q_f
$$

$$
C_{\text{success}} = \frac{C_q + (1 - q_q) C_f}{q_q + (1 - q_q) q_f}
$$

A cheap first attempt stops being useful when this exceeds the direct higher-precision policy after including latency and SLO effects. Fallback also adds a tail-latency penalty: the requests that fall back pay the quantized time plus the higher-precision time, which can break a p99 TPOT budget even when the average looks acceptable.

## Latency and SLO feasibility

A quantized configuration is feasible only if it meets the product service objective:

$$
P(T \le T_{\text{SLO}}) \ge \alpha
$$

The HOUSE Scenario B includes BF16 p95 TTFT 520 ms / W4 p95 TTFT 540 ms and BF16 p95 TPOT 18 ms / W4 p95 TPOT 17 ms. Under a HOUSE TTFT SLO of 500 ms, both paths are infeasible. The direct cost arithmetic remains reproducible, but a production recommendation is blocked by the SLO. This is intentional. Throughput alone cannot decide feasibility.

## Real benchmark evidence, and what it cannot tell us

Current TensorRT-LLM documentation reports historical H100 Llama-v2-7B FP8 vs FP16 speedups of 1.51× at batch 1 and 1.40× at batch 8, plus a latency-constrained batch-16 case with first-token latency under 500 ms where FP8 reaches 2.3× versus FP16. These are FP8 results, not 4-bit. They show that quantization speedup depends on batch and latency policy.

The same source reports Llama-v2-70B MMLU: FP16 baseline 69.1, INT4-AWQ 68.4 — a 0.7-point absolute reduction. That is a benchmark evaluation, not an enterprise task-success measurement.

For KV precision, the TensorRT-LLM FP8 tuning guide reports one tuned FP8 engine example where baseline throughput of 3,389.53 tok/s rises to 5,299.64 tok/s with FP8 KV cache — about 56.35% higher throughput, with TTFT near 96–97 ms in both cases. The page explicitly warns that more aggressive quantization can affect output quality. This is strong evidence that KV precision can materially change a serving boundary independently of model-weight precision.

## / CLAIM CHECK — "4-bit means four times less GPU memory"

**CLAIM**

4-bit quantization reduces GPU memory by 4×.

**WHAT IS TRUE**

The raw 16→4 weight payload reduction is 4× before metadata. AWQ's current repository exposes W4A16 CUDA kernels with group-size-128 examples, and TensorRT-LLM documents W4A16 AWQ and GPTQ paths.

**WHAT IS MISSING**

Total runtime memory is not just weights. It is weights plus KV cache plus activations plus workspace plus runtime plus fragmentation. In the HOUSE long-context 70B case, BF16 KV cache alone is about 85.9 GB — larger than the entire W4 weight footprint (36.09 GB). Compressing weights from 140 GB to 36.09 GB did not change the GPU count because the total stayed above the 126.9 GB usable threshold.

**WHAT THAT MEASURES**

The weight-byte reduction. It does not measure the GPU-count change.

**WHAT IT DOES NOT MEASURE**

It does not mean 4-bit always reduces GPU count by 4×, or even by 2×. In Scenario A the GPU count falls from 2 to 1 (a 2× reduction driven by the ceiling function, not by the 4× byte reduction). In Scenario C the GPU count does not change at all when only weights are quantized.

**SECOND / PASS**

Report total memory, not weight bytes. The GPU-count ceiling is what creates the discrete economic step.

## / CLAIM CHECK — "B200 FP4 is N× faster than H200 FP8"

**CLAIM**

A B200 TP1 FP4 result of 6,920 output tok/s/GPU versus an H200 TP2 FP8 result of 2,587 output tok/s/GPU on Llama 3.3 70B (ISL/OSL 1000/1000) is a 2.67× quantization speedup.

**WHAT IS TRUE**

Both numbers appear in current TensorRT-LLM performance documentation.

**WHAT IS MISSING**

The two rows are not a controlled quantization experiment. GPU architecture differs (Blackwell vs Hopper), and tensor parallelism differs (TP1 vs TP2). The ratio conflates architecture, parallelism, memory subsystem, kernel path and quantization format.

**WHAT THAT MEASURES**

Two platform-level throughput points on different hardware with different parallelism.

**WHAT IT DOES NOT MEASURE**

It does not measure FP4 versus FP8 on the same model, same GPU, same parallelism, same workload, same quality gate.

**SECOND / PASS**

**NOT DIRECTLY COMPARABLE.** Do not report this ratio as a quantization-isolated speedup. A clean FP4-vs-FP8 claim requires the same Blackwell GPU, same TP, same batch, same context and a matched quality evaluation.

## Falsification: when 4-bit is the right answer

The thesis is not that 4-bit is bad. It is that 4-bit is *conditional*. The headline would weaken substantially for a specific deployment if: the 4-bit format is natively supported on the target hardware; its kernels are consistently faster across the production batch and context distribution; quality loss is statistically negligible on the buyer's actual tasks; TTFT and TPOT are never worse at the required load; metadata and dequantization overhead are negligible; GPU memory savings translate into either higher useful throughput or lower GPU count; and retry, fallback and human-review rates do not increase.

Blackwell NVFP4 moves some workloads closer to that case because native FP4 Tensor Cores remove the historical software-only-INT4 limitations. If a model already fits comfortably on one Blackwell GPU, NVFP4 delivers a large measured throughput improvement, quality is unchanged for the target task, and the SLO is preserved, the break-even exercise becomes almost trivial — quantize. The framework must allow that result. What it does not allow is treating that case as a universal statement.

## What a company needs to measure

The HOUSE scenarios in this article are teaching cases. A real production decision needs the buyer's own measurements:

- model and parameter count;
- current and proposed quantization format;
- GPU type, count and hourly cost;
- framework and version;
- TP / PP layout;
- input and output token distributions;
- concurrency and batch policy;
- KV dtype and bytes per token;
- measured TTFT and TPOT distributions;
- sustained output throughput;
- latency SLO;
- task-quality evaluation on the buyer's actual workload;
- success, retry, fallback and human-review rates;
- failure and human-review cost.

The reusable template is published as `company-quantization-break-even-input-template.csv`. Only a buyer run using measured performance and quality should be treated as a production decision.

## SECOND / PASS

Four-bit reduces raw weight bytes. It is economically better only when the resulting memory footprint, kernel path, GPU-count boundary, useful throughput, quality and latency constraints improve the economics of successful work. The nominal bit width alone does not identify the winner — the ceiling function on GPU count, the 1/B shrinkage of the dequantization budget, and the independent role of KV-cache precision all enter the decision. The right answer for a specific deployment comes from measuring total memory, throughput, latency and quality on that deployment, not from a bit-width headline.

## / INTELLIGENCE

Quantizing a serving deployment and want to know whether the bytes you save will actually reduce cost per successful task?

SECOND / PASS can apply this quality-adjusted break-even model to your model, hardware, kernel path, GPU-count boundary, throughput, quality evaluation and SLO — and tell you where the economic break-even surface actually sits, including whether KV-cache precision is the binding constraint rather than weight precision.

[START A RESEARCH BRIEF →](/intelligence)
