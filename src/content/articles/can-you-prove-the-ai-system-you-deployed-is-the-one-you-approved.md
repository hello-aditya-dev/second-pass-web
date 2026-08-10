---
title: "Can you prove the AI system you deployed is the one you approved?"
dek: "A deployed AI inference service is a dependency graph of model weights, executable code, containers and configuration. Approval is a policy result over that graph. Here is how to verify it."
slug: "can-you-prove-the-ai-system-you-deployed-is-the-one-you-approved"
section: "Security"
format: "PROOF"
author: "Aditya"
publishedAt: "2026-08-10"
status: "published"
firstPass:
  - "A deployed AI system is a dependency graph, not a model name. The graph includes weights, tokenizer, chat template, custom code, adapters, serving container, base image, runtime dependencies and startup configuration."
  - "Four verification primitives — digest, signature, provenance, policy — answer four different questions. None is sufficient alone."
  - "An approved manifest describes expected identity for every component. Observed state is measured at deploy time. The strict gate blocks on any mismatch or unexpected component."
  - "Transitive verification terminates at named trust anchors and aggregate boundaries. It does not recurse indefinitely."
  - "Verification coverage is a ratio of verified components to closure components. It is not a risk probability. A strict gate requires 100% coverage of required components."
featured: false
demo: false
adPolicy: "none"
tags:
  - "ai-deployment"
  - "provenance"
  - "supply-chain-security"
  - "verification"
  - "SLSA"
hero: "/research/ai-deployment-provenance/charts/chart-01-deployment-graph.svg"
heroAlt: "A deployment is a dependency graph of model files, executable code, configuration, containers and transitive dependencies."
sources:
  - label: "SLSA v1.2 Specification"
    url: "https://slsa.dev/spec/v1.2/"
    type: "primary"
    note: "Supply-chain integrity levels and provenance format."
  - label: "SLSA — Verifying Artifacts"
    url: "https://slsa.dev/spec/v1.2/verifying-artifacts"
    type: "primary"
    note: "Verification guidance: authenticate provenance, bind subject, compare builder/source."
  - label: "SLSA — Provenance"
    url: "https://slsa.dev/spec/v1.2/provenance"
    type: "primary"
    note: "Provenance definition: where, when and how an artifact was produced."
  - label: "OCI Image Manifest Specification"
    url: "https://specs.opencontainers.org/image-spec/manifest/"
    type: "primary"
    note: "Content-addressed image descriptors forming a Merkle-style DAG."
  - label: "OCI Content Descriptors"
    url: "https://specs.opencontainers.org/image-spec/descriptor/"
    type: "primary"
    note: "Digest-based content identity for manifests, configs and layers."
  - label: "Sigstore / Cosign — Verifying Signatures"
    url: "https://docs.sigstore.dev/cosign/verifying/verify/"
    type: "primary"
    note: "Certificate identity and OIDC issuer constraints for container signatures."
  - label: "Hugging Face Hub — Download files"
    url: "https://huggingface.co/docs/huggingface_hub/en/guides/download"
    type: "primary"
    note: "Revision behavior: defaults to latest main; commit hash for immutable pinning."
  - label: "Transformers — Custom model loading"
    url: "https://huggingface.co/docs/transformers/en/models"
    type: "primary"
    note: "trust_remote_code risks and revision pinning for custom model code."
  - label: "Safetensors documentation"
    url: "https://huggingface.co/docs/safetensors/en/index"
    type: "primary"
    note: "Tensor serialization format avoiding pickle arbitrary-object deserialization."
  - label: "Hugging Face Hub security"
    url: "https://huggingface.co/docs/hub/security"
    type: "advisory"
    note: "Security scanning, pickle scanning and model security practices."
changeLog:
  - at: "2026-08-10"
    type: "published"
    note: "Initial publication."
seoTitle: "Can you prove the AI system you deployed is the one you approved?"
seoDescription: "A proof that AI deployment verification requires digest, signature, provenance and policy over the full dependency graph. One unknown component fails the strict gate."
---

