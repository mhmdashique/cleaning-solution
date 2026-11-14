"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

type LoginStatus = "loading" | "ready" | "unavailable";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function formatCountdown(remainingSeconds: number): string {
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function PasscodeGate({
  onUnlocked,
  nextPath,
}: {
  onUnlocked?: () => void;
  nextPath?: string;
}) {
  const [passcode, setPasscode] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);
  const [lockDurationSeconds, setLockDurationSeconds] = useState<number | null>(
    null
  );
  const [loginStatus, setLoginStatus] = useState<LoginStatus>("loading");
  const [isPending, setIsPending] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const passwordInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    let active = true;

    async function loadLoginStatus() {
      try {
        const response = await fetch("/api/admin/login/status", {
          cache: "no-store",
        });
        const payload: unknown = await response.json();
        if (!response.ok || !isRecord(payload)) {
          throw new Error("Unable to load sign-in status.");
        }

        if (active) {
          const until =
            payload.locked === true && typeof payload.lockedUntil === "number"
              ? payload.lockedUntil
              : null;
          setLockedUntil(until);
          setLockDurationSeconds(
            until !== null &&
              typeof payload.lockDurationSeconds === "number"
              ? payload.lockDurationSeconds
              : null
          );
          setNow(Date.now());
          setLoginStatus("ready");
        }
      } catch {
        if (active) {
          setError("Sign-in status is unavailable. Please try again later.");
          setLoginStatus("unavailable");
        }
      }
    }

    void loadLoginStatus();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(intervalId);
  }, []);

  const remainingSeconds =
    lockedUntil === null ? 0 : Math.max(0, Math.ceil((lockedUntil - now) / 1000));

  useEffect(() => {
    if (lockedUntil === null || remainingSeconds > 0) return;

    setLockedUntil(null);
    setLockDurationSeconds(null);
    setError(null);
    setNotice("You can try again now.");
    setNow(Date.now());
    passwordInputRef.current?.focus();
  }, [lockedUntil, remainingSeconds]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setNotice(null);
    setIsPending(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: passcode }),
      });
      const payload: unknown = await response.json();
      if (!isRecord(payload)) {
        throw new Error("Unexpected sign-in response.");
      }

      if (response.status === 429 && typeof payload.lockedUntil === "number") {
        setLockedUntil(payload.lockedUntil);
        setLockDurationSeconds(
          typeof payload.lockDurationSeconds === "number"
            ? payload.lockDurationSeconds
            : 30
        );
        setPasscode("");
        setNow(Date.now());
        return;
      }

      if (response.status === 401) {
        const left =
          typeof payload.attemptsLeft === "number" ? payload.attemptsLeft : 0;
        setError(
          `Incorrect password. ${left} ${left === 1 ? "attempt" : "attempts"} left.`
        );
        return;
      }

      if (!response.ok || payload.success !== true) {
        setError(
          typeof payload.error === "string"
            ? payload.error
            : "Unable to sign in. Please try again."
        );
        return;
      }

      if (onUnlocked) {
        onUnlocked();
      } else {
        window.location.assign(nextPath || "/admin");
      }
    } catch {
      setError("Unable to sign in right now. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  const locked = remainingSeconds > 0;
  const progress =
    locked && lockDurationSeconds
      ? Math.min(
          100,
          Math.max(
            0,
            (remainingSeconds / lockDurationSeconds) * 100
          )
        )
      : 0;
  const isDisabled = loginStatus !== "ready" || locked || isPending;

  return (
    <div
      data-admin-shell
      data-admin-login-shell
      className="relative flex min-h-screen min-h-dvh w-full flex-col justify-between bg-[#F6F7FD] p-6 font-sans text-[#12201B] sm:px-10 sm:py-8"
    >
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0F6B52] text-sm font-extrabold tracking-tight text-white shadow-sm">
            PC
          </div>
          <div>
            <p className="text-base font-extrabold tracking-tight text-[#12201B]">
              PLAN C
            </p>
            <p className="text-[11px] text-[#5D6B65]">
              Cleaning &amp; Pest Control
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl border border-[#E3E8E5] bg-white px-4 py-2 text-[13px] font-semibold text-[#5D6B65] transition-colors hover:text-[#12201B]"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          <span>Back to website</span>
        </Link>
      </header>

      <main className="relative z-10 mx-auto my-auto w-full max-w-[430px] py-8">
        <div className="space-y-6 rounded-[24px] border border-[#E5E9E8] bg-white p-8 shadow-[0_20px_56px_rgba(18,32,27,0.09)] sm:p-9">
          <div className="space-y-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E3F2EC] text-[#0F6B52]">
              <LockKeyhole className="h-5 w-5" aria-hidden="true" />
            </div>
            <h1 className="pt-1 text-[24px] font-extrabold tracking-tight text-[#12201B]">
              Admin sign in
            </h1>
            <p className="text-[13.5px] leading-relaxed text-[#5D6B65]">
              Enter your password to access the PLAN C operations dashboard.
            </p>
          </div>

          {locked && (
            <div
              role="status"
              aria-live="polite"
              className="space-y-3 rounded-xl border border-amber-300 bg-amber-50 p-4 text-amber-950"
            >
              <p className="text-sm font-semibold">
                Too many attempts. Try again in{" "}
                <span className="font-mono tabular-nums">
                  {formatCountdown(remainingSeconds)}
                </span>
              </p>
              {lockDurationSeconds !== null && (
                <div
                  role="progressbar"
                  aria-label="Login lockout time remaining"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={Math.round(progress)}
                  className="h-2 overflow-hidden rounded-full bg-amber-200"
                >
                  <div
                    className="h-full rounded-full bg-amber-700 transition-[width] duration-700 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
            </div>
          )}

          {!locked && notice && (
            <p role="status" aria-live="polite" className="text-sm font-medium text-[#0F6B52]">
              {notice}
            </p>
          )}

          {error && (
            <div
              role="alert"
              className="flex items-center gap-2.5 rounded-xl border border-[#FECACA] bg-[#FEF2F2] p-3 text-[13px] text-[#991B1B]"
            >
              <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="font-medium">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="admin-password"
                className="block text-xs font-bold uppercase tracking-wider text-[#5D6B65]"
              >
                Password
              </label>
              <div className="relative">
                <input
                  ref={passwordInputRef}
                  id="admin-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  disabled={isDisabled}
                  value={passcode}
                  onChange={(event) => {
                    setPasscode(event.target.value);
                    setError(null);
                  }}
                  placeholder="Enter your password"
                  className="w-full rounded-xl border border-[#CDD5D0] bg-white px-3.5 py-3 pr-12 text-sm text-[#12201B] outline-none transition focus:border-[#0F6B52] focus:ring-2 focus:ring-[#0F6B52]/20 disabled:cursor-not-allowed disabled:bg-[#F1F4F2] disabled:text-[#5D6B65] placeholder:text-[#77847D]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  disabled={isDisabled}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#5D6B65] transition-colors hover:text-[#12201B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F6B52] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" aria-hidden="true" />
                  ) : (
                    <Eye className="h-4 w-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isDisabled || !passcode}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#0F6B52] px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#0B5944] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0F6B52] disabled:cursor-not-allowed disabled:opacity-55"
            >
              <span>
                {loginStatus === "loading"
                  ? "Checking sign-in status..."
                  : isPending
                    ? "Signing in..."
                    : "Sign in"}
              </span>
              {!isPending && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
            </button>
          </form>

          <div className="flex items-center justify-center gap-1.5 border-t border-[#E3E8E5] pt-4 text-center text-xs text-[#5D6B65]">
            <ShieldCheck className="h-4 w-4 text-[#0F6B52]" aria-hidden="true" />
            <span>Secure, encrypted admin session</span>
          </div>
        </div>
      </main>

      <footer className="relative z-10 text-center text-xs text-[#5D6B65]">
        PLAN C Cleaning Solutions · Thrikannapuram, Thiruvananthapuram, Kerala
      </footer>
    </div>
  );
}
