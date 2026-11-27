"use client";

import { useEffect, useState } from "react";
import { Check, Flag, Link2, Share2 } from "lucide-react";

/** Share bar for tool pages: native share, WhatsApp, Viber, Facebook, copy link, report a problem. */
export default function ShareTool({ title, path }: { title: string; path: string }) {
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);
  useEffect(() => setCanShare("share" in navigator), []);
  const url = `https://allnepalitools.com${path}`;
  const text = `${title} — free on All Nepali Tools`;
  const enc = encodeURIComponent;
  const links = [
    { name: "WhatsApp", href: `https://wa.me/?text=${enc(`${text} ${url}`)}`, cls: "bg-[#25D366]" },
    { name: "Viber", href: `viber://forward?text=${enc(`${text} ${url}`)}`, cls: "bg-[#7360F2]" },
    { name: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`, cls: "bg-[#1877F2]" },
  ];
  async function native() {
    try { await navigator.share({ title, text, url }); } catch {}
  }
  async function copy() {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  }
  const report = `/contact?subject=${enc(`Problem on ${title}`)}&page=${enc(path)}`;
  return (
    <div className="mt-6 flex flex-wrap items-center gap-2" aria-label="Share this tool">
      <span className="mr-1 text-sm font-semibold text-ink-500">Share:</span>
      {canShare && (
        <button onClick={native} className="chip !py-2"><Share2 className="h-3.5 w-3.5" aria-hidden /> Share</button>
      )}
      {links.map((l) => (
        <a key={l.name} href={l.href} target="_blank" rel="noopener nofollow" className={`rounded-full px-3.5 py-2 text-xs font-semibold text-white ${l.cls} hover:opacity-90`}>{l.name}</a>
      ))}
      <button onClick={copy} className="chip !py-2">{copied ? <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden /> : <Link2 className="h-3.5 w-3.5" aria-hidden />} {copied ? "Copied" : "Copy link"}</button>
      <a href={report} className="ml-auto inline-flex items-center gap-1 text-xs font-semibold text-ink-400 hover:text-brand-600"><Flag className="h-3.5 w-3.5" aria-hidden /> Report a problem</a>
    </div>
  );
}
