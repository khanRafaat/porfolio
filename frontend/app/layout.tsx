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
    "Full Stack Software Engineer building enterprise systems: ERP, healthcare platforms (HL7/FHIR), document management, and AI-powered applications. Laravel · Spring Boot · AI Systems.",
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
