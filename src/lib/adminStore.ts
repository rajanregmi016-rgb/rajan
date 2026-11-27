import fs from "node:fs";
import path from "node:path";

export interface AdminState {
  contactMessages: Array<{
    id: string;
    date: string;
    name: string;
    email: string;
    topic: string;
    url?: string;
    message: string;
    status: "new" | "read";
  }>;
  seoEngine: {
    contentQueue: Array<{
      id: string;
      createdAt: string;
      toolSlug?: string;
      kind: "faq" | "paragraph" | "guide-draft" | "meta";
      text: string;
      confidence: "high" | "medium" | "low";
      status: "pending" | "approved" | "rejected";
      note?: string;
    }>;
    updateHistory: Array<{ date: string; action: string; status: "verified" | "auto" | "draft" }>;
  };
}

const FILE = path.join(process.cwd(), "src", "data", "admin-state.json");

export function getAdminState(): AdminState {
  if (!fs.existsSync(FILE)) {
    const seed: AdminState = {
      contactMessages: [],
      seoEngine: {
        contentQueue: [
          {
            id: "seed-1",
            createdAt: "2026-11-08",
            kind: "faq",
            toolSlug: "gold-price-in-nepal",
            text: "Draft FAQ: 'कति लाल एक तोला हो?' — auto-drafted from search queries; needs human check before adding.",
            confidence: "medium",
            status: "pending",
          },
        ],
        updateHistory: [
          { date: "2026-11-08", action: "Seeded gold/silver reference rates (FENEGOSIDA 2026-11-06 fixing)", status: "verified" },
          { date: "2026-11-08", action: "Launched 20 tools across 7 categories", status: "verified" },
        ],
      },
    };
    fs.writeFileSync(FILE, JSON.stringify(seed, null, 2), "utf-8");
    return seed;
  }
  return JSON.parse(fs.readFileSync(FILE, "utf-8")) as AdminState;
}

/** Ensure older state files (pre-contact-form) still satisfy the shape. */
export function getAdminStateSafe(): AdminState {
  const s = getAdminState();
  if (!s.contactMessages) s.contactMessages = [];
  if (!s.seoEngine) s.seoEngine = { contentQueue: [], updateHistory: [] };
  return s;
}

export function writeAdminState(updater: (s: AdminState) => AdminState): AdminState {
  const next = updater(getAdminState());
  fs.writeFileSync(FILE, JSON.stringify(next, null, 2), "utf-8");
  return next;
}
