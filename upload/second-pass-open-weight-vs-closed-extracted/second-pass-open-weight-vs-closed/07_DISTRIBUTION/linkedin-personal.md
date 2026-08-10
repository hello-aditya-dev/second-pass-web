# LinkedIn — Personal

I wanted a cleaner answer to a common infrastructure question: when should a company run an AI model itself?

Using Mistral Small 4 as the same named model on both sides, the illustrative 10k-input/1k-output managed task costs $0.0021. One AWS Mumbai 8×H100 Capacity Block costs $27,564.80 over 730 hours.

That puts the capacity-only, equal-quality price boundary near 13.13 million tasks/month.

The more important result is the caveat: at 80% effective utilization, the fleet would need to process about 22,476 useful tasks/hour at the required SLO. We do not have compatible evidence to claim it can.

The article then adds quality, utilization, engineering cost and hard constraints, plus an editable workbook.

[LINK]
