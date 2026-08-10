# Chart Specifications

Visual system: Paper `#F2EFE7`, Ink `#11110F`, Graphite `#5A5953`, Rule `#C9C3B7`, Signal Blue `#2F5BFF`.

## 01 — Four deployment policies
- **decision question:** What choices actually exist beyond “open vs closed”?
- **type:** structural diagram
- **data:** `data/chart-01-deployment-policies.csv`
- **takeaway:** weight access and infrastructure ownership are separate decisions.
- **caveat:** structural facts only; no quality or preference scoring.
- **alt text:** Four boxes compare closed managed API, managed open weight, self-hosted open weight and hybrid/router by weight access, infrastructure operator and economic shape.
- **mobile:** stack vertically below 768px.

## 02 — Same-model deployment break-even
- **decision question:** At what illustrative volume does rented self-host capacity equal Mistral Small 4 managed API cost?
- **type:** cost curves
- **x:** tasks/month, log scale
- **y:** USD/month
- **data:** `data/chart-02-same-model-break-even.csv`
- **observed:** Mistral API prices; AWS Capacity Block price.
- **scenario:** 10k input + 1k output/task; 730 hours/month; engineering/network/storage omitted from deployment-only line.
- **takeaway:** price-only break-even ≈ `13.13M` tasks/month.
- **critical caveat:** price boundary, not proof the 8×H100 node can serve that load under the target SLO.
- **alt text:** Managed Mistral cost rises with volume and crosses a horizontal $27,564.80 monthly self-host capacity line at about 13.13 million tasks.
- **mobile:** full-width SVG.

## 03 — Quality-adjusted decision boundary
- **decision question:** How does acceptance quality move or remove break-even?
- **type:** log-scale boundary curve
- **x:** self-host/managed acceptance-quality ratio
- **y:** break-even tasks/month
- **data:** `data/chart-03-quality-adjusted-frontier.csv`
- **scenario:** F=$27,564.80/mo; managed v=$0.0021/task; self-host remaining variable v=$0.0010/task.
- **no-finite region:** `r_q <= 0.476`.
- **takeaway:** when `r_q v_c-v_o` approaches zero, required volume rises sharply; at or below zero there is no finite break-even.
- **caveat:** acceptance ratios and $0.0010 variable cost are sensitivity inputs, not measurements.
- **alt text:** Boundary curve rises sharply as self-host acceptance falls, with a shaded no-finite-break-even region at low quality ratios.
- **mobile:** keep scenario caption visible.

## 04 — Utilization trap
- **decision question:** How does unused capacity alter fixed cost per useful unit?
- **type:** normalized bars
- **data:** `data/chart-04-utilization-trap.csv`
- **takeaway:** relative to 80%, 40% utilization doubles and 20% quadruples fixed cost per useful capacity unit, all else equal.
- **caveat:** simplified fixed-capacity relationship; real serving economics need not be linear across every regime.
- **alt text:** Bars show 4× at 20%, 2× at 40%, 1.33× at 60%, 1× at 80%, and 0.8× at 100%.
- **mobile:** full-width.

## 05 — Memory / KV headroom
- **decision question:** Why does “fits on one GPU” not establish production capacity?
- **type:** technical schematic
- **data:** `data/chart-05-memory-headroom.csv`
- **facts:** gpt-oss-120b checkpoint 60.8 GiB; OpenAI says optimized MXFP4 can fit on one 80GB GPU; H100 advertised 80GB HBM.
- **unknowns:** KV, runtime/workspace, fragmentation, production margin.
- **caveat:** diagram avoids subtracting mixed GB/GiB and does not force a conventional full-context KV formula onto alternating attention.
- **alt text:** Checkpoint and H100 memory facts point to separate unknown blocks for KV cache, runtime/workspace and production margin.
- **mobile:** stack fact boxes above headroom boxes.
