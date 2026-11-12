"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Bell, ChevronRight, ExternalLink, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useOpsHub } from "@/context/OpsHubContext";

interface AdminTopbarProps {
  activeTab: string;
  pendingCount: number;
  onNavigateTab?: (tab: string, filter?: string) => void;
  onSearchChange?: (query: string) => void;
  searchQuery?: string;
  onLogout?: () => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

const TAB_LABEL_MAP: Record<string, string> = {
  overview: "Dashboard",
  bookings: "Bookings",
  "booking-detail": "Booking Details",
  "add-booking": "New Booking",
  customers: "Customers",
  "customer-detail": "Customer Profile",
  services: "Services",
  reviews: "Reviews",
  blog: "Articles and blog",
  articles: "Articles and blog",
  messages: "Client notes",
  "client-notes": "Client notes",
  payments: "Payments",
  reports: "Reports",
  settings: "Settings",
  notifications: "Notifications",
};

export default function AdminTopbar({
  activeTab,
  pendingCount,
  onNavigateTab,
  onSearchChange,
  searchQuery = "",
  onLogout,
  isSidebarCollapsed,
  onToggleSidebar,
}: AdminTopbarProps) {
  const { bookings, customers, services, notifications, markNotificationAsRead, markAllNotificationsAsRead } = useOpsHub();
  const [showNotifications, setShowNotifications] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const q = localQuery.trim().toLowerCase();
  const matchedBookings = q
    ? bookings.filter(
        (b) =>
          b.id.toLowerCase().includes(q) ||
          b.address.toLowerCase().includes(q) ||
          (b.customerName || "").toLowerCase().includes(q) ||
          (b.serviceName || "").toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const matchedCustomers = q
    ? customers.filter(
        (c) =>
          c.name.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.address.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const matchedServices = q
    ? services.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.category.toLowerCase().includes(q)
      ).slice(0, 3)
    : [];

  const hasSearchResults =
    q.length > 0 &&
    (matchedBookings.length > 0 || matchedCustomers.length > 0 || matchedServices.length > 0);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (notifId: string, type: string) => {
    markNotificationAsRead(notifId);
    setShowNotifications(false);

    if (type === "booking") {
      onNavigateTab?.("bookings");
    } else if (type === "customer") {
      onNavigateTab?.("customers");
    } else if (type === "payment") {
      onNavigateTab?.("payments");
    } else {
      onNavigateTab?.("notifications");
    }
  };

  const currentSectionLabel = TAB_LABEL_MAP[activeTab] || "Overview";
  const isDashboardRoot = activeTab === "overview";

  return (
    <header className="border-b border-[#EEF0F6] bg-white px-6 py-3.5 md:px-8 sticky top-0 z-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 mx-auto">
        {/* Left: Sidebar Toggle Button + Functional Breadcrumbs navigation */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              type="button"
              onClick={onToggleSidebar}
              title={isSidebarCollapsed ? "Expand sidebar" : "Minimize sidebar"}
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Minimize sidebar"}
              className="hidden min-[821px]:flex items-center justify-center w-8 h-8 rounded-xl bg-[#F6F7FD] hover:bg-[#EEF0FF] text-[#6B7280] hover:text-[#5B5BF0] border border-[#EEF0F6] transition-colors cursor-pointer"
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="w-4 h-4" />
              ) : (
                <PanelLeftClose className="w-4 h-4" />
              )}
            </button>
          )}

          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-[13.5px]">
          <button
            type="button"
            onClick={() => onNavigateTab?.("overview")}
            className={`font-semibold transition-colors cursor-pointer ${
              isDashboardRoot
                ? "text-[#5B5BF0] font-bold"
                : "text-[#6B7280] hover:text-[#0F1535]"
            }`}
          >
            Dashboard
          </button>

