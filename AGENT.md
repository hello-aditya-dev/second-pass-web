# AGENT — SECOND / PASS Web

**BEFORE ANY CONTENT/PUBLICATION WORK: READ `PUBLICATION_STANDARD.md` COMPLETELY.**

## Mission

Build and maintain the fastest, most useful, most legible technical publication experience in its
category. UX is a primary moat.

## Speed philosophy

Default behavior:
- think in hours and days, not weeks;
- ship small coherent improvements;
- parallelize independent work;
- prefer reversible decisions;
- test instead of debating;
- keep dependencies minimal;
- remove blockers immediately.

Speed never means fabricating facts, skipping security, weakening accessibility, publishing
unapproved drafts, or ignoring known build failures.

Remove delay, not correctness.

## Startup

Before work:
1. read this file;
2. read `CURRENT_STATE.md`;
3. read `DECISIONS.md`;
4. read relevant `docs/`;
5. inspect existing implementation;
6. verify before large rewrites.

## Public/private boundary

The private newsroom repo owns discovery, raw research, evidence dossiers, internal fact checking,
unpublished drafts, and source strategy.

This repo owns public pages, approved article files, public sources, diagrams, charts, public data,
UX, SEO, ads, and newsletter surfaces.

Never copy private newsroom material here.

## Framework

Astro-first. Do not migrate to T3, Open SaaS, Next.js SaaS starters, AstroWind, Astroship, Cruip, or
generic shadcn templates without explicit approval and a concrete requirement.

## JavaScript budget

Prefer:
1. HTML/CSS
2. native browser primitives
3. tiny vanilla JS
4. Astro islands only when needed

Do not add React for simple menus, disclosures, tabs, or filters.

## Design

Avoid:
- rounded card grids everywhere
- gradients as decoration
- glassmorphism
- startup hero layouts
- decorative 3D
- glowing AI imagery
- slow motion

Use:
- typography
- rules
- asymmetric editorial grids
- diagrams
- data
- the slash
- intentional density

## Devices

Every substantive UI change must consider:
- 1440 desktop
- 1024 tablet landscape
- 820 tablet portrait
- 430 mobile
- 375 mobile

Tablet is not compressed desktop. Mobile is not compressed tablet.

## Advertising

Read `docs/AD_SYSTEM.md`.

Hard bans:
- no popup/prestitial/interstitial
- no sticky bottom ad
- no sticky video
- no autoplay sound
- no ad between chart and explanation
- no ad inside data table
- no ad disguised as editorial
- no ad before FIRST PASS

## Publishing

Only human-approved content may use `status: published`.

## Production indexing contract

`SITE_PRELAUNCH` is fail-safe. Both `src/layouts/BaseLayout.astro` and `src/pages/robots.txt.ts` use `import.meta.env.SITE_PRELAUNCH !== "false"`:

- **missing** → PRELAUNCH (noindex + `Disallow: /`)
- `"true"` → PRELAUNCH
- `"false"` → PUBLIC (`Allow: /`, indexable)

This means missing or unset always falls back to prelaunch, never to public. The committed `.env` file is gitignored and **local-only** — it does not affect Vercel deployments. To make production indexable, `SITE_PRELAUNCH=false` MUST be set in the Vercel project's Environment Variables (Settings → Environment Variables → Production), then a redeploy triggered. This is a Vercel-side configuration step; it cannot be performed from the repo.

Never weaken the fail-safe. Never commit a real `.env`. If asked to "make the site live," the answer is: repo is already live; Vercel env var is the only remaining step.

When modifying indexing logic, update `scripts/indexability-audit.mjs` to keep its cross-check against `CURRENT_STATE.md` accurate.

## Inline math convention

Single-dollar inline math (`$...$`) is **disabled** (`singleDollarTextMath: false` in the remark-math config). This is intentional for currency safety — articles routinely use `$0.0768`, `$5`, etc.

| Use case       | Syntax                                |
| -------------- | ------------------------------------- |
| Inline math    | `<imath>...</imath>`                  |
| Display math   | `$$...$$`                             |
| Currency       | `$0.0768` (plain text, untouched)     |

`<imath>` is a non-standard HTML tag that does not render in the browser. After `astro build`, `scripts/process-inline-math.mjs` walks `dist/` and replaces every `<imath>` with rendered KaTeX inline HTML. The build pipeline runs this automatically (`bun run math:inline` is part of `bun run build`). If you skip the post-build step (e.g. running `astro build` directly), inline math will not render.

`bun run math:audit` detects single-dollar math in source and unrendered `<imath>` in built HTML. Treat any report as a build-breaking failure.

## House-object canonical source syntax

Source headings produce rendered house editorial objects via `src/lib/rehype-house-objects.mjs`:

