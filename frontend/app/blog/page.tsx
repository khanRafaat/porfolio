import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { getPosts } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Articles on Laravel, Spring Boot, system design, healthcare IT (HL7/FHIR/LIS), and AI engineering.",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default async function BlogIndexPage() {
  const { results: posts } = await getPosts();

  return (
    <main>
      <PageHeader
        eyebrow="Blog"
        title="Notes from the trenches"
        description="Laravel, Spring Boot, system design, healthcare IT, and AI engineering — written for engineers who ship."
      />
      <div className="mx-auto max-w-6xl px-6 py-16">
        {posts.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
            No posts published yet — check back soon.
          </p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white transition-all hover:-translate-y-1 hover:border-violet-500/40 hover:shadow-xl hover:shadow-violet-500/5 dark:border-zinc-800 dark:bg-zinc-900/50 dark:hover:border-violet-400/30"
              >
                {post.cover_image_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={post.cover_image_url}
                    alt={post.cover_image_alt || post.title}
                    className="aspect-video w-full object-cover"
                  />
                )}
                <div className="flex flex-1 flex-col p-7">
                  <div className="flex items-center gap-3 text-xs text-zinc-500 dark:text-zinc-400">
                    {post.category && (
                      <span className="rounded-full bg-violet-500/10 px-3 py-1 font-medium text-violet-700 dark:text-violet-300">
                        {post.category.name}
                      </span>
                    )}
                    <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                    <span>·</span>
                    <span>{post.reading_minutes} min read</span>
                  </div>
                  <h2 className="mt-4 text-lg font-semibold tracking-tight group-hover:text-violet-700 dark:group-hover:text-violet-300">
                    {post.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
