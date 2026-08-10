# Editorial Decision

## Final headline
**A GB300 NVL72 rack can require up to 142 kW. What can your facility support?**

The working headline was directionally useful but risked turning NVIDIA's **up to 142 kW** requirement into a constant-load statement. The final headline preserves the source qualifier.

## Flagship treatment
**FEATURED: YES**

Reason: the piece is not a hardware announcement. It contributes a reproducible rack→facility capacity model, a PUE misuse correction, whole-rack floor handling, headroom sensitivity, thermal equivalence, stranded-GPU math, an input workbook and explicit source reconciliation.

## Central finding
A rack procurement decision can become constrained by facility delivery and heat rejection before accelerator budget. The correct quantity is not “site MW / rack kW” until the site MW has been defined and normalized consistently.

## Current hardware reference
The current GB300 NVL72 Enterprise RA says:
- 72 Blackwell Ultra GPUs;
- liquid-cooled rack;
- 8×33 kW power shelves, six 5.5 kW PSUs each;
- full rack requiring **up to 142 kW**.

A broader DGX GB rack-scale guide states approximately 120 kW. The package records this discrepancy and uses the newer/specific GB300 142 kW figure as a conservative planning reference, without treating it as constant draw.

## Main scenario
4 MW facility input / PUE 1.20 planning assumption / h=0.90:
- usable IT: 3.000 MW
- powerable racks: 21
- GPUs: 1,512
- 24-rack target facility-input requirement: 4.544 MW
- incremental requirement: 0.544 MW
- if 24 racks procured first: 3 stranded racks / 216 GPUs.

## Explicit non-conclusions
- 142 kW is not called average/typical.
- PUE is not treated as cooling power.
- PUE is not presented as exact instantaneous electrical design.
- N+1 is not converted into a universal reserve percentage.
- 142 kW thermal load is not cooling-system electrical power.
- no public GB300 acquisition price is invented.
- no claim that aggregate facility MW proves per-rack power distribution.
