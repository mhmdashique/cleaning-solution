"use client";

import { ReactNode } from "react";
import { Search, X } from "lucide-react";

interface ToolbarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters?: ReactNode;
  primaryAction?: ReactNode;
  className?: string;
}

export default function Toolbar({
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  filters,
  primaryAction,
  className = "",
}: ToolbarProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${className}`}>
      <div className="flex flex-1 flex-wrap items-center gap-3">
        {/* Search input with clear button */}
        <div className="relative min-w-[240px] max-w-sm w-full">
          <Search className="w-4 h-4 text-[#5D6B65] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-9 pr-8 py-2 rounded-[10px] bg-white border border-[#E3E8E5] text-[13.5px] text-[#12201B] placeholder:text-[#5D6B65] focus:outline-none focus:ring-2 focus:ring-[#0F6B54] transition-all"
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              aria-label="Clear search"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#5D6B65] hover:text-[#12201B] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter controls */}
        {filters && <div className="flex items-center gap-2 flex-wrap">{filters}</div>}
      </div>

      {/* Right-aligned primary action */}
      {primaryAction && <div className="shrink-0 self-start sm:self-auto">{primaryAction}</div>}
    </div>
  );
}
