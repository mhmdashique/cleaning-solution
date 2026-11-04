"use client";

import { useEffect } from "react";
import { CheckCircle2, RotateCcw, X } from "lucide-react";

export interface ToastMessage {
  id: string;
  text: string;
  onUndo?: () => void;
}

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export default function Toast({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4500);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 py-3 px-4 rounded-[12px] bg-[#12201B] border border-[#12201B] text-white shadow-xl animate-in slide-in-from-bottom-2 duration-200"
    >
      <CheckCircle2 className="w-4 h-4 text-[#3FBF97] shrink-0" />
      <span className="text-[13.5px] font-medium">{toast.text}</span>

      {toast.onUndo && (
        <button
          type="button"
          onClick={() => {
            toast.onUndo?.();
            onDismiss();
          }}
          className="ml-2 inline-flex items-center gap-1 text-[12.5px] font-semibold text-[#3FBF97] hover:underline cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Undo</span>
        </button>
      )}

      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="ml-1 text-[#B7C2BC] hover:text-white"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
