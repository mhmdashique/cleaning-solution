"use client";

import { useState } from "react";
import { Bell, Calendar, CreditCard, UserPlus, Sparkles, Check, Trash2, Plus, X, Star, MessageSquare } from "lucide-react";
import { useOpsHub } from "@/context/OpsHubContext";

export default function NotificationsView() {
  const { notifications, markNotificationAsRead, markAllNotificationsAsRead, deleteNotification } = useOpsHub();
  const [tab, setTab] = useState<"All" | "Unread" | "Read">("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newType, setNewType] = useState<"booking" | "payment" | "customer" | "service">("booking");
  const [newMessage, setNewMessage] = useState("");

  const unreadCount = notifications.filter((n) => !n.read).length;
  const readCount = notifications.filter((n) => n.read).length;

  const filtered = notifications.filter((n) => {
    if (tab === "Unread") return !n.read;
    if (tab === "Read") return n.read;
    return true;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "booking":
        return { icon: Calendar, bg: "bg-[#EFF8FF]", color: "text-[#3B82F6]" };
      case "payment":
        return { icon: CreditCard, bg: "bg-[#ECFDF3]", color: "text-[#12B76A]" };
      case "customer":
        return { icon: UserPlus, bg: "bg-[#F5F3FF]", color: "text-[#8B5CF6]" };
      case "review":
        return { icon: Star, bg: "bg-[#FFF4E5]", color: "text-[#F79009]" };
      case "service":
        return { icon: MessageSquare, bg: "bg-[#F0F9FF]", color: "text-[#0EA5E9]" };
      default:
        return { icon: Sparkles, bg: "bg-[#FFF4E5]", color: "text-[#F79009]" };
    }
  };

  const handleAddNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Inject into localStorage (manual notification via OpsHub state isn't directly exposed,
    // so we use a workaround: read localStorage, add item, write back, reload notifications)
    try {
      const stored = localStorage.getItem("planc_opshub_state_v1");
      const data = stored ? JSON.parse(stored) : {};
      const existingNotifs: Array<Record<string, unknown>> = Array.isArray(data.notifications) ? data.notifications : [];
      const newNotif = {
        id: `N-MAN-${Date.now()}`,
        type: newType,
        message: newMessage.trim(),
        read: false,
        createdAt: "Just now",
      };
      data.notifications = [newNotif, ...existingNotifs];
      localStorage.setItem("planc_opshub_state_v1", JSON.stringify(data));
      window.location.reload(); // reload to pick up the new notification
    } catch (err) {
      console.error("Failed to add notification", err);
    }

    setNewMessage("");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] md:text-[28px] font-bold text-[#0F1535] tracking-tight">Notifications</h1>
          <p className="text-[14px] text-[#6B7280] mt-0.5">Real-time alerts, booking events and customer activities</p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Add Notification Button */}
          <button
            type="button"
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[10px] bg-[#5B5BF0] hover:bg-[#4E4EE0] text-white text-[13.5px] font-semibold transition-all cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Add Notification</span>
          </button>

          {/* Tabs & Mark All Read */}
          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllNotificationsAsRead}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg border border-[#EEF0F6] bg-white hover:bg-[#F6F7FD] text-[13px] font-semibold text-[#12B76A] transition-colors cursor-pointer shadow-xs"
            >
              <Check className="w-4 h-4" />
              <span>Mark all read</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-[#EEF0F6] shadow-xs">
            <button
              type="button"
              onClick={() => setTab("All")}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
                tab === "All" ? "bg-[#5B5BF0] text-white shadow-xs" : "text-[#6B7280] hover:text-[#0F1535]"
              }`}
            >
              All ({notifications.length})
            </button>
            <button
              type="button"
              onClick={() => setTab("Unread")}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
                tab === "Unread" ? "bg-[#5B5BF0] text-white shadow-xs" : "text-[#6B7280] hover:text-[#0F1535]"
              }`}
            >
              Unread ({unreadCount})
            </button>
            <button
              type="button"
              onClick={() => setTab("Read")}
              className={`px-3.5 py-1.5 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
                tab === "Read" ? "bg-[#5B5BF0] text-white shadow-xs" : "text-[#6B7280] hover:text-[#0F1535]"
              }`}
            >
              Read ({readCount})
            </button>
          </div>
        </div>
      </div>

      {/* Main Notifications List */}
      <div className="bg-white border border-[#EEF0F6] rounded-[20px] p-6 shadow-[0_4px_24px_rgba(91,91,240,0.06)] divide-y divide-[#EEF0F6]">
        {filtered.length === 0 ? (
          <div className="py-12 text-center space-y-3">
            <Bell className="w-10 h-10 text-[#EEF0F6] mx-auto" />
            <p className="text-[#6B7280] text-[14px]">No notifications in this tab.</p>
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#5B5BF0] text-white text-[13px] font-semibold cursor-pointer hover:bg-[#4E4EE0] transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add a notification
            </button>
          </div>
        ) : (
          filtered.map((item) => {
            const { icon: Icon, bg, color } = getIcon(item.type);
            return (
              <div
                key={item.id}
                className={`flex items-center justify-between py-4 px-2 transition-colors rounded-xl ${
                  !item.read ? "bg-[#F8FAF9]/80" : "hover:bg-[#F6F7FD]/60"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl ${bg} ${color} flex items-center justify-center shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`text-[14px] ${!item.read ? "font-bold text-[#0F1535]" : "font-medium text-[#4B5563]"}`}>
                        {item.message}
                      </span>
                      {!item.read && (
                        <span className="w-2 h-2 rounded-full bg-[#12B76A]" />
                      )}
                    </div>
                    <span className="text-[12px] text-[#9CA3AF] mt-0.5 block capitalize">{item.type} · {item.createdAt}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {!item.read && (
                    <button
                      type="button"
                      onClick={() => markNotificationAsRead(item.id)}
                      className="px-2.5 py-1 rounded-lg text-[12px] font-semibold text-[#12B76A] hover:bg-[#E7F8F0] transition-colors cursor-pointer"
                    >
                      Mark read
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => deleteNotification(item.id)}
                    className="w-8 h-8 rounded-lg hover:bg-[#FEE4E2] text-[#6B7280] hover:text-[#F04438] inline-flex items-center justify-center transition-colors cursor-pointer"
                    title="Delete alert"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Notification Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#EEF0F6] rounded-[24px] p-6 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#EEF0F6] pb-3">
              <h2 className="text-[18px] font-bold text-[#0F1535]">Add Notification</h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-[#F6F7FD] hover:bg-[#EEF0FF] text-[#6B7280] hover:text-[#5B5BF0] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNotification} className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#0F1535] mb-1.5">
                  Notification Type
                </label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as typeof newType)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEF0F6] bg-[#F6F7FD] outline-none focus:bg-white focus:border-[#5B5BF0] text-[#0F1535] text-[14px]"
                >
                  <option value="booking">📅 New Booking</option>
                  <option value="customer">👤 New Customer</option>
                  <option value="service">⭐ New Review</option>
                  <option value="payment">💳 Payment Alert</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#0F1535] mb-1.5">
                  Message
                </label>
                <textarea
                  required
                  rows={3}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Enter the notification message..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEF0F6] bg-[#F6F7FD] outline-none focus:bg-white focus:border-[#5B5BF0] text-[#0F1535] text-[14px] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#EEF0F6] text-[#6B7280] font-semibold hover:bg-[#F6F7FD] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5B5BF0] hover:bg-[#4E4EE0] text-white font-semibold cursor-pointer"
                >
                  Add Notification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
