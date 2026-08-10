# Reddit

## Title
NVIDIA's GB300 rack can require up to 142 kW. I modeled what that does to facility capacity.

## Body
The first mistake is dividing any site MW number by 142 kW.

You have to know whether that MW means facility input or usable IT power.

Using the clean case:
**1 MW usable IT / 142 kW = 7.04 rack-equivalents → 7 whole racks → 504 GPUs.**

Then an illustrative facility case:
- 4 MW facility input
- planning PUE 1.20
- 90% usable-capacity factor

gives:
- 3.0 MW modeled usable IT
- 21 whole racks
- 1,512 GPUs

If 24 racks are procured, the model strands 3 racks / 216 GPUs. A 24-rack target needs about 4.544 MW of facility input under the same assumptions.

The article also separates:
- PUE from cooling power
- N+1 from fake universal reserve percentages
- rack electrical load from cooling electrical consumption
- aggregate MW from rack-distribution density

Workbook + CSVs included.

[LINK]
