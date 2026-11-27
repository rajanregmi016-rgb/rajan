import { getLiveRates } from "@/lib/server/marketData";
import { widgetHtml } from "@/lib/server/widget";

export const revalidate = 1800;
const rs = (v: number) => `Rs ${Math.round(v).toLocaleString("en-IN")}`;

export async function GET(req: Request) {
  const r = await getLiveRates();
  return widgetHtml(req, {
    title: "Gold price in Nepal today",
    titleNp: "आजको सुन चाँदीको भाउ",
    rows: [["Fine gold / tola", rs(r.gold.fineTola)], ["Fine gold / 10 g", rs(r.gold.tenGram)], ["Silver / tola", rs(r.gold.silverTola)]],
    note: `FENEGOSIDA, ${isNaN(Date.parse(r.gold.updated)) ? r.gold.updated : new Date(r.gold.updated).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kathmandu" })}`,
    link: "/gold-price-in-nepal",
    linkText: "All Nepali Tools",
  });
}
