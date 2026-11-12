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
  EyeOff,
  Sparkles
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
    document.documentElement.style.backgroundColor = "#F6F7FD";
    document.body.style.backgroundColor = "#F6F7FD";

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
      className="min-h-screen min-h-dvh w-full flex flex-col justify-between bg-[#F6F7FD] text-[#0F1535] p-6 sm:p-10 relative select-none font-sans"
    >
      {/* Background soft ambient glowing gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#EEF0FF] rounded-full blur-3xl opacity-70" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-[#E7F8F0] rounded-full blur-3xl opacity-70" />
      </div>

      {/* Top clean header */}
      <header className="relative z-10 flex items-center justify-between max-w-5xl mx-auto w-full">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-[12px] bg-gradient-to-br from-[#3B82F6] via-[#12B76A] to-[#10B981] text-white flex items-center justify-center font-black text-[18px] tracking-tighter shadow-sm">
            Z
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-[#0F1535] text-[16px] tracking-tight">
                Plan C
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#EEF0FF] text-[#5B5BF0]">
                Operations Hub
              </span>
            </div>
            <p className="text-[#6B7280] text-[11.5px] mt-0.5">
              Thiruvananthapuram, Kerala
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#6B7280] hover:text-[#0F1535] transition-colors py-2 px-4 rounded-xl bg-white border border-[#EEF0F6] shadow-2xs hover:shadow-xs"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#5B5BF0]" />
          <span>Public website</span>
        </Link>
      </header>

      {/* Center Passcode Card */}
      <main className="relative z-10 max-w-[400px] w-full mx-auto my-auto py-8">
        <div className="bg-white rounded-[24px] p-7 sm:p-8 border border-[#EEF0F6] shadow-[0_12px_36px_rgba(91,91,240,0.08)] space-y-6">
          <div className="space-y-2 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#EEF0FF] text-[#5B5BF0] flex items-center justify-center mx-auto shadow-xs">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-[22px] font-extrabold text-[#0F1535] tracking-tight pt-1">
              Operations Console
            </h1>
            <p className="text-[13.5px] text-[#6B7280] leading-relaxed">
              Enter your authorized admin security passcode to unlock operations management.
            </p>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-[#FEF3F2] border border-[#FECDCA] text-[#B42318] text-[13px] flex items-center gap-2.5 animate-in fade-in duration-150">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[12px] font-bold uppercase tracking-wider text-[#9CA3AF] block">
                Security Passcode
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  autoFocus
                  required
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter passcode"
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#F6F7FD] border border-[#EEF0F6] text-[#0F1535] font-mono text-[14px] font-semibold focus:outline-none focus:bg-white focus:border-[#5B5BF0] focus:ring-2 focus:ring-[#5B5BF0]/15 placeholder:text-[#9CA3AF] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#0F1535] p-1 transition-colors cursor-pointer"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending || !passcode}
              className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-[#5B5BF0] hover:bg-[#4E4EE0] disabled:opacity-50 text-white font-bold text-[14px] shadow-sm hover:shadow-md transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              <span>{isPending ? "Authenticating..." : "Unlock Console"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-2 border-t border-[#EEF0F6] text-center flex items-center justify-center gap-1.5 text-[12px] text-[#6B7280]">
            <ShieldCheck className="w-4 h-4 text-[#12B76A]" />
            <span className="font-medium">Encrypted HTTP-only Secure Session</span>
          </div>
        </div>
      </main>

      {/* Bottom minimal footer */}
      <footer className="relative z-10 text-center text-[12px] text-[#9CA3AF]">
        Plan C Cleaning Solutions · Thrikannapuram, Thiruvananthapuram, Kerala 695032
      </footer>
    </div>
  );
}
