import type { Tool } from "@/lib/tools";

export const FINANCE_TOOLS: Tool[] = [
  {
    slug: "emi-calculator-nepal",
    title: "EMI Calculator Nepal — Home Loan, Car Loan & Personal Loan EMI (रुपैंया मासिक किस्ता)",
    h1: "EMI Calculator Nepal — Monthly EMI for Home, Car & Personal Loans",
    h1Np: "EMI क्यालकुलेटर — नेपालका बैंकका लोनका लागि",
    shortTitle: "EMI Calculator",
    description:
      "Calculate monthly EMI for home loans, car loans and personal loans in Nepal. Free EMI calculator with total interest, payment schedule and Nepali rupee amounts.",
    category: "finance-tax-currency",
    keywords: [
      "emi calculator nepal", "emi calculator", "loan emi calculator nepal",
      "साप्टाहिक किस्ता", "home loan emi nepal bank", "car loan emi calculator",
    ],
    popular: true,
    trending: true,
    componentKey: "emi",
    renderAs: "tool",
    lastUpdated: "2026-11-08",
    related: ["compound-interest-calculator", "income-tax-calculator-nepal", "vat-calculator-nepal"],
    content: {
      intro: [
        "An **EMI (Equated Monthly Instalment)** is the fixed payment you make every month to repay a loan. Nepali banks — Nabil, NIC Asia, Global IME, Prime, Himalayan and others — quote home-loan and car-loan interest as an annual rate (for example 9–11% in recent years), and this tool converts that into the exact monthly instalment, total interest payable and total repayment.",
        "The EMI formula used by every bank is: **EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1)**, where P is the loan amount, r the monthly rate (annual ÷ 12 ÷ 100) and n the number of months. This page does that arithmetic instantly and honestly — no round figures, no assumptions hidden from you.",
      ],
      steps: [
        "Enter the **loan amount** in Nepali rupees (e.g. 5,000,000 for a Rs 50 lakh home loan).",
        "Enter the bank's **annual interest rate** (e.g. 9.5%).",
        "Enter the **tenure in months or years** (e.g. 20 years = 240 months).",
        "Press **Calculate EMI**.",
        "Review the monthly EMI, total interest and total repayment; expand the schedule for the first months.",
      ],
      examples: [
        {
          heading: "Worked example — Rs 50,00,000 home loan at 9.5% for 20 years",
          rows: [
            ["Loan amount (P)", "Rs 50,00,000", "Principal borrowed"],
            ["Rate / tenure", "9.5% / 240 months", "Monthly rate r = 0.7917%"],
            ["Monthly EMI", "≈ Rs 46,626", "Fixed instalment each month"],
            ["Total interest", "≈ Rs 61,90,300", "Interest paid over 20 years"],
            ["Total repayment", "≈ Rs 1,11,90,300", "Principal + interest"],
          ],
        },
      ],
      faqs: [
        {
          q: "What is the EMI formula used by Nepali banks?",
          a: "EMI = P × r × (1+r)^n / ((1+r)^n − 1), with r = annual rate ÷ 12 ÷ 100. All Nepali commercial banks use this standard reducing-balance formula.",
        },
        {
          q: "How much home loan can I get in Nepal?",
          a: "Banks typically finance 50–70% of the property value, and instalments (plus other EMIs) should stay within 50–60% of your net monthly income. The exact limit follows each bank's credit policy and Nepal Rastra Bank caps.",
        },
        {
          q: "Is EMI better for a home loan or should I rent?",
          a: "It depends on your income stability, interest rate and how long you will stay. Use this tool to compare the EMI against your rent; consider that home loans in Nepal commonly run 15–25 years at 9–11%.",
        },
        {
          q: "Does prepayment reduce EMI or tenure?",
          a: "In Nepal a prepayment usually reduces tenure by default (EMI stays the same), which saves the most interest. Ask your bank whether they recalculate EMI instead.",
        },
      ],
    },
  },
  {
    slug: "income-tax-calculator-nepal",
    title: "Income Tax Calculator Nepal 2083/84 — Salary Tax, SSF & TDS (आयकर)",
    h1: "Income Tax Calculator Nepal — Salary & TDS Calculator (FY slabs)",
    h1Np: "आयकर क्यालकुलेटर",
    shortTitle: "Income Tax Calculator",
    description:
      "Calculate Nepal income tax on salary with current Finance Act slabs, SSF (11%), CIT and provident-fund deductions. Free tax calculator for married and unmarried individual residents.",
    category: "finance-tax-currency",
    keywords: [
      "income tax calculator nepal", "salary tax calculator nepal", "नेपाल को आयकर को दर",
      "income tax rate nepal", "tij calculator", "nepal tax slab 2083/84",
    ],
    popular: true,
    componentKey: "incomeTax",
    renderAs: "tool",
    lastUpdated: "2026-11-08",
    related: ["emi-calculator-nepal", "vat-calculator-nepal", "compound-interest-calculator"],
    content: {
      intro: [
        "This **Nepal income tax calculator** estimates the annual and monthly tax on salary using the progressive slabs of the latest Finance Act, plus Nepal's standard salary deductions: **Social Security Fund (SSF) 11%** of basic salary (employee share), **Provident Fund**, and **Citizen Investment Trust (CIT)** — which give tax relief as allowed by the Income Tax Act 2058.",
        "The slab configuration is stored as editable data: the admin can update it every Finance Act so the tool reflects the current **fiscal year (Shrawan–Ashadh)** brackets. Always reconcile the final figure against your employer's TDS certificate.",
      ],
      steps: [
        "Choose **Married** or **Unmarried** (different first-slab limits).",
        "Enter **monthly salary** (or switch to annual).",
        "Enter your **basic salary** so the 11% SSF share is computed correctly.",
        "Add optional **SSF / PF / CIT** amounts you contribute.",
        "Press **Calculate** — annual tax, monthly tax (TDS) and net salary appear; the slab breakdown shows how each ring of income is taxed.",
      ],
      examples: [
        {
          heading: "Illustration — unmarried, Rs 80,000 monthly (first-slab income only)",
          rows: [
            ["Annual salary", "Rs 9,60,000", "Rs 80,000 × 12"],
            ["First slab taxed", "Rs 6,00,000 × 1%", "Lower bracket"],
            ["Rest taxed", "Rs 3,60,000 × 10%", "Second bracket"],
            ["Estimated annual tax", "≈ Rs 42,000", "Roughly Rs 3,500/month (before SSF/CIT relief)"],
          ],
        },
      ],
      faqs: [
        {
          q: "What are the income tax slabs in Nepal for the current fiscal year?",
          a: "Slabs are shown inside the tool and are kept in editable data so they can be updated each Finance Act. For FY 2082/83 the unmarried first slab was Rs 6,00,000 at 1% (Rs 7,00,000 for married); confirm against the Inland Revenue Department (IRD) before filing.",
        },
        {
          q: "How much is SSF contribution for employees in Nepal?",
          a: "The employee contributes 11% of basic salary into the Social Security Fund; the employer adds 20% (11% PF-like + SSEF + gratuity). Contributions get tax treatment as allowed by the Act.",
        },
        {
          q: "How can I reduce my salary tax in Nepal?",
          a: "Standard routes are SSF/PF, CIT membership (deductions capped monthly) and insurance premiums. This tool subtracts them up to the configured caps to show approximate relief.",
        },
      ],
    },
  },
  {
    slug: "vat-calculator-nepal",
    title: "VAT Calculator Nepal 13% — Add or Remove VAT (भ्याट क्यालकुलेटर)",
    h1: "VAT Calculator Nepal — Add or Remove 13% VAT Instantly",
    h1Np: "भ्याट (VAT) क्यालकुलेटर",
    shortTitle: "VAT Calculator (13%)",
    description:
      "Free VAT calculator for Nepal at the standard 13% rate. Add VAT to a price or remove VAT with one click, in Nepali rupees — plus which goods are VAT-exempt.",
    category: "finance-tax-currency",
    keywords: [
      "vat calculator nepal", "vat 13% calculator", "भ्याट क्यालकुलेटर",
      "13 percent vat nepal", "vat pandhra Rate calculate", "add remove vat nepal",
    ],
    popular: true,
    componentKey: "vat",
    renderAs: "tool",
    lastUpdated: "2026-11-08",
    related: ["income-tax-calculator-nepal", "emi-calculator-nepal"],
    content: {
      intro: [
        "Nepal's standard **VAT (Value Added Tax)** rate is **13%** under the Value Added Tax Act 2052. Businesses registered for VAT must add 13% to taxable sales and show it on invoices; consumers see it in KTM electric bills, restaurant bills and most product prices.",
        "This calculator does the two jobs you actually need: **add VAT** to a net price, and **remove VAT** from a VAT-inclusive price to see the net amount and the exact tax portion. Use any rate you may need (fine-tune inside) for special cases.",
      ],
      steps: [
        "Choose **Add VAT** (you know the net price) or **Remove VAT** (you know the gross price).",
        "Enter the amount in Nepali rupees.",
        "Confirm the VAT rate (default 13%).",
        "Press **Calculate** — net, VAT and gross amounts show instantly.",
      ],
      examples: [
        {
          heading: "Both directions at 13%",
          rows: [
            ["Add 13% VAT to Rs 10,000", "VAT Rs 1,300", "Gross Rs 11,300"],
            ["Remove 13% VAT from Rs 11,300", "Net Rs 10,000", "VAT Rs 1,300"],
            ["Remove VAT from a restaurant bill Rs 2,260", "Net Rs 2,000", "VAT Rs 260"],
          ],
        },
      ],
      faqs: [
        {
          q: "How do I calculate VAT in Nepal?",
          a: "To add: gross = net × 1.13. To remove: net = gross ÷ 1.13, and VAT = gross − net. The calculator does both directions instantly.",
        },
        {
          q: "What is the VAT rate in Nepal?",
          a: "13% is the standard rate under the VAT Act 2052. Some categories are exempt (basic food grains, agricultural goods, education and health services in most cases).",
        },
        {
          q: "Is a PAN card enough, or do I need VAT?",
          a: "PAN is the permanent account number; VAT registration is separate and required once annual turnover crosses the threshold prescribed by the Act (with exemptions in certain provinces/sectors).",
        },
      ],
    },
  },
  {
    slug: "usd-to-npr",
    title: "USD to NPR — 1 US Dollar to Nepali Rupees Today ($ को विनिमय दर)",
    h1: "USD to NPR — Convert US Dollar to Nepali Rupees (Today's Rate)",
    h1Np: "अमेरिकी डलर → नेपाली रुपैंयाँ",
    shortTitle: "USD to NPR",
    description:
      "Convert US Dollar (USD) to Nepali Rupee (NPR) and back with today's indicative rate. Free converter with quick amounts (1, 10, 100, 1000) and NPR→USD reverse conversion.",
    category: "finance-tax-currency",
    keywords: [
      "usd to npr", "usd to npr converter", "dollar rate in nepal today",
      "डलर को रेट आज", "1 usd to npr", "1000 dollar in nepali rupees",
    ],
    popular: true,
    trending: true,
    componentKey: "usdNpr",
    renderAs: "tool",
    lastUpdated: "2026-11-08",
    related: ["emi-calculator-nepal", "gold-price-in-nepal"],
    content: {
      intro: [
        "**$1 USD to NPR** is one of Nepal's most-searched numbers — students checking US tuition, families awaiting remittance, importers paying LC, and travellers exchanging cash. This converter uses a live indicative rate that mirrors the market and marks the source clearly; the **official rate** for banking transactions is the one Nepal Rastra Bank publishes each day.",
        "You can convert both directions (**USD → NPR** and **NPR → USD**) with quick chips for 1, 10, 100 and 1,000 dollars, so a $1,000 rent, $200 fee or iPhone price quote is one tap.",
      ],
      steps: [
        "Enter the **USD amount** (or flip to NPR → USD mode).",
        "The converted NPR value appears instantly.",
        "Use the quick chips ($1, $10, $100, $1,000) for common amounts.",
        "Check the note below for the rate's source and freshness.",
      ],
      examples: [
        {
          heading: "Sample figures (indicative)",
          rows: [
            ["$1", "≈ Rs 150.58", "one US dollar"],
            ["$100", "≈ Rs 15,058", "typical part-payment"],
            ["$1,000", "≈ Rs 1,50,582", "remittance / tuition figure"],
          ],
        },
      ],
      faqs: [
        {
          q: "What is the dollar rate in Nepal today?",
          a: "The live indicative rate appears in the tool above. The official buying/selling rate used by banks is published by Nepal Rastra Bank (NRB) every working day and will differ slightly from this market mirror.",
        },
        {
          q: "Why is my bank's rate different from this converter?",
          a: "Banks add a spread (buy vs sell) on NRB's official rate, and card transactions use vostro network rates. This converter shows the open-market indicative midpoint.",
        },
        {
          q: "How much NPR is $1,000 today?",
          a: "Enter 1000 in the converter — e.g. at Rs 150.58 per dollar that is about Rs 1,50,582.",
        },
        {
          q: "Where can I exchange USD cash in Nepal legally?",
          a: "Licensed banks and authorized exchange counters issue an invoice; ask for a receipt showing the applied rate.",
        },
      ],
    },
  },
  {
    slug: "compound-interest-calculator",
    title: "Compound Interest Calculator Nepal — Fixed Deposit & SIP Planning (ब्याज)",
    h1: "Compound Interest Calculator — FDs & Recurring Savings (Nepal)",
    h1Np: "चक्रवृद्धि ब्याज क्यालकुलेटर",
    shortTitle: "Compound Interest",
    description:
      "Compound interest calculator for Nepal — bank fixed deposits, recurring deposits and SIP-style monthly savings. See final value and interest earned in NPR.",
    category: "finance-tax-currency",
    keywords: [
      "compound interest calculator", "fd calculator nepal", "ब्याज क्यालकुलेटर",
      "fixed deposit interest nepal bank", "compound interest formula nepal",
    ],
    componentKey: "compound",
    renderAs: "tool",
    lastUpdated: "2026-11-08",
    related: ["emi-calculator-nepal", "income-tax-calculator-nepal"],
    content: {
      intro: [
        "**Compound interest** is interest on interest: bank fixed deposits, cooperative savings and long-term mutual-fund-style investing all grow this way. Nepali banks typically compound savings quarterly on FDs; the effective earning depends on the rate, the compounding frequency and the time. This tool supports both a **lump sum** (FD mode) and **monthly recurring** deposits (SIP mode) so you can plan either.",
      ],
      steps: [
        "Choose **Lump sum** or **Monthly recurring**.",
        "Enter the principal (or monthly deposit), annual rate and years.",
        "Pick the compounding frequency (usually quarterly for Nepali FDs).",
        "Press **Calculate** — final value, interest earned and a year-by-year table appear.",
      ],
      examples: [
        {
          heading: "Example — Rs 1,00,000 at 9% quarterly for 5 years",
          rows: [
            ["Lump sum", "Rs 1,00,000", "Fixed deposit"],
            ["Final value", "≈ Rs 1,55,933", "at 9% quarterly compounding"],
            ["Interest earned", "≈ Rs 55,933", "before tax"],
          ],
        },
      ],
      faqs: [
        {
          q: "How is compound interest calculated?",
          a: "A = P (1 + r/n)^(n·t) for lump sums; the tool adds each recurring instalment with its remaining months for SIP mode.",
        },
        {
          q: "Is FD interest taxed in Nepal?",
          a: "Yes — interest income attracts tax deducted at source (TDS) under the Income Tax Act; rates change with Finance Acts, so confirm the current rate with your bank.",
        },
      ],
    },
  },
];
