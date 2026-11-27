"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { SITE } from "@/config/site";

const TOPIC_OPTIONS: Array<[string, string]> = [
  ["Report an error", "A number or result looks wrong"],
  ["Suggest a tool", "A tool or guide you'd like"],
  ["Data source", "A better official source"],
  ["Advertising", "Advertising or partnership"],
  ["Other", "Something else"],
];

/**
 * Builds the message and opens the visitor's own email app, addressed to us.
 * Nothing is stored on our servers, and the visitor keeps a copy in their sent mail.
 */
export default function ContactForm() {
  const [topic, setTopic] = useState(TOPIC_OPTIONS[0][0]);
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [opened, setOpened] = useState(false);

  const subject = `[${topic}] ${message.slice(0, 60).replace(/\s+/g, " ")}${message.length > 60 ? "…" : ""}`;
  const body = `${message}\n\n${url ? `Page: ${url}\n` : ""}— ${name || "A visitor"}`;
  const href = `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  const valid = message.trim().length >= 10;

  return (
    <form
      className="card p-6 sm:p-8"
      aria-label="Contact form"
      onSubmit={(e) => {
        e.preventDefault();
        if (!valid) return;
        window.location.href = href;
        setOpened(true);
      }}
    >
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
        <button type="submit" className="btn-primary !px-6 !py-3" disabled={!valid}>
          <Send className="h-4 w-4" aria-hidden /> Write the email
        </button>
        <p className="text-sm text-ink-500">Opens your email app with the message ready to send.</p>
      </div>
      {opened && (
        <p className="mt-4 rounded-2xl bg-ink-50 p-4 text-sm text-ink-600 dark:bg-ink-800 dark:text-ink-300" role="status">
          Your email app should open now. If it didn&apos;t, copy your message and send it to{" "}
          <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-1 font-semibold text-brand-700 underline dark:text-brand-300"><Mail className="h-3.5 w-3.5" aria-hidden />{SITE.email}</a>.
        </p>
      )}
    </form>
  );
}
