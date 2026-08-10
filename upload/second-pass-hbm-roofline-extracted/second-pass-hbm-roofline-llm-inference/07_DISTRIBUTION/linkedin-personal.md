# LinkedIn — Personal

Peak PFLOPS are not a serving benchmark.

I built the next SECOND / PASS COMPUTE proof around a more useful question:

**How many FLOPs per HBM byte does our workload generate, and how many does the accelerator need before compute becomes the tighter roof?**

Current dense-BF16 peak normalization:
- NVIDIA B300: 281.25 FLOP/byte
- AMD MI355X: 312.5 FLOP/byte

Then the dense single-token weight-stream derivation:

F ≈ 2P  
D ≈ P×bytes/weight  
I ≈ 2/bytes-per-weight

At BF16 that is ~1 FLOP/byte.

The parameter count cancels under the assumptions.

Batching moves the workload right. Prefill can move much farther right. KV traffic pushes additional bytes through HBM.

The package includes:
- source-normalized hardware data
- precision/dense-sparse audit
- Qwen2.5-72B case
- five figures
- workbook
- all calculation ledgers.

No random benchmark numbers and no vendor winner.

[LINK]
