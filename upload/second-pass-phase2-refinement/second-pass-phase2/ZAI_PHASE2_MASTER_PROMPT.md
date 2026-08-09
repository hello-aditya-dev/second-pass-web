# Z.ai Phase 2 Master Prompt — SECOND / PASS

Work directly in the existing repository:

`witejackel-eng/second-pass-web`

Do not create another repository.
Do not start the content pipeline.
Do not write real news.
Do not choose a CMS.
Do not integrate an ad network, analytics provider, or newsletter provider.

This phase has one objective:

# FIX THE FOUNDATION COMPLETELY, THEN ELEVATE THE WEBSITE TO THE HIGHEST PRACTICAL UI/UX STANDARD BEFORE REAL CONTENT STARTS.

The website is already deployed to the Vercel project `second-pass`.

The current foundation is good. Your job is to make it production-hard, visually exceptional,
device-excellent, and honestly verified.

---

## OPERATING PHILOSOPHY

Move extremely fast.

Use:

`inspect → fix → run → view → refine → verify → commit`

Do not spend an hour debating reversible choices. Do not return only recommendations.

Speed does NOT authorize:
- fake verification;
- skipped errors;
- fabricated content;
- security regression;
- inaccessible interaction;
- destructive unrelated redesign.

Remove delay, not correctness.

---

# 1. READ THE CURRENT PRODUCT BEFORE CHANGING IT

Read completely:

- `AGENT.md`
- `README.md`
- `CURRENT_STATE.md`
- `DECISIONS.md`
- all `docs/*.md`
- `package.json`
- all lockfiles
- `astro.config.mjs`
- `src/content.config.ts`
- `src/lib/site.ts`
- `src/layouts/BaseLayout.astro`
- all components
- all routes
- `src/styles/global.css`
- all scripts

Also read the Phase 2 pack:

- `KNOWN_ISSUES_AND_GATE.md`
- `REFERENCE_vercel.json`

Do not replace the current Astro architecture unless an actual technical failure proves it necessary.

---

# 2. FIX ENGINEERING DEFECTS FIRST

Do this before visual polishing.

## Canonical / production origin

The deployed site must never emit `example.com`.

Until a custom domain exists, the canonical production origin is:

`https://second-pass.vercel.app`

Keep `PUBLIC_SITE_URL` overrideable for the future custom domain.

Verify on the DEPLOYED build:
- canonical URL;
- `og:url`;
- `og:image` absolute URL;
- RSS origin;
- sitemap origin;
- news sitemap origin.

Do not claim success by reading source code only.

## Package manager

The repo currently mixes npm instructions and Bun scripts.

Standardize on **Bun**.

Required:
- add a correct `packageManager` field;
- scripts use Bun consistently;
- README uses Bun consistently;
- regenerate `bun.lock` from the current `package.json`;
- remove duplicate package locks if present;
- remove stale `nextjs_tailwind_shadcn_ts` workspace metadata;
- clean install once after regeneration.

## Node

Avoid a broad `>=22.12.0` engine that can float across major releases.

The current Vercel project runs Node 24.x.
Pin `24.x` if Astro and installed dependencies verify correctly under it.
Keep `.nvmrc` aligned.

## Security headers

Add a committed `vercel.json`.

Use a conservative baseline appropriate for a static publication:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `Referrer-Policy: strict-origin-when-cross-origin`
- conservative `Permissions-Policy` disabling camera/microphone/geolocation/payment/USB because the site does not need them.

Vercel already supplies HSTS. Do not add conflicting HSTS configuration.

Do not add an impressive-looking CSP unless you test it against:
- Fontsource fonts;
- Astro CSS/assets;
- SVG assets;
- Pagefind;
- all routes;
- Vercel deployment behavior.

A correct smaller policy is better than a broken CSP.

## Active legacy cleanup

Search active code/docs for:
- Next.js
- nextjs
- shadcn
- HexFallow
- publication-web
- nextjs_tailwind_shadcn_ts
- TODO
- FIXME
- lorem
- `example.com`
- duplicate configs
- duplicate lockfiles
- stale framework instructions

Immutable foundation archives may retain historical content only if clearly treated as archive.

## README

Rewrite README as the real operator entrypoint.

It must cover:
- what SECOND / PASS is;
- product philosophy;
- why Astro;
- stack;
- Node + Bun requirements;
- Vercel deployment;
- environment variables;
- routes;
- typed MDX content model;
- newsroom/web separation;
- article publication handoff;
- Pagefind;
- RSS;
- sitemap/news sitemap;
- typography;
- desktop/tablet/mobile design;
- ad policy;
- security;
- current intentionally absent integrations;
- verification commands;
- pre-launch state.

---

# 3. KEEP THE BRAND, BUT MAKE THE PRODUCT LOOK FINISHED

Brand:

# SECOND / PASS

Promise:

> The first pass tells you what happened. The second pass tells you what it means.

Keep the slash structural.

