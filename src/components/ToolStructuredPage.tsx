import type { Tool } from "@/lib/tools";

/** SEO content section renderer — original tool page body. */
export default function ToolStructuredPage({ tool }: { tool: Tool }) {
  return (
    <div className="prose-np max-w-none">
      <section aria-labelledby="about-h" className="mt-10 max-w-none">
        <h2 id="about-h" className="text-xl font-bold text-ink-900 dark:text-ink-50">
          About {tool.shortTitle}
        </h2>
        {tool.content.intro.map((p, i) => (
          <p key={i} dangerouslySetInnerHTML={{ __html: strong(p) }} />
        ))}
      </section>

      <section aria-labelledby="steps-h" className="mt-8 max-w-none">
        <h2 id="steps-h" className="text-xl font-bold text-ink-900 dark:text-ink-50">
          How to use — step by step
        </h2>
        <ol className="mt-4 space-y-3">
          {tool.content.steps.map((s, i) => (
            <li key={i} className="flex gap-3 text-[16px] leading-7 text-ink-700 dark:text-ink-300">
              <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-navy-900 text-xs font-bold text-white dark:bg-navy-600" aria-hidden>{i + 1}</span>
              <span dangerouslySetInnerHTML={{ __html: strong(s) }} />
            </li>
          ))}
        </ol>
      </section>

      {tool.content.examples?.map((ex, i) => (
        <section key={i} aria-label={ex.heading} className="mt-8 max-w-none">
          <h2 className="text-xl font-bold text-ink-900 dark:text-ink-50">{ex.heading}</h2>
          <div className="card mt-4 overflow-x-auto">
            <table className="w-full min-w-[420px] text-sm">
              <tbody>
                {ex.rows.map((r, j) => (
                  <tr key={j} className="border-t border-ink-200 first:border-t-0 even:bg-ink-50/60 dark:border-ink-800 dark:even:bg-ink-800/30">
                    {r.map((cell, k) => (
                      <td key={k} className={`px-4 py-2.5 ${k === 0 ? "font-medium text-ink-800 dark:text-ink-200" : "text-ink-600 dark:text-ink-400"}`}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      <section aria-labelledby="faq-h" className="mt-10 max-w-none">
        <h2 id="faq-h" className="text-xl font-bold text-ink-900 dark:text-ink-50">
          Frequently asked questions
        </h2>
        <div className="card mt-4 divide-y divide-ink-200 overflow-hidden dark:divide-ink-800">
          {tool.content.faqs.map((f, i) => (
            <details key={i} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[15px] font-semibold text-ink-800 hover:bg-ink-50 group-open:text-brand-700 dark:text-ink-200 dark:hover:bg-ink-800/50 dark:group-open:text-brand-300 [&::-webkit-details-marker]:hidden">
                {f.q}
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-ink-100 text-ink-500 transition group-open:rotate-45 dark:bg-ink-800" aria-hidden>+</span>
              </summary>
              <p className="px-5 pb-4 text-[15px] leading-7 text-ink-600 dark:text-ink-400">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

/** Convert **bold** markers to <strong> safely (content is first-party). */
function strong(text: string): string {
  return text
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}
