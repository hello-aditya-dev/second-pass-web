# Chart Specifications

Palette: Paper `#F2EFE7` · Ink `#11110F` · Graphite `#5A5953` · Rule `#C9C3B7` · Signal Blue `#2F5BFF`.  
No gradients, vendor-logo battle, silicon photography, 3D charts or decorative GPU imagery.

## Figure 01 — The LLM inference Roofline
**figure_id:** `chart-01-inference-roofline`  
**decision_question:** When does local HBM bandwidth become tighter than peak BF16 compute?  
**title:** THE LLM INFERENCE ROOFLINE — BF16 DENSE  
**source data:** `data/chart-01-inference-roofline.csv`  
**precision:** BF16/FP16 dense  
**hardware:** NVIDIA B300 and AMD MI355X  
**classification:** FACT + CALCULATION  
**main takeaway:** at an 8 TB/s peak bandwidth, the theoretical BF16 dense ridge is 281.25 FLOP/B for normalized B300 and 312.5 FLOP/B for MI355X.  
**assumptions:** B300 compute normalized from the 8-GPU HGX spec; vendor peaks; local HBM memory level.  
**caveat:** a Roofline is a kernel/workload bound, not end-to-end LLM latency or a measured benchmark.  
**alt text:** Log-log Roofline chart with a shared 8 TB/s memory slope, B300 compute roof at 2.25 PFLOP/s, MI355X roof at 2.5 PFLOP/s, and BF16 single-token weight-only decode near one FLOP per byte far left of both ridges.  
**caption:** Comparable dense BF16 peaks put both accelerator ridges hundreds of FLOPs per HBM byte to the right of idealized single-token weight streaming.  
**mobile behavior:** full-width; allow horizontal internal scroll below 390px rather than shrinking axis labels.

## Figure 02 — Single-token decode is far left
**figure_id:** `chart-02-decode-intensity`  
**decision_question:** Where do idealized single-token payload intensities sit relative to the relevant precision-specific hardware ridges?  
**title:** IDEALIZED SINGLE-TOKEN DECODE REMAINS FAR LEFT  
**source data:** `data/chart-02-decode-intensity.csv`  
**precision:** BF16, 8-bit/FP8, and vendor-specific 4-bit cases  
**hardware:** B300 / MI355X  
**classification:** CALCULATION / IDEALIZED MODEL  
**main takeaway:** idealized I≈1, 2 and 4 FLOP/B remain far below the corresponding peak machine-balance points.  
**assumptions:** F≈2P; D_weights≈P*b_w; metadata/KV/activation traffic omitted; precision-specific compute peaks used for ridge points.  
**caveat:** NVIDIA FP4 and AMD MXFP4 are shown as separate vendor cases, not as numerically equivalent formats or a direct cross-vendor performance comparison.  
**alt text:** Three rows show ideal single-token decode intensity at 1, 2, and 4 FLOP per byte far left of precision-specific B300 and MI355X machine-balance points, from roughly 281 to 1688 FLOP per byte.  
**caption:** Quantization reduces ideal payload bytes, but the hardware compute roof can rise at the same time; lower bytes per weight do not automatically move the workload close to the ridge.  
**mobile behavior:** full-width; internal horizontal scroll below 390px.

## Figure 03 — Batching moves decode right
**figure_id:** `chart-03-batch-ridge`  
**decision_question:** How much ideal BF16 weight reuse is required to meet the machine-balance point?  
**title:** BATCHING MOVES WEIGHT-ONLY DECODE RIGHT  
**source data:** `data/chart-03-batch-ridge.csv`  
**precision:** BF16 payload / BF16 dense hardware ridges  
**hardware:** B300 / MI355X  
**classification:** CALCULATION / IDEALIZED MODEL  
**main takeaway:** q*=281.25 for B300 and 312.5 for MI355X under the simple BF16 weight-only model.  
**assumptions:** weights reused perfectly across q; KV, activations, scheduling and latency SLOs omitted.  
**caveat:** q* is not a recommended serving batch size.  
**alt text:** Log-log plot where BF16 weight-only arithmetic intensity rises linearly with batch and crosses B300 and MI355X ridge lines near batch 281 and 313.  
**caption:** Batching trades latency and memory capacity for weight reuse; real serving can hit other bottlenecks before the theoretical ridge.  
**mobile behavior:** full-width.

## Figure 04 — What limits token throughput?
**figure_id:** `chart-04-token-roofs`  
**decision_question:** For Qwen2.5-72B-Instruct, which ideal theoretical roof is lower across payload precision in a B300 case?  
**title:** QWEN2.5-72B: THE LOWER ROOF IS HBM IN THIS SIMPLE MODEL  
**source data:** `data/chart-04-token-roofs.csv`  
**precision:** BF16, ideal 8-bit payload, ideal 4-bit payload  
**hardware:** NVIDIA B300 precision-specific peak paths  
**classification:** CALCULATION / IDEALIZED UPPER BOUNDS  
**main takeaway:** the weight-stream HBM ceiling remains far below the corresponding peak compute ceiling in this deliberately simple model.  
**assumptions:** total 72.7B parameters as 2P proxy; 8 TB/s peak; ideal payload bytes; no KV/activation/metadata/communication.  
**caveat:** these are not benchmark tokens/s and precision-specific compute semantics differ.  
**alt text:** Log bar chart comparing much lower HBM weight-stream token ceilings with much higher compute ceilings for Qwen2.5-72B under BF16, 8-bit and 4-bit payload assumptions on B300.  
**caption:** A lower weight payload raises the ideal HBM token roof, but real speedup is not automatically proportional because other traffic and kernel behavior remain.  
**mobile behavior:** full-width.

## Figure 05 — Prefill vs decode
**figure_id:** `chart-05-prefill-vs-decode`  
**decision_question:** Why can one model be bandwidth-limited in decode yet move toward compute limitation in prefill or higher batch?  
**title:** THE SAME MODEL CAN OCCUPY DIFFERENT SIDES OF THE ROOFLINE  
**source data:** `data/chart-05-prefill-vs-decode.csv`  
**precision:** BF16  
**hardware:** B300 / MI355X BF16 ridges  
**classification:** CALCULATION + SCENARIO  
**main takeaway:** single-token decode sits near I=1; q=128 moves to I≈128; an illustrative 2048×8192×8192 BF16 GEMM reaches I≈1365.3 FLOP/B, beyond both simple BF16 ridges.  
**assumptions:** one-pass GEMM traffic model; cache/tiling effects omitted.  
**caveat:** this is a phase mechanism, not a claim that all prefill is compute-bound.  
**alt text:** Arithmetic-intensity markers show single-token decode near 1, batch-128 decode near 128, BF16 hardware ridges near 281–313, and an illustrative prefill GEMM near 1365 FLOP per byte.  
**caption:** “LLM inference is memory-bound” is too broad; phase, batch and data movement determine which roof is tighter.  
**mobile behavior:** full-width.
