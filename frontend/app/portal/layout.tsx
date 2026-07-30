// Feature 4 turns this into the authenticated shell: JWT session check
// (refresh cookie → access token in memory), redirect to login when
// anonymous, portal navigation. Everything under /portal is noindex.
export default function PortalLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <section className="mx-auto max-w-5xl px-6 py-10">{children}</section>;
}
