import "server-only";
import NepaliDate from "nepali-date-converter";
import { SITE, SITE_URL } from "@/config/site";
import { BS_MONTHS_NP, toNpDigits, WEEKDAYS_FULL_NP, groupAsian } from "@/lib/nepali";
import { allTools } from "@/lib/tools";
import type { MarketSnapshot } from "@/lib/server/marketData";
import { usdMid } from "@/lib/server/marketData";

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function resendReady() {
  return !!process.env.RESEND_API_KEY;
}

function fromAddress() {
  return process.env.RESEND_FROM || `${SITE.name} <newsletter@allnepalitools.com>`;
}

export type OutEmail = { to: string; subject: string; html: string; text: string; unsubscribeUrl?: string; replyTo?: string };

function toResend(e: OutEmail) {
  return {
    from: fromAddress(),
    to: [e.to],
    subject: e.subject,
    html: e.html,
    text: e.text,
    ...(e.replyTo ? { reply_to: e.replyTo } : {}),
    ...(e.unsubscribeUrl
      ? { headers: { "List-Unsubscribe": `<${e.unsubscribeUrl}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" } }
      : {}),
  };
}

export async function sendOne(e: OutEmail) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify(toResend(e)),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${(await res.text()).slice(0, 200)}`);
  return res.json();
}

/** Sends up to 100 emails per Resend batch call. Returns counts. */
export async function sendBatch(emails: OutEmail[]) {
  let sent = 0;
  const errors: string[] = [];
  for (let i = 0; i < emails.length; i += 100) {
    const chunk = emails.slice(i, i + 100);
    const res = await fetch("https://api.resend.com/emails/batch", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify(chunk.map(toResend)),
    });
    if (res.ok) sent += chunk.length;
    else errors.push(`batch ${i / 100 + 1}: ${res.status} ${(await res.text()).slice(0, 200)}`);
  }
  return { sent, errors };
}

export function bsToday(d = new Date()) {
  try {
    const nd = new NepaliDate(d);
    const wd = WEEKDAYS_FULL_NP[nd.toJsDate().getDay()];
    return {
      label: `${wd}, ${toNpDigits(nd.getDate())} ${BS_MONTHS_NP[nd.getMonth()]} ${toNpDigits(nd.getYear())}`,
      key: `${nd.getYear()}-${nd.getMonth() + 1}-${nd.getDate()}`,
    };
  } catch {
    return { label: d.toDateString(), key: d.toISOString().slice(0, 10) };
  }
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]!));
const ktm = (iso: string) =>
  new Date(iso).toLocaleString("en-GB", { timeZone: "Asia/Kathmandu", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

const FX_ORDER = ["USD", "EUR", "GBP", "AUD", "CAD", "JPY", "KRW", "AED", "QAR", "SAR", "MYR", "INR"];

function shell(inner: string, unsubscribeUrl?: string) {
  return `<!doctype html><html><body style="margin:0;background:#f7f7fa;font-family:Inter,Segoe UI,Arial,sans-serif;color:#1b1a2e">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7fa;padding:24px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:18px;overflow:hidden;border:1px solid #e7e6ef">
<tr><td style="background:#0d0b26;padding:20px 24px;color:#fff">
<div style="font-size:18px;font-weight:700">AllNepali<span style="color:#ff8a3d">Tools</span></div>
<div style="font-size:12px;color:#b9b6d6;margin-top:2px">${esc(SITE.nameNp)}, एकै ठाउँमा</div></td></tr>
<tr><td style="padding:24px">${inner}</td></tr>
<tr><td style="padding:16px 24px;background:#f2f1f7;font-size:12px;color:#6b6985;line-height:1.6">
You get this because you signed up at <a href="${SITE_URL}" style="color:#e0123f">allnepalitools.com</a>.
${unsubscribeUrl ? `<a href="${unsubscribeUrl}" style="color:#6b6985">Unsubscribe in one click</a>.` : ""}
Rates are for reference; confirm with your bank or a licensed dealer before a transaction.</td></tr>
</table></td></tr></table></body></html>`;
}

export function welcomeEmail(to: string, unsubscribeUrl: string): OutEmail {
  const inner = `<h1 style="font-size:22px;margin:0 0 10px">You're in. Welcome!</h1>
<p style="line-height:1.6;margin:0 0 12px">Every morning around 8:30 AM Nepal time you'll get one short email: today's Nepali date, the FENEGOSIDA gold and silver price, and Nepal Rastra Bank exchange rates.</p>
<p style="margin:18px 0"><a href="${SITE_URL}/tools" style="background:#e0123f;color:#fff;text-decoration:none;padding:12px 18px;border-radius:12px;font-weight:600;display:inline-block">Browse all tools</a></p>`;
  return {
    to,
    subject: `Welcome to ${SITE.name} daily updates`,
    html: shell(inner, unsubscribeUrl),
    text: `Welcome! Every morning you'll get today's Nepali date, gold/silver price and NRB exchange rates.\n${SITE_URL}/tools\nUnsubscribe: ${unsubscribeUrl}`,
    unsubscribeUrl,
  };
}

export function accountWelcomeEmail(to: string, name: string): OutEmail {
  const hi = name ? `Namaste ${esc(name.split(" ")[0])}!` : "Namaste!";
  const inner = `<h1 style="font-size:22px;margin:0 0 10px">${hi} Your account is ready.</h1>
<p style="line-height:1.6;margin:0 0 12px">Here is what you can do now that you're signed in:</p>
<ul style="line-height:1.8;padding-left:18px;margin:0 0 12px">
<li><b>Save tools</b> with the star, and find them on any phone or computer.</li>
<li><b>Price alerts:</b> get an email when gold or the US dollar crosses a price you choose.</li>
<li><b>My dates:</b> save birthdays and anniversaries in the Nepali calendar and see how many days are left.</li>
<li><b>Daily rates email</b> each morning, if you switch it on.</li>
</ul>
<p style="margin:18px 0"><a href="${SITE_URL}/account" style="background:#e0123f;color:#fff;text-decoration:none;padding:12px 18px;border-radius:12px;font-weight:600;display:inline-block">Open my account</a></p>`;
  return {
    to,
    subject: `Welcome to ${SITE.name}`,
    html: shell(inner),
    text: `${name ? `Namaste ${name}!` : "Namaste!"} Your All Nepali Tools account is ready: save tools, set gold/dollar price alerts, save Nepali dates and get the daily rates email.\n${SITE_URL}/account`,
  };
}

export function loginAlertEmail(to: string, info: { when: string; device: string; place: string; method: string }): OutEmail {
  const row = (a: string, b: string) => `<tr><td style="padding:6px 0;color:#6b6985">${a}</td><td style="padding:6px 0;font-weight:600">${esc(b)}</td></tr>`;
  const inner = `<p style="font-size:13px;color:#e0123f;font-weight:600;margin:0">Security</p>
<h1 style="font-size:22px;margin:2px 0 12px">New sign-in to your account</h1>
<p style="line-height:1.6;margin:0 0 12px">Your All Nepali Tools account was just signed in to.</p>
<table role="presentation" style="font-size:14px;border-collapse:collapse">
${row("When", info.when)}${row("Device", info.device)}${row("Approx. location", info.place)}${row("Signed in with", info.method)}
</table>
<p style="line-height:1.6;margin:16px 0 0"><b>Was this you?</b> Then you don't need to do anything.</p>
<p style="line-height:1.6;margin:6px 0 0">If not, <a href="${SITE_URL}/account#security" style="color:#e0123f;font-weight:600">open your account</a>, choose <b>Sign out of all devices</b>, and change your password.</p>
<p style="font-size:12px;color:#6b6985;margin-top:16px">You can turn these emails off in your account's notification settings.</p>`;
  return {
    to,
    subject: `New sign-in to your ${SITE.name} account`,
    html: shell(inner),
    text: `New sign-in to your account\nWhen: ${info.when}\nDevice: ${info.device}\nLocation: ${info.place}\nMethod: ${info.method}\nNot you? Sign out of all devices at ${SITE_URL}/account and change your password.`,
  };
}

export type PriceAlert = { id: string; metric: "gold" | "usd"; dir: "above" | "below"; value: number; lastSent?: string };

export function alertEmail(to: string, a: PriceAlert, current: number, source: string): OutEmail {
  const what = a.metric === "gold" ? "Fine gold (per tola)" : "1 US dollar";
  const fmt = (n: number) => (a.metric === "gold" ? `Rs ${groupAsian(n)}` : `Rs ${n.toFixed(2)}`);
  const inner = `<p style="font-size:13px;color:#e0123f;font-weight:600;margin:0">Price alert</p>
<h1 style="font-size:22px;margin:2px 0 12px">${what} is now ${fmt(current)}</h1>
<p style="line-height:1.6;margin:0 0 12px">You asked us to tell you when it goes <b>${a.dir} ${fmt(a.value)}</b>. Source: ${esc(source)}.</p>
<p style="margin:18px 0"><a href="${SITE_URL}/${a.metric === "gold" ? "gold-price-in-nepal" : "usd-to-npr"}" style="background:#e0123f;color:#fff;text-decoration:none;padding:12px 18px;border-radius:12px;font-weight:600;display:inline-block">See today's rate</a></p>
<p style="font-size:12px;color:#6b6985">Manage or delete alerts on <a href="${SITE_URL}/account" style="color:#e0123f">your account page</a>. We send each alert at most once a day.</p>`;
  return {
    to,
    subject: `Alert: ${what} ${a.dir} ${fmt(a.value)} (now ${fmt(current)})`,
    html: shell(inner),
    text: `${what} is now ${fmt(current)} (${a.dir} ${fmt(a.value)}). ${SITE_URL}/account`,
  };
}

export function dailyDigest(snap: MarketSnapshot | null, now = new Date()) {
  const bs = bsToday(now);
  const tools = allTools();
  const pick = tools[Math.floor(now.getTime() / 864e5) % tools.length];
  const g = snap?.gold;
  const goldFresh = g ? now.getTime() - new Date(g.fetchedAt).getTime() < 36 * 3600e3 : false;
  const mid = usdMid(snap);

  const subjectBits = [
    g && goldFresh ? `Gold Rs ${groupAsian(g.fineTola)}/tola` : null,
    mid ? `$1 = Rs ${mid.toFixed(2)}` : null,
  ].filter(Boolean);
  const subject = `${bs.label} · ${subjectBits.join(" · ") || "Today in Nepal"}`;

  const row = (a: string, b: string) =>
    `<tr><td style="padding:8px 0;border-bottom:1px solid #eeedf4">${a}</td><td align="right" style="padding:8px 0;border-bottom:1px solid #eeedf4;font-weight:600">${b}</td></tr>`;

  const goldBlock = g
    ? `<table role="presentation" width="100%" style="font-size:14px;border-collapse:collapse">
${row("Fine gold (24K) / tola", `Rs ${groupAsian(g.fineTola)}`)}
${g.tejabiTola ? row("Tejabi gold / tola", `Rs ${groupAsian(g.tejabiTola)}`) : ""}
${g.silverTola ? row("Silver / tola", `Rs ${groupAsian(g.silverTola)}`) : ""}
</table><p style="font-size:12px;color:#6b6985;margin:6px 0 0">Source: FENEGOSIDA, fetched ${esc(ktm(g.fetchedAt))} NPT.${goldFresh ? "" : " Today's fixing is not out yet, so this is the last published price."}</p>`
    : `<p style="font-size:14px;color:#6b6985">Today's gold price could not be fetched. See the latest on <a href="${SITE_URL}/gold-price-in-nepal" style="color:#e0123f">our gold page</a>.</p>`;

  const fx = snap?.forex;
  const fxRows = fx
    ? FX_ORDER.map((iso) => fx.rates.find((r) => r.iso3 === iso))
        .filter(Boolean)
        .map((r) => row(`${r!.unit} ${r!.iso3} <span style="color:#6b6985">${esc(r!.name)}</span>`, `Rs ${r!.buy.toFixed(2)} / ${r!.sell.toFixed(2)}`))
        .join("")
    : "";
  const fxBlock = fx
    ? `<table role="presentation" width="100%" style="font-size:14px;border-collapse:collapse"><tr><td style="font-size:12px;color:#6b6985;padding-bottom:4px">Currency</td><td align="right" style="font-size:12px;color:#6b6985;padding-bottom:4px">Buy / Sell</td></tr>${fxRows}</table>
<p style="font-size:12px;color:#6b6985;margin:6px 0 0">Source: Nepal Rastra Bank, rates for ${esc(fx.date)}.</p>`
    : `<p style="font-size:14px;color:#6b6985">NRB rates could not be fetched today.</p>`;

  const inner = `<p style="font-size:13px;color:#e0123f;font-weight:600;margin:0">आज</p>
<h1 style="font-size:22px;margin:2px 0 18px">${esc(bs.label)}</h1>
<h2 style="font-size:16px;margin:0 0 6px">Gold & silver</h2>${goldBlock}
<h2 style="font-size:16px;margin:22px 0 6px">Exchange rates</h2>${fxBlock}
<div style="margin-top:22px;padding:14px 16px;background:#fff6ec;border-radius:14px">
<div style="font-size:12px;color:#b25b00;font-weight:600">Tool of the day</div>
<a href="${SITE_URL}/${pick.slug}" style="font-size:16px;font-weight:700;color:#1b1a2e;text-decoration:none">${esc(pick.shortTitle)} →</a>
<div style="font-size:13px;color:#4c4a63;margin-top:4px">${esc(pick.description.slice(0, 140))}</div></div>`;

  const text = [
    bs.label,
    g ? `Gold (fine) Rs ${groupAsian(g.fineTola)}/tola${g.silverTola ? `, silver Rs ${groupAsian(g.silverTola)}/tola` : ""} (FENEGOSIDA)` : "Gold price not available today.",
    mid ? `USD: Rs ${mid.toFixed(2)} (NRB ${fx?.date})` : "NRB rates not available today.",
    `Tool of the day: ${SITE_URL}/${pick.slug}`,
  ].join("\n");

  return { subject, inner, text, key: bs.key, hasData: !!(g || fx) };
}

export function digestFor(to: string, token: string, d: ReturnType<typeof dailyDigest>): OutEmail {
  const unsubscribeUrl = `${SITE_URL}/api/newsletter/unsubscribe?token=${encodeURIComponent(token)}`;
  return { to, subject: d.subject, html: shell(d.inner, unsubscribeUrl), text: `${d.text}\n\nUnsubscribe: ${unsubscribeUrl}`, unsubscribeUrl };
}
