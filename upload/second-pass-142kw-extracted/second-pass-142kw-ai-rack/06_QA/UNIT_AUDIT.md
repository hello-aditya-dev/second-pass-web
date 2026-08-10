# UNIT AUDIT

Final unit review: **PASS**

| quantity | source/input | calculation/output | status |
|---|---|---|---|
| rack power | 142 kW | retained as kW | PASS |
| facility power | 1 / 4 / 10 MW | ×1000 only when converting to kW for rack division | PASS |
| energy | 142 kW × 730 h | 103,660 kWh = 103.660 MWh | PASS |
| Btu heat-flow | NIST 0.2930711 W per Btu_IT/h | 484,524 Btu_IT/h | PASS |
| refrigeration tons | NIST 3516.853 W/ton | 40.38 tons | PASS |
| racks | continuous quotient | floor() for deployable racks | PASS |
| GPUs | 72/rack | integer racks ×72 | PASS |

## Mandatory checks

- `MW` is never substituted for `MWh`: PASS.
- `kW` rack load is power, not monthly energy: PASS.
- thermal kW is labeled thermal load, not cooling electrical kW: PASS.
- GPU/MW continuous metric is distinguished from whole-rack GPUs: PASS.
- 1.97 kW/GPU is labeled rack electrical allocation, not GPU TDP: PASS.
