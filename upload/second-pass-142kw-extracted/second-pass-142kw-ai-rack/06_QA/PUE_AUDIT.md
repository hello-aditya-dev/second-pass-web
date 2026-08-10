# PUE AUDIT

Status: **PASS**

## Definition
PUE is treated as an energy-efficiency KPI, with the authoritative relationship `total facility energy / IT equipment energy`.

## Uses in package

1. **Energy estimate:** IT energy × planning/observed PUE → facility energy estimate. Appropriate as a simplified relationship under stated measurement assumptions.
2. **Facility-input capacity scenario:** facility-input MW / planning PUE × h → modeled usable IT MW. This is explicitly labeled a **planning approximation**, not exact instantaneous design engineering.
3. **USABLE IT MW workbook input:** PUE is NOT applied to rack-capacity normalization again.

## Prohibited errors checked

- PUE applied twice: **NO**
- PUE called an instantaneous design guarantee: **NO**
- PUE overhead called cooling-only power: **NO**
- PUE 1.20 interpreted as cooling=20% of IT: **NO**
- time/measurement caveat omitted: **NO**

ASHRAE's design-stage caution is included in the article.

**PASS**
