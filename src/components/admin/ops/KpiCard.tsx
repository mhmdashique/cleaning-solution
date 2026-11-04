"use client";

interface KpiCardProps {
  label: string;
  value: string | number;
  sublabel: string;
  badge?: string;
}

export default function KpiCard({
  label,
  value,
  sublabel,
  badge,
}: KpiCardProps) {
  return (
    <div className="bg-white border border-[#E3E8E5] rounded-[14px] p-5 flex flex-col justify-between shadow-xs transition-colors">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[14px] text-[#5D6B65] font-medium">
          {label}
        </span>
        {badge && (
          <span className="text-[12px] font-medium text-[#0F6B54] bg-[#E3F2EC] px-2 py-0.5 rounded-full border border-[#0F6B54]/20">
            {badge}
          </span>
        )}
      </div>

      <div className="mt-4 mb-2">
        <span className="text-[32px] font-bold text-[#12201B] tracking-tight leading-none">
          {value}
        </span>
      </div>

      <div className="text-[13px] text-[#5D6B65] font-normal">
        {sublabel}
      </div>
    </div>
  );
}
