import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { getServices, getSiteText, text } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Services",
  description:
    "Freelance services: backend architecture, Laravel & Spring Boot development, healthcare integrations (HL7/FHIR), and AI-powered systems.",
};

// Feature 3 adds Service JSON-LD here. This page stays ad-free.
export default async function ServicesPage() {
  const [services, t] = await Promise.all([getServices(), getSiteText()]);
  const contactEmail = text(t, "contact_email", "rafaatabtahe@gmail.com");

  return (
    <main>
      <PageHeader
        eyebrow="Services"
        title="Hire me for the hard parts"
        description="Backend architecture, Laravel & Spring Boot platforms, healthcare integrations (HL7/FHIR), and AI systems that survive contact with production."
      />
      <div className="mx-auto max-w-6xl px-6 py-16">
        {services.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            Services are being updated — reach out at {contactEmail}.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2">
            {services.map(({ title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-zinc-200 bg-white p-8 dark:border-zinc-800 dark:bg-zinc-900/50"
              >
                <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                  {description}
                </p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 flex flex-wrap items-center gap-4 rounded-2xl border border-violet-500/20 bg-violet-500/5 p-8">
          <p className="flex-1 text-sm text-zinc-700 dark:text-zinc-300">
            Not sure which of these you need? Describe the problem and I&apos;ll
            point you in the right direction — even if that direction isn&apos;t me.
          </p>
          <Link
            href="/portal"
            className="rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Start a project brief
          </Link>
        </div>
      </div>
    </main>
  );
}
