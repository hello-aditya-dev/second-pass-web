---
title: "One user request can become N model and tool calls"
dek: "A single external request is not a single unit of backend work. An agent run is a directed execution graph, and the number of internal operations it produces is workload-specific. Capacity, concurrency, reliability and successful-request economics all change once that is measured rather than assumed."
slug: "one-user-request-can-become-n-model-and-tool-calls"
section: "Systems"
format: "SECOND PASS"
author: "Aditya"
publishedAt: "2026-08-11"
status: "published"
firstPass:
  - "One external user request can produce several internal model calls, tool calls, handoffs, retries and verifications. The expansion factor is architecture- and workload-specific, not a constant."
  - "Under three HOUSE scenarios, expected model calls per request range from 2.10 to 7.60 and expected tool calls from 1.50 to 12.00. At 100 external requests per second that becomes 210 to 760 model calls per second and 150 to 1,200 tool calls per second before burst headroom."
  - "Parallel fan-out raises total work roughly in proportion to branch count, but critical-path latency grows much more slowly. For eight independent exponential branches, total work rises 8x while expected maximum latency rises only to about 2.7x."
  - "Reliability compounds across mandatory operations. Under an independence assumption, six mandatory operations each 99% reliable already push whole-run success below 95%."
  - "Model token price alone does not decide agent cost. Five cheap-model calls plus one web search can cost more than one call to a stronger model before quality or failure rates are considered."
featured: false
featuredRank: 0
editorialOrder: 2
demo: false
adPolicy: "none"
sources:
  - label: "OpenAI Agents SDK — integrations and observability"
    url: "https://developers.openai.com/api/docs/guides/agents/integrations-observability"
    type: "primary"
  - label: "OpenAI Agents SDK — orchestration"
    url: "https://developers.openai.com/api/docs/guides/agents/orchestration"
    type: "primary"
  - label: "OpenAI API pricing"
    url: "https://developers.openai.com/api/docs/pricing"
    type: "primary"
  - label: "Anthropic — about Claude pricing"
    url: "https://platform.claude.com/docs/en/about-claude/pricing"
    type: "primary"
  - label: "Google Cloud — enhanced tool governance in Vertex AI Agent Builder"
    url: "https://cloud.google.com/blog/products/ai-machine-learning/new-enhanced-tool-governance-in-vertex-ai-agent-builder"
    type: "primary"
  - label: "LangGraph — multi-agent collaboration"
    url: "https://langchain-ai.github.io/langgraph/tutorials/multi_agent/multi-agent-collaboration/"
    type: "primary"
changeLog:
  - at: "2026-08-11"
    type: "published"
    note: "Initial publication."
seoTitle: "One user request can become N model and tool calls"
seoDescription: "How agent fan-out turns one external request into N internal model and tool calls, and why capacity, concurrency, reliability and successful-request economics must be measured from the execution graph."
---

One click is not one unit of backend work. A user submits a request. Behind it, an agent runtime can call a model, call a tool, hand off to a specialist, retry a failed operation, run a verifier, and synthesize a final answer. The externally visible event is one request. The internal execution is a graph.

This is the operational fact that the earlier piece on [agent billing meters](/articles/an-ai-agent-is-no-longer-priced-in-tokens) established from the pricing side: an agent can touch tokens, search, runtime and stored state inside a single run. That article identified the meters. This one measures how many times an execution graph can activate them, and how that hidden fan-out changes upstream rate, concurrency, reliability, tail latency and cost per successful run.

The distinction matters because the four quantities an operator usually monitors — external requests per second, GPU utilization, token spend, error rate — are all measured at the boundary. The graph is not. When capacity is sized from the boundary number and the graph is large, the system is undersized by construction.

## / QUESTION

If one user request can become N internal operations, what is N, and what changes when N is measured rather than assumed?

## The agent run is the systems unit

