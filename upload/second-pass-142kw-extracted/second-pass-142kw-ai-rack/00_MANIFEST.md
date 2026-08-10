# SECOND / PASS — COMPUTE FLAGSHIP RESEARCH PACKAGE

## Article
**A GB300 NVL72 rack can require up to 142 kW. What can your facility support?**

Canonical file:
`02_ARTICLE/a-142-kw-ai-rack-turns-gpu-procurement-into-a-power-problem.md`

Section: COMPUTE  
Format: SECOND PASS  
Author: Aditya  
Status: review  
Featured: true  
Research date: 2026-08-10

## Central verified reference
NVIDIA GB300 NVL72:
- 72 Blackwell Ultra GPUs
- liquid-cooled rack
- 8×33 kW power shelves
- full rack requiring **up to 142 kW**.

## Central calculations
- 1 MW usable IT: 7.04 rack-equivalents → 7 whole racks → 504 GPUs.
- 4 MW facility-input scenario / PUE1.20 / h0.90: 3.000 MW usable IT → 21 racks → 1,512 GPUs.
- 24-rack target under same scenario: 4.544 MW modeled facility input → +0.544 MW.
- 24 procured vs 21 powerable: 3 stranded racks / 216 GPUs.
- modeled 142 kW thermal equivalent: 484,524 Btu_IT/h / 40.38 refrigeration tons.

## Contents
- canonical 2.7k–3.4k article
- 7 required research CSVs
- 8-sheet formula-driven facility workbook
- 5 evidence-bearing SVG + PNG figures and source CSVs
- source/claim/calculation ledgers
- unit, PUE, redundancy, thermal and adversarial QA
- publication gate
- native distribution package + social guidance
- BRIEF summary
- follow-up extraction
- AI Facility Capacity Sprint commercial handoff
- Z.ai site handoff

## Human gate
Do not publish. Article remains `status: review`.

## Final QA
- factual freeze: PASS
- calculation reproduction: PASS
- unit audit: PASS
- PUE/electrical audit: PASS
- redundancy audit: PASS
- thermal audit: PASS
- adversarial engineering review: PASS
- senior editorial rewrite: PASS
- line-by-line proofreading: PASS
- article body: 2862 words
- FIRST PASS: 5
- workbook alternate `USABLE IT MW` branch: PASS
- workbook formula errors: 0
- five-chart visual/data audit: PASS
- cross-asset number audit: PASS

## Final status
**READY FOR ARCHIVE + HUMAN REVIEW**
