---
title: "A GB300 NVL72 rack can require up to 142 kW. What can your facility support?"
dek: "A rack purchase is also an electrical, thermal and redundancy decision. We translate NVIDIA's GB300 NVL72 power requirement into racks per megawatt, facility-capacity scenarios and stranded GPU capacity."
slug: "a-142-kw-ai-rack-turns-gpu-procurement-into-a-power-problem"
section: "Compute"
format: "SECOND PASS"
author: "Aditya"
publishedAt: "2026-08-10"
status: "published"
firstPass:
  - "NVIDIA's current GB300 NVL72 Enterprise Reference Architecture says a full rack requires up to 142 kW and contains 72 Blackwell Ultra GPUs."
  - "At that upper planning reference, 1 MW of usable IT power equals 7.04 rack-equivalents, but only 7 whole racks: 504 GPUs before thermal, distribution or other constraints."
  - "Facility-input MW and usable IT MW are not interchangeable. PUE is an energy-efficiency metric; using it to translate facility input into IT capacity is only a labeled planning approximation."
  - "In the illustrative 4 MW facility-input case with PUE 1.20 and a 90% usable-capacity factor, the power model supports 21 racks / 1,512 GPUs. A 24-rack target needs about 4.544 MW of modeled facility input."
  - "If 24 racks were procured against that 21-rack power limit, 3 racks / 216 GPUs would be stranded. Actual rack distribution, cooling and redundancy can reduce usable capacity further."
featured: true
demo: false
tags:
  - "GB300 NVL72"
  - "AI rack power"
  - "AI data center power"
  - "rack density"
  - "data center capacity"
  - "PUE"
  - "AI infrastructure"
hero: ""
heroAlt: ""
adPolicy: "none"
sources:
  - label: "NVIDIA NVL72 AI Factory — System Hardware & Components"
    url: "https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html"
    type: "primary"
    note: "GB300 NVL72 rack configuration, liquid cooling, power shelves and up-to-142-kW requirement."
  - label: "NVIDIA DGX GB Rack Scale Systems User Guide — Hardware"
    url: "https://docs.nvidia.com/dgx/dgxgb200-user-guide/hardware.html"
    type: "primary"
    note: "Rack power-distribution mechanism, liquid-cooling path and broader approximate-120-kW DGX GB statement."
  - label: "ISO/IEC 30134-2:2026"
    url: "https://www.iso.org/standard/30134-2"
    type: "advisory"
    note: "Current PUE standard."
  - label: "ASHRAE Handbook — Data Centers and Telecommunication Facilities"
    url: "https://handbook.ashrae.org/Handbooks/A19/IP/a19_ch20/a19_ch20_ip.aspx"
    type: "advisory"
    note: "PUE formula and interpretation."
  - label: "Eaton UPS sizing guide"
    url: "https://www.eaton.com/us/en-us/products/backup-power-ups-surge-it-power-distribution/backup-power-ups/ups-sizing-guide.html"
    type: "primary"
    note: "N+1 redundancy definition."
  - label: "NIST Guide to the SI — heat-flow conversions"
    url: "https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9"
    type: "advisory"
    note: "Btu/h and refrigeration-ton conversion factors."
changeLog:
  - at: "2026-08-10"
    type: "published"
    note: "Initial publication."
seoTitle: "How many GB300 NVL72 AI racks fit in a megawatt?"
seoDescription: "A source-backed facility-capacity model for NVIDIA GB300 NVL72 racks: 142 kW rack planning reference, PUE, headroom, thermal load, stranded GPUs and additional MW requirements."
---

A GPU order can be approved by finance.

A rack that can require **up to 142 kW** also needs approval from the building.

The electrical system has to deliver that power at the rack. The cooling system has to remove the heat. Redundant equipment still has to survive the failure it was designed for. A site with enough total megawatts can still fail at the hall, busway, rack feed or heat-rejection layer.

Buying the rack and being able to operate the rack are different decisions.

## / QUESTION

**Given the power, thermal capacity and redundancy a facility actually has, how many GB300-class racks can it operate before facility infrastructure becomes the limiting resource?**

The useful answer starts with one discipline: define every capacity number before dividing it.

A megawatt of utility service is not automatically a megawatt of rack power. A PUE number is not a cooling-power percentage. Installed redundant equipment is not necessarily business-usable capacity. And "142 kW" is not a claim that every GB300 rack continuously consumes exactly 142 kW.

