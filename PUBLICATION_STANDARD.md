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
- Content pipeline: Writers write `### / CALCULATION` etc. in Markdown and receive house treatment automatically. No HTML required. No Astro imports in Markdown. The renderer owns presentation.

## EVERY VISUAL MUST ANSWER A QUESTION
Before creating a figure, define: DECISION QUESTION. Each figure must have: figure_id, question, title, data/source basis, observed/calculated/scenario status, main takeaway, caveat, alt text, caption, mobile behavior.

## MATH STANDARD
- Ordinary money uses normal `$`. Example: "The request costs $0.0768." Single-dollar inline math is disabled.
- Display equations use `$$...$$`. No sentinel substitutions. Forbidden: 24182, 24183, 24190, 24191. No raw LaTeX outside math. Math exists to answer a question.

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

## PRIVACY BY MINIMUM COLLECTION
SECOND / PASS should collect the minimum data needed to perform the reader-requested action. Examples: newsletter: email + justified attribution only; research inquiry: contact + decision context; partner inquiry: contact + commercial context. Do not add fingerprinting, session replay, behavioral advertising, cross-site tracking without explicit business case and separate privacy review.

## COOKIE POLICY
SECOND / PASS does not display a cookie-consent banner merely as legal decoration. First audit actual storage/access technologies. IF no non-essential technology: no banner. IF non-essential technology exists: block it until valid preference/consent requirements are satisfied. Policies must describe reality, not hypothetical future tracking.

## SPONSORSHIP LABELING
If money or consideration pays for placement, label clearly: ADVERTISEMENT, SPONSORED, PARTNER MESSAGE, or another unmistakable designation. Never disguise paid placement as editorial evidence. Sponsor receives no editorial conclusion rights.
