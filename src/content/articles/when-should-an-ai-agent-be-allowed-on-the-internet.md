---
title: "When should an AI agent be allowed on the internet?"
dek: "Internet access is not one permission. For an AI agent, the security-relevant object is the set of destinations, actions, credentials and data flows it can reach. The right policy preserves required task utility while removing network authority the workflow never uses."
slug: "when-should-an-ai-agent-be-allowed-on-the-internet"
section: "Security"
format: "SECOND PASS"
author: "Aditya"
publishedAt: "2026-08-10"
status: "published"
firstPass:
  - "Internet access is a capability set, not a Boolean. Model each grant as destination × action × credential × data scope."
  - "For the primary repository workflow, restricted egress with approved public reads plus one scoped authenticated CI action preserves the full declared task utility; broad egress adds three unneeded capabilities and is dominated."
  - "An approved destination is not authorization to send every data class there. The primary restricted policy has zero prohibited autonomous paths; the broad scenario creates eight."
  - "The model does not always need the raw credential. Current OpenAI and Anthropic architectures demonstrate proxy-mediated patterns where credentials can remain outside model-visible sandbox state and be applied only on approved paths."
  - "A narrow fixed allowlist is not always enough. In the variable-source research counter-case, broader public reach is required by the declared task trace; the decision therefore remains workload-dependent."
featured: true
featuredRank: 1
editorialOrder: 2
demo: false
tags:
  - "AI agent security"
  - "network egress"
  - "sandboxing"
  - "least privilege"
  - "prompt injection"
  - "Codex"
  - "Claude Code"
  - "MCP"
hero: "/research/agent-network-egress/charts/chart-01-network-modes.svg"
heroAlt: ""
adPolicy: "none"
sources:
  - label: "OpenAI — From model to agent: Equipping the Responses API with a computer environment"
    url: "https://openai.com/index/equip-responses-api-computer-environment/"
    type: "primary"
    note: "Hosted-container egress proxy, allowlists/access controls, observability and destination-scoped secret injection."
  - label: "OpenAI — Running Codex safely at OpenAI"
    url: "https://openai.com/index/running-codex-safely/"
    type: "primary"
    note: "Sandbox/network policy separation, expected-domain policy, approvals, identity and network audit events."
  - label: "Anthropic — Beyond permission prompts: Claude Code sandboxing"
    url: "https://www.anthropic.com/engineering/claude-code-sandboxing"
    type: "primary"
    note: "Filesystem/network isolation and proxy-mediated/scoped credential patterns."
  - label: "Model Context Protocol — Security Best Practices"
    url: "https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices"
    type: "primary"
    note: "Least privilege, egress proxying, redirect validation, SSRF controls and token handling."
  - label: "OWASP — LLM01 Prompt Injection"
    url: "https://genai.owasp.org/llmrisk/llm01-prompt-injection/"
    type: "primary"
    note: "Indirect prompt injection and agency-dependent impact."
changeLog:
  - at: "2026-08-10"
    type: "published"
    note: "Initial publication."
seoTitle: "When should an AI agent be allowed on the internet?"
seoDescription: "A network-egress decision model for AI agents covering required vs granted authority, data flows, scoped credentials, task utility and dominated network policies."
---

An AI agent does not need “the Internet.”

It needs particular things from the Internet.

A coding agent may need to read package documentation, download a declared dependency, inspect an upstream repository and submit one artifact to an internal CI service.

Those are four different capabilities.

Giving the same agent broad outbound access because the product has one **network on** switch collapses the distinction between:

**what the task requires**

and:

**what the agent is now capable of reaching.**

That distinction matters more as agents can read proprietary workspaces, execute code, call tools and act on external content.

The useful enterprise question is not:

**Is Internet access risky?**

It is:

**What network authority does this workflow actually need, what extra authority appears when we grant more, and does the extra authority produce useful work?**

## / QUESTION

