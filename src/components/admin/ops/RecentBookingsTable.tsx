"use client";

import Link from "next/link";
import StatusPill from "../shared/StatusPill";

interface BookingRow {
  id: string;
  customer: string;
  phone?: string;
  service: string;
  area: string;
  status: "Completed" | "In progress" | "Confirmed" | "Pending" | "Cancelled";
  amount: string;
  date?: string;
}

interface RecentBookingsTableProps {
  bookings: BookingRow[];
  onViewAll?: () => void;
}

export default function RecentBookingsTable({
  bookings,
  onViewAll,
}: RecentBookingsTableProps) {
  return (
    <section 
      aria-label="Recent bookings registry"
      className="bg-white border border-[#E3E8E5] rounded-[14px] p-5 shadow-xs transition-colors"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-[16px] font-bold text-[#12201B] leading-tight">
            Recent bookings
          </h2>
          <p className="text-[13px] text-[#5D6B65] mt-0.5">
            Latest customer bookings received across Trivandrum
          </p>
        </div>

        {onViewAll && (
          <button
            type="button"
            onClick={onViewAll}
            className="text-[13px] font-medium text-[#0F6B54] hover:underline cursor-pointer"
          >
            View all bookings →
          </button>
        )}
      </div>

      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-[13.5px] border-collapse min-w-[560px]">
          <thead>
            <tr className="border-b border-[#E3E8E5] text-[#5D6B65] text-[12.5px] font-medium">
              <th scope="col" className="pb-2.5 font-semibold">Customer</th>
              <th scope="col" className="pb-2.5 font-semibold">Service</th>
              <th scope="col" className="pb-2.5 font-semibold">Area</th>
              <th scope="col" className="pb-2.5 font-semibold">Status</th>
              <th scope="col" className="pb-2.5 font-semibold text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E3E8E5]/70">
            {bookings.map((b) => (
              <tr key={b.id} className="hover:bg-[#F1F4F2]/50 transition-colors">
                <td className="py-3 font-medium text-[#12201B]">
                  <div>{b.customer}</div>
                  <div className="text-[11.5px] text-[#5D6B65] font-mono">{b.id}</div>
                </td>
                <td className="py-3 text-[#12201B]">{b.service}</td>
                <td className="py-3 text-[#5D6B65]">{b.area}</td>
                <td className="py-3">
                  <StatusPill status={b.status} />
                </td>
                <td className="py-3 text-right font-medium text-[#12201B]">
                  {b.amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
