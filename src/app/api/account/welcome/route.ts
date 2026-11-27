import { NextResponse } from "next/server";
import { supabaseAdmin, userFromRequest } from "@/lib/server/supabaseAdmin";
import { addNotice } from "@/lib/server/notifications";
import { accountWelcomeEmail, resendReady, sendOne } from "@/lib/server/newsletter";

export const dynamic = "force-dynamic";

/** Sends a one-time welcome email the first time a user reaches their account. */
export async function POST(req: Request) {
  const user = await userFromRequest(req);
  if (!user?.email) return NextResponse.json({ ok: false }, { status: 401 });
  const meta = (user.user_metadata || {}) as Record<string, unknown>;
  if (meta.welcomed_at) return NextResponse.json({ ok: true, already: true });
  if (!resendReady()) return NextResponse.json({ ok: false, error: "email not configured" }, { status: 503 });
  const name = (meta.full_name as string) || (meta.name as string) || "";
  await sendOne(accountWelcomeEmail(user.email, name));
  await addNotice(user.id, { kind: "welcome", title: "Welcome to All Nepali Tools", body: "Set a gold or dollar price alert, save your Nepali dates, and switch on the daily rates email.", href: "/account" }).catch(() => null);
  await supabaseAdmin()!.auth.admin.updateUserById(user.id, { user_metadata: { ...meta, welcomed_at: new Date().toISOString() } });
  return NextResponse.json({ ok: true });
}
