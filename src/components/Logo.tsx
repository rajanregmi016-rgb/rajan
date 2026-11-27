/**
 * All Nepali Tools brand mark: the double-pennant silhouette of Nepal's flag,
 * filled with the Laligurans-to-marigold gradient, carrying a white sun.
 */
export function LogoMark({ className = "h-9 w-9", id = "anlg" }: { className?: string; id?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#e0123f" />
          <stop offset="0.55" stopColor="#f72b59" />
          <stop offset="1" stopColor="#ffa920" />
        </linearGradient>
      </defs>
      <rect width="40" height="40" rx="12" fill="#0d0b26" />
      <path d="M11 6 L31 19 L19.5 19 L31 33 L11 33 Z" fill={`url(#${id})`} strokeLinejoin="round" />
      <circle cx="17.2" cy="26.4" r="3.1" fill="#fff" />
      <g stroke="#fff" strokeWidth="1.2" strokeLinecap="round">
        <path d="M17.2 21.4v1.2M17.2 30.2v1.2M12.2 26.4h1.2M21 26.4h1.2M13.7 22.9l.85.85M19.85 29.05l.85.85M13.7 29.9l.85-.85M19.85 23.75l.85-.85" />
      </g>
      <mask id={`${id}-m`}><rect width="40" height="40" fill="#fff" /><circle cx="17.4" cy="11.4" r="3.2" fill="#000" /></mask>
      <circle cx="17.4" cy="13.4" r="3.4" fill="#fff" mask={`url(#${id}-m)`} />
    </svg>
  );
}

export function Logo({ light = false, sub = true }: { light?: boolean; sub?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark id={light ? "anlg-l" : "anlg-d"} />
      <span className="leading-none">
        <span className={`block font-display text-[17px] font-extrabold tracking-tight ${light ? "text-white" : "text-ink-900 dark:text-white"}`}>
          AllNepali<span className="text-gradient">Tools</span>
        </span>
        {sub && (
          <span className={`devanagari mt-1 block text-[11.5px] font-medium ${light ? "text-white/60" : "text-ink-500 dark:text-ink-400"}`} lang="ne">
            सबै नेपाली टुल्स, एकै ठाउँमा
          </span>
        )}
      </span>
    </span>
  );
}
