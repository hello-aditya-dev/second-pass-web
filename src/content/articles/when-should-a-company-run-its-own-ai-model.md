---
title: "When should a company run its own AI model?"
dek: "Open weights can replace an API bill with GPU capacity, utilization risk and operations. A same-model control shows where the price break-even sits—and why volume alone cannot decide the deployment."
slug: "when-should-a-company-run-its-own-ai-model"
section: "AI"
format: "SECOND PASS"
author: "Aditya"
publishedAt: "2026-08-10"
status: "published"
firstPass:
  - "Open-weight and open-source AI are not the same thing. Weight access is one part of the deployment decision."
  - "The enterprise choice has four useful policies: closed managed API, managed open weight, self-hosted open weight, and a hybrid/router."
  - "For an illustrative 10k-input/1k-output Mistral Small 4 task, the managed API costs $0.0021. One AWS Mumbai 8×H100 Capacity Block costs $27,564.80 for a 730-hour month, creating a price-only break-even near 13.13 million tasks."
  - "That break-even is conditional: at 80% effective utilization it would require about 22,476 useful tasks/hour. We found no compatible primary benchmark that proves the chosen serving setup can deliver that workload under a target SLO."
  - "Quality, utilization, engineering cost and hard constraints can move or remove the self-host break-even. Filter infeasible policies first, then compare cost per accepted outcome."
featured: true
demo: false
tags:
  - "AI deployment"
  - "open-weight AI"
  - "self-host LLM"
  - "AI API vs self hosting"
  - "inference economics"
hero: ""
heroAlt: ""
adPolicy: "none"
sources:
  - label: "Open Source AI Definition 1.0"
    url: "https://opensource.org/ai/open-source-ai-definition"
    type: "primary"
    note: "Terminology and requirements for Open Source AI."
  - label: "Mistral Small 4"
    url: "https://docs.mistral.ai/models/model-cards/mistral-small-4-0-26-03"
    type: "primary"
    note: "Same-model control: parameters, context, weights and managed API pricing."
  - label: "Mistral Small 4 NVFP4"
    url: "https://huggingface.co/mistralai/Mistral-Small-4-119B-2603-NVFP4"
    type: "primary"
    note: "Open-weight deployment checkpoint and vLLM serving recipe."
  - label: "AWS EC2 Capacity Blocks for ML pricing"
    url: "https://aws.amazon.com/ec2/capacityblocks/pricing/"
    type: "primary"
    note: "Observable H100 capacity price used in the self-host scenario."
  - label: "gpt-oss model card"
    url: "https://deploymentsafety.openai.com/gpt-oss/paperbench"
    type: "primary"
    note: "MoE parameter counts, checkpoint size and MXFP4 memory case."
  - label: "NVIDIA H100"
    url: "https://www.nvidia.com/en-us/data-center/h100/"
    type: "primary"
    note: "H100 headline memory specification."
  - label: "OpenAI GPT-5.6 Luna"
    url: "https://developers.openai.com/api/docs/models/gpt-5.6-luna"
    type: "primary"
    note: "Closed-managed reference pricing; not used as a quality comparison."
  - label: "Claude Sonnet 5"
    url: "https://platform.claude.com/docs/en/about-claude/models/whats-new-sonnet-5"
    type: "primary"
    note: "Closed-managed reference pricing with dated introductory rate."
  - label: "Gemini API pricing"
    url: "https://ai.google.dev/gemini-api/docs/pricing"
    type: "primary"
    note: "Closed-managed reference pricing; output accounting differs by model."
changeLog:
  - at: "2026-08-10"
    type: "published"
    note: "Initial publication."
seoTitle: "When should a company run its own AI model?"
seoDescription: "A quantitative framework for choosing closed APIs, managed open-weight inference, self-hosted models or hybrid routing using cost, quality, utilization and hard constraints."
---

A company can pay an API provider each time a model runs.

Or it can download model weights, rent GPUs, and run the serving stack itself.

The second choice removes one bill. It does not remove the bill. It changes what the company pays for.

There is also a middle choice: use an open-weight model while someone else operates the inference infrastructure. And there is a mixed choice: keep some work local while sending other tasks to a managed API.

So the useful question is not **open or closed?**

## / QUESTION

**When should a company own or control the weights—and when should it pay someone else to run the model?**

The answer depends on more than task volume. It depends on which deployments are allowed, how much useful capacity the company can keep busy, whether model quality changes, what engineers must operate, and whether the hardware can meet the required latency and concurrency.

The economics only start after those facts are separated.

