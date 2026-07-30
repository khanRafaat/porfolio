import { existsSync } from "node:fs";
import { join } from "node:path";
import Link from "next/link";
import {
  getCaseStudies,
  getPosts,
  getServices,
  getSiteText,
  text,
  type Service,
} from "@/lib/content";

export const revalidate = 60;

const serviceIcons: Record<Service["icon"], React.ReactNode> = {
  architecture: (
    <path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Zm0 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2Zm3-8.5v.01M7 15.5v.01" />
  ),
  code: <path d="m8 6-4 6 4 6m8-12 4 6-4 6M14 4l-4 16" />,
  integration: <path d="M3 12h4l2-6 4 12 2-6h6" />,
  ai: (
    <path d="M12 3a4 4 0 0 1 4 4v1a4 4 0 0 1 2 7v1a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4v-1a4 4 0 0 1 2-7V7a4 4 0 0 1 4-4Zm-2 8v.01M14 11v.01M9.5 15.5c.7.7 1.6 1 2.5 1s1.8-.3 2.5-1" />
  ),
};

export default async function HomePage() {
  const [t, featured, services, posts] = await Promise.all([
    getSiteText(),
    getCaseStudies(true),
    getServices(),
    getPosts(),
  ]);
  const latestPosts = posts.results.slice(0, 3);

  const stats = [1, 2, 3]
    .map((i) => ({
      value: text(t, `stat_${i}_value`, ""),
      label: text(t, `stat_${i}_label`, ""),
    }))
    .filter((s) => s.value && s.label);

  const stack = text(
    t,
    "stack_items",
    "Laravel, Spring Boot, Next.js, PostgreSQL, Docker",
  )
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const contactEmail = text(t, "contact_email", "rafaatabtahe@gmail.com");
  const whatsapp = text(t, "whatsapp_number", "+8801749972744");
  const waLink = `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hi Rafaat, I found your portfolio and I'd like to talk about a project.")}`;

  // Portrait lives at frontend/public/khan-rafaat-abtahe.jpeg
  const hasPortrait = existsSync(join(process.cwd(), "public", "khan-rafaat-abtahe.jpeg"));

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost";
  // Person schema: tells Google who this site belongs to and links the
  // profiles together (knowledge-graph food).
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Khan Rafaat Abtahe",
    alternateName: "Rafaat",
    jobTitle: "Full Stack Software Engineer",
    description:
      "Full Stack Software Engineer building enterprise software for the healthcare, pharmaceutical, defense, and logistics industries — ERP systems, HL7/FHIR health platforms, AI-powered document management, and shipping integrations.",
    url: siteUrl,
    image: hasPortrait ? `${siteUrl}/khan-rafaat-abtahe.jpeg` : undefined,
    sameAs: [
      text(t, "github_url", "https://github.com/khanrafaat"),
      text(t, "linkedin_url", "https://bd.linkedin.com/in/khan-rafaat-abtahe"),
    ],
    knowsAbout: [
      "Laravel", "PHP", "Spring Boot", "Java", "JavaScript", "TypeScript",
      "Next.js", "Django", "PostgreSQL", "HL7", "FHIR", "ERP systems",
      "AI engineering", "RAG",
    ],
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />
      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="bg-grid absolute inset-0 -z-10" />
        <div className="absolute left-1/2 top-[-12rem] -z-10 h-[24rem] w-[42rem] -translate-x-1/2 rounded-full bg-gradient-to-br from-violet-400/25 via-fuchsia-400/15 to-pink-400/20 blur-3xl" />

        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-10 sm:gap-14 sm:px-6 sm:pb-28 sm:pt-24 lg:grid-cols-[1fr_auto]">
          <div className="animate-fade-up order-2 flex flex-col items-start gap-6 lg:order-1">
            <span className="inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-3.5 py-1.5 text-xs font-medium text-violet-700 dark:text-violet-300">
              <span className="relative flex h-2 w-2">
                <span className="absolute h-full w-full animate-ping rounded-full bg-violet-500 opacity-60" />
                <span className="h-2 w-2 rounded-full bg-violet-500" />
              </span>
              {text(t, "hero_badge", "Available for freelance projects")}
            </span>

            <h1 className="max-w-3xl whitespace-pre-line text-[2rem] font-bold leading-[1.12] tracking-tight sm:text-6xl sm:leading-[1.1]">
              {text(t, "hero_headline_prefix", "Full Stack Engineer,\non the road to")}{" "}
              <span className="bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 bg-clip-text text-transparent dark:from-violet-400 dark:via-fuchsia-300 dark:to-pink-400">
                {text(t, "hero_headline_accent", "Software Architect")}
              </span>
              .
            </h1>

            <p className="max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              {text(
                t,
                "hero_subtitle",
                "I build enterprise-grade systems — healthcare platforms, ERPs, document management, and AI-powered applications.",
              )}
            </p>

            <div className="mt-2 flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <Link
                href="/case-studies"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-zinc-900 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-zinc-900/10 transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:shadow-none dark:hover:bg-zinc-300"
              >
                View case studies
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14m-6-6 6 6-6 6" />
                </svg>
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center justify-center rounded-full border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-700 transition-colors hover:border-zinc-400 hover:text-zinc-900 dark:border-zinc-700 dark:text-zinc-300 dark:hover:border-zinc-500 dark:hover:text-zinc-100"
              >
                Work with me
              </Link>
            </div>

            {stats.length > 0 && (
              <dl className="mt-8 grid w-full grid-cols-3 gap-3 border-t border-zinc-200/70 pt-6 sm:mt-10 sm:gap-6 sm:pt-8 dark:border-zinc-800/70">
                {stats.map(({ value, label }) => (
                  <div key={label}>
                    <dt className="sr-only">{label}</dt>
                    <dd className="text-2xl font-bold tracking-tight sm:text-3xl">{value}</dd>
                    <dd className="mt-1 text-xs leading-snug text-zinc-500 sm:text-sm dark:text-zinc-400">{label}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          {/* Portrait */}
          <div className="animate-fade-up order-1 mx-auto lg:order-2">
            <div className="relative">
              <div className="absolute -inset-4 -z-10 rounded-[2rem] bg-gradient-to-br from-violet-500/30 via-fuchsia-500/20 to-pink-500/30 blur-2xl" />
              {hasPortrait ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/khan-rafaat-abtahe.jpeg"
                  alt="Portrait of Khan Rafaat Abtahe"
                  className="h-56 w-56 rounded-[2rem] border-2 border-white object-cover shadow-2xl shadow-violet-500/20 sm:h-72 sm:w-72 lg:h-80 lg:w-80 dark:border-zinc-800"
                />
              ) : (
                <div className="flex h-56 w-56 items-center justify-center rounded-[2rem] border-2 border-white bg-gradient-to-br from-violet-500 to-fuchsia-600 font-mono text-7xl font-bold text-white shadow-2xl shadow-violet-500/20 sm:h-72 sm:w-72 lg:h-80 lg:w-80 dark:border-zinc-800">
                  R
                </div>
              )}
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-xs font-semibold text-zinc-700 shadow-lg dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
                {text(t, "portrait_caption", "Khan Rafaat Abtahe · Full Stack Engineer")}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stack ───────────────────────────────────────────────────── */}
      <section className="border-y border-zinc-200/60 bg-zinc-50/60 dark:border-zinc-800/60 dark:bg-zinc-900/30">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <p className="text-center text-xs font-medium uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
            {text(t, "stack_heading", "Tools of the trade")}
          </p>
          <div className="marquee mt-6" aria-label="Technologies I work with">
            <div className="marquee-track">
              {[...stack, ...stack].map((item, i) => (
                <span
                  key={`${item}-${i}`}
                  aria-hidden={i >= stack.length}
                  className="whitespace-nowrap rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-sm font-medium text-zinc-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured work ───────────────────────────────────────────── */}
      {featured.results.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
          <div className="flex items-end justify-between gap-6">
            <div>
              <p className="text-sm font-medium uppercase tracking-widest text-violet-600 dark:text-violet-400">
                Featured work
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                {text(t, "featured_heading", "Systems, not just websites")}
              </h2>
            </div>
            <Link
              href="/case-studies"
              className="hidden shrink-0 text-sm font-medium text-zinc-600 underline-offset-4 hover:text-zinc-900 hover:underline sm:block dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              All case studies →
            </Link>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {featured.results.map(({ slug, tag, title, summary, tech_stack }) => (
              <Link
                key={slug}
                href={`/case-studies/${slug}`}
                className="group relative flex flex-col rounded-2xl border border-zinc-200 bg-white p-7 transition-all hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-500/5 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-violet-400/30"
              >
                <span className="w-fit rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-700 dark:text-violet-300">
                  {tag}
                </span>
                <h3 className="mt-4 text-lg font-semibold tracking-tight group-hover:text-violet-700 dark:group-hover:text-violet-300">
                  {title}
                </h3>
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
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Services ────────────────────────────────────────────────── */}
      {services.length > 0 && (
        <section className="border-t border-zinc-200/60 bg-zinc-50/60 dark:border-zinc-800/60 dark:bg-zinc-900/30">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
            <p className="text-sm font-medium uppercase tracking-widest text-violet-600 dark:text-violet-400">
              Services
            </p>
            <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
              {text(t, "services_heading", "What I can take off your plate")}
            </h2>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              {services.map(({ title, description, icon }) => (
                <div
                  key={title}
                  className="flex gap-5 rounded-2xl border border-zinc-200 bg-white p-7 dark:border-zinc-800 dark:bg-zinc-900/50"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/15 to-fuchsia-500/15 text-violet-600 dark:text-violet-400">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      {serviceIcons[icon] ?? serviceIcons.code}
                    </svg>
                  </span>
                  <div>
                    <h3 className="font-semibold tracking-tight">{title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                      {description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Process ─────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <p className="text-sm font-medium uppercase tracking-widest text-violet-600 dark:text-violet-400">
          How I work
        </p>
        <h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">
          {text(t, "process_heading", "No surprises, no black boxes")}
        </h2>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              step: "01",
              title: text(t, "process_1_title", "Understand"),
              body: text(
                t,
                "process_1_body",
                "We start with the problem, not the tech. I ask the questions that surface hidden requirements — compliance, integrations, scale — before a line of code exists.",
              ),
            },
            {
              step: "02",
              title: text(t, "process_2_title", "Architect"),
              body: text(
                t,
                "process_2_body",
                "You get a written plan: data model, API design, trade-offs, and phased milestones — so you know what you're buying and can challenge it early.",
              ),
            },
            {
              step: "03",
              title: text(t, "process_3_title", "Ship & support"),
              body: text(
                t,
                "process_3_body",
                "Tested, documented delivery in increments you can use — then honest handoff or ongoing support, your choice. No lock-in by obscurity.",
              ),
            },
          ].map(({ step, title, body }) => (
            <div
              key={step}
              className="relative rounded-2xl border border-zinc-200 bg-white p-7 dark:border-zinc-800 dark:bg-zinc-900/50"
            >
              <span className="bg-gradient-to-br from-violet-500 to-fuchsia-500 bg-clip-text font-mono text-4xl font-bold text-transparent">
                {step}
              </span>
              <h3 className="mt-4 font-semibold tracking-tight">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Latest writing ──────────────────────────────────────────── */}
      {latestPosts.length > 0 && (
        <section className="border-t border-zinc-200/60 bg-zinc-50/60 dark:border-zinc-800/60 dark:bg-zinc-900/30">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-sm font-medium uppercase tracking-widest text-violet-600 dark:text-violet-400">
                  Latest writing
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                  {text(t, "blog_heading", "Notes from the trenches")}
                </h2>
              </div>
              <Link
                href="/blog"
                className="hidden shrink-0 text-sm font-medium text-zinc-600 underline-offset-4 hover:text-zinc-900 hover:underline sm:block dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                All posts →
              </Link>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {latestPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col rounded-2xl border border-zinc-200 bg-white p-7 transition-all hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-500/5 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-violet-400/30"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400">
                    {post.category && (
                      <span className="rounded-full bg-violet-500/10 px-2.5 py-0.5 font-medium text-violet-700 dark:text-violet-300">
                        {post.category.name}
                      </span>
                    )}
                    <time dateTime={post.published_at}>
                      {new Date(post.published_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </time>
                    <span>·</span>
                    <span>{post.reading_minutes} min</span>
                  </div>
                  <h3 className="mt-3 font-semibold tracking-tight group-hover:text-violet-700 dark:group-hover:text-violet-300">
                    {post.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {post.excerpt}
                  </p>
                  <span className="mt-4 text-sm font-medium text-violet-600 dark:text-violet-400">
                    Read →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA ─────────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-24">
        <div className="relative overflow-hidden rounded-3xl bg-zinc-900 px-5 py-12 text-center sm:px-16 sm:py-16 dark:bg-zinc-900/80 dark:ring-1 dark:ring-zinc-800">
          <div className="absolute left-1/2 top-0 -z-0 h-40 w-[30rem] -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-500/30 to-pink-500/30 blur-3xl" />
          <h2 className="relative text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {text(t, "cta_heading", "Have a system that needs building?")}
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-zinc-300">
            {text(
              t,
              "cta_text",
              "Tell me about the problem — I'll tell you honestly whether I'm the right person to solve it.",
            )}
          </p>
          <div className="relative mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center sm:gap-4">
            <Link
              href="/contact"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
            >
              Contact me
            </Link>
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#1fb356]"
            >
              <svg viewBox="0 0 32 32" className="h-4 w-4" fill="currentColor" aria-hidden="true">
                <path d="M16.004 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.26.59 4.46 1.71 6.4L3.2 28.8l6.59-1.73a12.74 12.74 0 0 0 6.21 1.58h.01c7.06 0 12.8-5.74 12.8-12.8s-5.74-12.65-12.8-12.65Z" />
              </svg>
              WhatsApp me
            </a>
            <a
              href={`mailto:${contactEmail}`}
              className="break-all rounded-full border border-zinc-600 px-6 py-3 text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-400 hover:text-white"
            >
              {contactEmail}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
