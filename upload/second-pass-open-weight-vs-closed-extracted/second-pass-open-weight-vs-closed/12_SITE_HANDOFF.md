# SITE HANDOFF

## Canonical article
`02_ARTICLE/when-should-a-company-run-its-own-ai-model.md`

- slug: `when-should-a-company-run-its-own-ai-model`
- section: AI
- format: SECOND PASS
- author: Aditya
- status: review
- featured: true
- no MDX duplicate
- renderer owns H1
- FIRST PASS comes from frontmatter
- `changeLog: []` until approval

## Chart order
1. chart-01-deployment-policies.svg
2. chart-02-same-model-break-even.svg
3. chart-03-quality-adjusted-frontier.svg
4. chart-04-utilization-trap.svg
5. chart-05-memory-headroom.svg

PNG fallback and source CSV exist for every figure.

## Public-safe downloads
- `04_MODEL/enterprise-ai-deployment-decision-model.xlsx`
- `03_RESEARCH/company-deployment-input-template.csv`
- supporting research CSV/JSON if desired

## Critical labels
Keep adjacent to scenario results:
- ILLUSTRATIVE ENTERPRISE WORKLOAD
- price-only deployment break-even
- required rate, not measured throughput
- quality sensitivity scenario

## Responsive
Verify at 1440 / 1024 / 820 / 768 / 430 / 390 / 375.
Equations and dense figures may scroll inside bounded containers; never page-level.
Figure 01 stacks vertically below tablet/mobile sizes.
Captions stay outside scroll.

## Sources
Use natural Markdown links and structured frontmatter source objects. Do not expose S01-style IDs in public prose.

## Workbook
Static download only. Do not build a public interactive calculator in this release.

## Human gate
Do not change `status: review` or add a published change-log event until human approval.