For one agent workflow:

**should execution be offline, restricted to known egress, or allowed broader network reach?**

Then ask:

- which destinations are genuinely required;
- which actions are required at those destinations;
- which data classes may leave;
- which credentials can be applied where;
- whether the model/process needs to see a raw credential;
- what the narrower policy actually breaks;
- whether a broader policy produces more measured or scenario task utility.

The answer is a capability map, not a fear score.

![Four network modes](/research/agent-network-egress/charts/chart-01-network-modes.svg "Network access is not a single Boolean. Known reads, authenticated actions and broad destination reach grant different authority.")

## Four useful network modes

The practical comparison is slightly richer than “off / on.”

### A — network off

The agent can work only with local or preloaded material during the modeled execution phase.

This can be enough for:

- local refactors;
- editing known code;
- running existing local tests;
- manipulating supplied files;
- work where dependencies and documentation were acquired before execution.

### B — public read allowlist

Known public destinations are reachable for approved read paths.

A coding workflow might need:

- one documentation host;
- one package registry;
- one public source-control host.

No authenticated external action is required.

### C — scoped authenticated egress

The policy adds one or more known authenticated actions, while credential use is bounded to the approved destination.

This is the primary scenario's winning policy.

### D — broader Internet

The workflow can reach a broad or changing set of external destinations, subject to whatever controls the runtime or enterprise proxy still enforces.

Do not call this “unrestricted” unless it actually is.

A platform can still impose DNS, protocol, port, proxy, identity, approval, logging or organizational policy even when destination reach is much broader.

## Current agent platforms already separate these controls

Current OpenAI hosted-container architecture routes outbound container traffic through a sidecar egress proxy. The policy layer can enforce allowlists and access controls and make traffic observable. OpenAI also documents destination-scoped secret injection: the model/container can hold a placeholder while the raw secret remains outside model-visible context and is applied at the egress layer for an approved destination.

That is a materially different security architecture from placing the raw API credential in a model-visible process environment.

OpenAI's description of running Codex internally makes another useful distinction: sandbox constraints and approval/network policy are separate control planes. Its managed network policy uses expected destinations and can require approval when Codex wants an unfamiliar domain.

Anthropic's Claude Code sandboxing architecture makes the same separation from another direction. Filesystem restrictions and outbound network restrictions are separate boundaries, and a proxy outside the sandbox can enforce allowed domains. Anthropic also describes scoped Git credential mediation in which sensitive authentication stays outside the sandbox and is attached only after the proxy verifies the intended repository operation.

These are vendor implementations, not universal guarantees.

The transferable lesson is architectural:

**network, filesystem, credentials and approval are different authority planes.**

## “Internet access” is four permissions

Represent an egress capability as:

$$
e
=
(d,m,a,s)
$$

where:

- `d` = destination or resource;
- `m` = method, protocol or action;
- `a` = authentication/credential capability;
- `s` = data scope that may be transmitted.

![Egress capability tuple](/research/agent-network-egress/charts/chart-02-egress-capability.svg "A destination approval is only one dimension. The action, identity and data permitted across the path must be reviewed separately.")

Consider:

**documentation host × GET × no credential × public request data**

versus:

**arbitrary external destination × POST × credential × proprietary workspace data.**

Calling both “Internet access” removes nearly every property a security team needs to review.

The tuple is deliberately abstract.

Current public platform documentation strongly supports host/domain/proxy policy and scoped credential mediation. It does **not** establish that every agent runtime natively enforces content-aware data classification or per-HTTP-method DLP.

Where the runtime cannot express `m` or `s` directly, another control plane has to enforce it—or the state remains unknown.

## / CALCULATION — required vs granted egress

For workflow `w`, define the minimal required capability set:

$$
E_{\text{req}}(w).
$$

Define what policy actually grants:

$$
E_{\text{grant}}(w).
$$

Functionality requires:

