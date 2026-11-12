"use client";

import { useState, useTransition, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Booking, BookingStatus } from "@/types";
import { 
  trackBookingAction, 
  requestRescheduleAction, 
  cancelBookingAction 
} from "@/app/actions/track";
import Link from "next/link";
import { 
  Search, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  Calendar, 
  MapPin, 
  Phone, 
  User, 
  AlertCircle, 
  Sparkles,
  IndianRupee,
  RefreshCw,
  Star
} from "lucide-react";
import { formatCurrency } from "@/lib/formatCurrency";

export default function TrackClient() {
  const searchParams = useSearchParams();
  const initialCode = searchParams.get("code") || "";
  const initialPhone = searchParams.get("phone") || "";

  const [bookingCode, setBookingCode] = useState(initialCode);
  const [phone, setPhone] = useState(initialPhone);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleReason, setRescheduleReason] = useState("");
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [showReschedule, setShowReschedule] = useState(false);

  const [isPending, startTransition] = useTransition();

  // When opened from the admin booking page, load the customer's details automatically.
  useEffect(() => {
    if (!initialCode || !initialPhone) return;
    let cancelled = false;
    startTransition(async () => {
      const res = await trackBookingAction(initialCode, initialPhone);
      if (cancelled) return;
      if (res.success && res.booking) {
        setBooking(res.booking);
      } else {
        setError(res.error || "Booking not found.");
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialCode, initialPhone]);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setActionMessage(null);

    startTransition(async () => {
      const res = await trackBookingAction(bookingCode, phone);
      if (res.success && res.booking) {
        setBooking(res.booking);
      } else {
        setError(res.error || "Booking not found.");
        setBooking(null);
      }
    });
  };

  const handleReschedule = () => {
    if (!booking || !rescheduleDate) return;
    startTransition(async () => {
      const res = await requestRescheduleAction(
        booking.booking_code,
        rescheduleDate,
        rescheduleReason
      );
      if (res.success) {
        setActionMessage(res.message || "Reschedule requested!");
        setShowReschedule(false);
      }
    });
  };

  const handleCancel = () => {
    if (!booking) return;
    const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmCancel) return;

    startTransition(async () => {
      const res = await cancelBookingAction(booking.booking_code, "Customer requested cancellation");
      if (res.success) {
        setActionMessage(res.message || "Booking cancelled.");
        setBooking({ ...booking, status: "Cancelled" as BookingStatus });
      }
    });
  };

  // Status visual steps
  const steps: BookingStatus[] = ["Pending", "Confirmed", "In progress", "Completed"];
  const currentStepIndex = booking ? steps.indexOf(booking.status) : -1;

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      
      {/* Lookup Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-soft space-y-6">
        <div className="space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-100 text-brand-800 border border-brand-200">
            <Sparkles className="w-3.5 h-3.5" /> Self-Service Tracking
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Track Your Service in Real-Time
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Enter your Booking ID (e.g. PC-2026-1234) and the registered phone
            number.
          </p>
        </div>

        {error && (
          <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-3 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleTrack} className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-5 space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Booking ID *
            </label>
            <input
              type="text"
              required
              value={bookingCode}
              onChange={(e) => setBookingCode(e.target.value)}
              placeholder="e.g. PC-2026-1234"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm uppercase font-mono font-bold focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600"
            />
          </div>

          <div className="sm:col-span-5 space-y-1">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Mobile Number *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. 9876543210"
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600"
            />
          </div>

          <div className="sm:col-span-2 flex items-end">
            <button
              type="submit"
              disabled={isPending}
              className="w-full py-3.5 px-4 rounded-2xl bg-brand-700 hover:bg-brand-800 disabled:opacity-70 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>{isPending ? "Tracking..." : "Track"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Booking Details Result Display */}
      {booking && (
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-soft-lg space-y-8 animate-in fade-in duration-300">
          
          {/* Header & Status Pill */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-brand-700">
                {booking.booking_code}
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900">
                {booking.service_name}
              </h3>
              <p className="text-xs text-slate-500">
                Created on {new Date(booking.created_at).toLocaleDateString("en-IN", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-4 py-2 rounded-2xl text-xs font-bold uppercase tracking-wider ${
                  booking.status === "Completed"
                    ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                    : booking.status === "In progress"
                    ? "bg-blue-100 text-blue-800 border border-blue-200 animate-pulse"
                    : booking.status === "Confirmed"
                    ? "bg-purple-100 text-purple-800 border border-purple-200"
                    : booking.status === "Cancelled"
                    ? "bg-red-100 text-red-800 border border-red-200"
                    : "bg-amber-100 text-amber-800 border border-amber-200"
                }`}
              >
                ● Status: {booking.status}
              </span>
            </div>
          </div>

          {/* Stepper Progress Bar (Only shown for non-cancelled) */}
          {booking.status !== "Cancelled" && (
            <div className="py-2">
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {steps.map((st, idx) => {
                  const isDone = currentStepIndex >= idx;
                  const isCurrent = currentStepIndex === idx;
                  return (
                    <div key={st} className="space-y-2">
                      <div className="relative flex items-center justify-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                            isDone
                              ? "bg-brand-700 text-white shadow-md shadow-brand-900/20"
                              : "bg-slate-100 text-slate-400"
                          } ${isCurrent ? "ring-4 ring-brand-100" : ""}`}
                        >
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                      </div>
                      <span
                        className={`block font-bold text-[11px] sm:text-xs ${
                          isDone ? "text-slate-900" : "text-slate-400"
                        }`}
                      >
                        {st}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Key Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-200 text-sm">
            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5" /> Customer Name
              </span>
              <p className="font-bold text-slate-900">{booking.name}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5" /> Registered Phone
              </span>
              <p className="font-bold text-slate-900">{booking.phone}</p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> Scheduled Date
              </span>
              <p className="font-bold text-slate-900">
                {booking.preferred_date || "To be confirmed by operations"}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5" /> Assigned Specialist Team
              </span>
              <p className="font-bold text-brand-800">
                {booking.assigned_team || "Team Plan C Quick Response"}
              </p>
            </div>

            {booking.amount !== undefined && booking.amount !== null && (
              <div className="space-y-1">
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <IndianRupee className="w-3.5 h-3.5" /> Confirmed Amount
                </span>
                <p className="font-bold text-brand-800">
                  {formatCurrency(booking.amount)}
                </p>
              </div>
            )}

            <div className="sm:col-span-2 space-y-1 pt-2 border-t border-slate-200">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Service Address
              </span>
              <p className="font-medium text-slate-800">{booking.address}</p>
            </div>

            {booking.admin_notes && (
              <div className="sm:col-span-2 p-3 bg-brand-50 rounded-xl border border-brand-200 text-xs text-brand-900">
                <strong>Operations Note:</strong> {booking.admin_notes}
              </div>
            )}
          </div>

          {actionMessage && (
            <div className="p-4 rounded-2xl bg-brand-50 border border-brand-200 text-brand-900 text-sm">
              {actionMessage}
            </div>
          )}

          {/* Action Row */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
            {booking.status === "Completed" ? (
              <div className="w-full p-4 rounded-2xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <h4 className="font-bold text-sm text-amber-950 flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                    How was your experience?
                  </h4>
                  <p className="text-xs text-amber-900">
                    Your service has been marked completed. Please leave a quick review!
                  </p>
                </div>
                <Link
                  href="/reviews#write-review"
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm flex-shrink-0"
                >
                  Write Review
                </Link>
              </div>
            ) : booking.status !== "Cancelled" ? (
              <>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowReschedule(!showReschedule)}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Request Reschedule</span>
                  </button>

                  <button
                    onClick={handleCancel}
                    className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition-colors flex items-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Cancel Booking</span>
                  </button>
                </div>

                <a
                  href="tel:7994342372"
                  className="text-xs font-bold text-brand-700 hover:underline flex items-center gap-1"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Need urgent help? Call 7994342372</span>
                </a>
              </>
            ) : null}
          </div>

          {/* Reschedule Drawer */}
          {showReschedule && (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in duration-200">
              <h4 className="font-bold text-sm text-slate-900">
                Choose New Preferred Date
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                />
                <input
                  type="text"
                  placeholder="Reason (e.g. traveling, plumbing delay)..."
                  value={rescheduleReason}
                  onChange={(e) => setRescheduleReason(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleReschedule}
                  disabled={!rescheduleDate || isPending}
                  className="px-5 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 disabled:opacity-50 text-white font-bold text-xs"
                >
                  Confirm Reschedule
                </button>
                <button
                  onClick={() => setShowReschedule(false)}
                  className="px-4 py-2 rounded-xl bg-slate-200 text-slate-700 font-bold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
