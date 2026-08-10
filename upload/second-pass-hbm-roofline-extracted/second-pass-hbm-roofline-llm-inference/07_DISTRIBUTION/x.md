# X

1/ A GPU's PFLOPS number is only useful if the workload can feed it.

Current dense BF16 peak machine balance:
B300: 281.25 FLOP/B
MI355X: 312.5 FLOP/B

2/ Dense single-token weight-stream model:

F≈2P
D≈P·b

So:

I≈2/b

Parameter count cancels.

BF16 → 1 FLOP/B.

3/ 1 FLOP/B is far left of a 281–313 FLOP/B BF16 ridge.

That does NOT mean “FLOPs don't matter.”

It means HBM is the tighter simple Roofline resource in this regime.

4/ Batch changes it.

I≈2q/b.

At BF16, I≈q.

Ideal q*:
B300 281.25
MI355X 312.5

Not recommended production batch sizes—just theoretical ridge thresholds.

5/ Prefill is different.

One illustrative BF16 2048×8192×8192 GEMM gives ~1,365 FLOP/B under a simple one-pass traffic model.

Same model. Different phase. Different side of Roofline.

[LINK]
