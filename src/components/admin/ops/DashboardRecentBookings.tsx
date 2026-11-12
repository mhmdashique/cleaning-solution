"use client";

import { ChevronRight } from "lucide-react";

interface BookingRow {
  status: "Completed" | "In Progress" | "Pending" | "Confirmed" | "Cancelled";
  customer: string;
  service: string;
  when: string;
}

const STATUS_BADGES: Record<
  string,
  { bg: string; text: string; dot: string }
> = {
  Completed: {
    bg: "bg-[#ECFDF3]",
    text: "text-[#12B76A]",
    dot: "bg-[#12B76A]",
  },
  "In Progress": {
    bg: "bg-[#EFF8FF]",
    text: "text-[#3B82F6]",
    dot: "bg-[#3B82F6]",
  },
  Confirmed: {
    bg: "bg-[#F5F3FF]",
    text: "text-[#8B5CF6]",
    dot: "bg-[#8B5CF6]",
  },
  Pending: {
    bg: "bg-[#FFF8E6]",
    text: "text-[#F59E0B]",
    dot: "bg-[#F59E0B]",
  },
  Cancelled: {
    bg: "bg-[#FEF2F2]",
    text: "text-[#EF4444]",
    dot: "bg-[#EF4444]",
  },
};

interface DashboardRecentBookingsProps {
  bookings: BookingRow[];
  onViewAll?: () => void;
}

export default function DashboardRecentBookings({
  bookings,
  onViewAll,
}: DashboardRecentBookingsProps) {
  return (
    <div className="bg-white border border-[#EEF0F6] rounded-[20px] p-6 shadow-[0_2px_12px_rgba(15,21,53,0.03)] hover:shadow-[0_8px_24px_rgba(15,21,53,0.06)] transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[16px] font-bold text-[#0F1535]">
          Recent Bookings
        </h2>
        <button
          type="button"
          onClick={onViewAll}
          className="flex items-center gap-1 text-[13px] text-[#12B76A] font-semibold hover:underline cursor-pointer"
        >
          <span>View All</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[420px]">
          <tbody className="divide-y divide-[#EEF0F6]">
            {bookings.map((row, i) => {
              const badge =
                STATUS_BADGES[row.status] || STATUS_BADGES.Pending;
              return (
                <tr
                  key={i}
                  className="hover:bg-[#F6F7FD]/70 transition-colors group cursor-pointer"
                >
                  {/* Status pill */}
                  <td className="py-3.5 pr-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold ${badge.bg} ${badge.text}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                      <span>{row.status}</span>
                    </span>
                  </td>

                  {/* Customer name */}
                  <td className="py-3.5 px-3">
                    <span className="text-[13.5px] text-[#0F1535] font-semibold block">
                      {row.customer}
                    </span>
                  </td>

                  {/* Service */}
                  <td className="py-3.5 px-3">
                    <span className="text-[13px] text-[#6B7280]">
                      {row.service}
                    </span>
                  </td>

                  {/* Date & Time */}
                  <td className="py-3.5 px-3 text-right">
                    <span className="text-[12px] text-[#6B7280] font-mono">
                      {row.when}
                    </span>
                  </td>

                  {/* Chevron */}
                  <td className="py-3.5 pl-2 text-right">
                    <ChevronRight className="w-4 h-4 text-[#9CA3AF] group-hover:text-[#5B5BF0] transition-colors inline" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
