# LinkedIn — SECOND / PASS

**COMPUTE / PROOF**

**When FLOPs stop being the binding spec: the HBM roofline for LLM inference**

Dense BF16 peak machine balance:
NVIDIA B300 — 281.25 FLOP/B
AMD MI355X — 312.5 FLOP/B.

Idealized dense single-token weight streaming:
BF16 — 1 FLOP/B.

The gap is the proof.

The release derives:
- I≈2/b_w
- parameter-count cancellation
- ideal q* ridge batch
- prefill vs decode
- bounded KV correction
- Qwen2.5-72B theoretical token roofs
- effective-bandwidth sensitivity.

Peak ceilings, not benchmark claims.

[LINK]
