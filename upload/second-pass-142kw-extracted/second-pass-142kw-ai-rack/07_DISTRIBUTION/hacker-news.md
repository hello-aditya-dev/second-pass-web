# Hacker News

## Title options
1. How many 142 kW AI racks fit in a megawatt?
2. What a 142 kW AI rack does to data-center capacity planning
3. A GB300 NVL72 rack can require up to 142 kW

## Suggested submission title
**How many 142 kW AI racks fit in a megawatt?**

## Optional first comment
I wanted to turn NVIDIA's current GB300 NVL72 rack power requirement into a facility-capacity model instead of writing another “AI uses more power” post.

NVIDIA's current Enterprise RA says the full rack requires **up to 142 kW** and contains 72 GPUs.

The clean reference is 1 MW of usable IT power:
1000/142 = 7.04 rack-equivalents → 7 whole racks → 504 GPUs.

The harder part is defining the MW. The article separates usable IT MW from facility-input MW, treats PUE only as a labeled planning approximation, models headroom and optional thermal capacity, and calculates stranded GPUs.

Example scenario:
4 MW facility input / PUE 1.20 / h 0.90 → 3.0 MW usable IT → 21 racks / 1,512 GPUs.
24 racks under the same assumptions require ~4.544 MW facility input, so ordering 24 first strands 3 racks / 216 GPUs in the model.

Source data and an editable workbook are included.

[LINK]
