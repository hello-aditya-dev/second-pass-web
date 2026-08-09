/**
 * Data Foundation: typed provenance, pricing, and benchmark schemas.
 * All fixtures must be explicitly DEMO/TEST.
 * No invented current values.
 */

/* ── Provenance ── */

export type SourceType =
  | "primary"
  | "secondary"
  | "dataset"
  | "paper"
  | "filing"
  | "advisory"
  | "vendor"
  | "other";

export interface Provenance {
  sourceUrl: string;
  sourceTitle: string;
  sourceType: SourceType;
  observedAt: string;        // ISO 8601
  lastVerifiedAt?: string;   // ISO 8601
  effectiveDate?: string;    // ISO 8601 date — when the data point was true
  conditions?: string;
  notes?: string;
  demo?: boolean;            // MUST be true for test fixtures
}

/* ── Pricing ── */

export type PricingUnit = "per_million_tokens" | "per_thousand_tokens" | "per_hour" | "per_month" | "per_gpu_hour" | "flat";

export interface PricingEntry {
  id: string;
  provider: string;
  product: string;
  tier?: string;
  inputPrice?: number;
  outputPrice?: number;
  unit: PricingUnit;
  currency: string;
  region?: string;
  conditions?: string;
  effectiveDate: string;
  provenance: Provenance;
}

/* ── Benchmarks ── */

export type BenchmarkMetric = "accuracy" | "score" | "tokens_per_second" | "latency_ms" | "f1" | "bleu" | "rouge_l" | "percent";

export interface BenchmarkEntry {
  id: string;
  benchmark: string;         // e.g., "MMLU", "HumanEval", "GSM8K"
  model: string;
  score: number;
  metric: BenchmarkMetric;
  precision?: string;        // e.g., "fp16", "bf16", "fp8", "int4"
  hardware?: string;
  workload?: string;
  batch_size?: number;
  concurrency?: number;
  runtime?: string;          // e.g., "vLLM", "TGI"
  operator?: string;         // who ran the test
  methodology?: string;
  date: string;
  provenance: Provenance;
}

/* ── Accelerators / GPU ── */

export interface AcceleratorEntry {
  id: string;
  name: string;
  vendor: string;
  architecture: string;
  memoryGb: number;
  memoryBandwidthGbs?: number;
  tflopsFp16?: number;
  tflopsFp8?: number;
  tdp?: number;              // thermal design power in watts
  launchDate?: string;
  provenance: Provenance;
}

/* ── Providers ── */

export interface CloudProvider {
  id: string;
  name: string;
  regions: string[];
  provenance: Provenance;
}

/* ── Helpers ── */

/** Mark a provenance as DEMO/TEST */
export function demoProvenance(overrides?: Partial<Provenance>): Provenance {
  return {
    sourceUrl: "https://example.com/demo",
    sourceTitle: "DEMO — not real data",
    sourceType: "other",
    observedAt: new Date().toISOString(),
    demo: true,
    ...overrides
  };
}

/** Type guard: is this entry demo data? */
export function isDemo(provenance: Provenance): boolean {
  return provenance.demo === true;
}
