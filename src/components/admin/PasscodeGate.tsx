"use client";

import { useState, useTransition, useEffect } from "react";
import { verifyPasscodeAction } from "@/app/actions/admin";
import Link from "next/link";
import { 
  Lock, 
  KeyRound, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck, 
  ArrowLeft,
  Eye,
  EyeOff
} from "lucide-react";

export default function PasscodeGate({
  onUnlocked,
}: {
  onUnlocked?: () => void;
}) {
  const [passcode, setPasscode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    document.documentElement.classList.add("admin-mode");
    document.body.classList.add("admin-mode");
    const origHtmlZoom = document.documentElement.style.zoom;
    const origBodyBg = document.body.style.backgroundColor;
    const origHtmlBg = document.documentElement.style.backgroundColor;

    document.documentElement.style.zoom = "1";
    document.documentElement.style.backgroundColor = "#0a0f0d";
    document.body.style.backgroundColor = "#0a0f0d";

    return () => {
      document.documentElement.classList.remove("admin-mode");
      document.body.classList.remove("admin-mode");
      document.documentElement.style.zoom = origHtmlZoom;
      document.documentElement.style.backgroundColor = origHtmlBg;
      document.body.style.backgroundColor = origBodyBg;
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      const res = await verifyPasscodeAction(passcode);
      if (res.success) {
        if (onUnlocked) {
          onUnlocked();
        } else {
          window.location.reload();
        }
      } else {
        setError(res.error || "Incorrect security passcode.");
      }
    });
  };

  return (
    <div 
      data-admin-shell
      className="min-h-screen min-h-dvh w-full flex flex-col justify-between bg-[#0a0f0d] text-[#b7c2bc] p-6 sm:p-10 relative select-none"
    >
      {/* Top minimal header */}
      <header className="relative z-10 flex items-center justify-between max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-[10px] bg-[#0f6b54] text-white flex items-center justify-center font-bold text-[13px]">
            PC
          </div>
          <div>
            <span className="font-bold text-white text-[15px] tracking-tight">
              Plan C Ops Hub
            </span>
            <span className="text-[#7d8f86] text-[12px] ml-2 border-l border-[#1a2520] pl-2">
              Thiruvananthapuram
            </span>
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#b7c2bc] hover:text-white transition-colors py-1.5 px-3.5 rounded-full bg-[#14201a] border border-[#1b2a23]"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Public website</span>
        </Link>
      </header>

      {/* Center Passcode Card */}
      <main className="relative z-10 max-w-sm w-full mx-auto my-auto py-8">
        <div className="bg-[#14201a] rounded-[14px] p-8 border border-[#1b2a23] space-y-5">
          <div className="space-y-1.5 text-center">
            <div className="w-10 h-10 rounded-[10px] bg-[#1b2a23] text-[#3fbf97] flex items-center justify-center mx-auto">
              <Lock className="w-5 h-5" />
            </div>
            <h1 className="text-[18px] font-bold text-white pt-1">
              Operations console
            </h1>
            <p className="text-[13px] text-[#7d8f86] leading-relaxed">
              Enter your passcode to manage bookings and dispatch.
            </p>
          </div>

          <div className="p-2.5 rounded-[10px] bg-[#0e1512] border border-[#1b2a23] text-[12px] text-[#7d8f86]">
            Use the admin passcode configured for this site.
          </div>

          {error && (
            <div className="p-2.5 rounded-[10px] bg-[#1f1618] border border-[#3b1c20] text-[#f87171] text-[12.5px] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[12px] font-medium text-[#7d8f86] block">
                Security passcode
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#7d8f86] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  autoFocus
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode"
                  className="w-full pl-9 pr-9 py-2.5 rounded-[10px] bg-[#0e1512] border border-[#1b2a23] text-white font-mono text-[13.5px] focus:outline-none focus:ring-2 focus:ring-[#0f6b54] placeholder:text-[#55635c] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#7d8f86] hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending || !passcode}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-[10px] bg-[#0f6b54] hover:bg-[#0c5543] disabled:opacity-40 text-white font-medium text-[13.5px] transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <span>{isPending ? "Authenticating..." : "Unlock console"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="pt-1 text-center flex items-center justify-center gap-1.5 text-[11.5px] text-[#7d8f86]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#3fbf97]" />
            <span>Encrypted HTTP-only session</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 text-center text-[12px] text-[#7d8f86]">
        Plan C Cleaning Solutions • Thrikannapuram, Thiruvananthapuram, Kerala
      </footer>
    </div>
  );
}
