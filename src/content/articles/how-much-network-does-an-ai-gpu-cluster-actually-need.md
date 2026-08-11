---
title: "How much network does an AI GPU cluster actually need?"
dek: "AI clusters are sold in GPU counts and link rates. Neither tells you whether a workload will scale. Count the collective bytes, give them a deadline, subtract the latency floor, then test whether the endpoint and fabric can actually deliver the required payload."
slug: "how-much-network-does-an-ai-gpu-cluster-actually-need"
section: "Compute"
format: "SECOND PASS"
author: "Aditya"
publishedAt: "2026-08-10"
status: "published"
firstPass:
  - "Scale-up and scale-out bandwidth are different resources. A GB300 NVL72 rack can place 72 GPUs inside one NVLink domain while traffic that leaves that domain still depends on the scale-out fabric."
  - "An ideal n-rank ring AllReduce moves 2(n-1)S/n bytes of payload per rank for a tensor of S bytes. Per-rank bytes approach 2S as n grows, but the number of startup/communication steps keeps increasing."
  - "The required network rate comes from the communication deadline, not a universal Gb/s-per-GPU rule. In the worked 64-rank, 1 GiB scenario, a 30 ms deadline requires about 71.1 GB/s effective payload bandwidth."
  - "Latency creates a hard boundary: if the analytical ring startup term already exceeds the communication deadline, no finite bandwidth can satisfy that model. A 256-rank, 1 MiB scenario with a 1 ms budget and 2 µs startup term lands in that region."
  - "Network delay becomes an accelerator-capacity question. A 5% exposed communication share across 1,024 GPUs is 51.2 GPU-equivalents of normalized wall-clock capacity exposure, not 51.2 literally powered-off GPUs."
featured: true
featuredRank: 7
editorialOrder: 2
demo: false
tags:
  - "AI cluster networking"
  - "NCCL"
  - "ConnectX-8"
  - "NVLink"
  - "Spectrum-X"
  - "InfiniBand"
  - "collectives"
  - "AI infrastructure"
hero: ""
heroAlt: ""
adPolicy: "none"
sources:
  - label: "NVIDIA HGX AI Factory — Networking Logical Architecture"
    url: "https://docs.nvidia.com/enterprise-reference-architectures/hgx-ai-factory/latest/network-logical-architecture.html"
    type: "primary"
    note: "HGX B300 scale-out endpoint and dual-plane reference architecture."
  - label: "NVIDIA NVL72 AI Factory — Networking Logical Architecture"
    url: "https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/network-logical-architecture.html"
    type: "primary"
    note: "GB300 NVL72 scale-up domain, ConnectX-8 scale-out endpoints and rail-optimized fabric."
  - label: "NVIDIA ConnectX-8 User Manual — Port Configurations"
    url: "https://networking-docs.nvidia.com/connectx8hw/port-configurations"
    type: "primary"
    note: "800 Gb/s and 2x400GbE endpoint configurations."
  - label: "NVIDIA NCCL User Guide — Collective Operations"
    url: "https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/usage/collectives.html"
    type: "primary"
    note: "AllReduce, AllGather, ReduceScatter and AlltoAll semantics."
  - label: "NVIDIA NCCL User Guide — NCCL_ALGO"
    url: "https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/env.html"
    type: "primary"
    note: "Current NCCL algorithm selection options; ring is not universal."
  - label: "NVIDIA Megatron Core — Tensor Parallel API"
    url: "https://docs.nvidia.com/megatron-core/developer-guide/latest/api-guide/tensor_parallel.html"
    type: "primary"
    note: "Examples of collective operations in model-parallel mappings."
changeLog:
  - at: "2026-08-10"
    type: "published"
    note: "Initial publication."
seoTitle: "How much network bandwidth does an AI GPU cluster need?"
seoDescription: "A source-backed AI cluster network model: collective bytes, ring AllReduce timing, latency floors, required effective bandwidth, oversubscription, overlap and GPU-equivalent network exposure."
---

A GPU cannot use another GPU's result until that result arrives.

A faster accelerator therefore creates a second requirement: the network has to move the intermediate state before the next computation needs it.

Buying an 800 Gb/s NIC does not answer whether that happens quickly enough.

