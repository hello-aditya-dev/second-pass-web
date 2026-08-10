# CLAIM LEDGER

| id | claim | class | source | confidence | caveat | publication_safe |
|---|---|---|---|---|---|---|
| C01 | HGX B300 system BF16 Tensor Core peak is 36 PFLOPS sparse; NVIDIA says dense is half. | FACT | S01 | high | Eight-GPU system figure. | YES |
| C02 | Normalized B300 dense BF16 peak is 18/8 = 2.25 PFLOP/s per GPU-equivalent. | CALCULATION | C01 | high arithmetic | Derived normalization, not directly published per-GPU number. | YES |
| C03 | B300 has 288 GB HBM3e/GPU and up to 8 TB/s GPU HBM bandwidth. | FACT | S02 | high | Peak bandwidth. | YES |
| C04 | MI355X dense BF16 matrix peak is 2.5 PFLOPS; structured-sparse is 5 PFLOPS; HBM is 288 GB HBM3E at 8 TB/s peak. | FACT | S03 | high | Peak specs. | YES |
| C05 | BF16 dense machine balances are 281.25 FLOP/B B300 and 312.5 FLOP/B MI355X. | CALCULATION | C02-C04 | high | Vendor peak Roofline only. | YES |
| C06 | Roofline uses arithmetic intensity and bounds performance by min(compute roof, bandwidth×intensity). | FACT/MODEL | S04/S05 | high | Defined kernel/workload and memory boundary. | YES |
| C07 | Dense weight-dominated decode can be approximated F≈2P and D≈P*b_w. | ASSUMPTION/MODEL | derivation | medium-high | Not exact full-model op/traffic count. | YES if labeled idealized |
| C08 | Under C07, single-token I≈2/b_w and P cancels. | CALCULATION | C07 | high arithmetic | Only under stated simplification. | YES |
| C09 | Ideal payload intensities: BF16 1, 8-bit 2, 4-bit 4 FLOP/B. | CALCULATION | C08 | high | Payload only; metadata/other traffic omitted. | YES |
| C10 | BF16 q* is 281.25 B300 and 312.5 MI355X. | CALCULATION | C05/C08 | high | Theoretical weight-only threshold, not serving recommendation. | YES |
| C11 | q* does not contain model parameter count under the ideal weight-only derivation. | CALCULATION/INFERENCE | equation | high | Real traffic restores model/architecture dependence. | YES |
| C12 | Illustrative 2048×8192×8192 BF16 GEMM has one-pass I≈1365.33 FLOP/B. | SCENARIO/CALCULATION | derivation | high arithmetic | Not full-model prefill. | YES |
| C13 | Qwen2.5-72B-Instruct has 72.7B total, 70B non-embedding, 80 layers, 64Q/8KV and full context 131072. | FACT | S06 | high | Publisher model card. | YES |
| C14 | Qwen config hidden size is 8192, so head dimension is 128 for 64 Q heads. | FACT/CALCULATION | S07 | high | Head-dim calculation. | YES |
| C15 | Ideal Qwen BF16 weight payload is 145.4 GB decimal. | CALCULATION | C13 | high | Not checkpoint/runtime allocation. | YES |
| C16 | At 8 TB/s, ideal Qwen BF16 weight-stream ceiling is 55.02 tokens/s. | CALCULATION | C03/C15 | high arithmetic | Not measured; omits all other traffic. | YES if labeled theoretical |
| C17 | B300 2P arithmetic ceiling for Qwen proxy is 15474.55 tokens/s. | CALCULATION | C02/C13 | high arithmetic | 2P teaching proxy; not measured. | YES if labeled theoretical |
| C18 | Conventional Qwen BF16 full-context KV read approximation at S=8192 is 2.684 GB/token. | CALCULATION/BOUND | C13/C14 | medium | Assumes HBM read of conventional full-attention GQA KV; cache/kernels can differ. | YES if bounded |
| C19 | NVIDIA FP4 and AMD MXFP4 are numerically equivalent formats. | UNKNOWN/FALSE EQUIVALENCE | none | low | Do not assert. | NO |
| C20 | 8 TB/s equals sustained inference bandwidth. | FALSE/OVERBROAD | vendor wording | high | Peak only. | NO |
| C21 | Theoretical token ceilings are measured benchmark throughput. | FALSE | model semantics | high | Explicitly prohibited. | NO |
| C22 | LLM inference is always memory-bound. | FALSE/OVERBROAD | phase analysis | high | Prefill/high batch can move intensity. | NO |
