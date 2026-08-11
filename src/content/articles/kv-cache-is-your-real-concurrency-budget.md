---
title: "KV cache is your real concurrency budget"
dek: "The weights tell you whether a model can load. For conventional full-attention serving, the KV cache often decides how many active sequences can stay resident after it does."
slug: "kv-cache-is-your-real-concurrency-budget"
section: "Systems"
format: "PROOF"
author: "Aditya"
status: "published"
publishedAt: "2026-08-10"
firstPass:
  - "For a conventional full-attention transformer, logical KV bytes per token are 2 × layers × KV heads × head dimension × bytes per KV element."
  - "Qwen2.5-72B-Instruct works out to 327,680 bytes, or 320 KiB, of full-model logical BF16 KV per active token."
  - "With a fixed KV budget, ideal KV-limited concurrency falls approximately as 1 / reserved sequence length: double the active context, roughly halve the slots."
  - "Block rounding, future output growth, cache policy and hybrid layouts move real capacity below or away from the simple ideal model."
  - "When the runtime reports group-aware KV token capacity, use that operational number; use the architecture equation to explain and stress-test it."
featured: false
featuredRank: 0
editorialOrder: 1
demo: false
hero: "/research/kv-cache-concurrency/charts/chart-03-concurrency-frontier.svg"
heroAlt: "Concurrency frontier showing how a fixed KV cache budget supports fewer concurrent sequences as reserved context grows."
adPolicy: "none"
sources:
  - label: "Qwen2.5-72B-Instruct model card"
    url: "https://huggingface.co/Qwen/Qwen2.5-72B-Instruct"
    type: "primary"
  - label: "Qwen2.5-72B-Instruct config.json"
    url: "https://huggingface.co/Qwen/Qwen2.5-72B-Instruct/blob/main/config.json"
    type: "primary"
  - label: "vLLM parallelism and scaling"
    url: "https://docs.vllm.ai/en/stable/serving/parallelism_scaling/"
    type: "primary"
  - label: "vLLM cache configuration"
    url: "https://docs.vllm.ai/en/stable/api/vllm/config/cache/"
    type: "primary"
  - label: "TensorRT-LLM KV cache"
    url: "https://nvidia.github.io/TensorRT-LLM/latest/features/kvcache.html"
    type: "primary"
changeLog:
  - at: "2026-08-10"
    type: "published"
    note: "Initial publication."
seoTitle: "KV cache is your real concurrency budget"
seoDescription: "A quantitative model for KV bytes per token, context memory, block rounding, output reserve, GQA, KV precision, prefix reuse and offload in LLM serving."
---

The model loads. The first request works. The tenth works. Then a longer prompt arrives, decoding continues, another batch joins, and the serving engine starts preempting work or refusing more sequences.

Nothing changed about the model weights.

What changed was the amount of **active sequence state** the server had to keep. For a conventional decoder-only transformer with full attention, much of that state is the key-value cache, or KV cache. Every cached token contributes keys and values at every attention layer. As active token counts grow, that memory grows with them.

That makes a useful distinction:

**Weight memory answers whether the model can reside. KV capacity helps answer how many active tokens can reside with it.**

The distinction is not universal. Sliding-window attention, hybrid attention/state-space models, Mamba-style state, multi-head latent attention and other compressed or nonstandard caches require different accounting. But for a standard full-attention transformer, the arithmetic is direct enough to turn into a capacity model.

This proof uses Qwen2.5-72B-Instruct as a teaching case because its current official configuration exposes the needed architecture fields cleanly. It is not a benchmark. The memory budgets below are scenarios unless a runtime reports them.

## Start with the memory that is actually left

A GPU serving process does not have one bucket called "model memory." Conceptually:

$$
M_{GPU}=M_{weights}+M_{KV}+M_{activations}+M_{workspace}+M_{runtime}+M_{communication}+M_{margin}.
$$

The useful capacity input is therefore not "GPU memory minus checkpoint size." It is the amount the running system can actually make available to KV:

$$
M_{KV,budget}=M_{GPU,usable}-M_{non-KV}.
$$

That subtraction is why model fit is not serving fit. A checkpoint can fit while leaving too little room for a useful batch, long contexts, workspaces or reliability headroom.

