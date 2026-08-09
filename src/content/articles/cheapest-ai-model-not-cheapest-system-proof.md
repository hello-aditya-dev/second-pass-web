---
title: "How to model the cost of an accepted AI outcome"
dek: "Notation, derivations and decision rules behind the SECOND / PASS AI inference economics framework."
slug: "cheapest-ai-model-not-cheapest-system-proof"
section: "AI"
format: "PROOF"
author: "Aditya"
publishedAt: 2026-08-09
status: "published"
firstPass:
  - "Separate direct model billing from retry, review, failure and latency costs."
  - "Use accepted outcome as the terminal event rather than a generic benchmark score."
  - "A review-rate break-even can be derived without assuming which model is better."
  - "Multi-stage AI agents require a sequential routing formulation because earlier actions change later state."
featured: false
demo: false
tags:
  - "AI inference economics"
  - "methodology"
  - "model routing"
  - "cost model"
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
  - label: "Ong et al. — RouteLLM"
    url: "https://arxiv.org/abs/2406.18665"
    type: "paper"
    note: "Learned strong/weak LLM routing with preference data."
  - label: "Chen et al. — FrugalGPT"
    url: "https://arxiv.org/abs/2305.05176"
    type: "paper"
    note: "LLM cascades and cost-quality routing."
  - label: "Xu et al. — SeqRoute"
    url: "https://arxiv.org/abs/2605.25424"
    type: "paper"
    note: "Budget-aware sequential routing formulation."
  - label: "Zhang et al. — Budget-Aware Agentic Routing"
    url: "https://arxiv.org/abs/2602.21227"
    type: "paper"
    note: "Agentic routing as sequential/path-dependent."
changeLog:
  - at: 2026-08-09
    type: "published"
    note: "Initial publication."
seoTitle: "Proof: AI inference cost per accepted outcome"
seoDescription: "The equations, assumptions and routing formulation behind SECOND / PASS's accepted-outcome model for AI inference economics."
---

← [READ THE MAIN ANALYSIS](/articles/cheapest-ai-model-not-cheapest-system)

# / PROOF

## Scope

This page documents the mathematics used by the flagship. It intentionally does not create a cross-provider quality ranking. Current public evidence is adequate to verify price configurations; it is not adequate to infer one production success probability shared across workloads.

All currency values in worked examples are USD. Prices are public list prices observed on 2026-08-09.

## 1. Objects and notation

Let:

- $x$: one incoming task.
- $a$: one execution action or configuration.
- $\pi$: a routing policy.
- $T_{\text{in}}(a,x)$: billable input tokens.
- $T_{\text{out}}(a,x)$: billable output tokens.
- $p_{\text{in}}(a)$: input USD per token.
- $p_{\text{out}}(a)$: output USD per token.
- $C_{\text{tool}}(a,x)$: tool and retrieval charges.
- $R(a,x)$: indicator that human review is required.
- $t_R$: review time in hours.
- $w_R$: loaded reviewer USD/hour.
- $F(a,x)$: terminal failure indicator.
- $D_F(x)$: monetary loss associated with a terminal failure.
- $L(a,x)$: end-to-end latency.
- $P_L(L)$: monetized latency penalty.
- $A(a,x)$: indicator for a correct, policy-compliant, accepted output.

Direct cost:

24184
C_{\text{direct}}(a,x)
=
T_{\text{in}}p_{\text{in}}
+
T_{\text{out}}p_{\text{out}}
+
C_{\text{tool}}
24185

Human review:

24184
C_{\text{review}}(a,x)
=
R(a,x)t_Rw_R
24185

Terminal failure:

24184
C_{\text{failure}}(a,x)
=
F(a,x)D_F(x)
24185

Total:

24184
C_{\text{system}}
=
C_{\text{direct}}
+
C_{\text{retry}}
+
C_{\text{review}}
+
C_{\text{failure}}
+
P_L(L)
24185

## 2. Why QAC is useful but incomplete

The dossier proposed:

24184
QAC = \frac{E[C]}{P(success)}
24185

This is dimensionally valid: USD divided by a dimensionless probability gives expected USD per successful outcome under a repeated-attempt interpretation.

The weakness is semantic rather than mathematical. `success` must be defined.

We use:

24184
A = S_{\text{semantic}}
\land S_{\text{format}}
\land S_{\text{policy}}
\land S_{\text{tool}}
\land S_{\text{acceptance}}
24185

when those dimensions apply.

Then:

24184
CAO = \frac{E[C_{\text{system}}]}{P(A)}
24185

