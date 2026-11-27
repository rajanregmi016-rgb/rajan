import NepaliDate from "nepali-date-converter";
import { BS_MONTHS, BS_MONTHS_NP, WEEKDAYS_FULL_NP } from "@/lib/nepali";
import { widgetHtml } from "@/lib/server/widget";

export const dynamic = "force-dynamic";
const np = (x: number | string) => String(x).replace(/\d/g, (c) => "०१२३४५६७८९"[Number(c)]);

export async function GET(req: Request) {
  const now = new Date(Date.now() + 345 * 60000);
  const ad = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const n = new NepaliDate(ad);
  const res = widgetHtml(req, {
    title: `${n.getDate()} ${BS_MONTHS[n.getMonth()]} ${n.getYear()}`,
    titleNp: `${np(n.getYear())} ${BS_MONTHS_NP[n.getMonth()]} ${np(n.getDate())}, ${WEEKDAYS_FULL_NP[ad.getDay()]}`,
    rows: [["English date", ad.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" })]],
    note: "Aaja ko miti",
    link: "/aaja-ko-miti",
    linkText: "All Nepali Tools",
  });
  res.headers.set("Cache-Control", "public, s-maxage=600, stale-while-revalidate=600");
  return res;
}
