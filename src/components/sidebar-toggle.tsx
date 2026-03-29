"use client";

import { useSidebar } from "@/components/sidebar-context";

type Props = { compact?: boolean };

export function SidebarToggle({ compact = false }: Props) {
  const { open, toggle } = useSidebar();
  const iconSize = compact ? 14 : 20;

  return (
    <button
      type="button"
      className={
        compact
          ? "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-sky-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-sky-50"
          : "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-sky-50 sm:h-11 sm:w-11"
      }
      aria-expanded={open}
      aria-controls="coinflow-site-sidebar"
      aria-label={open ? "Hide sidebar" : "Show sidebar"}
      onClick={toggle}
    >
      {open ? (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      ) : (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      )}
    </button>
  );
}
