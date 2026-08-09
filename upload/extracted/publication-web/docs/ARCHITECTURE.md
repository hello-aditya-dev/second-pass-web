# Architecture

## Separation of concerns

```text
private newsroom repo
      |
human-approved content
      v
CMS or content adapter
      |
      v
publication-web
      |
      v
reader / search / newsletter / ads
```

The public application must never require the private newsroom repository at runtime.

## App

Next.js App Router.

Server Components are the default.

## Content

Phase 0:
`src/lib/content.ts`

Later:
a CMS adapter implements the same conceptual shape.

## Core layers

### `src/app`
Routes, metadata, server rendering.

### `src/components`
Reusable editorial UI.

### `src/lib`
Site config, content types, seed repository, SEO/schema helpers.

### `content`
Documentation/sample import staging only until CMS decision.

### `public`
Static brand/social assets.

## Future integrations

Add one at a time:
1. CMS
2. newsletter provider
3. privacy-respecting analytics
4. search service if static search is insufficient
5. ad stack after audience exists

Do not couple these concerns prematurely.
