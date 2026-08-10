---
title: "What can a prompt-injected AI agent actually do?"
dek: "Assume untrusted content successfully manipulates the model. The security question becomes deterministic: which data, credentials, tools and consequential actions are still reachable?"
slug: "what-can-a-prompt-injected-ai-agent-actually-do"
section: "Security"
format: "SECOND PASS"
author: "Aditya"
publishedAt: "2026-08-10"
status: "published"
firstPass:
  - "Prompt injection is the manipulation mechanism; delegated authority determines which consequences are possible after manipulation."
  - "A consequential path needs both an influence source and a reachable sink. Separate prevention of manipulation from containment of consequences."
  - "Define the legitimate workflow first, then compute authority overhang as the granted capability set minus the required capability set."
  - "High-impact sinks should be blocked or independently approval-gated when they are not necessary to complete an untrusted-content workflow."
  - "For operations, trust deterministic authorization, credential scope, sandbox and egress policy more than model-visible descriptions or generic safety prompts."
featured: false
demo: false
adPolicy: "none"
tags:
  - "agent-security"
  - "prompt-injection"
  - "authorization"
  - "mcp"
  - "least-privilege"
hero: "/research/agent-authority/charts/chart-01-source-model-sink.svg"
heroAlt: "A source-to-sink diagram showing untrusted content reaching an AI model, an external policy gate, a tool and a consequential action sink."
sources:
  - label: "OpenAI — Designing AI agents to resist prompt injection"
    url: "https://openai.com/index/designing-agents-to-resist-prompt-injection/"
    type: "primary"
    note: "Source–sink framing, deterministic consequence controls and approval-gated actions."
  - label: "OpenAI — Understanding prompt injections"
    url: "https://openai.com/safety/prompt-injections/"
    type: "primary"
    note: "Direct and indirect injection taxonomy, jailbreak distinction."
  - label: "OWASP — LLM01:2025 Prompt Injection"
    url: "https://genai.owasp.org/llmrisk/llm01-prompt-injection/"
    type: "primary"
    note: "Current prompt-injection risk classification and recommendations."
  - label: "OWASP — LLM06:2025 Excessive Agency"
    url: "https://genai.owasp.org/llmrisk/llm062025-excessive-agency/"
    type: "primary"
    note: "Excessive delegated authority as a distinct risk from prompt injection."
  - label: "MCP — Specification 2026-07-28"
    url: "https://modelcontextprotocol.io/specification/2026-07-28"
    type: "primary"
    note: "Current MCP specification including tool annotations and authorization."
  - label: "MCP — Authorization 2026-07-28"
    url: "https://modelcontextprotocol.io/specification/2026-07-28/basic/authorization"
    type: "primary"
    note: "MCP authorization: audience binding, scope validation, token requirements."
  - label: "MCP — Security Best Practices 2026-07-28"
    url: "https://modelcontextprotocol.io/docs/2026-07-28/tutorials/security/security_best_practices"
    type: "primary"
    note: "Minimal default privileges, token passthrough rejection, sandbox resource constraints."
  - label: "NIST — Least privilege"
    url: "https://csrc.nist.gov/glossary/term/least_privilege"
    type: "advisory"
    note: "Standard definition of least privilege for users and processes."
changeLog:
  - at: "2026-08-10"
    type: "published"
    note: "Initial publication."
seoTitle: "What can a prompt-injected AI agent actually do?"
seoDescription: "A defensive source-to-sink and authority model for measuring what an AI agent can reach after prompt injection, including permissions, approval gates, credentials, MCP, sandboxing and egress."
---

An AI agent opens an email. The email contains instructions the user never intended the agent to follow. Assume the model is persuaded.

What happens next?

That question is more useful than arguing that one model is "safe" and another is not. Once an agent can read company data, call tools, send messages or change systems, a model mistake becomes an authorization problem. The model may decide what it *wants* to do. The surrounding system decides what it is *allowed* to do.

OpenAI's March 2026 prompt-injection security work makes this distinction unusually concrete. It describes a source–sink framing: an attacker needs a **source**, meaning a way to influence the system, and a **sink**, meaning a capability that becomes dangerous in the wrong context. OpenAI also describes deterministic systems that limit consequences when an agent is misled. OWASP's current Prompt Injection guidance separately recommends least privilege and human approval for high-risk actions.

That gives us a stronger security question:

> Assume the model has already been manipulated. Which consequential actions are still reachable?

