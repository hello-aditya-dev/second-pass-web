# SITE HANDOFF

## Canonical article
`02_ARTICLE/a-142-kw-ai-rack-turns-gpu-procurement-into-a-power-problem.md`

- slug: `a-142-kw-ai-rack-turns-gpu-procurement-into-a-power-problem`
- section: COMPUTE
- format: SECOND PASS
- status: review
- author: Aditya
- featured: true
- one canonical Markdown source
- no MDX duplicate
- renderer owns H1
- FIRST PASS comes from frontmatter
- `changeLog: []` until human approval.

## Figure order
1. `05_CHARTS/chart-01-rack-power-chain.svg` — after opening/question
2. `05_CHARTS/chart-02-racks-per-mw.svg` — after 1 MW calculation
3. `05_CHARTS/chart-03-capacity-sensitivity.svg` — after 4 MW scenario
4. `05_CHARTS/chart-05-thermal-or-redundancy.svg` — thermal section
5. `05_CHARTS/chart-04-stranded-gpus.svg` — stranded-capacity section

PNG fallbacks and source CSVs are included.

## Captions / safety labels
Never detach these from their respective values:
- `up to 142 kW`
- `1 MW USABLE IT`
- `PUE 1.20 / h 0.90 — illustrative planning scenario`
- `thermal load, not cooling electrical input`
- `power-only scenario; other constraints can reduce capacity`.

## Mobile
Verify 1440 / 1024 / 820 / 768 / 430 / 390 / 375.
- Figure 01 stacks chain elements.
- Figure 03 may use internal horizontal scroll; caption stays outside.
- equations live inside bounded overflow containers.
- no page-level horizontal overflow.
- SVG preferred, PNG fallback.
- no tiny chart labels.

## Public-safe downloads
- `04_MODEL/ai-rack-facility-capacity-model.xlsx`
- `03_RESEARCH/ai-rack-facility-input-template.csv`
- optionally the six research CSVs and chart data CSVs.

## Workbook behavior
Offer as a static download. Do not rebuild as an interactive calculator for this same-day release.

Critical safety behavior to preserve:
- FACILITY INPUT MW → planning PUE path can normalize capacity.
- USABLE IT MW → do not divide by PUE again.
- thermal capacity 0/blank → label thermal constraint as not supplied.
- redundancy sheet remains separate from h to avoid reserve double-counting.

## House objects
Use existing SECOND / PASS styles where available:
- `/ QUESTION`
- `/ ASSUMPTION`
- `/ CALCULATION`
- `/ CLAIM CHECK`
- `/ INTELLIGENCE`

## Sources
Use natural Markdown source links and structured frontmatter sources. Do not render internal `S01` source IDs in public article prose.

## BRIEF
Use `08_BRIEF/brief-summary.md`; do not create a separate full daily BRIEF page for this package.

## Private QA
Keep internal unless newsroom methodology is intentionally exposed:
- `01_EDITORIAL_DECISION.md`
- `06_QA/*`
- `09_FOLLOWUPS/*`
- `10_COMMERCIAL_HANDOFF.md`

## Public-safe
- canonical article
- figures
- workbook
- public input template
- selected supporting CSVs
- BRIEF summary if the site uses it.

## Z.ai instruction
Do not re-research or reinterpret the technical result. Implement the canonical Markdown and assets exactly, preserving scenario labels and `status: review`.
