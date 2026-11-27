"use client";

import { useFormState, useFormStatus } from "react-dom";
import { CheckCircle2, Send } from "lucide-react";
import { submitContactAction, type ContactFormState } from "@/app/contact/actions";

const initialState: ContactFormState = { ok: false };

const TOPIC_OPTIONS: Array<[string, string]> = [
  ["error", "Report an error or wrong data"],
  ["suggestion", "Suggest a new tool or guide"],
  ["data", "Ask for a data/rate update"],
  ["advertising", "Advertising / business enquiry"],
  ["other", "Something else"],
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="btn-primary w-full sm:w-auto" disabled={pending}>
      <Send className="h-4 w-4" aria-hidden />
      {pending ? "Sending…" : "Send message"}
    </button>
  );
}

export default function ContactForm() {
  const [state, formAction] = useFormState(submitContactAction, initialState);

  if (state.ok && state.message) {
    return (
      <div
        className="card p-6 text-center"
        role="status"
        aria-live="polite"
      >
        <CheckCircle2 className="mx-auto h-10 w-10 text-green-600 dark:text-green-400" aria-hidden />
        <h2 className="mt-3 text-lg font-bold text-ink-900 dark:text-ink-50">Message sent</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-600 dark:text-ink-400">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="card relative p-5 sm:p-6" aria-label="Contact form">
      {state.error && (
        <p className="mb-4 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300" role="alert">
          {state.error}
        </p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="label">Your name *</span>
          <input name="name" type="text" required maxLength={100} className="input" autoComplete="name" />
        </label>
        <label className="block">
          <span className="label">Email address *</span>
          <input name="email" type="email" required className="input" autoComplete="email" />
        </label>
        <label className="block">
          <span className="label">What is it about? *</span>
          <select name="topic" required className="input" defaultValue="">
            <option value="" disabled>
              Choose one…
            </option>
            {TOPIC_OPTIONS.map(([v, label]) => (
              <option key={v} value={v}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="label">Page URL (if reporting an error)</span>
          <input
            name="url"
            type="url"
            className="input"
            placeholder="https://…/tool-page"
            autoComplete="off"
          />
        </label>
      </div>
      <label className="mt-4 block">
        <span className="label">Message *</span>
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={4000}
          rows={6}
          className="input resize-y"
          placeholder="Tell us what happened, what you expected, and which page or tool you were using…"
        />
        <span className="mt-1 block text-[11px] text-ink-400">10–4,000 characters. We reply to the email you provide.</span>
      </label>

      {/* Honeypot — hidden from humans, catches bots */}
      <div className="absolute left-[-9999px] top-[-9999px]" aria-hidden="true">
        <label>
          Leave this field empty
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <SubmitButton />
        <p className="text-xs text-ink-400">
          Prefer email? Write to <strong>support@nepalitools.com</strong>
        </p>
      </div>
    </form>
  );
}
