"use client";

import { useState, useTransition } from "react";
import { Review, Service } from "@/types";
import { submitReviewAction } from "@/app/actions/review";
import { 
  Star, 
  MapPin, 
  Quote, 
  CheckCircle2, 
  Sparkles, 
  Send,
  Check,
  AlertCircle
} from "lucide-react";

export default function ReviewsClient({
  reviews,
  services,
}: {
  reviews: Review[];
  services: Service[];
}) {
  const [selectedRating, setSelectedRating] = useState<number | "all">("all");
  const [formRating, setFormRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [formStatus, setFormStatus] = useState<{
    success?: boolean;
    message?: string;
  } | null>(null);

  const [isPending, startTransition] = useTransition();

  // Compute breakdown
  const total = reviews.length;
  const ratingCounts = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };

  const averageScore =
    total > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / total : null;
  const averageRating = averageScore !== null ? averageScore.toFixed(1) : "—";

  const filteredReviews = reviews.filter((r) => {
    if (selectedRating === "all") return true;
    return r.rating === selectedRating;
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("rating", formRating.toString());

    startTransition(async () => {
      const res = await submitReviewAction(formData);
      if (res.success) {
        setFormStatus({ success: true, message: res.message });
        form.reset();
        setFormRating(5);
      } else {
        setFormStatus({ success: false, message: res.error });
      }
    });
  };

  return (
    <div className="space-y-16">
      
      {/* Rating Overview & Breakdown Card */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-soft">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Average Rating (Col 5) */}
          <div className="lg:col-span-5 text-center lg:text-left space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-100 text-brand-800 border border-brand-200">
              Verified Ratings
            </div>
            <div className="flex items-center justify-center lg:justify-start gap-3">
              <span className="font-extrabold text-5xl sm:text-6xl text-slate-900 tracking-tight">
                {averageRating}
              </span>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        averageScore !== null && i < Math.round(averageScore)
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  {total > 0
                    ? `Based on ${total} local Kerala review${total !== 1 ? "s" : ""}`
                    : "No published reviews yet"}
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-500 max-w-sm mx-auto lg:mx-0 leading-relaxed">
              Every review represents genuine residential or commercial clients in Thiruvananthapuram and nearby districts.
            </p>
          </div>

          {/* Star Distribution Bars (Col 7) */}
          <div className="lg:col-span-7 space-y-2.5">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = ratingCounts[stars as keyof typeof ratingCounts] || 0;
              const percent = total > 0 ? (count / total) * 100 : 0;
              return (
                <div key={stars} className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 w-14 font-semibold text-slate-700">
                    <span>{stars}</span>
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  </div>
                  <div className="flex-1 h-3 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-brand-600 rounded-full transition-all duration-500"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <span className="w-8 text-right font-mono text-slate-400">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>

        </div>

        {/* Filter Pills */}
        <div className="pt-8 mt-8 border-t border-slate-100 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <span className="text-xs font-bold text-slate-500 mr-2 flex-shrink-0">
            Filter:
          </span>
          <button
            onClick={() => setSelectedRating("all")}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
              selectedRating === "all"
                ? "bg-brand-700 text-white"
                : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            All ({total})
          </button>
          {[5, 4, 3].map((star) => (
            <button
              key={star}
              onClick={() => setSelectedRating(star)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap flex items-center gap-1 transition-colors ${
                selectedRating === star
                  ? "bg-brand-700 text-white"
                  : "bg-slate-100 text-slate-700 hover:bg-slate-200"
              }`}
            >
              <span>{star} Stars</span>
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>({ratingCounts[star as keyof typeof ratingCounts] || 0})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Grid */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            Customer Testimonials ({filteredReviews.length})
          </h2>
          <a
            href="#write-review"
            className="text-xs font-bold text-brand-700 hover:text-brand-900"
          >
            + Write a Review
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-3xl p-7 border border-slate-200 shadow-soft hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-brand-200" />
                </div>

                <p className="text-sm text-slate-700 leading-relaxed italic">
                  &quot;{review.comment}&quot;
                </p>
              </div>

              <div className="pt-5 mt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      {review.name}
                      <CheckCircle2 className="w-3.5 h-3.5 text-brand-600" />
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {review.location}
                    </p>
                  </div>
                  {review.service_name && (
                    <span className="text-[11px] font-semibold text-brand-800 bg-brand-50 px-2.5 py-1 rounded-full max-w-[130px] truncate border border-brand-100">
                      {review.service_name}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* "Write a Review" Form Section */}
      <div id="write-review" className="scroll-mt-28 bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 shadow-soft">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-100 text-brand-800 border border-brand-200">
              <Sparkles className="w-3.5 h-3.5" /> Share Your Experience
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              Write a Review for PLAN C
            </h3>
            <p className="text-xs sm:text-sm text-slate-600">
              Your honest feedback helps your neighbors in Kerala make informed decisions and helps us maintain our quality bar.
            </p>
          </div>

          {formStatus && !formStatus.success && (
            <div
              role="alert"
              aria-live="assertive"
              className="p-4 rounded-2xl flex items-start gap-3 text-sm bg-red-50 text-red-900 border border-red-200"
            >
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">{formStatus.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Star Picker */}
            <div className="space-y-1.5 text-center sm:text-left">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Your Rating *
              </label>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setFormRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 focus:outline-none transition-transform hover:scale-110"
                    aria-label={`Rate ${star} stars`}
                  >
                    <Star
                      className={`w-7 h-7 ${
                        star <= (hoverRating || formRating)
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-300"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-xs font-bold text-slate-600">
                  {formRating} / 5 Stars
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="e.g. Your name"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-700">
                  Location in Kerala *
                </label>
                <input
                  type="text"
                  name="location"
                  required
                  placeholder="e.g. Kowdiar, Thiruvananthapuram"
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                Service Availed
              </label>
              <select
                name="service_name"
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600"
              >
                <option value="">Select service (optional)</option>
                {services.map((s) => (
                  <option key={s.slug} value={s.title}>
                    {s.title}
                  </option>
                ))}
                <option value="Pest Control">Pest Control General</option>
                <option value="Other Service">Other Custom Service</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">
                Your Review *
              </label>
              <textarea
                name="comment"
                required
                rows={4}
                placeholder="Tell us about the punctuality, equipment used, and results of the cleaning..."
                className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600"
              />
            </div>

            <p className="text-[11px] text-slate-500">
              * Submissions are verified by our team before going live to prevent spam.
            </p>

            <button
              type="submit"
              disabled={isPending}
              className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-brand-700 hover:bg-brand-800 disabled:opacity-70 text-white font-bold text-sm shadow-md transition-all active:scale-[0.99]"
            >
              <Send className="w-4 h-4" />
              <span>{isPending ? "Submitting..." : "Submit Review"}</span>
            </button>
          </form>
        </div>
      </div>

      {formStatus?.success && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-success-title"
            aria-describedby="review-success-message"
            className="w-full max-w-md rounded-3xl border border-brand-100 bg-white px-7 py-8 text-center shadow-2xl sm:px-9"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-700">
              <Check className="h-8 w-8" />
            </div>
            <h2
              id="review-success-title"
              className="mt-5 text-xl font-extrabold text-slate-900"
            >
              Thank you for your valuable feedback!
            </h2>
            <p
              id="review-success-message"
              className="mt-3 text-sm leading-relaxed text-slate-600"
            >
              {formStatus.message}
            </p>
            <button
              type="button"
              autoFocus
              onClick={() => setFormStatus(null)}
              className="mt-7 inline-flex min-w-32 items-center justify-center rounded-xl bg-brand-700 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-800 focus:outline-none focus:ring-2 focus:ring-brand-600 focus:ring-offset-2"
            >
              Done
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