![Four deployment policies](/research/open-weight-vs-closed/charts/chart-01-deployment-policies.svg "Weight access and infrastructure ownership are separate decisions. Four policies: closed managed API, managed open weight, self-hosted open weight, hybrid/router.")

## Open weight is not the same as open source

The terms are often used as if they mean the same thing. They do not have to.

An **open-weight model**, as SECOND / PASS uses the term here, makes trained weights available under a stated license so a customer can run or adapt them. That says something important about deployment control. It does not tell us that the full model-development system is open.

The [Open Source Initiative's Open Source AI Definition 1.0](https://opensource.org/ai/open-source-ai-definition) goes further. It requires freedoms to use, study, modify and share the AI system and access to the preferred form for making modifications. For machine-learning systems, the definition addresses data information, code and parameters.

That distinction matters because a company may be able to download weights without receiving every ingredient that produced them.

This article therefore uses **open weight** unless the narrower claim is genuinely supported. License compatibility still has to be reviewed against the company's actual use case. This is not legal advice.

## Four policies, not two

The enterprise decision becomes clearer when weight access and infrastructure ownership are split.

**Closed managed API.** The customer does not receive the weights. The provider operates the infrastructure. Cost is mostly tied to usage, although tiers, commitments and tool charges can change the price function.

**Managed open weight.** The weights are available under a license, but the model vendor or another provider runs inference. The customer gets some portability or customization options without owning GPU orchestration.

**Self-hosted open weight.** The company operates the serving stack on rented or owned compute. The bill now contains capacity, operations, observability, redundancy and other infrastructure costs.

**Hybrid / router.** Different work goes to different policies. Sensitive tasks might run on controlled infrastructure; bursts or hard tasks can move to managed capacity.

No policy is automatically cheaper. A policy can also be disqualified before price is considered.

If a deployment cannot meet a residency rule, license condition, context requirement, latency SLO or security architecture, its low price does not make it usable.

Call the feasible set:

$$
\mathcal{J}_{\text{feasible}}=\{j:F_j(x)=1\}
$$

The company should compare economics **inside that set**.

## Managed APIs are variable-cost references, not one comparable product

Closed managed APIs make the variable-cost side easy to observe. They do not make different models economically interchangeable.

As of August 10, OpenAI lists [GPT-5.6 Luna](https://developers.openai.com/api/docs/models/gpt-5.6-luna) at $1 per million input tokens and $6 per million output tokens under its standard short-context pricing. Anthropic lists [Claude Sonnet 5](https://platform.claude.com/docs/en/about-claude/models/whats-new-sonnet-5) at introductory pricing of $2/$10 per million input/output tokens through August 31, 2026, with $3/$15 scheduled from September 1. Google lists [Gemini 3.5 Flash-Lite](https://ai.google.dev/gemini-api/docs/pricing) at $0.30 per million input tokens and $2.50 per million output tokens, with output pricing including thinking tokens.

Those numbers establish a basic economic shape: the provider can charge for actual usage without the customer reserving its own GPU fleet.

They are **not** a cheapest-model table. The models differ in capability, tokenizer, output behavior, context rules and tool accounting. A lower public token rate does not establish a lower cost per accepted task.

That is why the worked break-even below uses Mistral Small 4 on both sides instead of comparing unrelated models.


## Same model, different deployment

Comparing a frontier closed model with a smaller open-weight model mixes two questions:

1. Which model performs better?
2. Which deployment is cheaper?

A cleaner first experiment holds the named model as constant as practical.

Mistral Small 4 currently gives us that control. Mistral documents a managed API model, `mistral-small-2603`, at **$0.15 per million input tokens and $0.60 per million output tokens**. It also publishes downloadable weights under Apache 2.0. The model has 119B total parameters, 6.5B active parameters per token and a 256k context window. [Mistral's model page](https://docs.mistral.ai/models/model-cards/mistral-small-4-0-26-03) and [weight repository](https://huggingface.co/mistralai/Mistral-Small-4-119B-2603) document both sides.

For self-deployment, Mistral also publishes an NVFP4 checkpoint and recommends vLLM. Its reference serve command for that checkpoint uses tensor parallelism across two GPUs at the full configured context. We use that as evidence that self-deployment is supported—not as a throughput benchmark.

The two deployments are still not perfectly identical. Precision, serving engine, sampling defaults, system prompts and provider optimizations can affect behavior.

This is a **same-model deployment control**, not identical inference.

## / CALCULATION — A price-only break-even

Use one transparent workload.

### / ASSUMPTION

**ILLUSTRATIVE ENTERPRISE WORKLOAD**

- 10,000 input tokens per task
- 1,000 output tokens
- context comfortably below the model maximum
- no tools
- no retries
- equal acceptance quality for the first control
- one rented AWS `p5.48xlarge` Capacity Block in Mumbai
- 8× NVIDIA H100
- 730-hour accounting month
- no engineering, storage or network cost in the first deployment-only calculation

The managed Mistral API costs:

$$
C_m=
10{,}000\frac{0.15}{10^6}
+
1{,}000\frac{0.60}{10^6}
=
0.0021
$$

So managed inference is **$0.0021 per task** under this workload shape.

AWS currently lists the Mumbai `p5.48xlarge` Capacity Block at **$37.76/hour for an 8×H100 instance**. [AWS's Capacity Blocks pricing](https://aws.amazon.com/ec2/capacityblocks/pricing/) is a capacity reservation reference, not a hardware purchase price and not a full self-host TCO.

For 730 hours:

$$
F=37.76\times730=\$27{,}564.80
$$

If the first control sets remaining self-host variable cost to zero, break-even is:

$$
N^*=\frac{27{,}564.80}{0.0021}
\approx13.13\text{ million tasks/month}
$$

That is the **price-only deployment break-even**.

It is not yet an operational break-even.

![Same-model deployment break-even](/research/open-weight-vs-closed/charts/chart-02-same-model-break-even.svg "Managed Mistral cost rises with volume and crosses a horizontal $27,564.80 monthly self-host capacity line at about 13.13 million tasks. Price boundary, not proof the 8×H100 node can serve that load under the target SLO.")

At one million tasks, managed Mistral costs about **$2,100/month** for the stated tokens. The capacity block remains $27,564.80 before engineering and other operations.

At 10 million tasks, managed cost is **$21,000/month**. The capacity block is still $27,564.80.

At 20 million tasks, managed cost reaches **$42,000/month**. Capacity-only self-hosting is lower at $27,564.80—but only if the hardware can actually serve 20 million such tasks with the required latency, concurrency and reliability.

That last condition decides whether the cheaper point exists in practice.

## A price crossing the hardware cannot serve is not a deployment break-even

Price equations can produce a volume even when capacity cannot.

At the 13.13-million-task price boundary, assume 80% **effective capacity utilization**. This is not an 80% GPU-utilization dashboard reading. It means useful workload processed divided by economically available serving capacity under the selected configuration.

The required rate is:

$$
\frac{13.13\text{M}}{730\times0.8}
\approx22{,}476\text{ useful tasks/hour}
$$

about 6.24 tasks per second.

That is a **required rate**, not a measured Mistral Small 4 throughput result.

We did not find a current primary benchmark with the hardware, checkpoint, prompt/output shape, concurrency and latency target needed to claim that the chosen 8×H100 configuration can deliver it. Mistral publishes serving recipes and relative performance claims; those are not enough to turn this requirement into a capacity fact.

So the result is conditional:

> Self-host capacity becomes cheaper on the simple price equation near 13.13 million tasks/month **if** the serving system can process that workload under the required SLO.

A spreadsheet that omits this capacity gate can recommend an impossible deployment.

## / CLAIM CHECK

### "Open models are cheaper at scale."

**WHAT IS TRUE**

Fixed or fixed-like self-host costs can be spread across more useful work. If the self-host variable cost is lower, enough volume can make that deployment cheaper.

**WHAT IS MISSING**

Quality, useful utilization, capacity, engineering, redundancy and workload shape.

**SECOND / PASS**

Scale can amortize fixed cost. It cannot guarantee a self-host advantage.

If self-hosting has no quality-adjusted variable advantage, no amount of volume repairs the equation.

## Quality can move the break-even

The equal-quality assumption is useful only because it isolates deployment economics.

Real deployments can differ.

Define acceptance as a result that is correct, policy-compliant and accepted for the task. Then:

$$
CAO_j=\frac{E[C_{\text{system},j}]}{P(A_j)}
$$

For a managed policy with variable cost per task <imath>v_c</imath>:

$$
CAO_c=\frac{v_c}{a_c}
$$

For self-hosting:

$$
CAO_o=\frac{F/N+v_o}{a_o}
$$

where <imath>F</imath> is fixed or fixed-like monthly cost and <imath>v_o</imath> is remaining variable system cost.

Set them equal and let:

$$
r_q=\frac{a_o}{a_c}
$$

Then:

$$
\boxed{N^*=\frac{F}{r_qv_c-v_o}}
$$

provided:

$$
r_qv_c-v_o>0
$$

If that denominator is zero or negative, **no finite task volume makes self-hosting cheaper per accepted outcome under those assumptions**.

This condition matters more than the exact 13.13-million figure. It tells the company what can remove a break-even entirely.

![Quality-adjusted frontier](/research/open-weight-vs-closed/charts/chart-03-quality-adjusted-frontier.svg "Boundary curve rises sharply as self-host acceptance falls, with a shaded no-finite-break-even region at low quality ratios. Acceptance ratios and variable cost are sensitivity inputs, not measurements.")

Figure 3 is a sensitivity example, not a measured quality comparison. It keeps the same $27,564.80 fixed capacity and $0.0021 managed variable cost, then sets an illustrative $0.0010 self-host variable cost. Under that scenario, a finite break-even requires <imath>r_q</imath> above about **0.476**.

The public workbook lets the reader replace those inputs.

Do not substitute MMLU, SWE-bench, Arena or another public score directly for <imath>P(A)</imath>. A company's acceptance probability should come from its own evaluation set, review outcomes or production task success.

## The utilization trap

A reserved GPU that is idle still exists on the bill.

For fixed capacity cost <imath>F</imath>, full-use useful capacity <imath>Q</imath>, and effective utilization <imath>u</imath>:

$$
C_{\text{fixed/task}}=\frac{F}{uQ}
$$

So:

$$
C_{\text{fixed/task}}\propto\frac{1}{u}
$$

All else equal, moving from 80% to 40% effective utilization doubles fixed cost per useful capacity unit. At 20%, it is four times the 80% reference.

![Utilization trap](/research/open-weight-vs-closed/charts/chart-04-utilization-trap.svg "Relative to 80%, 40% utilization doubles and 20% quadruples fixed cost per useful capacity unit, all else equal. Simplified fixed-capacity relationship.")

This does not mean real inference economics are perfectly linear. Batch size, queueing, headroom, latency targets and hardware behavior can change the shape.

The point is simpler: **high nominal volume is not enough. The workload must keep paid capacity usefully occupied.**

Bursty traffic can make a large annual task count look attractive while leaving expensive GPUs idle much of the day. Redundancy can do the same. A spare GPU may be essential for availability and economically unproductive until something fails.

Engineering cost moves the boundary too.

In the same deployment-only scenario:

- $0 monthly engineering/ops → break-even ≈ **13.13M tasks/month**
- $5,000/month → ≈ **15.51M**
- $20,000/month → ≈ **22.65M**

Those engineering numbers are scenarios, not salary estimates.

## The weights fit. The serving system may not.

Memory creates a separate feasibility gate.

A common first check is:

$$
M_{\text{weights}}\approx\frac{Pb}{8}
$$

where <imath>P</imath> is parameter count and <imath>b</imath> is bits per parameter.

That is useful intuition. It is not a production memory model.

OpenAI's gpt-oss-120b makes the distinction easy to see. OpenAI documents **116.83B total parameters**, **5.13B active parameters per token**, a **60.8 GiB checkpoint**, and MXFP4 quantization for most MoE weights. Its optimized reference path can fit on a single 80GB GPU. [OpenAI's model card](https://deploymentsafety.openai.com/gpt-oss/paperbench) and [repository](https://github.com/openai/gpt-oss/blob/main/README.md) support those facts. NVIDIA lists H100 variants with 80GB of GPU memory.

The phrase "5.13B active" describes the per-token compute path. It does **not** mean the model needs memory for only 5.13B parameters.

And a weight checkpoint fitting in HBM does not tell us how much concurrency the server can support.

A production memory budget is closer to:

$$
M_{\text{total}}
=
M_{\text{weights}}
+
M_{\text{KV}}
+
M_{\text{runtime}}
+
M_{\text{workspace}}
+
M_{\text{margin}}
$$

![Memory headroom](/research/open-weight-vs-closed/charts/chart-05-memory-headroom.svg "Checkpoint and H100 memory facts point to separate unknown blocks for KV cache, runtime/workspace and production margin. Diagram avoids subtracting mixed GB/GiB.")

### / CLAIM CHECK

**CLAIM**

"The model fits on one GPU."

**WHAT THAT MEASURES**

Weight/checkpoint residency under a particular optimized representation and implementation.

**WHAT IT DOES NOT MEASURE**

KV-cache headroom, concurrency, runtime workspace, latency, throughput, redundancy or production margin.

**SECOND / PASS**

Fit is a deployment fact. It is not a serving-capacity model.

For a conventional transformer/GQA layout, a useful first approximation is:

$$
M_{\text{KV}}
\approx
2L n_{\text{kv}} d_h S B b_e
$$

Here <imath>L</imath> is layer count, <imath>n_{\text{kv}}</imath> is KV-head count, <imath>d_h</imath> is head dimension, <imath>S</imath> is sequence length, <imath>B</imath> is the number of concurrent sequences and <imath>b_e</imath> is bytes per KV element. The factor of two accounts for keys and values.

The equation makes one economic link visible: longer context and more concurrent sequences consume more memory headroom.

We do **not** apply a naive numeric version to gpt-oss-120b here. Its published configuration alternates full and sliding-attention layers. Treating every layer as full-context would give false precision.

## Managed open weight is a real middle policy

Mistral Small 4 also shows why "API versus self-hosting" is incomplete.

A company can use the Mistral-managed API while retaining access to downloadable weights under Apache 2.0.

That separates two decisions:

**Do we need weight access?**

and

**Do we need to operate the GPUs?**

A company may want portability, fine-tuning options or an exit path from one serving provider without taking on GPU scheduling, inference-engine upgrades and on-call operations today.

That policy can be economically attractive even when self-hosting is not.

A hybrid can split the problem again: controlled infrastructure for sensitive or steady work, managed capacity for bursts, or a closed managed model for tasks that fail a cheaper path.

The correct router is workload-specific. This article does not assume one mixture is universal.

## Hard constraints should behave like gates

Privacy, security and control are often turned into a scorecard: self-hosting gets a high score, an external API gets a lower one, and the numbers are added to cost and performance.

That can hide the real decision.

If company policy says a class of data cannot leave a controlled environment, a deployment that sends that data somewhere disallowed is not "less preferred." It is infeasible until the architecture changes. If the chosen model license does not permit the intended use, that path is also infeasible. License compatibility needs case-specific review; this article does not provide legal advice.

Security works the same way. Self-hosting can give the company control over the data plane and model artifacts, but it also moves patching, access control, supply-chain review, secrets, network boundaries and incident response onto the company. A managed provider can carry more of that operating burden. Neither architecture is automatically secure merely because of where the weights sit.

Latency and context are technical gates too. A model that does not support the workload's required context cannot win on price. A serving configuration that misses the interactive SLO cannot become acceptable because its monthly GPU bill is lower.

Availability makes self-host economics harder to compress into one GPU price. One node can be enough for an experiment and still be the wrong production assumption. If the service needs N+1 capacity, a warm spare, multi-zone failover or reserved headroom for bursts, that capacity belongs in the model. There is no honest universal redundancy multiplier, so the workbook leaves it as an input.

This is why the decision order matters:

1. decide which policies can satisfy the requirements;
2. then compare their economics.

A cheap infeasible policy is not a bargain. It is outside the feasible set.

## What a company should measure before self-hosting

The decision can be made with a short worksheet.

**1. Remove infeasible policies.**  
Check license, residency, security architecture, context, latency and availability requirements.

**2. Measure the workload.**  
Tasks per month is not enough. Record input/output distributions, peaks, concurrency and context.

**3. Measure acceptance.**  
Use the actual task evaluation, not a generic benchmark as a substitute.

**4. Price managed variable cost.**  
Include model tokens, tools, retries and review where they belong.

**5. Price self-host capacity and operations.**  
GPU capacity, redundancy, engineering, storage, network and support should be explicit.

**6. Measure serving capacity.**  
Use the exact model, checkpoint, engine, hardware, concurrency and SLO. A price-only break-even without this measurement is provisional.

**7. Stress-test quality and utilization.**  
These two variables can move the boundary quickly.

**8. Compare cost per accepted outcome among feasible policies.**

If different task classes produce different answers, use a hybrid/router rather than forcing one deployment policy onto everything.

## The second pass

Running your own model is not a volume milestone.

It is a constrained economics problem.

In the same-model Mistral control, managed inference is inexpensive enough that a rented 8×H100 Capacity Block does not reach the simple price boundary until roughly **13.13 million** illustrative tasks per month, before engineering and other operating costs.

Even that number is conditional on the hardware serving the required workload. At 80% effective utilization, the boundary calls for about **22,476 useful tasks per hour**. We do not have evidence to claim the selected configuration achieves that SLO.

Quality can push the boundary farther away. Poor utilization can multiply fixed cost per useful task. A license, residency rule or latency requirement can remove a policy before cost is compared.

So the practical rule is not "self-host when you are big enough."

It is:

> **Filter by constraints. Measure quality and capacity. Then choose the lowest-cost accepted outcome among the policies that remain.**

That answer may be a closed API, managed open weight, self-hosting, or a router that uses more than one.

The included decision workbook follows the same order and keeps self-hosting behind a capacity gate until measured serving data is supplied.

---

## / INTELLIGENCE

Making a model, infrastructure or deployment decision?

SECOND / PASS runs source-backed research sprints that apply this framework to a specific workload.

[START A RESEARCH BRIEF →](/intelligence)
