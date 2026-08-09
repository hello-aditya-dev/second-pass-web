# Data Dictionary — AI Inference Price Surface v0.1

| Field | Type | Unit | Meaning |
|---|---|---:|---|
| dataset_version | string | — | Snapshot version. |
| generated_at | ISO-8601 | — | Package generation time. |
| provider | string | — | API/model provider. |
| model | string | — | Provider model identifier/name. |
| service_tier | enum-like string | — | Standard, Batch, etc. |
| context_band | string | — | Pricing band represented by the row. |
| context_threshold | string | tokens | Provider threshold or scope for that band. |
| input_usd_per_mtok | number | USD / 1M tokens | Uncached input list price. |
| cached_input_usd_per_mtok | number/blank | USD / 1M tokens | Cached input or cache-hit price. |
| cache_write_5m_usd_per_mtok | number/blank | USD / 1M tokens | Five-minute cache-write price when separately exposed. |
| cache_write_1h_usd_per_mtok | number/blank | USD / 1M tokens | One-hour cache-write price when separately exposed. |
| cache_storage_usd_per_mtok_hour | number/blank | USD / 1M token-hours | Cache storage charge where published. |
| output_usd_per_mtok | number | USD / 1M tokens | Output list price. Provider accounting of reasoning/thinking tokens may differ. |
| batch | boolean | — | Whether the row is asynchronous Batch pricing. |
| open_weight | boolean | — | Whether weights are publicly available under the referenced model's license. |
| max_context_tokens | number/blank | tokens | Documented maximum context where included. |
| effective_from | date/blank | — | Known price effective date. |
| effective_to | date/blank | — | Known end date. |
| source_id | string | — | Source ledger key(s). |
| source_accessed_at | date | — | Date the source was checked. |
| notes | string | — | Configuration caveats. |

## Comparison rules

1. Do not assume identical token counts for identical text across providers.
2. Do not join a quality observation to a price row unless model version and relevant configuration match.
3. Keep Batch and synchronous rows distinct.
4. Keep long-context and short-context rows distinct when the provider does.
5. Preserve temporary/future price effective dates.
6. Do not treat public list price as negotiated enterprise price.
