# X

1/ NVIDIA's current GB300 NVL72 Enterprise RA says a full rack requires **up to 142 kW**.

72 GPUs / rack.

The infrastructure question is no longer just “how many GPUs can we buy?”

2/ Cleanest calculation:

1 MW **usable IT power**
÷ 142 kW/rack
= 7.04 rack-equivalents
= **7 whole racks**
= **504 GPUs**

The word “usable” matters.

3/ A facility-input MW is different.

Illustrative:
4 MW facility input
PUE 1.20 planning assumption
90% usable-capacity factor

→ 3.0 MW modeled usable IT
→ **21 racks / 1,512 GPUs**

4/ Target 24 racks?

24×142 kW = 3.408 MW IT.

Under the same planning assumptions:
facility input required ≈ **4.544 MW**

Additional vs 4 MW ≈ **0.544 MW**

5/ Buy all 24 before the facility is ready?

21 powerable
24 procured

→ **3 stranded racks**
→ **216 stranded GPUs**

No public rack price needed to see the capacity risk.

6/ Important corrections:
PUE ≠ cooling power.
142 kW heat load ≠ 142 kW cooling electricity.
N+1 ≠ a universal percentage.
Site MW ≠ rack-feed MW.

[LINK]
