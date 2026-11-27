import type { Tool } from "@/lib/tools";

export const GOLD_TOOLS: Tool[] = [
  {
    slug: "gold-price-in-nepal",
    title: "Gold Price in Nepal Today — FENEGOSIDA Rate per Tola (आजको सुनको भाउ)",
    h1: "Gold Price in Nepal Today (आजको सुनको भाउ) — Fine & Tejabi per Tola",
    h1Np: "आजको सुन र चाँदीको भाउ",
    shortTitle: "Gold Price Nepal",
    description:
      "Today's gold price in Nepal — fine gold (24K) and tejhabi (22K) rate per tola, silver rate, plus a gold value calculator by tola, gram and lal. Free, mobile-friendly.",
    category: "gold-silver-price",
    keywords: [
      "gold price in nepal today", "gold rate nepal", "आजको सुनको भाउ",
      "sunto bhau aajako", "fine gold price nepal per tola", "silver rate nepal today",
    ],
    popular: true,
    trending: true,
    componentKey: "gold",
    renderAs: "tool",
    lastUpdated: "2026-11-08",
    sourceNote:
      "Rate values shown are reference values stored by the site admin after checking the FENEGOSIDA daily fixing. Gold is a price-sensitive commodity — always confirm the live rate with your dealer before any transaction.",
    related: ["usd-to-npr", "land-area-converter"],
    content: {
      intro: [
        "Gold in Nepal is quoted **per tola** (1 tola = 11.6638 grams) in two standards: **fine gold** (9999, 24K, also called hallmark/chhapawal) used for jewellery-grade investment, and **tejabi** (22K), the traditional standard most local jewellers sell. The official daily rate is fixed by **FENEGOSIDA** (the Federation of Nepal Gold & Silver Dealers' Associations) each working day after checking the international bullion price and Nepal Rastra Bank's USD rate.",
        "This page shows the reference rate and includes a **gold value calculator**: enter any weight in tolas, grams or **lal** (1 lal = 0.01166 g) and pick a purity (fine/tejabi/18K) to see the estimated value in NPR.",
      ],
      steps: [
        "Check the **rate panel** at the top — fine, tejhabi and silver per tola, with the rate date.",
        "In the calculator, choose the **unit** (tola, gram, 10 g or lal).",
        "Enter the **weight**.",
        "Pick the **purity** (Fine 24K, Tejabi 22K or 18K).",
        "Press **Calculate** to see the estimated value in rupees.",
      ],
      examples: [
        {
          heading: "Reference rate snapshot (as of the stored rate date)",
          rows: [
            ["Fine gold 24K", "Rs 2,83,000", "per tola"],
            ["Tejabi 22K", "Rs 2,82,300", "per tola"],
            ["Silver", "Rs 3,810", "per tola"],
            ["Fine gold 24K", "Rs 24,263", "per gram"],
          ],
        },
      ],
      faqs: [
        {
          q: "What is the gold price in Nepal today?",
          a: "The most recent reference rate appears at the top of this page (with the rate date). FENEGOSIDA publishes the official rate daily — verify it with your jeweller before buying, because rates can move by thousands of rupees in a single week.",
        },
        {
          q: "What is the difference between fine gold and tejhabi gold?",
          a: "Fine gold is 9999 purity (24K). Tejabi is 22K — slightly lower purity with more alloy — and is the standard used in most Nepali jewellery. The per-tola prices track close together.",
        },
        {
          q: "How many grams is one tola of gold?",
          a: "One tola = 11.6638 grams. At Rs 2,83,000 per tola of fine gold, one gram works out to about Rs 24,263.",
        },
        {
          q: "Is buying gold a good investment in Nepal?",
          a: "Gold has historically held value in Nepal and is a common hedge, but it carries price and purity risks. Buy hallmark gold with an invoice, and remember this page is educational information — not financial advice.",
        },
      ],
    },
  },
];

