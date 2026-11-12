"use client";

import { ElementType } from "react";
import {
  LayoutDashboard,
  CalendarCheck,
  Users,
  SlidersHorizontal,
  CreditCard,
  BarChart3,
  Settings,
  Star,
  FileText,
  MessageSquare,
  LogOut,
} from "lucide-react";

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onLogout?: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: ElementType;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "bookings", label: "Bookings", icon: CalendarCheck },
  { id: "customers", label: "Customers", icon: Users },
  { id: "services", label: "Services", icon: SlidersHorizontal },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "blog", label: "Articles and blog", icon: FileText },
  { id: "messages", label: "Client notes", icon: MessageSquare },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "reports", label: "Reports", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ activeTab, onTabChange, onLogout }: SidebarProps) {
  return (
    <>
      {/* Desktop navigation: 260px, white, full height, fixed, subtle border */}
      <aside
        className="hidden min-[821px]:flex w-[260px] fixed inset-y-0 left-0 bg-white text-[#6B7280] flex-col justify-between select-none z-30 border-r border-[#EEF0F6] shadow-[1px_0_12px_rgba(15,21,53,0.02)]"
        aria-label="Admin navigation"
      >
        <div className="flex flex-col h-full overflow-y-auto scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {/* Logo & Brand Header */}
          <div className="px-6 pt-5 pb-4 border-b border-[#EEF0F6]">
            <div className="flex items-center gap-3">
              {/* Green/Blue "Z" style mark */}
              <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#3B82F6] via-[#12B76A] to-[#10B981] text-white flex items-center justify-center font-black text-[19px] tracking-tighter shadow-sm shrink-0">
                Z
              </div>
              <div className="min-w-0">
                <div className="text-[17px] font-bold text-[#0F1535] tracking-[-0.02em] leading-tight">
                  Plan C
                </div>
                <div className="mt-0.5 text-[11px] text-[#6B7280] font-medium tracking-tight">
                  Operations Hub
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="px-3 py-3 space-y-0.5 flex-1" aria-label="Main menu">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-[13.5px] transition-all duration-200 cursor-pointer text-left focus:outline-none ${
                    isActive
                      ? "bg-[#EEF0FF] text-[#5B5BF0] font-semibold shadow-xs"
                      : "text-[#6B7280] hover:text-[#0F1535] hover:bg-[#F6F7FD]"
                  }`}
                >
                  <Icon
                    className={`w-[18px] h-[18px] shrink-0 transition-colors ${
                      isActive ? "text-[#5B5BF0]" : "text-[#6B7280]"
                    }`}
                    strokeWidth={isActive ? 2.2 : 1.8}
                  />
                  <span className="truncate flex-1">{item.label}</span>
                  {item.badge !== undefined && (
                    <span className="min-w-[20px] h-5 px-1.5 rounded-full bg-[#EF4444] text-[11px] font-bold text-white flex items-center justify-center flex-shrink-0 leading-none">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom Area: Profile Badge & Logout Button */}
          <div className="px-4 py-4 border-t border-[#EEF0F6]">
            <div className="rounded-[16px] bg-[#F6F7FD] border border-[#EEF0F6] p-3.5 flex items-center justify-between gap-3 shadow-xs">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[#EEF0FF] text-[#5B5BF0] flex items-center justify-center font-bold text-[14px] shrink-0 shadow-xs ring-2 ring-[#5B5BF0]/15">
                  A
                </div>
                <div className="min-w-0">
                  <div className="text-[13.5px] font-bold text-[#0F1535] leading-tight truncate">
                    Admin
                  </div>
                  <div className="text-[11px] text-[#6B7280] leading-tight mt-0.5 truncate">
                    Operations
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onLogout?.()}
                title="Log out of admin session"
                aria-label="Logout"
                className="w-8 h-8 rounded-xl bg-white text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEE4E2]/50 border border-[#EEF0F6] flex items-center justify-center transition-all cursor-pointer shrink-0 shadow-2xs"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile navigation */}
      <nav
        className="min-[821px]:hidden bg-white border-b border-[#EEF0F6] sticky top-0 z-30"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#EEF0F6]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[10px] bg-gradient-to-br from-[#3B82F6] via-[#12B76A] to-[#10B981] text-white flex items-center justify-center font-black text-[14px]">
              Z
            </div>
            <div className="min-w-0">
              <div className="text-[14px] font-bold leading-tight text-[#0F1535]">
                Plan C
              </div>
              <div className="text-[10.5px] text-[#6B7280]">Operations Hub</div>
            </div>
          </div>

          {/* Mobile Profile & Logout */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F6F7FD] border border-[#EEF0F6]">
              <div className="w-5 h-5 rounded-full bg-[#EEF0FF] text-[#5B5BF0] flex items-center justify-center font-bold text-[10px]">
                A
              </div>
              <span className="text-[11.5px] font-semibold text-[#0F1535]">Admin</span>
            </div>
            <button
              type="button"
              onClick={() => onLogout?.()}
              aria-label="Logout"
              className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#EF4444] hover:bg-[#FEE4E2]/50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-2 overflow-x-auto whitespace-nowrap scrollbar-none">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onTabChange(item.id)}
                aria-current={isActive ? "page" : undefined}
                className={`px-3 py-2 rounded-xl text-[12px] font-medium transition-colors shrink-0 flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#EEF0FF] text-[#5B5BF0] font-semibold"
                    : "text-[#6B7280] hover:text-[#0F1535] hover:bg-[#F6F7FD]"
                }`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="w-4 h-4 rounded-full bg-[#EF4444] text-[9px] font-bold text-white flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
