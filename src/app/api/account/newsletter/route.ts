import { NextResponse } from "next/server";
import { supabaseAdmin, userFromRequest } from "@/lib/server/supabaseAdmin";
import { resendReady, sendOne, welcomeEmail } from "@/lib/server/newsletter";
import { SITE_URL } from "@/config/site";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const user = await userFromRequest(req);
  if (!user?.email) return NextResponse.json({ ok: false }, { status: 401 });
  const r = await supabaseAdmin()!.from("newsletter_subscribers").select("status").eq("email", user.email.toLowerCase()).maybeSingle();
  return NextResponse.json({ ok: true, subscribed: r.data?.status === "subscribed", email: user.email });
}

export async function POST(req: Request) {
  const user = await userFromRequest(req);
  if (!user?.email) return NextResponse.json({ ok: false }, { status: 401 });
  const { subscribe } = (await req.json().catch(() => ({}))) as { subscribe?: boolean };
  const email = user.email.toLowerCase();
  const db = supabaseAdmin()!;
  const before = await db.from("newsletter_subscribers").select("status").eq("email", email).maybeSingle();
  const up = await db
    .from("newsletter_subscribers")
    .upsert({ email, status: subscribe ? "subscribed" : "unsubscribed", source: "account", updated_at: new Date().toISOString() }, { onConflict: "email" })
    .select("confirm_token")
    .single();
  if (up.error) return NextResponse.json({ ok: false, error: up.error.message }, { status: 500 });
  if (subscribe && before.data?.status !== "subscribed" && resendReady()) {
    await sendOne(welcomeEmail(email, `${SITE_URL}/api/newsletter/unsubscribe?token=${up.data.confirm_token}`)).catch(() => null);
  }
  return NextResponse.json({ ok: true, subscribed: !!subscribe });
}
