import type { MetadataRoute } from "next";
import { getCaseStudies } from "@/content";
import { SITE_URL } from "@/lib/site";

/** /styleguide and /motion-lab are dev surfaces and stay excluded. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, priority: 1 },
    { url: `${SITE_URL}/projects`, lastModified: now, priority: 0.9 },
    ...getCaseStudies().map((s) => ({
      url: `${SITE_URL}/projects/${s.frontmatter.slug}`,
      lastModified: now,
      priority: 0.8,
    })),
  ];
}
