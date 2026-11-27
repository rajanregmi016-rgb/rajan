"use client";

import { useMemo, useState } from "react";
import { formatNpNumber, groupAsian, toNpDigits, englishWordsAsian, nepaliWords } from "@/lib/nepali";
import { Field, Num, ResultCard, ToolShell, CopyButton } from "@/components/tools/ui";
import type { RatesData } from "@/lib/rates";

/* ---------- Gold & silver ---------- */
export function GoldTool({ rates }: { rates: RatesData }) {
  const [metal, setMetal] = useState<"fine" | "tejabi" | "18k" | "silver">("fine");
  const [unit, unitSet] = useState<"tola" | "gram" | "10g" | "lal">("tola");
  const [weight, setWeight] = useState("1");

  const pricePerGram = useMemo(() => {
    // derive per-gram from per-tola (1 tola = 11.6638 g)
    return rates.gold.fineTola / 11.6638;
  }, [rates]);

  const out = useMemo(() => {
    const w = Number(weight);
    if (!Number.isFinite(w) || w <= 0) return null;
    const grams = unit === "tola" ? w * 11.6638 : unit === "10g" ? w * 10 : unit === "lal" ? w * 0.0116638 : w;
    const factor: Record<string, number> = { fine: 1, tejabi: rates.gold.tejabiTola / rates.gold.fineTola, "18k": 0.75, silver: rates.gold.silverTola / (pricePerGram * 11.6638) };
    const base24 = grams * pricePerGram;
    const value = metal === "silver" ? grams * (rates.gold.silverTola / 11.6638) : base24 * (factor[metal] ?? 1);
    return { grams, value };
  }, [weight, unit, metal, pricePerGram, rates]);

  const label = { fine: "Fine Gold (24K, छापावाल)", tejabi: "Tejabi (22K)", "18k": "18K Gold", silver: "Silver (चाँदी)" }[metal];

  return (
    <ToolShell>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ResultRow label="Fine gold / tola" value={`Rs ${formatNpNumber(rates.gold.fineTola)}`} />
        <ResultRow label="Tejabi gold / tola" value={`Rs ${formatNpNumber(rates.gold.tejabiTola)}`} />
        <ResultRow label="Silver / tola" value={`Rs ${formatNpNumber(rates.gold.silverTola)}`} />
        <ResultRow label="Rate updated" value={new Date(rates.gold.updated).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <Field label="Metal">
          <select className="input" value={metal} onChange={(e) => setMetal(e.target.value as typeof metal)}>
            {(["fine", "tejabi", "18k", "silver"] as const).map((m) => (
              <option key={m} value={m}>{ { fine: "Fine gold 24K", tejabi: "Tejabi 22K", "18k": "18K gold", silver: "Silver" }[m] }</option>
            ))}
          </select>
        </Field>
        <Field label="Unit">
          <select className="input" value={unit} onChange={(e) => unitSet(e.target.value as typeof unit)}>
            <option value="tola">Tola (तोला)</option>
            <option value="gram">Gram (ग्राम)</option>
            <option value="10g">10 grams</option>
            <option value="lal">Lal (लाल)</option>
          </select>
        </Field>
        <Field label="Weight" hint={`≈ ${out ? toNpDigits(Math.round(out.grams * 100) / 100) : "—"} ग्राम`}>
          <Num value={weight} onChange={setWeight} min={0} step={0.01} />
        </Field>
      </div>
      <div className="mt-4">
        <ResultCard items={[
          { label: `${label} — estimated value`, value: out ? `Rs ${formatNpNumber(out.value)}` : "—", sub: `${unit} × ${weight || "0"}`, emphasize: true },
          { label: "Total weight", value: out ? `${out.grams.toFixed(3)} g` : "—", sub: `${unit} → gram` },
        ]} />
      </div>
      <p className="mt-3 text-xs text-ink-400">
        Values use the stored FENEGOSIDA reference rate. Making charges, VAT and stones are extra — confirm with your dealer before any transaction.
      </p>
    </ToolShell>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-ink-200 bg-ink-50/70 p-3 dark:border-ink-800 dark:bg-ink-800/40">
      <div className="text-[11px] font-semibold uppercase tracking-wide text-ink-500">{label}</div>
      <div className="mt-0.5 text-lg font-bold text-ink-900 dark:text-ink-100" style={{ fontFamily: "inherit" }}>{value}</div>
    </div>
  );
}

/* ---------- Number → words ---------- */
export function NumWordsTool() {
  const [nStr, setNStr] = useState("283000");
  const out = useMemo(() => {
    const n = Number(nStr.replace(/,/g, ""));
    if (!Number.isFinite(n) || Math.abs(n) > 9.999e18) return null;
    return { nepali: nepaliWords(n), asian: englishWordsAsian(n) };
  }, [nStr]);
  return (
    <ToolShell>
      <Field label="Number (bytes/paisa accepted via decimal)" hint="Up to nearly 20 digits — e.g. 283000, 150582, 123.45">
        <input className="input" inputMode="decimal" value={nStr} onChange={(e) => setNStr(e.target.value)} placeholder="283000" />
      </Field>
      {out !== null && (
        <ResultCard items={[
          { label: "In Nepali words", value: `${out.nepali} रुपैंया`, emphasize: true },
          { label: "In English (lakh/crore style)", value: out.asian },
        ]} />
      )}
      {out && (
        <div className="mt-3">
          <CopyButton text={`${out.nepali} रुपैंया मात्र`} label="Copy cheque line (रुपैंया … मात्र)" />
        </div>
      )}
    </ToolShell>
  );
}

/* ---------- SEE GPA ---------- */
const GP_SCALE: Array<{ grade: string; gp: number }> = [
  { grade: "A+", gp: 4.0 }, { grade: "A", gp: 3.6 }, { grade: "B+", gp: 3.2 },
  { grade: "B", gp: 2.8 }, { grade: "C+", gp: 2.4 }, { grade: "C", gp: 2.0 }, { grade: "D", gp: 1.6 },
];

export function SeeGpaTool() {
  const defaultSubjects = ["Nepali", "English", "Mathematics", "Science", "Social Studies", "Optional"];
  const [subjects, setSubjects] = useState(defaultSubjects.map(() => "A" as string));
  const handle = (i: number, v: string) => setSubjects((s) => s.map((x, j) => (j === i ? v : x)));
  const count = subjects.length;

  const out = useMemo(() => {
    const gps = subjects.map((g) => GP_SCALE.find((s) => s.grade === g)?.gp ?? 0);
    const avg = count ? gps.reduce((a, b) => a + b, 0) / count : 0;
    return { avg, gps };
  }, [subjects, count]);

  return (
    <ToolShell>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {defaultSubjects.map((name, i) => {
          const value = subjects[i];
          return (
            <Field key={name} label={name}>
              <div className="flex items-center gap-2">
                <select className="input" aria-label={`Grade for ${name}`} value={value} onChange={(e) => handle(i, e.target.value)}>
                  {GP_SCALE.map((g) => <option key={g.grade} value={g.grade}>{g.grade} ({g.gp})</option>)}
                </select>
                <span className="w-10 text-right text-sm font-bold text-brand-700 dark:text-brand-300">{out.gps[i].toFixed(1)}</span>
              </div>
            </Field>
          );
        })}
      </div>
      <ResultCard items={[
        { label: "SEE GPA", value: out.avg.toFixed(2), sub: "NEB letter-grade average", emphasize: true },
        { label: "Subjects counted", value: toNpDigits(count), sub: "average of entered grade points" },
        { label: "Letter grade", value: out.avg >= 3.6 ? "A" : out.avg >= 3.2 ? "A-ish" : out.avg >= 2.8 ? "B+" : out.avg >= 2 ? "B" : "C+", sub: "rough band" },
      ]} />
      <p className="mt-3 text-xs text-ink-400">
        GPA = average of your subjects' grade points (NEB letter-grade system). Optional-subject weighting rules vary by school — your official marksheet is final.
      </p>
    </ToolShell>
  );
}
