import { NextRequest } from "next/server";
import { refreshMarketsSnapshot } from "@/lib/markets-snapshot";

export const maxDuration = 60;

function isAuthorized(req: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    if (process.env.VERCEL) return false;
    return process.env.NODE_ENV === "development";
  }
  const auth = req.headers.get("authorization");
  if (auth === `Bearer ${secret}`) return true;
  return req.nextUrl.searchParams.get("secret") === secret;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const { count } = await refreshMarketsSnapshot();
    return Response.json({ ok: true, count });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "refresh failed";
    return Response.json({ ok: false, error: msg }, { status: 502 });
  }
}

export async function POST(req: NextRequest) {
  return GET(req);
}
