---
title: "Claude Sonnet 5's price changes on September 1. Your dataset should know that."
dek: "Why AI price datasets need effective dates: Anthropic has already published Sonnet 5's post-introductory price."
slug: "sonnet-5-price-effective-date"
section: "AI"
format: "NOW"
author: "Aditya"
publishedAt: "2026-08-09"
status: "published"
firstPass:
  - "Claude Sonnet 5 introductory pricing runs through August 31, 2026."
  - "Anthropic says standard pricing begins September 1, moving input/output from $2/$10 to $3/$15 per million tokens."
  - "Price datasets need effective_from and effective_to fields, not only a scrape date."
featured: false
demo: false
tags:
  - "Claude"
  - "AI pricing"
  - "data"
hero: ""
heroAlt: ""
adPolicy: "standard"
sources:
  - label: "Anthropic Claude Pricing"
    url: "https://docs.anthropic.com/en/docs/about-claude/pricing"
    type: "primary"
  - label: "What's new in Claude Sonnet 5"
    url: "https://docs.anthropic.com/en/docs/about-claude/models/whats-new-sonnet-5"
    type: "primary"
changeLog:
  - at: "2026-08-09"
    type: "published"
    note: "Initial publication."
seoTitle: "Claude Sonnet 5 pricing changes September 1"
seoDescription: "Why AI price datasets need effective dates: Anthropic has already published Sonnet 5's post-introductory price."
---

Anthropic currently lists Claude Sonnet 5 at introductory pricing of $2 per million input tokens and $10 per million output tokens through August 31, 2026.

On September 1, the published standard rates become $3 and $15. The Batch rates move from $1/$5 to $1.50/$7.50.

## Pricing

| Effective period | Input | Output | Batch input | Batch output |
| --- | --- | --- | --- | --- |
| Through Aug 31 | $2/M | $10/M | $1/M | $5/M |
| From Sep 1 | $3/M | $15/M | $1.50/M | $7.50/M |

The immediate story is not that one model became more expensive. It is a data-design problem.

An AI price table with only:

```
model | input_price | output_price | scraped_at
```

cannot represent a known future price transition cleanly. On August 31 it is correct. On September 1 the same row becomes stale even if the provider has already told you exactly what will change.

A better observation has:

```
effective_from | effective_to | source_accessed_at
```

That makes the dataset temporal rather than pretending pricing is static.

There is a second complication. Anthropic says Sonnet 5 uses a newer tokenizer that can produce approximately 30% more tokens for the same text than Sonnet 4.6, with exact impact depending on the workload.

So even an unchanged per-token price would not guarantee unchanged cost for equivalent text.

**SECOND / PASS:** treat model pricing as versioned configuration data. Record when the price is valid, not just when you saw it.

**Source:** Anthropic Claude pricing and Sonnet 5 documentation, accessed 2026-08-09.
