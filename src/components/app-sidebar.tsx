"use client";

import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { IconLogout } from "@/components/nav-icons";
import { MainNavLinks } from "@/components/main-nav-links";
import { SidebarToggle } from "@/components/sidebar-toggle";
import { useSidebar } from "@/components/sidebar-context";

function rowClass(active: boolean) {
  return `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
    active
      ? "bg-blue-100 text-blue-900"
      : "text-slate-600 hover:bg-sky-100 hover:text-slate-900"
  }`;
}

function iconClass(active: boolean) {
  return active
    ? "h-5 w-5 shrink-0 text-blue-600"
    : "h-5 w-5 shrink-0 text-slate-500";
}

export function AppSidebar() {
  const pathname = usePathname();
  const { status } = useSession();
  const { open, setOpen } = useSidebar();
  const [narrow, setNarrow] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const fn = () => setNarrow(mq.matches);
    fn();
    mq.addEventListener("change", fn);
    return () => mq.removeEventListener("change", fn);
  }, []);

  useEffect(() => {
    if (!window.matchMedia("(max-width: 767px)").matches) return;
    const id = requestAnimationFrame(() => setOpen(false));
    return () => cancelAnimationFrame(id);
  }, [pathname, setOpen]);

  return (
    <>
      {narrow ? (
        <button
          type="button"
          className={`fixed inset-0 z-20 bg-slate-900/40 transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none md:hidden ${
            open
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0"
          }`}
          aria-hidden={!open}
          aria-label="Close menu"
          tabIndex={open ? undefined : -1}
          onClick={() => setOpen(false)}
        />
      ) : null}
      {!open && narrow ? (
        <div className="fixed left-2 top-[max(5.25rem,env(safe-area-inset-top)+4.5rem)] z-[35] md:hidden">
          <SidebarToggle compact />
        </div>
      ) : null}
      <aside
        id="coinflow-site-sidebar"
        className={`flex h-[100dvh] shrink-0 flex-col border-r border-sky-100 bg-white/95 pt-[max(0.75rem,env(safe-area-inset-top))] shadow-sm backdrop-blur transition-[transform,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none motion-reduce:duration-0 supports-[backdrop-filter]:bg-white/85 fixed inset-y-0 left-0 z-30 md:relative md:inset-auto md:left-auto md:top-0 md:z-20 md:sticky ${
          open
            ? "w-[min(100%,14rem)] max-w-[85vw] translate-x-0 md:w-56 md:max-w-none"
            : "w-[min(100%,14rem)] max-w-[85vw] -translate-x-full pointer-events-none md:pointer-events-auto md:w-10 md:min-w-10 md:max-w-none md:translate-x-0 md:overflow-hidden md:border-sky-100"
        }`}
        aria-label="Main navigation"
        aria-hidden={open || !narrow ? undefined : true}
      >
        <div
          className={`flex flex-col pt-1 ${open ? "px-2 pb-3" : "items-center px-2 pb-2 md:px-0 md:pt-2"}`}
        >
          {open ? (
            <div className="flex items-start justify-between gap-2 px-1">
              <Link
                href="/"
                className="flex min-w-0 flex-1 items-center gap-2.5 rounded-xl px-2 py-1.5 text-slate-900 transition-colors hover:bg-sky-50"
              >
                <BrandMark />
                <span className="min-w-0 truncate text-lg font-semibold tracking-tight">
                  <span className="text-blue-600">Coin</span>flow
                </span>
              </Link>
              <SidebarToggle />
            </div>
          ) : (
            <div className="flex justify-center md:pt-0.5">
              <SidebarToggle compact />
            </div>
          )}
        </div>
        {open ? (
          <>
            <nav className="flex flex-1 flex-col gap-0.5 px-2">
              <MainNavLinks
                rowClass={rowClass}
                iconClass={iconClass}
                onNavigate={() => {
                  if (
                    typeof window !== "undefined" &&
                    window.matchMedia("(max-width: 767px)").matches
                  ) {
                    setOpen(false);
                  }
                }}
              />
            </nav>
            {status === "authenticated" ? (
              <div className="mt-auto border-t border-sky-100 p-2">
                <button
                  type="button"
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-600 transition-colors hover:bg-sky-100 hover:text-slate-900"
                  onClick={() => {
                    if (
                      typeof window !== "undefined" &&
                      window.matchMedia("(max-width: 767px)").matches
                    ) {
                      setOpen(false);
                    }
                    void signOut({ callbackUrl: "/" });
                  }}
                >
                  <IconLogout className="h-5 w-5 shrink-0 text-slate-500" />
                  Sign out
                </button>
              </div>
            ) : null}
          </>
        ) : null}
      </aside>
    </>
  );
}
