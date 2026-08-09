/**
 * DEMO accelerator/GPU fixtures.
 * All entries are explicitly marked as demo/test data.
 */

import type { AcceleratorEntry } from "@/data/schema";
import { demoProvenance } from "@/data/schema";

export const DEMO_ACCELERATORS: AcceleratorEntry[] = [
  {
    id: "demo-nvidia-h100",
    name: "H100 SXM",
    vendor: "NVIDIA",
    architecture: "Hopper",
    memoryGb: 80,
    memoryBandwidthGbs: 3352,
    tflopsFp16: 989,
    tflopsFp8: 1979,
    tdp: 700,
    launchDate: "2022-09-20",
    provenance: demoProvenance({
      sourceUrl: "https://www.nvidia.com/en-us/datacenter/h100/",
      sourceTitle: "DEMO — NVIDIA H100 spec page (not verified)",
      effectiveDate: "2022-09-20"
    })
  },
  {
    id: "demo-nvidia-b200",
    name: "B200",
    vendor: "NVIDIA",
    architecture: "Blackwell",
    memoryGb: 192,
    memoryBandwidthGbs: 8000,
    tflopsFp16: 2250,
    tflopsFp8: 4500,
    tdp: 1000,
    launchDate: "2024-03-18",
    provenance: demoProvenance({
      sourceUrl: "https://www.nvidia.com/en-us/datacenter/b200/",
      sourceTitle: "DEMO — NVIDIA B200 spec page (not verified)",
      effectiveDate: "2024-03-18"
    })
  }
];
