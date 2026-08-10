---
title: "Token price no longer tells you what an AI agent costs"
dek: "Model-token rates still matter. But an agent can also incur charges for search, tool calls, runtime, or stored state, while product rules change which charges apply. A worked trace shows where the largest cost line flips."
slug: "an-ai-agent-is-no-longer-priced-in-tokens"
section: "AI"
format: "SECOND PASS"
author: "Aditya"
publishedAt: "2026-08-10"
status: "published"
firstPass:
  - "A token rate measures model usage. It does not, by itself, price search calls, runtime, stored state, or repeated tool loops around the model."
  - "The framework has four base meter families—token volume, calls, runtime, and stored state—plus two rule layers: configuration modifiers and inclusion/applicability rules."
  - "Our illustrative Claude Managed Agents trace costs $0.0653: $0.0220 in model tokens, $0.0300 in web search, and $0.0133 in session runtime."
  - "With the other quantities fixed, the third web search makes search the largest individual meter. One $0.01 search also equals 10,000 Haiku 4.5 input tokens or 7.5 running minutes at current list prices."
  - "Price the path, not only the model: trace one agent task, attach the provider's real meter to each step, apply product rules, remove overlaps, then measure which meter dominates."
featured: true
demo: false
tags:
  - "AI agent cost"
  - "AI agent pricing"
  - "LLM agent economics"
  - "tool calling cost"
  - "agent infrastructure"
hero: ""
heroAlt: ""
adPolicy: "none"
sources:
  - label: "OpenAI API Pricing"
    url: "https://developers.openai.com/api/docs/pricing"
    type: "primary"
    note: "Model, web search, container, File Search, storage, and regional-processing pricing."
  - label: "Anthropic Claude Platform Pricing"
    url: "https://platform.claude.com/docs/en/about-claude/pricing"
    type: "primary"
    note: "Model tokens, prompt caching, web search, Managed Agents runtime, and Managed Agents pricing applicability rules."
  - label: "Anthropic Code Execution Tool"
    url: "https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool"
    type: "primary"
    note: "Standalone Code Execution runtime rules and free allowance."
  - label: "Google Gemini Developer API Pricing"
    url: "https://ai.google.dev/gemini-api/docs/pricing"
    type: "primary"
    note: "Model, grounding, cache, Managed Agents, Code Execution, and File Search pricing."
  - label: "Google Gemini Code Execution"
    url: "https://ai.google.dev/gemini-api/docs/code-execution"
    type: "primary"
    note: "Intermediate-token accounting for Code Execution."
  - label: "xAI API Pricing"
    url: "https://docs.x.ai/developers/pricing"
    type: "primary"
    note: "Model, server-side tool invocation, storage, Batch, and Priority pricing."
changeLog:
  - at: "2026-08-10"
    type: "published"
    note: "Initial publication."
seoTitle: "What does an AI agent actually cost?"
seoDescription: "AI agent cost can include model tokens, search and tool calls, runtime, stored state, repeated turns, and pricing rules. A source-backed worked cost stack."
---

A plain model request can be easy to price: text goes in, text comes out, and the provider bills the model usage.

An agent can take a longer path. It may search the web, read the result, call a tool, run code, return that output to the model, check its work, and only then answer.

```text
USER
  ↓
MODEL
  ↓
SEARCH
  ↓
MODEL
  ↓
TOOL / RUNTIME
  ↓
MODEL / VERIFY
  ↓
ANSWER
```

The accounting question is simple: **which parts of that path does "$ per million tokens" actually measure?**

It measures token-billed model work. It does not automatically include a search invocation, a container or session charge, or data kept over time. Product rules can change the picture again: a service tier may change the unit price, a free allowance may remove a charge for part of the month, and one managed runtime may replace a container fee that would otherwise appear separately.

Token price still matters. It is just one input to the cost of an agent task.

![Agent billing path](/research/agent-economics/charts/chart-01-agent-billing-path.svg)

## Four base meters, then two layers of rules

The provider pages use different names. Economically, the billable quantities fit four base meter families.

| Base meter family | What is measured | Examples |
|---|---|---|
| **Token volume** | text or model work measured in tokens | input, output, reasoning/thinking, cached input, retrieved content when token-billed |
| **Calls / invocations** | how many times an operation is invoked | web search, File Search, server-side tool call |
| **Runtime** | how long an execution environment is active | container minutes, session-hours |
| **Stored state** | how much data is kept, multiplied by time | GB-day, GiB-day, token-hours |