## The deployed AI system is a graph

An inference service is not a model name. It is a directed acyclic graph of artifacts:

$$
G = (V, E)
$$

where each node $v \in V$ is a deployable artifact — model weights, tokenizer, chat template, configuration, custom code, adapter, serving container, base image, runtime lockfile, or startup/policy configuration — and each edge $e \in E$ is a dependency relationship.

The root of the graph is the inference service. Under it:

- **Serving image** — the OCI container image that runs the inference runtime. This is an aggregate whose children include the base image and the runtime dependency lockfile.
- **Model snapshot** — the pinned repository revision that anchors model identity. This is an aggregate whose children include the weights bundle, model configuration, tokenizer, chat template and an optional adapter.
- **Startup/policy configuration** — flags, serve configuration and policy that control what is loaded, how the model behaves and what verification is required at startup.

Each OCI image is itself a content-addressed Merkle DAG: the image index references a manifest list, each manifest references a config blob and an ordered list of layer blobs, each identified by its SHA-256 digest. The OCI Image Manifest Specification defines content descriptors that make this structure tamper-evident by construction — changing any byte in any layer changes the layer digest, which changes the manifest digest, which changes the index digest.

The model snapshot is not a single file. A large model is typically sharded: an index file (`model.safetensors.index.json`) references multiple weight shard files, each with its own expected digest. The tokenizer, chat template and generation configuration are separate files within the same repository revision.

This means the deployment identity is not the model name. It is the set of all digests in the transitive closure of the graph:

$$
\text{Identity}(G) = \{ d(v) : v \in V \}
$$

where $d(v)$ is the cryptographic digest of artifact $v$.

![Deployment graph](/research/ai-deployment-provenance/charts/chart-01-deployment-graph.svg "A deployment is a dependency graph of model files, executable code, configuration, containers and transitive dependencies.")

## Four questions, four verification primitives

A deployment verification policy needs to answer four distinct questions about each component. Each question corresponds to a verification primitive, and each primitive establishes something different.

### Digest — Are these the expected bytes?

A cryptographic digest $d(v) = \text{SHA-256}(v)$ confirms content identity. The observed digest is compared to an expected digest from the approved manifest:

$$
\text{DIGEST}(v): \quad d_{\text{observed}}(v) \stackrel{?}{=} d_{\text{approved}}(v)
$$

A match confirms that the bytes are identical to what was approved. It does not tell you who produced those bytes, whether the build was secure, or whether the content is safe.

### Signature — Did the expected signing identity sign this?

A digital signature binds a signing identity to a digest. Verification requires checking both the signature validity and the signer identity against policy:

$$
\text{SIGNATURE}(v): \quad \text{Verify}(s, d(v), k_{\text{expected}})
$$

where $s$ is the signature over digest $d(v)$ and $k_{\text{expected}}$ is the expected signing key or certificate identity. Sigstore/Cosign verification uses certificate identity and OIDC issuer constraints to bind the signer to a specific identity.

A valid signature tells you who signed. It does not tell you that the signer is approved for this component, that the artifact is safe, or that the build source and parameters were reviewed.

### Provenance — Where, how and by what was it produced?

SLSA provenance is authenticated metadata describing how an artifact was built. It binds the artifact digest to the builder identity, build type, source repository and build parameters:

$$
\text{PROVENANCE}(v): \quad (d(v), \text{builder}, \text{source}, \text{buildType}, \text{parameters})
$$

Provenance answers where and how. It does not answer whether all claims satisfy the organization's expectations or whether the builder itself is uncompromised. The verifier must still compare the provenance fields against policy expectations.

### Policy — Does the evidence match our approved deployment?

Policy is the organization-specific accept/reject decision over all available evidence:

$$
\text{POLICY}(v): \quad V(v) = f(\text{digest}, \text{signature}, \text{provenance}, \text{manifest})
$$

