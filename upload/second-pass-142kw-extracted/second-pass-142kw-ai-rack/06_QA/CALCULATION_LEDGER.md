# CALCULATION LEDGER

All original calculations independently recomputed on **2026-08-10**.

## CALC-001 — Rack equivalents and whole racks per usable IT MW

Inputs:
- usable IT power = 1000 kW
- rack reference = 142 kW/rack

`1000 / 142 = 7.042253521127` rack-equivalents.

Whole racks:

`floor(1000/142) = 7`.

Whole-rack GPUs:

`7 × 72 = 504` GPUs.

**PASS**

## CALC-002 — GPU normalization

Continuous GPU-equivalents/MW:

`72 × 1000 / 142 = 507.042253521127`.

Rack electrical allocation per installed GPU:

`142 / 72 = 1.972222222222 kW/GPU`.

Caveat: not GPU TDP.

**PASS**

## CALC-003 — Main 4 MW facility-input scenario

Scenario:
- facility input = 4.0 MW
- PUE planning assumption = 1.20
- h = 0.90

IT before headroom:

`4.0 / 1.20 = 3.333333333333 MW`.

Usable IT:

`4.0 / 1.20 × 0.90 = 3.000000000000 MW`.

Whole racks:

`floor(3000/142) = 21`.

GPUs:

`21 × 72 = 1512`.

Floor remainder:

`3000 - 21×142 = 18 kW`.

**PASS**

## CALC-004 — Facility capacity required for 24 target racks

Target IT:

`24 × 142 / 1000 = 3.408 MW`.

Planning facility input:

`1.20 × 3.408 / 0.90 = 4.544 MW`.

Additional vs 4.0 MW:

`4.544 - 4.0 = 0.544 MW`.

**PASS**

## CALC-005 — Stranded capacity

`max(0,24-21) = 3` racks.

`3 × 72 = 216` GPUs.

No acquisition dollar value is assigned without company input.

**PASS**

## CALC-006 — Thermal conversions

NIST:
- 1 Btu_IT/h = 0.2930711 W
- 1 refrigeration ton = 3516.853 W.

Btu/h:

`142000 / 0.2930711 = 484524.06259095494 Btu_IT/h`.

Refrigeration tons:

`142000 / 3516.853 = 40.377007512114`.

Published: **484,524 Btu_IT/h** and **40.38 refrigeration tons**.

**PASS**

## CALC-007 — Monthly energy

One rack:
`142 kW × 730 h = 103,660 kWh = 103.660 MWh`.

PUE 1.20 planning energy:
`103.660 × 1.20 = 124.392 MWh facility energy`.

No MW/MWh substitution.

**PASS**

## CALC-008 — PUE sensitivity

4 MW facility input, h=0.90:
- PUE 1.10 → 23 racks
- PUE 1.20 → 21 racks
- PUE 1.30 → 19 racks
- PUE 1.40 → 18 racks.

Source CSV: `03_RESEARCH/pue-sensitivity.csv`.

**PASS**

## CALC-009 — Headroom sensitivity

4 MW facility input, PUE 1.20:
- h=1.00 → 23 racks
- h=0.90 → 21 racks
- h=0.80 → 18 racks.

Source CSV: `03_RESEARCH/headroom-sensitivity.csv`.

**PASS**

## CALC-010 — N+x equal-module illustration

For module size S, required modules N and x spare modules:

`C_installed=(N+x)S`

`C_design<=NS`

Simplified reserve fraction vs installed:

`x/(N+x)`

This is not applied automatically to the main h factor.

**PASS**
