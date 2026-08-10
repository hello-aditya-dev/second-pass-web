# CALCULATION LEDGER

Independent reproduction: **2026-08-10**.

## CALC-001 — B300 dense BF16 normalization
HGX system sparse BF16 = 36 PFLOP/s. Dense = 1/2 = 18 PFLOP/s. Eight GPUs:
`18/8 = 2.25 PFLOP/s per GPU-equivalent`.
**PASS**

## CALC-002 — BF16 machine balance
B300:
`2.25e15 / 8e12 = 281.25` FLOP/B.

MI355X:
`2.5e15 / 8e12 = 312.5` FLOP/B.
**PASS**

## CALC-003 — Ideal single-token dense decode
`F≈2P`, `D≈P*b_w`, therefore `I≈2/b_w`.
- BF16 b=2 → 1 FLOP/B
- 8-bit b=1 → 2 FLOP/B
- 4-bit b=0.5 → 4 FLOP/B.
Parameter count cancels.
**PASS**

## CALC-004 — Roofline compute-ceiling fraction at BF16 I=1
B300: `1/281.25 = 0.003555555556 = 0.356%`.
MI355X: `1/312.5 = 0.003200000000 = 0.320%`.
Not measured utilization.
**PASS**

## CALC-005 — BF16 ideal ridge batch
`q*=b_w*I*/2`; with b_w=2, q*=I*.
B300 q*=281.25; first whole q at/above = 282.
MI355X q*=312.5; first whole q at/above = 313.
**PASS**

## CALC-006 — Precision-specific ridge examples
B300 FP8 dense: `(72e15/2/8)/8e12 = 562.5 FLOP/B`.
MI355X OCP-FP8 dense: `5e15/8e12 = 625 FLOP/B`.
B300 FP4 dense: `(108e15/8)/8e12 = 1687.5 FLOP/B`.
MI355X MXFP4: `10.1e15/8e12 = 1262.5 FLOP/B`.
FP4/MXFP4 direct comparison remains **NO**.
**PASS**

## CALC-007 — Prefill GEMM scenario
m=2048, k=n=8192, all payloads 2 bytes.
`F=2mkn=274,877,906,944 FLOP`.
`D=2mk+2kn+2mn=201,326,592 bytes`.
`I=F/D=1365.333333333333 FLOP/B`.
**PASS**

## CALC-008 — Qwen weight payload
P=72.7e9.
BF16: `P*2 = 145.4e9 bytes = 145.4 GB decimal`.
8-bit: 72.7 GB.
4-bit: 36.35 GB.
**PASS**

## CALC-009 — Qwen BF16 theoretical token roofs
HBM:
`8e12 / 145.4e9 = 55.020632737276 tokens/s`.

B300 compute:
`2.25e15 / (2*72.7e9) = 15474.552957359010 tokens/s`.

MI355X compute:
`2.5e15 / (2*72.7e9) = 17193.947730398901 tokens/s`.

Lower simple roof = HBM.
**PASS**

## CALC-010 — HBM efficiency sensitivity
BF16 weight-stream:
- 40% / 3.2 TB/s → 22.008253 tokens/s
- 60% / 4.8 TB/s → 33.012380
- 80% / 6.4 TB/s → 44.016506
- 100% / 8.0 TB/s → 55.020633
All are sensitivity inputs, not measurements.
**PASS**

## CALC-011 — Bounded conventional KV read
`2*80*8*128*8192*2 = 2,684,354,560 bytes = 2.684355 GB/token`.
This assumes conventional full-attention GQA and HBM read; detailed KV analysis is deferred.
**PASS**

## CALC-012 — Cost extension
`C_1M = 1e6*C_h/(3600*T)`.
Workbook leaves C_h=0 by default and labels T theoretical unless replaced by measured goodput.
**PASS**
