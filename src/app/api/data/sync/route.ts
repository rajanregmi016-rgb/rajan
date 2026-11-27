import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { isAuthorizedCron } from "@/lib/server/supabaseAdmin";
import { runSync } from "@/lib/server/marketData";
import { runPriceAlerts } from "@/lib/server/alerts";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

async function handle(req: Request) {
  if (!isAuthorizedCron(req)) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  const result = await runSync();
  console.log("[sync]", JSON.stringify({ ok: result.ok, stored: result.stored, events: result.events }));
  revalidateTag("market");
  const alerts = result.ok ? await runPriceAlerts(result.snapshot).catch((e) => ({ error: String(e) })) : null;
  console.log("[alerts]", JSON.stringify(alerts));
  return NextResponse.json({ ok: result.ok, stored: result.stored, events: result.events, syncedAt: result.snapshot.syncedAt, alerts }, { status: result.ok ? 200 : 502 });
}

export const GET = handle;
export const POST = handle;
