import { NextResponse } from "next/server";
import { isAuthorizedCron, supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { runSync } from "@/lib/server/marketData";
import { dailyDigest, digestFor, resendReady, sendBatch } from "@/lib/server/newsletter";
import { revalidateTag } from "next/cache";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

async function handle(req: Request) {
  if (!isAuthorizedCron(req)) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  const url = new URL(req.url);
  const force = url.searchParams.get("force") === "1";
  const testTo = url.searchParams.get("to");
  const db = supabaseAdmin();
  if (!db || !resendReady()) return NextResponse.json({ ok: false, error: "supabase or resend not configured" }, { status: 503 });

  // Always send the freshest data: sync first.
  const sync = await runSync();
  revalidateTag("market");
  const digest = dailyDigest(sync.snapshot);
  if (!digest.hasData) return NextResponse.json({ ok: false, error: "no data to send", events: sync.events }, { status: 502 });

  if (testTo) {
    const r = await sendBatch([digestFor(testTo, "00000000-0000-0000-0000-000000000000", digest)]);
    return NextResponse.json({ ok: r.sent === 1, test: true, ...r });
  }

  const marker = [{ source: "newsletter", detail: digest.key }];
  if (!force) {
    const already = await db.from("sync_runs").select("id").contains("events", marker).limit(1);
    if (already.data?.length) return NextResponse.json({ ok: true, skipped: "already sent today", key: digest.key });
  }

  const subs: { email: string; confirm_token: string }[] = [];
  for (let from = 0; ; from += 1000) {
    const page = await db.from("newsletter_subscribers").select("email, confirm_token").eq("status", "subscribed").order("created_at").range(from, from + 999);
    if (page.error) return NextResponse.json({ ok: false, error: page.error.message }, { status: 500 });
    subs.push(...(page.data || []));
    if (!page.data || page.data.length < 1000) break;
  }

  const result = await sendBatch(subs.map((s) => digestFor(s.email, s.confirm_token, digest)));
  console.log("[newsletter]", JSON.stringify({ key: digest.key, subscribers: subs.length, sent: result.sent, errors: result.errors }));
  await db.from("sync_runs").insert({ ok: result.errors.length === 0, events: [{ ...marker[0], sent: result.sent, errors: result.errors }] });
  return NextResponse.json({ ok: result.errors.length === 0, subscribers: subs.length, ...result, key: digest.key, subject: digest.subject });
}

export const GET = handle;
export const POST = handle;