          {!isDashboardRoot && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
              {activeTab === "booking-detail" ? (
                <>
                  <button
                    type="button"
                    onClick={() => onNavigateTab?.("bookings")}
                    className="font-medium text-[#6B7280] hover:text-[#0F1535] transition-colors cursor-pointer"
                  >
                    Bookings
                  </button>
                  <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
                  <span className="font-bold text-[#0F1535]">{currentSectionLabel}</span>
                </>
              ) : activeTab === "customer-detail" ? (
                <>
                  <button
                    type="button"
                    onClick={() => onNavigateTab?.("customers")}
                    className="font-medium text-[#6B7280] hover:text-[#0F1535] transition-colors cursor-pointer"
                  >
                    Customers
                  </button>
                  <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
                  <span className="font-bold text-[#0F1535]">{currentSectionLabel}</span>
                </>
              ) : activeTab === "add-booking" ? (
                <>
                  <button
                    type="button"
                    onClick={() => onNavigateTab?.("bookings")}
                    className="font-medium text-[#6B7280] hover:text-[#0F1535] transition-colors cursor-pointer"
                  >
                    Bookings
                  </button>
                  <ChevronRight className="w-3.5 h-3.5 text-[#9CA3AF] shrink-0" />
                  <span className="font-bold text-[#0F1535]">New Booking</span>
                </>
              ) : (
                <span className="font-bold text-[#0F1535]">{currentSectionLabel}</span>
              )}
            </>
          )}
        </nav>
      </div>

      {/* Center / Right controls */}
        <div className="flex items-center gap-3 sm:gap-4 justify-between sm:justify-end flex-1 sm:flex-initial">
          {/* Rounded pill search bar with live dropdown */}
          <div className="flex-1 sm:w-72 md:w-80 relative" ref={searchRef}>
            <div className="relative">
              <Search
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]"
                aria-hidden="true"
              />
              <input
                type="search"
                value={localQuery}
                onFocus={() => setShowSearchDropdown(true)}
                onChange={(e) => {
                  setLocalQuery(e.target.value);
                  setShowSearchDropdown(true);
                  onSearchChange?.(e.target.value);
                }}
                placeholder="Search bookings, customers..."
                className="w-full h-10 pl-10 pr-4 rounded-full bg-[#F6F7FD] border border-transparent text-[13px] text-[#0F1535] outline-none focus:border-[#5B5BF0] focus:bg-white focus:ring-2 focus:ring-[#5B5BF0]/15 transition-all placeholder:text-[#9CA3AF] font-sans"
                aria-label="Search bookings, customers"
              />
            </div>

            {/* Live Search Results Dropdown */}
            {showSearchDropdown && q.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white text-[#0F1535] border border-[#EEF0F6] rounded-[20px] shadow-[0_12px_36px_rgba(91,91,240,0.12)] z-50 overflow-hidden divide-y divide-[#EEF0F6] animate-in fade-in zoom-in-95 duration-150">
                {!hasSearchResults ? (
                  <div className="p-4 text-center text-[#6B7280] text-[13px]">
                    No matching bookings, customers or services found for &ldquo;{localQuery}&rdquo;.
                  </div>
                ) : (
                  <>
                    {/* Matched Bookings */}
                    {matchedBookings.length > 0 && (
                      <div className="p-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF] px-2 block mb-1.5">
                          Bookings
                        </span>
                        <div className="space-y-1">
                          {matchedBookings.map((b) => (
                            <button
                              key={b.id}
                              type="button"
                              onClick={() => {
                                onNavigateTab?.("bookings", b.id);
                                setShowSearchDropdown(false);
                                setLocalQuery("");
                              }}
                              className="w-full text-left p-2 rounded-xl hover:bg-[#F6F7FD] transition-colors flex items-center justify-between cursor-pointer group"
                            >
                              <div>
                                <div className="font-bold text-[13.5px] text-[#5B5BF0]">
                                  {b.id}
                                </div>
                                <div className="text-[12px] text-[#6B7280]">
                                  {b.customerName || "Customer"} · {b.serviceName || "Service"}
                                </div>
                              </div>
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#E7F8F0] text-[#12B76A]">
                                {b.status}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Matched Customers */}
                    {matchedCustomers.length > 0 && (
                      <div className="p-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF] px-2 block mb-1.5">
                          Customers
                        </span>
                        <div className="space-y-1">
                          {matchedCustomers.map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => {
                                onNavigateTab?.("customers", c.id);
                                setShowSearchDropdown(false);
                                setLocalQuery("");
                              }}
                              className="w-full text-left p-2 rounded-xl hover:bg-[#F6F7FD] transition-colors flex items-center justify-between cursor-pointer group"
                            >
                              <div>
                                <div className="font-bold text-[13.5px] text-[#0F1535]">
                                  {c.name}
                                </div>
                                <div className="text-[12px] text-[#6B7280]">
                                  {c.phone} · {c.district || c.address}
                                </div>
                              </div>
                              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EFF8FF] text-[#3B82F6]">
                                {c.status}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Matched Services */}
                    {matchedServices.length > 0 && (
                      <div className="p-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF] px-2 block mb-1.5">
                          Services
                        </span>
                        <div className="space-y-1">
                          {matchedServices.map((s) => (
                            <button
                              key={s.id}
                              type="button"
                              onClick={() => {
                                onNavigateTab?.("services", s.id);
                                setShowSearchDropdown(false);
                                setLocalQuery("");
                              }}
                              className="w-full text-left p-2 rounded-xl hover:bg-[#F6F7FD] transition-colors flex items-center justify-between cursor-pointer group"
                            >
                              <div className="font-bold text-[13.5px] text-[#0F1535]">
                                {s.name}
                              </div>
                              <span className="text-[11px] font-semibold text-[#6B7280]">
                                {s.category}
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Right Group: Online Status Badge + Notification Bell (Profile removed as requested) */}
          <div className="flex items-center gap-3">
            {/* Functional Online Status Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#ECFDF3] border border-[#A6F4C5] text-[#027A48] select-none"
              title="System Online & Synchronized"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#12B76A] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#12B76A]" />
              </span>
              <span className="text-[12px] font-bold tracking-tight">Online</span>
            </div>

            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setShowNotifications(!showNotifications)}
                aria-label="View notifications"
                className="relative w-9 h-9 rounded-full bg-[#F6F7FD] text-[#0F1535] hover:bg-[#EEF0FF] hover:text-[#5B5BF0] flex items-center justify-center transition-colors cursor-pointer border border-[#EEF0F6]"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span
                    className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#EF4444] ring-2 ring-white"
                    aria-hidden="true"
                  />
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-[320px] sm:w-[360px] bg-white text-[#0F1535] border border-[#EEF0F6] rounded-[20px] shadow-[0_12px_36px_rgba(91,91,240,0.12)] z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-5 py-3.5 bg-[#F8F9FC] border-b border-[#EEF0F6] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-bold text-[#0F1535]">
                        Notifications
                      </span>
                      {unreadCount > 0 && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EEF0FF] text-[#5B5BF0]">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        type="button"
                        onClick={() => markAllNotificationsAsRead()}
                        className="text-[12px] font-semibold text-[#5B5BF0] hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="divide-y divide-[#EEF0F6] max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-[#6B7280] text-[13px]">
                        No notifications available.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 text-[13px] space-y-2 transition-colors ${
                            notif.read ? "opacity-60 hover:opacity-100" : "bg-[#F8F9FC]/80"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-semibold text-[#0F1535] truncate">
                              {notif.message}
                            </span>
                            <span className="text-[11px] text-[#9CA3AF] shrink-0 font-mono">
                              {notif.createdAt}
                            </span>
                          </div>
                          <div className="flex justify-end pt-1">
                            <button
                              type="button"
                              onClick={() => handleNotificationClick(notif.id, notif.type)}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#EEF0FF] hover:bg-[#E0E4FF] text-[#5B5BF0] text-[12px] font-bold transition-colors cursor-pointer"
                            >
                              <span>
                                View {notif.type === "booking" ? "booking" : notif.type === "payment" ? "invoice" : "details"}
                              </span>
                              <ExternalLink className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
