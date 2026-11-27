import type { MetadataRoute } from "next";
import { allCategories, allTools } from "@/lib/tools";
import { GUIDES_LIST } from "@/data/guides";
import { SITE_URL } from "@/config/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPages = ["", "/guides", "/about", "/contact", "/privacy", "/disclaimer"].map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: new Date(),
    changeFrequency: p === "" ? ("daily" as const) : ("monthly" as const),
    priority: p === "" ? 1 : 0.5,
  }));

  const toolPages = allTools().map((t) => ({
    url: `${SITE_URL}/${t.slug}`,
    lastModified: new Date(t.lastUpdated),
    changeFrequency: "weekly" as const,
    priority: t.popular ? 0.9 : 0.7,
  }));

  const categoryPages = allCategories().map((c) => ({
    url: `${SITE_URL}/category/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const guidePages = GUIDES_LIST.map((g) => ({
    url: `${SITE_URL}/guides/${g.slug}`,
    lastModified: new Date(g.updated),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...toolPages, ...categoryPages, ...guidePages];
}
