# FACT CHECK

Factual freeze: **2026-08-10 — PASS.** NVIDIA, ISO, ASHRAE, Eaton and NIST load-bearing sources were re-opened after the editorial/workbook/chart passes; no load-bearing fact changed.

## SOURCE QA — PASS
Primary/authoritative sources are used for every load-bearing current technical fact.

## FACTUAL QA — PASS
- GB300 NVL72 = 72 Blackwell Ultra GPUs: verified.
- full rack requiring **up to 142 kW**: verified.
- liquid-cooled rack; eight 33 kW shelves, six 5.5 kW PSUs/shelf: verified.
- rack-side busbar/power-shelf mechanism: verified in broader DGX GB guide.
- source discrepancy (~120 kW broader guide vs up-to-142 kW specific Enterprise RA) recorded.
- PUE definition/current standard: verified.
- N+1 concept: verified.
- thermal conversion constants: verified.

## UNIT AUDIT — PASS
See `UNIT_AUDIT.md`.

## PUE AUDIT — PASS
See `PUE_AUDIT.md`.

## REDUNDANCY AUDIT — PASS
See `REDUNDANCY_AUDIT.md`.

## THERMAL AUDIT — PASS
See `THERMAL_AUDIT.md`.

## ADVERSARIAL ENGINEERING REVIEW

### NVIDIA rack engineer
Objection: “142 kW is an upper requirement, not continuous measured consumption.”  
**Fixed:** `up to` preserved throughout.

Objection: “NVIDIA documents another ~120 kW rack statement.”  
**Fixed:** source discrepancy is explicitly reconciled by scope; not hidden.

### Data-center electrical engineer
Objection: “Facility MW does not prove rack-feed density.”  
**Fixed:** article and Figure 01 require rack-distribution verification and call the chain conceptual.

Objection: “PUE is not a single-line design calculation.”  
**Fixed:** planning approximation only; workbook supports direct USABLE IT MW input.

### Mechanical/cooling engineer
Objection: “142 kW heat does not mean 142 kW chiller electricity or 142 kW entirely on liquid.”  
**Fixed:** both conflations prohibited; NVIDIA air/liquid split is noted.

### Colo operator
Objection: “Nameplate service capacity may not equal tenant/critical/usable capacity.”  
**Fixed:** MW input definition is the first decision step.

### Utility engineer
Objection: “MW and MWh are being mixed.”  
**Result:** no unit mixing found.

### AI-cloud CFO
Objection: “What if procured racks cannot be operated?”  
**Answer:** stranded racks/GPUs and optional company rack cost are explicit outputs; no public rack price invented.

### Reliability engineer
Objection: “N+1 is topology-dependent.”  
**Fixed:** equal-module formula is only illustrative; no universal reserve percentage.

### GPU procurement lead
Objection: “Does 4 MW mean I can order 28 racks?”  
**Answer:** no; main scenario gives 21 whole racks under explicit PUE/h assumptions and still requires rack-distribution/thermal verification.

## CALCULATION QA
Every load-bearing figure independently reproduced in `CALCULATION_LEDGER.md`.

**PASS**


## CROSS-ASSET NUMBER AUDIT — PASS

The following values were matched across article, FIRST PASS, CSVs, chart data, workbook defaults, BRIEF and distribution copy where used:

- rack reference: **up to 142 kW**
- GPUs/rack: **72**
- 1 MW usable IT: **7.04 rack-equivalents / 7 whole racks / 504 GPUs**
- 4 MW / PUE 1.20 / h 0.90: **3.0 MW usable IT / 21 racks / 1,512 GPUs**
- 24-rack target: **3.408 MW IT / 4.544 MW modeled facility input / +0.544 MW**
- stranded result: **3 racks / 216 GPUs**
- one-rack 730 h IT energy: **103.66 MWh**
- 142 kW thermal equivalents: **484,524 Btu_IT/h / 40.38 refrigeration tons**

No conflicting central value was found.

## SENIOR EDITORIAL + PROOFREADING — PASS

Final body: **2862 words**.
Grammar, spelling, punctuation, headings, terminology, source names, NVIDIA model names, dates, units, equations, links, captions and metadata were checked separately after factual/calculation QA.
