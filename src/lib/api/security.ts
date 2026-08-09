/**
 * API security utilities: validation, sanitization, honeypot, same-origin,
 * body limits, request IDs, sanitized errors.
 */

/** Generate a cryptographically appropriate request ID for log correlation */
export function requestId(): string {
  try {
    return `req_${crypto.randomUUID()}`;
  } catch {
    // Fallback for environments without crypto.randomUUID
    const ts = Date.now().toString(36);
    const rand = Math.random().toString(36).slice(2, 8);
    return `req_${ts}_${rand}`;
  }
}

/** Normalize and validate an email address */
export function validateEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim().toLowerCase();
  if (trimmed.length > 254) return null;
  if (/[\x00-\x1f\x7f]/.test(trimmed)) return null; // control characters
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRe.test(trimmed)) return null;
  return trimmed;
}

/** Validate a non-empty string with max length */
export function validateString(
  raw: unknown,
  maxLen: number,
  _fieldName?: string
): string | null {
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  if (trimmed.length === 0 || trimmed.length > maxLen) return null;
  if (/[\x00-\x1f\x7f]/.test(trimmed)) return null;
  return trimmed;
}

/** Validate an optional string with max length */
export function validateOptionalString(
  raw: unknown,
  maxLen: number
): string | undefined {
  if (raw === undefined || raw === null || raw === "") return undefined;
  if (typeof raw !== "string") return undefined;
  const trimmed = raw.trim();
  if (trimmed.length === 0 || trimmed.length > maxLen) return undefined;
  if (/[\x00-\x1f\x7f]/.test(trimmed)) return undefined;
  return trimmed;
}

/** Check honeypot field — must be empty */
export function isHoneypotClear(value: unknown): boolean {
  if (value === undefined || value === null || value === "") return true;
  return false;
}

/** Validate same-origin via Origin or Referer header */
export function isSameOrigin(
  origin: string | undefined,
  referer: string | undefined,
  siteUrl: string
): boolean {
  // Parse the origin header first — it's the most reliable
  if (origin) {
    try {
      return new URL(origin).origin === new URL(siteUrl).origin;
    } catch {
      return false;
    }
  }

  // Fall back to Referer — parse the origin from the full URL
  if (referer) {
    try {
      return new URL(referer).origin === new URL(siteUrl).origin;
    } catch {
      // Malformed Referer — do NOT throw, treat as not same-origin
      return false;
    }
  }

  // No origin or referer header present
  return false;
}

/** Max body size in bytes (10 KB) */
export const MAX_BODY_SIZE = 10_240;

/** Upstream timeout in milliseconds */
export const UPSTREAM_TIMEOUT = 8_000;

/** Field max lengths */
export const FIELD_LIMITS = {
  email: 254,
  name: 120,
  company: 200,
  role: 120,
  website: 500,
  objective: 1000,
  budgetRange: 60,
  timing: 120,
  message: 2000,
  problem: 2000,
  desiredOutcome: 1000,
  deadline: 120,
  confidentiality: 60,
  source: 120,
  utmSource: 200,
  utmMedium: 200,
  utmCampaign: 200,
  utmContent: 120,
  referringSite: 500
} as const;

/** Sanitized error response — never expose internals */
export function safeErrorResponse(
  message: string,
  requestId: string,
  status = 400
): Response {
  return new Response(
    JSON.stringify({ error: message, requestId }),
    {
      status,
      headers: {
        "Content-Type": "application/json",
        "X-Request-Id": requestId,
        "Cache-Control": "no-store"
      }
    }
  );
}

/** Success response */
export function successResponse(
  data: Record<string, unknown>,
  requestId: string
): Response {
  return new Response(
    JSON.stringify({ ...data, requestId }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "X-Request-Id": requestId,
        "Cache-Control": "no-store"
      }
    }
  );
}

/** Parse and validate JSON body with size limit */
export async function parseJsonBody(
  request: Request,
  maxSize = MAX_BODY_SIZE
): Promise<Record<string, unknown> | null> {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return null;

  const contentLength = parseInt(request.headers.get("content-length") || "0", 10);
  if (contentLength > maxSize) return null;

  const text = await request.text();
  if (text.length > maxSize) return null;

  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    return null;
  }
}

/** Check request method */
export function requireMethod(
  request: Request,
  allowed: string
): boolean {
  return request.method === allowed;
}
