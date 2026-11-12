"use client";

import { CalendarCheck, ChevronDown } from "lucide-react";
import type { BookingStatus } from "@/types/admin";

const STAGES: BookingStatus[] = [
  "Pending",
  "Confirmed",
  "In progress",
  "Completed",
];

const ALL_STATUSES: BookingStatus[] = [...STAGES, "Cancelled"];

interface BookingStatusPanelProps {
  status: BookingStatus;
  statusUpdatedAt: string;
  onChange: (next: BookingStatus) => void;
}

/**
 * Booking status panel — the stage control and a compact stage tracker for a
 * single booking.
 */
export default function BookingStatusPanel({
  status,
  statusUpdatedAt,
  onChange,
}: BookingStatusPanelProps) {
  const isCancelled = status === "Cancelled";
  const currentIndex = STAGES.indexOf(status);

  return (
    <section className="rounded-2xl border border-[#E3E8E5] bg-white p-5 shadow-sm">
      {/* Section label */}
      <div className="flex items-center gap-2.5">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#E3F2EC] text-[#0F6B54]">
          <CalendarCheck className="h-4 w-4" />
        </span>
        <h2 className="text-[11.5px] font-bold uppercase tracking-[0.12em] text-[#5D6B65]">
          Booking status
        </h2>
      </div>

      {/* Current stage */}
      <label
        htmlFor="booking-status"
        className="mt-5 block text-[11px] font-bold uppercase tracking-[0.1em] text-[#5D6B65]"
      >
        Current stage
      </label>

      <div className="relative mt-2">
        <select
          id="booking-status"
          value={status}
          onChange={(event) => onChange(event.target.value as BookingStatus)}
          className={`h-[52px] w-full cursor-pointer appearance-none rounded-xl border bg-white px-3.5 pr-10 text-[14px] font-semibold focus:outline-none focus:ring-2 focus:ring-[#0F6B54] ${
            isCancelled
              ? "border-red-200 text-red-600"
              : "border-[#E3E8E5] text-[#12201B]"
          }`}
        >
          {ALL_STATUSES.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#93A39B]"
          aria-hidden="true"
        />
      </div>

      <p className="mt-2 text-[12px] text-[#5D6B65]">Updated {statusUpdatedAt}</p>

      {/* Stage tracker */}
      <ol className="mt-4 space-y-0 border-t border-[#E3E8E5] pt-4">
        {STAGES.map((stage, index) => {
          const isReached = !isCancelled && index <= currentIndex;
          const isCurrent = !isCancelled && index === currentIndex;

          return (
            <li key={stage} className="relative flex gap-3 pb-3 last:pb-0">
              <span className="relative flex flex-col items-center">
                <span
                  className={`grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 transition-colors ${
                    isCurrent
                      ? "border-[#0F6B54] bg-[#0F6B54] ring-4 ring-[#E3F2EC]"
                      : isReached
                        ? "border-[#0F6B54] bg-white"
                        : "border-[#D6DEDA] bg-white"
                  }`}
                />
                {index < STAGES.length - 1 && (
                  <span
                    className={`mt-1 w-px flex-1 ${
                      isReached ? "bg-[#0F6B54]/40" : "bg-[#E3E8E5]"
                    }`}
                  />
                )}
              </span>

              <span
                className={`text-[12.5px] leading-4 ${
                  isCurrent
                    ? "font-bold text-[#0F6B54]"
                    : isReached
                      ? "font-semibold text-[#12201B]"
                      : "text-[#93A39B]"
                }`}
              >
                {stage}
              </span>
            </li>
          );
        })}

        {isCancelled && (
          <li className="relative flex gap-3 pt-1">
            <span className="grid h-4 w-4 shrink-0 place-items-center rounded-full border-2 border-red-500 bg-red-500" />
            <span className="text-[12.5px] font-bold leading-4 text-red-600">Cancelled</span>
          </li>
        )}
      </ol>
    </section>
  );
}
