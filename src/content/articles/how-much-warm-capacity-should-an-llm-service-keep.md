---
title: "How much warm capacity should an LLM service keep?"
dek: "Warm capacity has at least two different answers: the amount that minimizes expected economic cost, and the amount required by a hard latency or reliability constraint. Under one HOUSE scenario those are 7 replicas and 11 replicas. They are not contradictory — they answer different questions."
slug: "how-much-warm-capacity-should-an-llm-service-keep"
section: "Systems"
format: "PROOF"
author: "Aditya"
publishedAt: "2026-08-11"
status: "published"
firstPass:
  - "There is no defensible universal rule such as 'keep 20% spare GPU' or 'scale at 70% utilization.' Minimum warm capacity is a constraint problem, and economic warm capacity is an optimization problem."
  - "Under one HOUSE scenario (12 req/s baseline, 24 req/s burst, 2 req/s/replica, 20 s scale delay, 3 s queue budget), the fluid burst-survival inequality requires 11 warm replicas if the burst SLO is hard, while the expected-cost model selects 7 because the modeled SLO-loss price is low enough that accepting some violations is cheaper."
  - "Queueing tail latency, not nominal capacity, becomes the binding limit first. In an M/M/10 teaching model with 0.5 s p95 budget, the crossing falls near 79.3% utilization. The number is model-specific, not universal."
  - "Service-time variance breaks any universal utilization rule. At 80% utilization in an M/G/10 simulation, p95 queue wait is 0.283 s at CV=0.3 and 0.723 s at CV=1.5 — the same utilization, a 2.5x tail difference."
  - "GPU quota is not GPU availability. Allocation probability enters the survival model as a separate input, and when it falls far enough the economic optimum jumps from 7 replicas to 12."
featured: false
featuredRank: 0
editorialOrder: 1
demo: false
adPolicy: "none"
sources:
  - label: "Ray Serve — advanced autoscaling"
    url: "https://docs.ray.io/en/latest/serve/advanced-guides/advanced-autoscaling.html"
    type: "primary"
  - label: "Ray Serve — LLM deployment initialization"
    url: "https://docs.ray.io/en/latest/serve/llm/user-guides/deployment-initialization.html"
    type: "primary"
  - label: "vLLM — production metrics"
    url: "https://docs.vllm.ai/en/stable/usage/metrics/"
    type: "primary"
  - label: "NVIDIA Triton Inference Server — metrics"
    url: "https://docs.nvidia.com/deeplearning/triton-inference-server/archives/triton-inference-server-2600/user-guide/docs/user_guide/metrics.html"
    type: "primary"
  - label: "AWS SageMaker AI — invoke a multi-model endpoint"
    url: "https://docs.aws.amazon.com/sagemaker/latest/dg/invoke-multi-model-endpoint.html"
    type: "primary"
  - label: "AWS SageMaker AI — CloudWatch metrics"
    url: "https://docs.aws.amazon.com/sagemaker/latest/dg/monitoring-cloudwatch.html"
    type: "primary"
  - label: "AWS SageMaker AI — inference optimization"
    url: "https://docs.aws.amazon.com/sagemaker/latest/dg/model-optimize.html"
    type: "primary"
  - label: "AWS — EC2 Capacity Blocks for ML pricing"
    url: "https://aws.amazon.com/ec2/capacityblocks/pricing/"
    type: "primary"
  - label: "Google Cloud — allocation quotas"
    url: "https://docs.cloud.google.com/compute/resource-usage"
    type: "primary"
  - label: "Google Cloud — about reservations"
    url: "https://docs.cloud.google.com/compute/docs/instances/reservations-overview"
    type: "primary"
  - label: "AWS EC2 — Capacity Blocks for ML"
    url: "https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/ec2-capacity-blocks.html"
    type: "primary"
  - label: "Google Vertex AI — DedicatedResources"
    url: "https://docs.cloud.google.com/java/docs/reference/google-cloud-vertexai/latest/com.google.cloud.vertexai.api.DedicatedResources"
    type: "primary"
  - label: "Kingman — The single server queue in heavy traffic (1961)"
    url: "https://doi.org/10.1017/S0305004100036094"
    type: "paper"
  - label: "AWS EC2 — InsufficientInstanceCapacity error"
    url: "https://docs.aws.amazon.com/ec2/latest/devguide/errors-overview.html"
    type: "primary"
