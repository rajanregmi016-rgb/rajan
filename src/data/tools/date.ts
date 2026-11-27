import type { Tool } from "@/lib/tools";

export const DATE_TOOLS: Tool[] = [
  {
    slug: "bs-to-ad-converter",
    title: "Nepali Date Converter: BS to AD — Bikram Sambat Converter (मिति परिवर्तक)",
    h1: "Nepali Date Converter — BS to AD (Bikram Sambat to Gregorian)",
    h1Np: "नेपाली मिति परिवर्तक — बि.सं. देखि ई.सं.",
    shortTitle: "BS to AD Converter",
    description:
      "Convert Nepali date (Bikram Sambat / BS) to English date (AD) instantly and accurately. Free BS to AD date converter for Nepal with weekday, Nepali digits and years 2000–2090 BS.",
    category: "nepali-date-calendar",
    keywords: [
      "nepali date converter", "bs to ad converter", "bikram sambat converter",
      "मिति परिवर्तक", "नेपाली मिति इंग्लिश मिति", "bs to ad date converter nepal",
    ],
    popular: true,
    trending: true,
    componentKey: "bs2ad",
    renderAs: "tool",
    lastUpdated: "2026-11-08",
    related: ["ad-to-bs-converter", "nepali-calendar", "age-calculator", "date-difference-calculator"],
    content: {
      intro: [
        "A Nepali date converter turns a **Bikram Sambat (BS)** date — the calendar used in Nepal for official documents, citizenship certificates, school certificates and festivals — into the **Gregorian (AD)** date used internationally. It is one of the most searched tools in Nepal because almost every official form, visa application, online account or matrimony site outside Nepal asks for your birth date in AD, while your documents say BS.",
        "This converter supports the full supported range of **BS 2000 to BS 2090** (AD 1943 to 2033), covers all months including the irregular Chaitra month lengths, and shows the correct **weekday** for any valid date — verified against the standard BS calendar data used by Nepali panchangas.",
      ],
      steps: [
        "Select the BS **year** (e.g. 2083) from the dropdown.",
        "Select the BS **month** — Baishakh is month 1, Chaitra is month 12.",
        "Select the **day** of the month.",
        "Press **Convert** — the AD date, weekday, and the day number appear instantly.",
        "Use the **copy** button to paste the English date into any form.",
      ],
      examples: [
        {
          heading: "Popular BS to AD conversions",
          rows: [
            ["BS 2081/09/13", "AD 2025-01-26", "22 Poush? — no: Magh 13, 2081 falls on 26 Jan 2025"],
            ["BS 2052/04/15", "AD 1995-07-31", "Shrawan 15, birth dates on citizenship"],
            ["BS 2083/07/22", "AD 2026-11-08", "today's date at launch"],
          ],
        },
      ],
      faqs: [
        {
          q: "How does BS to AD conversion work?",
          a: "The Bikram Sambat year starts on Baishakh 1, which falls around April 13–14 in the Gregorian calendar. BS months are 29–32 days long and their lengths change year to year, so conversion uses an accurate per-year month-length table (BS 2000–2090) rather than a simple formula.",        },
        {
          q: "What year is 2083 BS in AD?",
          a: "BS 2083 spans April 2026 to mid-April 2027. For example, 1 Baishakh 2083 is 14 April 2026 (AD), and today's Nepali date BS 2083/07/22 equals 8 November 2026 AD.",
        },
        {
          q: "Which BS years does this converter support?",
          a: "BS 2000 to BS 2090 — that covers anyone born in Nepal over roughly the last 90 years, which is the full range of nearly all citizenship and passport documents.",
        },
        {
          q: "Is this the same converter used for official documents?",
          a: "The conversion data (month-length tables) is the same standard table used by Nepali panchang publishers. Always double-check critical dates like certificate stamps against your original document.",
        },
      ],
    },
  },
  {
    slug: "ad-to-bs-converter",
    title: "AD to BS Converter — English Date to Nepali Date (ईंग्लिश मिति परिवर्तक)",
    h1: "AD to BS Converter — Convert English Date to Nepali Date (Bikram Sambat)",
    h1Np: "ईंग्लिश देखि बि.सं. परिवर्तक",
    shortTitle: "AD to BS Converter",
    description:
      "Convert English (Gregorian/AD) date into Nepali date (Bikram Sambat/BS) instantly. Free AD to BS converter for Nepal with weekday and Nepali numerals, supporting AD 1943–2033.",
    category: "nepali-date-calendar",
    keywords: [
      "ad to bs converter", "english to nepali date converter", "nage date", 
      "अंग्रेजी मिति देखि नेपाली मिति", "ad to bs date converter nepal", "date converter nepal",
    ],
    popular: true,
    componentKey: "ad2bs",
    renderAs: "tool",
    lastUpdated: "2026-11-08",
    related: ["bs-to-ad-converter", "nepali-calendar", "age-calculator"],
    content: {
      intro: [
        "An **AD to BS converter** changes an English (Gregorian) date into the corresponding Nepali **Bikram Sambat (BS)** date. It is essential when you need the Nepali date for festivals, government services, tax filing (fiscal years run mid-July in BS), or when a Nepali friend asks आज कति गते भयो? and you only know the English date.",
        "The converter supports AD 1943 to 2033 (BS 2000–2090) and shows the BS date in both **Devanagari (२०८३ असोज २२)** and Latin script so you can use it in any context.",
      ],
      steps: [
        "Enter the **English date** using the date picker (or type it as YYYY-MM-DD).",
        "Press **Convert**.",
        "Read the BS date (year, month, day) plus the weekday.",
        "Copy either the Devanagari or the English form of the BS date.",
      ],
      faqs: [
        {
          q: "What is today's date in Bikram Sambat?",
          a: "Enter today's English date in the tool above — it converts instantly. As a reference, 8 November 2026 AD is 22 Kartik 2083 BS.",
        },
        {
          q: "Why does 1 Baishakh fall on 13 or 14 April?",
          a: "Because the Gregorian calendar has leap years (with a 29 February), the BS new year shifts between 13 and 14 April each year. The converter accounts for this automatically.",
        },
        {
          q: "Can I convert historical AD dates like my parents' birthdate?",
          a: "Yes — the converter covers AD 1943 to 2033 (BS 2000–2090).",
        },
      ],
    },
  },
  {
    slug: "nepali-calendar",
    title: "Nepali Calendar 2083 (बिस नेपाली पात्रो) — Patro with BS & AD Dates",
    h1: "Nepali Calendar (बि.सं. पात्रो) — BS 2083 and Any Year",
    h1Np: "नेपाली पात्रो — बि.सं. २०८३",
    shortTitle: "Nepali Calendar (Patro)",
    description:
      "Nepali Calendar (patro) for Bikram Sambat 2083 and any year from 2000–2090. Month grid with both BS and AD dates, Nepali numerals and weekdays — free mobile-friendly browser tool.",
    category: "nepali-date-calendar",
    keywords: [
      "nepali calendar", "nepali patro", "nepali calendar 2083", "patro 2083",
      "बि.सं. २०८३ को पात्रो", "nepali calendar today", "nepali calendar 2000-2090",
    ],
    popular: true,
    trending: true,
    componentKey: "calendar",
    renderAs: "tool",
    lastUpdated: "2026-11-08",
    related: ["bs-to-ad-converter", "ad-to-bs-converter", "age-calculator"],
    content: {
      intro: [
        "The Nepali calendar — called **patro** (पात्रो) — shows the Bikram Sambat (BS) month grid used across Nepal for festivals, holidays, and the Shrawan-to-Shrawan fiscal year. Each cell shows both the BS day and the matching AD date so both Nepali and English dates are visible at a glance.",
        "Years **BS 2000–2090** are supported, so you can also browse पात्रो for older or future years like 2083, 2084 and beyond.",
      ],
      steps: [
        "Pick the BS **year** and **month** at the top.",
        "The grid shows each day; today's date is highlighted automatically.",
        "Each cell shows the BS day in **Devanagari numerals** (e.g. २५) and the AD date below.",
        "Use it as a quick reference for festival or holiday planning.",
      ],
      faqs: [
        {
          q: "What is Nepali date today?",
          a: "The calendar highlights today automatically when the page loads. Today (8 November 2026) is Kartik 22, 2083 BS.",
        },
        {
          q: "Does the patro include Tihar, Dashain and festival dates?",
          a: "Festival dates change every year because they follow panchanga (tithi) rules. This tool shows the date grid; for festival dates check the current year's official panchanga.",
        },
      ],
    },
  },
  {
    slug: "age-calculator",
    title: "Age Calculator Nepal — Calculate Age from BS or AD Date of Birth",
    h1: "Age Calculator (उमेर गणना) — Age from Bikram Sambat or AD Birth Date",
    h1Np: "उमेर क्यालकुलेटर",
    shortTitle: "Age Calculator (BS/AD)",
    description:
      "Calculate your exact age in years, months and days from a Nepali (BS) or English (AD) date of birth. Free age calculator for Nepal — see total days, weeks and your next birthday.",
    category: "nepali-date-calendar",
    keywords: [
      "age calculator nepal", "age calculator bs", "उमेर गणना", "nepali age calculator",
      "age calculator by date of birth", "मिति अनुसार उमेर",
    ],
    popular: true,
    componentKey: "age",
    renderAs: "tool",
    lastUpdated: "2026-11-08",
    related: ["bs-to-ad-converter", "date-difference-calculator", "nepali-calendar"],
    content: {
      intro: [
        "This **age calculator for Nepal** tells you exactly how old you are in years, months and days — starting from a **Bikram Sambat (BS)** birth date (for example from your birth certificate or citizenship) or an **AD** date. Because BS months vary from 29 to 32 days, age from a BS date cannot be computed correctly with a plain English calendar; this tool converts BS internally so the month/day arithmetic is exact.",
        "You also get helpful totals: total **days** lived, total **weeks**, and when your **next birthday** falls (in BS and AD) — handy for passport appointments, marriage services, school admission and Loksewa application age limits.",
      ],
      steps: [
        "Choose whether your **date of birth** is in BS or AD.",
        "Pick the birth date with the dropdowns/date picker.",
        "Press **Calculate** — the exact age shows in years, months and days.",
        "Check the **next birthday** line for upcoming BS and AD dates.",
      ],
      examples: [
        {
          heading: "Worked example",
          rows: [
            ["DOB: BS 2052/04/15 (31 July 1995)", "Today: BS 2083/07/22", "Age: 31 years, 3 months, 7 days"],
          ],
        },
      ],
      faqs: [
        {
          q: "How is age counted in Nepal?",
          a: "Nepal uses the same completed-years rule as most of the world: your age increases on your BS birthday. Government services list age limits in BS years (e.g. 18–35 for Loksewa), and how your BS birth year maps across the fiscal-year cutoff matters for exam eligibility.",
        },
        {
          q: "Can I use my citizenship-certificate BS date?",
          a: "Yes — enter the BS date from the certificate directly; the tool converts it internally to AD accurately for the day/month arithmetic.",
        },
        {
          q: "Why do some calculators show my age a few days differently?",
          a: "Tools that treat BS months as 30 days, or that ignore kitchen (Chaitra) month length, drift by several days. This tool uses per-year BS month tables, so the result matches the official calendar.",
        },
      ],
    },
  },
  {
    slug: "date-difference-calculator",
    title: "Date Difference Calculator Nepal — Days Between Two Dates (BS or AD)",
    h1: "Date Difference Calculator — Days Between Two Dates (BS or AD)",
    h1Np: "मिति अन्तर क्यालकुलेटर",
    shortTitle: "Date Difference (BS/AD)",
    description:
      "Find the exact number of days, months and years between two dates in Bikram Sambat (BS) or Gregorian (AD) calendars. Free date difference calculator for Nepal.",
    category: "nepali-date-calendar",
    keywords: [
      "date difference calculator", "days between dates nepal", "मिति अन्तर",
      "date calculator nepal", "how many days between two dates",
    ],
    componentKey: "dateDiff",
    renderAs: "tool",
    lastUpdated: "2026-11-08",
    related: ["age-calculator", "bs-to-ad-converter"],
    content: {
      intro: [
        "The **date difference calculator** answers the everyday questions Nepalis ask: कति दिन बाँकी? — days left until a visa interview, property tax due date, exam application deadline, or the number of days between a visa issue date and today. You can enter both dates in **BS**, both in **AD**, or one in each — the tool converts them to a common calendar first so the result is exact.",
      ],
      steps: [
        "Choose the calendar type (BS or AD) for the **first** date and pick it.",
        "Choose the calendar type and pick the **second** date.",
        "Press **Calculate difference**.",
        "Read the result in days, and also in completed years/months/days.",
      ],
      examples: [
        {
          heading: "Common uses",
          rows: [
            ["Visa validity check", "Entry date → exit date", "Days remaining in Nepal"],
            ["Government paperwork", "Submission date → today", "Days since submission"],
            ["Mortgage/EMI span", "Approval date → first EMI", "Gap in days"],
          ],
        },
      ],
      faqs: [
        {
          q: "Does the tool count the end date itself?",
          a: "By default it counts the gap from the first date to the second (end date exclusive). If you need inclusive counting, add one day to the result.",
        },
        {
          q: "Can I mix BS and AD dates?",
          a: "Yes — pick the calendar separately for each date. Under the hood both convert to Gregorian days, then the difference is computed.",
        },
      ],
    },
  },
];

import type { Category } from "@/lib/tools";
