/**
 * DEMO benchmark fixtures.
 * All entries are explicitly marked as demo/test data.
 */

import type { BenchmarkEntry } from "@/data/schema";
import { demoProvenance } from "@/data/schema";

export const DEMO_BENCHMARKS: BenchmarkEntry[] = [
  {
    id: "demo-mmlu-gpt4o",
    benchmark: "MMLU",
    model: "GPT-4o",
    score: 88.7,
    metric: "accuracy",
    precision: "bf16",
    hardware: "N/A (API)",
    operator: "DEMO — not a real test run",
    date: "2025-03-01",
    provenance: demoProvenance({
      sourceUrl: "https://arxiv.org/abs/2403.02311",
      sourceTitle: "DEMO — GPT-4o technical report (not verified)"
    })
  },
  {
    id: "demo-humaneval-claude35",
    benchmark: "HumanEval",
    model: "Claude 3.5 Sonnet",
    score: 92.0,
    metric: "percent",
    precision: "bf16",
    hardware: "N/A (API)",
    operator: "DEMO — not a real test run",
    date: "2025-03-01",
    provenance: demoProvenance({
      sourceUrl: "https://anthropic.com/research",
      sourceTitle: "DEMO — Claude 3.5 benchmark (not verified)"
    })
  }
];