A **user request** is one request initiated by a user. An **agent run** is everything the system does because of that request until it reaches a terminal state: a successful response, terminal failure, timeout, or another user-visible outcome. A **model call** is one invocation of a language model. A **tool call** is one invocation of a search, retrieval, external API, code sandbox or similar external operation, metered separately from model tokens. A **handoff** transfers control between agents. A **specialist** or **sub-agent** is a child agent invoked by a parent. A **retry** is a re-execution of a failed operation attempt; it counts as another operation attempt. A **verifier** or **evaluator** checks an intermediate result before synthesis. **Final synthesis** is the terminal model call that produces the user-visible response.

Modern agent runtimes expose these as separate operational events. OpenAI's Agents SDK emits structured records for the overall run, each model call, tool calls and outputs, handoffs and guardrails, and custom spans. Its orchestration layer supports handoffs and manager-style "agents as tools" specialist calls. LangGraph documents subagents, handoffs and routing patterns. Anthropic and Google expose comparable runtime and session meters. The primitives are not theoretical.

None of this implies every platform has identical semantics, or that every agent run fans out. A one-shot chatbot can remain close to one user request producing one model call. The point is that the run, not the request, is the unit that decides capacity.

![Directed execution graph showing one user request expanding through a router model into four parallel specialists, each calling a distinct tool (web search, file search, external API, code sandbox), joining at an evaluator, and ending at final synthesis.](/research/agent-fanout/charts/chart-01-execution-graph.svg "One external request can expand into a router, parallel specialists with distinct tools, an evaluator and a final synthesis. HOUSE ARCHITECTURE EXAMPLE — not a universal agent graph.")

The diagram above is a HOUSE architecture example. It is not a measured production agent average. Its job is to make the expansion visible: one request, one router, four specialists, four tools, one evaluator, one synthesis — and the request is not done until all of them resolve.

## / CALCULATION — expected calls per request

**QUESTION**

How many internal operations does one user request produce?

**ASSUMPTIONS**

Three HOUSE scenarios, each a complete agent architecture with stated per-node reach probability <imath>q_i</imath>, per-attempt success <imath>p_i</imath>, retry budget <imath>R_i</imath>, and operation class (model or tool).

- **A — Simple tool agent.** One planner call, one web search, one final model call.
- **B — Research agent.** Planner, six parallel web searches, two file retrievals, synthesis, verification, occasional retry.
- **C — Multi-agent enterprise.** Router, four specialists with tools, evaluator, final synthesis, corrective retries.

These are SECOND / PASS scenarios. They are not vendor benchmarks and not a distribution over real production agents.

**EQUATION**

For operation <imath>i</imath> with per-attempt failure <imath>f_i = 1 - p_i</imath> and retry budget <imath>R_i</imath> (attempts after the first), expected attempts conditional on the node being reached:

$$
A_i = \sum_{k=0}^{R_i} f_i^{\,k} = \frac{1 - f_i^{\,R_i+1}}{p_i}, \quad p_i > 0
$$

Multiplied by reach probability <imath>q_i</imath> and summed over the graph, the expected total internal attempts per request:

$$
E[N_{\text{total}}] = \sum_{i \in V} q_i \, A_i
$$

Restricting the sum to a class <imath>J</imath> (model calls, tool calls) gives the per-class expectation <imath>E[N_J]</imath>.

**RESULT**

| Scenario | <imath>E[N_{\text{model}}]</imath> | <imath>E[N_{\text{tool}}]</imath> | AWA <imath>E[N_{\text{total}}]</imath> |
|---|---:|---:|---:|
| A — Simple tool agent | 2.10 | 1.50 | 3.60 |
| B — Research agent | 3.25 | 8.00 | 11.25 |
| C — Multi-agent enterprise | 7.60 | 12.00 | 19.60 |

AWA — Agent Work Amplification — is a SECOND / PASS proposed accounting metric: expected internal operation attempts per external request. It is not an industry standard, not a benchmark, and not a quality score. Its only role is to make internal work per external request visible. The underlying model-call, tool-call and retry counts beside it remain the operative quantities.

