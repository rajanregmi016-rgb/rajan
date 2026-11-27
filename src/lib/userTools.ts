import { allTools } from "@/lib/tools";

const FAVORITES_KEY = "nt-favorites";
const RECENT_KEY = "nt-recent";

function read(key: string): string[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}
function write(key: string, v: string[]) {
  try { localStorage.setItem(key, JSON.stringify(v.slice(0, 20))); } catch {}
}

export const RecentTools = {
  push(slug: string) {
    const cur = read(RECENT_KEY).filter((s) => s !== slug);
    cur.unshift(slug);
    write(RECENT_KEY, cur);
  },
  recent(): string[] { return read(RECENT_KEY); },
  isFavorite(slug: string) { return read(FAVORITES_KEY).includes(slug); },
  toggleFavorite(slug: string): boolean {
    const cur = read(FAVORITES_KEY);
    const now = cur.includes(slug) ? cur.filter((s) => s !== slug) : [slug, ...cur];
    write(FAVORITES_KEY, now);
    return now.includes(slug);
  },
  favorites(): string[] { return read(FAVORITES_KEY); },
  titleFor(slug: string): string {
    const t = allTools().find((t) => t.slug === slug);
    return t ? t.shortTitle : slug;
  },
};
