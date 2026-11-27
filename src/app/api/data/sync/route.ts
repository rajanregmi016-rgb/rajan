import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { isAuthorizedCron } from "@/lib/server/supabaseAdmin";
import { runSync } from "@/lib/server/marketData";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

async function handle(req: Request) {
  if (!isAuthorizedCron(req)) return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  const result = await runSync();
  console.log("[sync]", JSON.stringify({ ok: result.ok, stored: result.stored, events: result.events }));
  revalidateTag("market");
  return NextResponse.json({ ok: result.ok, stored: result.stored, events: result.events, syncedAt: result.snapshot.syncedAt }, { status: result.ok ? 200 : 502 });
}

export const GET = handle;
export const POST = handle;
