# Master Prompt — Z.ai Builds the Publication Web Repository

Use this prompt with the attached `publication-web.zip`.

---

You are responsible for creating and establishing a new GitHub repository for a serious technical
intelligence publication.

I am giving you a ZIP named `publication-web.zip`. It contains the intended foundation and
operating instructions.

## PRIMARY OBJECTIVE

Create a repository named:

`publication-web`

Then turn the supplied foundation into a clean, verified, production-grade **public website
foundation** for the publication.

Do not merely upload files and stop. Inspect, understand, install, run, fix, verify, document, and
commit the project.

## 1. REPOSITORY CREATION

Create `publication-web` in my connected GitHub account.

Use a clear repository description such as:

> Public website for a technical intelligence publication covering AI systems, compute,
> semiconductors, infrastructure, security, and original technical data.

Do not make assumptions about public/private visibility if the platform requires an explicit
choice. If you can safely default, keep it private during foundation work.

Initialize the default branch normally.

## 2. PRESERVE THE ORIGINAL FOUNDATION ZIP

Add the supplied ZIP itself inside the repository at:

`archive/publication-web-foundation.zip`

The repository should also contain the **extracted project files**.

Do not attempt to run the Next.js app from inside the archive.

The archive is a reference snapshot only.

## 3. BOOTSTRAP FROM REPOSITORY MEMORY

Before modifying code, read completely:

- `AGENT.md`
- `README.md`
- `CURRENT_STATE.md`
- `DECISIONS.md`
- `BRAND_NAMES.md`
- all files under `docs/`

Treat `AGENT.md` as the product-engineering operating contract.

Do not rely on chat memory when repository documentation provides the answer.

## 4. WORKING BRAND

The starter uses:

`HexFallow`

as a **working name**, not a legally cleared final brand.

Do not purchase a domain or represent the name as trademark-cleared.

Keep branding centralized in `src/lib/site.ts` so it can be changed later without a rewrite.

Do not rename it to a generic name such as:
- AI Daily
- Tech Wire
- AI Insider
- Neural News
- Future Tech
- AI Pulse

The publication should feel distinctive.

## 5. PRODUCT DIRECTION

This is not a SaaS marketing site.

It is a technical publication for:
- software engineers;
- AI/ML engineers;
- infrastructure engineers;
- CTOs and engineering leaders;
- technical founders;
- security engineers;
- technical analysts.

Editorial territory:
- AI systems and model infrastructure;
- GPUs, accelerators, memory, networking, and data centers;
- semiconductors;
- cloud and developer infrastructure;
- cybersecurity;
- original technical datasets and benchmarks.

The visual product should feel like a modern engineering journal / intelligence publication.

Optimize for:
1. reading;
2. trust;
3. information density;
4. speed;
5. data visualization readiness;
6. mobile usability;
7. discoverability.

Avoid:
- huge empty SaaS hero sections;
- gratuitous gradients;
- glowing AI brains;
- robot stock imagery;
- excessive glassmorphism;
- scroll hijacking;
- WebGL decoration;
- enormous client bundles;
- fake testimonials;
- fake subscriber counts;
- fake journalist profiles;
- fake live data.

## 6. FOUNDATION TO PRESERVE AND IMPROVE

The ZIP should already contain:

- Next.js App Router
- React
- TypeScript strict mode
- server-first components
- homepage
- section routes
- dynamic article route
- sitemap
- robots
- manifest
- JSON-LD foundation
- policy/trust pages
- design system
- content adapter
- security headers
- docs

Inspect all of it.

Do not rewrite working architecture simply to demonstrate activity.

Fix anything incorrect, outdated, broken, inaccessible, or inconsistent.

## 7. TECHNOLOGY

Use the existing Next.js foundation.

Before changing framework/library versions, verify current official documentation and security
guidance.

Keep dependencies minimal.

Do not add a UI framework, animation framework, state manager, CMS SDK, database, authentication
system, or analytics package unless required by the current foundation task.

No CMS is selected yet.

No hosting provider is selected yet.

No ad provider is selected yet.

## 8. DESIGN FOUNDATION

Refine the implementation into a coherent editorial design system.

Must have:

### Global
- compact sticky/anchored publication header where appropriate
- clear section navigation
- strong typographic hierarchy
- readable line length
- intentional whitespace
- high contrast
- visible focus states
- responsive layout
- reduced-motion support

