# LinkedIn — Personal

A company can approve a GPU purchase before its building can operate the GPUs.

NVIDIA's current GB300 NVL72 Enterprise Reference Architecture says a full rack requires **up to 142 kW** and contains 72 Blackwell Ultra GPUs.

I built a SECOND / PASS facility-capacity model around that number.

The clean reference:

**1 MW of usable IT power → 7 whole racks → 504 GPUs.**

But a site-level megawatt may be facility input, not usable IT.

Illustrative facility scenario:
- 4 MW facility input
- PUE 1.20 planning assumption
- 90% usable-capacity factor

Result:
- 3.0 MW modeled usable IT
- 21 whole racks
- 1,512 GPUs

A 24-rack target needs about 4.544 MW of modeled facility input under the same assumptions.

If the 24 racks arrive first, the model strands 3 racks / 216 GPUs.

The research also checks the things that usually get blurred:
PUE is not cooling power.
N+1 is topology-dependent.
142 kW thermal load is not 142 kW of cooling electricity.
Aggregate site MW does not prove 142 kW can reach each rack position.

The package includes primary sources, equations, five figures, CSVs and a formula-driven facility workbook.

[LINK]