| Source Markdown heading        | Rendered as                            |
| ------------------------------ | -------------------------------------- |
| `## / CALCULATION — "title"`   | `<section class="calculation-block">`  |
| `## / CLAIM CHECK — "title"`   | `<section class="claim-check">`        |
| `### / ASSUMPTION — "title"`   | `<section class="assumption-block">`   |
| `## / INTELLIGENCE`            | `<section class="intelligence-block">` |

The `— "title"` portion is optional. Use it for CALCULATION and CLAIM CHECK; omit for INTELLIGENCE.

### Labels on their own line

Inside a house object, labels (QUESTION, ASSUMPTIONS, EQUATION, RESULT, SO WHAT, CAVEAT, CLAIM, WHAT THAT MEASURES, WHAT IT DOES NOT MEASURE, WHEN IT IS USEFUL, WHEN IT IS NOT ENOUGH, SECOND / PASS) may appear on their own line as a separate paragraph containing only `**LABEL**`. When this happens, the renderer consumes subsequent sibling paragraphs/tables/lists as that label's content. Example:

```markdown
## / CALCULATION — break-even utilization

**QUESTION**

At what GPU utilization does disaggregation pay back the extra network hop?

**RESULT**

~63%, under the assumptions below.
```

The renderer chooses the container element by content:
- single `<p>` with only inline children → re-tagged to the label's preferred element (e.g. `<p class="calc-result">`)
- block-level content (table, list, display-math) → wrapped in a `<div>` to keep HTML valid

When editing a house object, never put a label and its content on the same line — the forward-scan label processor only triggers when the label is alone in its paragraph.

`bun run house-object:audit` verifies structural integrity. Treat any missing-or-malformed report as build-breaking.

### Canonical intelligence CTA

Every published article ends with a `/ INTELLIGENCE` block containing exactly one CTA, written as a Markdown link:

```markdown
[START A RESEARCH BRIEF →](/intelligence)
```

Do not use the older `**START A RESEARCH BRIEF →**` + `` `/intelligence` `` backtick-literal form. The Markdown link form is required.

## Homepage curation contract

The homepage is editorially curated via two integer frontmatter fields:

- **`featured`** (boolean) — gates hero eligibility. Only `featured: true` articles can become the hero.
- **`featuredRank`** (integer) — lower = higher hero priority. `featuredRank: 0` means "not a hero candidate" — used for featured articles that should not be the hero.

The hero is the `featured: true` article with the lowest `featuredRank`. It is then excluded from the secondary sections so it does not appear twice.

Secondary sections filter by `format` ONLY — no cross-format mixing:
- `/ NOW` → `format === "NOW"` (slice 5)
- `/ SECOND PASS` → `format === "SECOND PASS"` ONLY (slice 3) — never include PROOF
- `/ PROOF` → `format === "PROOF"` ONLY (slice 2)

Never relax the format-purity filter. Never select the hero by filesystem order or `publishedAt` alone.

## Deterministic article ordering

Section pages and feeds sort by a three-key contract (see `src/lib/content.ts`):

```
1. publishedAt    DESC  (newest first)
2. editorialOrder DESC  (higher = higher in section list)
3. slug            ASC  (stable tie-breaker)
```

`editorialOrder` is an integer frontmatter field. Within a single publish date, assign higher `editorialOrder` to the article that should appear first in its section. Example for Security on 2026-08-10:

- deployment provenance — `editorialOrder: 3`
- network egress / agent authority — `editorialOrder: 2`
- prompt injection — `editorialOrder: 1`

Never rely on filesystem ordering or slug alphabetical to control section order — always set `editorialOrder` explicitly.

## Research hub semantics

`/research` aggregates `section === "Research" || format === "PROOF"`. Original section labels on cards are preserved — a Security / PROOF article is displayed with its real section, not relabeled as Research. Do not change this filter without considering that PROOF articles are the primary population of the hub today.

## Internal link integrity

Every internal link in built HTML must resolve to a real route. `bun run link:audit` runs `scripts/link-integrity-audit.mjs` against the built `dist/` directory and fails on any 404. Before adding or renaming any route:

1. Search the codebase for references to the old path
2. Update every reference (article CTAs, navigation, redirects, JSON-LD)
3. Add a redirect if the URL was ever public — `src/pages/research/*.astro` files exist as 301 redirect entry points for legacy `/research/<slug>` URLs that now live at `/articles/<slug>`
4. Run `bun run link:audit` after building

Never ship a broken internal link. Never rely on the user typing a URL correctly.

## Completion

Before finishing:
- `bun run content:audit`
- `bun run check`
- `bun run build`
- `bun run math:audit`
- `bun run link:audit`
- `bun run house-object:audit`
- `bun run indexability:audit`
- update `CURRENT_STATE.md`

Do not claim verification you did not run.
