"use client";

import { useState, useMemo } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Briefcase,
} from "lucide-react";
import { useOpsHub } from "@/context/OpsHubContext";
import { BookingRecord } from "@/types/opsHub";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

interface InteractiveCalendarScheduleProps {
  onOpenBookingDetail?: (bookingId: string) => void;
}

export default function InteractiveCalendarSchedule({
  onOpenBookingDetail,
}: InteractiveCalendarScheduleProps) {
  const { bookings, customers, services } = useOpsHub();

  const now = new Date();
  const [currentYear, setCurrentYear] = useState<number>(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(now.getMonth());

  // Format today's YYYY-MM-DD
  const todayStr = useMemo(() => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, "0");
    const d = String(today.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }, []);

  // Selected date string (defaults to today or the latest booking date if in current month)
  const [selectedDateStr, setSelectedDateStr] = useState<string>(() => todayStr);

  // Group bookings by normalized date string: "YYYY-MM-DD"
  const bookingsByDate = useMemo(() => {
    const map = new Map<string, BookingRecord[]>();
    for (const b of bookings) {
      if (!b.date) continue;
      // Normalise potential date formats e.g. "2026-11-13" or ISO string
      let dStr = b.date.trim();
      if (dStr.includes("T")) {
        dStr = dStr.split("T")[0];
      }
      if (!map.has(dStr)) {
        map.set(dStr, []);
      }
      map.get(dStr)!.push(b);
    }
    return map;
  }, [bookings]);

  // Calendar matrix calculations
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
  const startOffset = firstDayOfMonth.getDay(); // 0 is Sunday
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  // Month navigation
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // Resolve bookings for the currently selected date
  const selectedDateBookings = useMemo(() => {
    return bookingsByDate.get(selectedDateStr) || [];
  }, [bookingsByDate, selectedDateStr]);

  // Friendly formatted label for selected date
  const selectedDateLabel = useMemo(() => {
    if (!selectedDateStr) return "Select a date";
    const parts = selectedDateStr.split("-");
    if (parts.length === 3) {
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      }
    }
    return selectedDateStr;
  }, [selectedDateStr]);

  return (
    <div className="bg-white border border-[#EEF0F6] rounded-[24px] p-6 sm:p-7 shadow-[0_4px_24px_rgba(91,91,240,0.04)] flex flex-col justify-between space-y-6">
      {/* Header with Title & Month controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EEF0F6] pb-4">
        <div>
          <h2 className="text-[17px] font-extrabold text-[#0F1535] flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-[#5B5BF0]" />
            <span>Interactive Calendar &amp; Schedule</span>
          </h2>
          <p className="text-[12px] text-[#6B7280] mt-0.5">
            Dates with scheduled bookings pulse in emerald green. Click any date to view day&apos;s jobs.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-[#F6F7FD] border border-[#EEF0F6] p-1 rounded-2xl">
          <button
            type="button"
            onClick={handlePrevMonth}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-[#6B7280] hover:bg-white hover:text-[#0F1535] hover:shadow-2xs transition-all cursor-pointer"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[13px] font-bold text-[#0F1535] px-2 min-w-[120px] text-center select-none font-sans">
            {MONTH_NAMES[currentMonth]} {currentYear}
          </span>
          <button
            type="button"
            onClick={handleNextMonth}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-[#6B7280] hover:bg-white hover:text-[#0F1535] hover:shadow-2xs transition-all cursor-pointer"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2-Column Split: Calendar Grid (Left) + Selected Day Work Details (Right) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Calendar Grid (7 cols) */}
        <div className="md:col-span-6 lg:col-span-5 bg-[#F8F9FC] border border-[#EEF0F6] rounded-2xl p-4.5 space-y-2.5">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 text-center text-[11px] font-extrabold uppercase tracking-wider text-[#9CA3AF]">
            {DAYS.map((d) => (
              <div key={d} className="py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day Numbers Grid */}
          <div className="grid grid-cols-7 gap-1.5 text-center text-[13px] font-medium text-[#0F1535]">
            {cells.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="h-9.5" />;
              }

              const mStr = String(currentMonth + 1).padStart(2, "0");
              const dStr = String(day).padStart(2, "0");
              const cellDateStr = `${currentYear}-${mStr}-${dStr}`;

              const dayBookings = bookingsByDate.get(cellDateStr) || [];
              const hasBookings = dayBookings.length > 0;
              const isSelected = selectedDateStr === cellDateStr;
              const isToday = cellDateStr === todayStr;

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  onClick={() => setSelectedDateStr(cellDateStr)}
                  className={`relative h-9.5 rounded-xl flex flex-col items-center justify-center transition-all cursor-pointer select-none group ${
                    isSelected
                      ? "bg-[#5B5BF0] text-white font-bold shadow-xs scale-105 z-10"
                      : hasBookings
                      ? "bg-[#ECFDF3] text-[#027A48] hover:bg-[#D5EBDF] font-bold border border-[#A6F4C5]"
                      : isToday
                      ? "bg-white text-[#5B5BF0] font-bold border-2 border-[#5B5BF0]/40 hover:bg-white"
                      : "hover:bg-white hover:text-[#0F1535] text-[#344054]"
                  }`}
                >
                  <span className="text-[12.5px] leading-none">{day}</span>

                  {/* Pulsing indicator when there are bookings scheduled on this date */}
                  {hasBookings && (
                    <span className="absolute -top-1 -right-1 flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#12B76A] opacity-75" />
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-[#12B76A] border-2 border-white text-[8px] text-white font-extrabold items-center justify-center" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Calendar Legend */}
          <div className="flex items-center justify-between pt-3 border-t border-[#EEF0F6] text-[11px] text-[#6B7280]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#12B76A] ring-2 ring-[#A6F4C5]" />
              <span>Has Bookings (Pulse)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#5B5BF0]" />
              <span>Selected Date</span>
            </div>
          </div>
        </div>

        {/* Right: Selected Date Work Details (7 cols) */}
        <div className="md:col-span-6 lg:col-span-7 flex flex-col space-y-3.5">
          <div className="flex items-center justify-between border-b border-[#EEF0F6] pb-2.5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF] block">
                Work Schedule For
              </span>
              <h3 className="text-[15px] font-extrabold text-[#0F1535]">
                {selectedDateLabel}
              </h3>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-[11.5px] font-bold ${
                selectedDateBookings.length > 0
                  ? "bg-[#ECFDF3] text-[#027A48] border border-[#A6F4C5]"
                  : "bg-[#F6F7FD] text-[#6B7280]"
              }`}
            >
              {selectedDateBookings.length} {selectedDateBookings.length === 1 ? "Job" : "Jobs"}
            </span>
          </div>

          {/* Jobs List for this date */}
          {selectedDateBookings.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[#F8F9FC] border border-dashed border-[#EEF0F6] text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-white text-[#9CA3AF] flex items-center justify-center mx-auto shadow-2xs">
                <Briefcase className="w-5 h-5" />
              </div>
              <div className="text-[13.5px] font-bold text-[#0F1535]">No Jobs Scheduled</div>
              <p className="text-[12px] text-[#6B7280] max-w-xs mx-auto">
                There are no customer or admin bookings recorded for this date. Click another highlighted date to review work orders.
              </p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              {selectedDateBookings.map((b) => {
                const customer = customers.find((c) => c.id === b.customerId);
                const service = services.find((s) => s.id === b.serviceId);
                const custName = customer?.name || b.customerName || "Customer";
                const svcName = service?.name || b.serviceName || "Service";

                const isCompleted = b.status === "Completed";
                const isProgress = b.status === "In Progress";
                const isConfirmed = b.status === "Confirmed";

                return (
                  <div
                    key={b.id}
                    className="p-4 rounded-2xl bg-[#F8F9FC] border border-[#EEF0F6] hover:border-[#5B5BF0]/30 hover:bg-[#EEF0FF]/30 transition-all space-y-2.5 group"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[13px] font-bold text-[#5B5BF0] bg-white border border-[#EEF0F6] px-2 py-0.5 rounded-lg">
                          {b.id}
                        </span>
                        <span className="font-bold text-[14px] text-[#0F1535]">
                          {svcName}
                        </span>
                      </div>

                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${
                          isCompleted
                            ? "bg-[#ECFDF3] border-[#A6F4C5] text-[#027A48]"
                            : isProgress
                            ? "bg-[#EFF8FF] border-[#B2DDFF] text-[#175CD3]"
                            : isConfirmed
                            ? "bg-[#ECFDF3] border-[#12B76A]/30 text-[#12B76A]"
                            : "bg-[#FFF4ED] border-[#FDDCAB] text-[#B54708]"
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[12px] text-[#6B7280]">
                      <div className="flex items-center gap-1.5 truncate">
                        <Clock className="w-3.5 h-3.5 text-[#5B5BF0] shrink-0" />
                        <span>{b.time || "10:00 AM"}</span>
                        <span>·</span>
                        <span className="font-medium text-[#0F1535]">{custName}</span>
                      </div>

                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-[#F79009] shrink-0" />
                        <span className="truncate">{b.address || "Trivandrum"}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-[#EEF0F6]/70">
                      <span className="text-[12px] font-bold text-[#0F1535] font-mono">
                        ₹{(b.amount || 0).toLocaleString("en-IN")}
                      </span>

                      {onOpenBookingDetail && (
                        <button
                          type="button"
                          onClick={() => onOpenBookingDetail(b.id)}
                          className="inline-flex items-center gap-1 text-[12px] font-bold text-[#5B5BF0] hover:underline cursor-pointer"
                        >
                          <span>Open Work Details</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

