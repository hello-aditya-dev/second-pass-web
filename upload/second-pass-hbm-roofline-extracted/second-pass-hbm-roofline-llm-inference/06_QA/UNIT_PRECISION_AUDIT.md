# UNIT / PRECISION AUDIT

Status: **PASS**

## Units
- FLOP/s vs PFLOP/s: PASS; 1 PFLOP/s = 1e15 FLOP/s.
- byte/s vs TB/s: PASS; Roofline dataset uses decimal 1 TB/s = 1e12 byte/s, matching vendor headline units.
- GB vs GiB: PASS; model payload is explicitly decimal GB; no GiB conversion is silently applied.
- bit vs byte: PASS; 16/8/4-bit ideal payloads map to 2/1/0.5 bytes only as payload assumptions.
- FLOP/byte: PASS.
- tokens/s: all generated values labeled theoretical/ideal unless measured input exists.

## Precision
- B300 BF16 dense vs MI355X BF16 dense: PASS.
- sparse peak mixed into dense Roofline: NO.
- NVIDIA FP4 equated to AMD MXFP4: NO.
- INT8 POPS converted to FLOPs: NO.
- 4-bit payload called complete checkpoint size: NO.

Any direct cross-vendor low-precision performance ranking remains outside scope.
