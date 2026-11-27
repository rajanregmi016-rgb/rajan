"use client";

import { useMemo, useState } from "react";

export type Point = { d: string; label: string; v: number };

const W = 800, H = 260, PL = 56, PR = 12, PT = 14, PB = 28;

/** Single-series line chart with range buttons and a hover crosshair. */
export default function RateChart({ points, title, prefix = "Rs ", decimals = 2, ranges = [30, 90, 365] }: {
  points: Point[];
  title: string;
  prefix?: string;
  decimals?: number;
  ranges?: number[];
}) {
  const avail = ranges.filter((r, i) => i === 0 || points.length > ranges[i - 1]);
  const [range, setRange] = useState(avail[0] ?? 30);
  const [hover, setHover] = useState<number | null>(null);
  const data = useMemo(() => points.slice(-range), [points, range]);

  const geo = useMemo(() => {
    if (data.length < 2) return null;
    const vs = data.map((p) => p.v);
    let lo = Math.min(...vs), hi = Math.max(...vs);
    const pad = (hi - lo) * 0.1 || hi * 0.01;
    lo -= pad; hi += pad;
    const x = (i: number) => PL + (i / (data.length - 1)) * (W - PL - PR);
    const y = (v: number) => PT + (1 - (v - lo) / (hi - lo)) * (H - PT - PB);
    const ticks = Array.from({ length: 4 }, (_, i) => lo + ((hi - lo) * (i + 0.5)) / 4);
    const path = data.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.v).toFixed(1)}`).join("");
    return { x, y, ticks, path };
  }, [data]);

  const fmt = (v: number) => `${prefix}${v.toLocaleString("en-IN", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;

  if (!geo) return null;
  const first = data[0].v, last = data[data.length - 1].v, ch = last - first;
  const h = hover != null ? data[hover] : null;

  const onMove = (e: React.PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    const i = Math.round(((px - PL) / (W - PL - PR)) * (data.length - 1));
    setHover(Math.max(0, Math.min(data.length - 1, i)));
  };

  return (
    <figure className="card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <figcaption>
          <p className="text-sm font-semibold text-ink-700 dark:text-ink-200">{title}</p>
          <p className="mt-1 text-2xl font-extrabold tnum">{fmt(h ? h.v : last)}</p>
          <p className="text-xs text-ink-500">
            {h ? h.label : <>{ch >= 0 ? "▲" : "▼"} {fmt(Math.abs(ch))} over {data.length} days</>}
          </p>
        </figcaption>
        {avail.length > 1 && (
          <div className="flex gap-1" role="group" aria-label="Time range">
            {avail.map((r) => (
              <button key={r} type="button" onClick={() => { setRange(r); setHover(null); }}
                className={`rounded-full px-3 py-1 text-xs font-semibold ${r === range ? "bg-ink-900 text-white dark:bg-white dark:text-ink-900" : "bg-ink-100 text-ink-700 dark:bg-ink-800 dark:text-ink-200"}`}
                aria-pressed={r === range}>
                {r >= 365 ? "1 year" : `${r} days`}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="relative mt-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full touch-none select-none" role="img"
          aria-label={`${title}: from ${fmt(first)} on ${data[0].label} to ${fmt(last)} on ${data[data.length - 1].label}`}
          onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
          {geo.ticks.map((t) => (
            <g key={t}>
              <line x1={PL} x2={W - PR} y1={geo.y(t)} y2={geo.y(t)} className="stroke-ink-200 dark:stroke-ink-800" strokeWidth={1} />
              <text x={PL - 8} y={geo.y(t) + 4} textAnchor="end" className="fill-ink-500 text-[11px]">{t.toLocaleString("en-IN", { maximumFractionDigits: t > 1000 ? 0 : 1 })}</text>
            </g>
          ))}
          {[0, Math.floor((data.length - 1) / 2), data.length - 1].map((i, k) => (
            <text key={i} x={geo.x(i)} y={H - 8} textAnchor={k === 0 ? "start" : k === 2 ? "end" : "middle"} className="fill-ink-500 text-[11px]">{data[i].d}</text>
          ))}
          <path d={geo.path} fill="none" className="stroke-brand-600 dark:stroke-brand-400" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
          {h && hover != null && (
            <g>
              <line x1={geo.x(hover)} x2={geo.x(hover)} y1={PT} y2={H - PB} className="stroke-ink-400" strokeWidth={1} strokeDasharray="3 3" />
              <circle cx={geo.x(hover)} cy={geo.y(h.v)} r={5} className="fill-brand-600 stroke-white dark:fill-brand-400 dark:stroke-ink-900" strokeWidth={2} />
            </g>
          )}
        </svg>
      </div>
    </figure>
  );
}
