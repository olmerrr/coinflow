const UPSTREAM = "https://api.coingecko.com/api/v3";

export async function fetchMarketsFromCoinGecko(perPage: number): Promise<unknown> {
  const params = new URLSearchParams({
    vs_currency: "usd",
    order: "market_cap_desc",
    per_page: String(Math.min(50, Math.max(1, perPage))),
    page: "1",
    sparkline: "true",
  });

  const headers: HeadersInit = { Accept: "application/json" };
  const key = process.env.COINGECKO_API_KEY;
  if (key) headers["x-cg-demo-api-key"] = key;

  const res = await fetch(`${UPSTREAM}/coins/markets?${params}`, {
    headers,
    cache: "no-store",
  });

  const text = await res.text();
  if (!res.ok) {
    throw new Error(text || res.statusText || String(res.status));
  }

  return JSON.parse(text) as unknown;
}
