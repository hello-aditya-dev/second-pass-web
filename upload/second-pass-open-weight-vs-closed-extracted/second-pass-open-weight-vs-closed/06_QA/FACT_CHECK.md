# FACT CHECK — FINAL PACKAGE-WIDE AUDIT

Audit date: **2026-08-10**

This pass was performed after the research, calculations, article drafting, workbook construction, chart generation, distribution copy and editorial rewrite.

## 1. Load-bearing primary facts

### Open Source AI terminology — PASS
- OSI Open Source AI Definition 1.0 requires use/study/modify/share freedoms and preferred-form access; for ML systems it addresses data information, code and parameters.
- The article therefore does not use downloadable weights as sufficient proof that a complete AI system is Open Source AI.
- `open-weight model` remains the default deployment term.

### Mistral Small 4 same-model control — PASS
Verified against Mistral-owned documentation:
- `mistral-small-2603`
- 119B total parameters
- 6.5B active parameters
- 256k context
- $0.15/M input
- $0.60/M output
- downloadable weights
- Apache 2.0
- NVFP4 self-deployment variant
- vLLM reference serving configuration.

The article explicitly calls this a **same-model deployment control**, not identical inference.

### AWS H100 capacity price — PASS
Verified current AWS Capacity Blocks table:
- region: Asia Pacific (Mumbai)
- instance: `p5.48xlarge`
- 8×H100
- $37.76/instance-hour
- $4.720/H100-hour.

The package identifies this as a **Capacity Block reservation price**, not ownership CapEx, spot price or universal on-demand price.

### gpt-oss-120b memory case — PASS
Verified from OpenAI-owned sources:
- 116.83B total parameters
- 5.13B active parameters/token
- 60.8 GiB checkpoint
- MXFP4 MoE quantization
- optimized path can run on a single 80GB GPU
- alternating full/sliding attention.

The article does not turn “fits on one GPU” into a concurrency, latency or throughput claim.

### Closed managed reference prices — PASS
Freshly checked:
- OpenAI GPT-5.6 Luna default reference: $1/M input, $6/M output.
- Anthropic Claude Sonnet 5: $2/$10 introductory through 2026-08-31; $3/$15 from 2026-09-01.
- Google Gemini 3.5 Flash-Lite: $0.30/M input and $2.50/M output including thinking tokens.

These rows are references for variable managed economics, not a cross-model quality ranking.

## 2. Independent calculation reproduction

- Managed Mistral workload cost: `0.0021000000` → **$0.0021/task** — PASS
- AWS 730-hour capacity month: `27564.8000000000` → **$27,564.80** — PASS
- Simple equal-quality deployment-only break-even: `13126095.238095` → **13.13M tasks/month** — PASS
- Required useful rate at 80% effective utilization: `22476.190476` → **22,476 tasks/hour** — PASS
- Required task rate in seconds: `6.243386243` → **6.24 tasks/s** — PASS
- $5k/month ops sensitivity: `15507047.619048` → **15.51M tasks/month** — PASS
- $20k/month ops sensitivity: `22649904.761905` → **22.65M tasks/month** — PASS
- Quality no-finite-break-even threshold: `0.476190476190` → **0.476** — PASS
- Utilization: 40% vs 80% = **2.00×**; 20% vs 80% = **4.00×** — PASS

## 3. Algebra audit

Quality-adjusted derivation:

`CAO_c = v_c/a_c`

`CAO_o = (F/N + v_o)/a_o`

Setting equal and defining `r_q=a_o/a_c` gives:

`N* = F/(r_q*v_c-v_o)`

Finite break-even requires:

`r_q*v_c-v_o > 0`.

Independent derivation: **PASS**.

## 4. Throughput / capacity audit

**PASS, with an explicit UNKNOWN preserved.**

No transferable Mistral Small 4 throughput value is used. The package calculates the capacity rate the price boundary **would require** and labels it as a requirement, not a benchmark.

