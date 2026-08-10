# Bluesky

Dense BF16 machine balance:
B300 281.25 FLOP/B
MI355X 312.5 FLOP/B.

Ideal single-token dense weight streaming:
I≈2/b → BF16 ≈1 FLOP/B.

That is why PFLOPS can stop being the binding Roofline spec in low-intensity decode.

Batch/prefill move the workload right. KV adds bytes.

Full proof + workbook:
[LINK]