changeLog:
  - at: "2026-08-11"
    type: "published"
    note: "Initial publication."
seoTitle: "How much warm capacity should an LLM service keep?"
seoDescription: "A constraint-and-optimization model for LLM warm capacity: queueing floor, burst-survival inequality, scale-delay backlog, service-time variance, allocation risk, and the split between economic optimum and hard SLO floor."
---

There is no defensible universal rule for warm capacity. "Keep 20% spare GPU" and "scale at 70% utilization" both fail the moment service-time variance, scale-up delay, or allocation risk enter the picture. The minimum warm capacity is a constraint problem. The economic warm capacity is an optimization problem. Those two problems have different answers, and a defensible warm-pool decision has to solve both.

### / ASSUMPTION — "Primary teaching scenario"

The primary HOUSE scenario used throughout this article:

- baseline arrival <imath>\lambda_0</imath> = 12 req/s
- burst arrival <imath>\lambda_1</imath> = 24 req/s
- effective service rate <imath>\mu</imath> = 2 req/s per replica
- scale-up delay <imath>T_{\text{scale}}</imath> = 20 s
- allowable queue wait <imath>D_q</imath> = 3 s
- modeled allocation probability <imath>P_{\text{alloc}}</imath> = 0.85
- modeled burst probability = 0.30 / hour
- modeled SLO-loss value = $0.05 per violating request
- H100 reference price = $4.720 / hour (AWS EC2 Capacity Block effective pricing, p5.4xlarge, Asia Pacific Mumbai, verified 2026-08-11)

Every number in this scenario is a HOUSE ASSUMPTION. The service rate is workload-specific, not a hardware constant. The allocation probability is a buyer input derived from operational history, not a provider statistic. The H100 price is an EC2 Capacity Block effective rate, not an on-demand list price and not a hosted-endpoint quote. The scenario exists to make the accounting visible, not to represent a particular production deployment.

Under these assumptions, two results fall out. The expected-cost model selects **7 replicas** at $49.73/hour. The hard burst-survival inequality requires **11 replicas**. The article explains why those are not contradictory.

## States, and why the words matter

Five states describe capacity at different points in its lifecycle.

- **HOT** — already carrying production inference traffic.
- **WARM** — provisioned and sufficiently initialized to accept production traffic inside the chosen readiness window.
- **COLD** — requires provisioning, download, load, initialization or registration before serving.
- **RESERVED** — capacity entitlement is held, but the runtime or model may still be cold.
- **AVAILABLE** — the provider may currently be able to allocate the hardware.

The distinctions are economic. A reservation can reduce allocation risk without eliminating model-load time. A warm replica eliminates more of the startup path but costs active capacity continuously. Two confusions recur in capacity planning, and both produce undersized pools.

**Quota is not allocation.** Google's documentation states that quotas are a maximum "if those resources are available" and that "quotas don't guarantee that resources are always available." Holding quota is permission to request, not a promise to receive. AWS documents `InsufficientInstanceCapacity` as a live failure class with explicit mitigations — smaller requests, different instance types, waiting.

**Reservation is not warm runtime.** Google reservations hold zonal capacity even when VMs are not running, and AWS Capacity Blocks provide capacity assurance for selected accelerator products during reserved windows. Both can assure hardware without readying a model runtime. A reserved GPU still needs image pull, weight load, initialization, compile and health check before it serves a request.

## Cold start is a chain, not one delay

Before cold capacity can serve, a chain of work has to finish:

$$
T_{\text{scale}} = T_{\text{detect}} + T_{\text{schedule}} + T_{\text{allocate}} + T_{\text{image}} + T_{\text{weights}} + T_{\text{runtime}} + T_{\text{compile}} + T_{\text{health}} + T_{\text{route}}
$$

