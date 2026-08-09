---
title: "How to model the cost of an accepted AI outcome"
dek: "Notation, derivations and decision rules behind the SECOND / PASS AI inference economics framework."
slug: "cheapest-ai-model-not-cheapest-system-proof"
section: "AI"
format: "PROOF"
author: "Aditya"
publishedAt: "2026-08-09"
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
  - label: "RouteLLM (Ong et al.)"
    url: "https://arxiv.org/abs/2406.18665"
    type: "paper"
  - label: "FrugalGPT (Chen et al.)"
    url: "https://arxiv.org/abs/2305.05176"
    type: "paper"
  - label: "SeqRoute (Xu et al.)"
    url: "https://arxiv.org/abs/2605.25424"
    type: "paper"
  - label: "Budget-Aware Routing (Zhang et al.)"
    url: "https://arxiv.org/abs/2602.21227"
    type: "paper"
changeLog:
  - at: "2026-08-09"
    type: "published"
    note: "Initial methodology package."
seoTitle: "Proof: AI inference cost per accepted outcome"
seoDescription: "The equations, assumptions and routing formulation behind SECOND / PASS's accepted-outcome model for AI inference economics."
---

## Scope

This page documents the mathematics used by the flagship. It intentionally does not create a cross-provider quality ranking. Current public evidence is adequate to verify price configurations; it is not adequate to infer one production success probability shared across workloads.

All currency values in worked examples are USD. Prices are public list prices observed on 2026-08-09.

## 1. Objects and notation

Let:

- $$x$$: one incoming task.
- $$a$$: one execution action or configuration.
- $$\pi$$: a routing policy.
- $$T_{\text{in}}(a,x)$$: billable input tokens.
- $$T_{\text{out}}(a,x)$$: billable output tokens.
- $$p_{\text{in}}(a)$$: input USD per token.
- $$p_{\text{out}}(a)$$: output USD per token.
- $$C_{\text{tool}}(a,x)$$: tool and retrieval charges.
- $$R(a,x)$$: indicator that human review is required.
- $$t_R$$: review time in hours.
- $$w_R$$: loaded reviewer USD/hour.
- $$F(a,x)$$: terminal failure indicator.
- $$D_F(x)$$: monetary loss associated with a terminal failure.
- $$L(a,x)$$: end-to-end latency.
- $$P_L(L)$$: monetized latency penalty.
- $$A(a,x)$$: indicator for a correct, policy-compliant, accepted output.

Direct cost:

$$
C_{\text{direct}}(a,x)
=
T_{\text{in}}p_{\text{in}}
+
T_{\text{out}}p_{\text{out}}
+
C_{\text{tool}}
$$

Human review:

$$
C_{\text{review}}(a,x)
=
R(a,x)t_Rw_R
$$

Terminal failure:

$$
C_{\text{failure}}(a,x)
=
F(a,x)D_F(x)
$$

Total:

$$
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
$$

## 2. Why QAC is useful but incomplete

The dossier proposed:

$$
QAC = \frac{E[C]}{P(success)}
$$

This is dimensionally valid: USD divided by a dimensionless probability gives expected USD per successful outcome under a repeated-attempt interpretation.

The weakness is semantic rather than mathematical. `success` must be defined.

We use:

$$
A = S_{\text{semantic}}
\land S_{\text{format}}
\land S_{\text{policy}}
\land S_{\text{tool}}
\land S_{\text{acceptance}}
$$

when those dimensions apply.

Then:

$$
CAO = \frac{E[C_{\text{system}}]}{P(A)}
$$

**Limitation:** if unsuccessful attempts terminate instead of being retried until acceptance, the ratio should not be interpreted as a literal realized cost. It is a normalization metric. The full expected-loss formulation below is preferable for one-shot decisions.

## 3. Expected-loss objective

For policy $$\pi$$:

$$
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
$$

Choose:

$$
\pi^*=\arg\min_\pi J(\pi)
$$

subject to:

$$
P(A_{\pi,x}=1)\ge q_{\min}(x)
$$

$$
P(L_{\pi,x}>L_{\text{SLA}})\le\epsilon
$$

