"use client";

import { useEffect } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  RotateCcw,
  TriangleAlert,
  X,
} from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastMessage {
  id: string;
  text: string;
  type?: ToastType;
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

  const type = toast.type || "success";
  const variant = {
    success: {
      icon: CheckCircle2,
      className: "border-emerald-800 bg-emerald-950 text-white",
      iconClassName: "text-emerald-300",
      actionClassName: "text-emerald-300",
    },
    error: {
      icon: AlertCircle,
      className: "border-red-800 bg-red-950 text-white",
      iconClassName: "text-red-300",
      actionClassName: "text-red-300",
    },
    warning: {
      icon: TriangleAlert,
      className: "border-amber-700 bg-amber-950 text-white",
      iconClassName: "text-amber-300",
      actionClassName: "text-amber-300",
    },
    info: {
      icon: Info,
      className: "border-blue-800 bg-slate-950 text-white",
      iconClassName: "text-blue-300",
      actionClassName: "text-blue-300",
    },
  }[type];
  const Icon = variant.icon;

  return (
    <div
      role={type === "error" ? "alert" : "status"}
      aria-live={type === "error" ? "assertive" : "polite"}
      className={`fixed bottom-6 right-6 z-[100] flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-[12px] border px-4 py-3 text-white shadow-xl animate-in slide-in-from-bottom-2 duration-200 ${variant.className}`}
    >
      <Icon className={`h-4 w-4 shrink-0 ${variant.iconClassName}`} />
      <span className="text-[13.5px] font-medium">{toast.text}</span>

      {toast.onUndo && (
        <button
          type="button"
          onClick={() => {
            toast.onUndo?.();
            onDismiss();
          }}
          className={`ml-2 inline-flex items-center gap-1 text-[12.5px] font-semibold hover:underline cursor-pointer ${variant.actionClassName}`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Undo</span>
        </button>
      )}

      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className="ml-1 text-white/70 hover:text-white"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
