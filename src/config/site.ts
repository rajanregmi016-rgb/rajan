export const SITE = {
  name: "All Nepali Tools",
  shortName: "AllNepali",
  nameNp: "सबै नेपाली टुल्स",
  domain: "allnepalitools.com",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://allnepalitools.com",
  tagline: "Every Nepali tool, in one place",
  taglineNp: "सबै नेपाली टुल्स, एकै ठाउँमा",
  description:
    "Free online tools for Nepal: Nepali date converter (BS to AD), gold price in Nepal today, USD to NPR, EMI calculator, VAT calculator, SEE GPA calculator, Preeti to Unicode, Nepali calendar and more — fast, accurate and mobile-friendly.",
  descriptionNp:
    "नेपाली मिति परिवर्तक, आजको सुनको भाउ, डलर रेट, EMI क्यालकुलेटर, VAT क्यालकुलेटर, SEE GPA क्यालकुलेटर जस्ता निःशुल्क अनलाइन टुल्स — स्तिथ, सही र मोबाइलमैत्री।",
  email: "support@nepalitools.com",
  locale: "en_US",
  twitter: "@nepalitools",
  founded: 2026,
} as const;

export const SITE_URL = SITE.url.replace(/\/$/, "");

export function absoluteUrl(path = "/") {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
