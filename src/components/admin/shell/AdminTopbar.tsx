"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, ChevronRight, ExternalLink, Calendar, Star, MessageSquare } from "lucide-react";
import { AdminTab } from "@/types/admin";

export type NotificationType = "booking" | "review" | "note";

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  time: string;
  description: string;
  read: boolean;
  targetTab: AdminTab;
  filter?: string;
}

const TAB_LABELS: Record<AdminTab, string> = {
  overview: "Overview",
  bookings: "Bookings",
  services: "Services",
  reviews: "Reviews",
  blog: "Articles and blog",
  messages: "Client notes",
};

function getTodayLabel() {
  return new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface AdminTopbarProps {
  activeTab: AdminTab;
  pendingCount: number;
  onNavigateTab?: (tab: AdminTab, filter?: string) => void;
  onNavigateToBookings?: (filter: string) => void;
}

export default function AdminTopbar({
  activeTab,
  pendingCount,
  onNavigateTab,
  onNavigateToBookings,
}: AdminTopbarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "notif-1",
      type: "booking",
      title: "New booking PC-8421 received",
      time: "10m ago",
      description: "Full home deep cleaning requested in Pattom, Trivandrum.",
      read: false,
      targetTab: "bookings",
      filter: "Pending",
    },
    {
      id: "notif-2",
      type: "review",
      title: "New customer review pending",
      time: "35m ago",
      description: "5-star review submitted for Sofa Shampooing in Kazhakkoottam.",
      read: false,
      targetTab: "reviews",
    },
    {
      id: "notif-3",
      type: "note",
      title: "New client note logged",
      time: "1h ago",
      description: "Special request for balcony glass tracks cleaning on booking PC-8419.",
      read: false,
      targetTab: "messages",
    },
  ]);

  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    }
    if (showNotifications) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showNotifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleNotificationClick = (notif: NotificationItem) => {
    // mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n))
    );
    setShowNotifications(false);

    if (onNavigateTab) {
      onNavigateTab(notif.targetTab, notif.filter);
    } else if (notif.targetTab === "bookings" && onNavigateToBookings) {
      onNavigateToBookings(notif.filter || "all");
    }
  };

  const todayLabel = getTodayLabel();
  const pageLabel = TAB_LABELS[activeTab];

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case "booking":
        return <Calendar className="w-3.5 h-3.5 text-[#3fbf97]" />;
      case "review":
        return <Star className="w-3.5 h-3.5 text-[#fbbf24]" />;
      case "note":
        return <MessageSquare className="w-3.5 h-3.5 text-[#38bdf8]" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4 border-b border-[#e3e8e5] bg-white px-6 py-5 md:px-8 md:py-6">
      {/* Breadcrumb row: Dashboard > Page | Online + 🔔 */}
      <div className="flex items-center justify-between gap-4">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-1.5 text-[13px]"
        >
          <span className="text-[#7b8982] font-medium">Dashboard</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#aeb9b3]" />
          <span className="text-[#12201b] font-semibold">{pageLabel}</span>
        </nav>

        <div className="flex items-center gap-2.5">
          {/* Online status pill */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#eaf6f0] border border-[#c8e7d8] text-[12px] font-medium text-[#176b50]"
            title="Dashboard connected"
          >
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3fbf97] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3fbf97]" />
            </span>
            <span>Online</span>
          </div>

          {/* Notification bell */}
          <div className="relative" ref={popoverRef}>
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              aria-label={`View notifications (${unreadCount} unread)`}
              aria-expanded={showNotifications}
              className="relative p-2 rounded-[10px] bg-white border border-[#e3e8e5] text-[#66756d] hover:text-[#12201b] hover:bg-[#f6f8f7] transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0f6b54]"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[#0f6b54] text-white text-[10px] font-bold flex items-center justify-center leading-none">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-[14px] bg-white border border-[#e3e8e5] shadow-xl z-50 overflow-hidden animate-in fade-in duration-150">
                <div className="p-3.5 border-b border-[#e3e8e5] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[13.5px] font-bold text-[#12201b]">
                      Notifications
                    </span>
                    {unreadCount > 0 && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#e3f2ec] text-[#0f6b54]">
                        {unreadCount} new
                      </span>
                    )}
                  </div>
                  {unreadCount > 0 && (
                    <button
                      type="button"
                      onClick={markAllAsRead}
                      className="text-[11.5px] font-medium text-[#0f6b54] hover:underline"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="divide-y divide-[#e9eeeb] max-h-80 overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-3.5 text-[12.5px] space-y-2 transition-colors ${
                        notif.read ? "opacity-60 hover:opacity-100" : "bg-[#f7faf8]"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          {getTypeIcon(notif.type)}
                          <span className="font-semibold text-[#12201b] truncate">
                            {notif.title}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#7b8982] font-mono shrink-0">
                          {notif.time}
                        </span>
                      </div>
                      <p className="text-[#5d6b65] text-[12px] leading-relaxed">
                        {notif.description}
                      </p>
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => handleNotificationClick(notif)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-[6px] bg-[#e3f2ec] hover:bg-[#d5ebdf] text-[#0f6b54] text-[11.5px] font-medium transition-colors cursor-pointer"
                        >
                          <span>View {notif.type}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-2.5 bg-[#f7faf8] border-t border-[#e3e8e5] text-center text-[11px] text-[#7b8982]">
                  Real-time operational alerts from Thrikannapuram Hub
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {activeTab === "overview" && (
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-4">
          <div className="bg-white border border-[#e3e8e5] rounded-[14px] p-5 shadow-sm">
            <div className="text-[12px] font-semibold tracking-wider uppercase text-[#0f6b54] mb-1">
              {pageLabel}
            </div>
            <h1 className="text-[20px] font-bold text-[#12201b] leading-tight">
              Welcome, Admin 👋
            </h1>
            <p className="text-[13.5px] text-[#5d6b65] mt-1.5 leading-relaxed">
              Here&apos;s what&apos;s happening at Plan C today.
              {pendingCount > 0 ? (
                <>
                  {" "}You have{" "}
                  <button
                    type="button"
                    onClick={() =>
                      onNavigateTab
                        ? onNavigateTab("bookings", "Pending")
                        : onNavigateToBookings?.("Pending")
                    }
                    className="text-[#0f6b54] font-semibold hover:underline focus:outline-none focus-visible:underline"
                  >
                    {pendingCount} booking
                    {pendingCount !== 1 ? "s" : ""} pending dispatch
                  </button>
                  .
                </>
              ) : (
                " No bookings are pending dispatch right now."
              )}
            </p>
            <blockquote className="mt-4 border-l-2 border-[#0f6b54] pl-3 text-[12.5px] italic leading-relaxed text-[#66756d]">
              “A cleaner space creates room for a clearer mind.”
            </blockquote>
          </div>

          <div className="bg-white border border-[#e3e8e5] rounded-[14px] p-5 flex flex-col justify-center min-w-[200px] shadow-sm">
            <div className="text-[15px] font-semibold text-[#12201b] leading-tight">
              {todayLabel}
            </div>
            <div className="text-[13px] text-[#5d6b65] mt-1">
              Thrikannapuram, Trivandrum
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
