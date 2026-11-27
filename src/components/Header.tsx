"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, BookOpen, Info, Menu, Search, ShieldCheck, Users, X } from "lucide-react";
import { allCategories, allTools, toolsInCategory } from "@/lib/tools";
import type { Tool } from "@/lib/tools";
import { categoryMeta } from "@/lib/categoryMeta";
import { Logo } from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import AccountButton from "@/components/AccountButton";
import { RecentTools } from "@/lib/userTools";

const NAV = [
  { href: "/tools", label: "All tools" },
  { href: "/category/nepali-date-calendar", label: "Date" },
  { href: "/category/finance-tax-currency", label: "Finance" },
  { href: "/category/gold-silver-price", label: "Gold" },
  { href: "/guides", label: "Guides" },
  { href: "/about", label: "About" },
];

function useToolSearch(q: string) {
  const tools = useMemo(() => allTools().slice(), []);
  return useMemo(() => {
    const needle = q.trim().toLowerCase().replace(/\s+/g, " ");
    if (!needle) return [] as Tool[];
    const score = (t: Tool) => {
      const hay = `${t.shortTitle} ${t.h1} ${t.h1Np} ${t.keywords.join(" ")}`.toLowerCase();
      let s = 0;
      if (t.shortTitle.toLowerCase().startsWith(needle)) s += 10;
      if (hay.includes(needle)) s += 5;
      for (const w of hay.split(/\s+/)) if (w.startsWith(needle)) s += 2;
      return s;
    };
    return tools.map((t) => ({ t, s: score(t) })).filter((r) => r.s > 0).sort((a, b) => b.s - a.s).slice(0, 8).map((r) => r.t);
  }, [q, tools]);
}

/**
 * Tool search with live suggestions.
 * variant: "hero" (big, on dark), "bar" (compact, on dark header), "light" (compact, on light)
 */
