# Data Foundation

Do not add a database today. Build versionable, typed, source-backed data files that can later move behind a cached API.

Recommended:
`src/data/schema/`
`src/data/models/`
`src/data/accelerators/`
`src/data/gpu-clouds/`
`src/data/pricing/`
`src/data/benchmarks/`
`src/data/providers/`

Every public observation must support provenance:
source URL/title/type, effective date where relevant, observedAt, lastVerifiedAt, conditions and notes.

Benchmark records preserve workload, hardware, software/runtime, precision, batch/concurrency, metric, result, operator, date and methodology.

Fixtures used for UX tests must be explicitly DEMO/TEST and must not become current-data claims.

Keep schemas vendor-neutral so a later DB/API migration does not change public meaning.
