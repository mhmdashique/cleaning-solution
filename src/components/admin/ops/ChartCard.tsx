"use client";

import { ReactNode } from "react";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  children: ReactNode;
  ariaLabel: string;
  className?: string;
}

export default function ChartCard({
  title,
  subtitle,
  action,
  children,
  ariaLabel,
  className = "",
}: ChartCardProps) {
  return (
    <section
      aria-label={ariaLabel}
      className={`bg-white border border-[#E3E8E5] rounded-[14px] p-5 flex flex-col justify-between shadow-xs transition-colors ${className}`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h2 className="text-[16px] font-bold text-[#12201B] leading-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-[13px] text-[#5D6B65] mt-0.5">
              {subtitle}
            </p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>

      <div className="flex-1 w-full min-h-[220px]">
        {children}
      </div>
    </section>
  );
}
