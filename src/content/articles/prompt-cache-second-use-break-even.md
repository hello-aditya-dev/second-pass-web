---
title: "Prompt caching can become cheaper on the second eligible use"
dek: "A simple equation shows how quickly current 1.25× write / 0.10× read prompt-cache pricing can pay back."
slug: "prompt-cache-second-use-break-even"
section: "AI"
format: "NOW"
author: "Aditya"
publishedAt: "2026-08-09"
status: "published"
firstPass:
  - "A 1.25× cache write plus 0.10× reads beats repeated uncached input from the second eligible use."
  - "A 2× one-hour write plus 0.10× reads crosses on the third use."
  - "The real metric is eligible stable-prefix reuse inside the TTL."
featured: false
featuredRank: 0
editorialOrder: 0
demo: false
tags:
  - "prompt caching"
  - "inference cost"
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
changeLog:
  - at: "2026-08-09"
    type: "published"
    note: "Initial publication."
seoTitle: "Prompt caching break-even: two eligible uses"
seoDescription: "A simple equation shows how quickly current 1.25× write / 0.10× read prompt-cache pricing can pay back."
---

Normalize normal input cost to 1.

For current GPT-5.6 pricing, a cache write is 1.25× normal input and a cached read is 0.10×. Anthropic's five-minute cache uses the same multipliers.

If the same eligible prefix is used $$N$$ times:

$$
C_{\text{uncached}}=N
$$

$$
C_{\text{cached}}=1.25+0.10(N-1)
$$

Set cached below uncached:

$$
1.25+0.10(N-1)<N
$$

$$
N>1.278
$$

The first integer that clears the threshold is **2**.

Anthropic's one-hour write is 2× base input. The same calculation gives $$N>2.111$$, so the integer threshold is **3**.

That is the theoretical billing break-even. Real systems still need a stable prefix long enough to qualify, a hit before expiry, and enough reuse to justify implementation complexity.

The useful operational metric is therefore not "cache hit rate" in the abstract.

Measure:

**eligible prefix tokens × reuse count × probability of a hit within TTL.**

That tells you whether caching is an economic feature for the workload you actually have.

**TTL caveat:** cache entries expire. A one-hour TTL on a workload that revisits prefixes every four hours may never break even even though the per-use math says it should. Measure reuse *inside* the TTL window.