with overlap removed when stages run concurrently. Detection is the autoscaler observing the signal. Scheduling is the placement decision. Allocation is the provider assigning hardware, which can fail. Image is the container or runtime download. Weights is the model weight transfer or load. Runtime is process initialization. Compile covers torch compile and memory profiling. Health check and route registration complete the path.

Ray's deployment initialization documents these stages for LLM serving. AWS SageMaker documents that a first request to a multi-model endpoint can cold-start because the model is downloaded and loaded; `InvokeEndpoint` may return `ModelNotReadyException` after 60 seconds while loading continues up to 360 seconds in that path. vLLM exposes queue time, time-to-first-token and end-to-end latency metrics; Triton separates queue time from compute time. The stages are observable. They are not collapsible into one number.

This article does not publish a universal cold-start duration. To make the accounting visible, the figure below uses a 90-second HOUSE decomposition. None of its stage durations is presented as a provider measurement.

![Horizontal stacked-bar timeline of seven cold-start stages totalling 90 seconds: detection 5s, provisioning 20s, image pull 10s, weights 25s, runtime init 10s, compile 10s, health and routing 10s.](/research/warm-capacity/charts/chart-01-cold-start-timeline.svg "Cold start is a chain of stages, not one delay. HOUSE DECOMPOSITION — 90 seconds is a teaching total, not a provider measurement or a universal cold-start duration.")

## Service capacity is workload-specific

Effective replica service rate is not a GPU hardware constant. For a fixed workload class <imath>W</imath>:

$$
\mu(W) = \text{SLO-compatible completed requests per second per replica}
$$

<imath>\mu</imath> changes with prompt length, output length, batch and concurrency policy, model, quantization, KV-cache pressure, and TTFT/TPOT constraints. vLLM exposes `num_requests_waiting`, `num_requests_running`, `request_queue_time_seconds`, `time_to_first_token_seconds` and `e2e_request_latency_seconds` precisely because utilization alone cannot tell you whether the SLO is about to break. Triton separates queue time from compute time for the same reason. Ray Serve scales on `target_ongoing_requests` — a request-pressure signal — and recommends tuning that target against end-to-end latency, not against GPU utilization.

Warm capacity is then:

$$
C_{\text{warm}} = k \, \mu(W)
$$

This article uses <imath>\mu = 2</imath> req/s/replica as a HOUSE ASSUMPTION. It is not a universal LLM serving rate. The queueing and burst results below scale with <imath>\mu</imath>; changing the workload changes the number, not the method. This is the same workload-specific capacity discipline that the [tokens-per-second benchmark](/articles/tokens-per-second-is-not-an-inference-benchmark) piece applies to throughput definitions, and the same concurrency discipline that the [KV-cache budget](/articles/kv-cache-is-your-real-concurrency-budget) result applies to active sequences.

## The queueing floor

Under Poisson arrivals and exponential service, the M/M/k model gives an Erlang-C waiting probability:

$$
P_{\text{wait}} = \frac{\frac{a^k}{k!} \frac{1}{1-\rho}}{\sum_{n=0}^{k-1} \frac{a^n}{n!} + \frac{a^k}{k!} \frac{1}{1-\rho}}, \quad a = \frac{\lambda}{\mu}, \quad \rho = \frac{\lambda}{k \mu}
$$

and the queue-tail:

$$
P(W_q > t) = P_{\text{wait}} \, e^{-(k \mu - \lambda) t}
$$

For <imath>k = 10</imath>, <imath>\mu = 2</imath>, and a 0.5 s p95 queue budget, the crossing falls near <imath>\rho \approx 0.7934</imath>. At <imath>\rho = 0.79</imath>, p95 is 0.487 s; at <imath>\rho = 0.80</imath>, p95 is 0.526 s.

![Line chart of p95 queue wait against utilization for an M/M/10 teaching model, with a dashed 0.5-second SLO budget line and a dotted vertical reference at about 79.3% utilization where the curve crosses the budget.](/research/warm-capacity/charts/chart-02-utilization-vs-queue.svg "The p95 queue budget disappears before nominal capacity reaches 100%. M/M/10 TEACHING MODEL — the 79.3% crossing is model-specific, not a universal threshold.")

