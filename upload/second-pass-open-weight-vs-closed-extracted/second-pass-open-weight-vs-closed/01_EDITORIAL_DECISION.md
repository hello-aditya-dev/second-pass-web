# Editorial Decision

## Central contribution
The strongest first release is a **constraint-first, quality-adjusted deployment break-even** with a same-model control.

Mistral Small 4 keeps the named model constant across a managed API and downloadable weights. This reduces model-quality confounding without pretending the two serving configurations are identical.

## Strongest result
The simple capacity-price boundary is about **13.13M illustrative tasks/month**, but the article refuses to call that an operational self-hosting break-even until the capacity/SLO is measured. At 80% effective utilization, the price boundary requires about **22,476 useful tasks/hour**.

The formal quality-adjusted model adds the more general result:

`N*=F/(r_q*v_c-v_o)`

with no finite break-even if the denominator is non-positive.

## Editorial choice
No provider winner is declared. Closed managed, managed open weight, self-hosted and hybrid remain valid outputs after hard constraints and workload measurements.

## Deferred
No model leaderboard, no invented throughput, no on-premises TCO, no legal advice, no security compliance recommendation, no Monte Carlo.
