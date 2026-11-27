import { NextResponse } from "next/server";
import { supabaseAdmin, userFromRequest } from "@/lib/server/supabaseAdmin";
import { addNotice, prefsOf } from "@/lib/server/notifications";
import { loginAlertEmail, resendReady, sendOne } from "@/lib/server/newsletter";

export const dynamic = "force-dynamic";

function sessionIdOf(req: Request): string | null {
  try {
    const token = (req.headers.get("authorization") || "").split(" ")[1] || "";
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8"));
    return typeof payload.session_id === "string" ? payload.session_id : null;
  } catch {
    return null;
  }
}

function deviceOf(ua: string) {
  const os = /iPhone|iPad/.test(ua) ? "iPhone/iPad" : /Android/.test(ua) ? "Android" : /Windows/.test(ua) ? "Windows" : /Mac OS X/.test(ua) ? "Mac" : /Linux/.test(ua) ? "Linux" : "Unknown device";
  const br = /Edg\//.test(ua) ? "Edge" : /OPR\//.test(ua) ? "Opera" : /SamsungBrowser/.test(ua) ? "Samsung Internet" : /Chrome\//.test(ua) ? "Chrome" : /Firefox\//.test(ua) ? "Firefox" : /Safari\//.test(ua) ? "Safari" : "browser";
  return `${br} on ${os}`;
}

/** Called by the browser right after a sign-in. One alert per new session. */
export async function POST(req: Request) {
  const user = await userFromRequest(req);
  const sid = sessionIdOf(req);
  if (!user?.email || !sid) return NextResponse.json({ ok: false }, { status: 401 });
  const db = supabaseAdmin()!;
  const meta = (user.user_metadata || {}) as Record<string, unknown>;
  if (meta.last_login_session === sid) return NextResponse.json({ ok: true, skipped: "same session" });
  await db.auth.admin.updateUserById(user.id, { user_metadata: { ...meta, last_login_session: sid, last_login_at: new Date().toISOString() } });

  // The very first sign-in gets the welcome email instead.
  const firstEver = !meta.welcomed_at && Date.now() - new Date(user.created_at).getTime() < 10 * 60e3;
  if (firstEver) return NextResponse.json({ ok: true, skipped: "first sign-in" });

  const h = req.headers;
  const city = decodeURIComponent(h.get("x-vercel-ip-city") || "");
  const country = h.get("x-vercel-ip-country") || "";
  const info = {
    when: new Date().toLocaleString("en-GB", { timeZone: "Asia/Kathmandu", dateStyle: "medium", timeStyle: "short" }) + " (Nepal time)",
    device: deviceOf(h.get("user-agent") || ""),
    place: [city, country].filter(Boolean).join(", ") || "Unknown",
    method: user.app_metadata?.provider === "google" ? "Google" : "Email",
  };
  await addNotice(user.id, { kind: "login", title: "New sign-in", body: `${info.device} · ${info.place} · ${info.when}`, href: "/account#security" }).catch(() => null);
  if (prefsOf(meta).loginEmail && resendReady()) await sendOne(loginAlertEmail(user.email, info)).catch(() => null);
  return NextResponse.json({ ok: true });
}
