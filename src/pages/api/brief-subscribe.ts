import type { APIRoute } from "astro";
import {
  requestId,
  validateEmail,
  validateOptionalString,
  isHoneypotClear,
  isSameOrigin,
  requireMethod,
  parseJsonBody,
  safeErrorResponse,
  successResponse,
  FIELD_LIMITS
} from "@/lib/api/security";
import { beehiivSubscribe, isBeehiivConfigured, getBeehiivConfig } from "@/lib/api/beehiiv";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const rid = requestId();
  const siteUrl = import.meta.env.PUBLIC_SITE_URL || "https://second-pass.vercel.app";

  // Method check
  if (!requireMethod(request, "POST")) {
    return safeErrorResponse("Method not allowed", rid, 405);
  }

  // Same-origin check
  const origin = request.headers.get("origin") || undefined;
  const referer = request.headers.get("referer") || undefined;
  if (!isSameOrigin(origin, referer, siteUrl)) {
    return safeErrorResponse("Invalid origin", rid, 403);
  }

  // Parse body
  const body = await parseJsonBody(request);
  if (!body) {
    return safeErrorResponse("Invalid request body", rid, 400);
  }

  // Honeypot
  if (!isHoneypotClear(body._hp)) {
    return safeErrorResponse("Invalid submission", rid, 400);
  }

  // Validate email
  const email = validateEmail(body.email);
  if (!email) {
    return safeErrorResponse("Valid email is required", rid, 400);
  }

  // Source (optional metadata)
  const source = validateOptionalString(body.source, FIELD_LIMITS.source);

  // UTM fields (optional)
  const utmSource = validateOptionalString(body.utm_source, FIELD_LIMITS.utmSource) ?? undefined;
  const utmMedium = validateOptionalString(body.utm_medium, FIELD_LIMITS.utmMedium) ?? undefined;
  const utmCampaign = validateOptionalString(body.utm_campaign, FIELD_LIMITS.utmCampaign) ?? undefined;
  const referringSite = validateOptionalString(body.referring_site, FIELD_LIMITS.referringSite) ?? undefined;

  // Check if BRIEF is enabled
  const briefEnabled = import.meta.env.PUBLIC_BRIEF_ENABLED === "true";
  if (!briefEnabled) {
    return safeErrorResponse("BRIEF subscriptions are not currently available", rid, 503);
  }

  // Check if Beehiiv is configured
  if (!isBeehiivConfigured()) {
    return safeErrorResponse("Newsletter provider not configured", rid, 503);
  }

  const config = getBeehiivConfig()!;

  // Subscribe via Beehiiv
  const result = await beehiivSubscribe(
    config,
    email,
    source,
    { utm_source: utmSource, utm_medium: utmMedium, utm_campaign: utmCampaign },
    referringSite
  );

  if (!result.success) {
    // Map error classes to user-safe messages
    const message =
      result.error === "rate_limited"
        ? "Too many requests. Please try again later."
        : result.error === "beehiiv_timeout"
        ? "Service temporarily unavailable. Please try again."
        : "Unable to subscribe at this time. Please try again later.";

    const status = result.error === "rate_limited" ? 429 : 502;
    return safeErrorResponse(message, rid, status);
  }

  return successResponse(
    {
      status: result.status,
      message:
        result.status === "already_subscribed"
          ? "You're already subscribed to / BRIEF."
          : "You're on the list. Check your inbox if confirmation is required."
    },
    rid
  );
};
