"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Mail } from "lucide-react";

export default function NewsletterSignup({ source = "website", dark = true }: { source?: string; dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("busy");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website: hp, source }),
      });
      const j = await res.json().catch(() => ({}));
      if (res.ok && j.ok) {
        setState("done");
        setMsg(j.already ? "You're already on the list." : "Done! Check your inbox for a welcome email.");
      } else {
        setState("error");
        setMsg(j.error || "Something went wrong. Please try again.");
      }
    } catch {
      setState("error");
      setMsg("No connection. Please try again.");
    }
  }

  if (state === "done") {
    return (
      <p className={`flex items-center gap-2 text-sm font-semibold ${dark ? "text-emerald-300" : "text-emerald-700"}`} role="status">
        <CheckCircle2 className="h-5 w-5" aria-hidden /> {msg}
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="w-full max-w-md">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label className="sr-only" htmlFor={`nl-${source}`}>Email address</label>
        <div className="relative flex-1">
          <Mail className={`pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 ${dark ? "text-white/50" : "text-ink-400"}`} aria-hidden />
          <input
            id={`nl-${source}`}
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={dark
              ? "h-12 w-full rounded-2xl border border-white/15 bg-white/10 pl-10 pr-4 text-sm text-white placeholder:text-white/45 focus:border-saffron-300 focus:outline-none"
              : "input h-12 !rounded-2xl pl-10"}
          />
        </div>
        <input tabIndex={-1} autoComplete="off" aria-hidden className="hidden" value={hp} onChange={(e) => setHp(e.target.value)} name="website" />
        <button type="submit" className="btn-primary h-12 !px-6" disabled={state === "busy"}>
          {state === "busy" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null} Get daily rates
        </button>
      </div>
      {state === "error" ? <p className={`mt-2 text-sm ${dark ? "text-brand-300" : "text-brand-700"}`} role="alert">{msg}</p> : (
        <p className={`mt-2 text-xs ${dark ? "text-white/45" : "text-ink-400"}`}>One email each morning. Free. Unsubscribe any time.</p>
      )}
    </form>
  );
}
