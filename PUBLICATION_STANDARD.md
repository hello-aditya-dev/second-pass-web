# SECOND / PASS — PUBLICATION STANDARD

## BRAND
- Name: SECOND / PASS
- Core idea: "The first pass tells you what happened. The second pass tells you what it means."
- Core editorial question: "What changed technically, and what does it change economically?"
- Coverage: AI, Compute, Systems, Infrastructure, Security, Research, Data
- Character: technical intelligence — not generic tech blog, press-release rewriting, AI content farm, vendor marketing, or generic SaaS site

## VISUAL IDENTITY
- Palette: Paper #F2EFE7, Ink #11110F, Graphite #5A5953, Rule #C9C3B7, Signal Blue #2F5BFF
- Typography: Bricolage Grotesque Variable (masthead, headlines, navigation, data numerals), Newsreader Variable (article prose, deks, captions), System mono (timestamps, units, source types, labels)
- Signal Blue must carry INFORMATION (important result, active variable, key annotation, threshold, rule) — never decorative noise
- No gradients except approved extremely restrained editorial treatment. No glassmorphism, no shadows/cards everywhere, no neon, no stock imagery, no generic AI robot, no AI brain art, no ornamental 3D, no decorative graphs.

## 9.5+ QUALITY DEFINITION
Requires: Visual hierarchy, Information density, Original information design, Mathematical clarity, House consistency (FIRST PASS, CALCULATION, CLAIM CHECK, ASSUMPTION, SOURCES, CHANGE LOG, INTELLIGENCE, BRIEF all look unmistakably related), Responsive intent (mobile/tablet feel designed not collapsed), Semantics (figures, captions, tables, headings, links are structurally correct), Restraint (no visual added merely because "every article needs a visual" — every object must increase understanding)

## FORMAT-SPECIFIC VISUAL STANDARDS
- / NOW: 300–700 words. At least ONE meaningful structured visual object when topic supports it.
- / SECOND PASS: 1,500–3,500 words. 2–4 strong visual/information objects. At least one should normally contain original information gain.
- / PROOF: Math/evidence heavy. Formal equations, assumption objects, methodology, decision boundary, architecture/derivation diagram, reproducibility.
- / DATA: Structured table, one or more analytical views, clear units, downloadable data where appropriate.
- / DEEP: 3–6 meaningful visual objects where warranted. Quality beats volume.

## FIGURE PIPELINE
- Source convention: `![Alt text](/research/path/chart.svg "Caption text")` renders as `<figure class="research-figure"><div class="research-figure-scroll"><img ... loading="lazy" decoding="async"></div><figcaption>Caption text</figcaption></figure>`
- No MDX required. No React. No client JS. Keep canonical Markdown publishing.
- Dense figures: mark `research-figure--scroll` for internal scroll at 375–430px. Minimum image width ~560–640px. Caption OUTSIDE scroll area. Page-level horizontal overflow prohibited.

## FIGURE CAPTION STANDARD
- A good caption tells: what the figure shows, what assumptions apply, whether values are observed/calculated/scenario, what not to infer.
- Do not duplicate chart title word-for-word.

## RESEARCH FIGURE STYLE
- House style: Paper background or transparent. Ink for primary structure. Graphite for secondary context. Rule for grid lines. Signal Blue for one important series/threshold/variable.
- Avoid: rainbow charts, unnecessary legends, thick borders, gradients, pie charts unless part-to-whole genuinely requires one, 3D charts, excessive grid lines, tiny labels.

## HOUSE EDITORIAL OBJECTS
- `/ CALCULATION`: Rendered as `<section class="calculation-block">`. Recognize labeled fields: QUESTION, ASSUMPTIONS, EQUATION, RESULT, SO WHAT, CAVEAT. RESULT gets Signal Blue emphasis.
- `/ CLAIM CHECK`: Rendered as `<section class="claim-check">`. Recognize: CLAIM, WHAT THAT MEASURES, WHAT IT DOES NOT MEASURE, WHEN IT IS USEFUL, WHEN IT IS NOT ENOUGH, SECOND / PASS.
- `/ ASSUMPTION`: Rendered as `<section class="assumption-block">`. Thin top rule, mono kicker, compact label, slightly differentiated background, clear list spacing. Purpose: make scenario assumptions impossible to confuse with observed facts.
- `/ INTELLIGENCE`: Rendered as `<section class="intelligence-block">`. The canonical end-of-article CTA. The CTA itself must be a Markdown link: `[START A RESEARCH BRIEF →](/intelligence)`. Do not use the older `**START A RESEARCH BRIEF →**` + `` `/intelligence` `` backtick-literal form.
- Content pipeline: Writers write `### / CALCULATION` etc. in Markdown and receive house treatment automatically. No HTML required. No Astro imports in Markdown. The renderer owns presentation.

