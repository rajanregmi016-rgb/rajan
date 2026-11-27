import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, Code2, Languages, Mail, ShieldCheck, UserRound } from "lucide-react";
import PageHero from "@/components/PageHero";
import { absoluteUrl, SITE } from "@/config/site";
import { TEAM } from "@/data/team";
import { JsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Our Team",
  description: "Meet the small, independent team behind All Nepali Tools: who builds the tools, who checks the data and who looks after the Nepali language.",
  alternates: { canonical: absoluteUrl("/team") },
};

const ICONS = [UserRound, ShieldCheck, Languages, Code2];
const GRADS = [
  "from-brand-500 to-saffron-400",
  "from-emerald-400 to-teal-600",
  "from-navy-400 to-navy-700",
  "from-violet-400 to-purple-700",
];

export default function TeamPage() {
  return (
    <div>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Our team", path: "/team" }])} />
      <PageHero
        crumbs={[{ name: "Home", path: "/" }, { name: "Our team", path: "/team" }]}
        eyebrow="Our team"
        title={<>A small team, <span className="text-gradient">big on getting it right.</span></>}
        titleNp="हाम्रो टिम"
        description={<p>All Nepali Tools is made by a small independent team who care about Nepal and about correct numbers. Here is who does what.</p>}
      />

      <div className="container-np py-14">
        <ul className="grid gap-5 md:grid-cols-2">
          {TEAM.map((m, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <li key={m.role} className="card overflow-hidden">
                <div className={`relative h-24 bg-gradient-to-br ${GRADS[i % GRADS.length]}`}>
                  <div className="dhaka absolute inset-0" aria-hidden />
                </div>
                <div className="relative px-6 pb-6">
                  <span className="-mt-10 grid h-20 w-20 place-items-center overflow-hidden rounded-3xl border-4 border-white bg-navy-950 text-white shadow-lift dark:border-ink-900">
                    {m.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={m.photo} alt={m.name ?? m.role} className="h-full w-full object-cover" />
                    ) : m.name ? (
                      <span className="font-display text-2xl font-bold">{m.name.split(" ").map((p) => p[0]).slice(0, 2).join("")}</span>
                    ) : (
                      <Icon className="h-8 w-8 text-saffron-300" aria-hidden />
                    )}
                  </span>
                  <h2 className="mt-4 text-xl font-bold">{m.name ?? m.role}</h2>
                  <p className="text-sm font-semibold text-brand-700 dark:text-brand-300">
                    {m.name ? m.role : null}
                    <span className={`devanagari ${m.name ? "ml-2 text-ink-400" : "text-brand-700 dark:text-brand-300"}`} lang="ne">{m.roleNp}</span>
                  </p>
                  <p className="mt-3 leading-7 text-ink-600 dark:text-ink-400">{m.bio}</p>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {m.focus.map((f) => <li key={f} className="rounded-full bg-ink-100 px-3 py-1 text-xs font-semibold text-ink-600 dark:bg-ink-800 dark:text-ink-300">{f}</li>)}
                  </ul>
                </div>
              </li>
            );
          })}
        </ul>

        <section className="mt-16 grid gap-5 md:grid-cols-3">
          <div className="card p-7 md:col-span-2">
            <CalendarDays className="h-7 w-7 text-brand-600" aria-hidden />
            <h2 className="mt-3 text-2xl font-bold">How we work</h2>
            <ul className="mt-4 space-y-3 text-[15.5px] leading-7 text-ink-600 dark:text-ink-400">
              <li><strong className="text-ink-900 dark:text-white">Every page is reviewed by a person</strong> before it goes live. Nothing is auto-published.</li>
              <li><strong className="text-ink-900 dark:text-white">Every rate carries its source and date</strong>, so you can always check it yourself.</li>
              <li><strong className="text-ink-900 dark:text-white">Reader corrections come first.</strong> When you report an error, we check it against the official source and fix it.</li>
            </ul>
            <Link href="/how-we-verify" className="mt-5 inline-block font-semibold text-brand-700 underline dark:text-brand-300">Read how we check our data →</Link>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-navy-950 p-7 text-white">
            <div className="dhaka absolute inset-0" aria-hidden />
            <div className="relative">
              <Mail className="h-7 w-7 text-saffron-300" aria-hidden />
              <h2 className="mt-3 text-2xl font-bold">Work with us</h2>
              <p className="mt-2 leading-7 text-white/70">Know Nepali tax, land law or exams well? Want to help check data or write guides? We&apos;d like to hear from you.</p>
              <a href={`mailto:${SITE.email}?subject=${encodeURIComponent("I'd like to help")}`} className="btn mt-5 bg-white text-navy-950 hover:bg-ink-100">Get in touch</a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
