"use client";

interface TopbarProps {
  title?: string;
  subtitle?: string;
  awaitingCount?: number;
  operatingHours?: string;
}

export default function Topbar({
  title = "Overview",
  subtitle = "Cleaning and pest control dispatch in Trivandrum",
  awaitingCount = 1,
  operatingHours = "Dispatch 7:00 AM – 9:00 PM",
}: TopbarProps) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#e5e9e6] dark:border-[#1f2a24]">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-[26px] font-bold tracking-[-0.02em] text-[#12201b] dark:text-[#f0f4f2] leading-tight">
          {title}
        </h1>
        <p className="text-[14px] text-[#5d6b65] dark:text-[#96a59d] mt-1 font-normal">
          {subtitle}
        </p>
      </div>

      {/* Pill chips on the right */}
      <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
        <div 
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#131b17] border border-[#e5e9e6] dark:border-[#1f2a24] text-[12.5px] font-medium text-[#12201b] dark:text-[#f0f4f2]"
          role="status"
          aria-live="polite"
        >
          <span 
            className="w-2 h-2 rounded-full bg-[#0f6b54] dark:bg-[#3fbf97]" 
            aria-hidden="true" 
          />
          <span>Live · {awaitingCount} awaiting dispatch</span>
        </div>

        <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-white dark:bg-[#131b17] border border-[#e5e9e6] dark:border-[#1f2a24] text-[12.5px] font-medium text-[#5d6b65] dark:text-[#96a59d]">
          <span>{operatingHours}</span>
        </div>
      </div>
    </header>
  );
}