Those distinctions determine the rack count.

![The AI rack power chain](/research/142kw-ai-rack/charts/chart-01-rack-power-chain.svg "Conceptual chain from utility/grid through transformer, switchgear, critical power, rack distribution and a GB300 NVL72 rack marked 72 GPUs and up to 142 kW.")

## What NVIDIA actually says about 142 kW

NVIDIA's current [GB300 NVL72 Enterprise Reference Architecture](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/components.html) describes a liquid-cooled rack with 72 Blackwell Ultra GPUs, 36 Grace CPUs, nine NVSwitch trays and eight 33 kW power shelves. Each shelf contains six 5.5 kW PSUs.

Its rack-power wording is specific:

**the full rack requires up to 142 kW.**

The phrase **up to** stays attached to every calculation in this article. We use 142 kW as an upper planning reference. We do not call it typical, average or constant draw.

There is an important source-reconciliation detail. NVIDIA's broader [DGX GB Rack Scale Systems User Guide](https://docs.nvidia.com/dgx/dgxgb200-user-guide/hardware.html), which covers GB200 and GB300 rack systems, says rack power consumption is approximately 120 kW. That guide also describes eight power shelves, busbar distribution and redundant power.

Those documents are not identical in scope. The newer Enterprise Reference Architecture is specifically describing the GB300 NVL72 enterprise design and says **up to 142 kW**. The broader rack guide gives an approximate 120 kW statement across the DGX GB rack family.

For this article, the 142 kW value is the conservative GB300 planning reference. The 120 kW value remains in the research ledger rather than being silently discarded.

That matters because real capacity should eventually use the OEM configuration and measured workload power for the exact rack a company buys.

## The first calculation: one megawatt of usable IT power

Start with the cleanest possible denominator.

Assume the company truly has **1 MW of usable IT electrical capacity** available for these racks.

### / CALCULATION

**QUESTION**

How many full 142 kW racks fit?

**INPUTS**

- usable IT power = 1,000 kW
- rack electrical reference = up to 142 kW
- GPUs/rack = 72

$$
R_{\text{equiv}}
=
\frac{1000}{142}
=
7.042
$$

The power budget contains **7.04 rack-equivalents**.

But a company cannot install 0.04 of a GB300 NVL72 rack.

$$
R_{\text{whole}}
=
\left\lfloor
\frac{1000}{142}
\right\rfloor
=
7
$$

Seven whole racks contain:

$$
G=7\times72=504\text{ GPUs}
$$

So the memorable number is:

**1 MW of usable IT power → 7 whole GB300 NVL72 racks → 504 GPUs**, under the 142 kW upper planning reference and before other site constraints.

The continuous, non-floor metric is about **507 GPU-equivalents per usable IT MW**:

$$
\frac{72\times1000}{142}
=
507.04
$$

That is useful for normalization, but **504 GPUs** is the deployable whole-rack result for one usable IT MW.

The same rack-level allocation is:

$$
\frac{142}{72}
=
1.97\text{ kW per installed GPU}
$$

This is **rack electrical power per installed GPU**. It is not B300 chip TDP. The rack number includes much more than GPU silicon.

![How many racks fit in one MW?](/research/142kw-ai-rack/charts/chart-02-racks-per-mw.svg "Two bars compare seven racks from one megawatt of usable IT power with five racks from one megawatt of facility-input power under PUE 1.20 and 90% usable-capacity factor.")

## / CLAIM CHECK

### "A 1 MW data center can support seven 142 kW AI racks."

**WHAT IS TRUE**

One megawatt of **usable IT power** divided by 142 kW gives 7.04 rack-equivalents and seven whole racks.

**WHAT IS MISSING**

What the facility's 1 MW number measures.

If it means total facility input, the entire megawatt is not automatically available at IT equipment. The site may also reserve headroom. Rack-level distribution or thermal capacity can bind before aggregate IT MW does.

**SECOND / PASS**

Always define which megawatt you are dividing.

## PUE does not turn facility nameplate into exact rack capacity

PUE is frequently used as if it were an engineering derating factor.

That is too loose.