Current runtimes make this distinction operational. [vLLM can infer or explicitly accept KV-cache memory](https://docs.vllm.ai/en/stable/configuration/engine_args/), and after initialization it exposes a KV-cache token capacity and a maximum-concurrency estimate. Its current cache configuration also has a group-aware `kv_cache_size_tokens`, specifically because `num_gpu_blocks × block_size` can be wrong for hybrid models. [TensorRT-LLM](https://nvidia.github.io/TensorRT-LLM/latest/features/kvcache.html) similarly allocates a paged KV cache from free GPU memory and can cap it by a configured maximum token count.

So there are three different quantities to keep separate:

- **architecture logical KV** — what the model structure implies per token;
- **runtime allocated KV** — what the engine physically reserves and manages;
- **runtime-reported token capacity** — what that allocation can actually hold under the engine's current layout.

The first explains the mechanism. The last is usually the better operational input.


![Equation-style memory budget diagram showing usable memory minus non-KV allocations equals KV budget, with an 80 GiB worked scenario.](/research/kv-cache-concurrency/charts/chart-01-gpu-memory-budget.svg)

## / CALCULATION — how many bytes does one token require?

For a conventional transformer with <imath>L</imath> attention layers, <imath>n_{kv}</imath> key-value heads, head dimension <imath>d_h</imath>, and <imath>b_{kv}</imath> bytes per stored KV element, each cached token stores a key and a value at each layer:

$$
\boxed{m_{KV/token}=2L n_{kv} d_h b_{kv}}
$$

The factor of two is simply **K + V**.

![Five-factor equation ending at 320 KiB of logical BF16 KV per token.](/research/kv-cache-concurrency/charts/chart-02-kv-bytes-per-token.svg)

Qwen's current Qwen2.5-72B-Instruct configuration reports 80 layers, hidden size 8192, 64 query heads, 8 KV heads, BF16 weights, and `use_sliding_window: false`. The head dimension is 8192 / 64 = 128. The [official model card](https://huggingface.co/Qwen/Qwen2.5-72B-Instruct) also identifies the model as GQA with 64 query heads and 8 KV heads.

For BF16 KV, using two bytes per element:

$$
2\times80\times8\times128\times2=327{,}680\text{ bytes/token}.
$$

That is exactly:

**320 KiB per active token**

or:

**0.3125 MiB per active token.**

This is a **full-model logical KV figure**. It is not "per GPU," and it should not be blindly divided by tensor-parallel degree. KV heads can be sharded or replicated depending on model and runtime. For a real multi-GPU deployment, use the runtime's per-rank or per-engine capacity reporting.

The arithmetic still tells us something important about architecture. Qwen has eight KV heads for 64 query heads. If the otherwise identical model used 64 KV heads as standard multi-head attention, the logical KV payload would be eight times larger. That is one reason grouped-query attention is not only an attention-kernel choice; it is also a cache-capacity choice. The original [GQA paper](https://arxiv.org/abs/2305.13245) defines GQA as the intermediate design between MHA's per-query KV heads and MQA's single KV head.

## / CALCULATION — one active sequence

For a sequence with <imath>S</imath> cached tokens:

$$
M_{KV,seq}=S\,m_{KV/token}.
$$

For the Qwen teaching case, the numbers become unusually clean:

| Active cached tokens | Logical BF16 KV |
|---:|---:|
| 8,192 | 2.5 GiB |
| 32,768 | 10 GiB |
| 131,072 | 40 GiB |

The 131,072-token row needs an important deployment note. Qwen advertises full 131,072-token context, but its current `config.json` sets `max_position_embeddings` to 32,768. The model card says contexts beyond 32,768 require YaRN configuration and warns that static YaRN can affect shorter-text performance. So 131,072 is a valid long-context capacity case only with the corresponding long-context configuration; it is not the default config's automatic limit.

The memory law itself is linear for this conventional full-attention case: twice the active cached tokens means twice the logical KV bytes.

## / CALCULATION — concurrency is a token budget

For multiple independent sequences with active lengths <imath>S_i</imath>:

$$
M_{KV,total}=m_{KV/token}\sum_i S_i.
$$

That is more useful than multiplying every request by the model's maximum context. Real traffic is heterogeneous.

For a fixed-length teaching case, the ideal maximum is:

$$
\boxed{N_{max}\approx\left\lfloor\frac{M_{KV,budget}}{S\,m_{KV/token}}\right\rfloor}
$$

Now define an **80 GiB aggregate KV-budget scenario** for the serving instance after non-KV allocations. This is not a measured H100, B200 or B300 deployment. It is a round scenario chosen so the capacity relationship is visible.

At 320 KiB/token, 80 GiB holds an ideal logical total of:

**262,144 cached tokens.**

That gives:

| Reserved tokens / sequence | Ideal BF16 GQA concurrency |
|---:|---:|
| 4,096 | 64 |
| 8,192 | 32 |
| 16,384 | 16 |
| 32,768 | 8 |
| 65,536 | 4 |
| 131,072 | 2 |

This is the reciprocal context law:

$$
N_{max}\propto\frac{1}{S}.
$$

Double reserved context and, while KV is the binding capacity resource, ideal concurrency roughly halves.

It does **not** mean throughput halves. Tokens per second can bind on compute, HBM bandwidth, batching, scheduler policy and SLOs. This is a memory-capacity relationship.

Another way to use the equation is as a boundary. In the same 80 GiB scenario, if the platform must hold at least 16 concurrent sequences, the BF16-GQA cache frontier is 16,384 reserved tokens per sequence. For eight sequences it is 32,768. For four it is 65,536. The "binding context length" is therefore not a single model property; it depends on the concurrency target and the real KV budget.


![Three curves fall as context grows; BF16 GQA goes from 64 slots at 4K to 2 at 128K.](/research/kv-cache-concurrency/charts/chart-03-concurrency-frontier.svg)

## Max context is the wrong everyday sizing input

A model's maximum context is a compatibility ceiling, not a description of production traffic.

Sizing every request at maximum context can waste large amounts of theoretical capacity. Sizing only from the mean can be unsafe when the tail is heavy.

Consider two mathematical traffic scenarios, both with a mean active length of 8,192 tokens:

- **Scenario A, bounded:** 20% each at 4,096, 6,144, 8,192, 10,240 and 12,288 tokens.
- **Scenario B, heavy-tail:** 40% at 4,096, 50% at 8,192 and 10% at 24,576 tokens.

Both average 8,192. Both therefore look like "32 requests" if you divide the 262,144-token cache by the mean. But their p95 lengths differ: 12,288 versus 24,576. A p95 fixed-reserve policy would imply about 21 versus 10 sequences.

That does not prove either distribution is globally representative. It proves that **the mean throws away the shape of the demand**. Capacity planning should ingest the actual prompt-plus-active-output distribution, and the admission policy should state whether it targets a mean, percentile, or worst case.

## Output is future KV, not just future text

KV grows during decode. If request <imath>i</imath> currently has <imath>S_i</imath> cached tokens and policy reserves <imath>R_i</imath> additional output tokens, a safer planning length is:

$$
S_{i,reserve}=S_i+R_i.
$$

Then:

$$
M_{reserve}=m_{KV/token}\sum_i(S_i+R_i).
$$

In the 80 GiB Qwen scenario, 8,192 current tokens fit 32 ideal sequences. Add a 2,048-token output reserve and each request becomes a 10,240-token reservation, or 3.125 GiB of logical KV. Ideal concurrency falls to **25**.

At 32,768 current tokens, the same 2,048 reserve moves the sequence to 34,816 tokens and drops ideal concurrency from eight to **seven**. At 131,072 current tokens, it drops the two-sequence ideal to **one**.

A real engine does not have to reserve the absolute maximum output for every request. An operator can use p95 or p99 output growth, a watermark, or another admission policy. The important part is to label whether the policy is guaranteed worst case or probabilistic.

## Paging fixes allocation, not arithmetic

Paged KV managers avoid allocating every sequence as one giant contiguous buffer. That was the core systems idea behind [PagedAttention](https://arxiv.org/abs/2309.06180): split KV state into blocks so memory can be allocated as sequences grow, reducing fragmentation and enabling sharing.

But blocks still round.


![Horizontal bars show used tokens and small tail-block waste for five requests.](/research/kv-cache-concurrency/charts/chart-04-block-rounding.svg)

If a simplified uniform cache uses <imath>B</imath> tokens per block, a request with <imath>S_i</imath> reserved tokens consumes:

$$
S_{i,alloc}=B\left\lceil\frac{S_i}{B}\right\rceil.
$$

The tail waste is:

$$
W_{tokens}=\sum_i\left[B\left\lceil\frac{S_i}{B}\right\rceil-S_i\right].
$$

For a 16-token block scenario and request lengths 1,001; 2,047; 4,097; 8,191; and 12,003, the block-rounded allocation is 27,376 tokens for 27,339 used tokens. The tail loss is 37 tokens, about **0.135%** of those active tokens, or **11.5625 MiB** in the Qwen BF16 logical model.

That is small in this particular case. It is also not "all runtime fragmentation." Current engines can have multiple cache groups, different page layouts and other internal constraints. vLLM's current hybrid cache manager explicitly groups cache types and reports a group-aware token capacity. TensorRT-LLM can create separate pools for different attention-window/head combinations. The simple rounding equation is useful for tail allocation; the runtime remains authoritative for the complete physical layout.

## GQA moves the frontier before you buy more memory

Hold layers, head dimension and element size constant. Standard MHA stores KV for every query head; GQA stores fewer KV heads.

The ideal memory ratio is:

$$
\frac{M_{KV,GQA}}{M_{KV,MHA}}=\frac{n_{kv}}{n_q}.
$$

For the Qwen dimensions, 8 KV heads versus 64 query heads gives an **8×** ideal reduction relative to the hypothetical same-dimension MHA case.

That means the 320 KiB/token Qwen GQA case would become 2.5 MiB/token if all 64 heads had their own K and V. In the 80 GiB scenario, an 8,192-token sequence would consume 20 GiB instead of 2.5 GiB, leaving four ideal slots instead of 32.

This is architecture sensitivity, not a claim that you can convert one trained model into another with no quality or kernel consequences.

## Lower KV precision moves it again

Current vLLM exposes multiple KV cache dtypes, including BF16/FP16 and FP8 variants. SGLang likewise exposes FP8 E4M3 and E5M2 KV-cache modes. Where one byte per element is valid and supported, the ideal payload term halves:

$$
320\text{ KiB/token}\rightarrow160\text{ KiB/token}.
$$

In the same 80 GiB scenario, the ideal 8,192-token concurrency moves from 32 to 64; 32,768 moves from eight to 16; and 131,072 moves from two to four.

That is a capacity result, not a throughput result. Scales, metadata, kernel support and accuracy behavior still matter. If KV memory was not the binding resource, halving its payload may not increase admitted concurrency at all.

## / CLAIM CHECK — "FP8 KV doubles serving throughput."

**CLAIM**

FP8 approximately halves the ideal KV payload under the one-byte assumption.

**SECOND / PASS**

Not necessarily. Throughput moves only if the removed KV capacity constraint was actually limiting the system and the rest of the serving path can use the extra concurrency.

## Prefix reuse changes physical tokens, not logical request length

Two requests can be logically 6,000 tokens each while sharing physical cache blocks for the same 4,000-token prefix.

Current [TensorRT-LLM documentation](https://nvidia.github.io/TensorRT-LLM/latest/features/kvcache.html) is explicit: matched prefix blocks can be reused by multiple requests, saving memory as well as computation. vLLM's current prefix-cache manager also reference-counts blocks so a block is not freed while another request uses it.

A simple block-aligned scenario makes the capacity effect visible. Suppose 16 requests each have a 4,096-token shared prefix and 2,048 unique tokens.

Without physical sharing:

$$
16(4096+2048)=98{,}304\text{ physical token slots}.
$$

With one shared prefix plus 16 unique suffixes:

$$
4096+16(2048)=36{,}864\text{ token slots}.
$$

That is a **62.5% reduction** in physical token slots for this synthetic prefix-sharing pattern. At 320 KiB/token it is 30 GiB without sharing versus 11.25 GiB with sharing.

Prefix caching is not free memory. Cached blocks remain residents until eviction, and savings depend on hit rate, alignment, reuse timing and engine semantics. The value is that identical state need not always be duplicated.

## Offload buys a larger reservoir and creates a movement deadline

KV cache no longer has to live only in GPU HBM. vLLM now supports KV offloading buffers, TensorRT-LLM supports a host cache, NVIDIA Dynamo's KVBM manages KV blocks across heterogeneous tiers, and SGLang's HiCache extends KV storage from GPU to host and distributed storage.

Capacity therefore becomes a hierarchy problem.

If <imath>M_{recall}</imath> bytes must be brought back over a path with effective bandwidth <imath>B_{offload}</imath> and latency <imath>L_{offload}</imath>, a simple lower bound is:

$$
T_{recall}\gtrsim L_{offload}+\frac{M_{recall}}{B_{offload}}.
$$

For a labeled scenario — 4 GiB recalled, 64 GB/s effective bandwidth, 0.05 ms latency — the lower bound is about **67.16 ms**. If recall must finish within 50 ms, the required effective bandwidth is about **85.99 GB/s**.

That is the same systems lesson in another form: extra memory capacity is useful only if the movement path can satisfy the timing budget when data becomes hot again.

## The distribution is part of the memory budget

A single "average context length" is not enough to set an admission limit. Two workloads can average the same 8,192 tokens and carry very different tail risk. In the scenario dataset for this package, a bounded five-point workload and a heavy-tailed workload both average 8,192 tokens. The bounded case has a p95 of 12,288 tokens; the heavy-tailed case has a p95 of 24,576. If an operator sized every admitted sequence to the p95 under the same 80 GiB logical budget, those cases imply 21 versus 10 ideal BF16 GQA slots.

That does not make p95 reservation the universally correct scheduler policy. It shows why the policy must be explicit. A guaranteed reservation can protect against growth but strand cache when requests finish short. A looser probabilistic policy can admit more work but accepts a higher probability of preemption, rejection, or pressure when the tail arrives. The right input is therefore not "the model supports 128K" or even "our mean prompt is 8K." It is the joint distribution of prompt tokens, generated tokens, reuse, and the runtime's actual admission behavior.

This is also where safe concurrency separates from theoretical maximum concurrency. The mathematical frontier tells you where the cache fills under stated assumptions. An operational limit can sit below it because the serving team reserves future output blocks, maintains a memory watermark, or protects an SLO. Those margins are policy or runtime configuration, not constants of transformer architecture.

## What an inference team should measure

The analytical equation is the beginning of the capacity review, not the final deployment number.

For a real serving system, collect:

1. model architecture and cache type;
2. runtime and version;
3. runtime-reported KV bytes or token capacity;
4. block/page size and cache grouping;
5. prompt-length distribution;
6. active decode-length distribution;
7. output-reserve policy;
8. prefix-hit and reuse traces;
9. preemption/OOM events;
10. TP/PP configuration and per-rank cache reporting;
11. cache dtype;
12. offload tier, recall size, bandwidth and latency.

Then ask one concrete question:

**How many reserved active tokens can this engine hold under the SLO we actually operate?**

If the runtime prints a group-aware token capacity, start there. For example, vLLM's current serving documentation describes startup log lines for `GPU KV cache size` and `Maximum concurrency`, with the former representing total tokens the GPU KV cache can hold at once. That is more useful for operations than pretending a generic formula knows every physical allocation detail.

The formula remains valuable because it lets you explain why capacity moved. Fewer KV heads? Lower bytes per element? Longer contexts? More output reserve? Block rounding? Shared prefixes? Offload? Each change has a different mechanism.

## / CLAIM CHECK — "The model fits in GPU memory, so the server can handle long context."

**CLAIM**

Weight fit only proves model state can reside under some placement.

**SECOND / PASS**

Incomplete. It does not prove that the remaining memory can sustain the active KV state, workspace, runtime allocations and operating margin needed for the target concurrency.

## / CLAIM CHECK — "A 128K context model uses 128K worth of KV memory all the time."

**CLAIM**

KV follows active cached tokens. A short request does not automatically occupy the entire maximum context.

**SECOND / PASS**

No. Capacity planning may reserve future output or other headroom, but that is a policy decision and should be modeled as one.

![Three columns show 8K, 32K and 128K contexts increasing KV per sequence from 2.5 to 40 GiB and reducing ideal slots from 32 to 2.](/research/kv-cache-concurrency/charts/chart-05-model-fit-vs-serving-fit.svg)

## SECOND PASS

The important unit in LLM serving is not only **GB of GPU memory**. It is **cached tokens under a deadline and an admission policy**.

For the Qwen2.5-72B teaching case, one BF16 cached token carries 320 KiB of full-model logical KV. Under an 80 GiB scenario budget, that means 262,144 ideal active tokens. You can spend those tokens on 32 sequences at 8K, eight at 32K, or two at 128K before output reserve and runtime corrections.

That turns context length from a feature-box number into a capacity trade.

GQA moves the curve by reducing the number of KV heads. Lower KV precision moves it by reducing bytes per element. Prefix reuse can reduce duplicated physical state. Paging reduces allocation waste. Offload expands the storage hierarchy but introduces a recall path. None of them should be described as "more throughput" until the platform proves that KV capacity was the binding constraint.

The practical rule is simple:

**Count the bytes per token. Count the active or reserved tokens. Then trust the runtime when it tells you how many of those tokens its real cache can hold.**

## / INTELLIGENCE

Running long-context or high-concurrency inference?

SECOND / PASS can apply this capacity model to your model architecture, runtime configuration and real sequence-length distribution.

[START A RESEARCH BRIEF →](/intelligence)
