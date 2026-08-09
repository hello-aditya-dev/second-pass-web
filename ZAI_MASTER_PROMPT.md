# Z.ai Master Prompt — Build SECOND / PASS End to End

You are taking ownership of a new public website repository for **SECOND / PASS**, a technical
intelligence publication.

I am attaching `second-pass-web.zip`.

Your job is not to upload the archive and stop. You must create the repository, preserve the source
archive, extract and understand the foundation, install the real dependencies, run the product,
repair anything broken, materially refine the UI/UX where needed, verify all device classes, write
accurate repository documentation, and commit a launch-grade foundation.

Speed is an explicit operating principle. Work in a tight loop:

**inspect → decide → implement → run → inspect → fix → ship**

Do not turn implementation into a long recommendation exercise.

Speed does NOT authorize:
- fabricated data;
- fake sources;
- skipped build failures;
- weakened security;
- inaccessible UI;
- unapproved publishing;
- destructive Git actions.

Remove delay, not correctness.

---

## 1. CREATE THE REPOSITORY

Create a GitHub repository named:

`second-pass-web`

Recommended description:

> Public website for SECOND / PASS — technical intelligence on AI, compute, systems, security,
> research, and source-backed data.

Keep it private during foundation work unless visibility is explicitly specified otherwise.

Use a normal default branch.

---

## 2. PRESERVE THE FOUNDATION ZIP

The final repository must contain the original supplied starter archive at:

`archive/second-pass-web-foundation.zip`

The extracted application belongs at repository root.

The ZIP is a recovery/reference snapshot only.

Never run the website from inside the archive.

---

## 3. READ THE PROJECT MEMORY FIRST

Before changing code, read completely:

- `AGENT.md`
- `README.md`
- `CURRENT_STATE.md`
- `DECISIONS.md`
- every file under `docs/`
- `src/content.config.ts`
- `src/lib/site.ts`
- representative content under `src/content/articles/`
- the current layouts/components/pages/styles
- scripts under `scripts/`

The repository is project memory. Do not invent a conflicting architecture from chat context.

---

# PRODUCT

## 4. BRAND

The publication is:

# SECOND / PASS

Where slash punctuation is impractical, use:

`Second Pass`

Core promise:

> The first pass tells you what happened.  
> The second pass tells you what it means.

The slash is structural language, not a decoration gimmick.

Editorial/product labels:

- `/ NOW`
- `/ SECOND PASS`
- `/ DEEP`
- `/ PROOF`
- `/ DATA`
- `/ BRIEF`
- `/ SOURCES`
- `/ CHANGE LOG`
- `/ END`

Do not rename the publication.

Do not turn it into an AI-sounding startup brand.

---

## 5. AUDIENCE

Primary:

- software engineers
- AI/ML engineers
- infrastructure engineers
- security engineers
- CTOs and engineering leaders
- technical founders/product leaders
- researchers
- technically sophisticated analysts

Coverage:

- AI systems/model infrastructure
- inference/training/serving
- GPUs/accelerators
- memory/HBM
- networking/interconnect
- semiconductors
- data centers
- cloud
- databases
- distributed systems
- observability
- developer infrastructure
- cybersecurity
- technical research
- source-backed data/benchmarks

---

# PHILOSOPHY

## 6. SPEED ABOVE CEREMONY

Treat ambitious timelines as compressible.

Rules:

- think in hours/days, not weeks;
- parallelize independent work;
- make reversible decisions quickly;
- test rather than debate;
- ship coherent small increments;
- surface blockers immediately;
- keep feedback loops short;
- kill weak implementation paths quickly;
- do not add infrastructure before a measured need exists.

The website must also **feel** fast:
- immediate navigation;
- tiny/no hydration;
- no entrance animation;
- no loading theater;
- no scroll hijacking;
- no autoplay;
- no unnecessary network calls.

---

## 7. UX IS THE MOAT

This is the single most important product rule.

Do not optimize for maximum ad impressions.

Optimize for:
- reader return rate;
- comprehension;
- trust;
- speed;
- newsletter conversion;
- citation/share value;
- repeat use of data products.

