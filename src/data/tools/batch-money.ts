import type { Tool } from "@/lib/tools";

const D = "2026-11-27";
const FIN = "finance-tax-currency";

type Lite = Omit<Tool, "renderAs" | "lastUpdated" | "category"> & { category?: string };
const t = (x: Lite): Tool => ({ category: FIN, renderAs: "tool", lastUpdated: D, ...x } as Tool);

export const BATCH_MONEY_TOOLS: Tool[] = [
  t({
    slug: "gratuity-calculator-nepal",
    title: "Gratuity Calculator Nepal — Labour Act 2074 (उपदान हिसाब)",
    h1: "Gratuity Calculator for Nepal",
    h1Np: "उपदान गणक",
    shortTitle: "Gratuity Calculator",
    description: "Work out how much gratuity (उपदान) your employer owes you under Nepal's Labour Act 2074: 8.33% of basic salary for every month you work.",
    keywords: ["gratuity calculator nepal", "upadan calculation", "उपदान", "labour act 2074 gratuity", "gratuity 8.33 percent", "ssf gratuity"],
    componentKey: "f:gratuity",
    related: ["provident-fund-calculator-nepal", "income-tax-calculator-nepal", "salary-to-hourly-calculator"],
    content: {
      intro: [
        "Under the **Labour Act 2074**, your employer has to set aside **8.33% of your basic salary every month** as gratuity. That works out to roughly one month's basic pay for every year you work.",
        "Enter your basic salary and how long you've worked to see what should have built up. It's a quick way to check a payslip, an SSF statement, or a final settlement when you leave a job.",
      ],
      steps: ["Enter your **monthly basic salary** (not your total salary with allowances).", "Enter your **years and months** of service.", "Leave the rate at 8.33% unless your contract gives more.", "Compare the total with your SSF or employer statement."],
      faqs: [
        { q: "Is gratuity calculated on basic or gross salary?", a: "On basic salary. Allowances like dearness, transport or food are not included unless your contract says so." },
        { q: "Do I lose gratuity if I resign early?", a: "Under the old law you needed years of service. Under the Labour Act 2074 it is deposited monthly from day one, so it belongs to you even if you leave early." },
        { q: "Where does the money go?", a: "Most employers now deposit it with the Social Security Fund (SSF) along with your other contributions. Check your SSF statement to confirm." },
      ],
    },
  }),
  t({
    slug: "provident-fund-calculator-nepal",
    title: "Provident Fund Calculator Nepal — EPF, CIT & SSF Balance (सञ्चय कोष)",
    h1: "Provident Fund Calculator (Nepal)",
    h1Np: "सञ्चय कोष गणक",
    shortTitle: "Provident Fund Calculator",
    description: "Estimate how much your Employees Provident Fund (कर्मचारी सञ्चय कोष), CIT or SSF balance will grow to, with your share, your employer's share and the interest.",
    keywords: ["provident fund calculator nepal", "epf calculator nepal", "sanchaya kosh calculator", "सञ्चय कोष", "cit calculator", "ssf calculator nepal"],
    componentKey: "f:providentFund",
    related: ["gratuity-calculator-nepal", "retirement-date-calculator-nepal", "compound-interest-calculator"],
    content: {
      intro: [
        "Every month **10% of your basic salary** goes to the provident fund and your employer adds another 10%. It's easy to forget about, but over 20 or 30 years it becomes one of the biggest sums you'll ever have.",
        "This calculator adds up both contributions month by month, grows them at the interest your fund pays, and lets you include yearly salary raises so the estimate is realistic.",
      ],
      steps: ["Enter your **basic salary** today.", "Check the **contribution rates** (10% + 10% is the usual split).", "Enter the **interest rate** your fund announced last year.", "Add a **yearly raise** and the number of years until you retire."],
      faqs: [
        { q: "What interest does Karmachari Sanchaya Kosh pay?", a: "It changes every year and is announced by the fund. Check its latest notice and enter that rate." },
        { q: "Is my provident fund taxed?", a: "Contributions to approved retirement funds get a tax deduction up to a limit. Withdrawals may be taxed depending on how and when you withdraw. Check with IRD or your fund." },
      ],
    },
  }),
  t({
    slug: "overtime-calculator-nepal",
    title: "Overtime Calculator Nepal — 1.5× Pay Under Labour Act",
    h1: "Overtime Pay Calculator",
    h1Np: "ओभरटाइम हिसाब",
    shortTitle: "Overtime Calculator",
    description: "Calculate your overtime pay in Nepal from your monthly salary. Uses the Labour Act rate of 1.5 times the normal hourly wage, with your own working days and hours.",
    keywords: ["overtime calculator nepal", "overtime pay nepal", "overtime rate labour act nepal", "ot calculation nepal", "hourly wage from salary nepal"],
    componentKey: "f:overtime",
    related: ["salary-to-hourly-calculator", "gratuity-calculator-nepal", "income-tax-calculator-nepal"],
    content: {
      intro: [
        "Nepal's Labour Act says extra hours beyond the normal 8 a day (48 a week) must be paid at **at least 1.5 times** your normal hourly wage.",
        "Most people know their monthly salary, not their hourly rate. Enter your salary, how your employer counts the month, and your extra hours, and you'll see the hourly rate, overtime rate and total overtime pay.",
      ],
      steps: ["Enter your **monthly basic salary**.", "Set the **days in a month** your employer uses (30 or 26).", "Enter your **normal daily hours** and **overtime hours**.", "Read the overtime pay and your new total."],
      faqs: [
        { q: "Is there a limit on overtime?", a: "The Labour Act caps overtime at 4 hours a day and 24 hours a week, and it should be with the worker's consent." },
        { q: "Why does dividing by 26 or 30 matter?", a: "Dividing by fewer days gives a higher daily and hourly rate, so overtime pay goes up. Check your contract or company policy." },
      ],
    },
  }),
  t({
    slug: "recurring-deposit-calculator-nepal",
    title: "Recurring Deposit Calculator Nepal — Monthly Saving Maturity",
    h1: "Recurring Deposit (RD) Calculator",
    h1Np: "आवधिक बचत गणक",
    shortTitle: "Recurring Deposit Calculator",
    description: "See what a monthly recurring deposit at a Nepali bank or cooperative grows to, after interest and tax on interest. Enter deposit, rate and months.",
    keywords: ["recurring deposit calculator nepal", "rd calculator nepal", "monthly saving calculator nepal", "aawadhik bachat", "bank monthly deposit scheme nepal"],
    componentKey: "f:recurringDeposit",
    related: ["fixed-deposit-calculator-nepal", "sip-calculator-nepal", "savings-goal-calculator"],
    content: {
      intro: [
        "Many banks and cooperatives in Nepal offer a **recurring deposit**: you put in the same amount every month and get it back with interest at the end.",
        "Enter your monthly amount, the interest rate the bank quotes, and the period. You'll see the maturity amount after the tax on interest is deducted, so there are no surprises on payout day.",
      ],
      steps: ["Enter your **monthly deposit**.", "Enter the **interest rate** from the bank's scheme.", "Choose the **number of months**.", "Check the tax rate with your bank and read the maturity amount."],
      faqs: [
        { q: "How do banks compound recurring deposits?", a: "Most banks in Nepal calculate interest quarterly. This calculator compounds monthly, so your bank's figure may be slightly different." },
        { q: "What if I miss a month?", a: "Banks may charge a penalty or reduce the interest. Read the scheme's terms before you sign up." },
      ],
    },
  }),
  t({
    slug: "loan-prepayment-calculator",
    title: "Loan Prepayment Calculator — How Much Interest Paying Early Saves",
    h1: "Loan Prepayment Calculator",
    h1Np: "ऋण छिटो तिर्दा कति बचत?",
    shortTitle: "Loan Prepayment Calculator",
    description: "Find out how much interest you save and how many months you cut off a home or car loan by paying a little extra each month or a lump sum now.",
    keywords: ["loan prepayment calculator", "home loan prepayment nepal", "pay off loan early calculator", "extra emi payment calculator", "loan payoff calculator nepal"],
    componentKey: "f:loanPrepay",
    related: ["emi-calculator-nepal", "loan-comparison-calculator", "loan-affordability-calculator"],
    content: {
      intro: [
        "Paying even **Rs 5,000 extra a month** on a home loan can cut years off the term and save lakhs in interest. Seeing the actual number makes it easier to decide.",
        "Enter what's left on your loan, the rate and years remaining, then try an extra monthly payment, a one-time payment, or both.",
      ],
      steps: ["Enter the **loan balance** you still owe.", "Enter the **interest rate** and **years left**.", "Add an **extra monthly payment** and/or a **one-time payment**.", "See the interest saved and your new finish date."],
      faqs: [
        { q: "Do banks in Nepal charge a prepayment fee?", a: "Some do, usually a small percentage of the amount prepaid, especially if you switch to another bank. Ask your bank before paying." },
        { q: "Is it better to lower the EMI or the term?", a: "Keeping the same EMI and shortening the term saves the most interest. This calculator shows that option." },
      ],
    },
  }),
  t({
    slug: "loan-affordability-calculator",
    title: "How Much Loan Can I Get? Loan Eligibility Calculator Nepal",
    h1: "How Much Can I Borrow?",
    h1Np: "मैले कति ऋण पाउँछु?",
    shortTitle: "Loan Affordability Calculator",
    description: "Estimate the home, car or personal loan you can afford from your monthly income and existing EMIs, the way Nepali banks check it.",
    keywords: ["how much loan can i get nepal", "loan eligibility calculator nepal", "home loan eligibility nepal", "loan affordability calculator", "maximum loan amount calculator"],
    componentKey: "f:affordability",
    related: ["emi-calculator-nepal", "loan-comparison-calculator", "loan-prepayment-calculator"],
    content: {
      intro: [
        "Before a bank approves a loan, it checks how much of your income already goes to EMIs. If the new EMI would push the total too high, they lower the amount or say no.",
        "Enter your take-home income and any EMIs you already pay. The calculator works backwards to the biggest loan whose EMI fits, so you know what to ask for before you visit the bank.",
      ],
      steps: ["Enter your **monthly take-home income**.", "Add any **EMIs you already pay**.", "Set the **share of income** you're comfortable spending on EMIs.", "Enter the bank's **rate** and **loan period**."],
      faqs: [
        { q: "Does the bank also look at the property value?", a: "Yes. Nepal Rastra Bank limits loans to a share of the property's value (loan-to-value). You need both enough income and enough collateral." },
        { q: "Can a family member's income be added?", a: "Many banks allow a joint applicant's income. Add it to the income box to see the effect." },
      ],
    },
  }),
  t({
    slug: "loan-comparison-calculator",
    title: "Loan Comparison Calculator — Compare Two Bank Loan Offers",
    h1: "Compare Two Loan Offers",
    h1Np: "दुई बैंकको ऋण तुलना",
    shortTitle: "Loan Comparison",
    description: "Put two bank loan offers side by side: EMI, total interest, service fee and total cost. See which bank is actually cheaper, not just which rate looks lower.",
    keywords: ["loan comparison calculator", "compare home loan nepal", "which bank loan is cheaper", "compare emi two banks", "bank interest rate comparison nepal"],
    componentKey: "f:loanCompare",
    related: ["emi-calculator-nepal", "loan-affordability-calculator", "loan-prepayment-calculator"],
    content: {
      intro: [
        "One bank offers a lower rate, another a lower service fee or a longer term. It's hard to tell which costs less in the end.",
        "Enter both offers and the calculator works out the EMI, total interest and fee for each, then tells you which one is cheaper overall and by how much.",
      ],
      steps: ["Enter the **loan amount**.", "Fill in each bank's **rate**, **period** and **service fee**.", "Read which offer is cheaper and the total for each."],
      faqs: [
        { q: "Banks say rates are 'base rate plus premium'. What do I enter?", a: "Add them together. If the base rate is 8% and the premium is 2.5%, enter 10.5%. Remember the base rate can change later." },
        { q: "Should I just pick the lower EMI?", a: "Not always. A longer term lowers the EMI but raises the total interest. Compare the total cost." },
      ],
    },
  }),
  t({
    slug: "savings-goal-calculator",
    title: "Savings Goal Calculator — How Much to Save Each Month",
    h1: "Savings Goal Calculator",
    h1Np: "बचत लक्ष्य गणक",
    shortTitle: "Savings Goal Calculator",
    description: "Saving for a bike, a wedding, a plot of land or studies abroad? Find how much you need to put away each month to reach your target on time.",
    keywords: ["savings goal calculator", "how much to save per month", "monthly saving plan nepal", "saving calculator nepal", "bachat calculator"],
    componentKey: "f:savingsGoal",
    related: ["recurring-deposit-calculator-nepal", "sip-calculator-nepal", "inflation-calculator-nepal"],
    content: {
      intro: [
        "A big goal feels far away until you break it into a monthly number. This calculator tells you exactly how much to save each month, and even per day, to get there.",
        "It counts what you've already saved and the interest your money earns along the way, so the monthly amount is lower than simply dividing by the months.",
      ],
      steps: ["Enter your **target amount**.", "Enter what you've **saved already**.", "Choose **how many years** you have.", "Enter the **interest or return** you expect."],
      faqs: [
        { q: "What return should I use?", a: "For a bank saving account or FD, use its interest rate. For mutual funds or shares returns are not guaranteed, so use a cautious figure." },
        { q: "Should I account for rising prices?", a: "Yes, for goals more than a few years away. Use the inflation calculator to see what your target will cost in future." },
      ],
    },
  }),
  t({
    slug: "inflation-calculator-nepal",
    title: "Inflation Calculator Nepal — Future Cost & Value of Money",
    h1: "Inflation Calculator (Nepal)",
    h1Np: "मुद्रास्फीति गणक",
    shortTitle: "Inflation Calculator",
    description: "See what something that costs Rs 1 lakh today will cost in 5, 10 or 20 years, and what today's money will really be worth then.",
    keywords: ["inflation calculator nepal", "future value of money nepal", "mudrasfiti", "price increase calculator", "value of rupee in future"],
    componentKey: "f:inflation",
    related: ["savings-goal-calculator", "cagr-calculator", "compound-interest-calculator"],
    content: {
      intro: [
        "When prices rise every year, the same rupee buys less. If inflation runs at 5–6%, things cost almost **double in 12 years**.",
        "Enter an amount, an inflation rate and a number of years to see the future price and how much today's savings will be worth in real terms. It's a reality check for retirement and education planning.",
      ],
      steps: ["Enter an **amount** in today's money.", "Enter an **inflation rate** (check Nepal Rastra Bank's latest figure).", "Choose the **number of years**."],
      faqs: [
        { q: "Where can I find Nepal's inflation rate?", a: "Nepal Rastra Bank publishes the consumer price inflation rate every month in its 'Current Macroeconomic Situation' report." },
        { q: "Is my bank interest beating inflation?", a: "Only if the rate after tax is higher than inflation. If your FD pays 6% and inflation is 5%, your real gain is about 1%." },
      ],
    },
  }),
  t({
    slug: "cagr-calculator",
    title: "CAGR Calculator — Yearly Growth Rate of an Investment",
    h1: "CAGR Calculator",
    h1Np: "वार्षिक औसत वृद्धि दर",
    shortTitle: "CAGR Calculator",
    description: "Find the compound annual growth rate (CAGR) of shares, land, a business or a mutual fund from its starting value, ending value and years.",
    keywords: ["cagr calculator", "compound annual growth rate", "cagr calculator nepal", "investment growth rate calculator", "annual return calculator"],
    componentKey: "f:cagr",
    related: ["inflation-calculator-nepal", "money-double-calculator", "sip-calculator-nepal"],
    content: {
      intro: [
        "\"My land doubled in 8 years\" sounds great, but what is that per year? **CAGR** gives the steady yearly rate that would take you from the starting value to the ending value.",
        "It's the fair way to compare a share, a plot of land, a fixed deposit and a business against each other.",
      ],
      steps: ["Enter the **starting value**.", "Enter the **ending value**.", "Enter the **number of years** between them."],
      faqs: [
        { q: "How is CAGR different from average return?", a: "A simple average ignores compounding and can overstate growth. CAGR is the one rate that, compounded, gives the real result." },
      ],
    },
  }),
  t({
    slug: "money-double-calculator",
    title: "How Long to Double Money? Rule of 72 Calculator",
    h1: "When Will My Money Double?",
    h1Np: "पैसा कहिले दोब्बर हुन्छ?",
    shortTitle: "Money Double Calculator",
    description: "Enter an interest rate and see exactly how many years it takes your money to double, triple or grow ten times, along with the Rule of 72 shortcut.",
    keywords: ["rule of 72 calculator", "money double calculator", "how long to double money", "paisa doubble kati barsa", "doubling time calculator"],
    componentKey: "f:doubleMoney",
    related: ["cagr-calculator", "fixed-deposit-calculator-nepal", "compound-interest-calculator"],
    content: {
      intro: [
        "A quick mental trick: divide **72 by the interest rate** and you get roughly how many years your money takes to double. At 8%, that's about 9 years.",
        "This calculator gives the exact answer too, plus how long it takes to triple and to grow ten times. It's handy when someone promises a scheme that doubles your money in two years: at that speed, it would need about 41% a year.",
      ],
      steps: ["Enter a **yearly interest rate or return**.", "Read the doubling, tripling and 10× times."],
      faqs: [
        { q: "Is the Rule of 72 accurate?", a: "It's close for rates between about 6% and 10%. Outside that range the exact figure shown here is better." },
      ],
    },
  }),
  t({
    slug: "salary-to-hourly-calculator",
    title: "Salary to Hourly, Daily & Monthly Pay Calculator (Nepal)",
    h1: "Salary to Hourly & Daily Rate",
    h1Np: "तलब: घण्टा, दिन, महिना",
    shortTitle: "Salary Converter",
    description: "Convert a monthly salary into a daily and hourly rate, or an hourly wage into monthly and yearly pay. Uses Nepal's 6-day work week by default.",
    keywords: ["salary to hourly calculator", "monthly salary to daily wage nepal", "hourly rate calculator nepal", "daily wage calculator", "per day salary calculator"],
    componentKey: "f:salaryHourly",
    related: ["overtime-calculator-nepal", "income-tax-calculator-nepal", "gratuity-calculator-nepal"],
    content: {
      intro: [
        "Comparing a job that pays per month with freelance work that pays per hour? Or working out a deduction for a day of leave? You need the same pay in different units.",
        "Enter the amount, whether it's per hour, day, month or year, and your working hours. Everything else is filled in.",
      ],
      steps: ["Enter the **amount**.", "Choose whether it's **per hour, day, month or year**.", "Set your **hours per day** and **days per week**."],
      faqs: [
        { q: "Why 6 days a week?", a: "Most offices and businesses in Nepal work Sunday to Friday. Change it to 5 if you have Saturdays and Sundays off." },
      ],
    },
  }),
  t({
    slug: "bonus-right-share-price-calculator",
    title: "Bonus & Right Share Price Adjustment Calculator (NEPSE)",
    h1: "Bonus & Right Share Adjusted Price",
    h1Np: "बोनस/हकप्रद पछिको मूल्य",
    shortTitle: "Bonus/Right Share Price",
    description: "Calculate the adjusted market price of a NEPSE share after book closure for a bonus share, a right share, or both.",
    keywords: ["bonus share price adjustment calculator", "right share adjustment nepse", "adjusted price after bonus share", "nepse price adjustment", "hakprad share calculator"],
    componentKey: "f:shareAdjust",
    related: ["share-average-price-calculator", "dividend-calculator-nepal", "cagr-calculator"],
    content: {
      intro: [
        "When a company on NEPSE gives bonus or right shares, the share price drops on the book-close date because there are now more shares. NEPSE adjusts the price with a set formula.",
        "Enter the price before book close and the bonus and right percentages to see the adjusted price, so you know whether a 'big drop' is really a drop at all.",
      ],
      steps: ["Enter the **market price before book close**.", "Enter the **bonus share %** and/or **right share %**.", "Keep the right share price at **Rs 100** unless the notice says otherwise."],
      faqs: [
        { q: "What formula is used?", a: "Adjusted price = (price before + right % × right price) ÷ (1 + bonus % + right %)." },
        { q: "Do I lose money when the price drops after bonus?", a: "No. You get more shares, so your total value stays about the same at that moment." },
      ],
    },
  }),
  t({
    slug: "share-average-price-calculator",
    title: "Share Average Price Calculator — NEPSE WACC",
    h1: "Share Average Price Calculator",
    h1Np: "सेयरको औसत मूल्य",
    shortTitle: "Share Average Calculator",
    description: "Bought the same NEPSE share at different prices? Find your average cost per share (WACC), total invested, and profit or loss at today's price.",
    keywords: ["share average calculator nepal", "nepse wacc calculator", "average share price calculator", "share average karna", "stock average calculator"],
    componentKey: "f:shareAverage",
    related: ["bonus-right-share-price-calculator", "dividend-calculator-nepal", "profit-margin-calculator"],
    content: {
      intro: [
        "If you bought 100 shares at Rs 520 and later 50 at Rs 480, what did each share really cost you? That **average price** decides your profit when you sell, and it's what Meroshare asks for as WACC.",
        "Type each purchase on its own line as quantity and price. Add today's price if you want to see where you stand.",
      ],
      steps: ["Type each buy on a new line, like **100 520**.", "Optionally enter **today's market price**.", "Read your average price, total shares and profit or loss."],
      faqs: [
        { q: "Should I include broker commission?", a: "For an exact WACC, yes. Add the commission and SEBON fee to the price of each purchase." },
        { q: "How do bonus shares affect my average?", a: "Bonus shares come at zero cost, which lowers your average. Add them as a line with price 0, or use the value Meroshare shows for them." },
      ],
    },
  }),
  t({
    slug: "dividend-calculator-nepal",
    title: "Dividend Calculator Nepal — Cash & Bonus After 5% Tax",
    h1: "Dividend Calculator (NEPSE)",
    h1Np: "लाभांश गणक",
    shortTitle: "Dividend Calculator",
    description: "Find how much cash dividend you'll receive after tax and how many bonus shares you'll get from a NEPSE company's dividend announcement.",
    keywords: ["dividend calculator nepal", "nepse dividend calculator", "cash dividend tax nepal", "bonus share calculator", "labhansh calculator"],
    componentKey: "f:dividend",
    related: ["bonus-right-share-price-calculator", "share-average-price-calculator", "income-tax-calculator-nepal"],
    content: {
      intro: [
        "Companies announce dividends as a percentage of the **Rs 100 face value**, not the market price. A '10% bonus and 5.26% cash' sounds confusing until you put in your number of shares.",
        "The tax on dividends is 5% on both the cash and the bonus. Companies often give that odd 5.26% cash precisely to cover the tax on the bonus, so you may receive little or no cash at all. This calculator shows exactly what lands in your bank.",
      ],
      steps: ["Enter the **number of shares** you hold.", "Enter the **cash dividend %** and **bonus share %** from the announcement.", "Read the cash you receive and the bonus shares you get."],
      faqs: [
        { q: "Why do companies give 5.26% cash dividend?", a: "5.26% cash on top of a bonus covers the 5% tax on both the bonus and the cash, so investors don't have to pay tax out of their own pocket." },
        { q: "When do I get the dividend?", a: "You must hold the shares before the book-close date. Cash goes to the bank account linked to your demat account." },
      ],
    },
  }),
  t({
    slug: "profit-margin-calculator",
    title: "Profit Margin & Markup Calculator — Set Selling Price",
    h1: "Profit Margin & Markup Calculator",
    h1Np: "नाफा प्रतिशत गणक",
    shortTitle: "Profit Margin Calculator",
    description: "For shops and small businesses: find profit margin and markup from cost and selling price, or the selling price you need for the margin you want, with 13% VAT.",
    keywords: ["profit margin calculator", "markup calculator", "selling price calculator nepal", "nafa calculator", "profit percentage calculator"],
    componentKey: "f:profitMargin",
    category: "land-everyday",
    related: ["break-even-calculator", "vat-calculator-nepal", "discount-calculator"],
    content: {
      intro: [
        "A 25% markup is **not** a 25% profit margin, and mixing them up is one of the most common pricing mistakes in small shops.",
        "Enter your cost and selling price to see both, or enter the margin or markup you want and get the selling price, including the price with 13% VAT.",
      ],
      steps: ["Choose what you **already know**.", "Enter the **cost price**.", "Enter the selling price, margin or markup.", "Read the profit, margin, markup and VAT price."],
      faqs: [
        { q: "What's the difference between margin and markup?", a: "Markup is profit as a share of cost. Margin is profit as a share of the selling price. Cost Rs 800, sell Rs 1,000: markup 25%, margin 20%." },
      ],
    },
  }),
  t({
    slug: "break-even-calculator",
    title: "Break-Even Calculator — How Much to Sell to Cover Costs",
    h1: "Break-Even Calculator",
    h1Np: "नाफा-नोक्सान बराबर बिन्दु",
    shortTitle: "Break-Even Calculator",
    description: "Planning a café, shop or small business? Find how many items you need to sell each month and each day just to cover rent, salaries and other costs.",
    keywords: ["break even calculator", "break even point calculator nepal", "small business calculator nepal", "how many sales to cover costs", "business plan calculator"],
    componentKey: "f:breakEven",
    category: "land-everyday",
    related: ["profit-margin-calculator", "rent-increase-calculator", "loan-affordability-calculator"],
    content: {
      intro: [
        "Before opening a momo shop, a tea stall or an online store, the first question is simple: **how much do I need to sell just to stop losing money?**",
        "Enter your monthly fixed costs, your selling price and your cost per item. You'll see your break-even sales per month and per day. Anything above that is profit.",
      ],
      steps: ["Add up your **fixed monthly costs**: rent, salaries, electricity, loan EMI.", "Enter your **selling price** per item.", "Enter your **cost per item**: ingredients, stock, packaging."],
      faqs: [
        { q: "What if I sell many different items?", a: "Use your average sale per customer as the price and the average cost per customer as the cost." },
      ],
    },
  }),
  t({
    slug: "rent-increase-calculator",
    title: "Rent Increase Calculator — Kathmandu House Rent (घर भाडा)",
    h1: "Rent Increase Calculator",
    h1Np: "घर भाडा वृद्धि गणक",
    shortTitle: "Rent Increase Calculator",
    description: "See how your house or shop rent grows with a yearly or two-yearly increase, and how much you'll pay in total over the agreement.",
    keywords: ["rent increase calculator", "ghar bhada calculator", "घर भाडा", "rent agreement increase nepal", "shop rent calculator kathmandu"],
    componentKey: "f:rentIncrease",
    category: "land-everyday",
    related: ["break-even-calculator", "inflation-calculator-nepal", "land-area-converter"],
    content: {
      intro: [
        "Rental agreements in Kathmandu, Pokhara and other cities usually include a clause like **\"10% increase every 2 years\"**. It sounds small until you see the rent in year five.",
        "Enter your current rent and the increase in your agreement. You'll get a year-by-year table and the total you'll pay, useful whether you're the tenant or the landlord.",
      ],
      steps: ["Enter the **current monthly rent**.", "Enter the **increase %** and **how often** it applies.", "Choose **how many years** to show."],
      faqs: [
        { q: "Is there a legal limit on rent increases in Nepal?", a: "The Muluki Civil Code lets landlord and tenant agree the terms in a written contract. Whatever you both sign is what applies, so read the increase clause carefully." },
      ],
    },
  }),
];