This is a TEACHING MODEL / DERIVED RESULT, not a universal 79% rule. The crossing moves with service-time variance, arrival process, workload shape, number of servers, and SLO budget. The mechanism is what matters: as <imath>\rho \to 1</imath>, the Erlang-C denominator collapses, and the queue-tail bends toward vertical. The latency budget disappears before nominal capacity reaches 100%. That is why running near nominal capacity is incompatible with a tight latency tail, and why utilization alone is not a safe scaling signal.

## Service-time variance breaks the universal rule

Real LLM service times are not exponential. Prompt and output lengths vary; workload composition shifts. The M/G/1 Pollaczek–Khinchine result shows what that does to the mean queue wait:

$$
E[W_q] = \frac{\lambda \, E[S^2]}{2(1 - \rho)}, \quad E[S^2] = (1 + c_s^2) \, E[S]^2
$$

At <imath>\rho = 0.70</imath> and <imath>E[S] = 0.5</imath> s, the mean queue wait rises from **0.636 s** at <imath>c_s = 0.3</imath> to **2.917 s** at <imath>c_s = 2.0</imath>. Identical utilization, materially different tail.

A simulation of M/G/10 with Poisson arrivals and lognormal service confirms the same effect in the multi-server case. At <imath>\rho = 0.80</imath>, <imath>k = 10</imath>, <imath>E[S] = 0.5</imath> s:

| service CV | p95 queue | p99 queue |
|---:|---:|---:|
| 0.3 | 0.283 s | 0.486 s |
| 1.0 | 0.477 s | 0.878 s |
| 1.5 | 0.723 s | 1.330 s |

![Three-series scatter chart of simulated p95 queue wait against utilization for service-time CV of 0.3, 1.0 and 1.5 in an M/G/10 model. At 80% utilization the high-variance curve is about 2.5x the low-variance curve.](/research/warm-capacity/charts/chart-03-service-variance-headroom.svg "Identical mean utilization need not imply identical tail behavior. M/G/10 SIMULATION — Poisson arrivals, lognormal service, seed 20260811.")

This is why GPU utilization cannot decide when to scale. Two services at 80% utilization can have 2.5x different p95 queue waits. The correct scaling signal combines utilization with queue depth, queue-time histogram, TTFT and end-to-end latency — the signals vLLM and Triton expose and that Ray Serve scales on.

## Scale-up backlog

Autoscaling cannot retroactively erase a queue. During the scale-up delay, demand above warm capacity accumulates:

$$
Q_{\text{scale}} = (\lambda - C_{\text{warm}})^+ \times T_{\text{scale}}
$$

Units check: (requests/s) × s = requests. For the primary HOUSE scenario at the economic optimum <imath>k = 7</imath> (<imath>C_{\text{warm}} = 14</imath> req/s), burst <imath>\lambda_1 = 24</imath> req/s, scale delay <imath>T_{\text{scale}} = 20</imath> s:

$$
Q_{\text{scale}} = (24 - 14) \times 20 = 200 \text{ queued requests}
$$

The allowable backlog before the queue wait exceeds the 3 s SLO budget at <imath>C_{\text{warm}} = 14</imath> req/s is:

$$
Q_{\text{allow}} = C_{\text{warm}} \times D_q = 14 \times 3 = 42 \text{ requests}
$$

Two hundred requests arrive in the queue before new capacity is usable. Forty-two requests is what the SLO tolerates. The 7-replica economic optimum cannot survive this burst deterministically — it is more than four times over budget. That is the crux of the 7-versus-11 split.

![Two-line time series showing demand at 24 req/s for 120 seconds while serving capacity stays at 14 req/s for the first 20 seconds then jumps to 30 req/s once scale-out arrives. The gap between demand and capacity from 0 to 20 seconds is the 200-request backlog.](/research/warm-capacity/charts/chart-04-burst-vs-delayed-scale.svg "The queue accumulates 200 requests during the 20 s scale delay while the warm pool of 7 replicas serves 14 req/s. HOUSE SCENARIO / DERIVED RESULT — fluid approximation.")

