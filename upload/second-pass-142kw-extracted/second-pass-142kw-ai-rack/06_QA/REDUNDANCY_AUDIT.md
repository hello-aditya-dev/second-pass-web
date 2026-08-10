# REDUNDANCY AUDIT

Status: **PASS**

## N+1 definition
Eaton source: N is the number of units/modules required to support the load; N+1 adds one module so the critical load remains supported after one unit fails.

## Package model
For equal modules:
- installed: `(N+x)S`
- design load: `<=NS`
- simplified installed reserve fraction: `x/(N+x)`.

## Checks

- universal redundancy percentage invented: **NO**
- “N+1 = lose 20%” statement: **NO**
- installed capacity confused with normal usable load: **NO**
- equal-module assumption hidden: **NO**
- redundancy applied twice: **NO**
- NVIDIA generic rack-level N+N statement converted into a 142 kW facility derating: **NO**

The main rack-capacity model uses a user-defined `h` factor. The REDUNDANCY worksheet is deliberately informational and not automatically linked to `h`.

**PASS**
