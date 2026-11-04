"use client";

import { ReactNode } from "react";
import Link from "next/link";

interface PageHeaderProps {
  title: string;
  subtitle: string;
  actions?: ReactNode;
  showChips?: boolean;
  awaitingCount?: number;
  onFilterPending?: () => void;
}

export default function PageHeader({
  title,
  subtitle,
  actions,
  showChips = false,
  awaitingCount = 0,
  onFilterPending,
}: PageHeaderProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      <div>
        <h1 className="text-[26px] font-bold tracking-[-0.02em] text-[#12201B] leading-tight">
          {title}
        </h1>
        <p className="text-[14px] text-[#5D6B65] mt-1 font-normal">
          {subtitle}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
        {showChips && (
          <>
            {/* Live chip linking to pending */}
            {onFilterPending ? (
              <button
                type="button"
                onClick={onFilterPending}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E3F2EC] border border-[#0F6B54]/30 text-[12.5px] font-medium text-[#0F6B54] hover:bg-[#d6ece4] transition-colors cursor-pointer"
                title="View awaiting dispatch"
              >
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0F6B54] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0F6B54]" />
                </span>
                <span>Live · {awaitingCount} awaiting dispatch</span>
              </button>
            ) : (
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E3F2EC] border border-[#0F6B54]/30 text-[12.5px] font-medium text-[#0F6B54]"
              >
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0F6B54] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0F6B54]" />
                </span>
                <span>Live · {awaitingCount} awaiting dispatch</span>
              </div>
            )}

            {/* Dispatch hours chip */}
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#F1F4F2] border border-[#E3E8E5] text-[12.5px] font-medium text-[#5D6B65]">
              Dispatch 7:00 AM – 9:00 PM
            </div>
          </>
        )}

        {actions && <div>{actions}</div>}
      </div>
    </header>
  );
}
