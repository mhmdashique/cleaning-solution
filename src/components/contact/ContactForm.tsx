"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import confetti from "canvas-confetti";
import Link from "next/link";
import { Service } from "@/types";
import { submitBookingAction } from "@/app/actions/booking";
import { 
  Sparkles, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Phone, 
  MapPin, 
  ArrowRight,
  ShieldCheck
} from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Full name is required (min 2 characters)"),
  phone: z.string().min(10, "Please enter a valid 10-digit phone number"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  service_name: z.string().min(1, "Please select a service"),
  preferred_date: z.string().optional(),
  address: z.string().min(5, "Please provide your street or landmark in Kerala"),
  message: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function ContactForm({ services }: { services: Service[] }) {
  const searchParams = useSearchParams();
  const preselectedService = searchParams.get("service") || "";

  const [bookingSuccess, setBookingSuccess] = useState<{
    code: string;
    message: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      service_name: preselectedService || "",
      preferred_date: "",
      address: "",
      message: "",
    },
  });

  useEffect(() => {
    if (preselectedService) {
      setValue("service_name", preselectedService);
    }
  }, [preselectedService, setValue]);

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("phone", data.phone);
    formData.append("email", data.email || "");
    formData.append("service_name", data.service_name);
    formData.append("preferred_date", data.preferred_date || "");
    formData.append("address", data.address);
    formData.append("message", data.message || "");
    formData.append("hp_field", ""); // Honeypot empty

    const res = await submitBookingAction(formData);
    setIsSubmitting(false);

    if (res.success && res.booking_code) {
      setBookingSuccess({
        code: res.booking_code,
        message: res.message || "Booking created successfully!",
      });

      // Confetti burst
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#15803d", "#22c55e", "#facc15", "#166534"],
        });
      } catch {
        // ignore if canvas not supported
      }
    } else {
      setErrorMessage(res.error || "An unexpected error occurred.");
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-soft">
      {bookingSuccess ? (
        <div className="text-center py-8 space-y-6 animate-in fade-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
              Booking Received
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Thank You! We Have Scheduled Your Service
            </h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Our operations lead will call you shortly on your provided mobile number to confirm the exact arrival slot.
            </p>
          </div>

          {/* Booking Code Card */}
          <div className="max-w-sm mx-auto p-5 rounded-2xl bg-slate-50 border-2 border-dashed border-brand-300 text-center space-y-1">
            <p className="text-xs text-slate-500 font-medium">Your Unique Booking ID</p>
            <p className="text-2xl font-extrabold font-mono text-brand-900 tracking-wider">
              {bookingSuccess.code}
            </p>
            <p className="text-[11px] text-slate-400">Save this code for instant tracking</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href={`/track?code=${bookingSuccess.code}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-700 text-white font-bold text-sm shadow-md hover:bg-brand-800 transition-colors"
            >
              <span>Track Booking Status</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <button
              onClick={() => setBookingSuccess(null)}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-colors"
            >
              Book Another Service
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-100 text-brand-800 border border-brand-200">
              <Sparkles className="w-3.5 h-3.5" /> Fast Response Guaranteed
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Schedule Your Cleaning Service
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Fill in your details below. No advance payment required.
            </p>
          </div>

          {errorMessage && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-3 text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Hidden Honeypot for spam bots */}
          <input
            type="text"
            name="hp_field"
            style={{ display: "none" }}
            tabIndex={-1}
            autoComplete="off"
          />

          {/* Row 1: Name & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Full Name *
              </label>
              <input
                type="text"
                {...register("name")}
                placeholder="e.g. Your full name"
                className={`w-full px-4 py-3.5 rounded-2xl bg-slate-50 border text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 ${
                  errors.name
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-200 focus:border-brand-600"
                }`}
              />
              {errors.name && (
                <p className="text-[11px] text-red-600 font-medium">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Mobile Number *
              </label>
              <input
                type="tel"
                {...register("phone")}
                placeholder="e.g. 9876543210"
                className={`w-full px-4 py-3.5 rounded-2xl bg-slate-50 border text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 ${
                  errors.phone
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-200 focus:border-brand-600"
                }`}
              />
              {errors.phone && (
                <p className="text-[11px] text-red-600 font-medium">
                  {errors.phone.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Email & Service */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Email Address (Optional)
              </label>
              <input
                type="email"
                {...register("email")}
                placeholder="you@example.com"
                className={`w-full px-4 py-3.5 rounded-2xl bg-slate-50 border text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 ${
                  errors.email
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-200 focus:border-brand-600"
                }`}
              />
              {errors.email && (
                <p className="text-[11px] text-red-600 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Choose Service *
              </label>
              <select
                {...register("service_name")}
                className={`w-full px-4 py-3.5 rounded-2xl bg-slate-50 border text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 ${
                  errors.service_name
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-200 focus:border-brand-600"
                }`}
              >
                <option value="">Select a service...</option>
                <optgroup label="Cleaning Services">
                  {services
                    .filter((s) => s.category === "cleaning")
                    .map((s) => (
                      <option key={s.slug} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Pest Control Services">
                  {services
                    .filter((s) => s.category === "pest_control")
                    .map((s) => (
                      <option key={s.slug} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                </optgroup>
                <optgroup label="Commercial & Specialised">
                  {services
                    .filter((s) => s.category === "commercial" || s.category === "specialised")
                    .map((s) => (
                      <option key={s.slug} value={s.title}>
                        {s.title}
                      </option>
                    ))}
                </optgroup>
              </select>
              {errors.service_name && (
                <p className="text-[11px] text-red-600 font-medium">
                  {errors.service_name.message}
                </p>
              )}
            </div>
          </div>

          {/* Row 3: Preferred Date & Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Preferred Date (Optional)
              </label>
              <input
                type="date"
                {...register("preferred_date")}
                min={new Date().toISOString().split("T")[0]}
                className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Address / Landmark in Kerala *
              </label>
              <input
                type="text"
                {...register("address")}
                placeholder="e.g. TC 14/1205, Kowdiar, Trivandrum"
                className={`w-full px-4 py-3.5 rounded-2xl bg-slate-50 border text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 ${
                  errors.address
                    ? "border-red-400 focus:border-red-500"
                    : "border-slate-200 focus:border-brand-600"
                }`}
              />
              {errors.address && (
                <p className="text-[11px] text-red-600 font-medium">
                  {errors.address.message}
                </p>
              )}
            </div>
          </div>

          {/* Message / Special Instructions */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Specific Instructions or Details (Optional)
            </label>
            <textarea
              {...register("message")}
              rows={3}
              placeholder="e.g. 3BHK villa, hard water stains in 2 bathrooms, prefer morning 9 AM slot..."
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600"
            />
          </div>

          {/* Submit CTA */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-brand-700 to-brand-800 hover:from-brand-800 hover:to-brand-900 disabled:opacity-70 text-white font-bold text-base shadow-lg shadow-brand-900/15 hover:shadow-xl transition-all active:scale-[0.99]"
          >
            <Sparkles className="w-5 h-5 text-accent-yellow" />
            <span>{isSubmitting ? "Submitting Booking..." : "Confirm Booking Request"}</span>
          </button>

          <div className="pt-2 flex items-center justify-center gap-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <span>Zero spam guarantee • 100% data confidentiality</span>
          </div>
        </form>
      )}
    </div>
  );
}

