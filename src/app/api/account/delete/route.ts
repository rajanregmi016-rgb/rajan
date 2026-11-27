import { NextResponse } from "next/server";
import { supabaseAdmin, userFromRequest } from "@/lib/server/supabaseAdmin";
import { deleteNotices } from "@/lib/server/notifications";

export const dynamic = "force-dynamic";

/** Permanently deletes the signed-in user's account and stored data. */
export async function POST(req: Request) {
  const user = await userFromRequest(req);
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  const { confirm } = (await req.json().catch(() => ({}))) as { confirm?: string };
  if (confirm !== "DELETE") return NextResponse.json({ ok: false, error: "Type DELETE to confirm." }, { status: 400 });
  const db = supabaseAdmin()!;
  await deleteNotices(user.id).catch(() => null);
  if (user.email) await db.from("newsletter_subscribers").update({ status: "unsubscribed", updated_at: new Date().toISOString() }).eq("email", user.email.toLowerCase());
  const { error } = await db.auth.admin.deleteUser(user.id);
  if (error) return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