**Limitation:** if unsuccessful attempts terminate instead of being retried until acceptance, the ratio should not be interpreted as a literal realized cost. It is a normalization metric. The full expected-loss formulation below is preferable for one-shot decisions.

## 3. Expected-loss objective

For policy $\pi$:

24184
J(\pi)
=
E_x[
C_{\text{direct}}(\pi,x)
+
C_{\text{review}}(\pi,x)
+
C_{\text{retry}}(\pi,x)
+
D_F(x)(1-A_{\pi,x})
+
P_L(L_{\pi,x})
]
24185

Choose:

24184
\pi^*=\arg\min_\pi J(\pi)
24185

subject to:

24184
P(A_{\pi,x}=1)\ge q_{\min}(x)
24185

24184
P(L_{\pi,x}>L_{\text{SLA}})\le\epsilon
24185

24184
E[C_{\text{direct}}]\le B
24185

This preserves quality as a constraint rather than assigning an arbitrary universal dollar value to one "quality point."

If business value $V(x)$ is credibly estimable, the equivalent value form is:

24184
\max_\pi E[V(x)A_{\pi,x}-C_{\text{system}}(\pi,x)]
24185

## 4. Retry derivation

With independent, identical attempts, success probability $p$ and attempt cost $c$:

24184
E[N]=\frac{1}{p}
24185

and:

24184
E[C_{\text{success}}]=\frac{c}{p}
24185

This is the familiar geometric model.

For a finite heterogeneous sequence $k=1,\ldots,K$, let $p_k$ be conditional success on attempt $k$ given all previous attempts failed, and $c_k$ its cost.

The probability attempt $k$ is reached is:

24184
P(reach\ k)=\prod_{j<k}(1-p_j)
24185

Expected execution cost:

24184
E[C_K]
=
\sum_{k=1}^K
c_k
\prod_{j<k}(1-p_j)
24185

Probability of at least one success:

24184
P(S_K)
=
1-
\prod_{k=1}^K(1-p_k)
24185

Normalized cost per successful sequence:

24184
\frac{E[C_K]}{P(S_K)}
24185

### Important limitation

Retries are frequently correlated. A malformed instruction or missing document can cause every retry to fail. The empirical model should therefore condition on failure class:

24184
p_k = p_k(x,e_{1:k-1})
24185

rather than assume independence.

## 5. Human-review break-even

Suppose configuration $j$ costs $\Delta C_{\text{direct}}>0$ more than configuration $i$.

Let one review cost:

24184
C_R=t_Rw_R
24185

If configuration $j$ reduces review probability by $\Delta r_R$, the avoided expected review cost is:

24184
\Delta r_R C_R
24185

Break-even:

24184
\Delta r_R C_R = \Delta C_{\text{direct}}
24185

therefore:

24184
\boxed{
\Delta r_R^*=
\frac{\Delta C_{\text{direct}}}{t_Rw_R}
}
24185

### Worked substitution

Current short-context prices:

- GPT-5.6 Luna input/output = $0.20/$1.20 per MTok.
- GPT-5.6 Sol input/output = $5/$30 per MTok.

At 10k input and 1k output:

24184
C_L=0.0032
24185

24184
C_S=0.0800
24185

24184
\Delta C=0.0768
24185

Review:

24184
t_R=3/60=0.05\ hours
24185

24184
w_R=90\ USD/hour
24185

24184
C_R=4.50
24185

24184
\Delta r_R^*=0.0768/4.50=0.017066\ldots
24185

24184
\boxed{\Delta r_R^*=1.71\ percentage\ points}
24185

Rounding: two decimal percentage points.

## 6. Failure-cost break-even

If the only downstream difference is terminal failure probability, with monetary failure loss $D_F$:

24184
\Delta p_F^*=
\frac{\Delta C_{\text{direct}}}{D_F}
24185

For a $100 failure event and $\Delta C=0.0768$:

24184
\Delta p_F^*=0.000768
24185

or **0.0768 percentage points**.

This is an illustrative sensitivity result. It does not assign $100 as a universal failure cost.

## 7. Latency penalties

A production objective should not blindly monetize milliseconds. Choose the penalty based on the workload.

Linear:

24184
P_L(L)=\alpha L
24185

Threshold/SLA:

24184
P_L(L)=c_{\text{SLA}}\mathbf{1}[L>L_{\text{SLA}}]
24185

Piecewise-linear:

24184
P_L(L)=\alpha(L-L_0)_+
24185

Convex:

24184
P_L(L)=\alpha(L-L_0)_+^2
24185

