import NepaliDate from "nepali-date-converter";
import { BS_MONTHS_NP, toNpDigits, WEEKDAYS_FULL_NP } from "@/lib/nepali";

export function bsTodayLabel(): string {
  try {
    const nd = new NepaliDate(new Date());
    const js = nd.toJsDate();
    const y = nd.getYear(), m = nd.getMonth(), d = nd.getDate();
    void js;
    return `आज बि.सं. ${WEEKDAYS_FULL_NP[nd.toJsDate().getUTCDay()]}बार — ${toNpDigits(y)} ${BS_MONTHS_NP[m]} ${toNpDigits(d)}`;
  } catch {
    return "";
  }
}
