# Chart Specifications

Visual system:
- Paper `#F2EFE7`
- Ink `#11110F`
- Graphite `#5A5953`
- Rule `#C9C3B7`
- Signal Blue `#2F5BFF`

No gradients, stock data-center imagery, glowing GPUs, sustainability icons or decorative server renders.

## Figure 01 — The AI rack power chain

**figure_id:** `chart-01-rack-power-chain`  
**decision question:** Where can electrical capacity bind before it reaches the GPUs?  
**title:** THE AI RACK POWER CHAIN  
**data:** `data/chart-01-rack-power-chain.csv`  
**unit:** conceptual stages + rack kW  
**source basis:** NVIDIA S01/S04 for rack-side power distribution; upstream facility chain is explicitly topology-dependent.  
**classification:** FACT + conceptual mechanism  
**assumptions:** no claim that every facility uses every illustrated stage.  
**main takeaway:** a site-level MW number is not automatically deliverable at a 142 kW rack position.  
**caveat:** actual breaker, transformer, UPS, PDU/RPP/busway and feed topology requires the site's electrical design.  
**alt text:** Conceptual chain from utility/grid through transformer, switchgear, critical power, rack distribution and a GB300 NVL72 rack marked 72 GPUs and up to 142 kW.  
**caption:** A rack is downstream of multiple electrical capacity limits. NVIDIA documents rack-side power shelves and a DC busbar, but facility topology remains site-specific.  
**mobile:** stack vertically; do not shrink labels below readable size.

## Figure 02 — How many racks fit in one MW?

**figure_id:** `chart-02-racks-per-mw`  
**decision question:** Why must a company define what its MW number measures?  
**title:** ONE MEGAWATT OF WHAT?  
**data:** `data/chart-02-racks-per-mw.csv`  
**unit:** whole racks and GPUs  
**source basis:** 142 kW/rack and 72 GPUs/rack from NVIDIA S01; PUE/headroom case is scenario math.  
**classification:** CALCULATION + SCENARIO  
**assumptions:** second bar uses 1 MW facility input, PUE 1.20, h=0.90.  
**main takeaway:** 1 MW usable IT supports 7 whole racks/504 GPUs; the illustrative facility-input case supports 5 whole racks/360 GPUs.  
**caveat:** electrical rack count can be reduced further by rack-distribution, thermal, network or other site constraints.  
**alt text:** Two bars compare seven racks from one megawatt of usable IT power with five racks from one megawatt of facility-input power under PUE 1.20 and 90% usable-capacity factor.  
**caption:** Do not divide a facility service MW by rack kW unless that MW already represents usable IT capacity.  
**mobile:** full-width; keep assumption label attached to second bar.

## Figure 03 — Facility capacity surface

**figure_id:** `chart-03-capacity-sensitivity`  
**decision question:** How do planning PUE and reserved usable capacity move rack count?  
**title:** 4 MW FACILITY-INPUT CAPACITY SURFACE  
**data:** `data/chart-03-capacity-sensitivity.csv`  
**unit:** whole racks  
**source basis:** 142 kW NVIDIA rack reference; all PUE/h values are scenarios.  
**classification:** SCENARIO / CALCULATION  
**assumptions:** facility input = 4 MW; PUE 1.10–1.40; h 0.80–1.00.  
**main takeaway:** floor effects and reserve assumptions materially change the number of whole racks a fixed service can support.  
**caveat:** PUE is used only as a planning approximation, not a substitute for design-stage electrical analysis.  
**alt text:** Heatmap of whole powerable rack count for a four-megawatt facility input across PUE and usable-capacity factor assumptions.  
**caption:** The same four-megawatt facility-input number can produce different rack counts depending on how facility overhead and headroom are modeled.  
**mobile:** internal horizontal scroll allowed; caption stays outside scroll.

## Figure 04 — Stranded GPU boundary

**figure_id:** `chart-04-stranded-gpus`  
**decision question:** What happens if accelerator racks are procured faster than facility capacity?  
**title:** BUY RACKS FASTER THAN THE FACILITY, STRAND GPUs  
**data:** `data/chart-04-stranded-gpus.csv`  
**unit:** GPUs  
**source basis:** 72 GPUs/rack from NVIDIA S01; 21-rack power limit from the 4 MW/PUE1.20/h0.90 scenario.  
**classification:** SCENARIO / CALCULATION  
**assumptions:** power-only facility limit; thermal/rack-distribution constraints not numerically supplied.  
**main takeaway:** with 24 racks procured against a 21-rack power limit, 3 racks / 216 GPUs are stranded.  
**caveat:** no public rack price is assigned; stranded capital remains a company input.  
**alt text:** Line chart showing stranded GPUs remain zero until procurement exceeds a 21-rack facility limit, then rise by 72 GPUs per additional rack.  
**caption:** Facility capacity can convert a procurement count into unusable accelerator capacity before a single GPU benchmark matters.  
**mobile:** full-width.

## Figure 05 — Electrical power vs thermal load

**figure_id:** `chart-05-thermal-or-redundancy`  
**decision question:** What heat-rejection requirement follows from the rack electrical load—and what does not?  
**title:** 142 kW ELECTRICAL LOAD BECOMES A THERMAL-REJECTION PROBLEM  
**data:** `data/chart-05-thermal-or-redundancy.csv`  
**unit:** kW thermal / Btu_IT/h / refrigeration tons  
**source basis:** 142 kW NVIDIA reference; NIST S08 conversion constants.  
**classification:** FACT + CALCULATION  
**assumptions:** steady modeled rack electrical load; approximate equivalence of consumed IT electrical power to heat that must eventually be removed.  
**main takeaway:** 142 kW corresponds to about 484,524 Btu_IT/h or 40.38 refrigeration tons of thermal load.  
**caveat:** this is heat load, not cooling-system electrical input; NVIDIA documents both liquid-cooled compute components and air-cooled other components.  
**alt text:** Flow from up-to-142-kilowatt rack electrical reference to 142 kilowatts thermal, roughly 485 thousand Btu per hour and 40.38 refrigeration tons, with a warning that cooling electrical power is not derived.  
**caption:** Rack IT power and heat rejection are approximately paired at steady load; cooling electricity is a separate engineering quantity.  
**mobile:** stack the four conversion boxes vertically.