export const MATH_EDU_TOOLS: Tool[] = [
  {
    slug: "percentage-calculator",
    title: "Percentage Calculator — X% of Y, % Change & Marks Percentage",
    h1: "Percentage Calculator — Percent Of, Percent Change & Marks %",
    h1Np: "प्रतिशत क्यालकुलेटर",
    shortTitle: "Percentage Calculator",
    description:
      "Free percentage calculator: find X% of a number, what percent one number is of another, percentage increase/decrease and SEE-style marks percentage.",
    category: "math-education",
    keywords: [
      "percentage calculator", "percent calculator", "प्रतिशत क्यालकुलेटर",
      "marks percentage calculator", "percentage formula",
    ],
    componentKey: "percentage",
    renderAs: "tool",
    lastUpdated: "2026-11-08",
    related: ["see-gpa-calculator", "unit-converter"],
    content: {
      intro: [
        "Percentages appear everywhere in Nepal — SEE/NEB marks, discount prices in Bhatbhateni, loan interest, commission percentages, population statistics. This single tool covers the three patterns: **X% of Y** (e.g. 15% of Rs 2,50,000 discount), **X is what % of Y** (e.g. 480 out of 500 marks), and **% change** (e.g. salary rose from 40,000 to 47,500).",
      ],
      steps: [
        "Pick the mode: **X% of Y**, **X is what % of Y**, or **% increase/decrease**.",
        "Enter the numbers.",
        "Press **Calculate** — the answer appears with the formula used, so it doubles as a study aid.",
      ],
      examples: [
        {
          heading: "Examples",
          rows: [
            ["15% of Rs 2,50,000", "Rs 37,500", "discount calculation"],
            ["480 is what % of 500", "96%", "SEE full-marks ratio"],
            ["40,000 → 47,500 ", "+18.75%", "salary increase"],
          ],
        },
      ],
      faqs: [
        {
          q: "How do I calculate percentage of a number?",
          a: "Multiply the number by the percentage and divide by 100: Y × (X ÷ 100). The tool shows this formula under the answer.",
        },
        {
          q: "How is marks percentage calculated in Nepal?",
          a: "Percentage = (obtained marks ÷ total marks) × 100. For SEE, students usually talk in GPA; the SEE GPA calculator covers that conversion.",
        },
      ],
    },
  },
  {
    slug: "unit-converter",
    title: "Unit Converter — Length, Weight, Area, Volume & Temperature",
    h1: "Unit Converter — Metric, Imperial & Nepali-Friendly Units",
    h1Np: "एकाइ परिवर्तक",
    shortTitle: "Unit Converter",
    description:
      "Convert length, weight, area, volume, temperature and data units instantly — kilometre to mile, kilogram to pound, celsius to fahrenheit and more.",
    category: "math-education",
    keywords: [
      "unit converter", "metric converter", "length converter",
      "kg to lb", "km to miles", "एकाइ परिवर्तक",
    ],
    componentKey: "unit",
    renderAs: "tool",
    lastUpdated: "2026-11-08",
    related: ["land-area-converter", "percentage-calculator"],
    content: {
      intro: [
        "A general-purpose **unit converter** for the measurements people actually ask about: distance (km ↔ mile — the standard for trekking and highway distances), weight (kg ↔ pound), volume (litre ↔ gallon), temperature (Celsius ↔ Fahrenheit) and data (MB/GB). For Nepali **land** units (ropani, kattha, bigha) use the dedicated land area converter.",
      ],
      steps: [
        "Choose a **category** (length, weight, volume, temperature, area, data).",
        "Pick the **from** and **to** units.",
        "Enter the value — the converted value appears instantly.",
      ],
      faqs: [
        {
          q: "How many km is a mile?",
          a: "1 mile = 1.609344 km. 1 km = 0.621371 miles.",
        },
        {
          q: "How do I convert Celsius to Fahrenheit?",
          a: "F = (C × 9/5) + 32. So 30°C = 86°F, and 0°C = 32°F.",
        },
      ],
    },
  },
  {
    slug: "bmi-calculator",
    title: "BMI Calculator — Body Mass Index in Metric or Imperial Units",
    h1: "BMI Calculator (Body Mass Index) — Check Your Healthy Weight Range",
    h1Np: "बिएमआइ क्यालकुलेटर",
    shortTitle: "BMI Calculator",
    description:
      "Calculate your BMI (Body Mass Index) in metric (kg/cm) or imperial (ft/in/lb) units. See which category your BMI falls in and the healthy weight range for your height.",
    category: "math-education",
    keywords: [
      "bmi calculator", "body mass index", "bmi calculator nepal",
      "healthy weight calculator", "height weight chart",
    ],
    componentKey: "bmi",
    renderAs: "tool",
    lastUpdated: "2026-11-08",
    related: ["percentage-calculator"],
    content: {
      intro: [
        "**BMI (Body Mass Index)** is the standard screening number for healthy weight: weight (kg) divided by height (m) squared. This tool computes your BMI in both metric and South-Asian-friendly units, shows the WHO category (underweight, normal, overweight, obese) and the exact weight range for your height.",
        "BMI is a screening tool, not a diagnosis — athletes and older adults can be misclassified. For a personal assessment consult a doctor or nutritionist.",
      ],
      steps: [
        "Choose **metric (kg + cm)** or **imperial (ft/in + lb)** units.",
        "Enter your height and weight.",
        "Press **Calculate BMI** — the index, category and healthy range show instantly.",
      ],
      faqs: [
        {
          q: "How is BMI calculated?",
          a: "BMI = weight (kg) ÷ height² (m²). Example: 65 kg at 1.70 m → 22.5 (normal).",
        },
        {
          q: "What is a healthy BMI?",
          a: "The WHO range is 18.5–24.9. Many South-Asian health guidelines suggest a tighter upper bound (about 23) for people of Nepali ethnicity — treat categories as screening hints rather than verdicts.",
        },
      ],
    },
  },
];