### HOUSE OBJECT SOURCE SYNTAX
Canonical heading forms (see `src/lib/rehype-house-objects.mjs`):

```markdown
## / CALCULATION — "title"
## / CLAIM CHECK — "title"
### / ASSUMPTION — "title"
## / INTELLIGENCE
```

The `— "title"` portion is optional for CALCULATION and CLAIM CHECK; omit it for INTELLIGENCE.

### LABEL-ON-OWN-LINE PATTERN
Labels (QUESTION, ASSUMPTIONS, EQUATION, RESULT, SO WHAT, CAVEAT, CLAIM, WHAT THAT MEASURES, WHAT IT DOES NOT MEASURE, WHEN IT IS USEFUL, WHEN IT IS NOT ENOUGH, SECOND / PASS) may appear on their own line as a separate paragraph containing only `**LABEL**`. When this happens, the renderer consumes subsequent sibling paragraphs/tables/lists as that label's content. Example:

```markdown
## / CALCULATION — break-even utilization

**QUESTION**

At what GPU utilization does disaggregation pay back the extra network hop?

**RESULT**

~63%, under the assumptions below.
```

Rules:
- A label and its content must NOT share a paragraph. The forward-scan label processor only triggers when the label is alone in its paragraph.
- If content is a single inline paragraph, the renderer re-tags it to the label's preferred element (e.g. `<p class="calc-result">`).
- If content contains block-level elements (table, list, display-math), the renderer wraps it in a `<div>` to keep HTML valid. CSS handles both cases.
- `bun run house-object:audit` verifies structural integrity. Treat any failure as build-breaking.

## EVERY VISUAL MUST ANSWER A QUESTION
Before creating a figure, define: DECISION QUESTION. Each figure must have: figure_id, question, title, data/source basis, observed/calculated/scenario status, main takeaway, caveat, alt text, caption, mobile behavior.

## MATH STANDARD
- Ordinary money uses normal `$`. Example: "The request costs $0.0768." Single-dollar inline math is disabled.
- Display equations use `$$...$$`. No sentinel substitutions. Forbidden: 24182, 24183, 24190, 24191. No raw LaTeX outside math. Math exists to answer a question.

### INLINE MATH CONVENTION
Single-dollar inline math (`$...$`) is **disabled** in remark-math (`singleDollarTextMath: false`). This is intentional for currency safety — articles routinely use `$0.0768`, `$5`, etc. The canonical inline math syntax is the `<imath>` tag:

| Use case       | Source Markdown                       | Rendered as                            |
| -------------- | ------------------------------------- | -------------------------------------- |
| Inline math    | `<imath>...</imath>`                  | KaTeX inline `<span>` (post-build)     |
| Display math   | `$$...$$`                             | KaTeX `<div class="math display">`     |
| Currency       | `$0.0768`, `\$5`                      | Plain text (untouched)                 |

`<imath>` is a non-standard HTML tag that does not render in the browser. After `astro build`, `scripts/process-inline-math.mjs` walks `dist/` and replaces every `<imath>` with rendered KaTeX inline HTML. The build pipeline runs this automatically (`bun run math:inline` is part of `bun run build`). If you skip the post-build step, inline math will not render — the audit will fail.

`bun run math:audit` (`scripts/math-render-audit.mjs`) detects:
- Single-dollar math patterns in source Markdown (would silently render as plain text)
- Unrendered `<imath>` tags remaining in built HTML
- Display math that failed to render

Treat any report as build-breaking.

## TABLE STANDARD
- All Markdown tables automatically receive `.table-wrap` with internal horizontal scroll. Page itself never horizontally scrolls. Units explicit. Numeric columns aligned. Headers compact. No tiny unreadable table on mobile.

## RESPONSIVE STANDARD
- Desktop: >1040px — TOC | ARTICLE | EVIDENCE. Tablet: 721–1040px — centered ARTICLE, compact horizontal TOC, evidence hidden. Mobile: ≤720px — ARTICLE only, no side evidence, no giant TOC, internal scrolling only.
- No page-level horizontal overflow.

## SOURCE STANDARD
- Primary sources strongly preferred. Current prices/specs must be reverified before publication. Every technical number needs provenance. Vendor benchmark must be labelled. Calculated values must be labelled. Scenarios must be labelled. Do not turn scenario outputs into universal claims.

