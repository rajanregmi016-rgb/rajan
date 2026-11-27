// Nepali language & calendar helpers — digits, months, weekdays, number-to-words.

export const BS_MONTHS = [
  "Baishakh", "Jestha", "Ashadh", "Shrawan", "Bhadra", "Ashwin",
  "Kartik", "Mangsir", "Poush", "Magh", "Falgun", "Chaitra",
];
export const BS_MONTHS_NP = [
  "वैशाख", "जेठ", "असार", "साउन", "भदौ", "असोज",
  "कार्तिक", "मंसिर", "पुष", "माघ", "फागुन", "चैत",
];
export const AD_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
export const WEEKDAYS_NP = ["आइत", "सोम", "मंगल", "बुध", "बिहि", "शुक्र", "शनि"];
export const WEEKDAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const WEEKDAYS_FULL_NP = ["आइतबार", "सोमबार", "मंगलबार", "बुधबार", "बिहीबार", "शुक्रबार", "शनिबार"];

const ONES_NP = ["शून्य", "एक", "दुई", "तीन", "चार", "पाँच", "छ", "सात", "आठ", "नौ", "दस",
  "एघार", "बाह्र", "तेह्र", "चौध", "पन्ध्र", "सोह्र", "सत्र", "अठार", "उन्नाइस", "बीस"];
const TENS_NP = ["", "बीस", "तीस", "चालीस", "पचास", "साठी", "सत्तरी", "अस्सी", "नब्बे"];

/** Convert ASCII digits in a string to Devanagari digits. */
export function toNpDigits(s: string | number): string {
  return String(s).replace(/[0-9]/g, (d) => "०१२३४५६७८९"[Number(d)]);
}

export function toEnDigits(s: string): string {
  return s.replace(/[०-९]/g, (d) => String("०१२३४५६७८९".indexOf(d)));
}

/** Format a Nepali-style grouped number: 2,83,000 → "२,८३,०००". */
export function formatNpNumber(n: number, nepaliDigits = true): string {
  const v = Math.round(Math.abs(n)).toString();
  if (v.length <= 3) return (n < 0 ? "-" : "") + (nepaliDigits ? toNpDigits(v) : v);
  const last3 = v.slice(-3);
  const rest = v.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  const grouped = `${rest},${last3}`;
  return (n < 0 ? "-" : "") + (nepaliDigits ? toNpDigits(grouped) : grouped);
}

/** South-Asian lac/crore grouping in ASCII digits (used before Nepali digit conv). */
export function groupAsian(n: number): string {
  const sign = n < 0 ? "-" : "";
  const v = Math.round(Math.abs(n)).toString();
  if (v.length <= 3) return sign + v;
  const last3 = v.slice(-3);
  const rest = v.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  return sign + `${rest},${last3}`;
}

const TWO_NP = (n: number): string => {
  if (n <= 20) return ONES_NP[n];
  const t = Number(String(n)[0]);
  const o = Number(String(n)[1]);
  if (o === 0) return TENS_NP[t];
  return ONES_NP[o] + " " + TENS_NP[t];
};

/** Write an integer in Nepali words (crore/crore/lac/thousand system). */
export function nepaliWords(n: number): string {
  n = Math.round(Math.abs(n));
  if (n === 0) return "शून्य";
  const parts: string[] = [];
  const units: Array<[number, string]> = [
    [1000000000, "अर्ब"], [10000000, "कोटि"], [100000, "लाख"], [1000, "हजार"],
  ];
  let x = n;
  for (const [d, name] of units) {
    const q = Math.floor(x / d);
    if (q > 0) {
      parts.push(q <= 1999 && d >= 100000000 ? `${qToWords999(q)} ${name}` : `${q < 100 ? TWO_NP(q) : qToWords999(q)} ${name}`);
      x = x % d;
    }
  }
  if (x > 0) parts.push(x < 100 ? TWO_NP(x) : qToWords999(x));
  return parts.join(" ");
}
const qToWords999 = (n: number): string => {
  const h = Math.floor(n / 100);
  const r = n % 100;
  const s: string[] = [];
  if (h > 0) s.push(ONES_NP[h] + " सय");
  if (r > 0) s.push(TWO_NP(r));
  return s.join(" ");
};

const EN_ONES = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];
const EN_PREF = ["twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];

const enWordsLess1000 = (n: number): string => {
  const h = Math.floor(n / 100), r = n % 100;
  const s: string[] = [];
  if (h) s.push(EN_ONES[h] + " hundred" + (r ? " and" : ""));
  if (r <= 20 && r > 0) s.push(EN_ONES[r]);
  else if (r > 20) {
    const o = r % 10;
    s.push(EN_PREF[Math.floor(r / 10) - 2] + (o ? "-" + EN_ONES[o] : ""));
  }
  return s.join(" ");
};

/** English words using lakh/crore (South-Asian) grouping. */
export function englishWordsAsian(n: number): string {
  n = Math.round(Math.abs(n));
  if (n === 0) return "zero";
  const parts: string[] = [];
  const units: Array<[number, string]> = [[1000000000, "arba"], [10000000, "crore"], [100000, "lakh"], [1000, "thousand"]];
  let x = n;
  for (const [d, name] of units) {
    const q = Math.floor(x / d);
    if (q > 0) { parts.push(`${q < 100 ? EN_ONES[q] : enWordsLess1000(Math.min(q, 999))} ${name}`); x = x % d; }
  }
  if (x > 0) parts.push(enWordsLess1000(x));
  return parts.join(" ");
}

/** ₹ / रु amount in words (rupees & paisa). */
export function moneyInNepaliWords(amount: number): string {
  const rupees = Math.floor(Math.abs(amount));
  const paisa = Math.round((Math.abs(amount) - rupees) * 100);
  const r = nepaliWords(rupees);
  if (paisa > 0) return `${r} रुपैंया ${TWO_NP(paisa)} पैसा`;
  return `${r} रुपैंया मात्र`;
}
