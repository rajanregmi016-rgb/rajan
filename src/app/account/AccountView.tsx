"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { History, KeyRound, Loader2, LogOut, Star } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabaseClient";
import { FAVS_EVENT, RecentTools } from "@/lib/userTools";
import { DailyEmailToggle, MyDates, PriceAlerts, ProfileName, useWelcomeEmail } from "./AccountExtras";

export default function AccountView({ gold, usd }: { gold: number; usd: number }) {
  const { user, ready, enabled } = useAuth();
  const router = useRouter();
  const [favs, setFavs] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [pw, setPw] = useState("");
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; t: string } | null>(null);
  const [busy, setBusy] = useState(false);

  useWelcomeEmail(user);
  useEffect(() => {
    if (ready && !user) router.replace("/login");
  }, [ready, user, router]);

  useEffect(() => {
    const load = () => { setFavs(RecentTools.favorites()); setRecent(RecentTools.recent().slice(0, 8)); };
    load();
    window.addEventListener(FAVS_EVENT, load);
    return () => window.removeEventListener(FAVS_EVENT, load);
  }, [user]);

  if (!enabled) {
    return <div className="card mx-auto max-w-lg p-6 text-center">Accounts are coming soon.</div>;
  }
  if (!ready || !user) {
    return <div className="flex justify-center py-16 text-ink-400"><Loader2 className="h-6 w-6 animate-spin" aria-label="Loading" /></div>;
  }

  const name = (user.user_metadata?.full_name as string) || user.email?.split("@")[0] || "Friend";
  const provider = (user.app_metadata?.provider as string) || "email";

  async function changePassword(e: React.FormEvent) {
    e.preventDefault();
    if (pw.length < 8) { setPwMsg({ ok: false, t: "Use at least 8 characters." }); return; }
    setBusy(true);
    const { error } = await supabase()!.auth.updateUser({ password: pw });
    setBusy(false);
    setPw("");
    setPwMsg(error ? { ok: false, t: error.message } : { ok: true, t: "Password updated." });
  }

  async function signOut() {
    await supabase()?.auth.signOut();
    router.replace("/");
  }

  const list = (slugs: string[], empty: string) =>
    slugs.length ? (
      <ul className="mt-4 grid gap-2 sm:grid-cols-2">
        {slugs.map((s) => (
          <li key={s}>
            <Link href={`/${s}`} className="block rounded-2xl border border-ink-200 px-4 py-3 text-sm font-semibold hover:border-brand-300 hover:text-brand-700 dark:border-ink-800">
              {RecentTools.titleFor(s)}
            </Link>
          </li>
        ))}
      </ul>
    ) : (
      <p className="mt-3 text-sm text-ink-500">{empty}</p>
    );

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
      <div className="space-y-6">
        <section className="card p-6">
          <h2 className="flex items-center gap-2 text-lg font-extrabold"><Star className="h-5 w-5 text-saffron-500" aria-hidden /> Saved tools</h2>
          {list(favs, "Tap the star on any tool page to save it here. Your saved tools follow you to every device you sign in on.")}
        </section>
        <section className="card p-6">
          <h2 className="flex items-center gap-2 text-lg font-extrabold"><History className="h-5 w-5 text-brand-600" aria-hidden /> Recently used on this device</h2>
          {list(recent, "Tools you open will show up here.")}
        </section>
        <PriceAlerts user={user} gold={gold} usd={usd} />
        <MyDates user={user} />
      </div>
      <aside className="space-y-6">
        <DailyEmailToggle />
        <section className="card p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-brand-gradient text-lg font-bold text-white">{name.charAt(0).toUpperCase()}</span>
            <div className="min-w-0">
              <p className="truncate font-bold">{name}</p>
              <p className="truncate text-sm text-ink-500">{user.email}</p>
              <ProfileName user={user} />
            </div>
          </div>
          <p className="mt-4 text-xs text-ink-400">Signed in with {provider === "google" ? "Google" : "email"}</p>
          <button onClick={signOut} className="btn-ghost mt-4 w-full justify-center border border-ink-200 dark:border-ink-800">
            <LogOut className="h-4 w-4" aria-hidden /> Sign out
          </button>
        </section>
        {provider === "email" && (
          <section className="card p-6">
            <h2 className="flex items-center gap-2 font-extrabold"><KeyRound className="h-4 w-4" aria-hidden /> Change password</h2>
            <form onSubmit={changePassword} className="mt-4 space-y-3">
              <label className="label" htmlFor="newpw">New password</label>
              <input id="newpw" type="password" className="input" autoComplete="new-password" value={pw} onChange={(e) => setPw(e.target.value)} />
              <button className="btn-primary w-full justify-center" disabled={busy}>{busy ? "Saving…" : "Update password"}</button>
              {pwMsg && <p className={`text-sm ${pwMsg.ok ? "text-emerald-600" : "text-brand-700"}`} role="status">{pwMsg.t}</p>}
            </form>
          </section>
        )}
      </aside>
    </div>
  );
}
