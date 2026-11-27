import type { ReactNode } from "react";
import Breadcrumbs, { type Crumb } from "@/components/Breadcrumbs";

/** Dark, textured page header used by every inner page. */
export default function PageHero({
  crumbs, eyebrow, title, titleNp, description, icon, children, compact,
}: {
  crumbs?: Crumb[];
  eyebrow?: ReactNode;
  title: ReactNode;
  titleNp?: string;
  description?: ReactNode;
  icon?: ReactNode;
  children?: ReactNode;
  compact?: boolean;
}) {
  return (
    <header className="relative overflow-hidden bg-navy-950 text-white">
      <div className="dhaka absolute inset-0" aria-hidden />
      <div className="absolute -right-24 -top-32 h-80 w-80 rounded-full bg-brand-600/30 blur-3xl" aria-hidden />
      <div className="absolute -bottom-40 left-1/4 h-72 w-72 rounded-full bg-saffron-500/15 blur-3xl" aria-hidden />
      <div className={`container-np relative ${compact ? "pb-8 pt-5 sm:pb-10" : "pb-12 pt-6 sm:pb-16"}`}>
        {crumbs && <Breadcrumbs items={crumbs} dark />}
        <div className="flex items-start gap-4 sm:gap-5">
          {icon}
          <div className="min-w-0 max-w-3xl">
            {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-saffron-300">{eyebrow}</p>}
            <h1 className="text-[28px] font-extrabold leading-[1.12] sm:text-[40px]">{title}</h1>
            {titleNp && <p className="devanagari mt-2 text-lg font-semibold text-brand-300" lang="ne">{titleNp}</p>}
            {description && <div className="mt-3 text-[15.5px] leading-7 text-white/70">{description}</div>}
            {children}
          </div>
        </div>
      </div>
    </header>
  );
}