Two other parts of a pricing page matter, but they are not base meters in the same sense.

**Configuration modifiers** change the price function of a meter. Batch, Flex, Fast or Priority processing, context bands, and regional-processing rules can change the unit price without creating a new unit of work.

**Inclusion and applicability rules** decide whether a charge exists or how it is applied. Examples include free allowances, preview-period zero pricing, minimum billing durations, product-specific exclusions, or one runtime charge replacing another.

That distinction matters because a bad cost model can add a "configuration cost" that does not exist, or count a tool twice when the provider has already included it elsewhere.

A compact model is enough:

$$
C_{\text{agent}}
=
\sum_m q_m p_m(a)
$$

Here, `m` is a provider-defined billable meter, `q_m` is the measured quantity, `a` is the active configuration, and `p_m(a)` is that meter's price under the configuration. Allowances and inclusion rules determine whether a term is billable at all.

In plain English: **measure each real unit of work, apply the price rule that actually covers it, and do not add a second charge when the provider says the first one already includes or replaces it.**

This separates three different ways the bill can move. The workflow can consume **more quantity**: another search, another 5,000 tokens, another ten minutes of runtime. A configuration can change the **unit price** of the same quantity. An applicability rule can decide that a charge is included, free up to a limit, subject to a minimum, or not available for that product path at all.

That distinction makes cost debugging easier. If search spend rises because the agent now makes six queries instead of two, the quantity changed. If the same token workload moves to a premium service tier, the price rule changed. If a managed runtime replaces a separate container charge, the billable set changed. Those are different engineering problems, so they should not be collapsed into one generic "agent overhead" number.

The current provider stacks illustrate why this structure is useful.

