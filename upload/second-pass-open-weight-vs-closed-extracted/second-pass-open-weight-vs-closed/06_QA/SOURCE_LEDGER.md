# SOURCE LEDGER

All volatile facts were checked on **2026-08-10**.

| id | organization | document | URL | type | accessed_at | claims supported | limitations |
|---|---|---|---|---|---|---|---|
| S01 | Open Source Initiative | The Open Source AI Definition 1.0 | https://opensource.org/ai/open-source-ai-definition | primary | 2026-08-10 | OSI Open Source AI Definition and open-source/open-weight distinction. | Definition/standard, not law. |
| S02 | Mistral AI | Mistral Small 4 model card | https://docs.mistral.ai/models/model-cards/mistral-small-4-0-26-03 | primary | 2026-08-10 | Mistral Small 4 managed ID, 119B/6.5B active, 256k context, $0.15/$0.60 pricing and weights. | Provider list price; no self-host throughput or enterprise acceptance. |
| S03 | Mistral AI | Mistral Small 4 weights / model card | https://huggingface.co/mistralai/Mistral-Small-4-119B-2603 | primary | 2026-08-10 | Mistral Small 4 Apache 2.0 weights, architecture and vLLM guidance. | Provider model card; relative performance is a vendor claim. |
| S04 | Mistral AI | Mistral Small 4 NVFP4 weights / model card | https://huggingface.co/mistralai/Mistral-Small-4-119B-2603-NVFP4 | primary | 2026-08-10 | Mistral Small 4 NVFP4 checkpoint and TP2 vLLM reference recipe. | Reference serve recipe; not a throughput guarantee. |
| S05 | Mistral AI | Model Selection Guide | https://docs.mistral.ai/models/model-selection-guide?models=mistral-small-4-0-26-03 | primary | 2026-08-10 | Mistral model-selection facts including Apache 2.0, weights and GPU-RAM range. | GPU-RAM range does not establish a production SLO. |
| S06 | AWS | Amazon EC2 Capacity Blocks for ML Pricing | https://aws.amazon.com/ec2/capacityblocks/pricing/ | primary | 2026-08-10 | AWS Mumbai H100 Capacity Block prices. | Capacity Block reservation price, not on-demand/spot/ownership; excludes other costs. |
| S07 | OpenAI | gpt-oss-120b & gpt-oss-20b Model Card | https://deploymentsafety.openai.com/gpt-oss/paperbench | primary | 2026-08-10 | gpt-oss parameter counts, 60.8 GiB checkpoint and MXFP4 quantization. | Fit does not establish production capacity. |
| S08 | OpenAI | gpt-oss GitHub README | https://github.com/openai/gpt-oss/blob/main/README.md | primary | 2026-08-10 | gpt-oss Apache 2.0 and optimized/unoptimized deployment paths. | Reference implementations differ in optimization. |
| S09 | NVIDIA | H100 GPU | https://www.nvidia.com/en-us/data-center/h100/ | primary | 2026-08-10 | NVIDIA H100 advertised 80GB memory. | Headline specification; not application memory headroom. |
| S10 | OpenAI | GPT-5.6 Luna model page | https://developers.openai.com/api/docs/models/gpt-5.6-luna | primary | 2026-08-10 | GPT-5.6 Luna current $1/$6 standard pricing and context. | List price; tools/tier/long context may change total. |
| S11 | OpenAI | GPT-5.6 Sol model page | https://developers.openai.com/api/docs/models/gpt-5.6-sol | primary | 2026-08-10 | GPT-5.6 Sol current $5/$30 standard pricing and context. | List price; tools/tier/long context may change total. |
| S12 | Anthropic | What's new in Claude Sonnet 5 | https://platform.claude.com/docs/en/about-claude/models/whats-new-sonnet-5 | primary | 2026-08-10 | Claude Sonnet 5 $2/$10 through Aug 31; $3/$15 from Sep 1; context. | Introductory price is temporary and date-qualified. |
| S13 | Google | Gemini Developer API pricing | https://ai.google.dev/gemini-api/docs/pricing | primary | 2026-08-10 | Gemini 3.5 Flash-Lite current $0.30/$2.50 and output-accounting rule. | List price; quality/tokenization differ from other models. |
| S14 | OpenAI | Introducing gpt-oss | https://openai.com/index/introducing-gpt-oss/ | primary | 2026-08-10 | gpt-oss architecture overview and 128k context. | Provider technical description; no enterprise quality claim. |
| S15 | OpenAI | gpt-oss-120b config.json | https://huggingface.co/openai/gpt-oss-120b/blob/main/config.json | primary | 2026-08-10 | gpt-oss config: layers, heads, KV heads, positions and alternating attention. | Architecture config; generic KV formula not directly applied. |
| S16 | Apache Software Foundation | Apache License 2.0 | https://www.apache.org/licenses/LICENSE-2.0 | primary | 2026-08-10 | Apache License 2.0 text. | License text; no legal advice. |
