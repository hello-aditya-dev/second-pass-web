# ROOFLINE AUDIT

Status: **PASS**

For every plotted/model point:

- memory level: **local accelerator HBM**
- compute precision identified: **YES**
- dense/sparse state identified: **YES**
- peak vs measured compute identified: **YES**
- peak vs measured bandwidth identified: **YES**
- arithmetic operations counted: **2 FLOPs per multiply-add in the dense teaching approximation**
- bytes counted: **explicit payload/traffic model**
- kernel/workload boundary explicit: **YES**
- theoretical roof called measured performance: **NO**

Figure 01 is a theoretical peak Roofline.
Figure 02 uses precision-specific ridge points.
Figure 03 is a BF16 ideal weight-reuse threshold.
Figure 04 is a theoretical Qwen token-ceiling comparison, not a benchmark.
Figure 05 contrasts phase mechanisms using one illustrative GEMM.

**PASS**
