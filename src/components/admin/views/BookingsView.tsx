"use client";

import { useState, useMemo } from "react";
import {
  Plus,
  Search,
  Calendar,
  ChevronRight,
  Eye,
  ArrowRight,
} from "lucide-react";
import { useOpsHub } from "@/context/OpsHubContext";
import { BookingStatusType } from "@/types/opsHub";

interface BookingsViewProps {
  onNewBookingClick?: () => void;
  onOpenBookingDetail?: (bookingId: string) => void;
}

export default function BookingsView({
  onNewBookingClick,
  onOpenBookingDetail,
}: BookingsViewProps) {
  const { bookings, customers, services, updateBookingStatus } = useOpsHub();
  const [activeTab, setActiveTab] = useState<"All" | "Upcoming" | "Completed" | "Cancelled">("All");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      // Tab filter
      if (activeTab === "Upcoming" && (b.status === "Completed" || b.status === "Cancelled")) return false;
      if (activeTab === "Completed" && b.status !== "Completed") return false;
      if (activeTab === "Cancelled" && b.status !== "Cancelled") return false;

      // Dropdown filter
      if (statusFilter !== "All" && b.status !== statusFilter) return false;

      // Search filter
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      const cust = customers.find((c) => c.id === b.customerId)?.name.toLowerCase() || b.customerName?.toLowerCase() || "";
      const svc = services.find((s) => s.id === b.serviceId)?.name.toLowerCase() || b.serviceName?.toLowerCase() || "";
      return b.id.toLowerCase().includes(q) || cust.includes(q) || svc.includes(q) || b.address.toLowerCase().includes(q);
    });
  }, [bookings, activeTab, statusFilter, search, customers, services]);

  const getStatusPill = (status: BookingStatusType) => {
    switch (status) {
      case "Completed":
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold bg-[#E7F8F0] text-[#12B76A]">Completed</span>;
      case "In Progress":
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold bg-[#EFF8FF] text-[#3B82F6]">In Progress</span>;
      case "Confirmed":
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold bg-[#E7F8F0] text-[#12B76A]">Confirmed</span>;
      case "Pending":
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold bg-[#FFF4E5] text-[#F79009]">Pending</span>;
      case "Cancelled":
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold bg-[#FEE4E2] text-[#F04438]">Cancelled</span>;
      default:
        return <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold bg-gray-100 text-gray-700">{status}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] md:text-[28px] font-bold text-[#0F1535] tracking-tight">Bookings</h1>
          <p className="text-[14px] text-[#6B7280] mt-0.5">Manage customer cleaning appointments, schedules &amp; dispatch</p>
        </div>
        <button
          type="button"
          onClick={onNewBookingClick}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[10px] bg-[#12B76A] hover:bg-[#0EA05C] text-white text-[14px] font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Booking</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-[#EEF0F6] rounded-[20px] p-6 shadow-[0_4px_24px_rgba(91,91,240,0.06)] space-y-5">
        {/* Top Controls: Tabs + Search + Filter */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#F6F7FD] border border-[#EEF0F6] w-fit">
            {(["All", "Upcoming", "Completed", "Cancelled"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-lg text-[13px] font-semibold transition-all cursor-pointer ${
                  activeTab === tab
                    ? "bg-[#5B5BF0] text-white shadow-xs"
                    : "text-[#6B7280] hover:text-[#0F1535]"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search + Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative min-w-[240px]">
              <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search bookings..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl bg-[#F6F7FD] border border-[#EEF0F6] text-[13px] text-[#0F1535] placeholder:text-[#9CA3AF] outline-none focus:border-[#5B5BF0] focus:bg-white focus:ring-2 focus:ring-[#5B5BF0]/10 transition-all w-full"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-[#F6F7FD] border border-[#EEF0F6] text-[13px] text-[#0F1535] outline-none focus:border-[#5B5BF0] cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Confirmed">Confirmed</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="overflow-x-auto rounded-xl border border-[#EEF0F6]">
          <table className="w-full text-left border-collapse min-w-[760px]">
            <thead>
              <tr className="bg-[#F8F9FC] text-[#6B7280] text-[12.5px] font-semibold border-b border-[#EEF0F6]">
                <th className="py-3.5 px-4 font-semibold">Booking ID</th>
                <th className="py-3.5 px-4 font-semibold">Customer</th>
                <th className="py-3.5 px-4 font-semibold">Service</th>
                <th className="py-3.5 px-4 font-semibold">Date &amp; Time</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Price / Order Value</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF0F6]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-[#6B7280] text-[14px]">
                    No bookings found matching your filters.
                  </td>
                </tr>
              ) : (
                filtered.map((b) => {
                  const customer = customers.find((c) => c.id === b.customerId);
                  const service = services.find((s) => s.id === b.serviceId);
                  const hasPrice = Number(b.amount) > 0;

                  return (
                    <tr
                      key={b.id}
                      onClick={() => onOpenBookingDetail?.(b.id)}
                      className="hover:bg-[#F6F7FD]/70 transition-colors cursor-pointer group"
                    >
                      <td className="py-4 px-4 font-mono text-[13px] font-semibold text-[#5B5BF0]">
                        {b.id}
                      </td>
                      <td className="py-4 px-4 font-semibold text-[#0F1535] text-[14px]">
                        {customer?.name || b.customerName || "Customer"}
                      </td>
                      <td className="py-4 px-4 text-[#6B7280] text-[13.5px]">
                        {service?.name || b.serviceName || "Service"}
                      </td>
                      <td className="py-4 px-4 text-[#6B7280] text-[13px] font-mono">
                        {b.date} · {b.time}
                      </td>
                      <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={b.status}
                          onChange={(e) => {
                            updateBookingStatus(b.id, e.target.value as BookingStatusType);
                          }}
                          className="px-2.5 py-1 rounded-full text-[12px] font-semibold border border-transparent outline-none cursor-pointer bg-[#F6F7FD] text-[#0F1535] focus:border-[#5B5BF0]"
                        >
                          <option value="Confirmed">Confirmed</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                          <option value="Pending">Pending</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-4 px-4">
                        {hasPrice ? (
                          <span className="font-bold text-[#0F1535] text-[14px]">
                            ₹{Number(b.amount).toLocaleString("en-IN")}
                          </span>
                        ) : (
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#FFF4E5] text-[#F79009]">
                            Pending Quote
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => onOpenBookingDetail?.(b.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#EEF0FF] hover:bg-[#E0E4FF] text-[#5B5BF0] text-[12px] font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>Manage</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination / Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-[13px] text-[#6B7280]">
          <span>Showing 1-{filtered.length} of {filtered.length} entries</span>
          <div className="flex items-center gap-1.5">
            <button className="px-3 py-1.5 rounded-lg border border-[#EEF0F6] bg-white text-[#6B7280] hover:bg-[#F6F7FD] disabled:opacity-50">
              Previous
            </button>
            <button className="w-8 h-8 rounded-lg bg-[#5B5BF0] text-white font-bold flex items-center justify-center shadow-xs">
              1
            </button>
            <button className="px-3 py-1.5 rounded-lg border border-[#EEF0F6] bg-white text-[#0F1535] hover:bg-[#F6F7FD]">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