**SO WHAT**

A research-agent request produces, in expectation, 11.25 internal operations. A multi-agent enterprise request produces 19.60. A capacity plan that treats one external request as one model call is wrong by a factor of roughly 3 to 8 on model calls alone, before tools are counted.

**CAVEAT**

These are HOUSE scenarios. Real agents have different graphs, different retry budgets, different reach probabilities. The numbers above are reproducible from the published architecture assumptions; they are not a distribution over production traffic.

## Bounded fan-out, in one line

When the graph has a bounded branching factor, expected work has a closed form. Let <imath>b</imath> be the number of children an active node makes available, <imath>p</imath> the probability each candidate child activates, and <imath>d</imath> the maximum depth. The effective fan-out is <imath>F = b \times p</imath>, and expected operations through depth <imath>d</imath>, including the root, are:

$$
E[N] = \sum_{k=0}^{d} F^{\,k} = \frac{1 - F^{\,d+1}}{1 - F}, \quad F \neq 1
$$

The familiar teaching example is <imath>F = 2</imath>, <imath>d = 4</imath>:

$$
E[N] = 1 + 2 + 4 + 8 + 16 = 31 \text{ operations}
$$

That 31 is a HOUSE teaching result. It is not a claim that a production agent with branching factor 2 makes 31 calls. Routing probabilities, fan-out caps and early termination decide the real graph. The closed form is useful because it shows how quickly expected work moves when <imath>F</imath> crosses 1: below 1 it shrinks by level, at 1 it grows linearly with depth, above 1 it expands until bounded by depth or termination.

## / CALCULATION — external RPS becomes upstream RPS

**QUESTION**

How much does external request rate understate upstream provider rate?

**ASSUMPTIONS**

- External user rate <imath>R_{\text{user}}</imath> = 100 requests/second.
- Per-request expectations from the prior calculation: <imath>E[N_{\text{model}}]</imath> and <imath>E[N_{\text{tool}}]</imath> by scenario.

**EQUATION**

For operation class <imath>j</imath>:

$$
R_{\text{upstream},j} = R_{\text{user}} \times E[N_j]
$$

**RESULT**

| Scenario | Model calls/s | Tool calls/s |
|---|---:|---:|
| A — Simple tool agent | 210 | 150 |
| B — Research agent | 325 | 800 |
| C — Multi-agent enterprise | 760 | 1,200 |

At 100 external requests per second, the research-agent HOUSE scenario produces 325 model calls per second and 800 tool calls per second. The multi-agent scenario produces 760 model calls per second and 1,200 tool calls per second. A capacity plan sized only from the 100 external RPS would be wrong by construction.

**SO WHAT**

Provider rate limits, token-minute limits, and tool-call quotas are all upstream. A user-facing RPS ceiling of 100 can translate into a model-call ceiling of well under 100 once the graph is taken into account. The binding constraint moves inside the system.

**CAVEAT**

Burst headroom and failure reserve multiply these numbers further. The 325 and 760 are mean-rate figures before any safety margin.

![Line chart showing upstream model calls per second rising linearly with external user requests per second for three HOUSE scenarios, with a dashed one-to-one reference line. At 100 external RPS the three scenarios reach 210, 325 and 760 model calls per second.](/research/agent-fanout/charts/chart-02-upstream-rps.svg "External RPS systematically understates upstream model-call rate. HOUSE SCENARIO / DERIVED RESULT — the 1:1 reference line is not a typical-traffic line.")

## Rate is not concurrency

Upstream rate says how many operations arrive per second. It says nothing about how many are in flight at once. Under stable flow, Little's Law gives the mean internal concurrency for class <imath>j</imath>:

$$
L_j = R_{\text{upstream},j} \times \tau_j = R_{\text{user}} \times E[N_j] \times \tau_j
$$

