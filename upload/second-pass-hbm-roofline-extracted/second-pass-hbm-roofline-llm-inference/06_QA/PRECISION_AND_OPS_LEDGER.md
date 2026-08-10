# PRECISION AND OPS LEDGER

FLOP convention for matrix arithmetic in this package: **one multiply-add = 2 FLOPs**.

| vendor | format | metric | dense/sparse | normalized value | operation handling | comparison_safe | reason |
|---|---|---|---|---:|---|---|---|
| NVIDIA | BF16/FP16 Tensor Core | PFLOP/s | dense | 2.25 PFLOP/s/GPU-equivalent | derived from 36 PFLOPS sparse HGX B300; dense=half; /8 | YES vs MI355X BF16 dense | same precision class and dense setting |
| AMD | BF16 matrix | PFLOP/s | dense | 2.5 PFLOP/s | direct official | YES vs B300 BF16 dense | same precision class and dense setting |
| NVIDIA | FP8/FP6 Tensor Core | PFLOP/s | dense | 4.5 PFLOP/s/GPU-equivalent | sparse system peak halved and /8 | SEPARATE | used only precision-specific |
| AMD | OCP-FP8 | PFLOP/s | dense | 5 PFLOP/s | direct official | SEPARATE | no serving benchmark comparison |
| NVIDIA | FP4 Tensor Core | PFLOP/s | dense | 13.5 PFLOP/s/GPU-equivalent | 108 PFLOPS dense aggregate /8 | NO direct FP4 comparison | vendor-specific format semantics |
| AMD | MXFP4 | PFLOP/s | dense | 10.1 PFLOP/s | direct official | NO direct FP4 comparison | not treated as equivalent to NVIDIA FP4/NVFP4 |
| AMD | INT8 | POP/s | dense | 5 POP/s | integer operations | NO FLOP comparison | POPS are not converted to floating-point FLOPs |

## Payload assumptions
2 / 1 / 0.5 bytes per weight are **ideal payload sizes**, not format-complete checkpoint allocations. Scales, block metadata, alignment and non-quantized tensors can add bytes.
