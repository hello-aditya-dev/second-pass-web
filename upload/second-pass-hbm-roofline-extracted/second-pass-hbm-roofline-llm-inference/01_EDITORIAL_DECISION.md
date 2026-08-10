# Editorial Decision

## Final headline
**When FLOPs stop being the binding spec: the HBM roofline for LLM inference**

The working headline “When FLOPs stop mattering” overstates the proof. FLOPs still matter; below machine balance they are not the tighter simple Roofline resource. The final headline preserves the hook without asserting a false binary.

## Format
PROOF / COMPUTE.

## Why it earns publication
The piece contributes:
- current dense-BF16 machine-balance normalization for B300 and MI355X;
- the dense decode `2/b_w` cancellation;
- the ideal ridge-batch derivation and model-size cancellation;
- phase-specific prefill/decode treatment;
- bounded KV correction;
- theoretical token roofs for a verified dense model;
- effective-bandwidth sensitivity;
- a company-input workbook.

## Non-conclusions
No vendor winner. No measured benchmark claim. No universal HBM efficiency. No claim that all LLM inference is memory-bound. No direct NVIDIA FP4 vs AMD MXFP4 equivalence.
