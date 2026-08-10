# CALCULATION LEDGER

## CALC-001 — Mistral Small 4 managed cost/task
Inputs: 10,000 input; 1,000 output; $0.15/M input; $0.60/M output.  
Formula: `10000/1e6*0.15 + 1000/1e6*0.60`  
Result: **$0.0021/task**.  
Source: S02.  
Independent reproduction: PASS.

## CALC-002 — AWS capacity month
Inputs: p5.48xlarge Mumbai Capacity Block $37.76/hour; 730-hour accounting month.  
Formula: `37.76*730`  
Result: **$27,564.80/month**.  
Source: S06.  
Caveat: reservation/capacity price, not full TCO.  
Independent reproduction: PASS.

## CALC-003 — Same-model deployment-only break-even
Equal-acceptance simplifying control; other self-host variable cost and engineering/ops = 0.

`N* = F/(v_c-v_o)`

`= 27,564.80/(0.0021-0)`

Result: **13,126,095 tasks/month = 13.13M**.  
Condition: finite because `v_c>v_o`.  
Capacity/SLO feasibility remains a separate gate.  
Independent reproduction: PASS.

## CALC-004 — Engineering/ops sensitivity
- $0/month: **13.13M tasks/month**
- $5,000/month: **15.51M**
- $20,000/month: **22.65M**

Engineering values are SCENARIOS, not salary estimates.

## CALC-005 — Required useful task rate
Inputs: 13,126,095 tasks; 730 hours; 80% effective utilization.  
Formula: `N*/(730*0.8)`  
Result: **22,476 useful tasks/hour = 6.24 tasks/second**.  
Type: required rate, NOT measured throughput.  
Independent reproduction: PASS.

## CALC-006 — Quality-adjusted break-even
Managed: `CAO_c=v_c/a_c`  
Self-host: `CAO_o=(F/N+v_o)/a_o`

Let `r_q=a_o/a_c`.

Result:

`N*=F/(r_q*v_c-v_o)`

Finite iff:

`r_q*v_c-v_o>0`

Independent algebra check: PASS.

## CALC-007 — Quality-frontier illustration
Scenario:
- F=$27,564.80/month
- v_c=$0.0021/task
- v_o=$0.0010/task

No finite break-even when:

`r_q <= 0.0010/0.0021 = 0.476190...`

Published threshold: **r_q <= 0.476**.

Acceptance ratios and v_o are scenario inputs.

## CALC-008 — Utilization sensitivity
`C_fixed/task=F/(uQ)`

Relative to 80%:
- 20% = **4.00×**
- 40% = **2.00×**
- 60% = **1.33×**
- 80% = **1.00×**
- 100% = **0.80×**

Independent reproduction: PASS.

## CALC-009 — Weight memory
Conceptual only: `M_weights≈Pb/8`.

Official checkpoint sizes are preferred for practical discussion.

## CALC-010 — KV framework
Generic conventional/GQA approximation:

`M_KV≈2*L*n_kv*d_h*S*B*b_e`

Not numerically applied to gpt-oss-120b because its official configuration alternates full and sliding attention. A naive all-layer full-context calculation would create false precision.

## Chart values
All five chart source CSVs reproduce the ledger values. PASS.
