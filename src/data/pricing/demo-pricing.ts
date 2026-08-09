/**
 * DEMO pricing fixtures.
 * All entries are explicitly marked as demo/test data.
 * These must NOT become current-data claims.
 */

import type { PricingEntry } from "@/data/schema";
import { demoProvenance } from "@/data/schema";

export const DEMO_PRICING: PricingEntry[] = [
  {
    id: "demo-openai-gpt4o-input",
    provider: "OpenAI",
    product: "GPT-4o",
    tier: "API",
    inputPrice: 2.50,
    outputPrice: 10.00,
    unit: "per_million_tokens",
    currency: "USD",
    region: "us-east-1",
    conditions: "DEMO — not current pricing",
    effectiveDate: "2025-01-01",
    provenance: demoProvenance({
      sourceUrl: "https://openai.com/api/pricing/",
      sourceTitle: "DEMO — OpenAI pricing page (not current)",
      effectiveDate: "2025-01-01"
    })
  },
  {
    id: "demo-anthropic-claude35-sonnet",
    provider: "Anthropic",
    product: "Claude 3.5 Sonnet",
    tier: "API",
    inputPrice: 3.00,
    outputPrice: 15.00,
    unit: "per_million_tokens",
    currency: "USD",
    region: "us-east-1",
    conditions: "DEMO — not current pricing",
    effectiveDate: "2025-01-01",
    provenance: demoProvenance({
      sourceUrl: "https://anthropic.com/pricing",
      sourceTitle: "DEMO — Anthropic pricing page (not current)",
      effectiveDate: "2025-01-01"
    })
  },
  {
    id: "demo-google-gemini-pro",
    provider: "Google",
    product: "Gemini 1.5 Pro",
    tier: "API",
    inputPrice: 1.25,
    outputPrice: 5.00,
    unit: "per_million_tokens",
    currency: "USD",
    region: "us-central1",
    conditions: "DEMO — not current pricing; prompts ≤ 128K",
    effectiveDate: "2025-01-01",
    provenance: demoProvenance({
      sourceUrl: "https://ai.google.dev/pricing",
      sourceTitle: "DEMO — Google AI pricing (not current)",
      effectiveDate: "2025-01-01"
    })
  }
];
