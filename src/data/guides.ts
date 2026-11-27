export interface Guide {
  slug: string;
  title: string;
  description: string;
  updated: string;
  html: string;
  related?: Array<{ href: string; label: string }>;
}

const wrap = (s: string) =>
  s.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>").replace(/^## (.+)$/gm, '<h2 class="mt-6 text-lg font-bold text-ink-900 dark:text-ink-100">$1</h2>');

export const GUIDES_LIST: Guide[] = [
  {
    slug: "see-gpa-to-percentage",
    title: "SEE GPA to percentage — how the Nepali letter-grade system works",
    description:
      "An original explainer of the SEE/NEB letter-grade system in Nepal: grade bands, grade points, GPA, and how +2 colleges interpret results.",
    updated: "2026-11-08",
    html: wrap(`
<p>Since 2073 BS, the <strong>Secondary Education Examination (SEE)</strong> — the old "SLC" — has been reported in letter grades rather than raw percentage. If your parents studied the old system, their score was out of 100%; yours is a <strong>GPA (Grade Point Average)</strong> built from grade points per subject.</p>
## The letter-grade bands
<p>Under the NEB system each subject lands in a band. Each band equals a grade point: A+ = 4.0 (90–100), A = 3.6 (80–89), B+ = 3.2 (70–79), B = 2.8 (60–69), C+ = 2.4 (50–59), C = 2.0 (40–49), and D = 1.6 (35–39 marks). Below that, the subject is a non-graded failure. GPA is calculated from these grade points — a credit-weighted average across your subjects.</p>
## What's a "good" GPA in Nepal?
<p>Most +2 science streams look for roughly a 3.0+ GPA with strong Maths and Science grades; management and humanities streams often accept lower. Scholarships (including district and institutional scholarships) typically use GPA cut-offs announced by each college. Because requirements differ by college and year, always check that college's own admission notice before assuming.</p>
## Should you "convert" GPA to percentage?
<p>There is no single official formula published for converting a full SEE GPA to percentage — marks-to-grade is one-way because grade bands are ranges, not points. Any calculator promising "your exact percentage" is making a rough model. If a form insists on a percentage, ask the institution which conversion they want (some use GPA × 25, some band-mapping); our <strong>SEE GPA calculator</strong> shows the grade-point maths honestly instead of inventing precision.</p>
`),
    related: [
      { href: "/see-gpa-calculator", label: "SEE GPA calculator" },
      { href: "/percentage-calculator", label: "Percentage calculator" },
    ],
  },
  {
    slug: "bs-to-ad-conversion-explained",
    title: "How BS to AD conversion actually works (and why it can't be a simple formula)",
    description:
      "Why the Bikram Sambat calendar doesn't match Gregorian months exactly, how converter data tables work, and what to double-check for official documents.",
    updated: "2026-11-08",
    html: wrap(`
<p>Nepal runs its official life on the <strong>Bikram Sambat (BS)</strong> calendar: citizenship, passports, certificates, property papers and festivals all use it. The Gregorian calendar used worldwide is a fixed, math-driven system — 31/30/28 days. Bikram Sambat is panchanga-based: months alternate between 29 and 32 days, and the exact lengths change year to year. That's why no simple arithmetic formula can convert BS to AD.</p>
## How tools do it
<p>Reliable converters use a per-year <strong>month-length table</strong> covering the years people actually need (BS 2000–2090 on Nepali Tools). The table records how many days each BS month had in that year; conversion then counts days between your date and a known anchor (BS 1 Baishakh = mid-April). That's also why cheap calculators that assume "30 days per BS month" drift several days off.</p>
## What to double-check for official use
<p>For visa, citizenship or university applications the stakes matter: first, read the BS date from your certificate exactly as printed (watch for handwritten months like जेट versus जेठ). Then convert with a table-based tool. Finally, when a form needs a birth date in writing, keep consistency across your passport and certificate — an unexplained one-day difference can cause queries, so prefer the officially converted form if the institution provides one.</p>
`),
    related: [
      { href: "/bs-to-ad-converter", label: "BS to AD converter" },
      { href: "/ad-to-bs-converter", label: "AD to BS converter" },
      { href: "/age-calculator", label: "Age calculator (BS/AD)" },
    ],
  },
  {
    slug: "buy-gold-nepal-checklist",
    title: "Buying gold in Nepal — prices, purity and the checklist to verify",
    description:
      "Fine vs tejhabi gold, per-tola pricing, hallmark, making charges and the checks to do before paying | for Nepal buyers.",
    updated: "2026-11-08",
    html: wrap(`
<p>Gold buying in Nepal happens through jewellers under <strong>FENEGOSIDA</strong>-published daily rates. Whether you're buying bangles for Dashain or a hedge investment, the same few checks protect you.</p>
## Know the two standards
<p><strong>Fine gold</strong> is 9999 (24K) — the purest, used as the quoted "gold price in Nepal today" per tola. <strong>Tejabi</strong> is the traditional 22K standard most jewellery is made in; its rate tracks slightly below fine. A tola weighs 11.6638 grams; smaller measurement unit is the lal (1 lal = 0.011663 g). When a store shows "per lal" prices, multiply carefully — it's 1/1000th of a tola.</p>
## The pre-purchase checklist
<p>First, compare the counter's rate against the published daily rate on your phone, so you know how much is <em>making charge</em> (workmanship) versus metal value — making charges on designer pieces can add 15–30% extra. Second, ask for the hallmark stamp and purity declaration on the invoice; on resale this is the difference between fine and tejhabi value. Third, get a proper invoice with the weight in grams/tola and rate mentioned explicitly. Fourth, for investment (not jewellery), ask for bars/coins where making charge is minimal. Finally: the published rate changes during the day and shops add their own margin, so call or visit early rather than anchoring on yesterday's headline rate.</p>
`),
    related: [
      { href: "/gold-price-in-nepal", label: "Gold price in Nepal today" },
      { href: "/usd-to-npr", label: "USD to NPR" },
    ],
  },
];
