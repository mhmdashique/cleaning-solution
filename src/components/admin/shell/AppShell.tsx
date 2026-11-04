"use client";

import { ReactNode, useEffect } from "react";
import Sidebar from "./Sidebar";
import { AdminTab } from "@/types/admin";
import AdminTopbar from "./AdminTopbar";

interface AppShellProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  counts: {
    bookings: number;
    services: number;
    reviews: number;
    blog: number;
    unhandledNotes: number;
  };
  pendingCount: number;
  onNavigateTab: (tab: AdminTab, filter?: string) => void;
  onLogout: () => void;
  children: ReactNode;
}

export default function AppShell({
  activeTab,
  onTabChange,
  counts,
  pendingCount,
  onNavigateTab,
  onLogout,
  children,
}: AppShellProps) {
  useEffect(() => {
    document.documentElement.classList.add("admin-mode");
    document.body.classList.add("admin-mode");
    const origHtmlZoom = document.documentElement.style.zoom;
    const origBodyBg = document.body.style.backgroundColor;
    const origHtmlBg = document.documentElement.style.backgroundColor;

    document.documentElement.style.zoom = "1";
    document.documentElement.style.backgroundColor = "var(--bg, #F6F7F6)";
    document.body.style.backgroundColor = "var(--bg, #F6F7F6)";

    return () => {
      document.documentElement.classList.remove("admin-mode");
      document.body.classList.remove("admin-mode");
      document.documentElement.style.zoom = origHtmlZoom;
      document.documentElement.style.backgroundColor = origHtmlBg;
      document.body.style.backgroundColor = origBodyBg;
    };
  }, []);

  return (
    <div 
      data-admin-shell
      className="flex-1 min-h-dvh bg-[#F6F7F6] text-[#12201B] font-sans selection:bg-[#0F6B54]/20 selection:text-[#0F6B54] flex flex-col min-[821px]:grid min-[821px]:grid-cols-[256px_minmax(0,1fr)]"
    >
      {/* Desktop navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={onTabChange}
        counts={counts}
        onLogout={onLogout}
      />

      {/* Main content area */}
      <main className="flex-1 min-w-0 min-h-dvh bg-[#F6F7F6] flex flex-col">
        <AdminTopbar
          activeTab={activeTab}
          pendingCount={pendingCount}
          onNavigateTab={onNavigateTab}
        />
        <div className="w-full max-w-[1240px] mx-auto p-6 md:p-8 space-y-6 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
