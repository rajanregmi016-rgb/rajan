import type { Tool } from "@/lib/tools";

const D = "2026-11-27";

type Lite = Omit<Tool, "renderAs" | "lastUpdated">;
const t = (x: Lite): Tool => ({ renderAs: "tool", lastUpdated: D, ...x } as Tool);
const HOME = "land-everyday";
const EDU = "math-education";

export const BATCH_HOME_TOOLS: Tool[] = [
  t({
    slug: "brick-calculator-nepal",
    title: "Brick Calculator Nepal — Bricks, Cement & Sand for a Wall (इँटा हिसाब)",
    h1: "Brick Calculator for Walls",
    h1Np: "इँटा, सिमेन्ट, बालुवा हिसाब",
    shortTitle: "Brick Calculator",
    description: "How many bricks, cement bags and cft of sand do you need for a 9-inch or 4-inch wall? Enter the wall size and get an estimate based on Nepali brick sizes.",
    category: HOME,
    keywords: ["brick calculator nepal", "how many bricks in 9 inch wall", "ita calculation", "इँटा हिसाब", "brick cement sand calculator", "bricks per sq ft nepal"],
    componentKey: "f:bricks",
    related: ["cement-concrete-calculator", "tile-calculator", "land-area-converter"],
    content: {
      intro: [
        "Building a compound wall or adding a room? The first thing a contractor quotes is **bricks, cement and sand**. Knowing the numbers yourself helps you check the quote and avoid paying for a truckload you don't need.",
        "Enter the wall's length and height, pick the thickness, and subtract doors and windows. The calculator uses a standard Nepali brick (230 × 110 × 55 mm) with a 10 mm mortar joint.",
      ],
      steps: ["Measure the wall's **length and height** in feet.", "Choose **9 inch** for outer walls or **4.5 inch** for partitions.", "Subtract the area of **doors and windows**.", "Pick the **mortar mix** your mason uses (1:6 is common)."],
      faqs: [
        { q: "How many bricks are in 100 sq ft of 9-inch wall?", a: "About 1,130 bricks, or around 1,190 with 5% extra for breakage, using standard Nepali bricks and 10 mm joints." },
        { q: "Why is my contractor's number different?", a: "Brick size varies by kiln, and machine-made bricks are larger. Joints thicker than 10 mm also change the count. Use this as a check, not a final order." },
      ],
    },
  }),
  t({
    slug: "paint-calculator",
    title: "Paint Calculator — How Many Litres to Paint a Room or House",
    h1: "Paint Calculator",
    h1Np: "रंग कति लिटर चाहिन्छ?",
    shortTitle: "Paint Calculator",
    description: "Work out how many litres of paint you need for your walls, how many 4 L, 10 L or 20 L buckets to buy, and the estimated cost.",
    category: HOME,
    keywords: ["paint calculator", "how much paint do i need", "paint calculator nepal", "litres of paint per sq ft", "rang calculator", "house paint estimate"],
    componentKey: "f:paint",
    related: ["tile-calculator", "brick-calculator-nepal", "unit-converter"],
    content: {
      intro: [
        "Dashain and Tihar are when most of Nepal repaints. Buying too little means a second trip and a slightly different shade; buying too much wastes money.",
        "Enter the wall area and number of coats. The coverage per litre is printed on every bucket, so check yours. You'll get the litres you need and the mix of bucket sizes to buy.",
      ],
      steps: ["Measure the **wall area**: for a room, (length + width) × 2 × height.", "Subtract **doors and windows**.", "Enter the **number of coats** (2 is standard).", "Enter the **coverage** from the bucket label."],
      faqs: [
        { q: "How many sq ft does 1 litre of paint cover?", a: "Interior emulsions usually cover 90 to 140 sq ft per litre for one coat on a smooth wall. Rough or new walls take more." },
        { q: "Do I need primer?", a: "On new plaster or when changing from dark to light colour, yes. Primer has its own coverage; calculate it separately." },
      ],
    },
  }),
  t({
    slug: "tile-calculator",
    title: "Tile Calculator — Tiles & Boxes for a Floor (2×2, 1×1, 2×4)",
    h1: "Tile Calculator",
    h1Np: "टायल कति चाहिन्छ?",
    shortTitle: "Tile Calculator",
    description: "Find how many floor or wall tiles and how many boxes you need for a room, with extra for cutting. Works with 2×2 ft, 1×1 ft, 2×4 ft and other common sizes.",
    category: HOME,
    keywords: ["tile calculator", "how many tiles do i need", "2x2 tiles calculator", "tile box calculator nepal", "floor tiles estimate", "tiles per sq ft"],
    componentKey: "f:tiles",
    related: ["paint-calculator", "land-area-converter", "unit-converter"],
    content: {
      intro: [
        "Tiles are sold by the box, but rooms are measured in square feet. This calculator does the conversion and adds extra for cuts at the edges so you don't run short halfway through.",
        "Pick your tile size, enter the room's length and width, and check the number of tiles per box on the packaging.",
      ],
      steps: ["Enter the room's **length and width** in feet.", "Choose the **tile size**.", "Enter **tiles per box** from the packaging.", "Keep **10% extra** for straight layouts, 15% for diagonal."],
      faqs: [
        { q: "How many 2×2 tiles do I need for 100 sq ft?", a: "25 tiles exactly, or about 28 with 10% extra for cutting. That's 7 boxes of 4." },
        { q: "Should I keep spare tiles?", a: "Yes. Keep a few from the same batch. Later batches can differ slightly in shade." },
      ],
    },
  }),
  t({
    slug: "cement-concrete-calculator",
    title: "Cement, Sand & Gitti Calculator for Slab and RCC (M15, M20)",
    h1: "Concrete Material Calculator",
    h1Np: "सिमेन्ट, बालुवा, गिट्टी हिसाब",
    shortTitle: "Concrete Calculator",
    description: "Estimate cement bags, sand and aggregate (gitti) for a roof slab, floor or footing in M10, M15, M20 or M25 concrete. Enter size in feet and inches.",
    category: HOME,
    keywords: ["cement sand calculator", "concrete calculator nepal", "slab cement calculation", "m20 concrete ratio", "gitti calculation", "dhalan calculator"],
    componentKey: "f:concrete",
    related: ["brick-calculator-nepal", "tile-calculator", "unit-converter"],
    content: {
      intro: [
        "Before a **dhalan** (concrete pour), everything has to be on site: cement, sand and gitti. Running short in the middle of a slab is a real problem.",
        "Enter the slab or floor size and pick the concrete grade. The calculator uses the standard dry-volume method to tell you how many 50 kg cement bags and how many cft of sand and aggregate to order.",
      ],
      steps: ["Enter **length and width** in feet.", "Enter **thickness** in inches.", "Pick the **grade**: M20 for slabs, beams and columns; M10 or M15 for floors and PCC.", "Order a little extra for spillage."],
      faqs: [
        { q: "What ratio is M20?", a: "Roughly 1 part cement, 1.5 parts sand and 3 parts aggregate by volume." },
        { q: "Why multiply by 1.54?", a: "Dry materials shrink when water is added and gaps fill, so you need about 54% more dry volume than the finished concrete." },
      ],
    },
  }),
  t({
    slug: "water-tank-capacity-calculator",
    title: "Water Tank Capacity Calculator — Litres from Feet",
    h1: "Water Tank Capacity Calculator",
    h1Np: "पानी ट्याङ्की क्षमता",
    shortTitle: "Water Tank Calculator",
    description: "Find how many litres your underground or overhead water tank holds, for box or round tanks measured in feet, and how many days it will last.",
    category: HOME,
    keywords: ["water tank capacity calculator", "tank litre calculator feet", "underground tank size nepal", "how many litres in tank", "pani tanki calculator"],
    componentKey: "f:waterTank",
    related: ["unit-converter", "brick-calculator-nepal", "electricity-bill-calculator-nepal"],
    content: {
      intro: [
        "With Melamchi water still irregular in many parts of the Kathmandu Valley, most houses depend on an underground tank and tanker deliveries. Knowing the real capacity helps you order the right amount.",
        "Enter the inside measurements in feet. You'll get the capacity in litres, how many 6,000-litre tankers fill it, and how long it lasts for your household.",
      ],
      steps: ["Choose a **box** or **round** tank.", "Measure the **inside** length and width, or the diameter.", "Enter the **water depth**, not the full tank height, for current volume.", "Optionally enter your **daily use**."],
      faqs: [
        { q: "How many litres are in 1 cubic foot?", a: "About 28.32 litres." },
        { q: "How big a tank does a family need?", a: "Many households in Kathmandu keep 5,000 to 10,000 litres so one tanker fits and lasts 1–2 weeks." },
      ],
    },
  }),
  t({
    slug: "electricity-bill-calculator-nepal",
    title: "Electricity Units & Bill Calculator — Appliance Power Use (NEA)",
    h1: "Electricity Usage Calculator",
    h1Np: "बिजुली युनिट हिसाब",
    shortTitle: "Electricity Usage Calculator",
    description: "List your appliances, their watts and hours of use, and see the monthly units (kWh) and estimated NEA bill. Find out which appliance uses the most.",
    category: HOME,
    keywords: ["electricity bill calculator nepal", "nea bill calculator", "kwh calculator", "bijuli unit calculation", "appliance power consumption calculator", "how many units does a fridge use"],
    componentKey: "f:electricity",
    related: ["water-tank-capacity-calculator", "lpg-gas-cylinder-calculator", "unit-converter"],
    content: {
      intro: [
        "Your NEA bill shows units used, but not which appliance used them. An induction cooker, a geyser or a water pump can quietly double the bill.",
        "Type each appliance with its wattage and hours of daily use. The calculator adds up the monthly units, and if you enter the per-unit rate from your bill, estimates the cost.",
      ],
      steps: ["Type one appliance per line: **name, watts, hours per day**.", "Check the wattage on the label.", "Enter the **rate per unit** from your NEA bill.", "See which appliance uses the most."],
      faqs: [
        { q: "What is one unit of electricity?", a: "One unit is one kilowatt-hour (kWh): a 1,000-watt appliance running for one hour, or a 100-watt one running for 10 hours." },
        { q: "Is induction cooking cheaper than LPG?", a: "Often yes at domestic rates, but it depends on your slab. Compare this calculator's result with the LPG cylinder calculator." },
      ],
    },
  }),
  t({
    slug: "dharni-ser-pau-converter",
    title: "Dharni, Ser, Pau to KG Converter (धार्नी, सेर, पाउ)",
    h1: "Dharni, Ser & Pau to Kilogram",
    h1Np: "धार्नी, सेर, पाउ ↔ केजी",
    shortTitle: "Dharni to KG",
    description: "Convert Nepal's traditional weights, dharni, ser, pau and chatak, into kilograms and grams, and back. Useful for meat, vegetables and village markets.",
    category: HOME,
    keywords: ["dharni to kg", "1 dharni in kg", "pau to gram", "ser to kg nepal", "धार्नी", "nepali weight units"],
    componentKey: "f:dharni",
    related: ["muri-pathi-mana-converter", "tola-to-gram-converter", "unit-converter"],
    content: {
      intro: [
        "Ask for meat in a village haat or an old Kathmandu bazaar and you might hear prices **per dharni** or **per pau**. Recipes from grandparents use ser and chatak.",
        "This converter switches between the traditional units and kilograms. Since shops don't all use exactly the same pau, you can change its weight.",
      ],
      steps: ["Enter an **amount**.", "Pick the **unit** you have.", "Read all the other units."],
      faqs: [
        { q: "How many kg is 1 dharni?", a: "About 2.4 kg. 1 dharni = 3 ser = 12 pau." },
        { q: "How many grams is 1 pau?", a: "About 200 grams. Traditionally it's 199.6 g, so most shops round it." },
      ],
    },
  }),
  t({
    slug: "muri-pathi-mana-converter",
    title: "Muri, Pathi, Mana to Litre Converter (मुरी, पाथी, माना)",
    h1: "Muri, Pathi & Mana Converter",
    h1Np: "मुरी, पाथी, माना ↔ लिटर",
    shortTitle: "Pathi to Litre",
    description: "Convert Nepal's traditional grain measures, muri, pathi, mana and muthi, into litres. Know how much rice, paddy or millet you're buying or selling.",
    category: HOME,
    keywords: ["pathi to litre", "1 muri in kg", "mana to litre", "muri pathi mana", "पाथी", "nepali grain measurement"],
    componentKey: "f:muriPathi",
    related: ["dharni-ser-pau-converter", "unit-converter", "land-area-converter"],
    content: {
      intro: [
        "In much of rural Nepal, rice, paddy, maize and millet are still traded by the **pathi** and the **muri**. A family's harvest is counted in muri, and a cook measures rice in mana.",
        "Convert between them and litres here. These are measures of volume, so the weight depends on the grain.",
      ],
      steps: ["Enter an **amount**.", "Choose the **unit**.", "Read the conversion to every other unit."],
      faqs: [
        { q: "How many mana are in a pathi?", a: "8 mana make 1 pathi, and 20 pathi make 1 muri." },
        { q: "How many kg of rice is one pathi?", a: "Roughly 3.5 to 4 kg for husked rice, and less for paddy (dhaan), because it's lighter for the same volume." },
      ],
    },
  }),
  t({
    slug: "bike-mileage-calculator",
    title: "Bike & Car Mileage Calculator — km per Litre and Cost per km",
    h1: "Mileage Calculator",
    h1Np: "माइलेज हिसाब",
    shortTitle: "Mileage Calculator",
    description: "Check your motorbike, scooter or car's real mileage in km per litre from a full-tank test, plus the cost per km and per month at today's fuel price.",
    category: HOME,
    keywords: ["bike mileage calculator", "mileage calculator nepal", "km per litre calculator", "scooter mileage check", "fuel efficiency calculator", "petrol cost per km"],
    componentKey: "f:mileage",
    related: ["fuel-cost-calculator", "travel-time-calculator", "unit-converter"],
    content: {
      intro: [
        "The mileage in the showroom brochure is not what you get in Kathmandu traffic. The **full-tank method** gives your real figure.",
        "Fill the tank to full, reset the trip meter, ride as normal, then fill to full again. Enter the km and the litres needed for the second fill.",
      ],
      steps: ["Fill to **full** and reset the trip meter.", "Ride normally for a few days.", "Fill to full again and note the **litres** and **km**.", "Enter both, plus the fuel price if you want costs."],
      faqs: [
        { q: "Why is my mileage lower than advertised?", a: "Traffic, idling, tyre pressure, hills, an overdue service and riding style all reduce it. Company figures come from ideal test conditions." },
      ],
    },
  }),
  t({
    slug: "travel-time-calculator",
    title: "Travel Time Calculator Nepal — Arrival Time by Road",
    h1: "Road Travel Time Calculator",
    h1Np: "यात्रा समय गणक",
    shortTitle: "Travel Time Calculator",
    description: "Planning a bus or car trip in Nepal? Enter distance, a realistic average speed and stops to see total travel time and when you'll arrive.",
    category: HOME,
    keywords: ["travel time calculator", "kathmandu to pokhara time", "nepal road travel time", "arrival time calculator", "bus travel time nepal"],
    componentKey: "f:travelTime",
    related: ["bike-mileage-calculator", "fuel-cost-calculator", "nepal-time"],
    content: {
      intro: [
        "Kathmandu to Pokhara is about 200 km, but nobody does it in three hours. Hill roads, traffic and tea stops bring the average speed down to 30–40 km/h.",
        "Enter the distance, a realistic average speed and your stop time, plus when you leave, to see your arrival time.",
      ],
      steps: ["Enter the **distance** in km.", "Set an honest **average speed**.", "Add time for **stops**.", "Enter your **departure time**."],
      faqs: [
        { q: "What average speed should I use?", a: "For highways in the hills, 30–40 km/h. On the East-West Highway in the Terai, 45–55 km/h is possible outside towns." },
      ],
    },
  }),
  t({
    slug: "price-per-unit-calculator",
    title: "Price per Unit Calculator — Which Pack Is Cheaper?",
    h1: "Which Pack Is Better Value?",
    h1Np: "कुन प्याक सस्तो?",
    shortTitle: "Price per Unit",
    description: "Compare two packs of rice, oil, milk powder or soap by price per gram, litre or piece, and see which one actually saves you money.",
    category: HOME,
    keywords: ["price per unit calculator", "unit price comparison", "which is cheaper calculator", "price per kg calculator", "best value calculator"],
    componentKey: "f:unitPrice",
    related: ["discount-calculator", "bill-split-calculator", "profit-margin-calculator"],
    content: {
      intro: [
        "Bigger packs are usually cheaper per kg, but not always. Supermarket offers and odd pack sizes make it hard to compare in your head.",
        "Enter the price and size of two packs to see the price per 100 g (or per litre or piece) and which is the better deal.",
      ],
      steps: ["Enter **Pack A's price and size**.", "Enter **Pack B's price and size**.", "Choose the **unit**.", "Read which pack is cheaper per unit."],
      faqs: [
        { q: "Is the big pack always better?", a: "Only if you will use it before it expires. Cheaper per gram is not a saving if half goes to waste." },
      ],
    },
  }),
  t({
    slug: "lucky-draw-name-picker",
    title: "Lucky Draw Name Picker — Fair Random Winner Online",
    h1: "Lucky Draw Name Picker",
    h1Np: "चिट्ठा: विजेता छान्नुहोस्",
    shortTitle: "Lucky Draw Picker",
    description: "Pick one or more random winners from a list of names or ticket numbers for a dhukuti, office party, school raffle or online giveaway. Fair and repeatable.",
    category: HOME,
    keywords: ["lucky draw online", "random name picker", "chitthha", "random winner picker", "giveaway picker nepal", "raffle draw online"],
    componentKey: "f:luckyDraw",
    related: ["bill-split-calculator", "nepali-word-counter", "percentage-calculator"],
    content: {
      intro: [
        "Need to pick who goes first in a **dhukuti**, a winner for a Facebook giveaway, or names for an office Tihar gift exchange? Paste the list and draw.",
        "The draw is random but **repeatable**: the same list and draw number always gives the same result, so anyone can check it was fair. Change the draw number to draw again.",
      ],
      steps: ["Paste **names or ticket numbers**, one per line.", "Choose **how many winners**.", "Share your screen or the result. Change the **draw number** for a new draw."],
      faqs: [
        { q: "Can people check the draw was fair?", a: "Yes. Share the exact list and the draw number. Anyone who enters them here gets the same winners." },
        { q: "What if a name is entered twice?", a: "Duplicates are counted once, so nobody gets an extra chance by accident." },
      ],
    },
  }),
  t({
    slug: "work-hours-calculator",
    title: "Work Hours Calculator — Time In, Time Out & Pay",
    h1: "Work Hours Calculator",
    h1Np: "काम गरेको घण्टा",
    shortTitle: "Work Hours Calculator",
    description: "Enter your start and finish time and break to get hours worked per day and per week, pay at an hourly rate, and any hours over Nepal's 48-hour week.",
    category: HOME,
    keywords: ["work hours calculator", "time card calculator", "hours worked calculator", "shift hours calculator", "timesheet calculator nepal"],
    componentKey: "f:workHours",
    related: ["overtime-calculator-nepal", "salary-to-hourly-calculator", "date-difference-calculator"],
    content: {
      intro: [
        "Shift workers, part-timers and freelancers all need to know their hours. Subtracting 9:30 from 17:45 and then a break isn't hard, but it's easy to slip by half an hour.",
        "Enter your start and finish time, break and days worked. Night shifts that cross midnight work too.",
      ],
      steps: ["Enter **start** and **finish** time.", "Enter your **break** in minutes.", "Enter the **number of days**.", "Optionally add your **hourly pay**."],
      faqs: [
        { q: "What are normal working hours in Nepal?", a: "The Labour Act sets 8 hours a day and 48 hours a week. Extra time counts as overtime." },
      ],
    },
  }),
  t({
    slug: "english-to-nepali-number-converter",
    title: "English to Nepali Number Converter (123 → १२३)",
    h1: "English ↔ Nepali Digit Converter",
    h1Np: "अंक रूपान्तरण: 123 ↔ १२३",
    shortTitle: "Nepali Digit Converter",
    description: "Convert English digits to Nepali (Devanagari) digits and back in any text: phone numbers, dates, amounts. Copy the result straight into Word or Facebook.",
    category: "nepali-language-unicode",
    keywords: ["english to nepali number", "nepali number converter", "१२३ to 123", "devanagari digits", "nepali ank", "convert numbers to nepali"],
    componentKey: "f:nepaliDigits",
    related: ["number-to-nepali-words", "preeti-to-unicode", "nepali-typing-online"],
    content: {
      intro: [
        "Writing a letter, invitation card or notice in Nepali looks odd with 2082 in English digits. Typing १२३ on a phone keyboard is slow.",
        "Paste any text and every digit is switched to Nepali, or back to English. Everything else stays exactly as you typed it.",
      ],
      steps: ["Choose the **direction**.", "Paste or type your **text**.", "Tap **Copy result**."],
      faqs: [
        { q: "Does it change letters too?", a: "No. Only the digits 0–9 change. For whole words, use the number to Nepali words tool or the Nepali typing tool." },
      ],
    },
  }),
  t({
    slug: "lpg-gas-cylinder-calculator",
    title: "LPG Gas Cylinder Calculator — When Will My Gas Run Out?",
    h1: "LPG Gas Cylinder Calculator",
    h1Np: "ग्यास सिलिन्डर कहिले सकिन्छ?",
    shortTitle: "Gas Cylinder Calculator",
    description: "Find the date your cooking gas cylinder will likely run out, in BS and AD, plus your monthly and yearly gas cost. Book the refill before it's empty.",
    category: HOME,
    keywords: ["lpg cylinder calculator", "gas cylinder kahile sakinchha", "cooking gas cost per month nepal", "gas refill date", "lpg usage calculator"],
    componentKey: "f:lpg",
    related: ["electricity-bill-calculator-nepal", "aaja-ko-miti", "bill-split-calculator"],
    content: {
      intro: [
        "Gas always runs out in the middle of cooking dinner. If you note the day you connect a new cylinder, you can predict the next one almost to the day.",
        "Enter the start date and how long your last cylinder lasted. You'll see the expected empty date in BS and AD, and the true cost of cooking gas per month.",
      ],
      steps: ["Enter the **date you connected** the current cylinder.", "Enter **how many days** the last one lasted.", "Optionally enter the **refill price**."],
      faqs: [
        { q: "How long does a 14.2 kg cylinder last?", a: "For a family of four cooking twice a day, usually 30 to 45 days. Heavy use or a commercial stove empties it faster." },
      ],
    },
  }),

  /* ---------- students & health ---------- */
  t({
    slug: "marks-percentage-calculator",
    title: "Marks Percentage Calculator — Total % and Grade per Subject",
    h1: "Marks to Percentage Calculator",
    h1Np: "प्राप्तांक प्रतिशत गणक",
    shortTitle: "Marks Percentage",
    description: "Add up marks for every subject to get your total percentage, each subject's percentage and its NEB letter grade. For school, college, TU and entrance exams.",
    category: EDU,
    keywords: ["marks percentage calculator", "percentage of marks", "total percentage calculator", "marks to grade nepal", "obtained marks percentage", "tu percentage calculator"],
    componentKey: "f:marksPercent",
    related: ["see-gpa-calculator", "neb-gpa-calculator", "percentage-calculator"],
    content: {
      intro: [
        "College forms, scholarships and many jobs ask for your **percentage**, but subjects often have different full marks: 100, 75, 50. Adding them by hand is error-prone.",
        "Type each subject with obtained and full marks. You'll get the overall percentage, and each subject's percentage and grade on the NEB scale.",
      ],
      steps: ["Type one subject per line, like **Math 88 100**.", "Use the right **full marks** for each subject.", "Read the overall **percentage** and the table."],
      faqs: [
        { q: "How do I convert GPA to percentage?", a: "There's no official one-to-one conversion for NEB GPA. If an institution asks, check their rule; many accept the grade sheet as it is." },
        { q: "Is the percentage an average of subject percentages?", a: "No. It's total obtained divided by total full marks, which gives more weight to subjects with more marks." },
      ],
    },
  }),
  t({
    slug: "attendance-calculator",
    title: "Attendance Percentage Calculator — Classes to Reach 75%",
    h1: "Attendance Calculator",
    h1Np: "हाजिरी प्रतिशत गणक",
    shortTitle: "Attendance Calculator",
    description: "Find your attendance percentage, how many classes you can still miss, or how many you must attend in a row to reach 75% (or your college's limit).",
    category: EDU,
    keywords: ["attendance calculator", "attendance percentage calculator", "75 attendance calculator", "how many classes can i miss", "tu attendance requirement"],
    componentKey: "f:attendance",
    related: ["marks-percentage-calculator", "percentage-calculator", "days-until-calculator"],
    content: {
      intro: [
        "Fall below the attendance limit and you may not be allowed to sit the board or semester exam. Most colleges in Nepal ask for **75% or 80%**.",
        "Enter classes attended and held. If you're above the line, you'll see how many you can still miss. If you're below, you'll see exactly how many classes in a row you need to recover.",
      ],
      steps: ["Enter **classes attended**.", "Enter **classes held** so far.", "Set your college's **required %**."],
      faqs: [
        { q: "Do medical leaves count?", a: "That depends on your college. Some excuse approved leave from the total, which raises your percentage. Ask your department." },
      ],
    },
  }),
  t({
    slug: "ratio-calculator",
    title: "Ratio Calculator — Simplify a Ratio and Split an Amount",
    h1: "Ratio Calculator",
    h1Np: "अनुपात गणक",
    shortTitle: "Ratio Calculator",
    description: "Simplify any ratio to its lowest terms, convert it to 1 : x and percentages, and divide an amount such as profit or property between people in that ratio.",
    category: EDU,
    keywords: ["ratio calculator", "simplify ratio", "anupat", "divide amount in ratio", "profit sharing ratio calculator", "ratio to percentage"],
    componentKey: "f:ratio",
    related: ["percentage-calculator", "bill-split-calculator", "average-calculator"],
    content: {
      intro: [
        "Ratios come up in maths homework, in business partnerships, and when splitting land or profit. This calculator reduces any ratio to its simplest form and shows it as 1 : x and as percentages.",
        "Add an amount to see how it divides. For example, Rs 1,20,000 profit split 3 : 5 between two partners.",
      ],
      steps: ["Enter the **two numbers** of the ratio.", "Optionally enter an **amount to divide**."],
      faqs: [
        { q: "How do you simplify a ratio?", a: "Divide both numbers by their highest common factor. 450 : 750 → both divide by 150 → 3 : 5." },
      ],
    },
  }),
  t({
    slug: "average-calculator",
    title: "Average Calculator — Mean, Median, Mode & Range",
    h1: "Average Calculator",
    h1Np: "औसत गणक",
    shortTitle: "Average Calculator",
    description: "Paste a list of numbers to get the mean, median, mode, range, sum and standard deviation at once. Handy for marks, sales and survey data.",
    category: EDU,
    keywords: ["average calculator", "mean median mode calculator", "ausat", "average marks calculator", "standard deviation calculator", "range calculator"],
    componentKey: "f:average",
    related: ["marks-percentage-calculator", "percentage-calculator", "lcm-hcf-calculator"],
    content: {
      intro: [
        "Class 9 and 10 maths and statistics in +2 all use mean, median and mode. Teachers, shopkeepers and survey takers use them too.",
        "Paste your numbers, separated by commas, spaces or new lines, and every measure appears together.",
      ],
      steps: ["Paste or type your **numbers**.", "Read the **mean, median, mode** and more."],
      faqs: [
        { q: "What's the difference between mean and median?", a: "The mean adds everything and divides by the count. The median is the middle value when sorted. One very large number moves the mean a lot but the median hardly at all." },
      ],
    },
  }),
  t({
    slug: "lcm-hcf-calculator",
    title: "LCM and HCF Calculator with Prime Factors (ल.स. र म.स.)",
    h1: "LCM & HCF Calculator",
    h1Np: "लघुत्तम समापवर्त्य र महत्तम समापवर्तक",
    shortTitle: "LCM & HCF Calculator",
    description: "Find the LCM (लघुत्तम समापवर्त्य) and HCF (महत्तम समापवर्तक) of two or more numbers, with the prime factorisation of each to check your homework.",
    category: EDU,
    keywords: ["lcm hcf calculator", "lcm calculator", "hcf calculator", "ल.स. म.स.", "prime factorization calculator", "gcd calculator"],
    componentKey: "f:lcmHcf",
    related: ["average-calculator", "ratio-calculator", "percentage-calculator"],
    content: {
      intro: [
        "LCM and HCF are in every Nepali school maths book from class 5 onwards. This calculator gives the answers along with the prime factors of each number, so students can follow the working.",
        "Enter two or more whole numbers separated by commas.",
      ],
      steps: ["Type **two or more numbers**.", "Read the **HCF** and **LCM**.", "Use the **prime factors** table to check your steps."],
      faqs: [
        { q: "How are LCM and HCF related?", a: "For two numbers, LCM × HCF = the product of the numbers. For 12 and 18: 36 × 6 = 216 = 12 × 18." },
      ],
    },
  }),
  t({
    slug: "area-calculator",
    title: "Area Calculator — Rectangle, Circle, Triangle, Trapezium",
    h1: "Area & Perimeter Calculator",
    h1Np: "क्षेत्रफल गणक",
    shortTitle: "Area Calculator",
    description: "Calculate the area and perimeter of a rectangle, square, circle, triangle, trapezium or parallelogram in metres, feet, cm or inches.",
    category: EDU,
    keywords: ["area calculator", "area of triangle calculator", "area of circle", "trapezium area", "kshetrafal", "perimeter calculator"],
    componentKey: "f:area",
    related: ["land-area-converter", "tile-calculator", "unit-converter"],
    content: {
      intro: [
        "From homework to measuring a room or an odd-shaped plot, area is something everyone needs. Pick a shape, enter its measurements, and get the area and perimeter.",
        "A triangle with three known sides uses Heron's formula, which is handy for irregular plots split into triangles. Convert the result to ropani or kattha with the land area converter.",
      ],
      steps: ["Choose the **shape**.", "Enter **a**, **b** and **c** as the shape needs.", "Pick the **unit**."],
      faqs: [
        { q: "How do I find the area of an irregular plot?", a: "Split it into triangles, measure all three sides of each, and add the areas. Then convert to ropani or kattha." },
      ],
    },
  }),
  t({
    slug: "calorie-bmr-calculator",
    title: "Calorie & BMR Calculator — Daily Calories to Lose or Gain Weight",
    h1: "Daily Calorie (BMR) Calculator",
    h1Np: "दैनिक क्यालोरी गणक",
    shortTitle: "Calorie Calculator",
    description: "Find how many calories your body needs each day to stay at your weight, lose weight or gain weight, using the Mifflin-St Jeor BMR formula.",
    category: EDU,
    keywords: ["calorie calculator", "bmr calculator", "how many calories should i eat", "daily calorie needs", "weight loss calorie calculator", "tdee calculator"],
    componentKey: "f:bmr",
    related: ["bmi-calculator", "water-intake-calculator", "age-calculator"],
    content: {
      intro: [
        "Your **BMR** is the energy your body burns at rest. Add your daily activity and you get the calories that keep your weight the same.",
        "Eat about 500 fewer calories a day and most people lose around half a kilo a week. This calculator gives all three numbers so you can plan meals.",
      ],
      steps: ["Choose your **sex** and enter **age**.", "Enter **weight** in kg and **height** in cm.", "Pick your **activity level** honestly."],
      faqs: [
        { q: "Is it safe to eat much less to lose weight faster?", a: "Very low intake can cause muscle loss and tiredness. Talk to a doctor or dietitian before going far below your BMR." },
      ],
    },
  }),
  t({
    slug: "water-intake-calculator",
    title: "Water Intake Calculator — How Much Water to Drink a Day",
    h1: "Daily Water Intake Calculator",
    h1Np: "दिनमा कति पानी पिउने?",
    shortTitle: "Water Intake Calculator",
    description: "Estimate how many litres and glasses of water you should drink each day based on your weight, exercise and whether you live in hot Terai weather or the hills.",
    category: EDU,
    keywords: ["water intake calculator", "how much water should i drink", "water per day by weight", "daily water calculator", "drinking water calculator"],
    componentKey: "f:water",
    related: ["calorie-bmr-calculator", "bmi-calculator", "age-calculator"],
    content: {
      intro: [
        "The \"8 glasses a day\" rule is only a rough guide. Your needs depend on your weight, how active you are, and the weather: a summer day in Birgunj is very different from winter in Jumla.",
        "Enter your weight, daily exercise and climate for a personal daily target in litres and glasses.",
      ],
      steps: ["Enter your **weight**.", "Add **minutes of exercise** or hard physical work.", "Choose **hot** if you live in the Terai or it's summer."],
      faqs: [
        { q: "Does tea count?", a: "Yes, tea, milk, soup and fruit all add water, though plain water is best." },
      ],
    },
  }),
];