The current [ISO/IEC 30134-2:2026](https://www.iso.org/standard/30134-2) standard defines PUE as a data-center energy-efficiency KPI. [ASHRAE](https://handbook.ashrae.org/Handbooks/A19/IP/a19_ch20/a19_ch20_ip.aspx) gives the familiar operating relationship:

$$
PUE
=
\frac{E_{\text{total facility}}}{E_{\text{IT}}}
$$

ASHRAE also warns that PUE was developed to track operating energy efficiency and is not an exact design-stage capacity tool.

For this publication, PUE is therefore used in two different ways, and they must not be confused.

**Energy accounting:** if a site measures a PUE of 1.20 over an appropriate period, the simplified energy relationship is:

$$
E_{\text{facility}}
=
1.20E_{\text{IT}}
$$

**Planning approximation:** if a company starts only with a facility-input power budget and wants a rough sensitivity model, we may write:

$$
P_{\text{IT}}
\approx
\frac{P_{\text{facility}}}{PUE_p}
$$

where `PUE_p` is explicitly a **planning assumption**, not a guaranteed instantaneous design ratio.

The workbook has a safety rule around this.

If the user selects **FACILITY INPUT MW**, the planning PUE path can be used.

If the user selects **USABLE IT MW**, PUE is **not** applied to rack capacity again.

That prevents one of the easiest mistakes in AI facility planning: taking an IT-capacity number that is already downstream of facility overhead and dividing it by PUE a second time.

## / CLAIM CHECK

### "A PUE of 1.2 means cooling uses 20% of IT power."

**VERDICT**

Incorrect.

PUE 1.2 means total facility energy is 1.2 times measured IT energy under the applicable measurement method. The difference, 0.2 times IT energy, is **non-IT facility overhead** in that simplified relationship.

That overhead can include cooling, pumps, fans, power conversion, lighting, controls and other facility loads.

It is not a cooling-only number.

If someone wants cooling electrical consumption, they need a cooling-specific measurement or model.

## Redundancy is another capacity definition problem

A facility can have installed equipment that it deliberately does not consume as normal load.

[Eaton's official UPS guidance](https://www.eaton.com/us/en-us/products/backup-power-ups-surge-it-power-distribution/backup-power-ups/ups-sizing-guide.html) defines **N+1** in the straightforward way: `N` modules are required to support the load, plus one additional module so the remaining system can carry the critical load if one unit fails.

For identical modules of size `S`, a simple N+1 illustration is:

$$
C_{\text{installed}}=(N+1)S
$$

while normal design load must remain within:

$$
C_{\text{design}}\le NS
$$

The fraction represented by the spare is:

$$
\frac{1}{N+1}
$$

**only for that simplified equal-module topology.**

It is not a universal "data centers lose X percent" rule.

NVIDIA's broader DGX GB guide says its rack power shelves provide N+N redundancy, but we do not convert that generic statement into a numerical facility derating for the 142 kW Enterprise RA. The two NVIDIA documents also carry different rack-power descriptions. The correct site-side redundancy factor depends on the purchased rack configuration and facility topology.

The public model therefore uses a separate factor `h`, defined simply as the fraction of the planning IT capacity the company is prepared to treat as usable after its chosen reserve/headroom policy.

Values such as 1.00, 0.90 and 0.80 are **scenarios**, not standards.

## A four-megawatt planning scenario

Now use a concrete facility-input example.

### / ASSUMPTION

**ILLUSTRATIVE FACILITY**

- facility-input budget assigned to the modeled AI load = 4.0 MW
- planning PUE assumption = 1.20
- usable-capacity factor `h` = 0.90
- rack electrical reference = up to 142 kW
- GPUs/rack = 72
- target/procured racks = 24
- no numerical thermal limit supplied yet
- no public rack acquisition price assumed

Under the simplified planning approximation:

$$
P_{\text{IT,before headroom}}
=
\frac{4.0}{1.20}
=
3.333\text{ MW}
$$

Apply the 90% usable-capacity factor:

$$
P_{\text{IT,usable}}
=
3.333\times0.90
=
3.000\text{ MW}
$$

Whole electrical racks:

$$
R
=
\left\lfloor
\frac{3000}{142}
\right\rfloor
=
21
$$

Powerable GPUs:

$$
G=21\times72=1{,}512
$$

The 21 racks use 2.982 MW of the modeled 3.000 MW usable IT budget at the upper rack reference. The remaining 18 kW is not enough for another rack.

![Facility capacity sensitivity](/research/142kw-ai-rack/charts/chart-03-capacity-sensitivity.svg "Heatmap of whole powerable rack count for a four-megawatt facility input across PUE and usable-capacity factor assumptions.")

This is exactly why rack planning needs a floor function. A spreadsheet that reports 21.13 racks as deployable capacity is not describing physical rack count.

Now ask what the site would need for the 24-rack target.

Target rack IT capacity:

$$
P_{\text{IT,target}}
=
24\times142\text{ kW}
=
3.408\text{ MW}
$$

Under the same planning assumptions:

$$
P_{\text{facility,target}}
\approx
1.20
\times
\frac{3.408}{0.90}
=
4.544\text{ MW}
$$

Compared with the modeled 4.0 MW facility-input budget:

$$
\Delta P=4.544-4.000=0.544\text{ MW}
$$

So this scenario says:

**24 racks need about 0.544 MW more modeled facility-input capacity than the 4 MW allocation provides.**

That is a planning result, not a transformer or UPS design.

## The hall can have megawatts and still fail at the rack

Aggregate capacity does not prove distribution density.

NVIDIA's DGX GB rack guide describes power whips feeding rack power shelves from a remote power panel. Those shelves convert AC power to nominal 50–51 VDC and feed a rack busbar.

That is the rack-side mechanism.

The upstream facility can contain transformers, switchgear, UPS systems, PDUs, RPPs or busways in different topologies. A site may have several megawatts in total while the distribution path to one rack position was never designed for a load near 142 kW.

The article's power chain is therefore intentionally conceptual. It does not prescribe a wiring diagram.

Before using the rack-count equation as procurement authority, the company still has to verify:

- the actual critical/usable power available to the AI hall;
- breaker, feeder and distribution capacity at each planned rack;
- voltage/feed architecture required by the OEM design;
- redundancy and failure-state loading;
- whether maintenance states preserve the required rack capacity.

"Site has 4 MW" is not enough information.

There is another practical distinction hidden inside that sentence: **aggregate capacity and per-rack density are separate constraints**. A hall might have spare megawatts spread across many lower-density rows while lacking a distribution path that can deliver the required power to one rack position. The rack count therefore has two electrical questions: how much usable IT power exists in total, and how much of it can be delivered at each intended rack. The workbook exposes an optional rack-distribution limit for this reason. If the site cannot deliver the rack requirement at a position, aggregate MW cannot repair that local constraint.

That is also why the 4 MW scenario should be read as a capacity model, not a site approval. It answers "how many racks fit inside the modeled electrical budget?" It does not answer whether the switchgear, busway, feeds, protection or maintenance state can actually deliver that budget to 21 simultaneous racks. Those facts belong in the site survey and electrical design.

## 142 kW also becomes approximately 142 kW of heat

Electrical load ultimately becomes heat that the facility has to reject.

If the rack is operating at the modeled 142 kW electrical load, the approximate steady thermal load is also:

**142 kW thermal.**

Using [NIST conversion factors](https://www.nist.gov/pml/special-publication-811/nist-guide-si-appendix-b-conversion-factors/nist-guide-si-appendix-b9):

$$
142{,}000\text{ W}
\approx
484{,}524\text{ Btu}_{\text{IT}}/h
$$

and:

$$
\frac{142{,}000}{3516.853}
\approx
40.38
\text{ refrigeration tons}
$$

These are **thermal-load equivalents**.

They do **not** mean the cooling system consumes 142 kW of electricity.

![Electrical power and thermal load](/research/142kw-ai-rack/charts/chart-05-thermal-or-redundancy.svg "Flow from up-to-142-kilowatt rack electrical reference to 142 kilowatts thermal, roughly 485 thousand Btu per hour and 40.38 refrigeration tons, with a warning that cooling electrical power is not derived.")

NVIDIA documents an important architecture detail here. CPUs and GPUs in the compute trays are cooled through liquid manifolds and cold plates. Other components, including networking and storage devices, are air cooled by fans.

So even the sentence "the rack needs 142 kW of liquid cooling" would be too broad without a more specific thermal design source.

The facility needs to remove the rack's heat through its actual combination of liquid and air-side systems. The available heat-rejection capacity, flow, temperatures, CDU topology, redundancy and ambient heat-rejection equipment have to be checked for the installed design.

The workbook therefore accepts **available heat-rejection capacity in kW thermal** as an optional site input. If the user does not provide it, the model says thermal capacity is **not supplied** rather than inventing a cooling limit.

## Energy is not power

The same 142 kW number can also be converted into energy, but only after adding time.

At the modeled rack load for a 730-hour average month:

$$
E
=
142\text{ kW}
\times730\text{ h}
=
103{,}660\text{ kWh}
$$

or:

**103.66 MWh of IT energy per rack-month.**

If a planning energy estimate uses PUE 1.20:

$$
E_{\text{facility}}
\approx
1.20\times103.66
=
124.392\text{ MWh}
$$

That is an energy estimate.

It is not 124.392 MW.

The workbook keeps kW/MW for power and kWh/MWh for energy in separate outputs. Electricity cost is calculated only after the user supplies a tariff in $/kWh. The public article does not invent a universal power price.

## Stranded GPUs are a facility-capacity output

Suppose the company orders all 24 racks in the four-megawatt scenario.

The planning power limit is 21 racks.

Then:

$$
R_{\text{stranded}}
=
\max(0,24-21)
=
3
$$

With 72 GPUs per rack:

$$
G_{\text{stranded}}
=
72\times3
=
216
$$

The result is:

**3 stranded racks / 216 stranded GPUs.**

![Stranded GPU boundary](/research/142kw-ai-rack/charts/chart-04-stranded-gpus.svg "Line chart showing stranded GPUs remain zero until procurement exceeds a 21-rack facility limit, then rise by 72 GPUs per additional rack.")

"Stranded" here does not mean broken hardware. It means hardware the modeled facility cannot power simultaneously under the stated assumptions.

We do not assign a public dollar value to those GPUs. The rack purchase price is a company-specific workbook input.

If the company enters its acquisition cost `C_rack`, then:

$$
C_{\text{stranded}}
=
R_{\text{stranded}}C_{\text{rack}}
$$

That turns a facility engineering limit into a finance exposure without pretending there is one universal GB300 rack selling price.

## The real rack limit is the minimum across required systems

Electrical capacity is only one boundary.

Conceptually:

$$
R_{\text{usable}}
=
\min(
R_{\text{electrical}},
R_{\text{thermal}},
R_{\text{space}},
R_{\text{network}},
R_{\text{other}}
)
$$

This release calculates electrical capacity and, when the company supplies a thermal number, a thermal limit.

It does not invent space or network capacity.

That is deliberate.

A mathematically neat model is worse than no model if it fills missing engineering inputs with fake certainty.

The facility team should use the workbook to find what is known, then treat missing site data as work to be measured—not as a zero-cost assumption.

## What to measure before ordering the next rack

The procurement sequence should be:

**1. Define the MW number.**
Is it utility/facility input, critical IT capacity, usable IT capacity or rack-distribution capacity?

**2. Establish the rack reference.**
Use the exact OEM configuration and its power wording. "Up to" is not "always."

**3. Verify rack-level distribution.**
Confirm the actual feed, busway/PDU/RPP, protection and failure-state capacity at each planned rack.

**4. Decide the redundancy/headroom rule.**
Do not borrow a universal percentage. Model the actual topology or use an explicit planning factor.

**5. Verify heat rejection.**
Confirm the thermal capacity and liquid/air architecture for the target racks.

**6. Calculate whole powerable racks.**
Use floor(), not rack-equivalents.

**7. Compare capacity with procured and target racks.**

**8. Calculate stranded racks and GPUs.**

**9. Calculate additional capacity in the same MW definition used at the input.**

**10. Only then finalize the next accelerator order.**

The companion workbook follows this sequence and contains an explicit protection against double-applying PUE.

## The second pass

The important GB300 NVL72 specification is not just 72 GPUs.

It is the combination of **72 GPUs and a full-rack requirement of up to 142 kW**.

At that upper planning reference, one usable IT megawatt fits seven whole racks. A site-level megawatt can support fewer because facility overhead, reserve and rack distribution sit between the utility meter and the GPU.

A four-megawatt facility-input scenario can become three megawatts of modeled usable IT capacity after a PUE 1.20 planning assumption and 90% usable-capacity factor. That supports 21 whole racks, not 24.

If 24 arrive first, 216 GPUs are stranded in the model.

Cooling can become the lower limit instead. So can rack-level distribution.

The procurement question is therefore not:

**Can we buy another rack?**

It is:

> **Can every required facility system support another rack—at the same time, in the failure state we designed for, with its heat removed?**

Once the answer is measured, GPU procurement becomes a capacity decision instead of a hardware count.

---

## / INTELLIGENCE

Planning an AI rack deployment or data-center capacity expansion?

SECOND / PASS runs source-backed infrastructure research sprints that apply this capacity model to a specific rack, site and deployment schedule.

**START A RESEARCH BRIEF →**
