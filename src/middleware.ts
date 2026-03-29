import { getAuthSecret } from "@/lib/auth-secret";
import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }
  const secret = getAuthSecret();
  if (!secret) {
    return NextResponse.next();
  }
  const token = await getToken({ req, secret });
  if (!token) {
    const u = new URL("/login", req.nextUrl.origin);
    u.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(u);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
