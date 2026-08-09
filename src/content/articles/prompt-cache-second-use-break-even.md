---
title: "Prompt caching can become cheaper on the second eligible use"
dek: "A 1.25× cache write pays back on the second eligible use. A 2× one-hour write needs three. The real metric is stable-prefix reuse inside TTL."
slug: "prompt-cache-second-use-break-even"
section: "AI"
format: "NOW"
author: "Aditya"
publishedAt: 2026-08-09
status: "published"
firstPass:
  - "A 1.25× cache write plus 0.10× reads beats repeated uncached input from the second eligible use."
  - "A 2× one-hour write plus 0.10× reads crosses on the third use."
  - "The real metric is eligible stable-prefix reuse inside the TTL."
featured: false
demo: false
tags:
  - "prompt caching"
  - "inference cost"
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
changeLog:
  - at: 2026-08-09
    type: "published"
    note: "Initial publication."
seoTitle: "Prompt caching break-even: two eligible uses"
seoDescription: "A simple equation shows how quickly current 1.25× write / 0.10× read prompt-cache pricing can pay back."
---

# Prompt caching can become cheaper on the second eligible use

Normalize normal input cost to 1.

For current GPT-5.6 pricing, a cache write is 1.25× normal input and a cached read is 0.10×. Anthropic's five-minute cache uses the same multipliers. ([OpenAI pricing](https://developers.openai.com/api/docs/pricing), [Anthropic pricing](https://docs.anthropic.com/en/docs/about-claude/pricing))

If the same eligible prefix is used $N$ times:

24190
C_{\text{uncached}}=N
24191

24190
C_{\text{cached}}=1.25+0.10(N-1)
24191

Set cached below uncached:

24190
1.25+0.10(N-1)<N
24191

24190
N>1.278
24191

The first integer that clears the threshold is **2**.

Anthropic's one-hour write is 2× base input. The same calculation gives $N>2.111$, so the integer threshold is **3**.

That is the theoretical billing break-even. Real systems still need a stable prefix long enough to qualify, a hit before expiry, and enough reuse to justify implementation complexity.

The useful operational metric is therefore not "cache hit rate" in the abstract.

Measure:

**eligible prefix tokens × reuse count × probability of a hit within TTL.**

That tells you whether caching is an economic feature for the workload you actually have.

---

See the full framework: [The cheapest AI model is often not the cheapest system →](/articles/cheapest-ai-model-not-cheapest-system)  
See the derivation: [Proof →](/articles/cheapest-ai-model-not-cheapest-system-proof)
