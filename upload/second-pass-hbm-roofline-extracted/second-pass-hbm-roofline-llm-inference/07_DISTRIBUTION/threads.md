# Threads

A GPU can only use its arithmetic after the data arrives.

For dense BF16 peak specs:
B300 needs ~281 FLOPs per HBM byte to reach its compute roof.
MI355X needs ~313.

A simple single-token dense weight stream gives ~1 FLOP/byte.

So the first bottleneck can be HBM, not PFLOPS.

That changes with batch and prefill—which is exactly why “LLM inference is memory-bound” is too broad.

[LINK]
