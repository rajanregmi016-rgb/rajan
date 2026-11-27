/** Brand mark: a crimson tile with a white Himalayan ridge and a sun. */
export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden="true">
      <rect width="40" height="40" rx="11" fill="#bd1e3b" />
      <circle cx="28" cy="13" r="4" fill="#fff" opacity="0.9" />
      <path d="M5 31 L15 17 L20 23 L25 16 L35 31 Z" fill="#fff" />
      <path d="M15 17 L17.6 20.6 L15 20 L12.6 20.4 Z M25 16 L27.8 20 L25 19.4 L22.8 19.9 Z" fill="#bd1e3b" opacity="0.35" />
    </svg>
  );
}

export function Logo({ sub = true, light = false }: { sub?: boolean; light?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <LogoMark />
      <span className="leading-tight">
        <span className={`block font-display text-[16px] font-extrabold tracking-tight ${light ? "text-white" : "text-ink-900 dark:text-white"}`}>
          Nepali Tools
        </span>
        {sub && (
          <span className={`devanagari block text-[12px] font-medium ${light ? "text-navy-200" : "text-ink-500 dark:text-ink-400"}`} lang="ne">
            नेपाली टुल्स
          </span>
        )}
      </span>
    </span>
  );
}