$$
E_{\text{req}}
\subseteq
E_{\text{grant}}.
$$

But the security review should inspect the difference:

$$
O_E
=
E_{\text{grant}}
\setminus
E_{\text{req}}.
$$

Call that **egress overhang**.

It is a set.

It is not a breach probability, an expected-loss estimate or a universal risk score.

### Primary repository scenario

The declared workflow requires:

- `E1`: public documentation read;
- `E2`: package-registry read;
- `E3`: public upstream source/release read;
- `E4`: authenticated submission of an approved build artifact to internal CI.

Therefore:

$$
E_{\text{req}}
=
\{E1,E2,E3,E4\}.
$$

Policy C grants exactly:

$$
E_{\text{grant,C}}
=
\{E1,E2,E3,E4\}.
$$

So:

$$
O_{E,C}
=
\varnothing.
$$

Policy D grants:

$$
E_{\text{grant,D}}
=
\{E1,E2,E3,E4,E5,E6,E7\}.
$$

Therefore:

$$
O_{E,D}
=
\{E5,E6,E7\}.
$$

Those three extra capabilities are broad public reach, broad outbound workspace/proprietary writes and writes to user-controlled destinations in the scenario model.

The set calculation tells us exactly what changed without inventing a probability.

## A destination is not a data authorization

Suppose `registry.example` is approved because the build needs dependency metadata.

That does not mean the agent is authorized to upload proprietary source code to the registry.

The destination can be legitimate while a particular data flow is prohibited.

For data class `i` and destination class `j`, define:

$$
X_{ij}
=
\begin{cases}
1,&\text{allowed}\\
0,&\text{blocked}\\
?,&\text{unknown}
\end{cases}
$$

The workbook uses an additional **APPROVAL-GATED** state where the modeled policy requires explicit authorization.

![Data by destination matrix](/research/agent-network-egress/charts/chart-03-data-destination.svg "An allowed destination is not authorization for every data class. Policy C has zero modeled prohibited autonomous paths.")

The primary restricted policy permits:

- PUBLIC data to the known public read destinations;
- BUILD_ARTIFACTS to the internal CI destination;
- credential application to the internal CI path only through the scoped credential architecture.

It blocks workspace source, proprietary source, logs and raw secrets from autonomous external paths.

For that modeled policy:

**prohibited autonomous reachable paths = 0**

and:

**unknown paths = 0.**

The broad scenario creates **8 prohibited autonomous paths** because workspace/proprietary/build/log data can reach arbitrary external or user-controlled destinations in the model.

That does not mean eight attacks.

It means eight policy-permitted paths conflict with the declared autonomous data-flow invariant.

## UNKNOWN is a first-class state

Security spreadsheets often make a dangerous conversion:

**not documented → probably blocked.**

This model does not.

If redirect behavior is unknown:

**UNKNOWN.**

If credential audience is unknown:

**UNKNOWN.**

If the runtime cannot prove whether a particular data class can cross a path:

**UNKNOWN.**

The workbook refuses to turn a decision-critical unknown into a confident verdict.

That matters for redirects in particular.

Current MCP Security Best Practices explicitly discuss redirect validation and SSRF controls, including validation of redirected destinations. But that does not justify claiming that every coding-agent allowlist implements the same redirect semantics.

Where current platform documentation does not specify the behavior, keep it unknown.

## Domain count is not network authority

A 100-domain allowlist is not automatically ten times more dangerous than a 10-domain allowlist.

Raw cardinality ignores what each destination can do.

Ten authenticated internal write APIs can expose more consequential authority than one hundred public documentation hosts.

Likewise, one broad wildcard or proxy route can cover a much larger destination space than a long explicit list.

So the package records allowlist length as inventory, not as a security score.

The decision object remains the capability tuple and the reachable data/credential paths.

This also explains why hostname, URL, resource, port and action scope should not be conflated.

A domain can front many paths.

