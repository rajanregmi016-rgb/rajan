"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { FAVS_EVENT, RecentTools } from "@/lib/userTools";
import { useAuth } from "@/components/AuthProvider";

/** Returning visitors see their saved and recent tools first. Renders nothing for new visitors. */
export default function YourTools() {
  const { user } = useAuth();
  const [items, setItems] = useState<{ slug: string; fav: boolean }[]>([]);
  useEffect(() => {
    const load = () => {
      const favs = RecentTools.favorites();
      const rec = RecentTools.recent().filter((s) => !favs.includes(s));
      setItems([...favs.map((slug) => ({ slug, fav: true })), ...rec.map((slug) => ({ slug, fav: false }))].slice(0, 8));
    };
    load();
    window.addEventListener(FAVS_EVENT, load);
    return () => window.removeEventListener(FAVS_EVENT, load);
  }, [user]);
  if (!items.length) return null;
  const name = (user?.user_metadata?.full_name as string | undefined)?.split(" ")[0];
  return (
    <section aria-labelledby="yours-h" className="mb-14">
      <div className="flex items-end justify-between gap-4">
        <h2 id="yours-h" className="font-display text-xl font-extrabold">{name ? `Welcome back, ${name}` : "Your tools"}</h2>
        <Link href={user ? "/account" : "/login"} className="text-sm font-semibold text-brand-600 hover:underline">{user ? "My account" : "Save them to an account"}</Link>
      </div>
      <div className="no-scrollbar mt-4 flex gap-2 overflow-x-auto pb-1">
        {items.map((t) => (
          <Link key={t.slug} href={`/${t.slug}`} className="chip shrink-0 !py-2">
            {t.fav && <Star className="h-3.5 w-3.5 fill-saffron-400 text-saffron-400" aria-hidden />}
            {RecentTools.titleFor(t.slug)}
          </Link>
        ))}
      </div>
    </section>
  );
}
