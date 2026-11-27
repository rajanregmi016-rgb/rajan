"use client";

import { useState } from "react";
import { Check, Copy, RotateCcw } from "lucide-react";

export function ToolShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="card border-ink-300/70 p-4 shadow-tool sm:p-7 dark:border-ink-700" role="region" aria-label="Tool">
      {children}
    </div>
  );
}

export function ResultCard({ items }: { items: Array<{ label: string; value: string; sub?: string; emphasize?: boolean }> }) {
  return (
    <div className="mt-4 grid gap-2 sm:grid-cols-2" aria-live="polite">
      {items.map((it) => (
        <div
          key={it.label}
          className={`rounded-2xl p-4 ${it.emphasize ? "bg-navy-900 text-white dark:bg-navy-800" : "border border-ink-200 bg-ink-50 dark:border-ink-800 dark:bg-ink-800/40"}`}
        >
          <div className={`text-xs font-semibold uppercase tracking-wide ${it.emphasize ? "text-navy-200" : "text-ink-500"}`}>{it.label}</div>
          <div className={`tnum mt-1 truncate font-display text-xl font-extrabold sm:text-2xl ${it.emphasize ? "text-white" : "text-ink-900 dark:text-ink-100"}`} title={it.value}>
            {it.value}
          </div>
          {it.sub && <div className={`devanagari mt-0.5 text-[13px] ${it.emphasize ? "text-navy-200" : "text-ink-500"}`}>{it.sub}</div>}
        </div>
      ))}
    </div>
  );
}

export function CopyButton({ text, label }: { text: string; label?: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      disabled={!text}
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
          setOk(true);
          setTimeout(() => setOk(false), 1600);
        } catch {}
      }}
      className={`btn-ghost !py-2 !text-xs ${ok ? "!text-green-600" : ""}`}
      aria-label={label ?? "Copy result"}
    >
      {ok ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {ok ? "Copied!" : (label ?? "Copy")}
    </button>
  );
}

export function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-3 sm:grid-cols-2">{children}</div>;
}

export function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink-500">{hint}</span>}
    </label>
  );
}

export function Num({ value, onChange, ...rest }: {
  value: string; onChange: (v: string) => void;
  placeholder?: string; min?: number; step?: number; max?: number;
} & Record<string, unknown>) {
  return (
    <input
      type="number"
      inputMode="decimal"
      className="input"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={rest.placeholder as string | undefined}
      min={rest.min as number | undefined}
      max={rest.max as number | undefined}
      step={rest.step as number | undefined}
    />
  );
}

function bsYearRange(): number[] {
  const out: number[] = [];
  for (let y = 2000; y <= 2090; y++) out.push(y);
  return out;
}
export { bsYearRange };
