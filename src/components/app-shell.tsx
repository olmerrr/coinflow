"use client";

import { useSyncExternalStore } from "react";
import { SessionProvider } from "@/components/session-provider";
import { AppInfoPanel } from "@/components/app-info-panel";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/sidebar-context";
import { SiteHeader } from "@/components/site-header";

const noop = () => () => {};

export function AppShell({ children }: { children: React.ReactNode }) {
  const ready = useSyncExternalStore(noop, () => true, () => false);

  if (!ready) {
    return (
      <div
        className="min-h-[100dvh] flex-1 bg-sky-50 pt-[env(safe-area-inset-top,0px)]"
        suppressHydrationWarning
      />
    );
  }

  return (
    <SessionProvider>
      <SidebarProvider>
        <div className="flex min-h-[100dvh] flex-1 flex-col bg-sky-50 md:flex-row">
          <AppSidebar />
          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <SiteHeader />
            <div className="flex min-h-0 min-w-0 flex-1 flex-col lg:flex-row">
              <div className="min-h-0 min-w-0 flex-1">{children}</div>
              <AppInfoPanel />
            </div>
          </div>
        </div>
      </SidebarProvider>
    </SessionProvider>
  );
}
