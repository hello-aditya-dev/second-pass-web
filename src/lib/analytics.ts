/**
 * Analytics-ready event layer.
 * Behind PUBLIC_ANALYTICS_ENABLED feature toggle.
 * Never sends PII: no email, name, company, article text, confidential data, sensitive queries.
 */

type EventName =
  | "brief_signup_submit"
  | "brief_signup_success"
  | "partner_cta"
  | "partner_lead_success"
  | "intelligence_cta"
  | "intelligence_lead_success"
  | "source_open"
  | "data_open"
  | "search_use";

interface SafeEvent {
  name: EventName;
  properties?: Record<string, string | number | boolean | undefined>;
}

/**
 * Track a safe analytics event.
 * Only fires if PUBLIC_ANALYTICS_ENABLED is true.
 * Properties are minimal: placement, article format, section — never PII.
 */
export function trackEvent(event: SafeEvent): void {
  if (typeof window === "undefined") return;

  const enabled = document.body.dataset.analytics === "true";
  if (!enabled) return;

  // Vercel Web Analytics custom events
  if (typeof window.va === "function") {
    window.va("event", {
      name: event.name,
      data: event.properties || {}
    });
  }

  // Console log in development
  if (import.meta.env.DEV) {
    console.log(`[analytics] ${event.name}`, event.properties || "");
  }
}

// Declare Vercel Analytics global
declare global {
  interface Window {
    va?: (cmd: string, data?: Record<string, unknown>) => void;
  }
}