A user must be able to read the complete story without:
- paywall obstruction in the launch model;
- popup interruption;
- sticky ads;
- sticky video;
- forced signup;
- interstitial;
- autoplay;
- infinite-scroll hijacking.

The user should receive meaningful value before seeing any commercial unit.

---

# VISUAL SYSTEM

## 8. FINANCIAL TIMES AS EDITORIAL INSPIRATION

Reference:
`https://www.ft.com/`

Use it for **principles only**, never visual copying.

Absorb:
- editorial density;
- hierarchy that makes many stories scannable;
- strong section modules;
- timestamps/metadata that aid trust;
- restrained visual chrome;
- repeated rules/alignment for orientation;
- typography doing the work instead of card decoration;
- desktop density with selective mobile reduction.

Do NOT copy:
- FT logo;
- FT typography;
- FT salmon/pink;
- proprietary layouts;
- exact module compositions;
- visual assets.

SECOND / PASS must be visibly its own publication.

Read `docs/FT_INSPIRATION.md`.

---

## 9. TYPOGRAPHY MUST BE DISTINCTIVE

The foundation intentionally uses:

### Bricolage Grotesque Variable
For:
- masthead;
- headlines;
- section names;
- navigation;
- large data numerals.

Use variable-font width/optical behavior subtly. Avoid generic Inter-style startup typography.

### Newsreader Variable
For:
- long-form prose;
- standfirst/dek;
- human-readable editorial material.

### System monospace
For:
- timestamps;
- labels;
- units;
- source types;
- change logs;
- evidence state.

Do not replace this with a normal news-site serif/sans pairing unless there is a demonstrably better
result and the change remains distinctive.

No font files should be committed manually from unknown sources. Use the installed open-source font
packages.

---

## 10. COLOR

Core:

- paper `#F2EFE7`
- ink `#11110F`
- graphite `#5A5953`
- rule `#C8C3B8`
- signal blue `#2F5BFF`

Do not copy FT salmon.

Signal blue is limited to:
- slash;
- active links/states;
- source/evidence emphasis;
- important data;
- selected commercial/product calls to action.

Do not wash entire surfaces in blue.

---

## 11. DESIGN LANGUAGE

Use:

- strong typography;
- thin editorial rules;
- asymmetric grids;
- compact metadata;
- controlled density;
- large headlines;
- charts;
- diagrams;
- tables;
- real technical imagery;
- the slash;
- whitespace used as hierarchy rather than emptiness.

Avoid:

- rounded-card-everywhere UI;
- generic blog templates;
- SaaS hero;
- glassmorphism;
- gradients for decoration;
- neon cyberpunk;
- glowing AI brains;
- robot stock art;
- excessive shadows;
- 3D/WebGL decoration;
- meaningless motion;
- carousel-heavy homepage;
- giant empty sections.

---

# INFORMATION ARCHITECTURE

## 12. REQUIRED ROUTES

At minimum:

- `/`
- `/now`
- `/latest`
- `/ai`
- `/compute`
- `/systems`
- `/security`
- `/research`
- `/data`
- `/search`
- `/brief`
- `/about`
- `/editorial-policy`
- `/corrections`
- `/privacy`
- `/articles/[slug]`
- `/rss.xml`
- `/news-sitemap.xml`
- `/robots.txt`
- normal Astro sitemap output
- custom 404

Do not create hundreds of empty topic/tag pages.

---

# HOMEPAGE

## 13. HOMEPAGE HIERARCHY

It should feel editorially rich without feeling noisy.

Above fold:

1. masthead;
2. compact topic navigation;
3. edition/status line;
4. one dominant lead story;
5. `/ NOW` rail/list.

**No advertisement above fold.**

After that:

- `/ SECOND PASS`
- one natural commercial/house break
- `/ DATA`
- `/ PROOF`
- `/ BRIEF`

Future sections can grow from real editorial volume.

Do not invent “Most read” before analytics exists. Once real analytics exists, it can be added based
on measured data.

Do not invent subscriber counts.

---

# ARTICLE EXPERIENCE

## 14. ARTICLE ANATOMY

Required:

1. section / format
2. headline
3. dek
4. author
5. published date
6. updated date when meaningful
7. FIRST PASS
8. `/ SECOND PASS` analysis/body
9. evidence presentation
10. technical tables/code/charts
11. sources
12. change log
13. `/ END`
14. `/ BRIEF`

The first screen must contain zero ads.

FIRST PASS must appear before any commercial placement.

The user should obtain the essential verified development rapidly.

---

## 15. EVIDENCE UX

Desktop:
- evidence can occupy a useful right rail;
- use compact disclosure components;
- preserve source type and link;
- do not make users leave the article merely to understand evidence classification.

Tablet:
- rail collapses inline.

Mobile:
- evidence becomes inline disclosure/bottom-sheet only if implementation remains lightweight and
  accessible.

Native `<details>` is preferred over a JS modal unless a richer interaction genuinely earns its cost.

---

## 16. TABLES / DATA

Technical tables are a major product surface.

Desktop:
- allow wider comparison tables.

Tablet/mobile:
- horizontal scroll;
- never shrink to unreadable typography;
- give clear continuation affordance;
- sticky first column is acceptable only if robust.

Future high-value interaction:
`ALL / CHANGES ONLY`

Implement only if it remains tiny, accessible, and genuinely useful.

---

# MOBILE / TABLET

## 17. DEVICE-SPECIFIC DESIGN

Do not build desktop and merely compress it.

Verify:

- 1440 desktop
- 1024 tablet landscape
- 820 tablet portrait
- 768 tablet
- 430 mobile
- 390 mobile
- 375 mobile

### Tablet
- approximately 8-column editorial logic;
- article body ~650–720px;
- no desktop side-ad layout;
- desktop evidence rails collapse inline;
- strong readable type;
- topic strip horizontally scrollable where needed.

### Mobile
- approximately 4-column logic;
- compact masthead;
- horizontally scrollable topic strip;
- 18–19px long-form reading type;
- generous line height;
- large headlines that still wrap intelligently;
- full-width/edge-expanded charts when useful;
- tables scroll;
- touch targets ~44px+;
- no commercial sticky UI;
- remove nonessential metadata instead of shrinking it.

No horizontal page overflow.

---

# ADVERTISING

## 18. COMMERCIAL PRODUCT RULES

Advertising must never depreciate the core UX.

Priority:

1. direct sponsors
2. `/ DATA` product sponsorship
3. `/ BRIEF` sponsorship
4. premium display
5. programmatic fallback

Hard bans:

- popup ads
- prestitials
- interstitials
- full-screen takeovers
- sticky bottom ads
- sticky side ads following the reader
- sticky video
- autoplay sound/video
- ad between headline and FIRST PASS
- ad directly after FIRST PASS
- ad inside a table
- ad between a chart and its explanation
- fake-native units styled like news
- commercial units inside evidence/source UI

### Density ceilings

Under 700 words:
- zero inline ads

700–1,800 words:
- maximum one inline

1,800+:
- maximum two inline

Optional:
- one end/sponsor unit

These are ceilings, not targets.

### Homepage

- zero above-fold advertising
- at most two display breaks in the main homepage flow initially

### Data products

Prefer:

`/ DATA — SUPPORTED BY [SPONSOR]`

with an uninterrupted tool.

Do not pepper a pricing/benchmark table with display ads.

### Layout stability

Reserve dimensions for real ad units.

When unsold:
use a tasteful house unit:
- `/ BRIEF`
- `/ DATA`
- important article

Do not leave a giant blank hole.

---

# INTERACTIONS

## 19. MOTION

Interaction should feel immediate.

Target feel:
- 100–160ms state response
- no decorative page-entry choreography
- no smooth-scroll library
- no scroll hijacking
- honor `prefers-reduced-motion`

Reading progress:
- tiny top rule on long articles
- no gamification

No infinite-scroll articles. Every article has a clear `/ END`.

---

# STACK

## 20. KEEP THE CHOSEN STACK UNLESS A REAL PROBLEM EXISTS

Foundation stack:

