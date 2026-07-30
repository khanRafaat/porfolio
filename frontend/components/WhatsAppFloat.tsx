import { getSiteText, text } from "@/lib/content";

/** Floating WhatsApp direct-message button, bottom-right on every page. */
export async function WhatsAppFloat() {
  const t = await getSiteText();
  const number = text(t, "whatsapp_number", "+8801749972744").replace(/[^0-9]/g, "");
  const href = `https://wa.me/${number}?text=${encodeURIComponent("Hi Rafaat, I found your portfolio and I'd like to talk about a project.")}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
      className="fixed bottom-5 right-5 z-40 flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] p-3.5 shadow-lg shadow-black/20 transition-transform hover:scale-110 sm:bottom-6 sm:right-6"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7" fill="#fff" aria-hidden="true">
        <path d="M16.004 3.2c-7.06 0-12.8 5.74-12.8 12.8 0 2.26.59 4.46 1.71 6.4L3.2 28.8l6.59-1.73a12.74 12.74 0 0 0 6.21 1.58h.01c7.06 0 12.8-5.74 12.8-12.8s-5.74-12.65-12.8-12.65Zm0 23.36h-.01c-1.91 0-3.78-.51-5.41-1.48l-.39-.23-4.02 1.05 1.07-3.92-.25-.4a10.63 10.63 0 0 1-1.63-5.68c0-5.88 4.79-10.67 10.68-10.67 2.85 0 5.53 1.11 7.54 3.13a10.6 10.6 0 0 1 3.12 7.55c0 5.89-4.79 10.65-10.7 10.65Zm5.86-7.99c-.32-.16-1.9-.94-2.19-1.04-.29-.11-.51-.16-.72.16-.21.32-.83 1.04-1.01 1.25-.19.21-.37.24-.69.08-.32-.16-1.36-.5-2.58-1.6-.95-.85-1.6-1.9-1.78-2.22-.19-.32-.02-.5.14-.66.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.39-.26-.63-.53-.54-.72-.55l-.61-.01c-.21 0-.56.08-.85.4-.29.32-1.12 1.09-1.12 2.66 0 1.57 1.14 3.09 1.3 3.3.16.21 2.25 3.44 5.45 4.82.76.33 1.36.53 1.82.67.77.24 1.46.21 2.01.13.61-.09 1.9-.78 2.16-1.53.27-.75.27-1.39.19-1.53-.08-.13-.29-.21-.61-.37Z" />
      </svg>
    </a>
  );
}
