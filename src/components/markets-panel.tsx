"use client";

import { FullPageSpinner } from "@/components/full-page-spinner";
import { useEffect, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  YAxis,
} from "recharts";

type Row = {
  id: string;
  symbol: string;
  name: string;
  current_price: number | null;
  price_change_percentage_24h: number | null;
  market_cap: number | null;
  sparkline_in_7d?: { price?: number[] };
};

function MiniChart({ coinId, prices }: { coinId: string; prices: number[] }) {
  const stroke = "#2563eb";
  const fillId = `sp-${coinId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const data = useMemo(
    () => prices.map((v, i) => ({ i, v })),
    [prices]
  );
  if (data.length < 2) {
    return (
      <div className="flex h-[72px] items-center justify-center text-xs text-slate-400 sm:h-[88px]">
        No chart
      </div>
    );
  }
  const vals = prices.map(Number);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const pad = max === min ? max * 0.01 || 0.01 : (max - min) * 0.08;
  return (
    <div className="h-[72px] w-full sm:h-[88px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.25} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0} />
            </linearGradient>
          </defs>
          <YAxis domain={[min - pad, max + pad]} hide width={0} />
          <Area
            type="monotone"
            dataKey="v"
            stroke={stroke}
            strokeWidth={1.75}
            fill={`url(#${fillId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function MarketsPanel() {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const r = await fetch("/api/markets?per_page=12");
        const data = (await r.json()) as Row[] | { error?: { message?: string } };
        if (cancelled) return;
        if (!r.ok) {
          setErr(
            typeof data === "object" &&
              data &&
              "error" in data &&
              typeof data.error?.message === "string"
              ? data.error.message
              : "Failed to load"
          );
          return;
        }
        if (Array.isArray(data)) setRows(data);
        else setErr("Unexpected response");
      } catch {
        if (!cancelled) setErr("Network error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (err) {
    return (
      <p className="text-sm text-red-600" role="alert">
        {err}
      </p>
    );
  }
  if (!rows) {
    return (
      <FullPageSpinner embed message="Loading markets…" />
    );
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 2xl:grid-cols-4">
        {rows.map((c) => {
          const prices = c.sparkline_in_7d?.price ?? [];
          const pct = c.price_change_percentage_24h ?? 0;
          const positive = pct >= 0;
          return (
            <article
              key={c.id}
              className="flex min-w-0 flex-col rounded-xl border border-sky-100 bg-white p-3 shadow-sm ring-1 ring-sky-50 sm:p-4"
            >
              <div className="flex min-w-0 items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="truncate font-semibold text-slate-900">
                    {c.name}
                  </h3>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {c.symbol}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold tabular-nums ${
                    positive
                      ? "bg-sky-100 text-sky-800"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {c.price_change_percentage_24h != null
                    ? `${positive ? "+" : ""}${c.price_change_percentage_24h.toFixed(2)}%`
                    : "—"}
                </span>
              </div>
              <div className="mt-2 flex-1">
                <MiniChart coinId={c.id} prices={prices} />
              </div>
              <p className="mt-1 text-base font-semibold tabular-nums text-slate-900 sm:text-lg">
                {c.current_price != null
                  ? `$${c.current_price.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: c.current_price < 1 ? 6 : 2,
                    })}`
                  : "—"}
              </p>
              <p className="text-xs text-slate-500">
                7d sparkline · USD
              </p>
            </article>
          );
        })}
      </div>

      <div className="min-w-0">
        <h3 className="mb-1 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Full table
        </h3>
        <p className="mb-2 text-xs text-slate-500 sm:hidden">
          Fits the screen; columns compress on narrow viewports.
        </p>
        <div className="w-full max-w-full overflow-x-auto overscroll-x-contain rounded-xl border border-sky-100 bg-white shadow-sm [scrollbar-gutter:stable] sm:touch-pan-x">
          <table className="w-full min-w-0 table-fixed text-left text-xs sm:table-auto sm:min-w-[520px] sm:text-sm">
            <thead className="border-b border-sky-100 bg-sky-50/80">
              <tr>
                <th className="w-[30%] px-2 py-2 font-medium text-slate-700 sm:w-auto sm:px-3 sm:py-2.5">
                  Asset
                </th>
                <th className="w-[22%] px-1 py-2 font-medium text-slate-700 sm:w-auto sm:px-3 sm:py-2.5">
                  <span className="sm:hidden">Price</span>
                  <span className="hidden sm:inline">Price (USD)</span>
                </th>
                <th className="w-[14%] px-1 py-2 font-medium text-slate-700 sm:w-auto sm:px-3 sm:py-2.5">
                  <span className="sm:hidden">24h</span>
                  <span className="hidden sm:inline">24h %</span>
                </th>
                <th className="w-[22%] px-1 py-2 font-medium text-slate-700 sm:w-auto sm:px-3 sm:py-2.5">
                  <span className="sm:hidden">Cap</span>
                  <span className="hidden sm:inline">Market cap</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c) => (
                <tr
                  key={`t-${c.id}`}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="px-2 py-2 sm:px-3 sm:py-2.5">
                    <span className="block truncate font-medium text-slate-900 sm:inline sm:max-w-none">
                      {c.name}
                    </span>
                    <span className="block truncate text-[10px] font-medium uppercase text-slate-500 sm:ml-2 sm:inline sm:text-xs">
                      {c.symbol}
                    </span>
                  </td>
                  <td className="px-1 py-2 tabular-nums text-slate-800 sm:px-3 sm:py-2.5">
                    {c.current_price != null
                      ? `$${c.current_price.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: c.current_price < 1 ? 6 : 2,
                        })}`
                      : "—"}
                  </td>
                  <td
                    className={`px-1 py-2 tabular-nums sm:px-3 sm:py-2.5 ${
                      (c.price_change_percentage_24h ?? 0) >= 0
                        ? "text-blue-600"
                        : "text-red-600"
                    }`}
                  >
                    {c.price_change_percentage_24h != null
                      ? `${c.price_change_percentage_24h.toFixed(2)}%`
                      : "—"}
                  </td>
                  <td className="px-1 py-2 tabular-nums text-slate-600 sm:px-3 sm:py-2.5">
                    {c.market_cap != null
                      ? `$${(c.market_cap / 1e9).toFixed(2)}B`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
