# Operations

## Deployment

### Build
```bash
bun run build          # Astro build + Pagefind index
bun run check          # Type check
bun run content:audit  # Content validation
```

### Publishing
```bash
bun run article:new -- <slug>       # Scaffold new article
bun run article:verify -- <slug>    # Verify article quality
bun run prepublish -- <slug>        # Full prepublish pipeline
```

## Environment Variables

See `.env.example` for the complete list. Key groups:

- **Site**: `PUBLIC_SITE_URL`
- **Beehiiv**: `BEEHIIV_API_KEY`, `BEEHIIV_PUBLICATION_ID`, `BEEHIIV_NEWSLETTER_LIST_ID`
- **Resend**: `RESEND_API_KEY`, `LEADS_TO_EMAIL`, `LEADS_FROM_EMAIL`, `LEADS_BACKUP_EMAIL`
- **Feature toggles**: `PUBLIC_BRIEF_ENABLED`, `PUBLIC_COMMERCIAL_FORMS_ENABLED`, `PUBLIC_ANALYTICS_ENABLED`

Never prefix server secrets with `PUBLIC_`. Feature toggles are configuration, not security boundaries.

## Provider Hookup

### Beehiiv (BRIEF)
1. Create Beehiiv account and publication `SECOND / PASS / BRIEF`
2. Complete identity verification for API access
3. Choose double-opt-in policy
4. Generate minimum-permission subscription-write API key
5. Copy publication ID
6. Add env vars to Vercel: `BEEHIIV_API_KEY`, `BEEHIIV_PUBLICATION_ID`
7. Set `PUBLIC_BRIEF_ENABLED=true`
8. Redeploy
9. E2E test with a user-authorized test email

### Resend (Leads)
1. Create Resend account
2. Create API key
3. Set lead destination email (`LEADS_TO_EMAIL`)
4. Set sender email (`LEADS_FROM_EMAIL`)
5. Add env vars to Vercel
6. Set `PUBLIC_COMMERCIAL_FORMS_ENABLED=true`
7. Redeploy
8. Test partner + intelligence form submissions

### Vercel Analytics
1. Upgrade to Vercel Pro (required for commercial launch)
2. Enable Web Analytics in Vercel dashboard
3. Set `PUBLIC_ANALYTICS_ENABLED=true`
4. Redeploy

## Domain Migration

When `secondpass.net` is acquired:
1. Add domain to Vercel project `second-pass`
2. Configure apex `secondpass.net` as primary
3. Redirect `www.secondpass.net` to apex
4. Set `PUBLIC_SITE_URL=https://secondpass.net`
5. Verify in Resend (follow current official DNS instructions)
6. Redeploy
7. Verify: canonical, OG URLs, JSON-LD URLs, RSS, sitemaps, robots, search, favicon, 404
8. No `example.com` or Vercel alias as canonical

If Beehiiv needs a domain, use a non-conflicting subdomain (e.g., `brief.secondpass.net`) per Beehiiv's official instructions only.

## Rollback

Vercel deployments are immutable. To rollback:
1. Find known-good deployment in Vercel dashboard
2. Promote to production
3. No irreversible deployment choreography

## Monitoring

- Vercel/provider logs first for error monitoring
- Add another monitoring vendor only after a real operational need exists
- `/api/health` endpoint for basic readiness checks (never returns secrets)

## Commercial Launch Checklist

Before commercial public launch:
- [ ] Vercel Pro plan active
- [ ] `PUBLIC_SITE_URL` set to `secondpass.net`
- [ ] Domain verified and canonical
- [ ] Beehiiv credentials connected and E2E tested
- [ ] Resend credentials connected and E2E tested
- [ ] Demo stories removed or replaced
- [ ] `PUBLIC_ANALYTICS_ENABLED=true`
- [ ] Correct robots/indexing policy (remove noindex if present)
- [ ] All routes, APIs, search, forms verified
- [ ] Responsive QA at all breakpoints
