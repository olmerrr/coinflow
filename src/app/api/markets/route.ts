import { NextRequest } from "next/server";
import { getCachedMarketsSlice } from "@/lib/markets-snapshot";

export async function GET(req: NextRequest) {
  const perPage = Math.min(
    50,
    Math.max(1, parseInt(req.nextUrl.searchParams.get("per_page") ?? "10", 10) || 10)
  );

  try {
    const { items, updatedAt } = await getCachedMarketsSlice(perPage);
    if (items.length === 0) {
      return Response.json(
        {
          error: {
            message:
              "No cached markets. Run migration, then refresh: npm run markets:refresh or GET /api/cron/refresh-markets",
            status: 404,
          },
        },
        { status: 503 }
      );
    }
    const headers = new Headers();
    if (updatedAt) {
      headers.set("X-Markets-Updated-At", updatedAt.toISOString());
    }
    return Response.json(items, { headers });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "read failed";
    return Response.json(
      { error: { message: msg, status: 500 } },
      { status: 502 }
    );
  }
}