export function GlobalSearch({ variant = "light", compact }: { variant?: "hero" | "bar" | "light"; compact?: boolean }) {
  const v = compact && variant === "light" ? "light" : variant;
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const router = useRouter();
  const results = useToolSearch(q);

  function go(slug: string) {
    RecentTools.push(slug);
    setOpen(false);
    setQ("");
    router.push(`/${slug}`);
  }
  function submit() {
    if (results[active]) go(results[active].slug);
    else if (q.trim()) {
      setOpen(false);
      router.push(`/tools?q=${encodeURIComponent(q.trim())}`);
    }
  }
  function onKeyDown(e: React.KeyboardEvent) {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) setOpen(true);
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); submit(); }
    else if (e.key === "Escape") setOpen(false);
  }

  const inputCls =
    v === "hero"
      ? "h-14 w-full rounded-full border-0 bg-white pl-14 pr-32 text-base text-ink-900 shadow-glow outline-none ring-4 ring-white/10 placeholder:text-ink-400 focus:ring-brand-500/40 sm:h-16 sm:text-lg"
      : v === "bar"
      ? "h-10 w-full rounded-full border border-white/10 bg-white/10 pl-10 pr-4 text-sm text-white outline-none placeholder:text-white/50 focus:border-white/30 focus:bg-white/15"
      : "input h-11 rounded-full pl-10 pr-4 !text-sm";

  return (
    <div className="relative w-full">
      <form role="search" onSubmit={(e) => { e.preventDefault(); submit(); }} className="relative">
        <Search className={`pointer-events-none absolute top-1/2 -translate-y-1/2 ${v === "hero" ? "left-5 h-5 w-5 text-ink-400" : v === "bar" ? "left-3.5 h-4 w-4 text-white/50" : "left-3.5 h-4 w-4 text-ink-400"}`} aria-hidden="true" />
        <input
          type="search"
          value={q}
          onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(0); }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={onKeyDown}
          placeholder={v === "hero" ? "Try 'gold price', 'मिति', 'EMI'…" : "Search tools…"}
          aria-label="Search tools"
          className={inputCls}
        />
        {v === "hero" && (
          <button type="submit" className="btn-primary absolute right-2 top-1/2 h-10 -translate-y-1/2 sm:h-12 sm:px-6">Search</button>
        )}
      </form>
      {open && q.trim().length > 1 && results.length === 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-3xl border border-ink-200 bg-white p-4 text-left text-sm text-ink-600 shadow-tool dark:border-ink-800 dark:bg-ink-900 dark:text-ink-300">
          No tool found for “{q}”.{" "}
          <Link href="/tools" className="font-semibold text-brand-700 underline dark:text-brand-300">Browse all tools</Link>
        </div>
      )}
      {open && results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-3xl border border-ink-200 bg-white p-1.5 text-left shadow-tool dark:border-ink-800 dark:bg-ink-900" role="listbox">
          {results.map((t, idx) => {
            const m = categoryMeta(t.category);
            const Icon = m.icon;
            return (
              <button
                key={t.slug}
                type="button"
                role="option"
                aria-selected={idx === active}
                onMouseDown={(e) => e.preventDefault()}
                onMouseEnter={() => setActive(idx)}
                onClick={() => go(t.slug)}
                className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left text-sm ${idx === active ? "bg-ink-100 dark:bg-ink-800" : ""}`}
              >
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl ${m.solid}`}><Icon className="h-4 w-4" aria-hidden /></span>
                <span className="font-semibold text-ink-900 dark:text-ink-100">{t.shortTitle}</span>
                <span className="devanagari ml-auto hidden truncate text-xs text-ink-400 sm:block">{t.h1Np.split("—")[0]}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHome = pathname === "/";
  useEffect(() => setMenuOpen(false), [pathname]);
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-950/95 text-white backdrop-blur-md">
      <div className="container-np flex h-16 items-center gap-3">
        <Link href="/" className="shrink-0" aria-label="All Nepali Tools home">
          <Logo light />
        </Link>
        <nav className="ml-6 hidden items-center gap-1 lg:flex" aria-label="Main">
          {NAV.map((n) => {
            const active = pathname === n.href || pathname.startsWith(n.href + "/");
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active ? "page" : undefined}
                className={`rounded-full px-3.5 py-2 text-sm font-medium transition ${active ? "bg-white text-navy-950" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {!isHome && (
            <div className="hidden w-60 md:block">
              <GlobalSearch variant="bar" />
            </div>
          )}
          <ThemeToggle onDark />
          <AccountButton />
          <button
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white hover:bg-white/10 lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="h-[calc(100dvh-4rem)] overflow-y-auto border-t border-white/10 bg-navy-950 lg:hidden">
          <div className="container-np space-y-6 py-5">
            <GlobalSearch variant="bar" />
            <section>
              <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-white/50">Topics</h2>
              <ul className="grid gap-2 sm:grid-cols-2">
                {allCategories().map((c) => {
                  const m = categoryMeta(c.slug);
                  const Icon = m.icon;
                  const n = toolsInCategory(c.slug).length;
                  return (
                    <li key={c.slug}>
                      <Link href={`/category/${c.slug}`} className="flex items-center gap-3 rounded-2xl bg-white/5 px-3 py-3 ring-1 ring-white/10 hover:bg-white/10">
                        <span className={`grid h-10 w-10 place-items-center rounded-xl ${m.solid}`}><Icon className="h-5 w-5" aria-hidden /></span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-semibold">{c.name}</span>
                          <span className="devanagari block text-xs text-white/55" lang="ne">{c.nameNp} · {n} {n === 1 ? "tool" : "tools"}</span>
                        </span>
                        <ArrowRight className="h-4 w-4 text-white/40" aria-hidden />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
            <section>
              <h2 className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-white/50">More</h2>
              <ul className="grid grid-cols-2 gap-2">
                {[
                  { href: "/tools", label: "All tools", icon: Search },
                  { href: "/guides", label: "Guides", icon: BookOpen },
                  { href: "/about", label: "About us", icon: Info },
                  { href: "/team", label: "Our team", icon: Users },
                  { href: "/how-we-verify", label: "How we check data", icon: ShieldCheck },
                  { href: "/contact", label: "Contact", icon: ArrowRight },
                ].map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="flex items-center gap-2.5 rounded-2xl bg-white/5 px-3 py-3 text-sm font-medium ring-1 ring-white/10 hover:bg-white/10">
                      <l.icon className="h-4 w-4 text-saffron-300" aria-hidden /> {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        </div>
      )}
    </header>
  );
}
