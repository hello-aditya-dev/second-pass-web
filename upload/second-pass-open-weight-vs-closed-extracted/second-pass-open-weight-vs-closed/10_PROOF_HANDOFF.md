# PROOF HANDOFF — The open-weight vs closed-model break-even equation

Managed: `CAO_c=v_c/a_c`

Self-host: `CAO_o=(F/N+v_o)/a_o`

Set equal:

`F/N+v_o=(a_o/a_c)v_c`

Let `r_q=a_o/a_c`:

`N*=F/(r_q*v_c-v_o)`

Finite iff `r_q*v_c-v_o>0`.

## Same-model special case
If `r_q=1` as a simplifying control:

`N*=F/(v_c-v_o)`

provided `v_c>v_o`.

## Constraints
`J_feasible={j:F_j(x)=1}`

Only feasible policies enter the CAO comparison.

## Hybrid
For local fraction `r`, model weighted variable cost and weighted acceptance while preserving any self-host fixed capacity actually committed.

## Methodological warning
Do not count the same quality loss both as an explicit failure-loss dollar and again as an undefined acceptance penalty. State which objective is being used.

See `03_RESEARCH/same-model-control.csv` and `06_QA/CALCULATION_LEDGER.md`.