$$
E[C_{\text{direct}}]\le B
$$

This preserves quality as a constraint rather than assigning an arbitrary universal dollar value to one "quality point."

If business value $$V(x)$$ is credibly estimable, the equivalent value form is:

$$
\max_\pi E[V(x)A_{\pi,x}-C_{\text{system}}(\pi,x)]
$$

## 4. Retry derivation

With independent, identical attempts, success probability $$p$$ and attempt cost $$c$$:

$$
E[N]=\frac{1}{p}
$$

and:

$$
E[C_{\text{success}}]=\frac{c}{p}
$$

This is the familiar geometric model.

For a finite heterogeneous sequence $$k=1,\ldots,K$$, let $$p_k$$ be conditional success on attempt $$k$$ given all previous attempts failed, and $$c_k$$ its cost.

The probability attempt $$k$$ is reached is:

$$
P(\text{reach }k)=\prod_{j<k}(1-p_j)
$$

Expected execution cost:

$$
E[C_K]
=
\sum_{k=1}^K
c_k
\prod_{j<k}(1-p_j)
$$

Probability of at least one success:

$$
P(S_K)
=
1-
\prod_{k=1}^K(1-p_k)
$$

Normalized cost per successful sequence:

$$
\frac{E[C_K]}{P(S_K)}
$$

### Important limitation

Retries are frequently correlated. A malformed instruction or missing document can cause every retry to fail. The empirical model should therefore condition on failure class:

$$
p_k = p_k(x,e_{1:k-1})
$$

rather than assume independence.

## 5. Human-review break-even

Suppose configuration $$j$$ costs $$\Delta C_{\text{direct}}>0$$ more than configuration $$i$$.

Let one review cost:

$$
C_R=t_Rw_R
$$

If configuration $$j$$ reduces review probability by $$\Delta r_R$$, the avoided expected review cost is:

$$
\Delta r_R C_R
$$

Break-even:

$$
\Delta r_R C_R = \Delta C_{\text{direct}}
$$

therefore:

$$
\boxed{
\Delta r_R^*=
\frac{\Delta C_{\text{direct}}}{t_Rw_R}
}
$$

### Worked substitution

Current short-context prices:

- GPT-5.6 Luna input/output = $0.20/$1.20 per MTok.
- GPT-5.6 Sol input/output = $5/$30 per MTok.

At 10k input and 1k output:

$$
C_L=0.0032
$$

$$
C_S=0.0800
$$

$$
\Delta C=0.0768
$$

Review:

$$
t_R=3/60=0.05\text{ hours}
$$

$$
w_R=90\text{ USD/hour}
$$

$$
C_R=4.50
$$

$$
\Delta r_R^*=0.0768/4.50=0.017066\ldots
$$

$$
\boxed{\Delta r_R^*=1.71\text{ percentage points}}
$$

Rounding: two decimal percentage points.

## 6. Failure-cost break-even

If the only downstream difference is terminal failure probability, with monetary failure loss $$D_F$$:

$$
\Delta p_F^*=
\frac{\Delta C_{\text{direct}}}{D_F}
$$

For a $100 failure event and $$\Delta C=0.0768$$:

$$
\Delta p_F^*=0.000768
$$

or **0.0768 percentage points**.

This is an illustrative sensitivity result. It does not assign $100 as a universal failure cost.

## 7. Latency penalties

A production objective should not blindly monetize milliseconds. Choose the penalty based on the workload.

Linear:

$$
P_L(L)=\alpha L
$$

Threshold/SLA:

$$
P_L(L)=c_{\text{SLA}}\mathbf{1}[L>L_{\text{SLA}}]
$$

Piecewise-linear:

$$
P_L(L)=\alpha(L-L_0)_+
$$

Convex:

$$
P_L(L)=\alpha(L-L_0)_+^2
$$

Tail-sensitive:

$$
P_L = \lambda\,CVaR_\alpha(L)
$$

**Selection rule:** use the simplest penalty that corresponds to a real business mechanism. A contractual SLA is naturally thresholded. Queueing or abandonment may require a fitted nonlinear function.

## 8. Cache break-even

Normalize uncached input to 1.