- Astro 7
- TypeScript strictest
- Astro Content Collections
- MDX
- `@astrojs/sitemap`
- `@astrojs/rss`
- Pagefind
- Fontsource
- custom CSS
- vanilla JS

Astro is used because this is a content-first publication and static delivery gives us speed,
reliability, easy caching, and tiny client JS.

### Intentionally rejected for launch

#### T3 Stack
Wrong problem. Auth/tRPC/database complexity provides no launch advantage.

#### Open SaaS by Wasp
Billing/auth/SaaS product concerns are irrelevant.

#### Next.js SaaS starters
App/dashboard assumptions are unnecessary.

#### AstroWind / Astroship
Useful template projects, but we want a custom editorial identity rather than inheriting a generic
template's information architecture.

#### Cruip
Strong marketing templates, but would pull the product toward SaaS landing-page conventions.

#### shadcn/Radix
Do not add a component framework merely because it is popular. Add a primitive later only when a
real interaction demands it.

Use a package only if it removes more complexity than it introduces.

---

# CONTENT MODEL

## 21. GIT-NATIVE CONTENT FIRST

No CMS at launch.

Articles are typed MDX content-collection entries.

Why:
- zero additional cost;
- Z.ai already works through GitHub;
- content is versioned;
- approvals can be expressed in Git;
- corrections are inspectable;
- publishing has no external CMS UI/API bottleneck.

A CMS is allowed only when Git-native publishing becomes a measured bottleneck through:
- multiple editors;
- preview pain;
- repeated schema mistakes;
- high sustained publishing volume;
- nontechnical editorial contributors.

Do not pre-emptively solve this.

---

# PUBLISHING SPEED

## 22. THE WEBSITE MUST NEVER BE THE NEWS BOTTLENECK

After human approval, a simple article should take minutes to publish.

Canonical flow:

1. private newsroom finishes research, verification, writing, edit, human approval;
2. public-safe handoff package arrives;
3. run `npm run article:new -- story-slug`;
4. copy only approved public content into generated MDX;
5. add public-safe media;
6. run `npm run content:audit`;
7. run `npm run check`;
8. run `npm run build`;
9. visually inspect only if custom structure/media changed;
10. commit `publish: story-slug`;
11. push;
12. deployment begins.

Technical handoff target:
**under 10 minutes** for an ordinary article.

For a breaking article with a custom graphic:
publish the verified text first if timing matters; add the verified graphic as a meaningful update
with `/ CHANGE LOG`.

Do not hold an accurate two-hour story for a two-day illustration.

---

## 23. TWO CONTENT LANES

### FAST LANE
For meaningful breaking technical developments.

Operating target:

- 00:00 detected
- 00:05 significance decision
- 00:15 primary sources
- 00:30 angle
- 00:50 research
- 01:10 draft
- 01:25 verify
- 01:40 edit
- 01:50 human approval
- 02:00 web handoff

This is a target, not permission to fake certainty.

### DEEP LANE
For:
- benchmarks
- architecture
- cost models
- datasets
- investigations
- long technical reports

Ship useful intermediate public artifacts when they are independently valuable. Do not manufacture
updates just to create volume.

---

# SEARCH / DISCOVERY

## 24. PAGEFIND

Use Pagefind for launch search.

It indexes static output after Astro builds and avoids paid search infrastructure.

Keep search UI custom so it matches SECOND / PASS rather than a generic widget.

Exclude navigation/commercial chrome from indexing where appropriate.

---

## 25. RSS / NEWS SITEMAP / SEO

Verify:

- canonical URLs
- clean page titles/descriptions
- semantic HTML
- Article/NewsArticle schema
- author model
- truthful datePublished/dateModified
- RSS
- sitemap
- news sitemap
- robots
- Open Graph
- social image fallback
- internal links
- crawlable body text

News sitemap:
- recent eligible real stories only;
- demo content excluded;
- do not dump the archive into it.

Do not fake dates for freshness.

Do not generate thin SEO pages.

---

# PERFORMANCE

## 26. PERFORMANCE IS UX

Internal ambitions after real measurement:

- LCP < 1.5s
- INP < 100ms
- CLS < 0.05

Do not claim these without measurement.

