import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Khan Rafaat Abtahe — Full Stack Engineer → Software Architect",
    template: "%s | Khan Rafaat Abtahe",
  },
  description:
    "Full Stack Software Engineer with 5+ years building enterprise software for the healthcare, pharmaceutical, defense, and logistics industries — ERP systems, HL7/FHIR health platforms, AI-powered document management, and shipping integrations. Laravel · Spring Boot · Next.js.",
  authors: [{ name: "Khan Rafaat Abtahe", url: siteUrl }],
  creator: "Khan Rafaat Abtahe",
  alternates: {
    canonical: "/",
    types: { "application/rss+xml": `${siteUrl}/feed.xml` },
  },
  openGraph: {
    type: "website",
    siteName: "Khan Rafaat Abtahe — Portfolio",
    url: siteUrl,
    title: "Khan Rafaat Abtahe — Full Stack Engineer → Software Architect",
    description:
      "Enterprise systems across defense, healthcare, pharma, and logistics — ERPs, HL7/FHIR platforms, AI-powered applications.",
    images: [{ url: "/khan-rafaat-abtahe.jpeg", width: 473, height: 591, alt: "Khan Rafaat Abtahe" }],
  },
  twitter: {
    card: "summary",
    title: "Khan Rafaat Abtahe — Full Stack Engineer",
    description:
      "Enterprise systems across defense, healthcare, pharma, and logistics.",
    images: ["/khan-rafaat-abtahe.jpeg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

// Site-wide schema: WebSite entity linking name → URL for all engines.
const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Khan Rafaat Abtahe — Portfolio",
  url: siteUrl,
  author: { "@type": "Person", name: "Khan Rafaat Abtahe" },
};

// Runs before hydration so the correct theme is set with no flash.
// Dark is the default; users can switch to light and we remember it.
const themeInit = `(function(){try{if(localStorage.getItem("theme")==="light")document.documentElement.classList.remove("dark")}catch(e){}})()`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    // SSR ships dark by default (also correct for no-JS visitors and crawlers);
    // the head script strips .dark pre-paint only if the user chose light.
    <html lang="en" suppressHydrationWarning className={`${inter.variable} dark`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="flex min-h-screen flex-col bg-white font-sans text-zinc-900 antialiased dark:bg-zinc-950 dark:text-zinc-100">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
        <WhatsAppFloat />
      </body>
    </html>
  );
}
