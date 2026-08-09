# Backend Specification

## `/api/brief-subscribe`
Input: email, source, supported UTM fields, referring_site, honeypot.

Requirements:
- POST + JSON only
- strict body-size and length limits
- normalize/validate email
- reject control characters and non-empty honeypot
- same-origin discipline
- upstream timeout
- sanitized errors
- request ID
- server-only Beehiiv credentials
- Beehiiv `reactivate_existing: false`
- Beehiiv `double_opt_override: "not_set"`
- optional newsletter list ID
- graceful duplicate/existing-subscriber behavior
- friendly 429/provider-error handling
- never expose provider response internals

Environment:
`BEEHIIV_API_KEY`
`BEEHIIV_PUBLICATION_ID`
optional `BEEHIIV_NEWSLETTER_LIST_ID`

## `/api/partner-lead`
Fields: name, company, workEmail, website?, role?, objective, budgetRange, timing, message, source, honeypot.

Send sanitized notification through Resend.
Subject: `[SECOND PASS / PARTNER] <company> — <budgetRange>`.
Reply-To = submitted email.

## `/api/intelligence-lead`
Fields: name, company, workEmail, role?, problem, desiredOutcome, deadline, budgetRange, confidentiality, source, honeypot.

Initial form must say: do not include confidential data/documents in this first message.

Subject: `[SECOND PASS / INTELLIGENCE] <company> — <budgetRange>`.

## `/api/health`
Return only:
`{"status":"ok","brief":"configured|not_configured","leads":"configured|not_configured"}`

Never return env values, emails, provider IDs or stack traces.

## Failure rule
Never show success if the provider failed. Return a safe retry state plus public fallback contact if configured.