## The burst-survival inequality

To survive a constant burst <imath>\lambda_1</imath> until scale-out at <imath>T_{\text{scale}}</imath>, the backlog accumulated during the scale delay must not exceed the backlog the SLO tolerates:

$$
(\lambda_1 - k \mu)^+ \times T_{\text{scale}} \;\leq\; k \mu \times D_q
$$

The left side is the work that arrives faster than the warm pool can serve it during the scale-up window — a backlog in requests. The right side is the maximum backlog the warm pool can absorb before its queue wait exceeds the SLO budget — also in requests, since <imath>C_{\text{warm}} \times D_q</imath> has units (requests/s) × s = requests. For <imath>\lambda_1 > k \mu</imath>, solving for <imath>k</imath>:

$$
k \;\geq\; \frac{\lambda_1 \, T_{\text{scale}}}{\mu \, (T_{\text{scale}} + D_q)}
$$

Substituting the HOUSE values <imath>\lambda_1 = 24</imath>, <imath>\mu = 2</imath>, <imath>T_{\text{scale}} = 20</imath>, <imath>D_q = 3</imath>:

$$
k \geq \frac{24 \times 20}{2 \times (20 + 3)} = \frac{480}{46} = 10.43 \;\Rightarrow\; 11 \text{ replicas}
$$

Eleven warm replicas is the strict burst-survival lower bound. It is not an average-capacity formula. It assumes a step burst, fluid work, constant <imath>\mu</imath>, an initially empty queue, and usable added capacity after <imath>T_{\text{scale}}</imath>. The inverse gives the longest scale delay a given <imath>k</imath> can survive:

$$
T_{\text{max}}(k) = \frac{k \mu \, D_q}{\lambda_1 - k \mu}, \quad k \mu < \lambda_1
$$

For <imath>k = 7</imath>: <imath>T_{\text{max}} = (14 \times 3) / (24 - 14) = 4.2</imath> s. The 7-replica economic optimum survives a burst only if new capacity arrives within 4.2 seconds — not the modeled 20.

## The economic model

Warm holding cost per hour is linear in <imath>k</imath>:

$$
C_{\text{hold}}(k) = k \, C_r
$$

with <imath>C_r = \$4.72</imath>/hour (EC2 Capacity Block effective pricing, verified 2026-08-11). Expected undercapacity loss per hour:

$$
\mathbb{E}[L_{\text{under}}(k)] = \sum_e P(e) \left[ N_{\text{viol},e}(k) \, V_{\text{viol}} + N_{\text{drop},e}(k) \, V_{\text{drop}} + C_{\text{incident},e} \right]
$$

Total hourly cost:

$$
J(k) = C_{\text{hold}}(k) + \mathbb{E}[L_{\text{under}}(k)]
$$

| <imath>k</imath> | warm cost $/h | expected loss $/h | total $/h |
|---:|---:|---:|---:|
| 7 | 33.04 | 16.69 | **49.73** |
| 8 | 37.76 | 14.00 | 51.76 |
| 9 | 42.48 | 10.87 | 53.35 |
| 10 | 47.20 | 7.20 | 54.40 |
| 11 | 51.92 | 4.70 | 56.62 |
| 12 | 56.64 | 0.00 | 56.64 |
| 13 | 61.36 | 0.00 | 61.36 |

The minimum is at <imath>k = 7</imath>. Going from 7 to 8 buys fewer modeled violations but costs $4.72/hour extra in warm holding; the avoided loss ($2.69/hour) is less than the marginal holding cost, so the marginal replica is not economically justified. The same holds through <imath>k = 11</imath>. At <imath>k = 12</imath>, modeled violations drop to zero — the 12th replica buys nothing the 11th did not already buy in the modeled loss function — and total cost ticks up.