This is a defensive architecture proof. It does not predict whether an injection will succeed. It does not contain attack payloads. It measures the authority that remains available if model-level defenses fail.

![Source, model, policy, sink](/research/agent-authority/charts/chart-01-source-model-sink.svg "Untrusted source flows into a manipulated model, then an external policy gate, tool and consequential sink; a denied policy edge blocks the path.")

## Two problems that should not be collapsed

Prompt injection and blast radius are different variables.

Prompt injection is a manipulation problem. OWASP distinguishes direct injection, where a user's prompt directly alters behavior, from indirect injection, where the model consumes external material such as a webpage or file and that material changes behavior. OWASP also distinguishes jailbreaks as a related form focused on getting a model to disregard safety controls.

The second problem is consequence containment. A model can be manipulated and still be unable to perform a consequential action because the required system edge does not exist. A read-only document summarizer with no network path has a different consequence envelope from an operations agent carrying production credentials.

This is not an argument to stop improving model robustness. Better model training, prompt-injection detection, content separation, monitoring and red-teaming can all reduce attack success. The point is that none of those should be the only authorization boundary for a consequential tool.

For the core analysis, use a **manipulated-model assumption**:

> Treat the decision-making component as untrusted for the purpose of authorization analysis, while keeping deterministic policy enforcement intact.

The underlying model is not assumed to be literally compromised. We are stress-testing the external boundary.

## Source, model, policy, sink

A useful agent graph can stay small.

Let the system be a directed graph:

$$
G=(V,E).
$$

Nodes may represent an untrusted source, model or planner, policy gate, credential, tool, data resource, approval boundary and consequential sink. Edges represent data flow or authorized action flow.

For an action edge $e$ under request context $x$, define an external policy decision:

$$
P(e,x)\in\{0,1\}.
$$

$P=1$ means the transition is allowed. The important word is **external**. If the same model that proposes an action simply says "I checked and this is allowed," that is not an independent authorization boundary.

A real policy decision may depend on an RBAC rule, resource ACL, OAuth scope, tenant check, destination allowlist, approval token, sandbox boundary, network policy or another deterministic control.

For an untrusted source $s$, define:

$$
R(s)=\operatorname{Reach}_G(s;P).
$$

$R(s)$ is the set of nodes or sinks reachable after assuming the model has been manipulated but external policies still apply.

This is **not** probability. If `SEND_EXTERNAL` is in $R(s)$, the architecture permits a path. It does not mean an attacker succeeds 20% or 80% of the time. There is no need to invent an attack rate to learn something useful.

## The security invariant

Now define a set of sinks that the workflow must never reach autonomously from untrusted content:

$$
K_{\text{prohibited}}.
$$

Examples might include arbitrary external transmission, account deletion, host code execution, permission changes or financial transfer when those actions are not necessary for the task.

A strong design goal is:

$$
R_{\text{auto}}(s)\cap K_{\text{prohibited}}=\varnothing.
$$

Necessary high-risk actions do not have to disappear from the product. They can move to a separately enforced approval path:

$$
R_{\text{approval}}(s).
$$

The useful distinction is therefore not simply "tool available" or "tool unavailable." It is **autonomous, approval-gated, blocked, or unknown**.

Unknown matters. If nobody knows the actual credential scope behind a connector, treating that edge as blocked makes the model look safer than the evidence supports. The correct state is `UNKNOWN` until the underlying authorization is inspected.

### / CALCULATION — authority overhang

**QUESTION**

Which granted capabilities are unnecessary for the legitimate task?

**ASSUMPTIONS**

Start from one legitimate workflow, not from the entire product catalog.

Consider a support-triage agent. Its legitimate job is narrow:

- read the current support ticket;
- read the matching customer record inside the same tenant;
- update that same ticket.

Represent a capability as a tuple:

$$
c=(a,r,d),
$$

where $a$ is the action, $r$ is the resource scope and $d$ is the destination or visibility scope.

The minimum required set is:

$$
C_{\text{req}}.
$$

The set actually granted to the agent is:

$$
C_{\text{grant}}.
$$

Then define **authority overhang**:

$$
\boxed{O=C_{\text{grant}}\setminus C_{\text{req}}}
$$

**RESULT**

For the deterministic scenario in the accompanying model, the support workflow needs three capability tuples. The pre-control grant also includes arbitrary external send, same-tenant deletion, host execution, workspace administration and arbitrary Internet egress.

