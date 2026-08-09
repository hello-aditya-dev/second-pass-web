import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f2efe7",
    theme_color: "#11110f",
    icons: [
      {
        src: "/mark.svg",
        sizes: "any",
        type: "image/svg+xml"
      }
    ]
  };
}
