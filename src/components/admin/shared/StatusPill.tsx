"use client";

import { BookingStatus } from "@/types/admin";
import { ChevronDown } from "lucide-react";

interface StatusPillProps {
  status: BookingStatus | string;
  onChange?: (newStatus: BookingStatus) => void;
  interactive?: boolean;
}

export function getStatusStyle(status: string) {
  switch (status) {
    case "Completed":
    case "Approved":
    case "Published":
      return {
        text: "text-[#0F6B54]",
        bg: "bg-[#0F6B54]/[0.13]",
        border: "border-[#0F6B54]/40",
      };
    case "In progress":
      return {
        text: "text-[#2F7FC1]",
        bg: "bg-[#2F7FC1]/[0.13]",
        border: "border-[#2F7FC1]/40",
      };
    case "Confirmed":
      return {
        text: "text-[#6C5BC9]",
        bg: "bg-[#6C5BC9]/[0.13]",
        border: "border-[#6C5BC9]/40",
      };
    case "Cancelled":
    case "Hidden":
      return {
        text: "text-[#DC2626]",
        bg: "bg-[#DC2626]/[0.13]",
        border: "border-[#DC2626]/40",
      };
    case "Pending":
    case "Draft":
    default:
      return {
        text: "text-[#B57F0A]",
        bg: "bg-[#B57F0A]/[0.13]",
        border: "border-[#B57F0A]/40",
      };
  }
}

export default function StatusPill({
  status,
  onChange,
  interactive = false,
}: StatusPillProps) {
  const style = getStatusStyle(status);

  if (interactive && onChange) {
    return (
      <div className="relative inline-flex items-center">
        <select
          value={status}
          onChange={(e) => onChange(e.target.value as BookingStatus)}
          className={`appearance-none text-[12px] font-semibold py-1 pl-2.5 pr-6 rounded-full border transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0F6B54] ${style.text} ${style.bg} ${style.border}`}
          aria-label={`Change status from ${status}`}
        >
          <option value="Pending">Pending</option>
          <option value="Confirmed">Confirmed</option>
          <option value="In progress">In progress</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
        <ChevronDown className={`w-3 h-3 absolute right-2 pointer-events-none ${style.text}`} />
      </div>
    );
  }

  return (
    <span
      className={`inline-flex items-center text-[12px] font-semibold px-2.5 py-0.5 rounded-full border ${style.text} ${style.bg} ${style.border}`}
    >
      {status}
    </span>
  );
}
