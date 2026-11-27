"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { categoryMeta } from "@/lib/categoryMeta";

export interface DirTool { slug: string; title: string; np: string; desc: string; keys: string }
export interface DirGroup { slug: string; name: string; nameNp: string; tools: DirTool[] }

export default function ToolsDirectory({ groups }: { groups: DirGroup[] }) {
  const [q, setQ] = useState("");
  useEffect(() => {
    try {
      const v = new URLSearchParams(window.location.search).get("q");
      if (v) setQ(v);
    } catch {}
  }, []);
  const needle = q.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!needle) return groups;
    return groups
      .map((g) => ({ ...g, tools: g.tools.filter((t) => `${t.title} ${t.np} ${t.desc} ${t.keys}`.toLowerCase().includes(needle)) }))
      .filter((g) => g.tools.length > 0);
  }, [groups, needle]);
  const count = filtered.reduce((n, g) => n + g.tools.length, 0);

  return (
    <div>
      <div className="sticky top-16 z-30 -mx-4 border-b border-ink-200/80 bg-paper/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 dark:border-ink-800 dark:bg-ink-950/95">
        <div className="relative max-w-xl">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter tools… (e.g. gold, मिति, loan)"
            aria-label="Filter tools"
            className="input h-11 rounded-xl bg-white pl-10 pr-10 dark:bg-ink-900"
          />
          {q && (
            <button type="button" onClick={() => setQ("")} aria-label="Clear filter" className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-lg text-ink-400 hover:bg-ink-100 hover:text-ink-700">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <nav aria-label="Jump to category" className="-mx-1 mt-3 flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none]">
          {filtered.map((g) => (
            <a key={g.slug} href={`#${g.slug}`} className="chip shrink-0 !py-1">
              {g.name} <span className="ml-1.5 text-ink-400">{g.tools.length}</span>
            </a>
          ))}
        </nav>
      </div>

      <p className="mt-6 text-sm text-ink-500" aria-live="polite">
        {needle ? `${count} ${count === 1 ? "tool matches" : "tools match"} “${q}”` : `${count} tools`}
      </p>

      {filtered.length === 0 && (
        <p className="mt-6 rounded-2xl border border-dashed border-ink-300 p-8 text-center text-ink-500">
          No tool matches that yet. <Link href="/contact" className="font-semibold text-brand-700 underline">Suggest it to us</Link>.
        </p>
      )}

      <div className="mt-4 space-y-10">
        {filtered.map((g) => {
          const m = categoryMeta(g.slug);
          const Icon = m.icon;
          return (
            <section key={g.slug} id={g.slug} aria-labelledby={`${g.slug}-h`} className="scroll-mt-44">
              <div className="mb-3 flex items-center gap-3">
                <span className={`grid h-9 w-9 place-items-center rounded-lg ${m.tile}`}><Icon className="h-4 w-4" aria-hidden /></span>
                <h2 id={`${g.slug}-h`} className="text-xl font-bold text-ink-900 dark:text-ink-50">
                  <Link href={`/category/${g.slug}`} className="hover:text-brand-700">{g.name}</Link>
                  <span className="devanagari ml-2 text-base font-semibold text-ink-400" lang="ne">{g.nameNp}</span>
                </h2>
              </div>
              <ul className="card divide-y divide-ink-200 overflow-hidden dark:divide-ink-800">
                {g.tools.map((t) => (
                  <li key={t.slug}>
                    <Link href={`/${t.slug}`} className="group flex flex-col gap-0.5 px-4 py-3.5 transition hover:bg-ink-50 sm:flex-row sm:items-center sm:gap-4 dark:hover:bg-ink-800/50">
                      <span className="font-semibold text-ink-900 group-hover:text-brand-700 sm:w-64 sm:shrink-0 dark:text-ink-50">
                        {t.title}
                        <span className="devanagari block text-[13px] font-normal text-ink-500" lang="ne">{t.np}</span>
                      </span>
                      <span className="line-clamp-2 text-sm text-ink-500 dark:text-ink-400">{t.desc}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
