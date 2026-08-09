# `.env.example` additions

```bash
PUBLIC_SITE_URL=https://second-pass.vercel.app

BEEHIIV_API_KEY=
BEEHIIV_PUBLICATION_ID=
BEEHIIV_NEWSLETTER_LIST_ID=

RESEND_API_KEY=
LEADS_TO_EMAIL=
LEADS_BACKUP_EMAIL=
LEADS_FROM_EMAIL=

PUBLIC_CONTACT_EMAIL=

PUBLIC_BRIEF_ENABLED=false
PUBLIC_COMMERCIAL_FORMS_ENABLED=false
PUBLIC_ANALYTICS_ENABLED=false
```

Never prefix secrets with `PUBLIC_`.
Feature toggles are configuration, not security boundaries.
