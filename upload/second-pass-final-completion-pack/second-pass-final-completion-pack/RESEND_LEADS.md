# Resend Lead Notifications

Use Resend transactional email behind a provider-neutral notifier interface.

Environment:
- `RESEND_API_KEY`
- `LEADS_TO_EMAIL`
- optional `LEADS_BACKUP_EMAIL`
- `LEADS_FROM_EMAIL`

Before secondpass.net, only use provider-approved testing behavior.
After domain acquisition, verify secondpass.net in Resend and use a transactional sender such as:
`SECOND / PASS <forms@secondpass.net>`.

That sender address does not automatically imply a receiving inbox.

Recommended interface:

```ts
type LeadKind = "partner" | "intelligence";

interface LeadNotifier {
  send(kind: LeadKind, lead: SanitizedLead, requestId: string): Promise<void>;
}
```

Send simple text + escaped HTML. Include request ID and UTC timestamp.
Use idempotency where practical.
Never include environment dumps or raw request headers.