## INFORMATION GAIN STANDARD
- Every substantial SECOND / PASS piece must add something beyond the primary-source page. Possible information gain: original calculation, normalized data, source reconciliation, break-even threshold, architecture diagram, decision boundary, changed-spec table, cost model, sensitivity analysis, explicit uncertainty, reproducible methodology.

## CONTENT QUALITY
- A sentence should preferably: state a fact, explain a mechanism, provide a number, define something, show evidence, perform a calculation, draw a consequence, state uncertainty.
- Avoid generic AI filler. No: revolutionary, game-changing, cutting-edge, dynamic landscape, paradigm shift, transformative, unlock. No fake tests, fake quotes, invented numbers, unsourced benchmark claims.

## VISUALS ARE EVIDENCE
- "SECOND / PASS visuals are evidence-bearing editorial objects, not decoration." A figure must be traceable to source, calculation, dataset, or article mechanism. Every figure should be defensible under fact check.

## NO DECORATIVE HERO IMAGES
- Default research article hero: typography. Not stock photo, AI illustration, futuristic server room, robot, abstract neural network.

## FUTURE VISUAL DESIGN PROCESS
- Every future publication package should provide a VISUAL PLAN. When Z.ai receives an approved article without a visual plan, it must first inspect: article, data, calculations, existing public-safe assets. Then identify the minimum set of visuals required. For each: QUESTION, TYPE, SOURCE DATA, PLACEMENT, TAKEAWAY, CAVEAT, MOBILE BEHAVIOR.

## HOUSE VISUAL TYPES
- RESEARCH FIGURE, CALCULATION, CLAIM CHECK, ASSUMPTION, COMPARISON TABLE, DECISION TABLE, ARCHITECTURE DIAGRAM, TIMELINE, COST WATERFALL, SENSITIVITY CURVE, DECISION BOUNDARY, DATA TABLE, SOURCE/EVIDENCE OBJECT. Reuse this grammar. Do not invent a new style for every article.

## 9.5+ ARTICLE VISUAL SCORECARD
Score each 0–10: A. FIRST-SCREEN HIERARCHY, B. TYPOGRAPHY, C. ARTICLE RHYTHM, D. INFORMATION DESIGN, E. FIGURE QUALITY, F. MATHEMATICAL PRESENTATION, G. TABLE QUALITY, H. HOUSE OBJECT CONSISTENCY, I. SOURCE/EVIDENCE PRESENTATION, J. RESPONSIVE DESIGN, K. ACCESSIBILITY, L. POLISH / LACK OF VISUAL DEFECTS.
- Publication target: NO dimension below 9.0. AVERAGE >= 9.5. For flagship SECOND PASS/PROOF/DATA: Information Design, Figure Quality, Mathematical Presentation >= 9.5.

## DUPLICATE VISUAL INFORMATION
- No article should contain: raw text diagram + designed diagram showing the same thing. No article should contain: table + chart with identical data unless each answers a different question. Visual information should compress understanding, not multiply page length.

## PERFORMANCE
- Remain static-first. No runtime chart library, no React, no canvas rendering, no chart hydration, no giant JS framework. SVG preferred. Images optimized. Article HTML readable without JS.

## ACCESSIBILITY
- Every research figure: useful alt text. Every data table: semantic th/td. Every scrollable table: keyboard-accessible bounded region. Every house object: semantic section. Every heading: correct hierarchy. No color-only meaning. Signal Blue emphasis must also have label, position, shape, text when necessary.

## VISUAL SCREENSHOT CHECKLIST
- FIRST SCREEN: headline/dek/meta balance. FIRST PASS: information density. ARTICLE RHYTHM: no wall of text. VISUAL PLACEMENT: figure arrives near relevant explanation. FIGURE SIZE: not tiny, not oversized. CAPTION: useful. CALCULATIONS: scannable. CLAIM CHECK: clearly distinct. TABLES: readable. MATH: clean. SOURCES: professional. INTELLIGENCE: subtle. BRIEF: strong but not intrusive. FOOTER: balanced. MOBILE: intentionally designed.

## RESEARCH SVG TEXT SAFE ZONE
Text inside a bounded rectangle must maintain deliberate internal padding. Recommended minimum: horizontal: 12px, vertical: 8px, or proportional equivalent at SVG coordinate scale. No glyph bounding box may intersect its containing border/stroke. No annotation may touch plot border, arrow, data point, axis, another annotation unless intentionally designed. Text must never rely on clipping to fit.

## PRODUCTION-STATE TRUTH
Public copy must reflect actual current functionality. Never leave temporary language such as pre-launch, coming soon, no newsletter, no forms, reserved advertisement after those facts change. Whenever a new analytics provider, newsletter system, lead form, advertising provider, payment system, database, authentication system, or cookie/storage technology is enabled, privacy/legal documentation must be reviewed in the SAME implementation. No feature ships first with policy cleanup deferred indefinitely.

