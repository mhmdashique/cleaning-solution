"use client";

import { ReactNode } from "react";
import { CalendarClock, ChevronRight } from "lucide-react";

export interface PageHeaderStat {
  label: string;
  value: string;
  icon?: ReactNode;
  onClick?: () => void;
}

interface PageHeaderProps {
  title: string;
  subtitle: string;
  actions?: ReactNode;
  stats?: PageHeaderStat[];
  showChips?: boolean;
  awaitingCount?: number;
  onFilterPending?: () => void;
}

export default function PageHeader({
  title,
  subtitle,
  actions,
  stats,
  showChips = false,
  awaitingCount = 0,
  onFilterPending,
}: PageHeaderProps) {
  const hasRightColumn = showChips || Boolean(actions) || Boolean(stats?.length);
  const twoUp = showChips || (stats?.length ?? 0) > 1;

  return (
    <header className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto]">
      {/* Heading card */}
      <div className="rounded-[14px] border border-[#E3E8E5] bg-white p-5 shadow-sm">
        <div className="mb-1 text-[26px] font-extrabold uppercase tracking-tight text-[#0F6B54]">
          {title}
        </div>
        <h1 className="text-[17px] font-semibold leading-tight text-[#12201B]">
          {subtitle}
        </h1>

        {showChips && (
          <p className="mt-1.5 text-[14px] leading-relaxed text-[#5D6B65]">
            {onFilterPending ? (
              <>
                You have{" "}
                <button
                  type="button"
                  onClick={onFilterPending}
                  className="font-semibold text-[#0F6B54] hover:underline focus:outline-none focus-visible:underline"
                >
                  {awaitingCount} booking{awaitingCount !== 1 ? "s" : ""} awaiting dispatch
                </button>
                . Keep the queue moving from one place.
              </>
            ) : (
              <>
                Live · {awaitingCount} booking{awaitingCount !== 1 ? "s" : ""} awaiting dispatch.
              </>
            )}
          </p>
        )}
      </div>

      {/* Right-side cards */}
      {hasRightColumn && (
        <div
          className={`grid gap-3 sm:min-w-[240px] ${
            twoUp ? "grid-cols-2 sm:grid-cols-1" : "grid-cols-1"
          }`}
        >
          {showChips && (
            <>
              <button
                type="button"
                onClick={onFilterPending}
                className="group flex flex-col justify-center rounded-[14px] border border-[#E3E8E5] bg-white p-4 text-left shadow-sm transition-colors hover:border-[#0F6B54]/30 hover:bg-[#F8FAF9]"
              >
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#87938D]">
                  <span className="relative flex h-2 w-2" aria-hidden="true">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0F6B54] opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#0F6B54]" />
                  </span>
                  Live queue
                </span>
                <span className="mt-1.5 flex items-center justify-between gap-2">
                  <span className="text-[15px] font-semibold leading-tight text-[#12201B]">
                    {awaitingCount} awaiting dispatch
                  </span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-[#93A39B] transition-transform group-hover:translate-x-0.5 group-hover:text-[#0F6B54]" />
                </span>
              </button>

              <div className="flex flex-col justify-center rounded-[14px] border border-[#E3E8E5] bg-white p-4 shadow-sm">
                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#87938D]">
                  <CalendarClock className="h-3.5 w-3.5 text-[#5D6B65]" />
                  Dispatch window
                </span>
                <span className="mt-1.5 text-[15px] font-semibold leading-tight text-[#12201B]">
                  7:00 AM – 9:00 PM
                </span>
              </div>
            </>
          )}

          {!showChips &&
            stats?.map((stat) => {
              const content = (
                <>
                  <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#87938D]">
                    {stat.icon}
                    {stat.label}
                  </span>
                  <span className="mt-1.5 flex items-center justify-between gap-2">
                    <span className="text-[15px] font-semibold leading-tight text-[#12201B]">
                      {stat.value}
                    </span>
                    {stat.onClick && (
                      <ChevronRight className="h-4 w-4 shrink-0 text-[#93A39B] transition-transform group-hover:translate-x-0.5 group-hover:text-[#0F6B54]" />
                    )}
                  </span>
                </>
              );

              return stat.onClick ? (
                <button
                  key={stat.label}
                  type="button"
                  onClick={stat.onClick}
                  className="group flex flex-col justify-center rounded-[14px] border border-[#E3E8E5] bg-white p-4 text-left shadow-sm transition-colors hover:border-[#0F6B54]/30 hover:bg-[#F8FAF9]"
                >
                  {content}
                </button>
              ) : (
                <div
                  key={stat.label}
                  className="flex flex-col justify-center rounded-[14px] border border-[#E3E8E5] bg-white p-4 shadow-sm"
                >
                  {content}
                </div>
              );
            })}

          {actions && (
            <div className="flex items-center justify-center rounded-[14px] border border-[#E3E8E5] bg-white p-4 shadow-sm">
              {actions}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