Policy does not establish universal safety. It encodes what the organization has approved. A strict policy fails closed on any required component that is missing, mismatched or unexpected.

![Verification primitives](/research/ai-deployment-provenance/charts/chart-02-verification-primitives.svg "Digest, signature, provenance and policy answer four different questions. None of them is sufficient alone.")

## The approved manifest

An approved manifest $M_{\text{approved}}$ is a record of what the organization has reviewed and approved for deployment. For each component in the deployment graph, it records:

- the component identifier and role;
- the approved artifact identity;
- the approved revision or version;
- the approved cryptographic digest;
- any required signatures, expected signers and provenance expectations.

This manifest is created during the approval process — when a human or automated review examines the model, its configuration, the serving container and all dependencies, and decides that this specific combination is approved for this specific deployment environment.

The manifest is immutable after approval. It is signed and versioned. It becomes the verification baseline.

## / CALCULATION — what changed?

**QUESTION**

Given an approved manifest and an observed deployment, which components match, which have changed and which are unexpected?

**ASSUMPTIONS**

Consider an inference service with the following approved manifest:

| Component | Role | Approved revision | Approved digest |
|-----------|------|-------------------|-----------------|
| C01 | model_snapshot | `aaaaaaaaaaaaaaaa` | `sha256:1111…1111` |
| C02 | weights_bundle | `aaaaaaaaaaaaaaaa` | `sha256:2222…2222` |
| C03 | config | `aaaaaaaaaaaaaaaa` | `sha256:3333…3333` |
| C04 | tokenizer | `aaaaaaaaaaaaaaaa` | `sha256:4444…4444` |
| C05 | chat_template | `aaaaaaaaaaaaaaaa` | `sha256:5555…5555` |
| C06 | serving_container | `sha256:indexapproved` | `sha256:6666…6666` |
| C07 | base_image | `sha256:baseapproved` | `sha256:7777…7777` |
| C08 | runtime_lock | `rev-runtime-1` | `sha256:8888…8888` |
| C09 | startup_config | `deploy-rev-42` | `sha256:9999…9999` |
| C10 | policy_config | `deploy-rev-42` | `sha256:aaaa…aaaa` |

Now the observed deployment at deploy time differs in two ways:

1. **C04 — tokenizer changed.** The observed digest is `sha256:44ff…4444`, differing from the approved `sha256:4444…4444`. The immutable identity of the tokenizer is different.
2. **U01 — unexpected adapter.** An adapter file `adapter_model.safetensors` at revision `adapter-rev-unapproved` with digest `sha256:bbbb…bbbb` is present in the observed deployment but absent from the approved manifest.

**EQUATION**

For each component $c$ in the approved manifest, compare observed identity to approved identity:

$$
\text{state}(c) =
\begin{cases}
\text{MATCH} & \text{if } d_{\text{observed}}(c) = d_{\text{approved}}(c) \\
\text{CHANGED} & \text{if } d_{\text{observed}}(c) \neq d_{\text{approved}}(c)
\end{cases}
$$

For each component $u$ in the observed deployment but not in the approved manifest:

$$
\text{state}(u) = \text{UNEXPECTED}
$$

**RESULT**

| Component | State | Reason |
|-----------|-------|--------|
| C01 | MATCH | Required checks passed. |
| C02 | MATCH | Required checks passed. |
| C03 | MATCH | Required checks passed. |
| C04 | CHANGED | Observed immutable identity differs from approved identity. |
| C05 | MATCH | Required checks passed. |
| C06 | MATCH | Required checks passed. |
| C07 | MATCH | Required checks passed. |
| C08 | MATCH | Required checks passed. |
| C09 | MATCH | Required checks passed. |
| C10 | MATCH | Required checks passed. |
| U01 | UNEXPECTED | Observed security-relevant component absent from approved manifest. |

Strict gate:

$$
\text{gate} =
\begin{cases}
\text{DEPLOY} & \text{if all required components MATCH and no UNEXPECTED} \\
\text{BLOCKED} & \text{otherwise}
\end{cases}
$$

