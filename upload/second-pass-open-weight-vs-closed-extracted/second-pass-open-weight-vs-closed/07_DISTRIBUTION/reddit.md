# Reddit

## Title
I modeled API vs self-hosting with the same AI model

The same-model Mistral Small 4 control gives a $0.0021 managed cost for the illustrative 10k/1k task. One AWS Mumbai 8×H100 Capacity Block costs $27,564.80 for a 730-hour month, so the capacity-only/equal-quality price lines cross at ~13.13M tasks/month.

That is not an operational break-even until capacity is measured. At 80% effective utilization the boundary needs ~22,476 useful tasks/hour.

The second result is algebraic: `N*=F/(r_q*v_c-v_o)`. If the denominator is non-positive, no finite volume makes self-host cheaper per accepted outcome under those assumptions.

[LINK]
