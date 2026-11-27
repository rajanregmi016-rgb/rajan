import Link from "next/link";
import { allTools } from "@/lib/tools";
import { LogoMark } from "@/components/Logo";

export const metadata = {
  title: "Page not found (404)",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  const suggestions = allTools().filter((t) => t.popular).slice(0, 6);
  return (
    <div className="relative overflow-hidden bg-navy-950 text-white">
      <div className="dhaka absolute inset-0" aria-hidden />
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-brand-600/30 blur-3xl" aria-hidden />
      <div className="container-np relative py-24 text-center">
        <LogoMark className="mx-auto h-16 w-16" id="nf" />
        <p className="mt-6 font-display text-8xl font-extrabold text-gradient">404</p>
        <h1 className="mt-3 text-3xl font-extrabold">This page doesn&apos;t exist</h1>
        <p className="devanagari mt-2 text-white/60" lang="ne">यो पेज भेटिएन</p>
        <p className="mx-auto mt-4 max-w-md text-white/70">The link may be old or mistyped. Try one of these popular tools, or go back home.</p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          {suggestions.map((t) => (
            <Link key={t.slug} href={`/${t.slug}`} className="chip-dark">{t.shortTitle}</Link>
          ))}
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-primary">Go home</Link>
          <Link href="/tools" className="btn border border-white/25 text-white hover:bg-white/10">See all tools</Link>
        </div>
      </div>
    </div>
  );
}