Those five capability units are not "five points of risk." A read permission and an admin permission are not equivalent. The set representation is the result. The count is only inventory metadata.

The practical question is sharper: **Why does this workflow have each extra edge?** If there is no legitimate answer, the permission should not be present merely because the integration can expose it.

This is ordinary least privilege applied to an agent system. NIST defines least privilege as restricting users or processes acting for users to the minimum authorizations and resources necessary to perform assigned functions. Agentic systems make the need more visible because models consume untrusted content while selecting actions dynamically.

![Authority overhang](/research/agent-authority/charts/chart-03-authority-overhang.svg "Which granted capabilities are unnecessary for the legitimate task?")

## Same manipulated model, different authority

The model in the threat assumption does not change. The authority envelope does.

A document summarizer that can read one uploaded file, cannot write, and has no network egress has no consequential action sink in our simplified model. The manipulated model can still produce a bad summary. That is a real integrity problem, but it cannot autonomously delete a record or transmit data to the Internet because those paths do not exist.

A support agent may read a scoped customer record and write an internal ticket. Now an unintended write is possible. If the credential is constrained to that ticket and tenant, the system can still block cross-tenant writes and administration.

An email assistant that reads private mail and can send externally combines a sensitive source with a transmission sink. This composition deserves more scrutiny than either capability viewed alone. OpenAI's source–sink framing makes exactly this kind of combination central to agent security.

An operations agent with execution or administrative authority has a much larger consequence envelope. "Sandboxed" is not enough information. We also need to know whether the sandbox can read host files, reach secrets, open arbitrary network connections, persist state or call privileged infrastructure APIs.

Same manipulated-model assumption. Different reachable consequence set.

![Authority envelopes](/research/agent-authority/charts/chart-02-authority-envelopes.svg "Same manipulated model, different authority: a document summarizer, support agent, email assistant and operations agent have different consequence envelopes.")

## Read-only is not the same as no exfiltration path

A read tool can be a **source** of sensitive data without itself being an exfiltration sink.

That distinction prevents two opposite mistakes.

First, "read-only" does not mean harmless. The model may now possess private information.

Second, reading private information does not automatically mean the architecture can transmit it outside the permitted boundary. A consequential confidentiality path needs a compatible sink: external send, arbitrary network egress, publishing, a tool that embeds data into an outbound request, or another transmission path.

This is why source–sink analysis beats labels like "safe tool." A mailbox-search tool changes meaning depending on which other capabilities are reachable in the same workflow.

Current MCP guidance reinforces this point. Tool annotations such as read-only or destructive hints are descriptions, not enforcement. The MCP specification says annotations should be considered untrusted unless they come from a trusted server, and MCP maintainers have separately emphasized that annotations do not make the model resist prompt injection and cannot guarantee that a tool lacks exfiltration ability. Hard guarantees belong in authorization, network controls and sandboxes.

## Credentials are the real authority substrate

A tool UI is not the credential.

A connector can present a single friendly action while holding a token that reaches a far broader resource set. The security review therefore has to inventory credentials separately:

- intended resource or audience;
- action scopes;
- tenant and resource scope;
- user or service identity;
- expiration;
- refresh capability;
- storage location;
- delegation path.

The current MCP `2026-07-28` authorization specification is particularly useful here. It requires MCP clients to identify the target resource in authorization and token requests, and it requires MCP servers to validate that access tokens were issued for them as the intended audience. It also tells clients to request only the scopes needed for intended operations and supports incremental scope elevation rather than requesting every possible permission at the start.

MCP's current security guidance also explicitly rejects token passthrough: an MCP server should not simply accept a bearer token intended for another service and forward it downstream. That pattern weakens audience boundaries and can bypass controls or muddy accountability.

The broader lesson is not "MCP solves authorization." MCP itself says the protocol cannot enforce every application security principle. The lesson is that **audience, scope and resource binding are part of agent authority** and should appear in the capability graph.

Credential lifetime belongs in the inventory too. Shorter-lived credentials can reduce the time during which stolen or misused authority remains useful, but there is no universal TTL multiplier for agent risk. The correct lifetime depends on the workflow, authorization server and recovery model.

## Approval is a policy edge, not a magic word

"Human in the loop" is too vague to be a security property.

The model should distinguish an autonomous path from a path that requires a trusted external approval token. For a high-impact action, the approval surface should expose enough information for a person or policy engine to know what is being authorized: the action, resource, destination, data to be transmitted and relevant consequence.