With one CHANGED and one UNEXPECTED:

$$
\boxed{\text{BLOCKED — MISMATCH}}
$$

**SO WHAT**

The strict gate does not ask "is the deployment probably fine?" It asks "is the observed deployment identical to the approved deployment?" Any difference — a changed digest, an unexpected adapter, a missing configuration — blocks the deployment. The person or process that approved the manifest did not see this specific combination.

![Approved vs observed](/research/ai-deployment-provenance/charts/chart-03-approved-vs-observed.svg "Approved manifest vs observed deployment: 9 MATCH, 1 CHANGED, 1 UNEXPECTED. Strict gate: BLOCKED.")

## The model name is not the deployment identity

Saying "we deployed Llama 3.1 70B" does not identify the deployment. The same model name can correspond to different deployments with different weights revisions, different tokenizers, different chat templates, different adapters, different serving containers and different runtime configurations.

The Hugging Face Hub illustrates this concretely. When a user downloads model files, the default behavior resolves to the latest commit on the `main` branch. That branch can be updated — files can be added, modified or removed — while the model name stays the same. Immutable identity requires pinning to a specific commit hash, which gives a fixed snapshot of all files in the repository at that point in time.

The `transformers` library adds another dimension: `trust_remote_code`. When enabled, the library executes custom code from the model repository during model loading. That code becomes part of the deployment. If the repository revision is not pinned, the code can change between deployments without any change to the model name.

This is why the deployment graph matters. The model name is one node. The deployment is the entire graph, and each node in the graph must have a verifiable identity.

## Component taxonomy and verification requirements

Not all components carry the same verification burden. The taxonomy determines which primitives are required:

| Component class | Digest | Signature | Provenance | Revision pin | Strict unknown |
|----------------|--------|-----------|------------|--------------|----------------|
| Model snapshot | YES | OPTIONAL | OPTIONAL | YES | FAIL CLOSED |
| Weights bundle | YES | OPTIONAL | OPTIONAL | YES | FAIL CLOSED |
| Serving container | YES | YES | YES | N/A | FAIL CLOSED |
| Custom code | YES | POLICY | POLICY | YES | FAIL CLOSED |
| Adapter | YES | POLICY | POLICY | YES | FAIL CLOSED |
| Startup config | YES | YES | OPTIONAL | YES | FAIL CLOSED |

Model weights require a digest and a revision pin — you must know which exact bytes are loaded and which repository snapshot they came from. Signature and provenance are optional because many open-weight models are not signed or provenanced today. The strict gate still requires the digest to match the approved manifest.

Serving containers require all three: digest, signature and provenance. The container runs executable code with network access, file system access and the ability to load and serve the model. The signature tells you who built it. The provenance tells you how it was built. The policy tells you whether that builder and source are approved.

Custom code and adapters are policy-dependent. If the organization requires signatures on executable code, then custom code must be signed. If the organization requires provenance, then provenance must be verified. If neither is available, the strict gate may still pass if the digest matches the approved manifest and the code was explicitly reviewed during the approval process.

## Transitive dependencies and where verification stops

The deployment graph is transitive. The serving container depends on a base image. The base image depends on its own base image, its package list and every system package. Runtime dependencies form their own graph of Python packages, shared libraries and custom kernels.

Verification cannot recurse infinitely. It terminates at two kinds of boundaries:

1. **Named trust anchors.** The organization designates specific artifacts as trusted roots. A base image digest that appears in the approved manifest is a trust anchor — its contents are not recursively verified because the organization approved that specific image. The trust anchor may be supported by its own provenance and signature, but verification of the deployment stops at the anchor.

2. **Aggregate boundaries.** An OCI image is an aggregate artifact. Its manifest references config and layers by digest. Verifying the image index digest verifies the entire aggregate by Merkle inclusion. The verifier does not need to enumerate every file inside every layer to confirm that the aggregate identity matches.

