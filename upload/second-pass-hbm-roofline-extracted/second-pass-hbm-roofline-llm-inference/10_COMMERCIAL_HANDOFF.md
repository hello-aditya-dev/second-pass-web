# COMMERCIAL HANDOFF

## Product
**LLM INFERENCE HARDWARE ROOFLINE SPRINT**

## Buyer inputs
- actual model architecture
- dense/MoE state
- weight and KV precision
- prompt/output distributions
- batch/concurrency distribution
- latency SLO
- candidate accelerators
- measured sustained HBM bandwidth if available
- measured kernel throughput if available
- tensor-parallel topology
- GPU-hour or acquisition cost.

## Outputs
- phase-specific arithmetic-intensity model
- candidate machine-balance table
- measured/effective Rooflines
- decode/prefill classification
- bandwidth efficiency
- ideal vs measured gap
- HBM/KV capacity constraints
- cost per accepted token under measured goodput
- procurement decision brief.

## Boundary
This is performance/procurement research, not a guarantee of production throughput. Final purchasing decisions require representative benchmarking under the buyer's serving stack and SLO.
