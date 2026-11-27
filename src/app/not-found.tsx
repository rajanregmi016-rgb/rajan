import Link from "next/link";
import { allTools } from "@/lib/tools";

export const metadata = {
  title: "Page not found (404)",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  const suggestions = allTools().filter((t) => t.popular).slice(0, 6);
  return (
    <div className="container-np py-20 text-center">
      <p className="font-display text-8xl font-extrabold tracking-tight text-brand-600">404</p>
      <h1 className="mt-3 text-3xl font-extrabold text-ink-900 dark:text-ink-50">This page doesn&apos;t exist</h1>
      <p className="mx-auto mt-2 max-w-md text-sm text-ink-500 dark:text-ink-400">
        The tool or page you asked for isn&apos;t here. Try one of our popular tools instead, or head back home.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {suggestions.map((t) => (
          <Link key={t.slug} href={`/${t.slug}`} className="chip">{t.shortTitle}</Link>
        ))}
      </div>
      <div className="mt-8">
        <Link href="/" className="btn-primary">← Back to Nepali Tools</Link>
      </div>
    </div>
  );
}