The unresolved production question is whether the exact checkpoint/engine/hardware/concurrency/SLO can supply that capacity. This is a user-measurement gate, not a hidden assumption.

## 5. Memory audit

**PASS.**

- Official checkpoint size is preferred over a theoretical parameter-memory estimate.
- GB and GiB are not subtracted as if identical.
- Active MoE parameters are not treated as resident model size.
- KV/runtime/workspace/margin remain separate.
- A generic KV expression is explained, but no naive full-context number is applied to gpt-oss's alternating-attention architecture.

## 6. Workbook audit

**PASS after one final-QA correction.**

A pre-final formula initially treated “measured capacity > 0” as sufficient for self-host feasibility. That was too weak.

The workbook was corrected so:
- self-host capacity is feasible only if measured tasks/hour >= the current workload requirement at the selected utilization;
- hybrid capacity feasibility scales with the fraction routed to self-host;
- an absent measured capacity keeps self-host/hybrid infeasible.

Artifact-tool formula scan after the correction: **0 formula errors**.

## 7. Chart audit

### Figure 01 — PASS
Structural four-policy diagram; no subjective scoring.

### Figure 02 — PASS
Managed/API line and capacity-only line reproduce the same-model control. The caption states that the price crossing is not throughput proof.

### Figure 03 — PASS after final-QA correction
The economic-region labels were checked against the equation. Final chart correctly states:
- above the boundary: self-host lower CAO;
- below the boundary: managed lower CAO;
- left/no-positive-denominator region: no finite break-even.

### Figure 04 — PASS
20/40/60/80/100% values reproduce the normalized 1/u relationship.

### Figure 05 — PASS
Memory figure is intentionally schematic and does not imply proportional subtraction between 60.8 GiB and 80 GB.

## 8. Adversarial review

### Open-weight model vendor
PASS — license, model size, API price and same-model caveat are represented without turning vendor performance claims into enterprise throughput.

### Closed API provider
PASS — closed references are not ranked by token price or assumed quality-equivalent.

### Cloud GPU provider
PASS — Capacity Blocks are identified as reservation/capacity pricing; no ownership-TCO claim.

### Inference-engine maintainer
PASS — no incompatible throughput result is imported; exact serving capacity remains a measurement requirement.

### CTO
PASS — utilization, engineering, redundancy, latency, context and capacity are visible decision variables.

### Open-source advocate
PASS — open weight is not silently relabeled Open Source AI.

### Security team
PASS — article explicitly says neither managed nor self-hosted architecture is automatically secure.

### Finance team
PASS — API variable cost, capacity/fixed-like cost, scenario operations cost and excluded costs are distinguished.

## 9. Double-count / denominator audit

PASS.
- Same-model deployment control uses one managed token bill versus one rented-capacity bill in the simplest calculation.
- Engineering/storage/network are zero only in the explicitly labeled deployment-only control, then exposed as workbook parameters/sensitivities.
- Quality is normalized through acceptance probability; public benchmarks are not substituted for enterprise acceptance.
- No raw token-price winner is declared between different models.

## 10. Editorial and proofreading audit

- Canonical article body: **3072 words**
- Exactly five FIRST PASS bullets — PASS
- No body H1 — PASS
- No body FIRST PASS duplicate — PASS
- `status: review` — PASS
- `changeLog: []` — PASS
- Display-math delimiter balance — PASS
- Grammar/punctuation/number/unit consistency — PASS
- Technical terminology consistency — PASS
- Natural load-bearing source links — PASS
- No opaque source IDs in article body — PASS
- No generation placeholders — PASS
- Anti-slop phrase scan — PASS
- No claim that the illustrative workload is typical/average — PASS
- BRIEF summary: **84 words** — PASS
- Distribution and social copy use scenario labels around the 13.13M result — PASS

## Final factual status

**PASS**

Known unresolved input: measured production serving capacity for the exact self-host configuration. It is explicitly marked UNKNOWN / INPUT REQUIRED and therefore does not invalidate the published analytical contribution.
