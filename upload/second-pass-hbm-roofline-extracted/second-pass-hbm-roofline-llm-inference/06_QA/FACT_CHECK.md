# FACT CHECK

## Source QA — PASS
Load-bearing hardware facts use NVIDIA/AMD primary sources. Roofline foundation uses Berkeley Lab. Dense model case uses the Qwen publisher repository.

## Hardware QA — PASS
- B300: 288 GB HBM3e/GPU, up to 8 TB/s/GPU: verified.
- HGX B300 BF16 sparse/dense footnote handling: verified.
- MI355X: 288 GB HBM3E, 8 TB/s, 2.5 PFLOPS dense BF16: verified.

## Calculation QA — PASS
See `CALCULATION_LEDGER.md`.

## Precision / unit QA — PASS
See `PRECISION_AND_OPS_LEDGER.md` and `UNIT_PRECISION_AUDIT.md`.

## Roofline QA — PASS
See `ROOFLINE_AUDIT.md`.

## Decode-model QA — PASS
See `DECODE_MODEL_AUDIT.md`.

## Vendor fairness — PASS
See `VENDOR_FAIRNESS_AUDIT.md`.

## Adversarial procurement review

**GPU performance architect:** “Peak specifications are not sustained kernel performance.”  
Fixed: every roof is labeled theoretical/peak unless measured inputs are supplied.

**Inference engineer:** “2P and P*b are not end-to-end decode.”  
Fixed: both are explicitly teaching approximations and KV/activation omissions are visible.

**Serving engineer:** “q*=281 does not mean set batch=281.”  
Fixed: q* is called an ideal weight-only ridge threshold, not a serving recommendation.

**Precision specialist:** “FP4 formats are not automatically equivalent.”  
Fixed: direct four-bit vendor comparison prohibited.

**Model architect:** “Qwen has 70B non-embedding, not exactly 72.7B linear work.”  
Fixed: 72.7B is explicitly a total-parameter proxy and 70B non-embedding is disclosed.

**Networking architect:** “Local HBM Roofline ignores tensor-parallel communication.”  
Fixed: multi-GPU communication is explicitly outside this local-HBM proof.

**CFO/procurement:** “A theoretical 55 tokens/s is not costable production goodput.”  
Fixed: cost formula exists, but price is optional and the token rate is labeled theoretical until replaced with measured representative goodput.

## Factual freeze
**PASS — 2026-08-10 final source re-open.**

Re-opened after editorial/workbook/chart completion:
- NVIDIA HGX Platform — B300 BF16/FP16 peak table and dense/sparse footnotes unchanged.
- NVIDIA HGX AI Factory Components — B300 288 GB HBM3e/GPU and up-to-8-TB/s/GPU unchanged.
- AMD MI355X — 2.5 PFLOPS dense BF16, 288 GB HBM3E and 8 TB/s unchanged.
- Berkeley Lab Roofline material — arithmetic-intensity/Roofline foundation unchanged.
- Qwen2.5-72B-Instruct publisher repository — 72.7B total, 70.0B non-embedding, 80 layers and 64Q/8KV unchanged.

No load-bearing value changed during production.


## Cross-asset number audit — PASS
Matched across article, CSVs, figure data, workbook defaults, QA, BRIEF and distribution where used:
- B300 BF16 dense normalized peak: **2.25 PFLOP/s**
- B300 peak HBM: **8 TB/s**
- B300 BF16 machine balance: **281.25 FLOP/B**
- MI355X dense BF16: **2.5 PFLOP/s**
- MI355X peak HBM: **8 TB/s**
- MI355X BF16 machine balance: **312.5 FLOP/B**
- ideal single-token BF16 decode: **1 FLOP/B**
- BF16 q*: **281.25 / 312.5**
- Qwen total parameter proxy: **72.7B**
- ideal Qwen BF16 payload: **145.4 GB decimal**
- peak HBM weight-stream ceiling: **55.02 tokens/s**
- B300 2P compute ceiling: **15,474.55 tokens/s**
- prefill GEMM scenario: **1,365.33 FLOP/B**
- bounded S=8192 KV read approximation: **2.684 GB/token**

No conflicting central value found.

## Senior editorial rewrite — PASS
Working headline softened from “FLOPs stop mattering” to “FLOPs stop being the binding spec.” Blanket “LLM inference is memory-bound” language was removed.

## Line-by-line proofreading — PASS
Grammar, spelling, punctuation, terminology, precision labels, dense/sparse labels, units, equations, figure labels, captions, metadata, links and source names checked separately after factual/calculation QA.

Final canonical body: **2986 words**.
