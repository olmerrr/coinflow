import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { fetchMarketsFromCoinGecko } from "@/lib/markets-upstream";

const SNAPSHOT_ID = "default";

type PayloadShape = { coins: unknown[] };

export async function refreshMarketsSnapshot(): Promise<{ count: number }> {
  const raw = await fetchMarketsFromCoinGecko(50);
  if (!Array.isArray(raw)) {
    throw new Error("CoinGecko returned non-array");
  }
  const payload: PayloadShape = { coins: raw };
  const json = payload as unknown as Prisma.InputJsonValue;
  await prisma.marketSnapshot.upsert({
    where: { id: SNAPSHOT_ID },
    create: { id: SNAPSHOT_ID, payload: json },
    update: { payload: json },
  });
  return { count: raw.length };
}

export async function getCachedMarketsSlice(perPage: number): Promise<{
  items: unknown[];
  updatedAt: Date | null;
}> {
  const row = await prisma.marketSnapshot.findUnique({
    where: { id: SNAPSHOT_ID },
  });
  if (!row) {
    return { items: [], updatedAt: null };
  }
  const p = row.payload as unknown;
  let coins: unknown[] = [];
  if (p && typeof p === "object" && "coins" in p && Array.isArray((p as PayloadShape).coins)) {
    coins = (p as PayloadShape).coins;
  }
  const n = Math.min(50, Math.max(1, perPage));
  return {
    items: coins.slice(0, n),
    updatedAt: row.updatedAt,
  };
}
