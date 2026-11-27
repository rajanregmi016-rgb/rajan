"use client";

import { useEffect, useState } from "react";
import { Moon, Star, Sun } from "lucide-react";
import { RecentTools as R } from "@/lib/userTools";

export default function ThemeToggle({ onDark }: { onDark?: boolean }) {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);
  return (
    <button
      aria-label="Toggle dark mode"
      onClick={() => {
        const next = !dark;
        setDark(next);
        document.documentElement.classList.toggle("dark", next);
        try { localStorage.setItem("nt-theme", next ? "dark" : "light"); } catch {}
      }}
      className={onDark ? "grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/15 text-white hover:bg-white/10" : "btn-ghost !px-2.5 shrink-0"}
    >
      {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}

export function FavoriteButton({ slug, onDark }: { slug: string; onDark?: boolean }) {
  const [fav, setFav] = useState(false);
  useEffect(() => {
    setFav(R.isFavorite(slug));
  }, [slug]);
  return (
    <button
      onClick={() => {
        const v = R.toggleFavorite(slug);
        setFav(v);
      }}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition ${onDark ? (fav ? "bg-brand-600 text-white" : "bg-white/10 text-white/80 ring-1 ring-white/15 hover:bg-white/15") : (fav ? "text-brand-600" : "text-ink-400")}`}
      aria-label={fav ? "Remove from favorites" : "Add to favorites"}
      title={fav ? "Remove from favorites" : "Add to favorites"}
    >
      <Star className={`h-4 w-4 ${fav ? "fill-current" : ""}`} />
      {onDark && (fav ? "Saved" : "Save")}
    </button>
  );
}

export function RecentlyOrFavorites({ className }: { className?: string }) {
  const [items, setItems] = useState<string[]>([]);
  const [favs, setFavs] = useState<string[]>([]);
  useEffect(() => {
    setItems(R.recent());
    setFavs(R.favorites());
  }, []);
  if (items.length === 0 && favs.length === 0) return null;
  const all = [...new Set([...favs, ...items])].filter(Boolean) as string[];
  return (
    <div className={className}>
      <h2 className="mb-2 text-sm font-semibold text-ink-600 dark:text-ink-300">
        Your recent & favorite tools
      </h2>
      <ul className="flex flex-wrap gap-2">
        {all.slice(0, 8).map((slug) => (
          <li key={slug}>
            <a href={`/${slug}`} className="chip devanagari-skip">
              {R.titleFor(slug)}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
