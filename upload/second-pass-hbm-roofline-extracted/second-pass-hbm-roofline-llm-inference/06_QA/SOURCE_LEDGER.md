# SOURCE LEDGER

Access/factual snapshot: **2026-08-10**.

| source_id | organization | document | URL | type | accessed_at | claims supported | limitations |
|---|---|---|---|---|---|---|---|
| S01 | NVIDIA | NVIDIA HGX Platform | https://www.nvidia.com/en-in/data-center/hgx/ | primary | 2026-08-10 | HGX B300 system compute peaks and dense/sparse footnotes | B300 BF16 per-GPU-equivalent value is derived from 8-GPU system spec. |
| S02 | NVIDIA | HGX AI Factory — Components | https://docs.nvidia.com/enterprise-reference-architectures/hgx-ai-factory/latest/components.html | primary | 2026-08-10 | B300 288 GB HBM3e per GPU and up to 8 TB/s per GPU | Peak bandwidth, not sustained workload bandwidth. |
| S03 | AMD | AMD Instinct MI355X | https://www.amd.com/en/products/accelerators/instinct/mi350/mi355x.html | primary | 2026-08-10 | MI355X dense/sparse BF16, OCP-FP8, MXFP4, 288 GB HBM3E, 8 TB/s | Vendor peak ceilings. |
| S04 | Berkeley Lab | The Roofline Model: Visualizing and Optimizing Performance | https://amcr.lbl.gov/departments/computer-science-department/ppan/roofline-performance-model/ | primary institutional | 2026-08-10 | Arithmetic intensity and Roofline interpretation | Classic model is defined for workload/kernel and memory boundary. |
| S05 | Berkeley Lab | Roofline Publications | https://amcr.lbl.gov/departments/computer-science-department/ppan/roofline-performance-model/ppan-roofline-publications/ | primary institutional | 2026-08-10 | Original 2009 Williams/Waterman/Patterson paper identification | Bibliographic page; equations are standard Roofline derivation. |
| S06 | Qwen | Qwen2.5-72B-Instruct model card | https://huggingface.co/Qwen/Qwen2.5-72B-Instruct | primary publisher repo | 2026-08-10 | 72.7B total; 70B non-embedding; 80 layers; 64Q/8KV; 131072 context | Model case only; no benchmark number used. |
| S07 | Qwen | Qwen2.5-72B-Instruct config | https://huggingface.co/Qwen/Qwen2.5-72B-Instruct/blob/main/config.json | primary publisher repo | 2026-08-10 | hidden size 8192; architecture config | Repository config can evolve. |