OpenAI describes this pattern in its own source–sink defenses: when a potentially sensitive transmission is detected, a user may be shown the information that would be transmitted and asked to confirm, or the action may be blocked. OWASP likewise recommends human approval for high-risk actions.

But approval is not infallible. A generic "Allow?" dialog can produce rubber-stamping. And if the model creates the action, writes the explanation, and then effectively approves itself, there is no independent boundary.

The point of the model is to put the gate on the graph and ask whether the action is impossible without crossing it.

### / CALCULATION — before and after containment

**QUESTION**

How does the modeled autonomous consequence set change as deterministic controls are added?

**ASSUMPTIONS**

The primary scenario starts with five autonomous consequential sinks reachable from untrusted inbound content: internal write, arbitrary external send, delete, host execution and admin change. A financial sink is not granted in this scenario and remains blocked.

Now apply deterministic controls in sequence.

**1. Replace broad credentials with task-scoped credentials.** Delete and admin permissions disappear from the graph. The agent keeps only ticket/customer reads and ticket write for the intended tenant and resource.

**2. Move external send behind independent approval.** The sink still exists, but it moves out of $R_{\text{auto}}$ and into $R_{\text{approval}}$.

**3. Restrict destinations.** Arbitrary egress is removed; only policy-approved endpoints required by the workflow remain.

**4. Constrain execution.** If code execution is genuinely required, run it in a boundary with explicit filesystem, secret, persistence and network rules. In this support workflow it is not required, so the simpler result is to remove it.

The set difference is:

$$
\Delta R=R_{\text{before}}\setminus R_{\text{after}}.
$$

**RESULT**

No attack probability is needed. The architecture can show, reproducibly, which autonomous consequences disappeared.

In the final modeled support workflow, scoped internal ticket write remains autonomous because it is necessary to complete the task. External send is approval-gated. Delete, host execution, admin change and financial transfer are blocked. If any required underlying scope is unknown, the workbook returns `INSUFFICIENT INPUT` rather than silently treating it as blocked.

![Source-sink reachability](/research/agent-authority/charts/chart-04-source-sink-reachability.svg "Which untrusted inputs can reach which consequential actions after controls? Autonomous, approval-gated and blocked states shown per source-sink pair.")

## Egress and sandboxing are permission questions

Network access is often discussed as plumbing. For an agent it is authority.

There is a meaningful difference between:

- no outbound network;
- an allowlisted service endpoint;
- arbitrary Internet access.

The same applies to execution. "Sandbox" describes a boundary, not its contents. A sandbox that can read production secrets and call arbitrary external hosts may still expose substantial authority.

Current MCP security guidance recommends minimal default privileges for local server execution and separately restricting filesystem, network and other resources. OpenAI also describes sandboxing and controls on unexpected communications as layers in agent protection.

This is consequence containment again. Blocking arbitrary egress does not make prompt injection disappear. It can make a class of source-to-external-sink paths impossible.

![Containment stack](/research/agent-authority/charts/chart-05-containment-stack.svg "How does the modeled autonomous consequence set change as controls are added?")

## / CLAIM CHECK

### "If the model is resistant to prompt injection, broad tool permissions are safe."

**WHAT IS TRUE**

Model robustness can reduce manipulation success.

**WHAT IS MISSING**

Model robustness does not make excessive authorization a good design. OpenAI, OWASP and conventional least-privilege guidance all support layered controls outside the model.

**SECOND / PASS**

No. Resistance is not a substitute for least privilege. The manipulated-model assumption exists precisely because resistance can fail.

### "Read-only tools cannot create data-exfiltration risk."

**WHAT IS TRUE**

A read tool without a transmission sink cannot exfiltrate by itself.

**WHAT IS MISSING**

Read can supply sensitive data to the model. Exfiltration becomes possible when a reachable transmission sink can carry that data outside the allowed boundary. Model the composition.

**SECOND / PASS**

Incomplete. Source–sink composition determines the exfiltration path, not the read label alone.

### "Human approval makes an agent action safe."

**WHAT IS TRUE**

An independent approval gate can block actions a manipulated model would otherwise take autonomously.

**WHAT IS MISSING**

Approval is useful when it is an independent gate and the approver can understand the exact action, resource and destination. Poorly designed approval can still fail.

**SECOND / PASS**

Not automatically. Rubber-stamp approval, model-authored justifications and self-approving loops are not independent boundaries.

