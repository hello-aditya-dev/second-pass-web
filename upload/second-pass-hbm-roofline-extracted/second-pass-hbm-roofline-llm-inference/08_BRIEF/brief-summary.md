# SECOND / PASS / BRIEF

## Summary
Peak PFLOPS can stop being the binding specification when an inference workload generates too little arithmetic per HBM byte. Current dense-BF16 peak specifications put normalized NVIDIA B300 machine balance at 281.25 FLOP/byte and AMD MI355X at 312.5. An idealized dense single-token weight stream is only about 1 FLOP/byte at BF16 because the parameter count cancels from 2P/(P×2). Batching moves decode right; prefill can move much farther. The PROOF includes a Qwen2.5-72B case, five figures and a workbook for replacing peak assumptions with company measurements.

## Best visual
`chart-01-inference-roofline.svg`

## Link
**READ / THE HBM ROOFLINE FOR LLM INFERENCE →**