![Three-line chart of warm holding cost, expected undercapacity loss and expected total cost against warm replica count from 7 to 17. Holding cost rises linearly, undercapacity loss falls steeply to zero at k=12, and total cost is U-shaped with its minimum at k=7.](/research/warm-capacity/charts/chart-05-economic-optimum-vs-hard-slo.svg "Seven replicas minimize expected hourly cost; eleven replicas are required by the hard burst-survival inequality. HOUSE SCENARIO / DERIVED RESULT — the two boundaries answer different questions.")

Under these HOUSE assumptions, 7 minimizes modeled expected hourly cost while 11 is required by the modeled hard burst constraint. The economic model lets some requests violate the queue SLO when preventing those violations costs more than accepting them. At 0.30 bursts/hour and $0.05/violating request, the modeled price of accepting roughly 1,112 violations per event is $16.69/hour — cheaper than the $18.88/hour cost of going from 7 to 11 warm replicas. The strict burst-survival inequality ignores price entirely and asks only whether the warm pool can absorb the burst deterministically. If the SLO is contractual, the inequality wins. If the SLO is soft, the cost minimum wins.

## / CLAIM CHECK — "Autoscaling eliminates the need for warm capacity"

**CLAIM**

Autoscaling removes the need for a warm pool.

**WHAT IS TRUE**

Autoscaling can add and remove replicas in response to demand. Ray supports scale-to-zero and positive `min_replicas`. Google Vertex AI's `DedicatedResources` always deploys `minReplicaCount` and scales up to `maxReplicaCount`.

**WHAT IS MISSING**

Scale-out is not instantaneous and new GPU capacity is not always obtainable. Ray documents multiple initialization stages — provisioning, image download, initialization, model loading, compile, profiling. Google states that quota does not guarantee availability. AWS documents `InsufficientInstanceCapacity` as a live failure class.

**WHAT THAT MEASURES**

The scale-up delay <imath>T_{\text{scale}}</imath> during which the warm pool must carry the burst alone. In the HOUSE scenario that is 20 seconds, producing 200 queued requests against a 42-request SLO budget at <imath>k = 7</imath>.

**WHAT IT DOES NOT MEASURE**

It does not say autoscaling is useless. It says warm capacity should cover the work the service cannot safely queue during the scale lead time, plus required failure and availability reserve.

**SECOND / PASS**

Model the scale delay explicitly. Autoscaling changes the steady-state replica count; it does not eliminate the transient the warm pool has to absorb.

## Sensitivity: scale delay moves the floor

The hard SLO floor rises with scale delay. At <imath>T_{\text{scale}} = 0</imath>, the burst-survival inequality requires only 1 replica (the queue absorbs everything). At 5 s, it requires 8. At 20 s, 11. At 60 s, 12. The economic optimum is more robust: it stays at 7 replicas from 0 to 24 seconds of scale delay, then jumps to 11 at 30 s and to 12 at 45 s and beyond.

![Two-line step chart of economic optimum and hard SLO floor against scale-up delay from 0 to 120 seconds. The economic optimum stays at 7 replicas through 24 s then rises; the hard SLO floor rises stepwise from 1 to 12.](/research/warm-capacity/charts/chart-06-warm-floor-vs-scale-delay.svg "Longer cold starts push the warm floor upward. The economic optimum is more robust to scale delay than the hard SLO floor — until the delay gets long enough that violations become unavoidable.")

The practical reading: if cold-start reduction work (AOT compile, fast weight loading, pre-sharded weights, image caching) can bring <imath>T_{\text{scale}}</imath> down from 30 s to under 10 s, the hard SLO floor falls from 11 to 8 replicas. Cold-start engineering is capacity engineering.

## Allocation risk enters as a separate input

Quota is not availability, and a modeled allocation probability enters the survival model directly. With probability <imath>P_{\text{alloc}}</imath> the scale-out is allocated in the required window and the burst-survival inequality governs; with probability <imath>1 - P_{\text{alloc}}</imath> the scale-out does not arrive, and the warm pool must cover the burst alone — which requires <imath>k \mu \geq \lambda_1</imath>, i.e. <imath>k \geq 12</imath> in the HOUSE scenario.

