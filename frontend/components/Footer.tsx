import Link from "next/link";
import { getSiteText, text } from "@/lib/content";
import { LogoMark } from "./LogoMark";

const nav = [
  { href: "/case-studies", label: "Case Studies" },
  { href: "/services", label: "Services" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
  { href: "/portal", label: "Client Portal" },
];

export async function Footer() {
  const t = await getSiteText();
  const email = text(t, "contact_email", "rafaatabtahe@gmail.com");
  const whatsapp = text(t, "whatsapp_number", "+8801749972744");
  const waLink = `https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}`;
  const github = text(t, "github_url", "https://github.com/khanrafaat");
  const linkedin = text(t, "linkedin_url", "https://bd.linkedin.com/in/khan-rafaat-abtahe");

  const connect = [
    { label: "GitHub", href: github, external: true },
    { label: "LinkedIn", href: linkedin, external: true },
    { label: `WhatsApp ${whatsapp}`, href: waLink, external: true },
    { label: email, href: `mailto:${email}`, external: false },
  ];

  return (
    <footer className="border-t border-zinc-200/60 dark:border-zinc-800/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="flex items-center gap-2.5 font-semibold tracking-tight">
            <LogoMark className="h-8 w-8" />
            Khan Rafaat Abtahe<span className="text-violet-600 dark:text-violet-400">.</span>
          </p>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">
            {text(
              t,
              "footer_blurb",
              "Full stack engineer building enterprise systems — healthcare platforms, ERP, document management, and AI-powered applications.",
            )}
          </p>
        </div>

        <div className="text-sm">
          <p className="font-medium text-zinc-900 dark:text-zinc-100">Explore</p>
          <ul className="mt-4 space-y-2.5">
            {nav.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="text-sm">
          <p className="font-medium text-zinc-900 dark:text-zinc-100">Connect</p>
          <ul className="mt-4 space-y-2.5">
            {connect.map(({ label, href, external }) => (
              <li key={label}>
                <a
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  className="break-all text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-zinc-200/60 dark:border-zinc-800/60">
        <p className="mx-auto max-w-6xl px-6 py-6 text-xs text-zinc-500 dark:text-zinc-500">
          © {new Date().getFullYear()} Khan Rafaat Abtahe. Built with Next.js,
          Django & way too much coffee.
        </p>
      </div>
    </footer>
  );
}
