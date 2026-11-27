// Nepal keyword research dataset (seed).
// Volume/difficulty are directional estimates based on Nepali search behaviour;
// the admin SEO panel uses them to surface opportunities (gap = no tool yet).
// Update quarterly; never publish these internal notes on public pages.

export type KeywordStatus = "covered" | "planned" | "backlog";

export interface KeywordIdea {
  keyword: string;
  keywordNp?: string;
  intent: "tool" | "info" | "mixed";
  estMonthlyVolume: 1 | 2 | 3 | 4 | 5; // 5 = highest demand band
  status: KeywordStatus;
  toolSlug?: string;
  note?: string;
}

export const KEYWORD_IDEAS: KeywordIdea[] = [
  // Date & calendar
  { keyword: "nepali date converter", keywordNp: "मिति परिवर्तक", intent: "tool", estMonthlyVolume: 5, status: "covered", toolSlug: "bs-to-ad-converter" },
  { keyword: "bs to ad converter", intent: "tool", estMonthlyVolume: 5, status: "covered", toolSlug: "bs-to-ad-converter" },
  { keyword: "ad to bs converter", intent: "tool", estMonthlyVolume: 5, status: "covered", toolSlug: "ad-to-bs-converter" },
  { keyword: "nepali calendar 2083", keywordNp: "नेपाली पात्रो २०८३", intent: "mixed", estMonthlyVolume: 5, status: "covered", toolSlug: "nepali-calendar" },
  { keyword: "age calculator nepal", intent: "tool", estMonthlyVolume: 4, status: "covered", toolSlug: "age-calculator" },
  { keyword: "nepali unicode typing", intent: "tool", estMonthlyVolume: 4, status: "covered", toolSlug: "nepali-typing-online" },
  { keyword: "nepali patro 2084", intent: "mixed", estMonthlyVolume: 3, status: "backlog", note: "Seasonal spike each Baishakh — keep calendar tool linked." },
  // Finance & currency
  { keyword: "usd to npr", keywordNp: "डलर रेट", intent: "tool", estMonthlyVolume: 5, status: "covered", toolSlug: "usd-to-npr" },
  { keyword: "dollar rate in nepal today", intent: "info", estMonthlyVolume: 4, status: "covered", toolSlug: "usd-to-npr" },
  { keyword: "emi calculator nepal", intent: "tool", estMonthlyVolume: 4, status: "covered", toolSlug: "emi-calculator-nepal" },
  { keyword: "vat calculator nepal", intent: "tool", estMonthlyVolume: 3, status: "covered", toolSlug: "vat-calculator-nepal" },
  { keyword: "income tax calculator nepal", intent: "tool", estMonthlyVolume: 3, status: "covered", toolSlug: "income-tax-calculator-nepal" },
  { keyword: "nrb exchange rate today", intent: "info", estMonthlyVolume: 4, status: "backlog", note: "Needs official NRB API integration; indicative rate page ships first." },
  { keyword: "interest calculator nepal", intent: "tool", estMonthlyVolume: 2, status: "covered", toolSlug: "compound-interest-calculator" },
  { keyword: "salary to ctc calculator nepal", intent: "tool", estMonthlyVolume: 1, status: "backlog" },
  // Gold & silver
  { keyword: "gold price in nepal today", keywordNp: "आजको सुनको भाउ", intent: "info", estMonthlyVolume: 5, status: "covered", toolSlug: "gold-price-in-nepal" },
  { keyword: "silver price in nepal today", keywordNp: "आजको चाँदीको भाउ", intent: "info", estMonthlyVolume: 3, status: "backlog", note: "Add dedicated silver landing page with per-tola calculator." },
  { keyword: "gold rate nepal today 1 tola", intent: "info", estMonthlyVolume: 3, status: "covered", toolSlug: "gold-price-in-nepal" },
  // SEE & education
  { keyword: "see gpa calculator", keywordNp: "SEE GPA क्यालकुलेटर", intent: "tool", estMonthlyVolume: 4, status: "covered", toolSlug: "see-gpa-calculator" },
  { keyword: "see result 2083", intent: "info", estMonthlyVolume: 4, status: "backlog", note: "Result-day spike — publish explainer + link to official portal, never fake results." },
  { keyword: "gpa to percentage nepal", intent: "mixed", estMonthlyVolume: 2, status: "backlog" },
  { keyword: "loksewa syllabus 2083", intent: "info", estMonthlyVolume: 3, status: "backlog", note: "High-value content with competition; needs original writing." },
  // Language & text
  { keyword: "preeti to unicode", keywordNp: "युनिकोड त प्रित", intent: "tool", estMonthlyVolume: 4, status: "covered", toolSlug: "preeti-to-unicode" },
  { keyword: "nepali unicode converter", intent: "tool", estMonthlyVolume: 4, status: "planned", toolSlug: "preeti-to-unicode" },
  { keyword: "nepali typing offline software", intent: "info", estMonthlyVolume: 2, status: "backlog" },
  // Everyday & info
  { keyword: "neplse ipo result check", keywordNp: "आइपो नतिजा", intent: "info", estMonthlyVolume: 3, status: "backlog", note: "NEPSE/IPO info cluster — high traffic, needs disclaimer + official links." },
  { keyword: "weather kathmandu today", intent: "info", estMonthlyVolume: 3, status: "backlog", note: "Weather info page with live API; low-content risk — needs real data." },
  { keyword: "load shedding schedule", intent: "info", estMonthlyVolume: 1, status: "backlog", note: "Legacy keyword, low value now." },
  { keyword: "rrr tika date 2083", intent: "info", estMonthlyVolume: 2, status: "backlog", note: "Government scheme dates — verify via official notices before publishing." },
  { keyword: "k fine gold 25k price", intent: "info", estMonthlyVolume: 1, status: "backlog" },
];
