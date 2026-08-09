/**
 * Beehiiv subscriber API client.
 * Uses normal subscription API, NOT Send API.
 * Respects publication DOI policy with double_opt_override: "not_set".
 */

export interface BeehiivConfig {
  apiKey: string;
  publicationId: string;
  newsletterListId?: string;
}

export interface BeehiivSubscribeResult {
  success: boolean;
  status: "subscribed" | "already_subscribed" | "error";
  error?: string;
}

/** Normalize email for Beehiiv */
function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Subscribe a reader via Beehiiv API */
export async function beehiivSubscribe(
  config: BeehiivConfig,
  email: string,
  source?: string,
  utmFields?: {
    utm_source?: string | undefined;
    utm_medium?: string | undefined;
    utm_campaign?: string | undefined;
  },
  referringSite?: string
): Promise<BeehiivSubscribeResult> {
  const normalizedEmail = normalizeEmail(email);
  const url = `https://api.beehiiv.com/v2/publications/${config.publicationId}/subscriptions`;

  const payload: Record<string, unknown> = {
    email: normalizedEmail,
    reactivate_existing: false,
    double_opt_override: "not_set"
  };

  if (config.newsletterListId) {
    payload.newsletter_id = config.newsletterListId;
  }

  if (source) payload.referrer = source;
  if (utmFields?.utm_source) payload.utm_source = utmFields.utm_source;
  if (utmFields?.utm_medium) payload.utm_medium = utmFields.utm_medium;
  if (utmFields?.utm_campaign) payload.utm_campaign = utmFields.utm_campaign;
  if (referringSite) payload.referring_site = referringSite;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(8_000)
    });

    if (res.ok) {
      return { success: true, status: "subscribed" };
    }

    if (res.status === 422) {
      // Already subscribed or duplicate
      return { success: true, status: "already_subscribed" };
    }

    if (res.status === 429) {
      return { success: false, status: "error", error: "rate_limited" };
    }

    // Never expose provider response internals
    return {
      success: false,
      status: "error",
      error: `beehiiv_${res.status}`
    };
  } catch (err) {
    if (err instanceof DOMException && err.name === "TimeoutError") {
      return { success: false, status: "error", error: "beehiiv_timeout" };
    }
    return { success: false, status: "error", error: "beehiiv_network_error" };
  }
}

/** Check if Beehiiv is configured */
export function isBeehiivConfigured(): boolean {
  return !!(
    import.meta.env.BEEHIIV_API_KEY &&
    import.meta.env.BEEHIIV_PUBLICATION_ID
  );
}

/** Get Beehiiv config from env */
export function getBeehiivConfig(): BeehiivConfig | null {
  const apiKey = import.meta.env.BEEHIIV_API_KEY;
  const publicationId = import.meta.env.BEEHIIV_PUBLICATION_ID;
  const newsletterListId = import.meta.env.BEEHIIV_NEWSLETTER_LIST_ID;

  if (!apiKey || !publicationId) return null;

  return {
    apiKey,
    publicationId,
    ...(newsletterListId ? { newsletterListId } : {})
  };
}
