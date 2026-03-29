# Coinflow

> Paper demo: live-style crypto overview, email-based sign-up, and a simple dashboard.  
> **Not** a broker or financial advice.

---

## Quick start

```bash
cp .env.example .env   # Windows: copy .env.example .env
# Edit .env (Neon URLs, AUTH_*, Resend, etc.)

npm install
npx prisma generate
npm run db:migrate
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## What it does

- **Markets** — Reads a cached snapshot from Postgres; CoinGecko refreshes that snapshot on a schedule (cron on Vercel or `npm run markets:refresh` locally).
- **Auth** — Register with email; server emails a generated password. Sign in with NextAuth (credentials + JWT).
- **Dashboard** — Protected route for signed-in users.

---

## Stack

### App & UI

- [Next.js 16](https://nextjs.org) — App Router, **webpack** (`--webpack` on dev/build)
- [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Geist](https://vercel.com/font) — `next/font`
- [Recharts](https://recharts.org)

### Forms & validation

- [React Hook Form](https://react-hook-form.com)
- [Zod](https://zod.dev) + [@hookform/resolvers](https://github.com/react-hook-form/resolvers)

### Data & auth

- [PostgreSQL](https://www.postgresql.org) — hosted on [Neon](https://neon.tech)
- [Prisma 6](https://www.prisma.io) — `DATABASE_URL` (pooler) + `DIRECT_URL` (migrations)
- [NextAuth.js v5](https://next-auth.js.org) (Auth.js) — Credentials, JWT, [@auth/prisma-adapter](https://authjs.dev/reference/adapter/prisma)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js)

### Email & external APIs

- [Resend](https://resend.com) — registration emails
- [CoinGecko API](https://www.coingecko.com/en/api) — optional API key; data lands in `market_snapshots`

### Tooling & deploy

- [tsx](https://github.com/privatenumber/tsx) + [dotenv](https://github.com/motdotla/dotenv) — scripts
- [patch-package](https://github.com/ds300/patch-package) — see `patches/next+*.patch`
- [Vercel](https://vercel.com) — hosting + cron (`vercel.json` → `/api/cron/refresh-markets`)

---

## Environment variables

Copy **`.env.example`** → **`.env`**.

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Neon **pooled** URL |
| `DIRECT_URL` | Neon **direct** URL (Prisma migrations) |
| `AUTH_SECRET` | NextAuth secret |
| `AUTH_URL` | Public app URL (e.g. `http://localhost:3000` or your Vercel URL) |
| `RESEND_API_KEY` | Resend API key |
| `EMAIL_FROM` | Sender, e.g. `Coinflow <onboarding@resend.dev>` |
| `CRON_SECRET` | On Vercel, cron requests include `Authorization: Bearer <CRON_SECRET>` |
| `COINGECKO_API_KEY` | Optional |

---

## NPM scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Dev server (webpack) |
| `npm run build` | Local production build |
| `npm run vercel-build` | Migrations + generate + build (matches Vercel) |
| `npm run db:migrate` | Prisma migrate (dev) |
| `npm run markets:refresh` | Pull CoinGecko → update DB snapshot |

---

## Deploy (Vercel)

1. Import the repo and set the same env vars in the project dashboard.  
2. Set **`AUTH_URL`** to your production URL.  
3. After the first deploy, run a market refresh once if the UI is empty (wait for cron or call the protected cron route).

---

## Disclaimer

Learning / demo project only. Market data may be outdated. Not a trading product.
