import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/styleguide", "/motion-lab", "/api/", "/Bryan-Joseph-Resume.pdf"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
