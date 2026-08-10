# CONTROL CHARACTER AUDIT

Repair date: **2026-08-10**  
Canonical article: `02_ARTICLE/when-flops-stop-mattering-hbm-roofline-llm-inference.md`

## Canonical Markdown — before repair

| Character | Code point | Count |
|---|---:|---:|
| NULL | U+0000 | 0 |
| U+0001–U+0008 | — | 0 |
| TAB | U+0009 | 7 |
| VERTICAL TAB | U+000B | 0 |
| FORM FEED | U+000C | 1 |
| U+000E–U+001F | — | 0 |
| DEL | U+007F | 0 |

Observed defect:
- **7 TAB bytes**, each immediately followed by `ext{`, restoring unambiguously to literal LaTeX `\text{`.
- **1 FORM-FEED byte**, immediately followed by `rac{`, restoring unambiguously to literal LaTeX `\frac{`.
- other unexpected controls: **0**.

## Surgical repair proof

The repaired canonical article is byte-for-byte identical to the previous archived article after applying only these two explicit substitutions:

- `TAB + "ext{"` → `\text{`
- `FORM FEED + "rac{"` → `\frac{`

**Exact surgical equivalence: PASS**

No research value, equation semantics, headline, FIRST PASS, section order, conclusion or approved calculation was changed.

## Canonical Markdown — after repair

| Character | Code point | Count |
|---|---:|---:|
| NULL | U+0000 | 0 |
| U+0001–U+0008 | — | 0 |
| TAB | U+0009 | 0 |
| VERTICAL TAB | U+000B | 0 |
| FORM FEED | U+000C | 0 |
| U+000E–U+001F | — | 0 |
| DEL | U+007F | 0 |

Unexpected controls after repair: **0**.

UTF-8 decode: **PASS**  
UTF-8 BOM: **ABSENT / PASS**

## LaTeX / Markdown source integrity

- display `$$` delimiter count: **74**
- display blocks: **37**
- balanced delimiter pairs: **PASS**
- display-block brace/control syntax audit: **PASS**
- body H1 count: **0**
- Markdown heading markers before display math: **0**
- accidental raw LaTeX command leaks outside display math: **0**
- forbidden sentinel occurrences: **0**

Major approved equation blocks preserved: **PASS**

## Package-wide textual scan

Extensions scanned: `.md`, `.csv`, `.json`, `.txt`, `.svg`

Final text files scanned: **48**

Unexpected control-character files: **0**  
Unexpected control characters: **0**  
UTF-8 failures: **0**

## SVG XML

Five SVGs were parsed successfully as XML and their bytes match the previously approved package.

Status: **PASS**

## CSV

Twelve CSV files were opened as UTF-8, parsed with consistent column counts, and byte-compared with the previously approved package.

Status: **PASS**

## Workbook

`llm-inference-roofline-model.xlsx` SHA-256 is unchanged from the previously approved package:

`6141ec6d2ea610ea14af7dcd97a420fc57e60e7a6b5cccc9e207dabf7a438308`

Formula errors: **0**  
Worksheet structure preserved: **PASS**  
Dense/sparse protection preserved: **PASS**  
Precision protection preserved: **PASS**  
MoE warning preserved: **PASS**  
Measured > peak warnings preserved: **PASS**

## Result

**PASS — CLEAN UTF-8 / VALID LATEX SOURCE / ZERO UNEXPECTED CONTROLS**
