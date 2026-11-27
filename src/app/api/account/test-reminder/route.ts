import { NextResponse } from "next/server";
import { userFromRequest } from "@/lib/server/supabaseAdmin";
import { addNotice } from "@/lib/server/notifications";
import { billEmail, resendReady, sendOne, type Bill } from "@/lib/server/newsletter";
import { nextDue } from "@/lib/server/reminders";

export const dynamic = "force-dynamic";
const last = new Map<string, number>();

/** Sends the signed-in user a sample of their soonest bill reminder, so they can see what arrives. */
export async function POST(req: Request) {
  const user = await userFromRequest(req);
  if (!user?.email) return NextResponse.json({ ok: false }, { status: 401 });
  if (!resendReady()) return NextResponse.json({ ok: false, error: "Email isn't set up yet." }, { status: 503 });
  if (Date.now() - (last.get(user.id) || 0) < 5 * 60e3) return NextResponse.json({ ok: false, error: "A test was sent a moment ago. Please wait 5 minutes." }, { status: 429 });
  const bills = Array.isArray(user.user_metadata?.bills) ? (user.user_metadata.bills as Bill[]) : [];
  if (!bills.length) return NextResponse.json({ ok: false, error: "Add a bill first." }, { status: 400 });
  const n = new Date(Date.now() + 345 * 60000);
  const today = new Date(n.getUTCFullYear(), n.getUTCMonth(), n.getUTCDate());
  const soonest = bills.map((b) => ({ b, due: nextDue(b.d, today) })).filter((x) => x.due).sort((a, c) => a.due!.days - c.due!.days)[0];
  if (!soonest) return NextResponse.json({ ok: false, error: "Couldn't work out the due date." }, { status: 400 });
  last.set(user.id, Date.now());
  const e = billEmail(user.email, soonest.b, soonest.due!.label, soonest.due!.days);
  await sendOne({ ...e, subject: `[Test] ${e.subject}` });
  await addNotice(user.id, { kind: "reminder", title: "Test reminder sent", body: `We emailed a sample reminder for ${soonest.b.label} to ${user.email}.`, href: "/account#bills" }).catch(() => null);
  console.log("[test-reminder] sent");
  return NextResponse.json({ ok: true, to: user.email });
}
