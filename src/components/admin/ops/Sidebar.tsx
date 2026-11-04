"use client";

import Link from "next/link";
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Sparkles, 
  Star, 
  FileText, 
  Mail, 
  LogOut, 
  ArrowUpRight 
} from "lucide-react";

export type AdminTab = "overview" | "bookings" | "services" | "reviews" | "blog" | "messages";

interface SidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  counts: {
    bookings: number;
    services: number;
    reviews: number;
    blog: number;
    messages: number;
  };
  onLogout: () => void;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  counts,
  onLogout,
}: SidebarProps) {
  const navGroups = [
    {
      group: "Operations",
      items: [
        { id: "overview" as AdminTab, label: "Overview", icon: LayoutDashboard, count: null },
        { id: "bookings" as AdminTab, label: "Bookings", icon: CalendarCheck, count: counts.bookings },
      ],
    },
    {
      group: "Catalog and content",
      items: [
        { id: "services" as AdminTab, label: "Services", icon: Sparkles, count: counts.services },
        { id: "reviews" as AdminTab, label: "Reviews", icon: Star, count: counts.reviews },
        { id: "blog" as AdminTab, label: "Articles and blog", icon: FileText, count: counts.blog },
        { id: "messages" as AdminTab, label: "Client notes", icon: Mail, count: counts.messages },
      ],
    },
  ];

  return (
    <>
      {/* Desktop & Tablet Sidebar (232px sticky full-height) */}
      <aside
        className="hidden md:flex w-[232px] shrink-0 sticky top-0 h-screen bg-[#0e1512] text-[#b7c2bc] flex-col justify-between border-r border-[#1a2520] select-none z-30"
        aria-label="Admin sidebar navigation"
      >
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Brand block */}
          <div className="p-5 pb-4 border-b border-[#1b2a23]/60">
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-[10px] bg-[#0f6b54] text-white flex items-center justify-center font-bold text-[13px] tracking-tight shrink-0"
                aria-hidden="true"
              >
                PC
              </div>
              <div className="min-w-0">
                <div className="text-[15px] font-bold text-white tracking-tight leading-tight">
                  Plan C
                </div>
                <div className="text-[12px] text-[#7d8f86] font-normal truncate">
                  Thiruvananthapuram
                </div>
              </div>
            </div>
          </div>

          {/* Nav groups */}
          <nav className="p-3 space-y-6 flex-1" aria-label="Main menu">
            {navGroups.map((group) => (
              <div key={group.group} className="space-y-1">
                <div className="px-3 py-1 text-[12px] font-medium text-[#7d8f86]">
                  {group.group}
                </div>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onTabChange(item.id)}
                        aria-current={isActive ? "page" : undefined}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-[8px] text-[13.5px] font-medium transition-colors cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f6b54] ${
                          isActive
                            ? "bg-[#1b2a23] text-white font-semibold"
                            : "text-[#b7c2bc] hover:text-white hover:bg-[#14201a]"
                        }`}
                      >
                        <span className="flex items-center gap-2.5 min-w-0">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-[#3fbf97]" : "text-[#7d8f86]"}`} />
                          <span className="truncate">{item.label}</span>
                        </span>
                        {item.count !== null && (
                          <span
                            className={`text-[11px] px-1.5 py-0.2 rounded font-normal ${
                              isActive
                                ? "bg-[#253930] text-white"
                                : "bg-[#14201a] text-[#7d8f86]"
                            }`}
                          >
                            {item.count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer block */}
          <div className="p-3 border-t border-[#1b2a23]/60 space-y-0.5">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-between px-3 py-2 rounded-[8px] text-[13px] text-[#b7c2bc] hover:text-white hover:bg-[#14201a] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0f6b54]"
            >
              <span>Public website</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#7d8f86]" />
            </Link>

            <button
              type="button"
              onClick={onLogout}
              className="flex w-full items-center gap-2 px-3 py-2 rounded-[8px] text-[13px] text-[#b7c2bc] hover:text-[#f87171] hover:bg-[#1f1618] transition-colors cursor-pointer text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f87171]"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock / sign out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Horizontal Top Navigation (At 760px or below) */}
      <nav
        className="md:hidden bg-[#0e1512] text-[#b7c2bc] border-b border-[#1a2520] sticky top-0 z-30 overflow-x-auto scrollbar-none"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1b2a23]/60">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-[8px] bg-[#0f6b54] text-white flex items-center justify-center font-bold text-[12px]">
              PC
            </div>
            <div>
              <span className="text-[13px] font-bold text-white leading-tight">Plan C Ops</span>
              <span className="text-[11px] text-[#7d8f86] ml-1.5">Trivandrum</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="text-[11.5px] text-[#b7c2bc] hover:text-[#f87171] flex items-center gap-1.5 px-2 py-1"
          >
            <LogOut className="w-3 h-3" />
            <span>Sign out</span>
          </button>
        </div>

        {/* Scrollable tabs list */}
        <div className="flex items-center gap-1 px-3 py-1.5 overflow-x-auto whitespace-nowrap">
          {navGroups.flatMap((g) => g.items).map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                aria-current={isActive ? "page" : undefined}
                className={`px-3 py-1.5 rounded-[6px] text-[12.5px] font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#1b2a23] text-white font-semibold"
                    : "text-[#b7c2bc] hover:text-white"
                }`}
              >
                <span>{item.label}</span>
                {item.count !== null && (
                  <span className="text-[10.5px] opacity-75">({item.count})</span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}