## PRODUCTION INDEXING CONTRACT
`SITE_PRELAUNCH` is fail-safe by design. Both `src/layouts/BaseLayout.astro` and `src/pages/robots.txt.ts` use `import.meta.env.SITE_PRELAUNCH !== "false"`:

- missing → PRELAUNCH (noindex + `Disallow: /`)
- `"true"` → PRELAUNCH
- `"false"` → PUBLIC (`Allow: /`, indexable)

Missing or unset always falls back to prelaunch, never to public. The committed `.env` file is gitignored and local-only — it does NOT affect Vercel deployments. To make production indexable, `SITE_PRELAUNCH=false` MUST be set in the Vercel project Environment Variables (Settings → Environment Variables → Production), then a redeploy triggered. This is a Vercel-side step; it cannot be performed from the repo.

Never weaken the fail-safe. Never commit a real `.env`. Public copy ("LIVE / PUBLIC" in CURRENT_STATE.md) is a repo-side declaration — it must be cross-checked against built HTML and `dist/robots.txt` by `bun run indexability:audit`. If the audit fails, either fix the build or update CURRENT_STATE.md to reflect actual state.

## HOMEPAGE CURATION CONTRACT
The homepage is editorially curated via two frontmatter fields, not filesystem order:

- **`featured`** (boolean) — gates hero eligibility. Only `featured: true` articles can become the hero.
- **`featuredRank`** (integer) — lower = higher hero priority. `featuredRank: 0` means "not a hero candidate" — used on featured articles that should not be the hero.

Hero = `featured: true` AND lowest `featuredRank`. The hero is then excluded from secondary sections so it never appears twice.

Secondary sections filter by `format` ONLY — no cross-format mixing:
- `/ NOW` → `format === "NOW"` (slice 5)
- `/ SECOND PASS` → `format === "SECOND PASS"` ONLY (slice 3) — never include PROOF
- `/ PROOF` → `format === "PROOF"` ONLY (slice 2)

Never relax the format-purity filter. Never select the hero by filesystem order or `publishedAt` alone. Always set `featured` and `featuredRank` explicitly on every published article.

## DETERMINISTIC ORDERING CONTRACT
Section pages and feeds sort by a stable three-key contract (see `src/lib/content.ts`):

```
1. publishedAt    DESC  (newest first)
2. editorialOrder DESC  (higher = higher in section list)
3. slug            ASC  (stable tie-breaker)
```

`editorialOrder` is an integer frontmatter field. Within a single publish date, assign higher `editorialOrder` to the article that should appear first in its section. Always set `editorialOrder` explicitly — never rely on filesystem order or slug alphabetical to control section order.

## RESEARCH HUB SEMANTICS
`/research` aggregates `section === "Research" || format === "PROOF"`. Original section labels on cards are preserved — a Security / PROOF article is displayed with its real section, not relabeled as Research. PROOF articles from other sections are the primary population of the hub today; do not change this filter without considering that PROOF is the hub's source of truth.

## INTERNAL LINK INTEGRITY
Every internal link in built HTML must resolve to a real route. `bun run link:audit` runs against `dist/` and fails on any 404. Before adding or renaming any route:

1. Search the codebase for references to the old path.
2. Update every reference (article CTAs, navigation, redirects, JSON-LD).
3. Add a redirect if the URL was ever public — `src/pages/research/*.astro` files exist as 301 redirect entry points for legacy `/research/<slug>` URLs that now live at `/articles/<slug>`.
4. Run `bun run link:audit` after building.

Never ship a broken internal link. Never rely on the reader typing a URL correctly.

## PRIVACY BY MINIMUM COLLECTION
SECOND / PASS should collect the minimum data needed to perform the reader-requested action. Examples: newsletter: email + justified attribution only; research inquiry: contact + decision context; partner inquiry: contact + commercial context. Do not add fingerprinting, session replay, behavioral advertising, cross-site tracking without explicit business case and separate privacy review.

## COOKIE POLICY
SECOND / PASS does not display a cookie-consent banner merely as legal decoration. First audit actual storage/access technologies. IF no non-essential technology: no banner. IF non-essential technology exists: block it until valid preference/consent requirements are satisfied. Policies must describe reality, not hypothetical future tracking.

## SPONSORSHIP LABELING
If money or consideration pays for placement, label clearly: ADVERTISEMENT, SPONSORED, PARTNER MESSAGE, or another unmistakable designation. Never disguise paid placement as editorial evidence. Sponsor receives no editorial conclusion rights.
