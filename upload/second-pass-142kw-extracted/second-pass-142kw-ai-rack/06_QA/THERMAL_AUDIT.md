# THERMAL AUDIT

Status: **PASS**

## Verified architecture statements
NVIDIA documents:
- GB300 NVL72 as liquid cooled in the Enterprise RA.
- DGX GB compute CPUs/GPUs cooled by liquid manifolds and cold plates.
- other components such as networking/storage include air cooling.

## Thermal equivalence
At a modeled 142 kW rack electrical load:
- approximate heat load: 142 kW thermal
- 484,524 Btu_IT/h
- 40.38 refrigeration tons equivalent.

## Checks
- rack electrical power equated to cooling electrical power: **NO**
- PUE non-IT overhead labeled cooling: **NO**
- all 142 kW claimed to enter only the liquid loop: **NO**
- thermal capacity fabricated when site input absent: **NO**
- NIST unit constants used: **YES**

Cooling-system electrical consumption would require a separate design/efficiency model and is intentionally not calculated.

**PASS**
