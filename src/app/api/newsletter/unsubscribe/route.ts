import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { SITE, SITE_URL } from "@/config/site";

export const dynamic = "force-dynamic";
const UUID = /^[0-9a-f-]{36}$/i;

async function unsubscribe(token: string | null) {
  const db = supabaseAdmin();
  if (!db || !token || !UUID.test(token)) return false;
  const r = await db.from("newsletter_subscribers").update({ status: "unsubscribed", updated_at: new Date().toISOString() }).eq("confirm_token", token).select("id");
  return !r.error && (r.data?.length ?? 0) > 0;
}

function page(ok: boolean) {
  const msg = ok ? "You're unsubscribed. You won't get the daily email any more." : "That link didn't work. It may have been used already.";
  return new NextResponse(
    `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${SITE.name}</title>
<body style="margin:0;font-family:Inter,Arial,sans-serif;background:#0d0b26;color:#fff;display:grid;place-items:center;min-height:100vh;padding:16px">
<div style="max-width:420px;text-align:center"><h1 style="font-size:22px">${msg}</h1>
<p><a href="${SITE_URL}" style="color:#ff8a3d">Back to ${SITE.name}</a></p></div></body>`,
    { headers: { "Content-Type": "text/html; charset=utf-8" } },
  );
}

export async function GET(req: Request) {
  return page(await unsubscribe(new URL(req.url).searchParams.get("token")));
}

/** One-click unsubscribe (RFC 8058) from mail apps. */
export async function POST(req: Request) {
  const ok = await unsubscribe(new URL(req.url).searchParams.get("token"));
  return NextResponse.json({ ok });
}