export const SEE_TOOLS: Tool[] = [
  {
    slug: "see-gpa-calculator",
    title: "SEE GPA Calculator — Grade 10 Results & Marks to GPA (SEE को GPA)",
    h1: "SEE GPA Calculator — Convert SEE Marks to GPA Instantly",
    h1Np: "SEE GPA क्यालकुलेटर",
    shortTitle: "SEE GPA Calculator",
    description:
      "Calculate SEE GPA from Grade 10 subject grades. Free SEEcalculator for students — grade points, GPA, and the letter-grade system explained.",
    category: "see-exam",
    keywords: [
      "see gpa calculator", "see calculator", "gpa calculator nepal",
      "see result gpa", "marksheet to gpa nepal", "सीई जिपिए क्यालकुलेटर",
    ],
    popular: true,
    trending: true,
    componentKey: "seeGpa",
    renderAs: "tool",
    lastUpdated: "2026-11-08",
    related: ["percentage-calculator", "age-calculator"],
    content: {
      intro: [
        "The Secondary Education Examination (SEE, formerly SLC) reports **letter grades** (A+, A, B+, …) instead of percentage. Admissions to +2 colleges, scholarships, and technical streams depend on your **GPA (Grade Point Average)** and sometimes on grade points in individual subjects — most famously Maths and Science for the science stream.",
        "Enter your grades for each subject and this calculator returns your GPA instantly, plus the grade-point table so you can see each subject's contribution.",
      ],
      steps: [
        "Pick the **grade (A+…D)** for each of your subjects — defaults match the typical problem set of compulsory subjects.",
        "Add or remove subject rows to match your marksheet, including your optional subject.",
        "Press **Calculate GPA**.",
        "Your GPA appears; the table shows each subject's grade point.",
      ],
      examples: [
        {
          heading: "Letter grade → grade point (NEB scale)",
          rows: [
            ["A+", "90–100", "4.0"],
            ["A", "80–89", "3.6"],
            ["B+", "70–79", "3.2"],
            ["B", "60–69", "2.8"],
            ["C+", "50–59", "2.4"],
            ["C", "40–49", "2.0"],
            ["D", "35–39", "1.6"],
          ],
        },
      ],
      faqs: [
        {
          q: "How is SEE GPA calculated?",
          a: "GPA is the credit-weighted average of subject grade points under the NEB letter-grade system. This tool averages the grade points of the subjects you enter; for the official figure always rely on your marksheet.",
        },
        {
          q: "What GPA do I need for +2 science?",
          a: "IColleges commonly require a minimum overall GPA plus minimum grade points in Maths and Science — requirements vary by college, so check each +2's admission notice.",
        },
        {
          q: "Is SEE percentage still printed?",
          a: "The percentage-equivalent estimate can be computed, but the official result is the letter-grade system. Beware of calculators that fabricate an exact percentage — NEB's official result is in grades.",
        },
      ],
    },
  },
];

