import { getLiveRates } from "@/lib/server/marketData";
import { widgetHtml } from "@/lib/server/widget";

export const revalidate = 1800;

export async function GET(req: Request) {
  const r = await getLiveRates();
  const want = ["USD", "EUR", "GBP", "AUD", "INR", "SAR", "QAR", "AED"];
  const rows: [string, string][] = (r.fx?.rates || [])
    .filter((x) => want.includes(x.iso3))
    .sort((a, b) => want.indexOf(a.iso3) - want.indexOf(b.iso3))
    .map((x) => [`${x.unit} ${x.iso3}`, `Rs ${x.sell.toFixed(2)}`]);
  if (!rows.length) rows.push(["1 USD", `Rs ${r.forex.fallbackUsdNpr.toFixed(2)}`]);
  return widgetHtml(req, {
    title: "Exchange rate today",
    titleNp: "आजको विनिमय दर (बिक्री)",
    rows,
    note: `Nepal Rastra Bank${r.fx?.date ? `, ${r.fx.date}` : ""}`,
    link: "/exchange-rate",
    linkText: "All Nepali Tools",
  });
}
