"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { Bell, BellRing, CheckCheck, LogIn, PartyPopper, TrendingUp, X } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

type Notice = { id: string; at: string; kind: string; title: string; body: string; href?: string; read?: boolean };

function ago(iso: string) {
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
const ICON: Record<string, React.ComponentType<{ className?: string }>> = { login: LogIn, alert: TrendingUp, welcome: PartyPopper };

export default function NotificationBell() {
  const { session } = useAuth();
  const [items, setItems] = useState<Notice[]>([]);
  const [unread, setUnread] = useState(0);
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);
  const token = session?.access_token;

  const call = useCallback(async (init?: RequestInit) => {
    if (!token) return;
    const res = await fetch("/api/account/notifications", { ...init, headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, cache: "no-store" });
    const j = await res.json().catch(() => null);
    if (j?.ok) { setItems(j.items); setUnread(j.unread); }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    call();
    const t = setInterval(() => call(), 3 * 60e3);
    const onFocus = () => call();
    window.addEventListener("focus", onFocus);
    return () => { clearInterval(t); window.removeEventListener("focus", onFocus); };
  }, [token, call]);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === "Escape" : !box.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", close);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", close); };
  }, [open]);

  if (!token) return null;
  const Icon = unread ? BellRing : Bell;
  return (
    <div className="relative" ref={box}>
      <button
        onClick={() => { setOpen((v) => !v); if (!open && unread) call({ method: "POST", body: JSON.stringify({ action: "read_all" }) }); }}
        className="relative grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white hover:bg-white/10"
        aria-label={unread ? `Notifications, ${unread} new` : "Notifications"}
        aria-expanded={open}
      >
        <Icon className="h-5 w-5" />
        {unread > 0 && <span className="absolute -right-0.5 -top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand-600 px-1 text-[11px] font-bold">{unread > 9 ? "9+" : unread}</span>}
      </button>
      {open && (
        <div className="fixed inset-x-3 top-16 z-50 overflow-hidden rounded-3xl border border-ink-200 bg-white text-ink-900 shadow-lift sm:absolute sm:inset-x-auto sm:right-0 sm:top-12 sm:w-96 dark:border-ink-800 dark:bg-ink-900 dark:text-ink-50" role="dialog" aria-label="Notifications">
          <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3 dark:border-ink-800">
            <p className="font-bold">Notifications</p>
            <div className="flex items-center gap-1">
              {items.length > 0 && (
                <button className="rounded-lg px-2 py-1 text-xs font-semibold text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800" onClick={() => call({ method: "POST", body: JSON.stringify({ action: "clear" }) })}>
                  <CheckCheck className="mr-1 inline h-3.5 w-3.5" aria-hidden />Clear all
                </button>
              )}
              <button className="rounded-lg p-1 text-ink-400 hover:bg-ink-100 dark:hover:bg-ink-800" aria-label="Close" onClick={() => setOpen(false)}><X className="h-4 w-4" /></button>
            </div>
          </div>
          <ul className="max-h-[60vh] overflow-y-auto">
            {items.length === 0 && (
              <li className="px-5 py-10 text-center text-sm text-ink-500">
                No notifications yet. <Link href="/account" className="font-semibold text-brand-600" onClick={() => setOpen(false)}>Set a price alert</Link> to get one when gold or the dollar moves.
              </li>
            )}
            {items.map((n) => {
              const I = ICON[n.kind] || Bell;
              const content = (
                <div className={`flex gap-3 px-4 py-3 ${n.read ? "" : "bg-brand-50/60 dark:bg-brand-900/20"}`}>
                  <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-ink-100 text-brand-600 dark:bg-ink-800"><I className="h-4 w-4" /></span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{n.title}</span>
                    <span className="block text-[13px] leading-5 text-ink-500">{n.body}</span>
                    <span className="mt-0.5 block text-xs text-ink-400">{ago(n.at)}</span>
                  </span>
                </div>
              );
              return (
                <li key={n.id} className="border-b border-ink-100 last:border-0 dark:border-ink-800">
                  {n.href ? <Link href={n.href} onClick={() => setOpen(false)} className="block hover:bg-ink-50 dark:hover:bg-ink-800/60">{content}</Link> : content}
                </li>
              );
            })}
          </ul>
          <Link href="/account#notifications" onClick={() => setOpen(false)} className="block border-t border-ink-100 px-4 py-3 text-center text-sm font-semibold text-brand-600 hover:bg-ink-50 dark:border-ink-800 dark:hover:bg-ink-800/60">
            Notification settings
          </Link>
        </div>
      )}
    </div>
  );
}