Write multiplier $$w$$, read multiplier $$r$$, and $$N$$ eligible uses:

$$
C_{\text{cache}}=w+r(N-1)
$$

$$
C_{\text{uncached}}=N
$$

Caching wins when:

$$
w+r(N-1)<N
$$

$$
N>\frac{w-r}{1-r}
$$

For $$w=1.25,r=0.10$$:

$$
N>1.277\ldots
$$

Integer break-even: **2 uses**.

For $$w=2.00,r=0.10$$:

$$
N>2.111\ldots
$$

Integer break-even: **3 uses**.

Operational cache-hit probability can be added by replacing the deterministic read term with its expected value.

## 9. Sequential routing

### Single-turn policy

For request $$x$$, define an action $$a$$ and terminal accepted event $$A$$. A simple one-step policy chooses:

$$
a^*(x)=
\arg\min_a
E[C_{\text{system}}(a,x)]
$$

subject to:

$$
P(A\mid a,x)\ge q_{\min}(x)
$$

and:

$$
P(L>L_{\text{SLA}})\le\epsilon
$$

### Multi-step (agent / cascade) formulation

For an agent or cascade, define state:

$$
s_t =
(x,
y_{1:t},
v_{1:t},
C_{1:t},
L_{1:t})
$$

where $$y$$ are prior outputs and $$v$$ verifier signals.

Actions can include:

$$
a_t \in
\{\text{accept, retry, retrieve, tool, small, frontier, human}\}
$$

Bellman form:

$$
V(s)=\min_a E[c(s,a)+V(s')]
$$

where the state $$s$$ includes the request, previous outputs, verifier signals, cumulative spend and remaining latency or budget, with terminal loss for incorrect acceptance.

This matters because the cheapest first action can be the expensive policy if it creates retries downstream. The most expensive first action can be wasteful if an inexpensive deterministic or small-model path would have handled the request.

The router should learn the **marginal value of escalation**: for a candidate escalation from configuration $$i$$ to $$j$$, escalation is economically justified when:

$$
\boxed{
\Delta C_{\text{downstream}} > \Delta C_{\text{direct}}
}
$$

subject to minimum quality, policy and latency constraints.

This formulation is supported conceptually by sequential/budget-aware routing research, but SECOND / PASS does not import reported benchmark savings into enterprise forecasts. ([S14]–[S17])

## 10. Configuration rather than model

Define configuration:

$$
a=
(m,k,c,b,s,r,g)
$$

where:

- $$m$$: model/version
- $$k$$: context band
- $$c$$: cache state/policy
- $$b$$: Batch or online
- $$s$$: service tier
- $$r$$: reasoning mode/effort
- $$g$$: region/residency

This is required because price and latency may change along these dimensions.

## 11. Self-hosting boundary model

We keep owned-fleet numerical results out of v1 because public hardware specifications and rental prices do not determine owned TCO.

The conceptual model is:

$$
C_{\text{fixed/request}}
=
\frac{K\cdot CRF(r,n)+F}
{31{,}536{,}000\;u\theta}
$$

where:

- $$K$$: infrastructure CapEx, USD
- $$CRF(r,n)$$: capital recovery factor
- $$F$$: annual fixed operations, USD/year
- $$u$$: effective utilization, dimensionless
- $$\theta$$: successful requests/second at full utilization under the target SLO

$$
CRF(r,n)=
\frac{r(1+r)^n}{(1+r)^n-1}
$$

This reveals the utilization sensitivity:

$$
C_{\text{fixed/request}}\propto\frac{1}{u}
$$

But without workload-equivalent throughput and defensible CapEx, numerical break-even would be false precision.

## 12. Energy boundary model

A simplified dedicated-device estimate is:

$$
E_{\text{request}}
\approx
P_{\text{IT}}\cdot t\cdot PUE
$$

after converting watt-hours to kWh.

This is only defensible if $$P_{\text{IT}}$$ represents measured system power attributable to the request. GPU TDP is a design limit, not measured inference energy. The public v1 therefore does not publish energy/request.

## Reproducibility

1. Use `04_DATA/ai-inference-price-surface-v0.1.csv`.
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
