# Hacker News

## Title options
1. When FLOPs stop being the binding spec for LLM inference
2. The HBM Roofline for LLM inference
3. Why single-token LLM decode can sit far below a GPU's compute roof

## Suggested title
**The HBM Roofline for LLM inference**

## Optional first comment
I wanted a way to answer “does this inference workload need more compute or more HBM bandwidth?” without importing mismatched benchmark numbers.

Using current dense-BF16 peak specs:
- normalized NVIDIA B300 machine balance: 281.25 FLOP/B
- AMD MI355X: 312.5 FLOP/B

For a deliberately simplified dense weight-stream decode:
F≈2P
D≈P*b
so I≈2/b.

That gives 1 FLOP/B at BF16, independent of parameter count under the assumptions.

I also derive the ideal batch/reuse ridge q*=b*I*/2, separate prefill from decode, add a bounded KV correction, and ship the source CSVs + workbook.

No measured tokens/s claim; the point is the performance boundary.

[LINK]
