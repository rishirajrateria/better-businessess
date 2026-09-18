import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: "Better Biz",
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#FBFAF7",
    theme_color: "#0A0A0A",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }, { src: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  };
}