A resource-specific authorization can be narrower than host-level network reach.

A redirect can change the effective destination after the first request.

A CDN or artifact service may use supporting hosts that are operationally required even though the user thinks of the task as contacting one product.

The right response is not to invent precision the runtime does not provide.

Record the enforcement level the platform actually supports and put the remaining dimension into the enterprise proxy, application authorization layer or UNKNOWN column.

## / CALCULATION — prohibited data paths

Let:

$$
F_{\text{prohibited}}
$$

contain prohibited `(data class, destination/action)` pairs.

A necessary autonomous-execution policy condition is:

$$
R_{\text{egress}}
\cap
F_{\text{prohibited}}
=
\varnothing.
$$

This proves only that the modeled policy contains no known route in the prohibited set.

It does not prove that:

**the agent is secure.**

Prompt injection, software vulnerabilities, compromised approved services, supply-chain problems and other failures remain separate questions.

OWASP's prompt-injection guidance is relevant precisely because an agent can consume untrusted external content and then act with whatever agency the surrounding system exposes.

Containment is about limiting the consequences available after something goes wrong.

## The model may not need the raw credential

For credential `k`, define:

$$
D_k
$$

as the destinations where the credential is valid or intended to be used.

Define:

$$
V_k
$$

as the destinations where policy can expose or apply that credential.

A narrow architecture aims for:

$$
V_k
\subseteq
D_k
$$

and preferably only the required subset.

Now define:

$$
M_k
\in
\{0,1\}
$$

where `M_k=1` means the raw secret is visible to the modeled agent/process.

The preferred value is often:

$$
M_k=0
$$

when a trusted intermediary can apply the credential outside model-visible context.

![Secret delivery architectures](/research/agent-network-egress/charts/chart-04-secret-delivery.svg "Proxy-mediated credential application can reduce raw-secret visibility while preserving an approved authenticated action.")

### Raw environment scenario

The raw CI token is placed in the agent process.

The intended audience is:

`ci.internal.example`.

But the process itself can observe the credential, so credential authority is not bounded merely by the destination where the token is intended to work.

In the workbook's broad raw-secret scenario:

- raw-secret-visible count: **1**
- credential/destination mismatch: **1**
- verdict: **INSUFFICIENT INPUT** under the default policy requirements.

### Mediated scenario

The agent sees a placeholder or request mechanism.

The egress layer verifies the approved destination/audience and applies the credential outside agent-visible state.

The scenario gives:

- raw-secret-visible count: **0**
- credential/destination mismatches: **0**
- unknown credential states: **0**.

This is aligned with the architectural pattern currently documented by OpenAI hosted containers and Anthropic's sandboxed code environment.

It does not make the destination trusted for every data class.

It narrows credential visibility.

### Unknown audience

If the credential audience is unknown, the workbook does not infer that the intended destination is valid.

The output becomes:

**INSUFFICIENT INPUT.**

## / CLAIM CHECK — "Sandboxed means the agent cannot leak data."

**WHAT IS TRUE**

A filesystem sandbox and an egress policy solve different problems.

**WHAT IS MISSING**

A process may be unable to write outside a workspace but still be able to transmit workspace content over the network.

Or it may have no network while still seeing sensitive mounted files locally.

The boundary inventory should separately cover:

- filesystem visibility;
- write scope;
- process privilege;
- device/host access;
- network policy;
- credential visibility;
- persistence.

**SECOND / PASS**

Incomplete. Do not use **sandboxed** as a synonym for **safe**.

## / CLAIM CHECK — "An allowlisted domain is safe to receive any data the agent has."

**WHAT IS TRUE**

Destination approval answers:

**may the agent reach this resource?**

**WHAT IS MISSING**

Data authorization answers:

**which bytes may cross this path for this purpose?**

They are not equivalent.

A documentation host can be legitimate and still be an invalid destination for proprietary source, logs or credentials.