where <imath>\tau_j</imath> is the mean service time for class <imath>j</imath>. For the research-agent scenario at 100 external RPS, with mean model-call duration 1.8 s and mean tool-call duration 1.2 s:

- model calls in flight: <imath>100 \times 3.25 \times 1.8 = 585</imath>
- tool calls in flight: <imath>100 \times 8.00 \times 1.2 = 960</imath>

External RPS alone is not enough for quota planning, and upstream RPS alone is not enough for in-flight capacity planning. The two quantities have the same numerator and different denominators.

## Work is not latency

Total work and end-to-end latency are different dimensions. Total work counts every consumed operation second, even when operations overlap. End-to-end latency follows the critical dependency path:

$$
T_{\text{critical}} = \max_{P} \sum_{i \in P} t_i
$$

For a serial chain <imath>A \to B \to C</imath>, latency is roughly <imath>t_A + t_B + t_C</imath>. For a fan-out <imath>A \to \{B_1, B_2, B_3, B_4\} \to C</imath> where all four branches must complete, latency is roughly <imath>t_A + \max(t_{B_1}, t_{B_2}, t_{B_3}, t_{B_4}) + t_C</imath>, not <imath>t_A + t_{B_1} + t_{B_2} + t_{B_3} + t_{B_4} + t_C</imath>.

For <imath>n</imath> independent and identically distributed exponential branches with mean <imath>\tau</imath>, the expected maximum is the harmonic number:

$$
E[\max(T_1, \dots, T_n)] = \tau \, H_n
$$

At <imath>n = 8</imath>, <imath>H_8 \approx 2.718</imath>. Total branch work rises from <imath>1\tau</imath> to <imath>8\tau</imath>, linearly. Expected maximum latency rises from <imath>1\tau</imath> to about <imath>2.718\tau</imath>. Parallelism did not create 8x latency. It still worsened the synchronization tail: the p95 of a single branch is about <imath>2.996\tau</imath>, while the p95 of the maximum of eight all-required branches is about <imath>5.05\tau</imath>.

![Two-series line chart showing total branch work rising linearly with parallel branch count while expected maximum branch latency rises much more slowly, following the harmonic-number curve. At 8 branches, work is 8 seconds and expected max latency is about 2.7 seconds.](/research/agent-fanout/charts/chart-03-work-vs-critical-path.svg "Parallelism amplifies work faster than mean critical-path latency. HOUSE TEACHING MODEL — exponential IID branches; real branch-latency distributions differ.")

This is why a multi-agent design can have 20 internal operations, six concurrent calls, and a 12-second response rather than 20 times one-call latency. The critical path is what the user feels. The total work is what the provider bills and what the cluster serves.

## Reliability compounds across mandatory operations

For <imath>n</imath> mandatory operations with eventual per-node success probabilities <imath>s_i</imath>, under an independence assumption:

$$
P_{\text{success}} = \prod_{i=1}^{n} s_i = s^n \text{ when identical}
$$

At <imath>s = 0.99</imath> per operation, the run-success probability is:

- 1 operation: 99.00%
- 5 operations: 95.10%
- **6 operations: 94.15%** — first below 95%
- 10 operations: 90.44%
- 20 operations: 81.79%

Six mandatory operations, each 99% reliable, already push whole-run success below 95%. This is a teaching boundary. It is not a production-reliability claim. Real failures correlate: a provider outage, a shared network failure, bad upstream data, or one malformed state can take several operations down together. The independence assumption is a best case. The lesson is directional — run success falls faster than per-operation success — not a universal curve.

## Retry amplifies work

When an operation fails and is retried, the retry is another operation attempt. For unbounded identical retries with per-attempt failure <imath>r</imath>:

$$
E[\text{attempts}] = \frac{1}{1 - r}, \qquad M_{\text{retry}} = \frac{1}{1 - r}
$$

