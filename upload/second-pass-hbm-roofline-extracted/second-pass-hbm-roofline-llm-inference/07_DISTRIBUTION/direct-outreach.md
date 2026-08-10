# Direct outreach

## Subject
Inference hardware screening: compute roof vs HBM roof

I built a source-backed Roofline model for a procurement question: is an LLM serving workload constrained by arithmetic throughput or by moving bytes through HBM?

It normalizes current dense BF16 B300 and MI355X specs, derives workload intensity from model/precision/batch, separates prefill from decode, and lets a team substitute measured sustained bandwidth/compute.

The release includes the input CSV and workbook, so the public example can be replaced with a company's own model.

[LINK]

— Aditya
Founder & Editor, SECOND / PASS