**SECOND / PASS**

No. Destination approval and data authorization are separate security dimensions.

## / CLAIM CHECK — "If the task needs an API key, put the key in the agent environment."

**WHAT IS TRUE**

Some applications genuinely need direct credential handling.

**WHAT IS MISSING**

But current hosted-agent architectures demonstrate another option: keep the raw secret outside model-visible state and apply it at a proxy/egress boundary scoped to the approved destination or resource.

MCP authorization guidance adds a related identity principle: access tokens should be audience/resource bound and must not be blindly passed through to downstream systems.

**SECOND / PASS**

Not necessarily. Proxy-mediated credential application can narrow raw-secret visibility while preserving approved authenticated actions.

## / CALCULATION — does the narrower policy preserve utility?

Security control is useful only if the workflow still works.

For a task suite:

$$
T
=
\{t_1,\ldots,t_n\}
$$

define weighted utility:

$$
U_w(p)
=
\frac{
\sum_i w_i\,success_i(p)
}{
\sum_i w_i
}.
$$

In this package, `success_i(p)` means only:

**the declared network dependencies for scenario task i are satisfied by policy p.**

It is **not** an empirical probability that an AI agent will correctly solve the task.

Primary task weights:

- local code edit/tests: 2
- documentation lookup: 1
- package dependency: 2
- upstream source/release lookup: 2
- authenticated internal CI submission: 3.

Total:

**10.**

Policy results:

- A offline: **0.20**
- B public allowlist: **0.70**
- C scoped authenticated egress: **1.00**
- D broader Internet: **1.00**.

Critical external dependency coverage:

- A: **0%**
- B: **75%**
- C: **100%**
- D: **100%**.

Policy C therefore preserves all declared primary utility without the extra broad capabilities.

## Policy dominance

For two policies, if:

$$
E_{\text{grant}}(p_1)
\subset
E_{\text{grant}}(p_2)
$$

and:

$$
U(p_1)
\ge
U(p_2),
$$

then `p2` grants strictly more network authority without creating greater measured/scenario utility for the task suite.

In the primary scenario:

$$
E_{\text{grant,C}}
\subset
E_{\text{grant,D}}
$$

while:

$$
U(C)=U(D)=1.
$$

The workbook also uses explicit scenario authority weights:

- C: **6 units**
- D: **28 units**.

Those weights are inputs for comparing the modeled consequence surface.

They are not breach probabilities.

Policy D is therefore:

**DOMINATED BY C**

for the primary task suite.

![Utility versus network authority](/research/agent-network-egress/charts/chart-05-utility-authority.svg "If a strict-subset policy preserves equal utility, broader network authority is dominated for that task suite.")

## The counter-case: broader access can be necessary

A publication about least privilege becomes useless if it always decides that less networking wins.

Consider a research agent whose declared job is to discover current external sources.

The scenario task suite contains:

1. analyze local supplied material;
2. fetch known vendor A documentation;
3. fetch known vendor B documentation;
4. fetch a known standards page;
5. follow a newly discovered public primary source;
6. inspect a newly discovered public release/advisory host.

Scenario utility:

- A offline: **1/6 = 16.7%**
- B public allowlist: **4/6 = 66.7%**
- C scoped authenticated egress: **4/6 = 66.7%**
- D broader Internet: **6/6 = 100%**.

For that declared trace, fixed narrow allowlists miss the dynamic destinations the task itself is meant to discover.

So the result flips:

**BROADER NETWORK REQUIRED BY THE SCENARIO TASK SUITE.**

This does not authorize raw secrets to arbitrary destinations.

It does not make the broad policy universally preferable.

It means the network requirement is part of the workload definition.

## Network access can be phase-specific

One permanent policy is often too coarse.

Separate:

**SETUP / DEPENDENCY ACQUISITION**

from:

**AGENT EXECUTION**

from:

**DEPLOYED APPLICATION RUNTIME.**

