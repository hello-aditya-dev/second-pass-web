/**
 * Provider-neutral lead notifier interface.
 * Resend implementation for transactional email notifications.
 */

export type LeadKind = "partner" | "intelligence";

export interface SanitizedLead {
  name: string;
  company: string;
  workEmail: string;
  [key: string]: unknown;
}

export interface LeadNotifier {
  send(
    kind: LeadKind,
    lead: SanitizedLead,
    requestId: string
  ): Promise<{ success: boolean; error?: string }>;
}

/** Build subject line per BACKEND_SPEC */
function buildSubject(kind: LeadKind, lead: SanitizedLead): string {
  const prefix = kind === "partner" ? "SECOND PASS / PARTNER" : "SECOND PASS / INTELLIGENCE";
  const budgetRange = (lead.budgetRange as string) || "not specified";
  return `[${prefix}] ${lead.company} — ${budgetRange}`;
}

/** Escape HTML for safe email body */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Format lead fields into a readable text body */
function formatTextBody(kind: LeadKind, lead: SanitizedLead, requestId: string): string {
  const timestamp = new Date().toISOString();
  const lines = [
    `SECOND / PASS — ${kind === "partner" ? "Partner" : "Intelligence"} Lead`,
    `Received: ${timestamp}`,
    `Request ID: ${requestId}`,
    "",
    "Contact:",
    `  Name: ${lead.name}`,
    `  Company: ${lead.company}`,
    `  Email: ${lead.workEmail}`,
  ];

  if (lead.role) lines.push(`  Role: ${lead.role}`);
  if (lead.website) lines.push(`  Website: ${lead.website}`);

  if (kind === "partner") {
    if (lead.objective) lines.push("", "Objective:", `  ${lead.objective}`);
    if (lead.budgetRange) lines.push("", `Budget Range: ${lead.budgetRange}`);
    if (lead.timing) lines.push(`Timing: ${lead.timing}`);
    if (lead.message) lines.push("", "Message:", `  ${lead.message}`);
  } else {
    if (lead.problem) lines.push("", "Problem:", `  ${lead.problem}`);
    if (lead.desiredOutcome) lines.push("", "Desired Outcome:", `  ${lead.desiredOutcome}`);
    if (lead.deadline) lines.push("", `Deadline: ${lead.deadline}`);
    if (lead.budgetRange) lines.push(`Budget Range: ${lead.budgetRange}`);
    if (lead.confidentiality) lines.push(`Confidentiality: ${lead.confidentiality}`);
  }

  if (lead.source) lines.push("", `Source: ${lead.source}`);
  return lines.join("\n");
}

/** Resend implementation of LeadNotifier */
export function createResendNotifier(
  apiKey: string,
  toEmail: string,
  fromEmail: string,
  backupEmail?: string
): LeadNotifier {
  return {
    async send(kind, lead, requestId) {
      const subject = buildSubject(kind, lead);
      const textBody = formatTextBody(kind, lead, requestId);
      const htmlBody = `<pre style="font-family:monospace;white-space:pre-wrap">${escapeHtml(textBody)}</pre>`;

      const payload = {
        from: fromEmail,
        to: [toEmail, ...(backupEmail ? [backupEmail] : [])],
        reply_to: lead.workEmail,
        subject,
        text: textBody,
        html: htmlBody
      };

      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload),
          signal: AbortSignal.timeout(8_000)
        });

        if (!res.ok) {
          const errorClass = `resend_${res.status}`;
          return { success: false, error: errorClass };
        }

        return { success: true };
      } catch (err) {
        if (err instanceof DOMException && err.name === "TimeoutError") {
          return { success: false, error: "resend_timeout" };
        }
        return { success: false, error: "resend_network_error" };
      }
    }
  };
}

/** Check if Resend is configured */
export function isResendConfigured(): boolean {
  return !!(
    import.meta.env.RESEND_API_KEY &&
    import.meta.env.LEADS_TO_EMAIL &&
    import.meta.env.LEADS_FROM_EMAIL
  );
}

/** Get a configured notifier, or null if not configured */
export function getNotifier(): LeadNotifier | null {
  const apiKey = import.meta.env.RESEND_API_KEY;
  const toEmail = import.meta.env.LEADS_TO_EMAIL;
  const fromEmail = import.meta.env.LEADS_FROM_EMAIL;
  const backupEmail = import.meta.env.LEADS_BACKUP_EMAIL;

  if (!apiKey || !toEmail || !fromEmail) return null;

  return createResendNotifier(apiKey, toEmail, fromEmail, backupEmail);
}
