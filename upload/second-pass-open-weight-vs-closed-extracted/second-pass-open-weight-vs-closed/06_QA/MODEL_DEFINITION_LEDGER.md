# MODEL DEFINITION LEDGER

| term | working definition | source | scope | caveat |
|---|---|---|---|---|
| Open-weight model | SECOND / PASS term for a model whose trained weights are available to the customer under a stated license for self-deployment or adaptation. | Provider model/license pages | Deployment analysis | Weight availability alone does not establish that the full AI system meets the OSI Open Source AI Definition. |
| Open Source AI | OSI Definition 1.0: an AI system made available in a way that grants freedoms to use, study, modify and share, with access to the preferred form for modification; for ML systems the definition addresses data information, code and parameters. | S01 | Terminology | Definition/standard; not legal advice. |
| Closed managed model | Weights unavailable to the customer; provider operates inference infrastructure. | SECOND / PASS analytical definition | Deployment policy | Private/hosted variants can change the boundary. |
| Managed open-weight inference | Weights are available under a license, but inference infrastructure is operated by a model vendor or third party. | SECOND / PASS analytical definition | Deployment policy | Portability/customization depend on provider and license. |
| Self-hosted open weight | Customer operates the serving stack on rented or owned compute using available weights. | SECOND / PASS analytical definition | Deployment policy | Self-hosted does not imply secure, cheap or on-premises. |
| Hybrid / router | Workload classes are assigned to more than one deployment policy. | SECOND / PASS analytical definition | Deployment policy | Fixed self-host capacity can remain even when only part of traffic is local. |
