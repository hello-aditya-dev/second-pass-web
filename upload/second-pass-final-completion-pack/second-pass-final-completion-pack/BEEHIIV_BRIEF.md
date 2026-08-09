# `/BRIEF` with Beehiiv Launch

The Second Pass website owns the signup UX. Beehiiv owns subscriber records, unsubscribe/compliance mechanics and newsletter delivery.

Use Beehiiv normal API for subscriber creation. Do not depend on Beehiiv Send API.

## Reusable signup placements
- `/brief`
- homepage
- article bottom
- optional data page

No popup, full-screen gate or forced signup.

Copy:
- Heading: `The second pass, in one email.`
- Support: `The technical changes worth understanding. No press-release rewrites.`
- Input: `you@company.com`
- Button: `JOIN / BRIEF`
- Success: `You're on the list. Check your inbox if confirmation is required.`

Do not display fake subscriber counts.

## Consent
State clearly that submission subscribes the reader to SECOND / PASS / BRIEF and link Privacy.

Respect the Beehiiv publication's double-opt-in setting with `double_opt_override: "not_set"`.

## Credentials
Never expose Beehiiv keys client-side. No `PUBLIC_BEEHIIV_API_KEY`.

## Setup
User must create/verify Beehiiv, create the publication, choose opt-in defaults, generate the minimum API key, copy publication ID, optionally list ID, add env vars to Vercel, redeploy, then run a real test.
