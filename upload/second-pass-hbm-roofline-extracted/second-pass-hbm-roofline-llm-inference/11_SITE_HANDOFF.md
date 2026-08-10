# SITE HANDOFF

## Canonical article
`02_ARTICLE/when-flops-stop-mattering-hbm-roofline-llm-inference.md`

- slug: `when-flops-stop-mattering-hbm-roofline-llm-inference`
- section: COMPUTE
- format: PROOF
- status: review
- author: Aditya
- one Markdown source
- no MDX duplicate
- renderer owns H1
- FIRST PASS from frontmatter
- `changeLog: []`.

## Figure order
1. `chart-01-inference-roofline.svg`
2. `chart-02-decode-intensity.svg`
3. `chart-03-batch-ridge.svg`
4. `chart-05-prefill-vs-decode.svg`
5. `chart-04-token-roofs.svg`

Use SVG primary + PNG fallback. Source CSVs live in `05_CHARTS/data/`.

## Labels that must stay attached
- `THEORETICAL PEAK ROOFLINE`
- `DENSE BF16`
- `IDEALIZED WEIGHT-ONLY`
- `NOT MEASURED THROUGHPUT`
- `FP4/MXFP4 NOT DIRECTLY COMPARISON-SAFE`
- `q* IS NOT RECOMMENDED PRODUCTION CONCURRENCY`.

## Mobile
Verify 1440 / 1024 / 820 / 768 / 430 / 390 / 375.
Allow internal horizontal scroll for dense engineering charts below 390px rather than shrinking text to illegibility. No page-level overflow.

## Public-safe downloads
- `04_MODEL/llm-inference-roofline-model.xlsx`
- `03_RESEARCH/llm-roofline-company-input-template.csv`
- research/chart CSVs if desired.

## Workbook
Static download for this release. Do not rebuild as a public interactive calculator.

## House objects
`/ QUESTION`, `/ CALCULATION`, `/ CLAIM CHECK`, `/ INTELLIGENCE`.

## Source handling
Use natural body links and frontmatter sources. Internal S01-style IDs are QA only.

## Private QA
`01_EDITORIAL_DECISION.md`, `06_QA/*`, `09_FOLLOWUPS/*`, `10_COMMERCIAL_HANDOFF.md`.

## Z.ai
Do not re-research, rerun vendor comparisons or reinterpret the math. Preserve `status: review` until explicit human approval.
