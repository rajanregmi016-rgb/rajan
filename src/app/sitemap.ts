import type { MetadataRoute } from "next";
import { allCategories, allTools } from "@/lib/tools";
import { GUIDES_LIST } from "@/data/guides";
import { NE_PAGES } from "@/data/ne";
import { SITE_URL } from "@/config/site";
import { getGoldHistory, getNrbRange, nepalToday, shiftDate } from "@/lib/server/history";

export const revalidate = 21600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages = ["", "/tools", "/exchange-rate", "/gold-price", "/widgets", "/guides", "/about", "/team", "/how-we-verify", "/faq", "/contact", "/privacy", "/terms", "/disclaimer"].map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: new Date(),
    changeFrequency: p === "" ? ("daily" as const) : p === "/tools" ? ("weekly" as const) : ("monthly" as const),
    priority: p === "" ? 1 : p === "/tools" ? 0.8 : 0.5,
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

  const today = nepalToday();
  const [fx, gold] = await Promise.all([getNrbRange(shiftDate(today, -365), today).catch(() => []), getGoldHistory().catch(() => [])]);
  const fxPages = fx.map((d) => ({ url: `${SITE_URL}/exchange-rate/${d.date}`, lastModified: new Date(d.date), changeFrequency: "yearly" as const, priority: 0.4 }));
  const goldPages = gold.map((d) => ({ url: `${SITE_URL}/gold-price/${d.date}`, lastModified: new Date(d.date), changeFrequency: "yearly" as const, priority: 0.4 }));

  const nePages = [{ url: `${SITE_URL}/ne`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.7 }, ...NE_PAGES.map((p) => ({ url: `${SITE_URL}/ne/${p.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 }))];

  return [...staticPages, ...nePages, ...toolPages, ...categoryPages, ...guidePages, ...fxPages, ...goldPages];
}
