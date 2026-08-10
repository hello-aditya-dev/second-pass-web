# Hacker News

## Title
When should a company run its own AI model?

## Optional first comment
I used Mistral Small 4 as a same-model control: current managed API pricing versus downloadable weights on rented H100 capacity. The illustrative 10k-input/1k-output API cost is $0.0021/task. An AWS Mumbai 8×H100 Capacity Block is $27,564.80 for a 730-hour month, creating a capacity-only equal-quality price boundary around 13.13M tasks/month.

The main caveat is capacity: at 80% effective utilization that boundary requires ~22,476 useful tasks/hour. I found no compatible primary benchmark proving that serving configuration can deliver the workload/SLO, so the article keeps the number conditional.

[LINK]