Tail-sensitive:

24184
P_L = \lambda\,CVaR_\alpha(L)
24185

**Selection rule:** use the simplest penalty that corresponds to a real business mechanism. A contractual SLA is naturally thresholded. Queueing or abandonment may require a fitted nonlinear function.

## 8. Cache break-even

Normalize uncached input to 1.

Write multiplier $w$, read multiplier $r$, and $N$ eligible uses:

24184
C_{\text{cache}}=w+r(N-1)
24185

24184
C_{\text{uncached}}=N
24185

Caching wins when:

24184
w+r(N-1)<N
24185

24184
N>\frac{w-r}{1-r}
24185

For $w=1.25,r=0.10$:

24184
N>1.277\ldots
24185

Integer break-even: **2 uses**.

For $w=2.00,r=0.10$:

24184
N>2.111\ldots
24185

Integer break-even: **3 uses**.

Operational cache-hit probability can be added by replacing the deterministic read term with its expected value.

## 9. Sequential routing

Single-turn selection:

24184
a^*(x)=
\arg\min_a
E[C_{\text{system}}(a,x)]
24185

subject to acceptance and latency constraints.

For an agent or cascade, define state:

24184
s_t =
(x,
y_{1:t},
v_{1:t},
C_{1:t},
L_{1:t})
24185

where $y$ are prior outputs and $v$ verifier signals.

Actions can include:

24184
a_t \in
\{accept, retry, retrieve, tool, small, frontier, human\}
24185

Bellman form:

24184
V(s)=\min_a E[c(s,a)+V(s')]
24185

with terminal loss for incorrect acceptance.

This formulation is supported conceptually by sequential/budget-aware routing research, but SECOND / PASS does not import reported benchmark savings into enterprise forecasts. ([RouteLLM](https://arxiv.org/abs/2406.18665)–[Agentic Routing](https://arxiv.org/abs/2602.21227))

## 10. Configuration rather than model

Define configuration:

24184
a=
(m,k,c,b,s,r,g)
24185

where:

- $m$: model/version
- $k$: context band
- $c$: cache state/policy
- $b$: Batch or online
- $s$: service tier
- $r$: reasoning mode/effort
- $g$: region/residency

This is required because price and latency may change along these dimensions.

## 11. Self-hosting boundary model

We keep owned-fleet numerical results out of v1 because public hardware specifications and rental prices do not determine owned TCO.

The conceptual model is:

24184
C_{\text{fixed/request}}
=
\frac{K\cdot CRF(r,n)+F}
{31{,}536{,}000\;u\theta}
24185

where:

- $K$: infrastructure CapEx, USD
- $CRF(r,n)$: capital recovery factor
- $F$: annual fixed operations, USD/year
- $u$: effective utilization, dimensionless
- $\theta$: successful requests/second at full utilization under the target SLO

24184
CRF(r,n)=
\frac{r(1+r)^n}{(1+r)^n-1}
24185

This reveals the utilization sensitivity:

24184
C_{\text{fixed/request}}\propto\frac{1}{u}
24185

But without workload-equivalent throughput and defensible CapEx, numerical break-even would be false precision.

## 12. Energy boundary model

A simplified dedicated-device estimate is:

24184
E_{\text{request}}
\approx
P_{\text{IT}}\cdot t\cdot PUE
24185

after converting watt-hours to kWh.

This is only defensible if $P_{\text{IT}}$ represents measured system power attributable to the request. GPU TDP is a design limit, not measured inference energy. The public v1 therefore does not publish energy/request.

## Reproducibility

1. Use [AI Inference Price Surface v0.1](/articles/ai-inference-price-surface-v0-1) and its CSV download.
2. Use the chart CSVs under `05_CHARTS/data/`.
3. Recompute direct cost as:
   `input_tokens / 1e6 * input_price + output_tokens / 1e6 * output_price`.
4. Recompute review threshold with:
   `(expensive_direct - cheap_direct) / review_cost`.
5. Re-run cache equations from the multipliers.
6. Treat all review/failure rates as scenario variables unless replaced with measured workload data.

## Methodological limitations

- Public list price is not enterprise effective price.
- Same text can tokenize differently across models.
- Provider evaluation scores are not production acceptance rates.
- No controlled latency measurements are included.
- The routing policy is a framework, not a trained router.
- No causal claim is made that changing model alone changes review or failure rates.

---

EXPLORE / [DATA →](/articles/ai-inference-price-surface-v0-1)  
READ / [SECOND PASS →](/articles/cheapest-ai-model-not-cheapest-system)
