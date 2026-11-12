"use client";

import { ReactNode, useEffect } from "react";
import Sidebar from "./Sidebar";
import AdminTopbar from "./AdminTopbar";

interface AppShellProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  counts: {
    bookings: number;
    services: number;
    reviews: number;
    blog: number;
    unhandledNotes: number;
  };
  pendingCount: number;
  onNavigateTab: (tab: string, filter?: string) => void;
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

    document.documentElement.style.zoom = "0.9";
    document.documentElement.style.backgroundColor = "#F6F7FD";
    document.body.style.backgroundColor = "#F6F7FD";

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
      className="flex-1 min-h-screen bg-[#F6F7FD] text-[#0F1535] font-sans selection:bg-[#5B5BF0]/20 selection:text-[#5B5BF0] flex flex-col min-[821px]:pl-[260px]"
    >
      {/* 260px Left Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={onTabChange} onLogout={onLogout} />

      {/* Main content area */}
      <main className="flex-1 min-w-0 min-h-screen bg-[#F6F7FD] flex flex-col">
        <AdminTopbar
          activeTab={activeTab}
          pendingCount={pendingCount}
          onNavigateTab={onNavigateTab}
        />
        <div className="w-full mx-auto px-5 pb-8 md:px-6 md:pb-10 pt-5 md:pt-6 space-y-6 flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
