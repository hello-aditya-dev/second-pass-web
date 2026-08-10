# BENCHMARK / THROUGHPUT LEDGER

## Load-bearing serving throughput used in the flagship
**None.**

The package deliberately does not claim a transferable Mistral Small 4 tasks/sec or tokens/sec figure.

| item | model | hardware | precision | engine | workload | metric | source | status | limitation |
|---|---|---|---|---|---|---|---|---|---|
| Vendor relative throughput claim | Mistral Small 4 vs Small 3 | not fully specified in public card | setup-dependent | provider stack | provider evaluation | relative requests/sec | S03;S04 | NOT USED in economics | Cannot establish absolute production capacity. |
| NVFP4 serve recipe | Mistral Small 4 NVFP4 | hardware not fully fixed in card | NVFP4 | vLLM | max model len 262144; TP2; max_num_seqs 128 | configuration, not measured throughput | S04 | deployment evidence only | Does not prove tasks/hour under article workload/SLO. |
| gpt-oss fit claim | gpt-oss-120b | single 80GB GPU | MXFP4 | optimized OpenAI reference | unspecified concurrency | model fit/run | S07;S08 | memory claim only | Fit is not throughput, latency or redundancy. |

## Capacity gate
The article calculates the **required** task rate at the price-only break-even. It does not claim the selected hardware achieves it. The workbook requires a measured capacity input before self-hosting passes its capacity feasibility gate.
