import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { PageHeader } from "@/components/PageHeader";
import { getSiteText, text } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch about a project — email, WhatsApp, or the contact form. Backend architecture, Laravel & Spring Boot, healthcare integrations, AI systems.",
};

export default async function ContactPage() {
  const t = await getSiteText();
  const email = text(t, "contact_email", "rafaatabtahe@gmail.com");
  const whatsapp = text(t, "whatsapp_number", "+8801749972744");
  const waLink = `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hi Rafaat, I found your portfolio and I'd like to talk about a project.")}`;
  const linkedin = text(t, "linkedin_url", "https://bd.linkedin.com/in/khan-rafaat-abtahe");
  const github = text(t, "github_url", "https://github.com/khanrafaat");

  const channels = [
    {
      label: "Email",
      value: email,
      href: `mailto:${email}`,
      hint: "Best for detailed briefs",
    },
    {
      label: "WhatsApp",
      value: whatsapp,
      href: waLink,
      hint: "Fastest reply — direct message",
    },
    {
      label: "LinkedIn",
      value: "khan-rafaat-abtahe",
      href: linkedin,
      hint: "Professional profile",
    },
    {
      label: "GitHub",
      value: "khanrafaat",
      href: github,
      hint: "Code & open source",
    },
  ];

  return (
    <main>
      <PageHeader
        eyebrow="Contact"
        title="Let's talk about your project"
        description="Describe the problem you're trying to solve — I'll reply within a day with honest advice on whether and how I can help."
      />

      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-16 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-4">
          {channels.map(({ label, value, href, hint }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-zinc-200 bg-white p-5 transition-all hover:border-violet-500/40 hover:shadow-lg hover:shadow-violet-500/5 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-violet-400/30"
            >
              <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                  {label}
                </p>
                <p className="mt-1 truncate font-medium group-hover:text-violet-700 dark:group-hover:text-violet-300">
                  {value}
                </p>
                <p className="mt-0.5 text-xs text-zinc-500 dark:text-zinc-400">{hint}</p>
              </div>
              <svg className="h-4 w-4 shrink-0 text-zinc-400 transition-transform group-hover:translate-x-0.5 group-hover:text-violet-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14m-6-6 6 6-6 6" />
              </svg>
            </a>
          ))}
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-10 dark:border-zinc-800 dark:bg-zinc-900/50">
          <h2 className="text-xl font-semibold tracking-tight">Send a message</h2>
          <p className="mt-1 mb-6 text-sm text-zinc-500 dark:text-zinc-400">
            Goes straight to my inbox ({email}).
          </p>
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
