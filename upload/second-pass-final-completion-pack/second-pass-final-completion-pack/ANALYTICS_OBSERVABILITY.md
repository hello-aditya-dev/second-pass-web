# Analytics and Observability

Preferred launch analytics: Vercel Web Analytics once the project is on Pro/commercial launch.

Implement behind `PUBLIC_ANALYTICS_ENABLED`.

Do not introduce GA at launch unless a later measured requirement exists.

## Safe custom events on Pro
- `brief_signup_submit`
- `brief_signup_success`
- `partner_cta`
- `partner_lead_success`
- `intelligence_cta`
- `intelligence_lead_success`
- `source_open`
- `data_open`
- `search_use`

Never send email, name, company form content, article text, confidential data or sensitive query strings.

Minimal properties only: placement, article format, section.

## Logging
Give every mutation request a request ID.
Log endpoint, outcome, provider class, duration and normalized error class.
Avoid raw payloads and plaintext PII where possible.

## Error monitoring
Use Vercel/provider logs first. Add another monitoring vendor only after a real operational need exists.
