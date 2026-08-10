# X

1/ “When should we self-host the model?” is not a volume-only question.

Same-model Mistral Small 4 control.

2/ Illustrative 10k input + 1k output task:
managed API = **$0.0021/task**.

3/ AWS Mumbai 8×H100 Capacity Block:
$37.76/hour → $27,564.80 per 730-hour month.

Price-only boundary: **~13.13M tasks/month**.

4/ But that point requires ~**22,476 useful tasks/hour** at 80% effective utilization.

Required rate, not measured throughput.

5/ Quality changes the equation:
`N*=F/(r_q*v_c-v_o)`.
If denominator <=0, no finite break-even.

[LINK]