export const LANGUAGE_TOOLS: Tool[] = [
  {
    slug: "preeti-to-unicode",
    title: "Preeti to Unicode Converter — प्रिति फन्ट देखि युनिकोड (नेपाली युनिकोद)",
    h1: "Preeti to Unicode Converter — Convert Preeti Font Text to Devanagari",
    h1Np: "प्रीति → युनिकोड परिवर्तक",
    shortTitle: "Preeti to Unicode",
    description:
      "Convert Preeti font-encoded Nepali text to Unicode Devanagari instantly. The classic Preeti→Unicode converter used for government letters, and old documents — works offline in your browser.",
    category: "nepali-language-unicode",
    keywords: [
      "preeti to unicode", "preeti to unicode converter", "unicode to preeti not needed",
      "नेपाली युनिकोड", "preeti font converter", "प्रीति देखि युनिकोड",
    ],
    popular: true,
    componentKey: "preeti",
    renderAs: "tool",
    lastUpdated: "2026-11-08",
    related: ["nepali-typing-online", "number-to-nepali-words"],
    content: {
      intro: [
        "**Preeti** is a legacy Nepali font: documents typed with the Preeti font store Devanagari letters as hidden ASCII codes, which break outside that font and cannot be searched, emailed to web systems, or index on Google. **Unicode** is the international standard for Devanagari that works everywhere — websites, apps, Facebook, and government online forms.",
        "This converter reads Preeti-encoded text (paste directly from an old letter, notice or memo) and outputs proper Unicode Devanagari — including conjuncts (क्ष, त्र, ज्ञ), matra reordering and halant placement — using the widely trusted conversion mapping.",
      ],
      steps: [
        "Copy the old text that was typed in the **Preeti font**.",
        "Paste it into the left box. (The output appears live on the right.)",
        "Press **Copy Unicode** to take the converted text.",
        "If some letters look odd, the source probably wasn't Preeti-encoding — the tool preserves what it can't convert.",
      ],
      examples: [
        {
          heading: "Classic conversions",
          rows: [
            ["g]kfn", "नेपाल", "Nepal in Preeti encoding"],
            ["gd;\\sf/ x]f", "नमस्कार हो", "hello phrase"],
            ["t;[ lhkfSsf", "गुनासो हिसाब", "common memo words"],
          ],
        },
      ],
      faqs: [
        {
          q: "Why does my Preeti text look like garbled English letters?",
          a: "That's the encoding: Preeti stores Devanagari as ASCII codes that only the desktop font decodes. Beautiful on a PC with Preeti installed, unreadable anywhere else — that's why conversion to Unicode is needed.",
        },
        {
          q: "Does the tool also convert Unicode back to Preeti?",
          a: "This page focuses on Preeti → Unicode, the direction that unblocks shared documents. For fresh typing, use the built-in Nepali typing tool instead of going back to Preeti.",
        },
        {
          q: "Is my text uploaded anywhere?",
          a: "No — conversion runs entirely in your browser. Nothing leaves your device.",
        },
      ],
    },
  },
  {
    slug: "nepali-typing-online",
    title: "Nepali Typing Online — Type Nepali in Roman/English Letters (नेपाली टाइपिङ)",
    h1: "Nepali Typing Online — Type Type in Roman, Get Devanagari Instantly",
    h1Np: "नेपाली टाइपिङ अनलाइन",
    shortTitle: "Nepali Typing",
    description:
      "Type Nepali online using English/Roman letters — namaste becomes नमस्ते as you type. Free browser-based Nepali typing tool, no app or download needed.",
    category: "nepali-language-unicode",
    keywords: [
      "nepali typing online", "nepali unicode typing", "नेपाली टाइपिङ",
      "type nepali", "roman to nepali typing",
    ],
    trending: true,
    componentKey: "typing",
    renderAs: "tool",
    lastUpdated: "2026-11-08",
    related: ["preeti-to-unicode", "number-to-nepali-words"],
    content: {
      intro: [
        "**Nepali typing online** lets you write Devanagari without a Nepali keyboard: you type English/Roman letters and the tool renders them as Nepali — **namaste → नमस्ते**, **nepaal → नेपाल**. This is the romanized a popular IME scheme: keep typing, and copy the result into Facebook, Messenger or office documents.",
        "The tool converts as you type and runs fully offline in your browser. Rules are simple and standard: **aa** for ा, vowels after consonants become matras, and back-to-back consonants join with halant (sa+t → स्त).",
      ],
      steps: [
        "Start typing with **Roman/English letters** in the box.",
        "The Devanagari output appears live below.",
        "Rules: type **aa** for ा / आ, **ee** or **ii** for ी / ई; a single **a** inside a word is silent.",
        "Concatenated consonants join automatically — **sa+t** gives स्त.",
        "Press **Copy** and paste the Devanagari anywhere.",
      ],
      examples: [
        {
          heading: "Quick reference",
          rows: [
            ["namaste", "नमस्ते", "greeting"],
            ["nepaal", "नेपाल", "Nepal — use aa for ा"],
            ["khaana", "खाना", "food"],
            ["bhaai", "भाई", "brother — final i becomes ई"],
          ],
        },
      ],
      faqs: [
        {
          q: "How do I type Nepali without a Nepali keyboard?",
          a: "Use a romanized typing tool like this one — type English letters, get Devanagari. For heavy daily typing, learn the full Nepali Unicode keyboard layout later.",
        },
        {
          q: "Why is my 'a' often invisible?",
          a: "In this scheme a single 'a' inside a word is an implicit schwa (as in नमस्ते). For the visible ा type **aa** — that's the standard of most romanized common IMEs.",
        },
        {
          q: "Does the output work in Facebook and Word?",
          a: "Yes — Unicode Devanagari renders anywhere the standard fonts exist. Copy straight from the tool.",
        },
      ],
    },
  },
  {
    slug: "number-to-nepali-words",
    title: "Number to Nepali Words — Cheque & Amount in Words (रकम अक्षरमा)",
    h1: "Number to Nepali Words — Rupees Amount to Words (Cheques, Bills)",
    h1Np: "अंक देखि अक्षर (नेपाली)",
    shortTitle: "Number to Words (NP)",
    description:
      "Convert any number — or rupee amount — into Nepali words (lakh/crore system) or English words in South- Asian style. Essential for cheque writing and official documents in Nepal.",
    category: "nepali-language-unicode",
    keywords: [
      "number to nepali words", "amount in words nepal", "cheque amount in words nepali",
      "रकम अक्षरमा", "rupees in words",
    ],
    componentKey: "numWords",
    renderAs: "tool",
    lastUpdated: "2026-11-08",
    related: ["preeti-to-unicode", "emi-calculator-nepal"],
    content: {
      intro: [
        "Nepali bank cheques and official bills require the amount **in words** — and Nepal uses the lakh–crore grouping, not the English million/billion grouping. This tool converts a number or rupee amount into **Nepali words** (for example 2,83,000 → दुई लाख तिन हजार), and also gives the **English words** in the same lakh/crore style (two lakh eighty-three thousand).",
        "For money amounts it appends the standard **रुपैंया … मात्र** closing, and handles paisa, which is exactly what a bank cheque expects.",
      ],
      steps: [
        "Type or paste the number (up to 19 digits).",
        "Choose **Nepali words** or **English (lakh/crore) words**.",
        "Read the output; for amounts, the रुपैंया-मात्र line appears automatically.",
        "Copy the line straight into your cheque or bill.",
      ],
      examples: [
        {
          heading: "Examples",
          rows: [
            ["283000", "दुई लाख इक्यासी हजार रुपैंया मात्र", "fine gold per tola"],
            ["1,50,582", "एक लाख पचास हजार पाँच सय बइयासी रुपैंया मात्र", "$1,000 in NPR"],
            ["100000", "एक लाख रुपैंया मात्र", "a lakh rupees"],
          ],
        },
      ],
      faqs: [
        {
          q: "How many zeros is one crore?",
          a: "1 crore = 1,00,00,000 — seven zeros. Nepali grouping counts hundreds, thousands, lakhs (five zeros order: 1,00,000) then crores.",
        },
        {
          q: "culated amounts in paisa supported?",
          a: "Yes — decimal paisa becomes 'X पैसा' after the rupaiya words, matching cheque convention.",
        },
      ],
    },
  },
];

