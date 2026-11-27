"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

const TOPIC_OPTIONS: Array<[string, string]> = [
  ["Report an error", "A number or result looks wrong"],
  ["Suggest a tool", "A tool or guide you'd like"],
  ["Data source", "A better official source"],
  ["Advertising", "Advertising or partnership"],
  ["Other", "Something else"],
];

/**
 * Sends the message to /api/contact, which emails it to the site owner
 * (reply goes straight back to the visitor) and keeps a private copy.
 */
export default function ContactForm() {
  const [topic, setTopic] = useState(TOPIC_OPTIONS[0][0]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");

  // Prefill from "Report a problem" links on tool pages (?page=/slug).
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const page = q.get("page");
    if (page && page.startsWith("/")) {
      setTopic(TOPIC_OPTIONS[0][0]);
      setUrl(`${window.location.origin}${page}`);
    }
  }, []);

  const [email, setEmail] = useState("");
  const [hp, setHp] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [err, setErr] = useState("");
  const valid = message.trim().length >= 10;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "sending") return;
    if (!valid) {
      setErr("Please write at least a short sentence (10 characters or more).");
      setState("error");
      return;
    }
    setState("sending");
    setErr("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, name, email, page: url, message, website: hp }),
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(j.error || "Something went wrong.");
      setState("sent");
      setMessage("");
    } catch (x) {
      setErr(x instanceof Error ? x.message : "Something went wrong.");
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="card p-6 sm:p-8" role="status">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-brand-gradient text-white"><CheckCircle2 className="h-5 w-5" aria-hidden /></span>
        <h2 className="mt-4 text-xl font-bold">Thank you, your message has been sent.</h2>
        <p className="mt-2 text-ink-600 dark:text-ink-300">{email ? `We'll reply to ${email}, usually within two working days.` : "You didn't leave an email address, so we can't reply, but we read every message."}</p>
        <button type="button" className="btn-ghost mt-5" onClick={() => setState("idle")}>Send another message</button>
      </div>
    );
  }

  return (
    <form className="card p-6 sm:p-8" aria-label="Contact form" onSubmit={submit}>
      <fieldset>
        <legend className="label">What is it about?</legend>
        <div className="mt-1 flex flex-wrap gap-2">
          {TOPIC_OPTIONS.map(([v, hint]) => (
            <button
              key={v}
              type="button"
              title={hint}
              onClick={() => setTopic(v)}
              aria-pressed={topic === v}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${topic === v ? "bg-navy-950 text-white dark:bg-white dark:text-navy-950" : "border border-ink-200 bg-white text-ink-700 hover:border-ink-300 dark:border-ink-700 dark:bg-ink-900 dark:text-ink-200"}`}
            >
              {v}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="label">Your name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} type="text" maxLength={100} className="input" autoComplete="name" placeholder="Optional" />
        </label>
        <label className="block">
          <span className="label">Your email (so we can reply)</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" maxLength={200} className="input" autoComplete="email" placeholder="you@example.com" />
        </label>
        <label className="hidden" aria-hidden="true">
          Leave this empty
          <input value={hp} onChange={(e) => setHp(e.target.value)} tabIndex={-1} autoComplete="off" />
        </label>
        <label className="block sm:col-span-2">
          <span className="label">Page link (if reporting an error)</span>
          <input value={url} onChange={(e) => setUrl(e.target.value)} type="url" className="input" placeholder="https://allnepalitools.com/…" autoComplete="off" />
        </label>
      </div>
      <label className="mt-4 block">
        <span className="label">Your message</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          minLength={10}
          maxLength={4000}
          rows={6}
          className="input resize-y"
          placeholder="Tell us what happened, what you expected, or what tool you'd like…"
        />
      </label>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button type="submit" className="btn-primary !px-6 !py-3" disabled={state === "sending"}>
          <Send className="h-4 w-4" aria-hidden /> {state === "sending" ? "Sending…" : "Send message"}
        </button>
        <p className="text-sm text-ink-500">Goes straight to our team. We never share your email.</p>
      </div>
      {state === "error" && <p className="mt-4 rounded-2xl bg-brand-50 p-4 text-sm text-brand-800 dark:bg-brand-900/30 dark:text-brand-200" role="alert">{err}</p>}
    </form>
  );
}