The retry cost multiplier crosses 1.25 when <imath>r \geq 0.20</imath>. With a single retry permitted, <imath>E[\text{attempts}] = 1 + r</imath>, and the 1.25 threshold moves to <imath>r \geq 0.25</imath>. At 30% per-attempt failure with unbounded retries, expected work is 1.43x the no-retry case; at 40%, 1.67x.

Retries sit on top of the graph. They increase <imath>E[N]</imath> directly, increase upstream RPS, increase in-flight concurrency, and — because retried operations are not free — increase the spent-before-success fraction of cost.

## / CLAIM CHECK — "More calls automatically mean proportionally more latency"

**CLAIM**

Parallel calls multiply latency in proportion to call count.

**WHAT IS TRUE**

Total work — the sum of operation seconds consumed — does scale roughly with call count. Provider billing, token spend and tool-call meters all scale with it.

**WHAT IS MISSING**

End-to-end latency follows the critical dependency path, not the sum. For parallel all-required branches, the expected maximum grows as the harmonic number <imath>H_n</imath>, not as <imath>n</imath>. Eight branches do not produce 8x latency; they produce roughly 2.7x expected max latency under the teaching distribution.

**WHAT THAT MEASURES**

The gap between work and latency. It is useful for explaining why a 20-operation agent run can still return in 12 seconds rather than 20 times one-call latency.

**WHAT IT DOES NOT MEASURE**

It does not mean parallelism is free. Token spend, tool spend, operation count, upstream RPS, in-flight concurrency, and branch-failure probability all still scale with branch count. Parallelism trades cost and rate for a slower-growing critical path.

**SECOND / PASS**

Model work and latency separately. The first decides cost and rate. The second decides user experience. They are not the same number.

## Cheap-many versus strong-few

The temptation, once fan-out is visible, is to conclude that cheaper models win because more calls are affordable. The arithmetic says otherwise. Consider two orchestration paths for the same job.

The cheap path uses <imath>N_c</imath> calls to a cheap model at per-call cost <imath>C_c</imath>, plus direct tool spend <imath>T_c</imath>, and succeeds with probability <imath>P_c</imath>. The strong path uses <imath>N_e</imath> calls to a stronger model at per-call cost <imath>C_e</imath>, plus tool spend <imath>T_e</imath>, and succeeds with probability <imath>P_e</imath>. Successful-request cost is:

$$
C_{\text{success,c}} = \frac{N_c C_c + T_c}{P_c}, \qquad C_{\text{success,e}} = \frac{N_e C_e + T_e}{P_e}
$$

The cheap path loses when:

$$
\frac{N_c C_c + T_c}{P_c} > \frac{N_e C_e + T_e}{P_e}
$$

Using OpenAI standard short-context pricing — GPT-5.6 Luna at $0.20/$1.20 per million input/output tokens, GPT-5.6 Terra at $2.00/$12.00 — and a fixed 2,000-input / 800-output token shape per call:

- one Luna call: <imath>2000 \times 0.20/10^6 + 800 \times 1.20/10^6 = \$0.00136</imath>
- one Terra call: <imath>2000 \times 2/10^6 + 800 \times 12/10^6 = \$0.0136</imath>

Token-only, the ratio is 10 to 1. Five Luna calls ($0.00680) still cost less than half of one Terra call. Add one $0.01 web search, and five Luna calls plus one search ($0.01680) cost more than one Terra call — before quality, retries or failure rates enter. The tool, not the model, decides the comparison.

![Decision-region chart showing the break-even boundary between cheap-many (Luna plus web searches) and one strong (Terra) call. The region where the cheap path costs more expands sharply once a single web search is added.](/research/agent-fanout/charts/chart-04-cheap-vs-strong-break-even.svg "The cheap-many path becomes more expensive than one strong-model call well before ten cheap calls, once tool meters enter. HOUSE SCENARIO / DERIVED RESULT — fixed 2k/800 token shape; OpenAI standard short-context pricing verified 2026-08-11.")