Keep the current broad design direction:
- warm paper;
- black ink;
- graphite;
- signal blue;
- Bricolage Grotesque Variable for display;
- Newsreader Variable for reading;
- mono for metadata.

Do not turn it into:
- SaaS;
- cyberpunk;
- glassmorphism;
- a grid of rounded cards;
- a Financial Times clone;
- a generic AI blog.

Financial Times is a reference only for principles:
- editorial hierarchy;
- information density;
- repeated section rhythm;
- metadata consistency;
- typography carrying the design;
- selective mobile simplification.

Do NOT copy FT salmon, logo, fonts, or exact layouts.

---

# 4. HOMEPAGE — 10/10 PASS

The homepage must feel like a serious technical publication immediately.

## Above the fold

Required:
1. publication masthead;
2. topic navigation;
3. compact edition/prelaunch state;
4. one dominant lead;
5. useful `/ NOW`;
6. zero advertisement.

No startup-style marketing hero.
No paragraph explaining the product before showing journalism.

## Lead story

Torture-test temporary dev fixtures with:
- ~35-character headline;
- ~70-character headline;
- ~120-character headline;
- long model/product tokens.

The lead must remain striking without clipping, ridiculous line breaks, or collapsing hierarchy.

## `/ NOW`

NOW must feel time-forward and compact.
Do not make it just a smaller normal card.

## `/ SECOND PASS`

Analysis should have more visual weight and context than NOW.
Avoid a generic three-identical-card marketing grid if a more editorial composition is better.

## `/ DATA`

Treat DATA as an upcoming reference product, not marketing tiles.
Do not invent live metrics.

## `/ PROOF`

Give research/methodology a recognizable editorial treatment.

## `/ BRIEF`

Premium conversion surface, but:
- no fake subscribers;
- no email form before a provider exists;
- no popup.

## Commercial break

Only after meaningful reader value.
It should be quiet, clearly commercial/house content, and never dominate the viewport.

---

# 5. ARTICLE — THIS IS THE MOST IMPORTANT PAGE

Perfect this hierarchy:

`section / format → headline → dek → author/date/update → FIRST PASS → / SECOND PASS → evidence → body/data → sources → change log → / END → related/brief`

## Opening

Zero ad in the first viewport.
Zero ad before FIRST PASS.
Zero ad directly after FIRST PASS.

## Headline

Test short and extremely long technical headlines.

Requirements:
- no clipping;
- no page overflow;
- no absurd fallback font size;
- avoid one-word orphan where practical;
- product/model strings survive mobile.

## Reading body

Review:
- measure;
- paragraph rhythm;
- heading spacing;
- list spacing;
- inline links;
- blockquotes;
- code;
- figures;
- tables;
- captions.

The article should be unusually comfortable at 10–20 minutes of reading.

## FIRST PASS

This is a signature editorial object.
It must not look like a generic rounded callout card.

## Evidence

Desktop can use a useful rail.
Tablet/mobile should collapse evidence inline.
Prefer native `<details>` if it remains the best lightweight accessible behavior.

## Sources + change log

Dense, credible, highly scannable.

## `/ END`

Keep explicit completion.
No infinite-scroll article chaining.

---

# 6. TECHNICAL CONTENT TORTURE TEST

Create temporary NON-PUBLIC fixtures/tests for:

- 130-character headline;
- one 28+ character technical token;
- 12-row x 8-column table;
- source URL >120 characters;
- long code block;
- long dek;
- 10 evidence sources;
- 8 change-log entries.

Desktop:
use width intentionally.

Tablet/mobile:
tables horizontally scroll.
Never shrink technical data into unreadable text.

Remove temporary public fixtures before final commit. Test fixtures may remain outside public content if useful.

---

# 7. TABLET AND MOBILE ARE FIRST-CLASS PRODUCTS

Browser-test ALL of these widths:

- 1440
- 1024
- 820
- 768
- 430
- 390
- 375

Do not mark a width as verified because CSS contains a media query.

## Tablet

Specifically review:
- masthead transition;
- topic strip;
- lead hierarchy;
- NOW;
- article reading column;
- evidence rail collapse;
- table behavior;
- DATA;
- commercial break;
- footer.

No desktop side-ad concept.

## Mobile

Specifically review:
- compact masthead;
- wordmark;
- search access;
- horizontal topics;
- lead headline;
- NOW density;
- story spacing;
- body typography;
- FIRST PASS;
- evidence;
- tables;
- source URLs;
- change log;
- commercial break;
- BRIEF;
- footer.

No page-level horizontal overflow.
No sticky commercial UI.
Touch targets should be comfortable.

---

# 8. SEARCH

Keep Pagefind.

Refine and verify `/search` on the actual deployed build.

Need:
- clean initialization;
- query state;
- empty state;
- no-results state;
- result count;
- section/format metadata where helpful;
- safe excerpts;
- keyboard behavior;
- mobile design;
- Pagefind deployment assets.

Do not replace Pagefind with a paid service.

---

# 9. ADVERTISING EXPERIENCE

UX remains the moat.

