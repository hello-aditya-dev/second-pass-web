import type { APIRoute } from "astro";
import {
  requestId,
  validateEmail,
  validateString,
  validateOptionalString,
  isHoneypotClear,
  isSameOrigin,
  requireMethod,
  parseJsonBody,
  safeErrorResponse,
  successResponse,
  FIELD_LIMITS
} from "@/lib/api/security";
import { getNotifier, isResendConfigured } from "@/lib/api/leads";
import type { SanitizedLead } from "@/lib/api/leads";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const rid = requestId();
  const siteUrl = import.meta.env.PUBLIC_SITE_URL || "https://second-pass.vercel.app";

  if (!requireMethod(request, "POST")) return safeErrorResponse("Method not allowed", rid, 405);

  if (!isSameOrigin(
    request.headers.get("origin") || undefined,
    request.headers.get("referer") || undefined,
    siteUrl
  )) {
    return safeErrorResponse("Invalid origin", rid, 403);
  }

  const body = await parseJsonBody(request);
  if (!body) return safeErrorResponse("Invalid request body", rid, 400);

  if (!isHoneypotClear(body._hp)) return safeErrorResponse("Invalid submission", rid, 400);

  // Validate required fields
  const name = validateString(body.name, FIELD_LIMITS.name, "name");
  if (!name) return safeErrorResponse("Name is required", rid, 400);

  const company = validateString(body.company, FIELD_LIMITS.company, "company");
  if (!company) return safeErrorResponse("Company is required", rid, 400);

  const workEmail = validateEmail(body.workEmail);
  if (!workEmail) return safeErrorResponse("Valid work email is required", rid, 400);

  const problem = validateString(body.problem, FIELD_LIMITS.problem, "problem");
  if (!problem) return safeErrorResponse("Problem description is required", rid, 400);

  const desiredOutcome = validateString(body.desiredOutcome, FIELD_LIMITS.desiredOutcome, "desiredOutcome");
  if (!desiredOutcome) return safeErrorResponse("Desired outcome is required", rid, 400);

  const deadline = validateOptionalString(body.deadline, FIELD_LIMITS.deadline);
  const budgetRange = validateOptionalString(body.budgetRange, FIELD_LIMITS.budgetRange);

  const confidentiality = validateString(body.confidentiality, FIELD_LIMITS.confidentiality, "confidentiality");
  if (!confidentiality) return safeErrorResponse("Confidentiality level is required", rid, 400);

  // Optional fields
  const role = validateOptionalString(body.role, FIELD_LIMITS.role);
  const source = validateOptionalString(body.source, FIELD_LIMITS.source);

  // Check if commercial forms are enabled
  const formsEnabled = import.meta.env.PUBLIC_COMMERCIAL_FORMS_ENABLED === "true";
  if (!formsEnabled) {
    return safeErrorResponse("Intelligence inquiries are not currently available", rid, 503);
  }

  if (!isResendConfigured()) {
    return safeErrorResponse("Lead notification not configured", rid, 503);
  }

  const notifier = getNotifier()!;
  const lead: SanitizedLead = {
    name,
    company,
    workEmail,
    ...(role ? { role } : {}),
    problem,
    desiredOutcome,
    ...(deadline ? { deadline } : {}),
    ...(budgetRange ? { budgetRange } : {}),
    confidentiality,
    ...(source ? { source } : {})
  };

  const result = await notifier.send("intelligence", lead, rid);

  if (!result.success) {
    return safeErrorResponse(
      "Unable to submit at this time. Please try again later.",
      rid,
      502
    );
  }

  return successResponse(
    { message: "Your intelligence inquiry has been received. We'll be in touch." },
    rid
  );
};
