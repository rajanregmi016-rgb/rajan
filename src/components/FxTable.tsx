import type { FxRate } from "@/lib/server/marketData";

const PRIORITY = ["USD", "EUR", "GBP", "INR", "AUD", "CAD", "JPY", "CNY", "SAR", "QAR", "AED", "MYR", "KRW", "KWD", "BHD", "OMR", "SGD", "HKD", "CHF", "SEK", "DKK", "THB"];

export default function FxTable({ rates, prev }: { rates: FxRate[]; prev?: FxRate[] | null }) {
  const sorted = [...rates].sort((a, b) => {
    const ia = PRIORITY.indexOf(a.iso3), ib = PRIORITY.indexOf(b.iso3);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });
  return (
    <div className="card overflow-x-auto">
      <table className="w-full min-w-[480px] text-sm">
        <thead>
          <tr className="border-b border-ink-200 text-left text-xs uppercase tracking-wide text-ink-500 dark:border-ink-800">
            <th className="px-4 py-3">Currency</th>
            <th className="px-4 py-3 text-right">Unit</th>
            <th className="px-4 py-3 text-right">Buying (Rs)</th>
            <th className="px-4 py-3 text-right">Selling (Rs)</th>
            {prev && <th className="px-4 py-3 text-right">Change</th>}
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => {
            const p = prev?.find((x) => x.iso3 === r.iso3);
            const ch = p ? r.sell - p.sell : null;
            return (
              <tr key={r.iso3} className="border-b border-ink-100 last:border-0 dark:border-ink-800/60">
                <td className="px-4 py-2.5"><span className="font-semibold">{r.iso3}</span> <span className="text-ink-500">{r.name}</span></td>
                <td className="px-4 py-2.5 text-right tnum">{r.unit}</td>
                <td className="px-4 py-2.5 text-right tnum">{r.buy.toFixed(2)}</td>
                <td className="px-4 py-2.5 text-right tnum font-semibold">{r.sell.toFixed(2)}</td>
                {prev && (
                  <td className="px-4 py-2.5 text-right tnum text-ink-600 dark:text-ink-300">
                    {ch == null ? "—" : ch === 0 ? "0.00" : `${ch > 0 ? "▲" : "▼"} ${Math.abs(ch).toFixed(2)}`}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
