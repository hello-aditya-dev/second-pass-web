# COOKIE AND STORAGE AUDIT

**Date:** 2026-08-10
**Scope:** All source files under `src/`, built output, and runtime components

## Findings

### document.cookie
- **Not found** in any source file.

### Set-Cookie
- **Not found** in any API route or middleware.

### localStorage
- **Not found** in any source file.

### sessionStorage
- **Not found** in any source file.

### IndexedDB
- **Not found** in any source file.

### Service Workers
- **Not found**. No `navigator.serviceWorker` registration. The site uses a web manifest (`/manifest.webmanifest`) for PWA metadata but does not install a service worker.

### Analytics Scripts
- **Vercel Web Analytics** (`/_vercel/insights/script.js`) is conditionally loaded when:
  - `PUBLIC_ANALYTICS_ENABLED === "true"` AND
  - `SITE_PRELAUNCH !== "false"` is false (i.e., site is public)
- Analytics is behind a feature flag and only active in production public mode.
- Vercel Web Analytics collects anonymized pageview data. No PII is sent (verified in `src/lib/analytics.ts`).
- Analytics can be blocked by browser privacy extensions or by disabling JavaScript.

### Tracking Pixels
- **Not found**.

### Ad Scripts
- **Not found**. The `AdBreak` component is a static house promotion, not an external ad network.

### Affiliate Tracking
- **Not found**.

### Session Replay
- **Not found**.

### Heatmaps
- **Not found**.

### Social Widgets
- **Not found**. Share buttons use simple URL construction, not embedded third-party widgets.

### CAPTCHA
- **Not found**. Forms use honeypot (`_hp`) and same-origin validation instead.

### Fingerprinting
- **Not found**.

### Third-Party Scripts
- **KaTeX** CSS only (math rendering, no tracking).
- **Vercel Analytics** (conditional, see above).
- No other third-party JavaScript.

## Cookie Banner Decision

**NO cookie consent banner is required.**

**Reason:** The site sets no cookies, uses no localStorage/sessionStorage/IndexedDB, has no service worker, no tracking pixels, no ad scripts, no session replay, no fingerprinting, and no social widgets. The only potentially non-essential technology is Vercel Web Analytics, which:
1. Is behind an explicit feature flag (`PUBLIC_ANALYTICS_ENABLED`)
2. Only activates when the site is in public mode
3. Sends no PII
4. Can be blocked by standard browser privacy controls

If Vercel Web Analytics is considered non-essential under a strict interpretation, it is already gated behind a feature flag and could be disabled without affecting site functionality. No additional consent mechanism is needed because the technology can be trivially blocked by the user's browser and is not activated by default.

If a future analytics provider, advertising network, or other non-essential storage technology is added, this audit must be revisited and a consent mechanism implemented before deployment.