$$
\text{Verify}(G) = \bigwedge_{v \in V_{\text{boundary}}} \text{Verify}(v)
$$

where $V_{\text{boundary}} \subset V$ is the set of boundary nodes — trust anchors and aggregate roots — rather than the full transitive closure.

This means a deployment with a signed, provenanced serving image and a pinned model snapshot can be verified without enumerating every system package in the base image. The image aggregate identity and the model snapshot identity are the boundaries.

The practical implication: verification depth is a policy decision, not a technical requirement. The organization chooses how deep to verify. The strict gate requires that every boundary node in the chosen depth matches the approved manifest.

![Transitive verification](/research/ai-deployment-provenance/charts/chart-04-transitive-verification.svg "Verification terminates at named trust anchors and aggregate boundaries.")

## / CLAIM CHECK — "It uses safetensors, so the repository is trusted"

**WHAT IS TRUE**

Safetensors avoids pickle-style arbitrary-object deserialization.

**WHAT IS MISSING**

It does not authenticate the repository, tell who approved weights, prove provenance, or review remote custom code.

**SECOND / PASS**

No. Safetensors reduces load-time code-execution risk. It is not a trust guarantee.

## / CLAIM CHECK — "The SHA-256 matches, so we know where it came from"

**WHAT IS TRUE**

The digest confirms byte identity against expected content.

**WHAT IS MISSING**

Origin is a separate claim. The hash did not create the trust context by itself.

**SECOND / PASS**

No. A match is useful when the expected digest came from an authenticated approval process. The hash did not create that context.

## / CLAIM CHECK — "The container is signed, so it is approved"

**WHAT IS TRUE**

A valid signature provides evidence of who signed.

**WHAT IS MISSING**

The verifier must know the expected signer identity, and the organization must still approve that signer for this component.

**SECOND / PASS**

Incomplete. "Signed" is evidence. "Approved" is a policy result.

## Verification coverage is not a risk probability

Define the verification closure as the set of all components in the deployment graph up to the chosen boundary depth:

$$
V_{\text{closure}} = \{ v : v \text{ is reachable from root within boundary depth} \}
$$

Verification coverage is:

$$
C_{\text{verified}} = \frac{|V_{\text{verified}}|}{|V_{\text{closure}}|}
$$

where $V_{\text{verified}} \subseteq V_{\text{closure}}$ is the set of components that passed all required verification checks.

This is a coverage ratio, not a probability. A deployment with 90% verification coverage does not have a 10% risk of compromise. It has a specific set of unverified components, and each unverified component is a specific unknown.

### / CALCULATION — coverage sensitivity

**QUESTION**

How does the strict gate respond to different verification coverage levels?

**ASSUMPTIONS**

The strict gate requires 100% coverage of required components. Any required component that is unverified or failed causes the gate to block.

**EQUATION**

$$
\text{gate}_{\text{strict}} =
\begin{cases}
\text{VERIFIED AGAINST DEFINED POLICY} & \text{if } C_{\text{verified}} = 1.0 \\
\text{INSUFFICIENT VERIFICATION} & \text{if } C_{\text{verified}} < 1.0
\end{cases}
$$

**RESULT**

| Closure components | Verified | Unknown/failed | Coverage | Strict gate |
|-------------------|----------|----------------|----------|-------------|
| 5 | 5 | 0 | 1.00 | VERIFIED AGAINST DEFINED POLICY |
| 5 | 4 | 1 | 0.80 | INSUFFICIENT VERIFICATION |
| 10 | 10 | 0 | 1.00 | VERIFIED AGAINST DEFINED POLICY |
| 10 | 9 | 1 | 0.90 | INSUFFICIENT VERIFICATION |
| 20 | 20 | 0 | 1.00 | VERIFIED AGAINST DEFINED POLICY |
| 20 | 19 | 1 | 0.95 | INSUFFICIENT VERIFICATION |
| 50 | 50 | 0 | 1.00 | VERIFIED AGAINST DEFINED POLICY |
| 50 | 49 | 1 | 0.98 | INSUFFICIENT VERIFICATION |
| 100 | 100 | 0 | 1.00 | VERIFIED AGAINST DEFINED POLICY |
| 100 | 90 | 10 | 0.90 | INSUFFICIENT VERIFICATION |