The economic optimum tracks this step. At <imath>P_{\text{alloc}} \geq 0.70</imath>, the economic choice is 7 replicas. At <imath>P_{\text{alloc}} \leq 0.60</imath>, the economic choice jumps to 12 — the cost of accepting that scale-out may not arrive exceeds the cost of holding the extra warm capacity. The 0.85 used in the primary HOUSE scenario is a modeled input, not a provider-published number. It must be estimated from attempted scale-outs for the exact accelerator, region, shape and time window.

This is the second reason no universal percentage works. Two services with identical workloads, identical SLOs and identical scale delays can have different optimal warm pools because they run in regions with different allocation risk.

## / CLAIM CHECK — "Keeping an extra warm replica is wasted capacity"

**CLAIM**

An idle warm replica is wasted spend.

**WHAT IS TRUE**

An idle replica has a real hourly holding cost — $4.72/hour at the HOUSE Capacity Block rate.

**WHAT IS MISSING**

Holding cost is only one side of the ledger. The other side is the expected undercapacity loss the replica avoids. Capacity reservations are sold precisely because capacity assurance has economic value. AWS Capacity Blocks and Google reservations exist as products because the market prices that assurance above the holding cost.

**WHAT THAT MEASURES**

The marginal replica. Add it when the avoided expected loss exceeds the holding cost. At <imath>k = 7</imath> versus 8 in the HOUSE scenario, the marginal replica costs $4.72/hour and avoids $2.69/hour — not economically justified. At <imath>k = 11</imath> versus 12, it costs $4.72/hour and avoids $0 — also not economically justified. But <imath>k = 11</imath> is required by the hard burst-survival inequality regardless of the economic calculation.

**WHAT IT DOES NOT MEASURE**

It does not say more warm is always better. It says the marginal-replica question is unanswerable without knowing whether the SLO is contractual.

**SECOND / PASS**

Evaluate the marginal replica using avoided expected loss and hard availability constraints. Holding cost alone is half the model.

## Failure reserve, briefly

Burst reserve and failure reserve are not automatically the same. If 12 replicas at 2 req/s are required to serve a 24 req/s peak with zero headroom, losing one replica leaves 22 req/s. Surviving one replica loss at that same peak requires <imath>N + 1 = 13</imath> warm replicas. A common spare replica can cover either a burst or a failure only if those events are not required to be survived simultaneously. If the availability objective assumes concurrent failure plus peak traffic, reserves must be sized jointly.

This is not a disaster-recovery article. The point is that the warm-pool decision has three layers — baseline queue/SLO floor, burst and lead-time floor, availability and failure floor — and the operative <imath>k</imath> is the maximum of the three, then optimized economically above that.

## Falsification: when minimal or large reserve is rational

The method produces different answers for different services. Minimal warm reserve is rational when traffic is batch-like or interruptible, SLOs are loose, scale-out is fast and reliable, bursts are rare or predictable, and missed requests have low economic impact. Large warm reserve is rational when response latency is interactive, model initialization is long, burst factor is large, traffic has correlated or failover spikes, scale-out GPUs are scarce, or each SLO miss is expensive.

Four canonical scenarios in the research package make this concrete. A stable SaaS traffic profile produces an economic optimum of 8 replicas. A bursty interactive profile with a strict queue budget and long scale delay produces 12. An expensive-GPU relaxed-SLO profile accepts violations and produces 5. A capacity-constrained region with low allocation probability produces 10. Same method, four different answers, because the inputs differ.

This is why the article does not end with a number. It ends with a method. The defensible warm pool for a specific service requires that service's traffic distribution, service rate, queue distribution, cold-start distribution, scale delay, GPU price, allocation probability and SLO.

## / INTELLIGENCE

Sizing warm capacity for an LLM service under burst, cold-start and allocation risk?

SECOND / PASS can apply this constraint-and-optimization model to your traffic distribution, service rate, queue distribution, cold-start distribution, scale delay, GPU price, allocation probability and SLO — and tell you where the economic optimum and the hard SLO floor diverge.

[START A RESEARCH BRIEF →](/intelligence)