Hard bans:
- popup;
- prestitial;
- interstitial;
- sticky bottom ad;
- sticky video;
- autoplay;
- ad above fold;
- ad before FIRST PASS;
- ad directly after FIRST PASS;
- ad inside table/code;
- ad between figure and explanation;
- ad inside evidence/sources;
- fake-native ad styled like a story.

Density ceilings:
- under 700 words: 0 inline;
- 700–1800: max 1;
- 1800+: max 2;
- optional end sponsor.

These are ceilings, not targets.

Keep explicit editorial `<AdBreak />` placement. Do not automate paragraph-count injection yet.

Test the commercial component at:
- 1440;
- 820;
- 430;
- 375.

For DATA, preserve the future whole-product sponsorship model instead of interrupting tables.

---

# 10. ACCESSIBILITY

Manual checks:
- keyboard through masthead;
- search;
- article navigation;
- details/evidence;
- footer;
- focus visibility;
- skip link.

Automated if available:
- Lighthouse accessibility;
- axe or equivalent.

Fix real issues found.
Do not require hover for important behavior.

---

# 11. PERFORMANCE

Preserve the static-first advantage.

Inspect:
- JS shipped on homepage;
- JS shipped on article;
- font requests;
- CSS size;
- Pagefind behavior;
- layout shift;
- commercial slot geometry.

No React island unless there is a concrete requirement.
No UI framework just for polish.
No animation library.

If adding a dependency, document the specific UX problem it solves.

---

# 12. SEO / PUBLICATION TECH

Verify the deployed result:

- canonical;
- meta title/description;
- OG/Twitter;
- Article/NewsArticle JSON-LD;
- datePublished/dateModified;
- RSS;
- normal sitemap;
- news sitemap;
- robots;
- favicon;
- 404.

Demo stories:
- remain clearly DEMO;
- stay out of RSS/news sitemap;
- should not be publicly indexed at launch.

Do not fake freshness.

---

# 13. VERCEL

Current project:

`second-pass`

Expected production alias:

`https://second-pass.vercel.app`

Expected framework:

`Astro`

After code changes:
1. push;
2. wait for Vercel deployment;
3. verify deployment READY;
4. inspect build log;
5. inspect response headers;
6. inspect deployed HTML;
7. inspect browser rendering.

Keep deployment protection/noindex during pre-launch.
Do not make it publicly indexable yet.

---

# 14. CREATE A REAL QA REPORT

Create:

`docs/QA_REPORT_PHASE2.md`

It must include:

## Engineering
Actual commands + results.

## Breakpoints
For every width:
- pages checked;
- issue found;
- fix made;
- remaining limitation.

## Pages
At minimum:
- homepage;
- NOW/section page;
- article;
- long-headline fixture;
- table fixture;
- DATA;
- SEARCH;
- BRIEF;
- policy page;
- 404.

## Interaction
- keyboard;
- evidence;
- search;
- topic strip;
- reading progress.

## Vercel
- deployment URL;
- deployment state;
- framework;
- canonical inspection;
- response headers.

Do not claim screenshots/checks you did not perform.

---

# 15. FINAL BUILD GATE

Use finalized Bun commands.

At minimum:

```bash
bun install
bun run content:audit
bun run check
bun run build
```

Confirm Pagefind indexing in the build.

Fix every foundation-level failure.

Then inspect residuals again.

---

# 16. DO NOT START THE CONTENT PIPELINE

This phase ends before real publication content.

Do NOT:
- research current news;
- publish a real story;
- connect newsroom automation;
- integrate CMS;
- integrate ads;
- integrate analytics;
- integrate newsletter provider.

We freeze the public product first.

---

# 17. PROJECT MEMORY + GIT

Update:
- `README.md`;
- `CURRENT_STATE.md`;
- `DECISIONS.md` only if durable decisions changed;
- `docs/QA_REPORT_PHASE2.md`.

Do not turn CURRENT_STATE into a diary.

Review the full diff.

Suggested commit:

`feat: harden and refine Second Pass publication experience`

Push only after the full gate passes.

---

# FINAL ACCEPTANCE REPORT

Return a structured report covering:

1. exact defects fixed;
2. files changed;
3. package-manager state;
4. Node state;
5. canonical/site URL state;
6. security headers;
7. legacy cleanup;
8. homepage improvements;
9. article improvements;
10. search improvements;
11. DATA improvements;
12. advertising UX;
13. desktop QA;
14. tablet QA;
15. mobile QA;
16. accessibility;
17. performance findings;
18. SEO/RSS/sitemaps/JSON-LD;
19. content audit;
20. Astro check;
21. production build;
22. Pagefind indexing;
23. Vercel deployment state;
24. deployed canonical inspection;
25. unresolved issues;
26. final gate status.

If any meaningful acceptance item remains unresolved, finish with exactly:

`PHASE 2: FAIL — NOT READY FOR CONTENT PIPELINE`

Only if everything applicable genuinely passes, finish with:

`PHASE 2: PASS — READY FOR FIRST REAL STORY`
