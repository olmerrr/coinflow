"use client";

export function AppInfoPanel() {
  return (
    <aside
      className="sticky top-0 z-10 hidden h-[100dvh] w-56 shrink-0 flex-col border-l border-sky-100 bg-white/95 pt-[max(0.75rem,env(safe-area-inset-top))] shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/85 lg:flex"
      aria-label="About this app"
    >
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-3 pb-6 pt-1">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-blue-600">
          About
        </h2>
        <p className="text-sm leading-relaxed text-slate-600">
          Coinflow is a paper demo: market rows come from a{" "}
          <span className="font-medium text-slate-800">cached snapshot</span>{" "}
          in Postgres, not live ticks on every page load.
        </p>
        <p className="text-sm leading-relaxed text-slate-600">
          Sign in for the dashboard. Nothing here is trading advice or a broker
          offer.
        </p>
        <div className="mt-auto rounded-lg border border-sky-100 bg-sky-50/80 px-3 py-2.5 text-xs text-slate-600">
          Cron or script refreshes data on a schedule; see README for details.
        </div>
      </div>
    </aside>
  );
}
