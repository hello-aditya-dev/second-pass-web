/**
 * Beehiiv subscriber API client.
 * Uses normal subscription API, NOT Send API.
 * Respects publication DOI policy with double_opt_override: "not_set".
 *
 * Current Beehiiv Create Subscription API:
 * POST /v2/publications/{publicationId}/subscriptions
 * Body: { email, newsletter_list_ids, reactivate_existing, double_opt_override,
 *         utm_source, utm_medium, utm_campaign, utm_content, referring_site }
 */

export interface BeehiivConfig {
  apiKey: string;
  publicationId: string;
  newsletterListId?: string;
}

export interface BeehiivSubscribeResult {
  success: boolean;
  status: "subscribed" | "error";
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
  utmFields?: {
    utm_source?: string | undefined;
    utm_medium?: string | undefined;
    utm_campaign?: string | undefined;
    utm_content?: string | undefined;
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

  // Beehiiv expects newsletter_list_ids as an array of list IDs
  if (config.newsletterListId) {
    payload.newsletter_list_ids = [config.newsletterListId];
  }

  // UTM attribution fields (documented Beehiiv Create Subscription fields)
  if (utmFields?.utm_source) payload.utm_source = utmFields.utm_source;
  if (utmFields?.utm_medium) payload.utm_medium = utmFields.utm_medium;
  if (utmFields?.utm_campaign) payload.utm_campaign = utmFields.utm_campaign;
  if (utmFields?.utm_content) payload.utm_content = utmFields.utm_content;

  // referring_site is a documented Beehiiv field for external referrer domain
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

    // 429 rate-limited
    if (res.status === 429) {
      return { success: false, status: "error", error: "rate_limited" };
    }

    // Any non-2xx (including 422) is a failure.
    // Never convert an undocumented provider validation error into success.
    // Never expose Beehiiv response internals to the reader.
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