The strict gate is binary. 99% coverage is still INSUFFICIENT VERIFICATION if the one unknown component is required by policy.

**SO WHAT**

This is not a recommendation that every deployment must verify every transitive dependency to infinite depth. It is a clarification of what the gate measures. The organization sets the boundary depth. Within that boundary, the strict gate requires full coverage. Outside that boundary, components are excluded from the closure by policy — they are not "unverified," they are "out of scope."

The operational question is: which components are in scope, and are they all verified? Not "what is the probability that something is wrong?"

**CAVEAT**

A permissive gate can be defined that allows deployment below 100% coverage with explicit accepted risks. That is a different policy. It is not the strict gate. The organization that uses it should document which unverified components are accepted and why.

![Verification coverage](/research/ai-deployment-provenance/charts/chart-05-verification-coverage.svg "90% verification coverage is not a risk probability. One unknown required component fails the strict gate.")

## The deployment verification procedure

An organization that wants to answer "is the deployed system the approved system?" should follow this procedure:

1. **Define the deployment graph.** Enumerate every component the inference service consumes: model snapshot, weights, configuration, tokenizer, chat template, adapter, serving container, base image, runtime dependencies, startup and policy configuration.

2. **Create the approved manifest.** For each component, record the approved artifact identity, revision and digest. Sign the manifest. Version it.

3. **Set verification boundaries.** Decide the boundary depth. Designate trust anchors and aggregate boundaries. Document what is in scope and what is out of scope.

4. **Assign verification requirements.** Using the component taxonomy, assign required primitives per component: digest, signature, provenance.

5. **At deploy time, observe and compare.** Measure the actual deployment. Compute digests. Verify signatures. Check provenance. Compare every observed component against the approved manifest.

6. **Evaluate the gate.** Under the strict gate, any mismatch, any changed digest, any unexpected component, or any missing required verification blocks the deployment. Under a permissive gate, explicitly document accepted deviations.

7. **Log and alert.** Record the verification result, the manifest version, the observed state and the gate decision. Alert on mismatches and unexpected components even under a permissive gate.

This procedure does not require a new infrastructure category. It uses existing tools: OCI digests and image verification, Sigstore/Cosign for container signatures, SLSA provenance for build metadata, and Hub commit hashes for model revision pinning. The novel step is assembling them into a single verification policy over the full deployment graph.

## The second pass

"Which model are you running?" is the wrong question. The model name is one node in a deployment graph. The deployment identity is the set of all digests in the transitive closure of that graph.

Four verification primitives — digest, signature, provenance and policy — answer four different questions. Digest confirms bytes. Signature confirms who signed. Provenance confirms how it was built. Policy confirms whether the evidence matches the approval. None is sufficient alone.

The approved manifest records what the organization reviewed. The observed deployment records what is actually running. The strict gate blocks on any difference. One changed tokenizer, one unexpected adapter, one unverified container — any of these is sufficient to block a deployment under the strict gate, because the person who approved the manifest did not see this specific combination.

Verification coverage is a ratio, not a probability. 90% coverage means there is one specific unknown component, not a 10% chance of something bad. The strict gate requires 100% coverage within the chosen boundary. Components outside the boundary are out of scope by policy, not unverified by accident.

For an enterprise, this turns "did we deploy the right model?" into a verification question with a computable answer:

**not whether the model name is correct, but whether the observed deployment graph is identical to the approved deployment graph — and if it is not, which specific components differ.**

---

## / INTELLIGENCE

Deploying open-weight or customized models into production?

SECOND / PASS can map the artifacts your inference service actually consumes and build a verification policy around immutable identity, signatures and provenance.

**START A RESEARCH BRIEF →**

`/intelligence`
