import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Prose } from "@/components/Prose";
import { getCaseStudy, youtubeId } from "@/lib/content";

export const revalidate = 60;

type Props = { params: Promise<{ slug: string }> };

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) return { title: "Case study not found" };

  const title = study.seo_title || study.title;
  const description = study.seo_description || study.summary;
  return {
    title,
    description,
    alternates: {
      canonical: study.canonical_url || `${siteUrl}/case-studies/${study.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      images: study.cover_image_url ? [study.cover_image_url] : undefined,
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = await getCaseStudy(slug);
  if (!study) notFound();

  // Defensive: a cached API response from an older schema may lack these.
  const images = study.images ?? [];
  const videoId = study.video_url ? youtubeId(study.video_url) : null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: study.title,
    description: study.summary,
    datePublished: study.published_at,
    dateModified: study.updated_at,
    image: study.cover_image_url ?? undefined,
    url: `${siteUrl}/case-studies/${study.slug}`,
    author: { "@type": "Person", name: "Khan Rafaat Abtahe", url: siteUrl },
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article className="mx-auto max-w-3xl px-6 py-16">
        <Link
          href="/case-studies"
          className="text-sm font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          ← All case studies
        </Link>

        <header className="mt-8">
          <span className="w-fit rounded-full bg-violet-500/10 px-3 py-1 text-xs font-medium text-violet-700 dark:text-violet-300">
            {study.tag}
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
            {study.title}
          </h1>
          <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">{study.summary}</p>
          {study.tech_stack.length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              {study.tech_stack.map((p) => (
                <li key={p} className="rounded-md bg-zinc-100 px-2.5 py-1.5 font-mono dark:bg-zinc-800">
                  {p}
                </li>
              ))}
            </ul>
          )}
        </header>

        {study.cover_image_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={study.cover_image_url}
            alt={study.cover_image_alt || study.title}
            className="mt-10 w-full rounded-2xl"
          />
        )}

        {videoId && (
          <div className="mt-10 aspect-video overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${videoId}`}
              title={`${study.title} — video walkthrough`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="h-full w-full"
            />
          </div>
        )}

        <div className="mt-10">
          <Prose>{study.body}</Prose>
        </div>

        {images.length > 0 && (
          <section className="mt-14">
            <h2 className="text-xl font-semibold tracking-tight">Screenshots</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {images.map(
                (img, i) =>
                  img.url && (
                    <a
                      key={img.url}
                      href={img.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800 ${
                        i === 0 ? "sm:col-span-2" : ""
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.url}
                        alt={img.alt || `${study.title} screenshot ${i + 1}`}
                        loading="lazy"
                        className="w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      />
                      {img.caption && (
                        <p className="border-t border-zinc-200 px-4 py-2.5 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
                          {img.caption}
                        </p>
                      )}
                    </a>
                  ),
              )}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}
