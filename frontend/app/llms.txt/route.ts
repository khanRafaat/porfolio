import { getCaseStudies, getPosts, getServices, getSiteText, text } from "@/lib/content";

export const revalidate = 300;

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost";

/**
 * llms.txt — a curated, markdown index of the site for AI agents
 * (https://llmstxt.org). Regenerates from the CMS every 5 minutes.
 */
export async function GET() {
  const [t, posts, studies, services] = await Promise.all([
    getSiteText(),
    getPosts(),
    getCaseStudies(),
    getServices(),
  ]);

  const lines: string[] = [
    "# Khan Rafaat Abtahe — Full Stack Engineer → Software Architect",
    "",
    `> ${text(t, "hero_subtitle", "Enterprise systems: healthcare (HL7/FHIR), ERP, document management, and AI-powered applications. Laravel and Spring Boot at the core.")}`,
    "",
    `Contact: ${text(t, "contact_email", "rafaatabtahe@gmail.com")}`,
    "",
    "## Services",
    "",
    ...services.map((s) => `- **${s.title}**: ${s.description}`),
    "",
    "## Case Studies",
    "",
    ...studies.results.map(
      (s) => `- [${s.title}](${siteUrl}/case-studies/${s.slug}): ${s.summary}`,
    ),
    "",
    "## Blog Posts",
    "",
    ...posts.results.map(
      (p) => `- [${p.title}](${siteUrl}/blog/${p.slug}): ${p.excerpt}`,
    ),
    "",
    "## Machine-readable",
    "",
    `- [Sitemap](${siteUrl}/sitemap.xml)`,
    `- [Blog API (JSON)](${siteUrl}/api/v1/blog/posts/)`,
    `- [Case studies API (JSON)](${siteUrl}/api/v1/portfolio/case-studies/)`,
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