At launch:
- static output
- no framework JS bundle
- no analytics script
- no ad script
- no CMS client
- no video
- local/open-source font packages
- explicit media dimensions
- tiny vanilla JS only

When analytics or ads are later added:
add one vendor at a time and measure regression.

---

# ACCESSIBILITY

## 27. REQUIRED

- semantic landmarks
- skip link
- visible focus
- logical heading order
- keyboard navigation
- accessible disclosure controls
- form labels
- meaningful alt text
- adequate contrast
- reduced motion
- no hover-only function
- usable touch targets
- data/table accessibility

Do not sacrifice accessibility for visual novelty.

---

# SECURITY

## 28. REQUIRED

Never commit:
- passwords
- access tokens
- API keys
- cookies
- private keys
- private newsroom files
- confidential research

No arbitrary untrusted HTML rendering.

Future newsletter/provider secrets remain server-only.

Review every third-party script before adding it.

Do not relax security headers pre-emptively for hypothetical ad vendors.

---

# DEMO CONTENT

## 29. NO FABRICATED LIVE NEWS

The foundation has demo content.

It must be clearly marked.

Do not invent:
- current headlines
- benchmark results
- prices
- sources
- authors
- subscriber counts
- most-read statistics
- sponsors
- traffic counts

Before public editorial launch, demo articles should be removed or excluded and replaced by
human-approved real work.

---

# VERIFICATION

## 30. INSTALL AND RUN EVERYTHING

First inspect package versions against current official sources and update only when appropriate.

Then:

```bash
npm install
npm run content:audit
npm run check
npm run build
```

The build includes Pagefind indexing.

Fix all failures caused by the project.

Do not report a failed command as acceptable.

Search final output/repo for:
- TODO
- FIXME
- Lorem ipsum
- create-astro boilerplate
- example secrets
- accidental keys
- broken internal routes
- fake metrics
- fake sponsors
- unexpected horizontal overflow

---

# BROWSER QA

## 31. VISUAL VERIFICATION IS MANDATORY WHEN TOOLS EXIST

Run the site and inspect:

### Desktop
1440px

### Tablet
1024px
820px
768px

### Mobile
430px
390px
375px

At minimum inspect:
- homepage
- topic page
- article
- long headline
- FIRST PASS
- evidence panel
- table
- `/ DATA`
- `/ SEARCH`
- `/ BRIEF`
- ad/house unit
- footer
- 404

Check console.

Check keyboard.

Check touch/navigation behavior.

Fix issues; do not just list them.

---

# README / MEMORY

## 32. FINAL DOCUMENTATION

Rewrite/improve README only after actual verification.

It must accurately explain:
- product
- stack
- architecture
- routes
- design
- typography
- content model
- newsroom separation
- fast publishing workflow
- search
- SEO
- ads
- mobile/tablet
- development commands
- verification
- what is still intentionally unintegrated

Update:
- `CURRENT_STATE.md`

Update `DECISIONS.md` only for durable decisions.

---

# GIT

## 33. COMMIT DISCIPLINE

Review diff.

Never commit:
- node_modules
- dist
- `.astro`
- local `.env`
- secrets
- caches

Suggested initial commit:

`feat: establish Second Pass publication foundation`

Push to the connected GitHub repository.

---

# FINAL ACCEPTANCE REPORT

## 34. DO NOT JUST SAY DONE

Report:

1. repository created + URL
2. foundation archive preserved
3. installed Astro version
4. installed integration versions
5. build architecture
6. routes
7. content model
8. design/typography result
9. FT-inspired principles incorporated without copying
10. desktop QA
11. tablet QA
12. mobile QA
13. article UX
14. evidence UX
15. ad architecture
16. data UX
17. Pagefind search
18. RSS
19. normal sitemap
20. news sitemap
21. structured data/SEO
22. accessibility
23. performance findings
24. security/dependency findings
25. `content:audit`
26. `astro check`
27. production build
28. unresolved issues
29. exact next action

The goal is not a pretty starter. The goal is a distinctive, extremely fast, technically credible
publication foundation whose UX is good enough to become a competitive advantage and whose
publishing workflow never slows the newsroom down.
