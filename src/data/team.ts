/**
 * Team shown on /team.
 * To add a real person: set `name` (and optionally `photo`, a path in /public,
 * and `bio`). Members without a name are shown as a role card only.
 */
export interface TeamMember {
  role: string;
  roleNp: string;
  name?: string;
  photo?: string;
  bio: string;
  focus: string[];
}

export const TEAM: TeamMember[] = [
  {
    role: "Founder & Editor",
    roleNp: "संस्थापक र सम्पादक",
    bio: "Started All Nepali Tools to give Nepal one honest place for everyday calculations. Decides what we build next and reviews every page before it goes live.",
    focus: ["Product", "Editorial review", "Reader feedback"],
  },
  {
    role: "Data & Accuracy",
    roleNp: "तथ्यांक र शुद्धता",
    bio: "Checks gold, currency and tax figures against FENEGOSIDA, Nepal Rastra Bank and the Finance Act, and handles every correction readers send in.",
    focus: ["Official sources", "Rate checks", "Corrections"],
  },
  {
    role: "Nepali Language",
    roleNp: "नेपाली भाषा",
    bio: "Looks after Preeti and Unicode conversion, Nepali typing, number-to-words and the Nepali wording across the site.",
    focus: ["Unicode", "Spelling", "Translations"],
  },
  {
    role: "Engineering & Design",
    roleNp: "प्रविधि र डिजाइन",
    bio: "Builds and tests the tools, keeps pages fast on cheap phones and slow connections, and makes sure everything works in dark mode.",
    focus: ["Speed", "Accessibility", "Testing"],
  },
];
