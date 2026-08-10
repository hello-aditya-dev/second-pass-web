# Reddit

## Title
I modeled when peak FLOPs stop being the binding spec for LLM inference

Current dense-BF16 peak Rooflines:
- NVIDIA B300 normalized per GPU: 2.25 PFLOP/s / 8 TB/s → 281.25 FLOP/B
- AMD MI355X: 2.5 PFLOP/s / 8 TB/s → 312.5 FLOP/B

Ideal dense single-token weight streaming:
F≈2P
D≈P*b
I≈2/b

So BF16 → 1 FLOP/B.

That is very far left of both ridges.

The model also shows why “LLM inference is memory-bound” is too broad: batch raises reuse, and a simple prefill GEMM scenario can sit above the BF16 ridge.

The article includes the full derivation, Qwen2.5-72B case, KV caveat, source data and an editable workbook.

All token ceilings are theoretical, not benchmark results.

[LINK]