A workflow may need public network access to populate a dependency cache or internal mirror, then run the agent offline from the public Internet.

Another workflow may need documentation reads during execution but never authenticated external writes.

A research workflow may need variable public reads but no proprietary outbound data.

Conceptually:

$$
E(t)
$$

can change by phase.

That is often a stronger design than granting every capability for the entire job.

Internal package registries, artifact stores and dependency mirrors can also move a workflow from **public Internet required** to **approved internal resource required**.

That changes operational cost and trust; it is not automatically free or universally superior.

There is a reproducibility benefit as well.

An agent with broad network reach can silently depend on mutable “latest” resources unless the workflow pins:
- dependency versions;
- lockfiles;
- artifact digests;
- source revisions;
- base-image versions.

An internal mirror can make the allowed dependency set more explicit and auditable, but it also creates an operational responsibility to synchronize, scan and maintain that mirror.

So network minimization and build reproducibility can reinforce each other without being the same control.

The security article stops there; software-supply-chain integrity deserves its own full treatment.

## Observability is part of policy engineering

A useful egress layer can log:

- destination;
- action or protocol information where available;
- time;
- policy result;
- credential identity or policy identity without the raw credential;
- possibly size/metadata appropriate to the environment.

OpenAI's internal Codex deployment describes network proxy allow/deny events as part of its observability.

These logs do not prevent misuse.

They make it possible to:

- review denied destinations;
- distinguish legitimate missing dependencies from unnecessary traffic;
- refine allowlists;
- investigate incidents.

The important operational rule is:

**do not automatically approve every denied destination.**

Denied traffic can be irrelevant or adversarial.

## How a company should decide

1. Define the task suite and execution phase.
2. Record actual successful task traces where available.
3. Inventory every required destination/resource.
4. Add the required method/action.
5. Add the exact credential or identity requirement.
6. Classify the data permitted to cross each path.
7. Mark critical requests separately from optional requests.
8. Preserve UNKNOWN states.
9. Test offline.
10. Test the smallest known public-read allowlist.
11. Add scoped authenticated actions only when required.
12. Compare utility against broader network reach.
13. Reject a broader policy when a strict-subset policy preserves equal utility.
14. Use broader reach when the workload genuinely needs changing/unknown destinations.
15. Keep credential delivery as narrow as the runtime/application permits.
16. Re-run the model when task traces, destinations, credentials or runtime behavior change.

The workbook's final states are intentionally limited to:

**NETWORK OFF SUFFICIENT**

**RESTRICTED EGRESS SUFFICIENT**

**BROADER NETWORK REQUIRED BY MEASURED TASK SUITE**

or:

**INSUFFICIENT INPUT.**

It never outputs:

**SECURE.**

## The second pass

The Internet is not one permission.

For an autonomous agent, the useful security object is:

$$
\text{destination}
\times
\text{action}
\times
\text{credential}
\times
\text{data scope}.
$$

The primary scenario needs four capabilities.

Restricted Policy C grants those four, preserves the entire declared task suite, exposes no modeled prohibited autonomous path and keeps the CI credential out of raw model-visible context.

Broader Policy D preserves the same primary utility but adds three unrequired network capabilities, increases the modeled authority surface and creates prohibited autonomous paths.

For that workflow:

**restricted egress wins.**

The variable-source research counter-case changes the answer because the task explicitly requires discovering destinations that cannot all be predeclared.

For that workflow:

**broader public network reach is required by the scenario trace.**

That is the decision rule:

**grant the smallest known network capability set that preserves the workflow's required utility—and widen it only when the extra authority produces work the task genuinely needs.**

---

## / INTELLIGENCE

Giving coding or research agents network access?

SECOND / PASS can map the destinations, credentials and data flows your workflows actually require and identify authority that can be removed without breaking useful work.

[START A RESEARCH BRIEF →](/intelligence)
