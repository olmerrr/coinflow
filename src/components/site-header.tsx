"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { IconLogout } from "@/components/nav-icons";
import { MainNavLinks } from "@/components/main-nav-links";
import { SidebarToggle } from "@/components/sidebar-toggle";

export type SidebarToggleComponent = typeof SidebarToggle;

function drawerRowClass(active: boolean) {
  return `flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
    active
      ? "bg-blue-100 text-blue-900"
      : "text-slate-600 hover:bg-sky-100 hover:text-slate-900"
  }`;
}

function drawerIconClass(active: boolean) {
  return active
    ? "h-5 w-5 shrink-0 text-blue-600"
    : "h-5 w-5 shrink-0 text-slate-500";
}

function barRowClass(active: boolean) {
  return `inline-flex min-h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-medium transition-colors sm:min-h-11 sm:px-3 ${
    active
      ? "bg-blue-100 text-blue-900"
      : "text-slate-600 hover:bg-sky-100 hover:text-slate-900"
  }`;
}

function barIconClass(active: boolean) {
  return active
    ? "h-4 w-4 shrink-0 text-blue-600"
    : "h-4 w-4 shrink-0 text-slate-500";
}

const headerInfoSlotClass =
  "flex min-h-11 w-full flex-col items-center justify-center rounded-lg border border-sky-100 bg-sky-50/70 px-2 py-2 text-center sm:min-h-[2.75rem]";

function HeaderInfoPair() {
  return (
    <>
      <div className={headerInfoSlotClass}>
        <span className="text-xs font-semibold text-slate-800">
          Cached snapshot
        </span>
        <span className="mt-0.5 text-[10px] leading-tight text-slate-500">
          Postgres · scheduled refresh
        </span>
      </div>
      <div className={headerInfoSlotClass}>
        <span className="text-xs font-semibold text-slate-800">
          Paper demo
        </span>
        <span className="mt-0.5 text-[10px] leading-tight text-slate-500">
          Not a broker · no advice
        </span>
      </div>
    </>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const { status } = useSession();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setOpen(false));
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-sky-100 bg-white/95 pt-[env(safe-area-inset-top,0px)] shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto max-w-6xl pb-2 pl-[max(0.75rem,env(safe-area-inset-left,0px))] pr-[max(0.75rem,env(safe-area-inset-right,0px))] pt-3 sm:pl-[max(1.5rem,env(safe-area-inset-left,0px))] sm:pr-[max(1.5rem,env(safe-area-inset-right,0px))]">
        <div className="flex items-center justify-between gap-3 md:grid md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center md:gap-4">
          <Link
            href="/"
            className="flex min-h-10 shrink-0 items-center gap-2.5 self-center text-2xl font-semibold leading-none tracking-tight text-slate-900 sm:min-h-11"
          >
            <BrandMark className="sm:h-10 sm:w-10" />
            <span>
              <span className="text-blue-600">Coin</span>flow
            </span>
          </Link>

          <div className="hidden min-h-11 min-w-0 items-center md:flex md:justify-center">
            <div className="grid w-full max-w-md grid-cols-2 gap-2">
              <HeaderInfoPair />
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-1">
            <nav
              className="hidden items-center gap-1 md:flex md:flex-wrap md:justify-end"
              aria-label="Main navigation"
            >
              <MainNavLinks rowClass={barRowClass} iconClass={barIconClass} />
              {status === "authenticated" ? (
                <button
                  type="button"
                  className="inline-flex min-h-10 shrink-0 items-center gap-2 whitespace-nowrap rounded-md px-2.5 py-2 text-sm font-medium text-slate-600 hover:bg-sky-100 sm:min-h-11 sm:px-3"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <IconLogout className="h-4 w-4 shrink-0 text-slate-500" />
                  Sign out
                </button>
              ) : null}
            </nav>

            <div className="md:hidden">
              <button
                type="button"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sky-200 bg-white text-slate-800 shadow-sm"
                aria-expanded={open}
                aria-controls="coinflow-mobile-nav"
                aria-label={open ? "Close menu" : "Open menu"}
                onClick={() => setOpen((v) => !v)}
              >
                {open ? (
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden
                  >
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                ) : (
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden
                  >
                    <path d="M4 7h16M4 12h16M4 17h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-2 grid grid-cols-2 gap-2 md:hidden">
          <HeaderInfoPair />
        </div>
      </div>

      {open ? (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-slate-900/40"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div
            id="coinflow-mobile-nav"
            className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col border-l border-sky-100 bg-white shadow-2xl"
          >
            <div className="flex h-14 items-center justify-between border-b border-sky-100 px-4">
              <span className="text-sm font-semibold text-slate-900">Menu</span>
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-600"
                aria-label="Close"
                onClick={() => setOpen(false)}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden
                >
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <nav
              className="flex flex-1 flex-col gap-1 bg-white p-3"
              aria-label="Main navigation"
            >
              <MainNavLinks
                rowClass={drawerRowClass}
                iconClass={drawerIconClass}
                onNavigate={() => setOpen(false)}
              />
              {status === "authenticated" ? (
                <button
                  type="button"
                  className="mt-2 flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-600 hover:bg-sky-100 hover:text-slate-900"
                  onClick={() => {
                    setOpen(false);
                    void signOut({ callbackUrl: "/" });
                  }}
                >
                  <IconLogout className="h-5 w-5 shrink-0 text-slate-500" />
                  Sign out
                </button>
              ) : null}
            </nav>
          </div>
        </div>
      ) : null}
    </header>
  );
}
