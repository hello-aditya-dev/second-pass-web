# CLAIM LEDGER

| id | claim | class | source / derivation | confidence | caveat | publication_safe |
|---|---|---|---|---|---|---|
| C01 | GB300 NVL72 Enterprise RA uses 72 Blackwell Ultra GPUs. | FACT | S01/S02/S03 | high | Exact configuration source. | YES |
| C02 | Current Enterprise RA says full rack requiring up to 142 kW. | FACT | S01 | high | “up to” must remain attached. | YES |
| C03 | GB300 rack is liquid cooled; current RA lists 8×33 kW power shelves with six 5.5 kW PSUs each. | FACT | S01 | high | Does not define entire facility topology. | YES |
| C04 | DGX GB rack guide describes power whips → power shelves → nominal 50–51 VDC busbar and redundant power. | FACT | S04 | high | Broader GB200/GB300 guide. | YES |
| C05 | Broader DGX GB guide says approximately 120 kW rack consumption. | FACT | S04 | high | Scope differs from specific Enterprise RA; not used in core math. | YES |
| C06 | 1 MW usable IT / 142 kW = 7.042 rack-equivalents; floor = 7 racks = 504 GPUs. | CALCULATION | CALC-001 | high | Electrical reference only. | YES |
| C07 | 507.04 GPU-equivalents per usable IT MW is continuous normalization; 504 GPUs is the whole-rack 1 MW result. | CALCULATION | CALC-002 | high | Do not publish 507 as whole deployable GPUs. | YES |
| C08 | PUE is total facility energy divided by IT/datacom equipment energy. | FACT | S05/S06 | high | Measurement boundaries/time basis matter. | YES |
| C09 | PUE is used as a planning capacity approximation only when input is facility-input MW. | ASSUMPTION/METHOD | package model | high | Not exact design-stage engineering. | YES |
| C10 | PUE 1.20 does not mean cooling uses 20% of IT power. | FACT/INFERENCE | S06 | high | 0.2×IT is total non-IT overhead in the simplified relationship. | YES |
| C11 | N+1 means N units support the load plus one spare unit in the cited UPS model. | FACT | S07 | high | Do not universalize to all facility topologies. | YES |
| C12 | 4 MW /1.20 ×0.90 = 3.0 MW modeled usable IT. | SCENARIO/CALCULATION | CALC-003 | high arithmetic | PUE/h are scenario inputs. | YES |
| C13 | 3.0 MW supports floor(3000/142)=21 racks = 1,512 GPUs. | SCENARIO/CALCULATION | CALC-003 | high arithmetic | Other constraints can reduce. | YES |
| C14 | 24 racks require 3.408 MW IT and ~4.544 MW facility input under same PUE/h scenario. | SCENARIO/CALCULATION | CALC-004 | high arithmetic | Planning approximation. | YES |
| C15 | 24 procured vs 21 powerable = 3 stranded racks = 216 GPUs. | SCENARIO/CALCULATION | CALC-005 | high arithmetic | “Stranded” means not simultaneously powerable in model. | YES |
| C16 | 142 kW modeled IT electrical load is approximately 142 kW thermal load at steady operation. | ENGINEERING APPROXIMATION | energy conservation + S08 conversions | high | Does not say all heat enters one cooling loop. | YES |
| C17 | 142 kW = ~484,524 Btu_IT/h = 40.38 refrigeration tons thermal equivalent. | CALCULATION | S08 / CALC-006 | high | Not cooling electrical input. | YES |
| C18 | NVIDIA says CPUs/GPUs use liquid cold plates/manifolds while other components include air cooling. | FACT | S04 | high | Exact facility heat-rejection path is site/OEM specific. | YES |
| C19 | A facility with sufficient aggregate MW automatically supports 142 kW at each rack position. | UNKNOWN/OVERBROAD | none | low | Rack-level distribution must be verified. | NO |
| C20 | Every GB300 NVL72 continuously draws 142 kW. | FALSE/OVERBROAD | S01 wording | high | Source says up to. | NO |
| C21 | PUE 1.20 means cooling electrical power = 0.20×IT. | FALSE | S06 | high | Non-IT overhead includes more than cooling. | NO |
| C22 | N+1 always reserves 20% of installed capacity. | FALSE/OVERBROAD | S07 + topology math | high | Fraction depends on N/module topology. | NO |
| C23 | A 142 kW rack requires 142 kW of cooling-system electricity. | FALSE | thermal model | high | Confuses heat load with cooling electrical input. | NO |
| C24 | Public GB300 rack price used for stranded capital. | UNKNOWN | none | none | Company input only. | NO |
