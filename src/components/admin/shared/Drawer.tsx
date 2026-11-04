"use client";

import { useEffect, ReactNode } from "react";
import { X } from "lucide-react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function Drawer({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
}: DrawerProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        aria-hidden="true"
      />

      {/* Drawer slide-over */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside
          role="dialog"
          aria-modal="true"
          aria-labelledby="drawer-title"
          className="w-screen max-w-md bg-white border-l border-[#E3E8E5] shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200"
        >
          {/* Header */}
          <div className="p-5 pb-4 border-b border-[#E3E8E5] flex items-start justify-between gap-4 bg-[#F6F7F6]">
            <div>
              <h2 id="drawer-title" className="text-[17px] font-bold text-[#12201B] leading-tight">
                {title}
              </h2>
              {subtitle && (
                <p className="text-[13px] text-[#5D6B65] mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close drawer"
              className="p-1 rounded-[8px] text-[#5D6B65] hover:text-[#12201B] hover:bg-[#F1F4F2] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-5 space-y-6 overflow-y-auto flex-1">
            {children}
          </div>

          {/* Optional Footer */}
          {footer && (
            <div className="p-4 border-t border-[#E3E8E5] bg-[#F6F7F6]">
              {footer}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
