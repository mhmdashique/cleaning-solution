"use client";

import { Sparkline } from "./Sparkline";

interface DashboardKpiCardProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  value: string | number;
  trend: string;
  sparkline: number[];
  sparklineColor?: string;
}

export default function DashboardKpiCard({
  icon,
  iconBg,
  label,
  value,
  trend,
  sparkline,
  sparklineColor = "#12B76A",
}: DashboardKpiCardProps) {
  return (
    <div className="bg-white border border-[#EEF0F6] rounded-[20px] p-6 shadow-[0_2px_12px_rgba(15,21,53,0.03)] hover:shadow-[0_8px_24px_rgba(15,21,53,0.06)] hover:-translate-y-0.5 transition-all duration-200">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span
            className={`w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0 ${iconBg}`}
          >
            {icon}
          </span>
          <span className="text-[14px] text-[#6B7280] font-medium leading-none">
            {label}
          </span>
        </div>
        <div className="w-16 h-8 flex items-center justify-end">
          <Sparkline data={sparkline} color={sparklineColor} height={28} />
        </div>
      </div>

      <div className="mt-4 mb-2">
        <span className="text-[30px] font-bold text-[#0F1535] tracking-tight leading-none">
          {value}
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <span className="text-[12.5px] font-semibold text-[#12B76A] flex items-center gap-0.5">
          <span>↑</span>
          <span>{trend.replace(/^[+\-↑]\s*/, "")}</span>
        </span>
        <span className="text-[11.5px] text-[#9CA3AF]">vs last period</span>
      </div>
    </div>
  );
}