[OpenAI's pricing documentation](https://developers.openai.com/api/docs/pricing) lists web search at $10 per 1,000 calls and separately says search-content tokens are billed at the selected model's rates. The same pricing page lists container charges, File Search calls, File Search storage, and ChatKit upload storage.

[Anthropic's pricing documentation](https://platform.claude.com/docs/en/about-claude/pricing) lists model-token charges, $10 per 1,000 web searches, and $0.08 per running session-hour for Claude Managed Agents. It also gives explicit rules about which Messages API pricing modifiers do not apply to Managed Agents.

[Google's Gemini API pricing](https://ai.google.dev/gemini-api/docs/pricing) uses another mix. Google Search grounding can create a call-based charge, context caching has token and storage-time pricing, and Code Execution currently has no separate runtime fee; its generated code and execution results are accounted for through model tokens. Managed Agents environment compute is currently unbilled during preview, which is a preview rule rather than a permanent property of agent runtime.

[xAI's pricing page](https://docs.x.ai/developers/pricing) lists fixed invocation prices for several server-side tools alongside token charges. It also lists storage by GiB-day. Remote MCP is a useful exception: xAI lists no fixed MCP invocation fee, while token usage remains billable.

These examples compare **billing structures**, not overall provider economics. The tools, models, search semantics, allowances, tokenizers, and product boundaries are different.

## A worked trace with three billable meters

For the worked example, we use **Claude Managed Agents with Claude Haiku 4.5**. Anthropic's documentation makes the product boundary unusually clear: a Managed Agents session can incur model-token charges, web-search charges, and running-session time, while the session runtime replaces separate Code Execution container-hour billing.

There is one pricing-rule detail that must stay outside the scenario assumptions. Anthropic states that the Messages API Batch discount, Fast-mode premium, and data-residency multiplier through `inference_geo` **do not apply to Claude Managed Agents sessions**. Prompt-caching multipliers do apply. Those are product rules, not choices we switch off for this example.

### / ASSUMPTION

**ILLUSTRATIVE WORKLOAD**

One agent task uses:

- 12,000 cumulative input tokens across all agent turns;
- 2,000 cumulative output tokens;
- 3 web searches;
- 10 minutes with the Managed Agent session in `running` status;
- no prompt cache;
- no retry.

The 12,000 input tokens are one cumulative assumption. They include the initial request, repeated context, tool definitions and results, and search content that returns to the model. We do **not** add another row for search-result tokens, because that would count part of the same input twice.

The quantities are scenario values. The unit prices are Anthropic's public list prices checked on August 10, 2026.

### / CALCULATION

**QUESTION**

What does this one agent task cost?

**ASSUMPTIONS**

Claude Haiku 4.5:
- input: $1 per million tokens;
- output: $5 per million tokens.

Claude Managed Agents:
- web search: $10 per 1,000 searches;
- running session time: $0.08 per session-hour.

**EQUATION**

$$
C_{\text{agent}}
=
C_{\text{input}}
+
C_{\text{output}}
+
C_{\text{search}}
+
C_{\text{runtime}}
$$

Input:

$$
12{,}000 \times \frac{1}{1{,}000{,}000}=0.012
$$

Output:

$$
2{,}000 \times \frac{5}{1{,}000{,}000}=0.010
$$

Search:

$$
3 \times \frac{10}{1{,}000}=0.030
$$

Runtime:

$$
\frac{10}{60} \times 0.08=0.01333
$$

Total:

$$
0.012+0.010+0.030+0.01333=0.06533
$$

**RESULT**

The illustrative task costs **$0.0653**.

- model tokens: **$0.0220**
- web search: **$0.0300**
- session runtime: **$0.0133**

Search is the largest individual meter in this trace. Model tokens are still about one-third of the total.

**CAVEAT**

Change the token count, number of searches, running time, cache use, model, or product path and the result can change. This is a transparent scenario, not observed production behavior.

![Worked agent cost composition](/research/agent-economics/charts/chart-02-cost-waterfall.svg)

## The third search becomes the largest individual meter

Keep the model-token and runtime quantities fixed. Model-token cost stays at $0.0220 and runtime stays at $0.0133. Each Anthropic web search adds $0.01.

At one search, the search line is $0.01. At two, it is $0.02, still below model-token spend. The third search takes the search line to $0.03.

### / CALCULATION

**QUESTION**

How many web searches make search the largest individual meter in this worked trace?

Let `n` be the number of searches.

$$
C_{\text{search}}(n)=0.01n
$$

Search overtakes model-token spend when:

$$
0.01n>0.022
$$

so:

$$
n>2.2
$$

**RESULT**

The first whole number that clears the threshold is **3 searches**.

At three searches, search is the largest **individual** meter. It is not more than half of total task cost; the distinction matters.

The same $0.01 fee also gives three useful billing equivalences at current Haiku 4.5 list prices:

- **10,000 base-input tokens** at $1 per million;
- **2,000 output tokens** at $5 per million;
- **7.5 running session minutes** at $0.08 per session-hour.

These are price equivalences, not claims that a search, 10,000 input tokens, 2,000 output tokens, and 7.5 runtime minutes do the same work.

**CAVEAT**

The three-search threshold belongs to this fixed workload and the current price table. It is not a general rule for agents.

![Search-count sensitivity](/research/agent-economics/charts/chart-04-sensitivity.svg)

## A one-cent meter becomes visible at volume

Scale the same scenario without assuming discounts:

| Tasks | Model tokens | Search | Runtime | Total |
|---:|---:|---:|---:|---:|
| 1 | $0.0220 | $0.0300 | $0.0133 | $0.0653 |
| 1,000 | $22.00 | $30.00 | $13.33 | $65.33 |
| 100,000 | $2,200.00 | $3,000.00 | $1,333.33 | $6,533.33 |
| 1,000,000 | $22,000.00 | $30,000.00 | $13,333.33 | $65,333.33 |

These are scenario multiplications, not volume forecasts. Their job is to make the unit visible: one cent per task becomes $10,000 across one million identical tasks.

Large ratios and large business effects are not the same thing. The useful question is how much absolute money a meter adds at the workload's real volume.

## Providers expose different billing structures

There is no shared provider-independent "agent price." The useful comparison is which **meter families and pricing rules** appear in each product stack, not which provider is cheapest.

![Provider billing-meter matrix](/research/agent-economics/charts/chart-03-meter-matrix.svg)

### OpenAI: a search call and search content can both be billable

OpenAI's pricing page lists web search at $10 per 1,000 calls and separately states that search-content tokens are billed at model rates. A cost model therefore needs the invocation and the returned content when both apply.

File Search has another split: the page lists a tool-call price and storage by GB-day after the free allowance. Hosted Shell and Code Interpreter use container pricing, including a minimum billing duration for eligible sessions.

The double-counting rule is equally important. If search content already appears in measured model input, do not add the same tokens again under an invented "search token" line.

### Anthropic: Managed Agents replaces one runtime charge with another

For Claude Managed Agents, model tokens and running-session time are separate base meters. A web search adds its per-search charge. Anthropic says the $0.08/session-hour Managed Agents runtime replaces the Code Execution container-hour model, so charging both would be wrong.

Standalone Code Execution has its own applicability rules. [Anthropic's Code Execution documentation](https://platform.claude.com/docs/en/agents-and-tools/tool-use/code-execution-tool) describes the free allowance, the conditions under which execution is included with qualifying web tools, and the five-minute minimum when paid container-hour billing applies.

Managed Agents also illustrates why configuration belongs in a rule layer. Anthropic documents Batch, Fast mode, and data-residency modifiers for other Messages API paths, but explicitly excludes those modifiers from Managed Agents sessions.

### Google: execution can become token usage instead of runtime billing

Google's paid Gemini API currently assigns no separate session-runtime fee to Code Execution. Generated code and execution results can enter token accounting instead; [Google's Code Execution documentation](https://ai.google.dev/gemini-api/docs/code-execution) exposes those intermediate token fields.

File Search follows another rule: current pricing lists indexing embeddings at $0.15 per million tokens, while query-time embeddings and File Search storage are unbilled; retrieved document tokens are charged as normal model input.

Google also says Managed Agents environment compute is **currently unbilled during preview**. That is a product-state rule. It should not be treated as proof that agent runtime has a permanent zero price.

### xAI: a fixed tool fee is not universal even inside one provider

xAI currently lists fixed invocation prices for several server-side tools: web search, X search, Code Execution, attachment search, and collections search. Tool-using requests also incur model-token charges.

Remote MCP follows a different rule. xAI lists no fixed Remote MCP invocation fee, while the tokens used by the request remain billable. File and collection storage add stored-state meters measured by GiB-day.

A single field called "tool cost" would hide these differences.

## Repeated turns can enlarge the token meter

An agent's token bill is not necessarily the user's prompt plus the final answer. Tool schemas, tool-use messages, retrieved content, execution results, and previous turns can enter later model calls.

Anthropic documents token overhead around tool use and counts search-generated content that enters context. Google documents intermediate code and execution-result tokens in iterative Code Execution. OpenAI states that tokens used with built-in tools are billed at the selected model's token rates.

For a multi-turn workflow, sum model usage across turns rather than pricing only the opening prompt:

$$
C_{\text{tokens}}
=
\sum_{t=1}^{T}
\left(
I_t p_I+O_t p_O+R_t p_R+K_t p_K
\right)
$$

Use only the token categories the provider actually reports. If reasoning is already included in output billing, do not add it twice. If retrieved text is already inside measured input tokens, do not create a second copy.

## / CLAIM CHECK

**CLAIM**

"Model X costs $Y per million tokens."

**WHAT THAT MEASURES**

A defined category of model-token usage under a defined model and pricing configuration.

**WHAT IT DOES NOT MEASURE**

It does not tell you how many model turns the agent will make, how many separately billed tools it will invoke, whether runtime is charged, how long state is stored, which pricing modifiers apply, or how often the workflow retries.

**WHEN IT IS USEFUL**

When token usage is the quantity being compared under matched conditions, or when measurement shows tokens dominate the task.

**WHEN IT IS NOT ENOUGH**

When the workflow crosses other meter families or when product rules change how a meter is priced or whether it applies.

**SECOND / PASS**

Keep the token rate. Price the rest of the path too.

## The public price page cannot supply your workload

Provider documentation gives unit prices and product rules. It cannot tell you the universal number of agent turns, searches, retrieved tokens, cache hits, running minutes, retries, or stored bytes for your system. Public list prices can also differ from negotiated enterprise terms, and preview pricing can change.

Those unknowns do not remove the conclusion. They tell us what must be measured.

For each agent task, record:

1. model usage across turns;
2. server-side tool invocations;
3. returned content and whether it is already counted in model input;
4. runtime when the provider meters time;
5. stored state and retention time;
6. the active pricing configuration;
7. retries or repairs that repeat earlier work.

Then apply the provider's inclusion, allowance, minimum-duration, and replacement rules before summing the bill.

## Price the path, then optimize the largest meter

An engineering team can use this tomorrow without building a large cost simulator.

Trace one full agent task. Attach the real provider meter to each billable step. Apply configuration and applicability rules. Remove overlapping charges. Measure the quantities on real traffic. Then find the meter that contributes the most money or changes fastest with workload shape.

Optimize that meter first.

In the worked trace, adding search calls changes the largest individual cost line without changing the model. In another workload, tokens, runtime, or stored state may dominate instead. The point is not that one meter replaced tokens. The point is that the workflow decides which meter matters.

## / INTELLIGENCE

Making an agent architecture, model-routing, or infrastructure decision?

SECOND / PASS runs source-backed research sprints that apply this type of cost model to a specific production workload.

[START A RESEARCH BRIEF →](/intelligence)