## Why tool count is the wrong denominator

A security review can easily become a list of tools: twelve connectors, forty-seven actions, six credentials. That inventory is useful, but it does not answer the architectural question.

The denominator should be the legitimate workflow.

A support-triage task may expose ten tools in the host application while needing only three capability tuples for the current job. Conversely, one "admin" tool may represent more consequential authority than twenty narrow read operations. That is why the model treats authority as a set of action × resource × destination tuples rather than a raw tool count.

This also explains why two agents using the same connector can have different blast radii. One may receive a token scoped to a single tenant and a single write route. Another may inherit a workspace-wide credential with delete and administration privileges. The tool name is identical. The reachable graph is not.

For an enterprise, this turns permission review into an engineering task rather than a vague safety exercise. Each extra capability must either map to a legitimate step in the workflow or appear in the overhang set. Each consequential sink must be assigned an autonomous, approval-gated, blocked or unknown state. Each unknown must be resolved from the real credential and policy configuration before the architecture is treated as bounded.

## The economic consequence is capacity for unintended action

There is no honest universal dollar value for one extra permission. The cost depends on the data, resource, tenant, recovery path, transaction size, operational environment and the company using the agent.

But the architecture still has an economic implication that can be measured without inventing loss probabilities: **unnecessary authority increases the set of business operations that must be protected, monitored, reviewed and potentially recovered after a model failure.**

Removing an unused admin scope can eliminate an entire class of change-control exposure. Removing arbitrary egress can eliminate destinations that the workflow never needed. Moving a necessary external send behind approval can preserve the product feature while changing who carries the final authorization decision. Narrowing a write from "workspace" to "same ticket" can reduce the recovery surface even when the model behaves badly.

The buyer-specific model can then attach real numbers where the company actually has them: cost of an erroneous transaction, recovery time, incident-response labor, regulated-data exposure, service downtime or approval latency. Those are inputs. They should not be fabricated by a public article.

This is the security-economic connection: the company is not only reducing a theoretical attack surface. It is reducing the number and scope of consequential business actions that an untrusted decision component can autonomously trigger.

## The enterprise procedure

An enterprise does not need a perfect prompt-injection detector before it can improve this architecture.

Take one workflow at a time.

Define the legitimate objective. Enumerate every untrusted source the model may consume. List the tools, but then go underneath them and inventory the real credentials. Write each authority unit as action × resource × destination. Build $C_{\text{req}}$ from the minimum workflow. Build $C_{\text{grant}}$ from what production actually exposes. Compute the overhang set.

Then enumerate consequential sinks: writes, external sends, deletes, execution, financial actions, deployments and administration. Calculate whether each source can reach each sink under the current deterministic policies. Separate autonomous, approval-gated, blocked and unknown.

For each prohibited autonomous path, change the graph. Remove unnecessary tools. Down-scope credentials. Narrow the resource. Restrict the destination. Put necessary high-risk actions behind an independent authorization gate. Remove arbitrary egress when the task does not need it. Sandbox execution with explicit resource rules. Log consequential tool calls with agent identity, user identity, action, resource, destination, authorization result, approval result and timestamp—without logging secrets unnecessarily.

Then run adversarial tests under the same manipulated-model assumption. The question is not only whether the model refuses. The question is whether a refusal failure can still cross a prohibited boundary.

That produces a more useful security review than a generic "agent safety" score. It produces a map of authority.

## The second pass

Prompt injection is a real model and application security problem. But the economic and operational consequence is shaped by what the agent can touch after the model has been influenced.

A company that gives an agent broad credentials, arbitrary network egress and autonomous destructive tools is making model robustness carry an authorization burden it was not designed to carry alone.

A company that defines narrow workflows, scopes credentials to those workflows, separates source from sink, blocks unnecessary edges and independently gates necessary high-impact actions changes the failure mode. The model may still be manipulated. The manipulated decision can have fewer places to go.

That is the measurable object:

**not whether the agent can ever be tricked, but whether untrusted input can reach unnecessary consequential authority.**

For an enterprise architecture review, count the paths, inspect the credentials and remove the overhang before arguing about attack probability.

---

## / INTELLIGENCE

Deploying agents with access to company data or write-capable tools?

SECOND / PASS can map the real source-to-sink paths, credential scopes and delegated authority in your architecture.

**START A RESEARCH BRIEF →**

`/intelligence`