export const EVERYDAY_TOOLS: Tool[] = [
  {
    slug: "land-area-converter",
    title: "Land Area Converter Nepal — Ropani, Aana, Bigha, Kattha, Dhur (जग्गा एकाइ)",
    h1: "Land Area Converter Nepal — Ropani ↔ Aana, Bigha ↔ Kattha, sq ft & m²",
    h1Np: "जग्गा क्षेत्रफल परिवर्तक",
    shortTitle: "Land Area (Ropani/Bigha)",
    description:
      "Convert Nepali land units — ropani/aana/paisa/dam (hill units) and bigha/kattha/dhur (Tarai units) — plus square feet, square metres and hectares instantly.",
    category: "land-everyday",
    keywords: [
      "land area converter nepal", "ropani to aana", "bigha kattha dhur converter",
      "जग्गा नाप", "ropani ana converter", "1 kattha in sq ft",
    ],
    popular: true,
    componentKey: "land",
    renderAs: "tool",
    lastUpdated: "2026-11-08",
    related: ["unit-converter", "gold-price-in-nepal"],
    content: {
      intro: [
        "Nepal uses two traditional land systems: the **hill** system (ropani–aana–paisa–dam, used in Kathmandu, Pokhara and the hills) and the **Tarai/plain** system (bigha–kattha–dhur). Property listings, lalpurja (य सदपति) and malpot paperwork mix them freely with square feet and square metres, so mistakes are common.",
        "Standard conversions: **1 ropani = 16 aana = 5,476 sq ft ≈ 508.74 m²**; **1 aana = 342.25 sq ft**; **1 bigha = 20 kattha = 72,900 sq ft ≈ 6,772.6 m²**; **1 kattha = 3,645 sq ft**; **1 dhur = 182.25 sq ft**.",
      ],
      steps: [
        "Choose the **from unit** (ropani, aana, bigha, kattha, dhur, sq ft, m², hectare).",
        "Enter the amount — combinations like '2 ropani 3 aana' can be split by converting each part.",
        "Read the converted value in every other unit at once.",
      ],
      examples: [
        {
          heading: "Reference table",
          rows: [
            ["1 ropani", "16 aana", "5,476 sq ft"],
            ["1 aana", "4 paisa", "342.25 sq ft"],
            ["1 bigha", "20 kattha", "72,900 sq ft"],
            ["1 kattha", "20 dhur", "3,645 sq ft"],
            ["1 hectare", "—", "≈ 19.67 ropani"],
          ],
        },
      ],
      faqs: [
        {
          q: "How many aana in one ropani?",
          a: "16 aana. One aana is 342.25 square feet, so one ropani is about 5,476 square feet (roughly 508.7 square metres).",
        },
        {
          q: "How many kattha make one bigha?",
          a: "20 kattha = 1 bigha. One kattha is 3,645 sq ft, so a full bigha is 72,900 sq ft — about 6,772.6 m².",
        },
        {
          q: "Why do Kathmandu listings use ropani but Tarai listings use bigha?",
          a: "The hill system comes from historic hill-district usage, and the bigha–kattha–dhur system came with the Tarai's agrarian history. The lalpurja will state whichever system your district uses.",
        },
      ],
    },
  },
  {
    slug: "nepal-time",
    title: "Nepal Time Now — NPT 5:45 (UTC+05:45) Clock & Date (nepali samay)",
    h1: "Nepal Time Now (अहिलेको समय) — NPT Clock with BS & AD Date",
    h1Np: "अहिलेको नेपाली समय",
    shortTitle: "Nepal Time (NPT)",
    description:
      "Live Nepal time (Nepal Standard Time, UTC+05:45) with today's BS and AD dates in Nepali and English. Free live clock for Nepal.",
    category: "land-everyday",
    keywords: [
      "nepal time", "nepal time now", "npt time", "utc +545",
      "अहिलेको समय", "nepali time clock",
    ],
    componentKey: "time",
    renderAs: "tool",
    lastUpdated: "2026-11-08",
    related: ["nepali-calendar", "bs-to-ad-converter"],
    content: {
      intro: [
        "Nepal Standard Time (**NPT**) is **UTC+05:45** — one of only two countries using a 45-minute offset, set to the sun over Gaurishankar mountain rather than a round meridian. This live clock shows the current Nepal time and today's BS and AD dates, useful when you're abroad and need the Kathmandu time for calls, deadlines or festival greetings.",
      ],
      steps: [
        "Open the page — the clock is live, updating every second.",
        "Today's date shows in **BS and AD**, in Nepali and English forms.",
        "No installation or refresh needed.",
      ],
      faqs: [
        {
          q: "What is Nepal's time zone?",
          a: "Nepal Standard Time, UTC+05:45. India is UTC+05:30, so Nepal is 15 minutes ahead of Delhi.",
        },
        {
          q: "Is there daylight saving in Nepal?",
          a: "No — Nepal keeps UTC+05:45 all year round.",
        },
      ],
    },
  },
];