To answer that, count the bytes and give them a deadline.

## / QUESTION

**Given our communication pattern and timing budget, what scale-out network must exist before adding another GPU actually increases useful cluster throughput?**

There is no universal "required Gb/s per GPU."

The answer depends on what crosses the network, how many ranks participate, which collective is being modeled, how many communication steps are on the critical path, how much work overlaps compute, and whether the fabric can carry the traffic matrix after it leaves each endpoint.

The hardware specification is only one input.

![Three bandwidth domains](/research/ai-cluster-network/charts/chart-01-bandwidth-domains.svg)

## First define which network you mean

A modern AI system can move through at least three different bandwidth domains.

**Local HBM** connects a GPU to its own high-bandwidth memory.

**Scale-up fabric** connects GPUs inside a tightly coupled domain. On current GB300 NVL72 systems, that means NVLink and NVSwitch.

**Scale-out fabric** connects nodes, racks or scale-up domains through Ethernet/RoCE or InfiniBand.

They are not interchangeable.

NVIDIA's current [GB300 NVL72 reference architecture](https://docs.nvidia.com/enterprise-reference-architectures/nvl72-ai-factory/latest/network-logical-architecture.html) describes all 72 GPUs in one L1 NVLink domain. It gives **900 GB/s one-way NVLink bandwidth per GPU and 1,800 GB/s bidirectional**, while [NVIDIA's GB300 platform specification](https://www.nvidia.com/en-in/data-center/gb300-nvl72/) describes **130 TB/s of NVLink bandwidth** across the rack-scale system.

The same rack also contains 72 ConnectX-8 scale-out endpoints: 18 compute trays with four ConnectX-8 SuperNICs each. In the current Ethernet reference design, every 800 Gb/s adapter is broken into two 400 Gb/s links, one into each plane of the dual-plane rail-optimized fabric.

The current [HGX B300 reference design](https://docs.nvidia.com/enterprise-reference-architectures/hgx-ai-factory/latest/network-logical-architecture.html) uses the same basic endpoint idea at node scale: eight GPUs and eight ConnectX-8 SuperNICs, with a dedicated 400 Gb/s connection from each GPU position to each network plane.

This matters because a tensor-parallel group placed inside one NVLink domain can have a different scale-out requirement from the same group spread across rack boundaries.

Do not add "130 TB/s NVLink" and "800 Gb/s NIC" into one fake total.

They solve different communication boundaries.

## The published totals need unit reconciliation

Current NVIDIA material also shows why AI-network specifications need a ledger instead of copy-and-paste.

On the HGX B300 reference design, eight 800 Gb/s ConnectX-8 endpoints imply a raw one-direction endpoint sum of:

$$
8
\times
800\text{ Gb/s}
=
6.4\text{ Tb/s}
=
800\text{ GB/s}
$$

The same architecture describes eight 400 Gb/s links as **400 GB/s aggregate** for one plane, and sixteen 400 Gb/s links as **800 GB/s aggregate** across both planes.

Those GB/s values are node aggregates, not 400 or 800 GB/s delivered to each GPU.

[NVIDIA's public HGX platform specification](https://www.nvidia.com/en-in/data-center/hgx/) also shows **1.6 TB/s of networking bandwidth for HGX B300**, a larger total than the 0.8 TB/s one-direction sum of eight 800 Gb/s endpoints. The reference architecture is clearer about the endpoint and plane structure, so this package uses the per-adapter 800 Gb/s line rate and the explicit 2×400 Gb/s breakout for its scale-out calculations rather than silently importing a top-line aggregate.

The GB300 material has a similar presentation issue. Seventy-two 800 Gb/s endpoints sum to:

$$
72
\times
800\text{ Gb/s}
=
57.6\text{ Tb/s}
=
7.2\text{ TB/s}
$$

in one raw direction. Some NVIDIA material publishes a larger aggregate networking number. The arithmetic is consistent with summing directions, but because the directionality is not always stated beside the headline, this article does not use that aggregate as a workload bandwidth input.

The rule is simple:

**before using any network number, attach four labels: per-port or aggregate, bits or bytes, one-way or bidirectional, and scale-up or scale-out.**

The internal reconciliation ledger records the source wording and the publication-safe interpretation.

## The 800 Gb/s unit trap

NVIDIA's current [ConnectX-8 port documentation](https://networking-docs.nvidia.com/connectx8hw/port-configurations) supports an 800 Gb/s adapter configuration and, for Ethernet, two 400 Gb/s ports.

The raw unit conversion is simple:

$$
800\text{ Gb/s}
\times
\frac{1\text{ byte}}{8\text{ bits}}
=
100\text{ GB/s}
$$

That is **100 GB/s of raw line-rate units**.

It is not automatically 100 GB/s of useful collective payload.

Protocol effects, collective algorithm, message size, topology, contention, transport behavior, software and the achieved data path all sit between line rate and application bytes.

Define a scenario or measured network-efficiency factor:

$$
B_{\text{eff}}
=
\eta_n B_{\text{line}}
$$

where:

$$
0<\eta_n\le1
$$

This package never calls one efficiency percentage typical. The worked example uses 80% only as a visible scenario.

## / CLAIM CHECK

### "An 800 Gb/s NIC means my GPU gets 100 GB/s of useful collective bandwidth."

**WHAT IS TRUE**

Eight hundred gigabits per second converts to 100 gigabytes per second at raw line-rate units.

**WHAT IS MISSING**

Everything between link specification and useful collective payload: protocol, implementation, algorithm, topology, congestion, message size and software efficiency.

**SECOND / PASS**

Treat 100 GB/s as the raw conversion ceiling. For procurement, use measured effective collective bandwidth if a representative trace exists.

## What one collective actually moves

The current [NCCL collective-operations documentation](https://docs.nvidia.com/deeplearning/nccl/user-guide/docs/usage/collectives.html) defines the semantics of AllReduce, AllGather, ReduceScatter and AlltoAll.

That does not mean NCCL always implements AllReduce as a ring.

Current NCCL exposes multiple algorithm families including Ring, Tree, NVLS, PAT and others, and can choose based on topology and architecture. The ring model below is therefore an **analytical case**, not an implementation promise.

Let:

- `n` = ranks in the collective;
- `S` = bytes in the full tensor per rank before the modeled reduction.

For an ideal ring ReduceScatter, per-rank payload is approximately:

$$
V_{\text{RS}}
=
\frac{n-1}{n}S
$$

The following ring AllGather moves the same idealized per-rank payload:

$$
V_{\text{AG}}
=
\frac{n-1}{n}S
$$

Together:

$$
V_{\text{AR}}
=
2\frac{n-1}{n}S
$$

This is algorithmic payload accounting. It does not include wire headers, retries or every detail of a real NCCL trace.

As rank count grows:

$$
V_{\text{AR}}
\rightarrow
2S
$$

The surprising part is what does **not** grow linearly: per-rank payload bytes.

The part that does grow is the number of ring communication/startup steps.

That is where latency enters.

![Ideal ring AllReduce payload](/research/ai-cluster-network/charts/chart-02-ring-allreduce.svg)

## / CALCULATION — a 64-rank, 1 GiB ring case

### / ASSUMPTION

This is an **illustrative network workload**, not a claim about a typical model:

- ranks: 64
- tensor: 1 GiB = 1,073,741,824 bytes
- analytical algorithm: ring AllReduce
- startup/step latency term `lambda`: 2 microseconds
- raw endpoint line rate: 800 Gb/s
- network efficiency: 80% scenario
- compute-only step time: 270 ms
- allowed communication share in the no-overlap teaching case: 10%.

First calculate payload per rank:

$$
V_{\text{AR}}
=
2\frac{63}{64}
(1{,}073{,}741{,}824)
=
2{,}113{,}929{,}216
\text{ bytes}
$$

That is:

**2.1139 GB decimal, or 1.96875 GiB per rank.**

The analytical ring uses:

$$
2(n-1)
=
126
$$

startup/communication steps.

Per-rank bytes remain close to two copies of `S`; the latency count is already 126.

## Give the collective a deadline

A company does not fundamentally need "800 Gb/s."

It needs the communication operation to finish before a deadline.

For a simplified latency-bandwidth ring model:

$$
T_{\text{AR}}
\approx
2(n-1)\lambda
+
\frac{
2(n-1)S
}{
nB_{\text{eff}}
}
$$

The first term is the startup/latency floor.

The second is the serialization/bandwidth term.

Let the maximum communication time be:

$$
T_{\text{budget}}
$$

The requirement is:

$$
T_{\text{AR}}
\le
T_{\text{budget}}
$$

Rearrange:

$$
B_{\text{req}}
\ge
\frac{
2(n-1)S/n
}{
T_{\text{budget}}
-
2(n-1)\lambda
}
$$

provided:

$$
T_{\text{budget}}
>
2(n-1)\lambda
$$

That denominator is the practical procurement variable:

**how much serialization time remains after latency consumes part of the deadline?**

## Turning a 10% target into a deadline

If there is no overlap in a teaching case and compute time is `T_c`:

$$
T_{\text{step}}
=
T_c+T_{\text{comm}}
$$

If communication may consume at most a fraction `f` of total step time:

$$
\frac{T_{\text{comm}}}
{T_c+T_{\text{comm}}}
\le
f
$$

Then:

$$
T_{\text{comm}}
\le
\frac{f}{1-f}T_c
$$

For `T_c=270 ms` and `f=10%`:

$$
T_{\text{budget}}
=
\frac{0.10}{0.90}
\times270
=
30\text{ ms}
$$

Now the ring latency floor:

$$
2(64-1)(2\text{ microseconds})
=
0.252\text{ ms}
$$

That leaves:

**29.748 ms for serialization.**

The required effective payload bandwidth is therefore:

$$
B_{\text{req}}
=
\frac{
2{,}113{,}929{,}216
}{
0.029748
}
=
71.061
\text{ GB/s}
$$

At the explicit 80% efficiency scenario, required raw line rate is:

$$
\frac{71.061}{0.80}
=
88.826
\text{ GB/s}
$$

or:

**about 710.6 Gb/s raw line rate.**

The 800 Gb/s endpoint clears this particular analytical requirement.

At 80 GB/s modeled effective payload bandwidth, predicted communication time is:

- latency term: **0.252 ms**
- bandwidth term: **26.424 ms**
- total: **26.676 ms**.

With no overlap, the modeled exposed communication share becomes about **8.99%** of the 296.676 ms total step.

This is a scenario result, not an NCCL benchmark.

![Required network bandwidth frontier](/research/ai-cluster-network/charts/chart-03-bandwidth-frontier.svg)

## When more bandwidth cannot solve the deadline

The same equation has a harder result.

If:

$$
T_{\text{budget}}
\le
2(n-1)\lambda
$$

then the denominator in the required-bandwidth expression is zero or negative.

Under this simplified ring model:

**no finite bandwidth satisfies the deadline.**

Consider a contrasting scenario:

- 256 ranks
- 1 MiB tensor
- 2 microseconds startup term
- 1.00 ms communication budget.

The latency floor alone is:

$$
2(256-1)(2\text{ microseconds})
=
1.02\text{ ms}
$$

The deadline is already lost before serialization time is added.

An 800 Gb/s link cannot fix this analytical problem.

Neither can 1.6 Tb/s.

The levers are different: reduce startup latency, reduce communication steps or group size, change algorithm/topology, improve placement, overlap work, or change the parallelism pattern.

This is why "how many Gb/s?" is not the first network-sizing question.

## Large messages and small messages live in different regions

In a one-transfer model:

$$
T
\approx
L+\frac{S}{B}
$$

Small `S` makes the latency term relatively important. Large `S` makes serialization more important.

For the analytical ring expression, set latency and bandwidth terms equal:

$$
2(n-1)\lambda
=
2\frac{n-1}{n}
\frac{S}{B}
$$

Then:

$$
S^*
=
n\lambda B
$$

For the 64-rank example at 80 GB/s effective bandwidth:

**S* = 10.24 MB decimal, or about 9.77 MiB.**

That is an analytical crossover, not a measured NCCL threshold.

It explains why one network can look generous for a 1 GiB AllReduce yet still struggle with a much smaller, tighter, frequent collective.

## AllGather, ReduceScatter and AlltoAll are different workload shapes

The same NCCL semantics let us build useful accounting cases without pretending every workload looks like AllReduce.

For an ideal ring-style AllGather where `S` means final gathered bytes:

$$
V_{\text{AG}}
=
\frac{n-1}{n}S
$$

A corresponding ReduceScatter uses the same idealized payload factor under the chosen full-tensor definition.

NCCL notes that ReduceScatter followed by AllGather is operation-semantically equivalent to AllReduce. That is not a claim that implementation and wire behavior are identical.

For a balanced AlltoAll payload case, if each rank begins with `D` bytes to dispatch:

$$
V_{\text{remote}}
\approx
D\frac{n-1}{n}
$$

But MoE traffic depends on routing, expert placement, imbalance and topology. We do not force ring timing onto AlltoAll.

This is also why parallelism choice matters. Current [Megatron Core tensor-parallel mappings](https://docs.nvidia.com/megatron-core/developer-guide/latest/api-guide/tensor_parallel.html) use collective operations such as all-reduce, all-gather, reduce-scatter and all-to-all in different mappings.

The company should model its actual collective trace rather than borrowing one universal bytes/token number.

## The 130 TB/s trap

### / CLAIM CHECK

**"GB300 NVL72 has 130 TB/s of NVLink, so external network bandwidth is no longer important."**

**WHAT IS TRUE**

The current rack-scale architecture gives 72 GPUs a very large NVLink scale-up domain. NVIDIA describes roughly 130 TB/s of aggregate NVLink bandwidth, and the reference architecture gives 900 GB/s one-way / 1,800 GB/s bidirectional per GPU inside that domain.

**WHAT IS MISSING**

Traffic leaving that domain.

Cross-rack tensor groups, data-parallel groups, expert groups, storage flows and larger training domains can still require scale-out Ethernet/RoCE or InfiniBand.

**SECOND / PASS**

Scale-up bandwidth and scale-out bandwidth solve different boundaries.

Good placement can keep some traffic on NVLink.

It cannot make scale-out traffic disappear by definition.

## Endpoint bandwidth is not fabric bandwidth

Suppose `G` endpoints each have line rate `B_e`.

The aggregate endpoint injection ceiling is:

$$
B_{\text{aggregate}}
=
GB_e
$$

That is the **sum of endpoint line rates**.

It is not automatically useful application throughput or fabric bisection bandwidth.

Now define at one simplified switching stage:

- `D` = downstream endpoint capacity;
- `U` = upstream capacity.

Oversubscription is:

$$
O
=
\frac{D}{U}
$$

`O=1` is nominally non-oversubscribed under this capacity definition.

`O>1` means downstream line-rate capacity exceeds the modeled upstream capacity.

It does **not** mean a 2:1 fabric makes every application run at half speed.

The traffic matrix decides how much of `D` wants to cross `U`.

![Fabric oversubscription scenario](/research/ai-cluster-network/charts/chart-04-fabric-oversubscription.svg)

Take a transparent scenario:

- 128 endpoints
- 800 Gb/s each
- downstream line-rate sum: 102.4 Tb/s
- modeled cross-section: 51.2 Tb/s
- oversubscription: 2:1
- 60% of endpoint line-rate demand crosses the cut.

Crossing demand is:

$$
102.4\times0.60
=
61.44\text{ Tb/s}
$$

The modeled cut is short by:

**10.24 Tb/s.**

Every endpoint can have an 800 Gb/s NIC while the traffic matrix still asks more from the fabric cross-section than it can carry.

This is not a measured Spectrum-X result. It is a capacity screen.

Current NVIDIA reference architectures use dual-plane, rail-optimized designs precisely to organize GPU-to-network paths at scale, but "rail-optimized" and "non-blocking" do not mean every application sees zero congestion.

## Communication can overlap compute

Communication time is not automatically exposed wall-clock loss.

Define overlap time:

$$
0
\le
T_{\text{overlap}}
\le
\min(
T_{\text{compute}},
T_{\text{comm}}
)
$$

Then:

$$
T_{\text{step}}
\approx
T_{\text{compute}}
+
T_{\text{comm}}
-
T_{\text{overlap}}
$$

and exposed communication is:

$$
T_{\text{exposed}}
=
T_{\text{comm}}
-
T_{\text{overlap}}
$$

Define exposed communication share:

$$
f_{\text{comm}}
=
\frac{
T_{\text{exposed}}
}{
T_{\text{step}}
}
$$

Overlap should come from measurement where possible. It is not a universal constant.

Also, "exposed communication" should not be casually renamed "GPU idle time." Communication kernels can use GPU and NIC resources and may perform useful reduction work.

The economic quantity we want is a normalized wall-clock capacity fraction.

## Turn the network gap into GPU-equivalent capacity

For `G` GPUs and exposed communication share `f_comm`:

$$
G_{\text{equiv,exposed}}
=
Gf_{\text{comm}}
$$

This is not literal powered-off hardware.

It means the same normalized wall-clock capacity fraction as that many completely unavailable GPUs.

At 1,024 GPUs:

- 1% → 10.24 GPU-equivalents
- 2% → 20.48
- 5% → **51.2**
- 10% → 102.4
- 20% → 204.8.

![Network exposure in GPU equivalents](/research/ai-cluster-network/charts/chart-05-gpu-network-exposure.svg)

This is where a small communication percentage becomes financially material.

We do not invent a universal GPU-hour price.

Let buyer-specific effective GPU cost be `C_g`.

Then:

$$
C_{\text{exposure/hour}}
=
GC_gf_{\text{comm}}
$$

If a network upgrade moves exposed share from `f_1` to `f_2`, recovered normalized capacity is:

$$
\Delta G
=
G(f_1-f_2)
$$

and recovered value per hour is:

$$
\Delta C
=
GC_g(f_1-f_2)
$$

The workbook leaves GPU and network prices as user inputs.

That makes the economic comparison honest: network capex versus accelerator capacity recovered under measured before/after communication exposure.

## What to calculate before buying the fabric

The procurement sequence is:

**1. Define the communication boundary.**  
Is the traffic local HBM, inside the NVLink domain, or leaving it?

**2. Record the parallelism and collective.**  
Data, tensor, pipeline and expert parallelism produce different traffic shapes.

**3. Count payload bytes per operation.**  
Use the actual tensor/message definition.

**4. Record operation frequency.**  
One collective and hundreds of collectives per step are different workloads.

**5. Give each critical operation a timing budget.**

**6. Estimate or measure the startup/latency floor.**

**7. Calculate required effective bandwidth from the time left for serialization.**

**8. Convert effective bandwidth to raw line rate only with an explicit efficiency assumption.**

**9. Check endpoint injection and fabric cross-section separately.**

**10. Measure overlap and convert only exposed communication into capacity exposure.**

**11. Benchmark the representative workload under the real topology and latency SLO before purchase.**

The network does not need one speed.

The workload needs a set of messages to arrive on time.

## The second pass

The useful unit for AI cluster networking is not "Gb/s per GPU" by itself.

It is:

**bytes + collective + communication steps + deadline + topology + overlap.**

An ideal ring AllReduce can move almost two tensor copies per rank without its per-rank payload growing linearly with cluster size. But the number of startup steps grows, which creates a latency floor.

That floor changes the purchasing question.

For the 64-rank, 1 GiB worked case, the model needs about 71.1 GB/s of effective payload bandwidth. Under the explicit 80% efficiency scenario, the raw requirement is roughly 711 Gb/s, so an 800 Gb/s endpoint is enough in that analytical case.

For the 256-rank small-message case, the 1.02 ms startup floor already exceeds the 1.00 ms communication budget. More link bandwidth cannot solve that modeled deadline.

Then the fabric has to pass the same test. Fast NICs do not prove enough bisection bandwidth.

Finally, convert whatever communication remains exposed after overlap into GPU-equivalent wall-clock capacity.

That is the economic second pass:

**buy enough network to meet the workload deadline—not enough network to win a link-rate comparison.**

---

## / INTELLIGENCE

Planning a multi-node or multi-rack AI cluster?

SECOND / PASS runs source-backed fabric-sizing research sprints that replace the public scenarios here with the buyer's actual collective traces, topology, message distribution, latency budget and measured effective bandwidth.

[START A RESEARCH BRIEF →](/intelligence)
