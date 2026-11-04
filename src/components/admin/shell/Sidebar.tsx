"use client";

import { AdminTab } from "@/types/admin";
import { 
  LayoutDashboard, 
  CalendarCheck, 
  Sparkles, 
  Star, 
  FileText, 
  Mail, 
  LogOut, 
  MapPin,
} from "lucide-react";

interface SidebarProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
  counts: {
    bookings: number;
    services: number;
    reviews: number;
    blog: number;
    unhandledNotes: number;
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
        { id: "messages" as AdminTab, label: "Client notes", icon: Mail, count: counts.unhandledNotes },
      ],
    },
  ];

  return (
    <>
      <aside
        className="hidden min-[821px]:flex w-[256px] shrink-0 sticky top-0 h-dvh bg-white text-[#5d6b65] flex-col justify-between select-none z-30 border-r border-[#e3e8e5]"
        aria-label="Admin navigation"
      >
        <div className="flex flex-col h-full overflow-y-auto">
          <div className="px-5 pt-6 pb-5 border-b border-[#e9eeeb]">
            <div className="flex items-center gap-3.5">
              <div 
                className="w-10 h-10 rounded-[13px] bg-gradient-to-br from-[#39b98b] to-[#0f6b54] text-white flex items-center justify-center font-extrabold text-[14px] tracking-[-0.06em] shadow-[0_6px_18px_rgba(15,107,84,0.28)] shrink-0"
                aria-hidden="true"
              >
                PC
              </div>
              <div className="min-w-0">
                <div className="text-[15px] font-bold text-[#12201b] tracking-[-0.02em] leading-tight">
                  Plan C
                </div>
                <div className="flex items-center gap-1 mt-1 text-[10px] text-[#7b8982] font-semibold tracking-[0.12em] uppercase">
                  <span>Operations hub</span>
                </div>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-2 rounded-xl border border-[#e3e8e5] bg-[#f7faf8] px-3 py-2.5">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-[#0f8a65]" aria-hidden="true" />
              <span className="min-w-0 truncate text-[11px] font-medium text-[#45564d]">
                Thiruvananthapuram
              </span>
              <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-[#22a879] shadow-[0_0_8px_rgba(34,168,121,0.4)]" aria-label="Online" />
            </div>
          </div>

          <nav className="px-3.5 py-6 space-y-7 flex-1" aria-label="Main menu">
            {navGroups.map((group) => (
              <div key={group.group} className="space-y-2">
                <div className="px-3 text-[10px] font-bold tracking-[0.14em] uppercase text-[#87938d]">
                  {group.group}
                </div>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => onTabChange(item.id)}
                        aria-current={isActive ? "page" : undefined}
                        className={`group relative w-full flex items-center justify-between px-3 py-[10px] rounded-xl text-[13px] transition-all duration-200 cursor-pointer text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0f8a65] focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
                          isActive
                            ? "bg-[#eaf6f0] text-[#124a38] font-semibold shadow-[inset_0_0_0_1px_rgba(15,107,84,0.14)]"
                            : "text-[#53635a] hover:text-[#12201b] hover:bg-[#f5f8f6]"
                        }`}
                      >
                        {isActive && (
                          <span className="absolute left-0 top-2.5 bottom-2.5 w-[3px] rounded-r-full bg-[#0f8a65]" aria-hidden="true" />
                        )}
                        <span className="flex items-center gap-2.5 min-w-0">
                          <Icon className={`w-[17px] h-[17px] shrink-0 transition-colors ${isActive ? "text-[#0f8a65]" : "text-[#7c8982] group-hover:text-[#3e5047]"}`} strokeWidth={1.8} />
                          <span className="truncate">{item.label}</span>
                        </span>
                        {item.count !== null && (
                          <span
                            className={`min-w-[24px] text-center text-[10px] px-1.5 py-1 rounded-md font-semibold tabular-nums ${
                              isActive
                                ? "bg-[#d5ebdf] text-[#176b50]"
                                : "bg-[#f0f3f1] text-[#78867e] group-hover:text-[#45564d]"
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

          <div className="flex items-center justify-between gap-3 px-4 py-4 border-t border-[#e9eeeb]">
            <div className="flex min-w-0 items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e3f2ec] text-[12px] font-bold text-[#0f6b54]">
                A
              </div>
              <div className="min-w-0">
                <div className="truncate text-[12px] font-semibold text-[#12201b]">Admin</div>
              </div>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="flex shrink-0 items-center gap-2 rounded-lg px-2.5 py-2 text-[11px] font-medium text-[#5d6b65] hover:text-[#b42318] hover:bg-[#fef2f2] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f87171]"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <nav
        className="min-[821px]:hidden bg-white border-b border-[#e3e8e5] sticky top-0 z-30"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#e9eeeb]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-[#39b98b] to-[#0f6b54] text-white flex items-center justify-center font-extrabold text-[12px] tracking-[-0.06em]">
              PC
            </div>
            <div className="min-w-0">
              <div className="text-[13px] font-bold leading-tight text-[#12201b]">Plan C</div>
              <div className="mt-0.5 flex items-center gap-1 text-[10px] text-[#7b8982]">
                <MapPin className="h-2.5 w-2.5 text-[#0f8a65]" aria-hidden="true" />
                <span className="truncate">Thiruvananthapuram</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="flex items-center gap-1.5 rounded-lg border border-[#e3e8e5] px-2.5 py-2 text-[11px] font-medium text-[#5d6b65] hover:border-[#f87171]/40 hover:text-[#b42318] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-2 overflow-x-auto whitespace-nowrap scrollbar-none">
          {navGroups.flatMap((g) => g.items).map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                aria-current={isActive ? "page" : undefined}
                className={`px-3 py-2 rounded-lg text-[11.5px] font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#eaf6f0] text-[#124a38] font-semibold shadow-[inset_0_0_0_1px_rgba(15,107,84,0.14)]"
                    : "text-[#53635a] hover:text-[#12201b] hover:bg-[#f5f8f6]"
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? "text-[#0f8a65]" : "text-[#7c8982]"}`} aria-hidden="true" />
                <span>{item.label}</span>
                {item.count !== null && (
                  <span className={`text-[10px] tabular-nums ${isActive ? "text-[#176b50]" : "text-[#78867e]"}`}>{item.count}</span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
