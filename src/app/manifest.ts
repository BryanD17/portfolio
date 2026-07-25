import type { MetadataRoute } from "next";
import { OG_COLORS } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Bryan Joseph, software engineer",
    short_name: "Bryan Joseph",
    description:
      "Bryan Joseph, software engineer. Shipped an 80,000-line iOS app to the App Store, led a browser-based MIPS simulator, built a Java trading engine.",
    start_url: "/",
    display: "standalone",
    background_color: OG_COLORS.bg,
    theme_color: OG_COLORS.bg,
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
