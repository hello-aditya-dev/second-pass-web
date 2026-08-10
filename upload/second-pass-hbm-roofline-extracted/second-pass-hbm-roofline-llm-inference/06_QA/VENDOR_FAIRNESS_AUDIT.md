# VENDOR FAIRNESS AUDIT

Status: **PASS**

## NVIDIA review
- HGX B300 36 PFLOPS BF16 sparse is not used as dense: PASS.
- dense is halved per NVIDIA footnote, then normalized /8: PASS.
- 8 TB/s described as peak/up to: PASS.
- no AMD marketing benchmark used against NVIDIA spec: PASS.

## AMD review
- MI355X dense 2.5 PFLOPS is separated from structured-sparse 5 PFLOPS: PASS.
- 8 TB/s described as peak: PASS.
- MXFP4 is not declared equivalent to NVIDIA FP4/NVFP4: PASS.

## Cross-vendor
Direct comparison used only for **BF16/FP16 dense machine-balance normalization**.
No vendor winner is declared.
Equal advertised HBM bandwidth is not presented as equal sustained performance.

**PASS**
