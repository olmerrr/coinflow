import Link from "next/link";
import { MarketsPanel } from "@/components/markets-panel";

export default function Home() {
  return (
    <main className="mx-auto w-full min-w-0 max-w-6xl flex-1 overflow-x-clip py-6 pl-[max(0.75rem,env(safe-area-inset-left,0px))] pr-[max(0.75rem,env(safe-area-inset-right,0px))] sm:py-10 sm:pl-[max(1.5rem,env(safe-area-inset-left,0px))] sm:pr-[max(1.5rem,env(safe-area-inset-right,0px))]">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-stretch lg:justify-between lg:gap-10">
        <div className="max-w-xl shrink-0 lg:pt-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600 sm:text-sm">
            Paper demo
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
            Coinflow
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-600 sm:mt-4 sm:text-lg">
            Live crypto prices and 7-day sparklines from CoinGecko. Sign in for a
            dashboard; the market overview loads here immediately.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
            <Link
              href="/register"
              className="inline-flex min-h-11 items-center justify-center rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition active:bg-blue-700 hover:bg-blue-500"
            >
              Create account
            </Link>
            <Link
              href="/login"
              className="inline-flex min-h-11 items-center justify-center rounded-lg border border-sky-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-800 shadow-sm transition active:bg-sky-100 hover:border-blue-300 hover:bg-sky-50"
            >
              Log in
            </Link>
          </div>
        </div>
        <div className="w-full rounded-2xl border border-sky-100 bg-white/90 p-5 shadow-sm ring-1 ring-sky-100 sm:p-6 lg:max-w-md lg:shrink-0">
          <p className="text-sm font-medium text-slate-500">At a glance</p>
          <p className="mt-2 text-xl font-semibold text-slate-900 sm:text-2xl">
            Top assets by market cap
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Same feed as the charts below — USD, server cache about one minute.
          </p>
        </div>
      </div>

      <section className="mt-10 border-t border-sky-100 pt-8 sm:mt-14 sm:pt-12">
        <div className="mb-5 flex flex-col gap-1 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">
              Markets & charts
            </h2>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              CoinGecko · not financial advice
            </p>
          </div>
        </div>
        <MarketsPanel />
      </section>
    </main>
  );
}
