<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# Coinflow — agent context

Paper demo app (not a broker): crypto market overview, email-based registration with a generated password, NextAuth login, protected dashboard.

## Commands

- **Dev:** `npm run dev` — uses **`next dev --webpack`** (same as build).
- **Build / Vercel:** `npm run vercel-build` → `prisma migrate deploy`, `prisma generate`, `next build --webpack`.
- **DB (local):** `npm run db:migrate` (Prisma migrate dev).
- **Refresh market snapshot:** `npm run markets:refresh` (needs valid `DATABASE_URL` in `.env`).

Do not assume Turbopack for this app; scripts intentionally pass `--webpack`.

## Stack (where to look)

| Area | Details |
|------|---------|
| App | Next.js 16 App Router under `src/app/`. Root `layout.tsx` uses a **manual `<head>`** (title, viewport, favicon link) — no `metadata` export there. |
| Layout shell | `AppShell`: **`AppSidebar`** (`w-56`, `md+`) + **`SiteHeader`** (logo, two equal info tiles “Cached snapshot” / “Paper demo”, nav; mobile adds a second row of the same tiles). Main column + **`AppInfoPanel`** (`w-56`, `lg+`, right rail). Shared links in `main-nav-links.tsx`; icons in `nav-icons.tsx`. |
| UI | React 19, Tailwind 4, Geist fonts, Recharts on markets UI. |
| Forms | Login + register: **React Hook Form** + **Zod** + `@hookform/resolvers`. |
| DB | **Prisma 6** + PostgreSQL (**Neon**). `schema.prisma` uses `url` + `directUrl` (`DIRECT_URL`) for migrations. |
| Auth | **NextAuth v5** in `src/auth.ts` — Credentials, JWT sessions, `@auth/prisma-adapter`. Handlers: `src/app/api/auth/[...nextauth]/route.ts`. Middleware protects `/dashboard` (`src/middleware.ts`). |
| Register | `POST /api/register` — creates user, hashes password with **bcryptjs**, sends password email via **Resend** (`src/lib/mail.ts`). |
| Markets | Snapshot stored in **`MarketSnapshot`** (`prisma`); `GET /api/markets` reads cache. CoinGecko fetch only in refresh path (`src/lib/markets-upstream.ts`, `markets-snapshot.ts`). Cron: `src/app/api/cron/refresh-markets/route.ts` — on Vercel requires **`CRON_SECRET`** (Bearer header). Schedule: `vercel.json`. |
| Patches | **`patch-package`** on `postinstall`; patches under `patches/next+*.patch` (streaming metadata + metadata `suppressHydrationWarning`). Do not remove without understanding hydration/extension issues. |

## Environment

Copy `.env.example` → `.env`. Never commit `.env` (see `.gitignore`). Production needs `AUTH_URL` set to the **public** site URL. Resend needs `RESEND_API_KEY` and a valid `EMAIL_FROM` for real delivery.

## Conventions for edits

- Prefer matching existing patterns (imports, Tailwind, no extra comments unless the user asks).
- **README.md** is maintained in **English**.
- Favicon: `public/icon.svg` (gradient tile + white sparkline), linked from `layout.tsx`. Same graphic in UI via **`BrandMark`** (`src/components/brand-mark.tsx`) in sidebar + header.

## Disclaimer

Demo only; market data is cached and may be stale.
