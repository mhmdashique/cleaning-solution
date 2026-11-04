"use client";

import { ReactNode } from "react";
import { Inbox, AlertCircle, RefreshCw } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
  icon?: ReactNode;
  isError?: boolean;
  onRetry?: () => void;
}

export default function EmptyState({
  title,
  description,
  action,
  icon,
  isError = false,
  onRetry,
}: EmptyStateProps) {
  return (
    <div className="py-12 px-4 text-center flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
      <div className={`w-11 h-11 rounded-full flex items-center justify-center ${
        isError ? "bg-[#DC2626]/10 text-[#DC2626]" : "bg-[#F1F4F2] text-[#5D6B65]"
      }`}>
        {icon ? icon : isError ? <AlertCircle className="w-5 h-5" /> : <Inbox className="w-5 h-5" />}
      </div>

      <div className="space-y-1">
        <h3 className="text-[15px] font-bold text-[#12201B]">
          {title}
        </h3>
        <p className="text-[13px] text-[#5D6B65] leading-relaxed">
          {description}
        </p>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[10px] bg-white hover:bg-[#F1F4F2] text-[#12201B] text-[13px] font-medium border border-[#E3E8E5] transition-colors cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry</span>
        </button>
      )}

      {action && <div className="pt-1">{action}</div>}
    </div>
  );
}
