"use client";

import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isDestructive = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-dialog-title"
      className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
    >
      <div className="bg-white border border-[#E3E8E5] rounded-[14px] p-6 max-w-md w-full shadow-xl space-y-4">
        <div className="flex items-start gap-3.5">
          <div className={`p-2.5 rounded-full shrink-0 ${
            isDestructive ? "bg-[#DC2626]/15 text-[#DC2626]" : "bg-[#0F6B54]/15 text-[#0F6B54]"
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>

          <div className="space-y-1">
            <h2 id="confirm-dialog-title" className="text-[16px] font-bold text-[#12201B]">
              {title}
            </h2>
            <p className="text-[13.5px] text-[#5D6B65] leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E3E8E5]">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-[10px] border border-[#E3E8E5] text-[#12201B] hover:bg-[#F1F4F2] text-[13px] font-medium transition-colors cursor-pointer"
          >
            {cancelLabel}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-[10px] text-white text-[13px] font-medium transition-colors cursor-pointer ${
              isDestructive
                ? "bg-[#DC2626] hover:bg-[#b91c1c]"
                : "bg-[#0F6B54] hover:bg-[#0c5543]"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