### Homepage
- one dominant lead story
- latest signal rail/list
- analysis/deep-read area
- data/benchmark modules
- clean newsletter conversion point
- no invented live statistics

### Article
- category/beat
- headline
- dek
- byline
- publish/update time
- reading flow
- key points only when useful
- tables/code/data styling
- source/citation area
- corrections/update support
- related stories
- newsletter CTA

### Data
Prepare `/data` as a first-class surface for future:
- LLM pricing tracker
- GPU database
- benchmark explorer

Seed data must be explicitly demo data.

## 9. SEO / DISCOVERABILITY FOUNDATION

Ensure:

- canonical metadata
- metadata templates
- crawlable semantic HTML
- sitemap
- robots
- stable clean URLs
- Article/NewsArticle JSON-LD as appropriate
- author URLs/identity model ready
- `datePublished`
- truthful `dateModified`
- Open Graph
- social image fallback
- breadcrumb architecture where useful
- RSS/Atom architecture documented even if not yet implemented
- future News Sitemap architecture documented
- no thin autogenerated tag pages
- no keyword stuffing
- no fake freshness

Do not create hundreds of SEO placeholder pages.

## 10. PERFORMANCE

Aim for an excellent publication baseline.

Prefer:
- Server Components
- static/server rendering
- minimal hydration
- CSS
- responsive image handling
- zero unnecessary third-party scripts

Check:
- layout shift
- font behavior
- navigation performance
- mobile responsiveness
- article rendering

## 11. ACCESSIBILITY

Verify:
- semantic landmarks
- skip-to-content
- heading order
- keyboard navigation
- focus states
- form labels
- contrast
- reduced-motion behavior
- accessible navigation
- no hover-only critical controls

## 12. SECURITY

Do not commit secrets.

Keep `.env.example` placeholder-only.

Review:
- headers
- external links
- server/client boundaries
- future form boundaries
- unsafe HTML usage
- dependency health

Do not weaken CSP/security headers merely to prepare hypothetical ad integrations.

## 13. CONTENT SAFETY / EDITORIAL INTEGRITY

The seed articles are demonstration content only.

Do not fabricate current technical news to make the site look populated.

Do not invent:
- sources
- journalists
- companies
- benchmark results
- traffic numbers
- subscribers
- sponsor logos

Real stories will later arrive only after the separate private newsroom workflow reaches human
approval.

## 14. README

Rewrite/improve `README.md` after verification so it accurately explains:

- what the repository is;
- separation from `publication-newsroom`;
- architecture;
- routes;
- local setup;
- commands;
- content model;
- branding;
- SEO;
- accessibility;
- security;
- deployment status;
- what is intentionally not integrated;
- future phases.

Do not leave boilerplate create-next-app README text.

## 15. VERIFICATION

Install dependencies and run:

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- `npm run verify`

Where browser tools are available, inspect at minimum:

- homepage desktop
- homepage mobile
- one section page
- one article page
- data page
- navigation
- footer
- keyboard focus
- console errors

Fix problems rather than merely documenting failures when they are within repository scope.

Perform a residual search for:
- TODO
- FIXME
- placeholder domains
- accidental secrets
- fake statistics
- generic create-next-app references
- broken internal links

Demo editorial content may remain only when explicitly labeled demo.

## 16. MEMORY MAINTENANCE

After work:

- update `CURRENT_STATE.md`;
- add durable architecture/product decisions to `DECISIONS.md`;
- do not turn either file into verbose activity logs.

## 17. GIT DISCIPLINE

Review the final diff.

Do not commit generated `.next`, `node_modules`, credentials, or local environment files.

Commit the complete foundation in an intentional commit such as:

`feat: establish technical publication web foundation`

If you make a second commit, it must represent a logically separate verified change.

## 18. FINAL ACCEPTANCE REPORT

Do not say "done" without reporting:

1. repository created;
2. extracted foundation present;
3. ZIP archived at `archive/publication-web-foundation.zip`;
4. framework versions actually installed;
5. pages/routes created;
6. design/accessibility work completed;
7. SEO foundation completed;
8. security review;
9. typecheck result;
10. lint result;
11. build result;
12. browser verification result if available;
13. unresolved items;
14. recommended next phase.

The end state should be a clean foundation that we can begin feeding approved technical content
into without rebuilding the website architecture.
