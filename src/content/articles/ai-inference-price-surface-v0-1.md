---
title: "AI Inference Price Surface v0.1"
dek: "A configuration-level snapshot of public AI API pricing, including cache, Batch, context bands and effective dates."
slug: "ai-inference-price-surface-v0-1"
section: "Data"
format: "DATA"
author: "Aditya"
publishedAt: "2026-08-09"
status: "published"
firstPass:
  - "Model names are not sufficient price keys; service tier, cache state and context band can materially change billing."
  - "The snapshot is dated 2026-08-09 and should not be treated as permanently current."
  - "Identical nominal token counts are not identical text across providers because tokenizers differ."
featured: false
demo: false
tags:
  - "AI pricing"
  - "inference cost"
  - "dataset"
hero: ""
heroAlt: ""
adPolicy: "standard"
sources:
  - label: "OpenAI API Pricing"
    url: "https://developers.openai.com/api/docs/pricing"
    type: "primary"
  - label: "Anthropic Claude Pricing"
    url: "https://docs.anthropic.com/en/docs/about-claude/pricing"
    type: "primary"
  - label: "Google Gemini Pricing"
    url: "https://ai.google.dev/gemini-api/docs/pricing"
    type: "primary"
  - label: "Mistral Pricing"
    url: "https://docs.mistral.ai/getting-started/models/models_prices/"
    type: "primary"
  - label: "xAI Pricing"
    url: "https://docs.x.ai/developers/pricing"
    type: "primary"
changeLog:
  - at: "2026-08-09"
    type: "published"
    note: "Dataset v0.1 generated."
seoTitle: "AI Inference Price Surface v0.1 — SECOND / PASS"
seoDescription: "A dated, configuration-level dataset of public AI inference prices across OpenAI, Anthropic, Google, Mistral and xAI."
---

**SNAPSHOT / 2026-08-09**

This dataset stores public list prices at the **configuration** level.

It deliberately does not rank model quality.

Use it to reproduce billing calculations or join against a workload-specific evaluation table.

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

- [ai-inference-price-surface-v0.1.csv](/data/ai-inference-price-surface-v0.1.csv)
- [ai-inference-price-surface-v0.1.json](/data/ai-inference-price-surface-v0.1.json)
- [DATA_DICTIONARY.md](/data/DATA_DICTIONARY.md)
