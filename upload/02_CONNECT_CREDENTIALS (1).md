# Z.ai — Connect Beehiiv + Resend

Repo: `witejackel-eng/second-pass-web`.
Do not redesign.

## Beehiiv env
BEEHIIV_API_KEY
BEEHIIV_PUBLICATION_ID
optional BEEHIIV_NEWSLETTER_LIST_ID
PUBLIC_BRIEF_ENABLED=true

Redeploy and E2E-test a user-authorized test email from home and `/brief`.
Verify Beehiiv subscriber status, duplicate behavior, success UX and safe errors.
Do not force reactivation.

## Resend env
RESEND_API_KEY
LEADS_TO_EMAIL
optional LEADS_BACKUP_EMAIL
LEADS_FROM_EMAIL
PUBLIC_COMMERCIAL_FORMS_ENABLED=true

Redeploy.
Test partner + intelligence success, validation, honeypot, delivery and Reply-To.
Do not put PII in analytics.

Update QA report and CURRENT_STATE.
Never print or commit secrets.