## / CLAIM CHECK — "The cheapest model is the cheapest agent architecture"

**CLAIM**

The model with the lowest token price produces the cheapest agent.

**WHAT IS TRUE**

At fixed token shape and no tools, cheap-model token cost is a small fraction of strong-model token cost. Ten Luna calls cost the same as one Terra call.

**WHAT IS MISSING**

Agent cost is not token cost. The orchestration path adds tools, retries, failed-run waste, verification, and quality-driven escalation. A single $0.01 web search flips the 10:1 token ratio. A 5% failure-rate difference flips it again. A verifier that prevents a costly failed run can make the path with more calls cheaper than the path with fewer.

**WHAT THAT MEASURES**

Successful-request cost, not per-call cost, is the operative quantity. <imath>(N C + T) / P</imath> cannot be reduced to <imath>C</imath> alone.

**WHAT IT DOES NOT MEASURE**

It does not say strong models are always cheaper. It says model token rate alone is insufficient when orchestration paths differ. The [cheapest-model-is-not-cheapest-system](/articles/cheapest-ai-model-not-cheapest-system) result holds at the routing level; this one holds at the orchestration level.

**SECOND / PASS**

Measure successful-request cost after orchestration. Token price is one input to that number, not the number itself.

## When fan-out is rational

Fan-out is not inherently bad. It is rational when cheap specialist calls replace one expensive monolithic call; when parallelism reduces critical-path latency enough to justify the extra work; when a verifier prevents a high-cost failure; when caching removes repeated context cost; when optional branches terminate early. A more expensive model can reduce retries, judge calls, failed runs and specialist branches — total successful-request cost can fall even as per-call cost rises.

The verification-pays condition makes this precise. Let a base workflow cost <imath>C_0</imath> fail with probability <imath>f_0</imath>. A verifier costs <imath>C_v</imath> and reduces failure to <imath>f_1</imath>. Adding the verifier is economically beneficial under repeated-run successful-request accounting when:

$$
\frac{C_0 + C_v}{1 - f_1} < \frac{C_0}{1 - f_0}
\quad \Longleftrightarrow \quad
C_v < C_0 \, \frac{f_0 - f_1}{1 - f_0}
$$

Verification pays only when the reduction in failed-run waste exceeds the verifier's own cost. It can still be required for safety or compliance even when it does not reduce direct cost. The same logic — extra call, lower total expected cost — applies to specialists, retrieval, and parallelism with early termination.

## What to measure from traces

Before capacity, reliability or successful-request economics can be modeled, four quantities must come out of the agent runtime's own traces, not from boundary metrics:

- **calls per run**, split by class — model, tool, handoff, retry, verifier — with reach and success probabilities per node;
- **upstream rate by class**, <imath>R_{\text{user}} \times E[N_j]</imath>, checked against provider rate and token-minute limits;
- **in-flight concurrency by class**, <imath>R_{\text{upstream},j} \times \tau_j</imath>, checked against in-flight quotas and connection limits;
- **successful-request cost**, <imath>(N C + T) / P</imath>, with retries and failed-run waste inside <imath>N</imath> and <imath>P</imath>.

If the runtime does not expose per-run graphs, the operator is capacity-planning against the boundary number. That works until it does not.

## Decision consequence

The headline is not "agents have large fan-out." Some do, some do not. The headline is that one user request can become N internal operations, and N is a measurable property of the execution graph. Once N is measured, upstream rate, in-flight concurrency, run reliability, retry-adjusted work, and successful-request cost all follow. Until N is measured, they are guesses.

## / INTELLIGENCE

Running an agent architecture where one request fans out into many?

SECOND / PASS can model your trace data, calls per run, retry and fallback rates, tool usage, latency distribution, model mix and success criteria into a capacity, reliability and successful-request-cost picture you can actually plan against.

[START A RESEARCH BRIEF →](/intelligence)
