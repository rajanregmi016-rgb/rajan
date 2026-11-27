"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { ArrowRight, BookOpen, Menu, Search, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { allCategories, allTools, toolsInCategory } from "@/lib/tools";
import { categoryMeta } from "@/lib/categoryMeta";
import { Logo } from "@/components/Logo";
import { BsTodayChip } from "@/components/BsTodayChip";
import type { Tool } from "@/lib/tools";
import ThemeToggle from "@/components/ThemeToggle";
import { RecentTools } from "@/lib/userTools";

const NAV = [
  { href: "/category/nepali-date-calendar", label: "Dates" },
  { href: "/category/finance-tax-currency", label: "Finance" },
  { href: "/category/gold-silver-price", label: "Gold" },
  { href: "/category/see-exam", label: "SEE" },
  { href: "/category/nepali-language-unicode", label: "Nepali" },
  { href: "/guides", label: "Guides" },
];

export function GlobalSearch({ compact }: { compact?: boolean }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const router = useRouter();
  const boxRef = useRef<HTMLDivElement>(null);

  const tools = useMemo(() => allTools().slice(), []);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return [] as Tool[];
    const needle = query.replace(/\s+/g, " ");
    const score = (t: Tool) => {
      const hay = `${t.shortTitle} ${t.h1} ${t.h1Np} ${t.keywords.join(" ")}`.toLowerCase();
      let s = 0;
      if (t.shortTitle.toLowerCase().startsWith(needle)) s += 10;
      if (hay.includes(needle)) s += 5;
      const words = hay.split(/\s+/);
      for (const w of words) if (w.startsWith(needle)) s += 2;
      return s;
    };
    return tools
      .map((t) => ({ t, s: score(t) }))
      .filter((r) => r.s > 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 8)
      .map((r) => r.t);
  }, [q, tools]);

  function go(slug?: string) {
    if (!slug) return;
    const tool = allTools().find((t) => t.slug === slug);
    if (tool) RecentTools.push(tool.slug);
    setOpen(false);
    setQ("");
    router.push(`/${slug}`);
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) setOpen(true);
    if (e.key === "ArrowDown") setActive((a) => Math.min(a + 1, results.length - 1));
    else if (e.key === "ArrowUp") setActive((a) => Math.max(a - 1, 0));
    else if (e.key === "Enter") {
      e.preventDefault();
      go(results[active]?.slug);
    } else if (e.key === "Escape") setOpen(false);
  }

  return (
    <div ref={boxRef} className="relative w-full">
      <div className="relative">
        <Search className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-ink-400 ${compact ? "left-3.5 h-4 w-4" : "left-5 h-5 w-5"}`} aria-hidden="true" />
        <input
          type="search"
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(0); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={onKeyDown}
          placeholder={compact ? "Search tools…" : "Search 'gold price', 'मिति', 'EMI'…"}
          aria-label="Search Nepal tools"
          className={`${compact ? "h-10 pl-10 pr-4 !text-sm" : "h-14 border-ink-300 bg-white pl-14 pr-6 !text-base shadow-lift sm:h-16 sm:!text-lg dark:bg-ink-900"} input rounded-2xl`}
        />
      </div>
      {open && results.length > 0 && (
        <div className="absolute z-40 mt-2 w-full overflow-hidden rounded-2xl border border-ink-200 bg-white p-1.5 text-left shadow-tool dark:border-ink-800 dark:bg-ink-900" role="listbox">
          {results.map((t, idx) => (
            <button
              key={t.slug}
              role="option"
              aria-selected={idx === active}
              onMouseDown={(e) => e.preventDefault()}
              onMouseEnter={() => setActive(idx)}
              onClick={() => go(t.slug)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm ${idx === active ? "bg-ink-100 dark:bg-ink-800" : ""}`}
            >
              <ResultIcon category={t.category} />
              <span className="font-medium text-ink-800 dark:text-ink-100">{t.shortTitle}</span>
              <span className="devanagari ml-auto truncate text-xs text-ink-400">{t.h1Np.split("—")[0]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ResultIcon({ category }: { category: string }) {
  const m = categoryMeta(category);
  const Icon = m.icon;
  return (
    <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg ${m.tile}`}>
      <Icon className="h-3.5 w-3.5" aria-hidden />
    </span>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  return (
    <header className="sticky top-0 z-50 border-b border-ink-200/80 bg-paper/85 backdrop-blur-md dark:border-ink-800 dark:bg-ink-950/85">
      <div className="container-np flex h-16 items-center gap-3">
        <Link href="/" className="shrink-0" aria-label="Nepali Tools home">
          <Logo />
        </Link>
        <nav className="ml-4 hidden items-center gap-0.5 lg:flex" aria-label="Categories">
          {NAV.map((n) => {
            const active = pathname === n.href || pathname.startsWith(n.href + "/");
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${active ? "bg-ink-900 text-white dark:bg-white dark:text-ink-900" : "text-ink-600 hover:bg-ink-100 hover:text-ink-900 dark:text-ink-300 dark:hover:bg-ink-900 dark:hover:text-white"}`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {!isHome && (
            <div className="hidden w-64 md:block">
              <GlobalSearch compact />
            </div>
          )}
          <ThemeToggle />
          <button
            className="btn-ghost !px-2.5 lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-ink-200 bg-paper lg:hidden dark:border-ink-800 dark:bg-ink-950">
          <div className="container-np space-y-4 py-4">
            <GlobalSearch compact />
            <nav aria-label="All categories">
              <ul className="grid gap-1.5 sm:grid-cols-2">
                {allCategories().map((c) => {
                  const m = categoryMeta(c.slug);
                  const Icon = m.icon;
                  return (
                    <li key={c.slug}>
                      <Link
                        href={`/category/${c.slug}`}
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 rounded-xl border border-ink-200 bg-white px-3 py-2.5 dark:border-ink-800 dark:bg-ink-900"
                      >
                        <span className={`grid h-9 w-9 place-items-center rounded-lg ${m.tile}`}>
                          <Icon className="h-4 w-4" aria-hidden />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold text-ink-900 dark:text-ink-50">{c.name}</span>
                          <span className="devanagari block text-xs text-ink-500" lang="ne">{c.nameNp} · {toolsInCategory(c.slug).length} {toolsInCategory(c.slug).length === 1 ? "tool" : "tools"}</span>
                        </span>
                        <ArrowRight className="h-4 w-4 text-ink-300" aria-hidden />
                      </Link>
                    </li>
                  );
                })}
                <li>
                  <Link
                    href="/guides"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl border border-ink-200 bg-white px-3 py-2.5 dark:border-ink-800 dark:bg-ink-900"
                  >
                    <span className="grid h-9 w-9 place-items-center rounded-lg bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-200">
                      <BookOpen className="h-4 w-4" aria-hidden />
                    </span>
                    <span className="flex-1 text-sm font-semibold text-ink-900 dark:text-ink-50">Guides &amp; tutorials</span>
                    <ArrowRight className="h-4 w-4 text-ink-300" aria-hidden />
                  </Link>
                </li>
              </ul>
            </nav>
            <p className="text-center text-xs text-ink-500"><BsTodayChip className="devanagari" /></p>
          </div>
        </div>
      )}
    </header>
  );
}
