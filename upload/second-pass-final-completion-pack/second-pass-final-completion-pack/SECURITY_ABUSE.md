# Security / Abuse

Public content remains static and contains no arbitrary user HTML.

Mutation endpoints:
- method checks
- content-type checks
- body-size limits
- field max lengths
- validation
- honeypot
- same-origin policy
- safe upstream timeout
- sanitized errors
- request IDs
- no reflected HTML
- no open redirects

Do not pretend in-memory rate limiting is global/reliable on serverless infrastructure.

At launch use strict validation + honeypot + provider handling. If abuse becomes real, add targeted durable rate limiting or Vercel controls after Pro.

Collect minimum data:
- BRIEF: email + sensible acquisition metadata
- Partner/Intelligence: business contact + project context

Never ask public forms for passwords, API keys, private docs, customer datasets or government IDs.

Secrets are server-only and never committed.
