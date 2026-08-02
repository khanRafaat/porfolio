import type { Metadata } from "next";
import Link from "next/link";
import { getDemoProjects, getSiteText, text, type PortalProject } from "@/lib/content";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Client Portal",
  robots: { index: false, follow: false },
};

const statusLabel: Record<PortalProject["status"], string> = {
  planning: "Planning",
  in_progress: "In progress",
  review: "In review",
  completed: "Completed",
  on_hold: "On hold",
};

const statusColor: Record<PortalProject["status"], string> = {
  planning: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-300",
  in_progress: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  review: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  completed: "bg-green-500/10 text-green-700 dark:text-green-300",
  on_hold: "bg-red-500/10 text-red-700 dark:text-red-300",
};

const invoiceColor: Record<string, string> = {
  draft: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-300",
  sent: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  paid: "bg-green-500/10 text-green-700 dark:text-green-300",
  overdue: "bg-red-500/10 text-red-700 dark:text-red-300",
};

function fmtDate(iso: string | null) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export default async function PortalHomePage() {
  const [projects, t] = await Promise.all([getDemoProjects(), getSiteText()]);

  // Admin → Site texts → portal_demo_banner: set to "off" to hide.
  // The projects below are sample data, so keep this on unless the
  // portal is showing real client projects behind a login.
  const showBanner = text(t, "portal_demo_banner", "on").toLowerCase() !== "off";

  return (
    <main>
      {showBanner && (
        <div className="mb-8 flex flex-col gap-4 rounded-2xl border border-violet-500/25 bg-violet-500/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold text-violet-700 dark:text-violet-300">
              {text(t, "portal_demo_title", "Demo preview")}
            </p>
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
              {text(
                t,
                "portal_demo_text",
                "This is how clients track their projects — milestones, invoices, and progress updates in one place. Client login is coming soon.",
              )}
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 rounded-full bg-zinc-900 px-5 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Become a client
          </Link>
        </div>
      )}

      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Your projects</h1>

      {projects.length === 0 ? (
        <p className="mt-8 rounded-2xl border border-dashed border-zinc-300 p-10 text-center text-sm text-zinc-500 dark:border-zinc-700 dark:text-zinc-400">
          Demo data is loading — check back in a minute.
        </p>
      ) : (
        <div className="mt-8 space-y-8">
          {projects.map((project) => (
            <article
              key={project.title}
              className="rounded-3xl border border-zinc-200 bg-white p-6 sm:p-8 dark:border-zinc-800 dark:bg-zinc-900/50"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                    {project.title}
                  </h2>
                  <p className="mt-1 max-w-xl text-sm text-zinc-600 dark:text-zinc-400">
                    {project.description}
                  </p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusColor[project.status]}`}>
                  {statusLabel[project.status]}
                </span>
              </div>

              {/* Progress */}
              <div className="mt-6">
                <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span>Progress</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">{project.progress}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                    style={{ width: `${Math.min(100, Math.max(0, project.progress))}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-xs text-zinc-500 dark:text-zinc-400">
                  <span>Started {fmtDate(project.start_date)}</span>
                  <span>Due {fmtDate(project.due_date)}</span>
                </div>
              </div>

              <div className="mt-8 grid gap-8 lg:grid-cols-2">
                {/* Milestones */}
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                    Milestones
                  </h3>
                  <ul className="mt-4 space-y-3">
                    {project.milestones.map((m) => (
                      <li key={m.title} className="flex items-start gap-3">
                        <span
                          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] ${
                            m.status === "done"
                              ? "bg-green-500 text-white"
                              : m.status === "in_progress"
                                ? "border-2 border-violet-500 text-violet-500"
                                : "border-2 border-zinc-300 dark:border-zinc-600"
                          }`}
                        >
                          {m.status === "done" && "✓"}
                        </span>
                        <div className="min-w-0">
                          <p className={`text-sm font-medium ${m.status === "done" ? "text-zinc-400 line-through dark:text-zinc-500" : ""}`}>
                            {m.title}
                          </p>
                          {m.description && (
                            <p className="text-xs text-zinc-500 dark:text-zinc-400">{m.description}</p>
                          )}
                          <p className="text-xs text-zinc-400 dark:text-zinc-500">Due {fmtDate(m.due_date)}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-8">
                  {/* Invoices */}
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                      Invoices
                    </h3>
                    <div className="mt-4 overflow-x-auto">
                      <table className="w-full text-left text-sm">
                        <thead>
                          <tr className="text-xs text-zinc-400 dark:text-zinc-500">
                            <th className="pb-2 font-medium">Number</th>
                            <th className="pb-2 font-medium">Amount</th>
                            <th className="pb-2 font-medium">Status</th>
                            <th className="pb-2 font-medium">Due</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                          {project.invoices.map((inv) => (
                            <tr key={inv.number}>
                              <td className="py-2.5 font-mono text-xs">{inv.number}</td>
                              <td className="py-2.5">
                                {Number(inv.amount).toLocaleString("en-US", { style: "currency", currency: inv.currency })}
                              </td>
                              <td className="py-2.5">
                                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${invoiceColor[inv.status] ?? invoiceColor.draft}`}>
                                  {inv.status}
                                </span>
                              </td>
                              <td className="py-2.5 text-zinc-500 dark:text-zinc-400">{fmtDate(inv.due_date)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Updates */}
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500">
                      Latest updates
                    </h3>
                    <ul className="mt-4 space-y-4">
                      {project.updates.map((u) => (
                        <li key={u.title} className="border-l-2 border-violet-500/40 pl-4">
                          <p className="text-sm font-medium">{u.title}</p>
                          <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">{u.body}</p>
                          <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">{fmtDate(u.created_at)}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
