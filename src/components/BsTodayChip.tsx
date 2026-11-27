"use client";

import { useEffect, useState } from "react";
import NepaliDate from "nepali-date-converter";
import { BS_MONTHS, BS_MONTHS_NP, WEEKDAYS_EN, toNpDigits } from "@/lib/nepali";
import nepaliDateConverterVersion from "nepali-date-converter/package.json";

void nepaliDateConverterVersion;

/**
 * Renders the current Bikram Sambat date, English-first with a Devanagari
 * accent. Runs client-side so the date stays correct after deploys; the server
 * renders a placeholder with suppressHydrationWarning to avoid a mismatch.
 */
export function BsTodayChip({ className }: { className?: string }) {
  const [label, setLabel] = useState<string>("");

  useEffect(() => {
    const update = () => {
      try {
        // Get the real Nepal wall-clock date (UTC+05:45) regardless of the
        // visitor's machine timezone, then convert that AD date to BS.
        const parts = new Intl.DateTimeFormat("en-CA", {
          timeZone: "Asia/Kathmandu",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        }).formatToParts(new Date());
        const get = (t: string) => Number(parts.find((p) => p.type === t)?.value);
        const Y = get("year"), M = get("month"), D = get("day");
        if (!Y || !M || !D) throw new Error("no parts");
        const nd = new NepaliDate(new Date(Y, M - 1, D, 12)); // local noon of that AD date
        const y = nd.getYear(), m = nd.getMonth(), d = nd.getDate();
        setLabel(
          `Today (BS): ${d} ${BS_MONTHS[m]} ${y} — ` +
            `${toNpDigits(y)} ${BS_MONTHS_NP[m]} ${toNpDigits(d)}, ${WEEKDAYS_EN[nd.getDay()]}`
        );
      } catch {
        setLabel("Today: Nepali calendar (BS)");
      }
    };
    update();
    const t = setInterval(update, 60_000);
    return () => clearInterval(t);
  }, []);

  return (
    <span className={className} suppressHydrationWarning>
      {label || "Today: Nepali calendar (BS)"}
    </span>
  );
}
