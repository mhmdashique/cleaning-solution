"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

/**
 * Calendar card with month navigation and highlighted today circle
 */
export default function CalendarPanel() {
  const year = 2025;
  const month = 9; // October (0-indexed)
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = firstDay.getDay(); // Sunday = 0

  const today = 28; // highlighted date (28) in a solid green circle

  const cells: (number | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div className="bg-white border border-[#EEF0F6] rounded-[20px] p-6 shadow-[0_2px_12px_rgba(15,21,53,0.03)] hover:shadow-[0_8px_24px_rgba(15,21,53,0.06)] transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[16px] font-bold text-[#0F1535]">
          Calendar
        </h2>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6B7280] hover:bg-[#F6F7FD] hover:text-[#0F1535] transition-colors"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-[13px] font-bold text-[#0F1535] px-1">
            October 2025
          </span>
          <button
            type="button"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#6B7280] hover:bg-[#F6F7FD] hover:text-[#0F1535] transition-colors"
            aria-label="Next month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 text-center text-[11px] font-bold text-[#9CA3AF] mb-2">
        {DAYS.map((day) => (
          <div key={day} className="py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-1 text-center text-[12.5px] font-medium text-[#0F1535]">
        {cells.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="h-8" />;
          }

          const isToday = day === today;
          return (
            <div
              key={`day-${day}`}
              className="h-8 flex items-center justify-center"
            >
              <span
                className={`w-7 h-7 flex items-center justify-center rounded-full text-[12px] transition-colors ${
                  isToday
                    ? "bg-[#12B76A] text-white font-bold shadow-xs"
                    : "hover:bg-[#F6F7FD] text-[#0F1535]"
                }`}
              >
                {day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
