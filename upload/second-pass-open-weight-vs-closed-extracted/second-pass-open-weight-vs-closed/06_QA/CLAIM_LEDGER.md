# CLAIM LEDGER

| id | final claim | type | evidence | confidence | caveat | publication_safe |
|---|---|---|---|---|---|---|
| C01 | Open-weight and Open Source AI are not synonymous under the OSI definition. | FACT/INFERENCE | S01 + model/license sources | high | Open-weight is a deployment term used by this article. | YES |
| C02 | The decision has four useful policy classes. | FRAMEWORK | deployment-policy-reference.csv | high | Product boundaries can blur. | YES |
| C03 | Mistral Small 4 supports a same-model managed-vs-self-host control. | FACT | S02-S05 | high | Behavior need not be identical across deployments. | YES |
| C04 | Mistral Small 4 managed price is $0.15/M input and $0.60/M output. | FACT | S02;S05 | high | Public list price as of 2026-08-10. | YES |
| C05 | Illustrative 10k/1k task costs $0.0021 managed. | CALCULATION | CALC-001 | high | Scenario token counts. | YES |
| C06 | AWS Mumbai p5.48xlarge Capacity Block is $37.76/hour for 8×H100. | FACT | S06 | high | Capacity Block, not on-demand/spot/ownership. | YES |
| C07 | 730 hours costs $27,564.80. | CALCULATION | CALC-002 | high | Accounting-period assumption. | YES |
| C08 | Deployment-only equal-quality price break-even is ~13.13M tasks/month. | CALCULATION/SCENARIO | CALC-003 | high | Conditional on capacity/SLO and excluded ops costs. | YES |
| C09 | At 80% effective utilization the boundary requires ~22,476 useful tasks/hour. | CALCULATION | CALC-005 | high | Required rate, not measured throughput. | YES |
| C10 | $5k/$20k ops scenarios move break-even to ~15.51M/~22.65M. | CALCULATION/SCENARIO | CALC-004 | high | Ops values are illustrative. | YES |
| C11 | Quality-adjusted break-even is F/(r_q*v_c-v_o). | CALCULATION | CALC-006 | high | Consistent CAO definition required. | YES |
| C12 | If the denominator is <=0, no finite volume makes self-host cheaper per accepted outcome. | CALCULATION | CALC-006 | high | Under the stated model. | YES |
| C13 | 40% vs 80% effective utilization doubles normalized fixed cost/useful capacity. | CALCULATION | CALC-008 | high | Fixed-capacity simplification. | YES |
| C14 | gpt-oss-120b has 116.83B total, 5.13B active/token, 60.8 GiB checkpoint; optimized MXFP4 can fit on one 80GB GPU. | FACT/VENDOR CLAIM | S07;S08 | high | Fit is not serving capacity. | YES |
| C15 | Active MoE parameters are not total resident model memory. | INFERENCE | S07;S14 | high | Runtime state also adds memory. | YES |
| C16 | Generic full-context KV arithmetic should not be blindly applied to gpt-oss alternating attention. | FACT/INFERENCE | S14;S15 | high | Engine can further alter cache layout. | YES |
| C17 | Self-hosting is always cheaper at high volume. | OVERBROAD | denominator condition/capacity gates | none | Not established. | NO |
| C18 | The 8×H100 node can serve 13.13M article tasks/month under target SLO. | UNKNOWN | no compatible absolute benchmark | unknown | Must be measured. | NO |
| C19 | Self-hosting is automatically more private or secure. | OVERBROAD | architecture-dependent | low | Security burden shifts. | NO |
| C20 | Public benchmark score equals enterprise acceptance probability. | INVALID ASSUMPTION | methodology | none | P(A) is workload-specific. | NO |
