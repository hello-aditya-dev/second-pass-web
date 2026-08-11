# Current State

**Brand:** SECOND / PASS
**Phase:** LIVE PUBLICATION (post-production-repair + Research #10/#11)
**Architecture:** Astro 7 hybrid — static read path, Vercel Functions for writes only
**Date:** 2026-08-11
**Launch date:** 2026-08-10
**Canonical origin:** `https://second-pass.vercel.app`

## Publication state

- Site state: LIVE / PUBLIC (repo-side safeguards in place)
- robots.txt: public (`Allow: /`) — but ONLY when `SITE_PRELAUNCH=false` is set in the Vercel Production environment
- noindex: off (requires `SITE_PRELAUNCH=false`)
- Canonical origin: `https://second-pass.vercel.app`

### Indexing fail-safe contract

`SITE_PRELAUNCH` is fail-safe by design. The mapping is:

| env value            | mode     | robots.txt       | noindex |
| -------------------- | -------- | ---------------- | ------- |
| missing              | PRELAUNCH | `Disallow: /`   | on      |
| `"true"`             | PRELAUNCH | `Disallow: /`   | on      |
| `"false"`            | PUBLIC   | `Allow: /`      | off     |

Source: `src/layouts/BaseLayout.astro` and `src/pages/robots.txt.ts`. Both check `import.meta.env.SITE_PRELAUNCH !== "false"`. The `.env` file is gitignored and local-only — it has no effect on Vercel deployments.

### CRITICAL BLOCKER — Vercel Production environment variable

Vercel Production environment does **NOT** have `SITE_PRELAUNCH=false` set. As a result, the production deployment currently serves `noindex` and `Disallow: /`. This is a **Vercel environment configuration issue** that cannot be fixed from the repo.

**Exact action required:**
1. Vercel dashboard → second-pass project → Settings → Environment Variables → Production
2. Add (or update) `SITE_PRELAUNCH=false`
3. Redeploy (Trigger Redeploy on the latest production deployment)

Until this is set, the production site remains functionally prelaunch despite all repo-side content being live and audit-clean.

## Providers

- **Beehiiv**: CONFIGURED — /BRIEF form is live (API key, publication ID, list ID set in Vercel env)
- **Resend**: CONFIGURED — /partner and /intelligence forms are live (API key + from/backup emails set in Vercel env)
- **Vercel**: Hosting and serverless functions

## Analytics state

- Vercel Web Analytics is wired behind a feature toggle (`PUBLIC_ANALYTICS_ENABLED`)
- Default: OFF (`PUBLIC_ANALYTICS_ENABLED=false`)
- Cookie banner: NOT REQUIRED (see Privacy section) — analytics stays off until separate privacy review if ever enabled

## Author system

- `/authors/aditya` — Person JSON-LD, truthful bio, coverage, methodology
- Article JSON-LD uses `Person` author type with URL to author page
- Publisher is `Organization` with logo
- No invented credentials

## Article metadata

- `og:site_name`, `og:image` (article-specific), `og:image:alt`, `og:image:width/height`
- `article:published_time`, `article:modified_time`, `article:section`, `article:tag`
- `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- Person JSON-LD author, Organization JSON-LD publisher with logo

## Technical components

- `CalculationBlock`, `ClaimCheck`, `Metric`, `AssumptionList`, `SensitivityTable`
- Accessible, static-first, printable, mobile-safe, visually restrained

## Privacy and legal

- **Privacy**: Production notice active (effective 2026-08-10)
- **Terms**: Active (effective 2026-08-10)
- **Newsletter consent**: Present in BriefForm and /brief page
- **Partner form privacy note**: Present
- **Intelligence form privacy note**: Present
- **Cookie banner**: NOT REQUIRED — no non-essential cookies/storage/access technologies
- **Analytics**: see "Analytics state" section above (off by default, behind feature toggle)
- **Verified privacy contact**: MISSING — LEGAL CONTACT BLOCKER

## Legal/formality routes

- /privacy — Production privacy notice
- /terms — Terms of use
- /about — Publication about
- /editorial-policy — Editorial standards
- /corrections — Corrections policy

## Cookie and storage audit

- Cookies: None set by the application
- localStorage: Not used
- sessionStorage: Not used
- IndexedDB: Not used
- Service workers: None
- Tracking pixels: None
- Ad scripts: None
- Session replay: None
- Fingerprinting: None
- CAPTCHA: None
- Non-essential third-party scripts: None
- **Cookie banner required: NO** — zero non-essential storage/access technologies

## Publication formats

Five canonical formats are live in the schema:

- **NOW** — 300–700 words, at least one meaningful structured visual when the topic supports it.
- **SECOND PASS** — 1,500–3,500 words, 2–4 strong visual/information objects, original information gain.
- **PROOF** — math/evidence heavy: formal equations, assumption objects, methodology, decision boundary, derivation diagram, reproducibility.
- **DATA** — structured table, one or more analytical views, clear units, downloadable data where appropriate.
- **DEEP** — long-form; 3–6 meaningful visual objects where warranted. Quality beats volume.

## Published articles (19 total)

Articles are listed by section cluster. Total: 19 published, 6 draft (demo-* and torture-*).

### AI — 7 articles (3 NOW, 3 SECOND PASS, 1 PROOF)

- `an-ai-agent-is-no-longer-priced-in-tokens` — SECOND PASS — 2026-08-09 (featuredRank 2, editorialOrder 2)
- `cheapest-ai-model-not-cheapest-system` — SECOND PASS — 2026-08-09 (featuredRank 9, editorialOrder 0)
- `cheapest-ai-model-not-cheapest-system-proof` — PROOF — 2026-08-09 (featuredRank 0, editorialOrder 0)
- `no-universal-long-context-premium` — NOW — 2026-08-09
- `prompt-cache-second-use-break-even` — NOW — 2026-08-09
- `sonnet-5-price-effective-date` — NOW — 2026-08-09
- `when-should-a-company-run-its-own-ai-model` — SECOND PASS — 2026-08-09 (featuredRank 8, editorialOrder 1)

### Compute — 3 articles (2 SECOND PASS, 1 PROOF)

- `a-142-kw-ai-rack-turns-gpu-procurement-into-a-power-problem` — SECOND PASS — 2026-08-10 (featuredRank 4, editorialOrder 1)
  - 5 charts (SVG+PNG+CSV), XLSX workbook, 7 research CSVs
  - 6 sources, 5 FIRST PASS bullets, 2 CLAIM CHECKs
  - Full math (KaTeX), house editorial objects (/ QUESTION, / ASSUMPTION, / CALCULATION, / CLAIM CHECK, / INTELLIGENCE)
- `how-much-network-does-an-ai-gpu-cluster-actually-need` — SECOND PASS — 2026-08-10 (featuredRank 7, editorialOrder 2)
- `when-flops-stop-mattering-hbm-roofline-llm-inference` — PROOF — 2026-08-10 (featuredRank 3, editorialOrder 3)
  - 5 charts (SVG+PNG+CSV), XLSX workbook, 7 research CSVs + 1 input template CSV
  - 6 sources, 5 FIRST PASS bullets, 2 CLAIM CHECKs, 1 CALCULATION
  - Full math (KaTeX, 37 display blocks), house editorial objects (/ QUESTION, / CALCULATION, / CLAIM CHECK, / INTELLIGENCE)

### Systems — 3 articles (2 SECOND PASS, 1 PROOF)

- `when-should-you-split-prefill-from-decode` — SECOND PASS — 2026-08-10 (featuredRank 5, editorialOrder 3) — top of section
- `when-does-speculative-decoding-actually-pay` — SECOND PASS — 2026-08-10 (featuredRank 6, editorialOrder 2)
- `kv-cache-is-your-real-concurrency-budget` — PROOF — 2026-08-10 (featuredRank 0, editorialOrder 1)

### Security — 3 articles (2 SECOND PASS, 1 PROOF)

- `can-you-prove-the-ai-system-you-deployed-is-the-one-you-approved` — PROOF — 2026-08-10 (featuredRank 0, editorialOrder 3) — deployment provenance
- `when-should-an-ai-agent-be-allowed-on-the-internet` — SECOND PASS — 2026-08-10 (featuredRank 1, editorialOrder 2) — network egress / agent authority
- `what-can-a-prompt-injected-ai-agent-actually-do` — SECOND PASS — 2026-08-10 (featuredRank 0, editorialOrder 1) — prompt injection

### Data — 1 article (DATA)

- `ai-inference-price-surface-v0-1` — DATA — 2026-08-09 (featuredRank 0, editorialOrder 0)
  - Labeled HOUSE / DATA (internal label "DATA PRODUCT / FUTURE WHOLE-PRODUCT SPONSOR" was removed during production repair)
  - Three `/data` entry points link here:
    - `/research/ai-cost-quality-frontier` → this article
    - `/research/142kw-ai-rack` → `/articles/a-142-kw-ai-rack-turns-gpu-procurement-into-a-power-problem`
    - `/research/hbm-roofline-llm-inference` → `/articles/when-flops-stop-mattering-hbm-roofline-llm-inference`

### Research — 2 articles (1 PROOF, 1 SECOND PASS)

- `tokens-per-second-is-not-an-inference-benchmark` — PROOF — 2026-08-11 (featuredRank 0, editorialOrder 1)
  - 5 charts (SVG+PNG+CSV), XLSX workbook, input template CSV, 5 chart-data CSVs
  - 5 sources (vLLM, AIPerf, MLCommons, TensorRT-LLM, SGLang), 5 FIRST PASS bullets
  - 4 CALCULATION blocks, 3 CLAIM CHECK blocks (split from one giant ClaimCheck), 1 INTELLIGENCE
  - Full math (KaTeX, 92 elements): M=(N,D,S,A,E), R_out=R_req×O_bar, SLO goodput proofs
  - Frozen scenarios: 1,000 tok/s → 10 vs 1 req/s; 400 tok/s aggregate (20×20 vs 80×5); 9 vs 5 SLO goodput (2.25 vs 1.25 per GPU, 1.8×)
  - Stable namespace: `/research/tokens-per-second-benchmark/`
- `for-reasoning-models-ttft-may-measure-the-wrong-first-token` — SECOND PASS — 2026-08-11 (featuredRank 0, editorialOrder 2)
  - 5 charts (SVG+PNG+CSV), XLSX workbook, input template CSV, 5 chart-data CSVs
  - 8 structured sources (AIPerf×2, OpenAI, Gemini×3, vLLM, MLCommons) — normalized from raw URL strings
  - 5 FIRST PASS bullets, 3 CALCULATION blocks, 3 CLAIM CHECK blocks, 1 INTELLIGENCE
  - Full math (KaTeX, 68 elements): TTFT=t_any−t0, TTFO=t_out−t0, Δ_R→O=2050ms, rank reversal inequality
  - Frozen scenarios: TTFT 150ms/TTFO 2200ms gap 2050ms (93.18%); rank reversal 2050>450; migration -770ms semantic shift
  - All 5 figures inserted contextually (package had zero); hero: chart-03-rank-reversal.svg
  - Stable namespace: `/research/reasoning-ttft-ttfo/`

The `/research` hub now aggregates 6 articles: 2 Research-section + 4 cross-section PROOF.

## Research hub semantics

`/research` (`src/pages/research.astro`) aggregates articles where:

```
section === "Research"  ||  format === "PROOF"
```

Original section labels on cards are preserved — a Security / PROOF article is displayed with its real section, not relabeled as Research. Current hub population: 6 articles (2 Research-section + 4 cross-section PROOF): `tokens-per-second-is-not-an-inference-benchmark` (Research/PROOF), `for-reasoning-models-ttft-may-measure-the-wrong-first-token` (Research/SECOND PASS), `cheapest-ai-model-not-cheapest-system-proof`, `can-you-prove-the-ai-system-you-deployed-is-the-one-you-approved`, `kv-cache-is-your-real-concurrency-budget`, `when-flops-stop-mattering-hbm-roofline-llm-inference`.

## Homepage curation contract

The homepage (`src/pages/index.astro`) is editorially curated, not filesystem-driven:

- **Hero**: the article with `featured: true` and the lowest `featuredRank` (lower = higher priority). Currently: `when-should-an-ai-agent-be-allowed-on-the-internet` (featuredRank 1).
- **/ NOW**: filter `format === "NOW"`, slice 5.
- **/ SECOND PASS**: filter `format === "SECOND PASS"` ONLY — no PROOF mixing.
- **/ PROOF**: filter `format === "PROOF"` ONLY.
- The hero is excluded from the secondary sections so it does not appear twice.

`featuredRank` is an integer field on the article schema (`src/content.config.ts`). `featured: true` is required to be a hero candidate. `featuredRank: 0` means "not a hero candidate" — used on most articles that are simply marked featured for non-hero reasons.

## Deterministic article ordering

Section pages and feeds sort with a stable three-key contract (see `src/lib/content.ts`):

```
1. publishedAt  DESC  (newest first)
2. editorialOrder DESC (higher = newer/higher in section list)
3. slug          ASC  (stable tie-breaker)
```

`editorialOrder` is an integer field on the article schema. Current section top-to-bottom orderings:

- **Security**: deployment provenance (3) → network egress (2) → prompt injection (1)
- **Systems**: prefill/decode (3) → speculative decoding (2) → KV cache (1)

## Research SVG audit

- All 24 research SVGs pass structural audit (valid XML, valid viewBox, nonzero dimensions, no duplicate IDs, no control characters)
- GB300 thermal chart text padding fixed (increased left padding to ~22pt)

## Math rendering conventions

The canonical math convention after the production repair pass:

| Use case       | Syntax in source Markdown           | Rendered as            |
| -------------- | ----------------------------------- | ---------------------- |
| Inline math    | `<imath>...</imath>`                | KaTeX inline `<span>`  |
| Display math   | `$$...$$`                           | KaTeX `<div class="math display">` |
| Currency / plain dollar | `$0.0768`, `\$5`         | Plain text (untouched) |

**Critical:** Single-dollar `$...$` inline math is **DISABLED** in the remark-math config (`singleDollarTextMath: false`). This is intentional for currency safety. Writers must use `<imath>` for inline math.

Post-build pipeline: `scripts/process-inline-math.mjs` walks the built HTML in `dist/` and replaces `<imath>...</imath>` tags with rendered KaTeX HTML. The build runs this automatically (`bun run math:inline` is part of `bun run build`).

Audit: `bun run math:audit` runs `scripts/math-render-audit.mjs`, which detects:
- Single-dollar math patterns in source Markdown (would silently render as plain text)
- Unrendered `<imath>` tags remaining in built HTML
- Display math that failed to render

## House-object system

Canonical source syntax (Markdown) → rendered HTML (see `src/lib/rehype-house-objects.mjs`):

| Source heading         | Rendered as                            |
| ---------------------- | -------------------------------------- |
| `## / CALCULATION — "title"` | `<section class="calculation-block">` |
| `## / CLAIM CHECK — "title"` | `<section class="claim-check">`       |
| `### / ASSUMPTION — "title"` | `<section class="assumption-block">`  |
| `## / INTELLIGENCE`         | `<section class="intelligence-block">` |

### Label-on-own-line pattern

Labels (QUESTION, ASSUMPTIONS, EQUATION, RESULT, SO WHAT, CAVEAT, CLAIM, WHAT THAT MEASURES, WHAT IT DOES NOT MEASURE, WHEN IT IS USEFUL, WHEN IT IS NOT ENOUGH, SECOND / PASS) may appear on their own line as a separate paragraph containing only `**LABEL**`. When this happens, the renderer consumes subsequent sibling paragraphs/tables/lists as that label's content.

Content containers choose element type by content:
- Single `<p>` with only inline children → re-tagged to the label's preferred element (e.g. `<p class="calc-result">`)
- Block-level content (table, list, display-math) → wrapped in a `<div>` to keep HTML valid

CSS handles both cases (`src/styles/global.css`).

### Canonical intelligence CTA

Every article ends with a `/ INTELLIGENCE` block containing a single CTA. The canonical form is a Markdown link:

```markdown
[START A RESEARCH BRIEF →](/intelligence)
```

The older form (`**START A RESEARCH BRIEF →**` + `` `/intelligence` `` backtick literal) was retired during the production repair pass — every published article now uses the Markdown link form.

## Publication QA / audit pipeline

Audit scripts in `scripts/` and their `bun run` aliases:

| Script                         | bun run alias          | Purpose                                                              |
| ------------------------------ | ---------------------- | -------------------------------------------------------------------- |
| `content-audit.mjs`            | `content:audit`        | Article frontmatter sanity, sources, FIRST PASS, house object presence |
| `indexability-audit.mjs`       | `indexability:audit`   | Cross-checks CURRENT_STATE.md declarations against built HTML `<meta name="robots">` and `dist/robots.txt` |
| `link-integrity-audit.mjs`     | `link:audit`           | Verifies every internal link in built HTML resolves to a real route  |
| `house-object-audit.mjs`       | `house-object:audit`   | Verifies CALCULATION / CLAIM CHECK / ASSUMPTION structural integrity |
| `math-render-audit.mjs`        | `math:audit`           | Detects single-dollar math, unrendered `<imath>`, broken display math |
| `currency-regression-test.mjs` | `currency-regression`  | Ensures `$` currency strings are not mangled by math rendering       |
| `render-audit.mjs`             | `render-audit`         | Headings, TOC, headings hierarchy on built HTML                      |
| `responsive-audit.mjs`         | `responsive:audit`     | Page-level horizontal-overflow check across breakpoints              |
| `visual-audit.mjs`             | `visual:audit`         | Visual regression snapshot check                                     |
| `content-source-audit.mjs`     | `content-source-audit` | Every cited source URL reachable, type labeled                       |
| `research-svg-audit.mjs`       | (manual)               | Structural XML audit of every research SVG (viewBox, IDs, control chars) |
| `production-state-audit.mjs`   | (manual)               | Public copy vs actual functionality (forms, newsletter, ads)         |
| `launch-verify.mjs`            | `launch:verify`        | Confirms `SITE_PRELAUNCH=false` is explicitly set in the environment |
| `prepublish.mjs`               | `prepublish`           | Aggregate gate that runs the above before a production deploy        |
| `verify-article.mjs`           | `article:verify`       | Single-article sanity check                                          |

Required gate before publishing: `bun run prepublish` plus `bun run check` plus `bun run build`. The `indexability:audit`, `link:audit`, `house-object:audit`, and `math:audit` were added or strengthened during the production repair pass.

## Social asset system

- Build-time generation via `scripts/generate-social-assets.mjs` (sharp)
- OG: 1200×630, Portrait: 1080×1350, Square: 1080×1080
- Typography-first visual language: paper bg, ink type, Signal Blue slash
- Optional `socialStat` / `socialStatLabel` for key-number emphasis
- One set per article, generated into `public/social/`

## Data products

- **Published DATA**: AI Inference Price Surface, AI Rack Facility Capacity, HBM Roofline Inference
- **In development**: Model Pricing Index, Accelerator Index, Benchmark Registry
- `/data` entry points under `/research/*` use 301 redirect rules — three were repaired during the production pass (see Data section above)

## Known remaining blockers

1. **CRITICAL — Vercel Production env var**: `SITE_PRELAUNCH=false` must be set in Vercel → Settings → Environment Variables → Production, then redeploy. Without this, production serves `noindex` + `Disallow: /` despite repo-side content being live. Cannot be fixed from the repo.
2. **Verified privacy contact** — LEGAL CONTACT BLOCKER. `PUBLIC_CONTACT_EMAIL` is unset in Vercel env; privacy notice references a contact that does not yet exist.
3. **Domain migration**: `secondpass.net` is the eventual canonical domain. Until DNS is pointed at Vercel, the canonical origin stays at `https://second-pass.vercel.app` and `PUBLIC_SITE_URL` should remain the Vercel URL.
4. **Vercel Pro upgrade**: needed before commercial launch (function execution time, edge config, etc.).
5. **Author social profiles** (optional): `sameAs` URLs in Person JSON-LD when available.
