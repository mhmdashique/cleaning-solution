"use client";

import { Calendar, ChevronRight } from "lucide-react";

interface AppointmentRow {
  when: string;
  service: string;
}

interface UpcomingAppointmentsProps {
  appointments: AppointmentRow[];
  onViewAll?: () => void;
}

export default function UpcomingAppointments({
  appointments,
  onViewAll,
}: UpcomingAppointmentsProps) {
  return (
    <div className="bg-white border border-[#EEF0F6] rounded-[20px] p-6 shadow-[0_2px_12px_rgba(15,21,53,0.03)] hover:shadow-[0_8px_24px_rgba(15,21,53,0.06)] transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-[16px] font-bold text-[#0F1535]">
          Upcoming Appointments
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

      <div className="space-y-3">
        {appointments.map((row, i) => (
          <div
            key={i}
            className="flex items-center justify-between gap-3 p-3 rounded-[14px] bg-[#F6F7FD] hover:bg-[#EEF0FF]/60 transition-colors border border-[#EEF0F6]"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-[10px] bg-[#ECFDF3] text-[#12B76A] flex items-center justify-center shrink-0">
                <Calendar className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <div className="text-[13px] text-[#0F1535] font-semibold truncate">
                  {row.service}
                </div>
                <div className="text-[11.5px] text-[#6B7280] font-mono mt-0.5">
                  {row.when}
                </div>
              </div>
            </div>

            <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-[#ECFDF3] text-[11px] font-bold text-[#12B76A] shrink-0 border border-[#12B76A]/20">
              Confirmed
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
