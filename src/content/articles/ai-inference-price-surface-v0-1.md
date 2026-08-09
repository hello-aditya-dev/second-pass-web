---
title: "AI Inference Price Surface v0.1"
dek: "A configuration-level snapshot of public AI API pricing, including cache, Batch, context bands and effective dates."
slug: "ai-inference-price-surface-v0-1"
section: "Data"
format: "DATA"
author: "Aditya"
publishedAt: 2026-08-09
status: "published"
firstPass:
  - "Model names are not sufficient price keys; service tier, cache state and context band can materially change billing."
  - "The snapshot is dated 2026-08-09 and should not be treated as permanently current."
  - "Identical nominal token counts are not identical text across providers because tokenizers differ."
  - "Price rows include effective_from and effective_to to represent scheduled price transitions."
featured: false
demo: false
tags:
  - "AI pricing"
  - "inference cost"
  - "dataset"
adPolicy: "none"
sources:
  - label: "OpenAI — API Pricing"
    url: "https://developers.openai.com/api/docs/pricing"
    type: "primary"
    note: "Public list pricing; accessed 2026-08-09."
  - label: "Anthropic — Claude Pricing"
    url: "https://docs.anthropic.com/en/docs/about-claude/pricing"
    type: "primary"
    note: "Claude prices, cache multipliers, Batch, Fast, 1M context, tokenizer note; accessed 2026-08-09."
  - label: "Google — Gemini API Pricing"
    url: "https://ai.google.dev/gemini-api/docs/pricing"
    type: "primary"
    note: "Standard/Batch/Flex/Priority/cache pricing; accessed 2026-08-09."
  - label: "Mistral AI — Small 4"
    url: "https://docs.mistral.ai/models/model-cards/mistral-small-4-0-26-03"
    type: "primary"
    note: "Mistral Small 4 pricing; accessed 2026-08-09."
  - label: "xAI — API Pricing"
    url: "https://docs.x.ai/developers/pricing"
    type: "primary"
    note: "Grok 4.5 short/long-context pricing; accessed 2026-08-09."
changeLog:
  - at: 2026-08-09
    type: "published"
    note: "Dataset v0.1 published."
seoTitle: "AI Inference Price Surface v0.1 — SECOND / PASS"
seoDescription: "A dated, configuration-level dataset of public AI inference prices across OpenAI, Anthropic, Google, Mistral and xAI."
---

← [READ THE MAIN ANALYSIS](/articles/cheapest-ai-model-not-cheapest-system)

# / DATA — AI Inference Price Surface v0.1

**SNAPSHOT / 2026-08-09**

This dataset stores public list prices at the **configuration** level.

It deliberately does not rank model quality.

Use it to reproduce billing calculations or join against a workload-specific evaluation table.

**What this snapshot represents:** This is a point-in-time capture of publicly listed API pricing from five major inference providers, observed on 2026-08-09. It records the price of each *configuration* — a combination of model, context band, cache state, service tier and batch status — rather than just the model name. Prices are stored exactly as published; no normalization across tokenizers or context windows is applied. Where a provider has announced a future price change (e.g., Claude Sonnet 5's standard pricing effective 2026-09-01), both the current and future rows are included with `effective_from` / `effective_to` fields.

## Included dimensions

- provider
- model
- service tier
- context band
- context threshold
- input price
- cached-input price
- cache-write price where published
- cache-storage price where published
- output price
- Batch indicator
- open-weight indicator
- effective dates
- source IDs
- source-access date
- notes

## Do not compare blindly

A row with `$0.20/M input` and a row with `$2/M input` do not imply a 10× cost difference for the same text. Tokenizers can differ, reasoning/output consumption can differ, and the task may generate different numbers of tokens.

For cross-model workload economics, measure billable usage on the actual workload.

## Downloads

- [CSV — ai-inference-price-surface-v0.1.csv](/downloads/ai-inference-price-surface-v0.1.csv)
- [JSON — ai-inference-price-surface-v0.1.json](/downloads/ai-inference-price-surface-v0.1.json)
- [Data Dictionary](/downloads/ai-inference-price-surface-v0.1-data-dictionary.md)

---

EXPLORE / [PROOF →](/articles/cheapest-ai-model-not-cheapest-system-proof)  
READ / [SECOND PASS →](/articles/cheapest-ai-model-not-cheapest-system)
