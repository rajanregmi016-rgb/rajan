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

const NP_0_99 = ["शून्य", "एक", "दुई", "तीन", "चार", "पाँच", "छ", "सात", "आठ", "नौ", "दश", "एघार", "बाह्र", "तेह्र", "चौध", "पन्ध्र", "सोह्र", "सत्र", "अठार", "उन्नाइस", "बीस", "एक्काइस", "बाइस", "तेइस", "चौबीस", "पच्चीस", "छब्बीस", "सत्ताइस", "अठ्ठाइस", "उनन्तीस", "तीस", "एकतीस", "बत्तीस", "तेत्तीस", "चौँतीस", "पैँतीस", "छत्तीस", "सैँतीस", "अठतीस", "उनन्चालीस", "चालीस", "एकचालीस", "बयालीस", "त्रिचालीस", "चवालीस", "पैँतालीस", "छयालीस", "सतचालीस", "अठचालीस", "उनन्पचास", "पचास", "एकाउन्न", "बाउन्न", "त्रिपन्न", "चउन्न", "पचपन्न", "छपन्न", "सन्ताउन्न", "अन्ठाउन्न", "उनन्साठी", "साठी", "एकसट्ठी", "बयसट्ठी", "त्रिसट्ठी", "चौंसट्ठी", "पैंसट्ठी", "छयसट्ठी", "सतसट्ठी", "अठसट्ठी", "उनन्सत्तरी", "सत्तरी", "एकहत्तर", "बहत्तर", "त्रिहत्तर", "चौहत्तर", "पचहत्तर", "छयहत्तर", "सतहत्तर", "अठहत्तर", "उनासी", "असी", "एकासी", "बयासी", "त्रियासी", "चौरासी", "पचासी", "छयासी", "सतासी", "अठासी", "उनान्नब्बे", "नब्बे", "एकानब्बे", "बयानब्बे", "त्रियानब्बे", "चौरानब्बे", "पन्चानब्बे", "छयानब्बे", "सन्तानब्बे", "अन्ठानब्बे", "उनान्सय"];

const TWO_NP = (n: number): string => NP_0_99[n] ?? String(n);

/** Write an integer in Nepali words (crore/crore/lac/thousand system). */
export function nepaliWords(n: number): string {
  n = Math.round(Math.abs(n));
  if (n === 0) return "शून्य";
  const parts: string[] = [];
  const units: Array<[number, string]> = [
    [100000000000, "खर्ब"], [1000000000, "अर्ब"], [10000000, "करोड"], [100000, "लाख"], [1000, "हजार"],
  ];
  let x = n;
  for (const [d, name] of units) {
    const q = Math.floor(x / d);
    if (q > 0) {
      parts.push(`${q < 100 ? TWO_NP(q) : nepaliWords(q)} ${name}`);
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
    if (q > 0) { parts.push(`${q < 1000 ? enWordsLess1000(q) : englishWordsAsian(q)} ${name}`); x = x % d; }
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
