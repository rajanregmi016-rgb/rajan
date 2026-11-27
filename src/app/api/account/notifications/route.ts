import { NextResponse } from "next/server";
import { userFromRequest } from "@/lib/server/supabaseAdmin";
import { readNotices, writeNotices } from "@/lib/server/notifications";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const user = await userFromRequest(req);
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  const list = await readNotices(user.id);
  return NextResponse.json({ ok: true, items: list, unread: list.filter((n) => !n.read).length }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: Request) {
  const user = await userFromRequest(req);
  if (!user) return NextResponse.json({ ok: false }, { status: 401 });
  const { action, id } = (await req.json().catch(() => ({}))) as { action?: string; id?: string };
  let list = await readNotices(user.id);
  if (action === "read_all") list = list.map((n) => ({ ...n, read: true }));
  else if (action === "read" && id) list = list.map((n) => (n.id === id ? { ...n, read: true } : n));
  else if (action === "delete" && id) list = list.filter((n) => n.id !== id);
  else if (action === "clear") list = [];
  else return NextResponse.json({ ok: false, error: "unknown action" }, { status: 400 });
  await writeNotices(user.id, list);
  return NextResponse.json({ ok: true, items: list, unread: list.filter((n) => !n.read).length });
}
