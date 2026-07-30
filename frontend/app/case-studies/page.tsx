import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { getCaseStudies } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "Deep dives into real systems: healthcare/LIS with HL7/FHIR integration, ERP, and document management — problem, architecture, trade-offs, outcomes.",
};

export default async function CaseStudiesPage() {
  const { results: studies } = await getCaseStudies();

  return (
    <main>
      <PageHeader
        eyebrow="Case Studies"
        title="Real systems, real trade-offs"
        description="Deep dives into production work — the problem, the architecture, what went wrong, and what shipped. Healthcare/LIS, ERP, and document management."
      />
      <div className="mx-auto max-w-6xl px-6 py-16">
        {studies.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            No case studies published yet — check back soon.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {studies.map(({ slug, tag, title, summary, tech_stack, cover_image_url, cover_image_alt }) => (
              <Link
                key={slug}
                href={`/case-studies/${slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-500/5 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-violet-400/30"
              >
                {cover_image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cover_image_url}
                    alt={cover_image_alt || title}
                    className="aspect-video w-full object-cover"
                  />
                )}
                <div className="flex flex-1 flex-col p-7">
                  <span className="w-fit rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-700 dark:text-violet-300">
                    {tag}
                  </span>
                  <h2 className="mt-4 text-lg font-semibold tracking-tight group-hover:text-violet-700 dark:group-hover:text-violet-300">
                    {title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {summary}
                  </p>
                  {tech_stack.length > 0 && (
                    <ul className="mt-5 flex flex-wrap gap-2 border-t border-zinc-100 pt-5 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                      {tech_stack.map((p) => (
                        <li key={p} className="rounded-md bg-zinc-100 px-2 py-1 font-mono dark:bg-zinc-800">
                          {p}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
