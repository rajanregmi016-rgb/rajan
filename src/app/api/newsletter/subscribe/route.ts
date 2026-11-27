import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { EMAIL_RE, resendReady, sendOne, welcomeEmail } from "@/lib/server/newsletter";
import { SITE_URL } from "@/config/site";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: { email?: string; website?: string; source?: string } = {};
  try { body = await req.json(); } catch { /* empty */ }
  if (body.website) return NextResponse.json({ ok: true }); // honeypot: bots fill hidden field
  const email = String(body.email || "").trim().toLowerCase();
  if (!EMAIL_RE.test(email) || email.length > 200) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 });
  }
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ ok: false, error: "Sign-ups are not open yet. Please try again later." }, { status: 503 });

  const existing = await db.from("newsletter_subscribers").select("status, confirm_token").eq("email", email).maybeSingle();
  if (existing.data?.status === "subscribed") return NextResponse.json({ ok: true, already: true });

  const up = await db
    .from("newsletter_subscribers")
    .upsert({ email, status: "subscribed", source: String(body.source || "website").slice(0, 40), updated_at: new Date().toISOString() }, { onConflict: "email" })
    .select("confirm_token")
    .single();
  if (up.error) return NextResponse.json({ ok: false, error: "Something went wrong. Please try again." }, { status: 500 });

  if (resendReady()) {
    const unsub = `${SITE_URL}/api/newsletter/unsubscribe?token=${up.data.confirm_token}`;
    await sendOne(welcomeEmail(email, unsub)).catch(() => null);
  }
  return NextResponse.json({ ok: true });
}
