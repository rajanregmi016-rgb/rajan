import "server-only";
import { SITE_URL } from "@/config/site";

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

/** A tiny self-contained HTML card for other websites to embed in an iframe. */
export function widgetHtml(req: Request, o: { title: string; titleNp: string; rows: [string, string][]; note: string; link: string; linkText: string }) {
  const dark = new URL(req.url).searchParams.get("theme") === "dark";
  const c = dark
    ? { bg: "#0d0b26", fg: "#f4f4f7", mute: "#a3a3b8", line: "#2a2750", acc: "#ffb84d" }
    : { bg: "#ffffff", fg: "#16152b", mute: "#5d5d74", line: "#e7e7ef", acc: "#c8102e" };
  const rows = o.rows.map(([k, v]) => `<tr><td>${esc(k)}</td><td class="v">${esc(v)}</td></tr>`).join("");
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${esc(o.title)}</title>
<style>*{box-sizing:border-box}html,body{margin:0;background:${c.bg};color:${c.fg};font:14px/1.4 system-ui,-apple-system,"Segoe UI",Roboto,"Noto Sans Devanagari",sans-serif}
.w{padding:14px 16px;border:1px solid ${c.line};border-radius:14px;min-height:100vh}
h1{margin:0;font-size:15px}p.np{margin:2px 0 8px;color:${c.mute};font-size:12px}
table{width:100%;border-collapse:collapse}td{padding:6px 0;border-top:1px solid ${c.line}}td.v{text-align:right;font-weight:700;font-variant-numeric:tabular-nums}
.n{margin-top:8px;color:${c.mute};font-size:11px}a{color:${c.acc};font-weight:600;text-decoration:none}</style></head>
<body><div class="w"><h1>${esc(o.title)}</h1><p class="np">${esc(o.titleNp)}</p><table>${rows}</table>
<div class="n">${esc(o.note)} · <a href="${SITE_URL}${o.link}" target="_blank" rel="noopener">${esc(o.linkText)}</a></div></div></body></html>`;
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, s-maxage=1800, stale-while-revalidate=3600",
      "Content-Security-Policy": "frame-ancestors *",
    },
  });
}
