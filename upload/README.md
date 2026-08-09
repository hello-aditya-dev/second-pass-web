# HexFallow — Publication Web

> Working name. The brand can be changed from one configuration file before launch.

HexFallow is the public web product for a technical intelligence publication covering AI systems,
compute, semiconductors, cloud/developer infrastructure, security, and original technical data.

This repository is deliberately separate from the private `publication-newsroom` repository.

- **This repository:** public website, UI, SEO, article rendering, data experiences, public policies.
- **Newsroom repository:** research, source strategy, drafts, fact-checking, editorial memory,
  unpublished ideas, and internal operations.

## Current foundation

This starter includes:

- Next.js 16 App Router + React 19 + TypeScript
- responsive editorial homepage
- Latest, AI, Compute, Infrastructure, Security, Research, and Data routes
- reusable article cards, masthead, navigation, newsletter CTA, footer, and data cards
- dynamic article route with seed editorial content
- metadata foundation, sitemap, robots, manifest, canonical URLs, Open Graph defaults
- Article JSON-LD foundation
- editorial policy, corrections, privacy, about, and newsletter pages
- zero-third-party UI dependency design system
- security headers
- CMS-ready content boundary
- architecture, content model, design, SEO, security, launch, and monetization docs
- strict Z.ai operating contract in `AGENT.md`
- Z.ai repo-creation/build prompt in `ZAI_MASTER_PROMPT.md`
- an archived copy of the foundation ZIP under `archive/`

## Working brand

The code currently uses **HexFallow** as a temporary working identity.

Change:

`src/lib/site.ts`

before launch if another name is selected.

### Shortlist

See `BRAND_NAMES.md`.

## Start locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Before any production launch:

```bash
npm run verify
```

## Content architecture

Phase 0 uses typed seed content in:

`src/lib/content.ts`

This is intentional. It lets the public product be developed before committing to a CMS.

The site code should consume a stable content interface. Later, replace the seed adapter with a CMS
adapter without rewriting page components.

See `docs/CONTENT_MODEL.md`.

## Editorial architecture

A story should reach this repository only after the private newsroom process reaches human approval:

`DISCOVER → RESEARCH → ANALYZE → VERIFY → WRITE → EDIT → HUMAN APPROVAL → PUBLIC WEBSITE/CMS`

Never copy the private newsroom repository into this repository.

## Design principles

- publication, not SaaS landing page
- high information density without clutter
- typography and hierarchy over decorative effects
- fast pages and minimal client JavaScript
- data/tables/diagrams as first-class editorial objects
- restrained motion
- accessible contrast and keyboard navigation
- strong mobile reading experience
- ads must never overwhelm editorial content

## Routes

- `/`
- `/latest`
- `/ai`
- `/compute`
- `/infrastructure`
- `/security`
- `/research`
- `/data`
- `/articles/[slug]`
- `/search`
- `/newsletter`
- `/about`
- `/editorial-policy`
- `/corrections`
- `/privacy`
- `/sitemap.xml`
- `/robots.txt`

## Deployment

No hosting provider is hard-coded into the foundation.

Choose a provider whose terms and pricing support a commercial publication before enabling
advertising.

## Repository rules

Read `AGENT.md` before any agent makes changes.

## Status

Foundation only. No claim in the seed articles should be treated as live news. Seed content is
clearly marked as demonstration content and should be replaced before public launch.
