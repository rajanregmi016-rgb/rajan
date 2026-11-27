import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/server/supabaseAdmin";
import { EMAIL_RE, resendReady, sendOne } from "@/lib/server/newsletter";

export const dynamic = "force-dynamic";

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
const recent = new Map<string, number[]>();

export async function POST(req: Request) {
  let b: Record<string, unknown>;
  try {
    b = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
  const str = (k: string, max: number) => String(b[k] ?? "").trim().slice(0, max);
  // Honeypot: real people never fill this hidden field.
  if (str("website", 200)) return NextResponse.json({ ok: true });
  const topic = str("topic", 40) || "Other";
  const name = str("name", 100);
  const email = str("email", 200);
  const page = str("page", 500);
  const message = str("message", 4000);
  if (message.length < 10) return NextResponse.json({ error: "Please write a little more." }, { status: 400 });
  if (email && !EMAIL_RE.test(email)) return NextResponse.json({ error: "That email address doesn't look right." }, { status: 400 });

  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  const now = Date.now();
  const hits = (recent.get(ip) || []).filter((t) => now - t < 3600_000);
  if (hits.length >= 5) return NextResponse.json({ error: "Too many messages. Please try again later." }, { status: 429 });
  recent.set(ip, [...hits, now]);

  const record = { at: new Date().toISOString(), topic, name, email, page, message, country: req.headers.get("x-vercel-ip-country") || "" };
  let stored = false, sent = false;

  const db = supabaseAdmin();
  if (db) {
    const key = `contact/${record.at.slice(0, 10)}/${now}-${Math.random().toString(36).slice(2, 8)}.json`;
    const { error } = await db.storage.from("user-data").upload(key, JSON.stringify(record, null, 2), { contentType: "application/json" });
    stored = !error;
    if (error) console.log("[contact] store failed", error.message);
  }

  const to = process.env.CONTACT_TO;
  if (to && resendReady()) {
    try {
      await sendOne({
        to,
        replyTo: email || undefined,
        subject: `[Contact · ${topic}] ${message.replace(/\s+/g, " ").slice(0, 70)}`,
        text: `${message}\n\nFrom: ${name || "(no name)"} ${email ? `<${email}>` : "(no email given)"}\nPage: ${page || "-"}\nCountry: ${record.country || "-"}\n\nPress Reply to answer ${email ? "them" : "(they left no email)"}.`,
        html: `<div style="font:15px/1.6 system-ui,sans-serif;color:#16152b"><p style="white-space:pre-wrap">${esc(message)}</p><hr style="border:0;border-top:1px solid #ddd"><p style="color:#555;font-size:13px">Topic: ${esc(topic)}<br>From: ${esc(name || "(no name)")} ${email ? `&lt;${esc(email)}&gt;` : "(no email given)"}<br>Page: ${esc(page || "-")}<br>Country: ${esc(record.country || "-")}</p><p style="color:#555;font-size:13px">${email ? "Press Reply to answer this visitor directly." : "The visitor didn't leave an email address."}</p></div>`,
      });
      sent = true;
    } catch (e) {
      console.log("[contact] email failed", String(e));
    }
  }
  console.log("[contact]", JSON.stringify({ topic, stored, sent }));
  if (!stored && !sent) return NextResponse.json({ error: "Sorry, your message couldn't be sent right now. Please try again in a few minutes." }, { status: 503 });
  return NextResponse.json({ ok: true });
}
