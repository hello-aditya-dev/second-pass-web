/**
 * DEMO cloud provider fixtures.
 */

import type { CloudProvider } from "@/data/schema";
import { demoProvenance } from "@/data/schema";

export const DEMO_PROVIDERS: CloudProvider[] = [
  {
    id: "demo-aws",
    name: "AWS",
    regions: ["us-east-1", "us-west-2", "eu-west-1"],
    provenance: demoProvenance({
      sourceTitle: "DEMO — AWS regions (not verified)"
    })
  },
  {
    id: "demo-gcp",
    name: "Google Cloud",
    regions: ["us-central1", "us-east4", "europe-west4"],
    provenance: demoProvenance({
      sourceTitle: "DEMO — GCP regions (not verified)"
    })
  },
  {
    id: "demo-azure",
    name: "Azure",
    regions: ["eastus", "westus2", "westeurope"],
    provenance: demoProvenance({
      sourceTitle: "DEMO — Azure regions (not verified)"
    })
  }
];
