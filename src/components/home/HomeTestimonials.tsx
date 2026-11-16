"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Review } from "@/types";
import { Star, MapPin, ArrowRight } from "lucide-react";

export default function HomeTestimonials({ reviews }: { reviews: Review[] }) {
  // Only showcase 4- and 5-star reviews, up to 8 (3 pages of 3)
  const items = reviews.filter((r) => r.rating >= 4).slice(0, 8);
  const perPage = 3;
  const pages = Math.max(1, Math.ceil(items.length / perPage));

  // Rating summary is computed from the real approved reviews only.
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        ).toFixed(1)
      : null;

  const [page, setPage] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (pages <= 1 || paused) return;
    const id = setInterval(() => {
      setPage((p) => (p + 1) % pages);
    }, 4000);
    return () => clearInterval(id);
  }, [pages, paused]);

  return (
    <section className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mx-auto mb-12 max-w-3xl space-y-3 text-center">
          <div className="space-y-3">
            <p className="text-xs font-semibold text-brand-700">
              Client Feedback
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Feedback from Kerala Residents
            </h2>
            <p className="mx-auto max-w-2xl text-sm leading-relaxed text-slate-500">
              Verified experiences from families and corporate facilities in Pattom, Kowdiar, Technopark, and across Trivandrum.
            </p>
          </div>

          <Link
            href="/reviews"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-800 transition-colors hover:text-brand-900"
          >
            <span>View All Reviews</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* Auto-scrolling carousel — 3 reviews per page, advances every 4s */}
        {items.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-14 text-center">
            <p className="text-sm font-semibold text-slate-900">
              No published reviews yet
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Verified client feedback appears here once it is approved by our
              operations team.
            </p>
            <Link
              href="/reviews#write-review"
              className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-brand-700 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-brand-800"
            >
              Submit Feedback
            </Link>
          </div>
        ) : (
          <>
          <div
            className="overflow-hidden"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${page * 100}%)` }}
          >
            {Array.from({ length: pages }).map((_, pi) => (
              <div
                key={pi}
                className="grid w-full shrink-0 grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
              >
                {items.slice(pi * perPage, pi * perPage + perPage).map((review) => (
                  <article
                    key={review.id}
                    className="flex min-h-[260px] flex-col justify-between rounded-2xl border border-slate-200 bg-white p-7 shadow-soft transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-soft-lg"
                  >
                    <div className="space-y-4">
                      {/* Stars (only 4 & 5 are shown) */}
                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-200"
                            }`}
                          />
                        ))}
                      </div>

                      <p className="text-sm leading-7 text-slate-600">
                        &ldquo;{review.comment}&rdquo;
                      </p>
                    </div>

                    <div className="mt-6 border-t border-slate-100 pt-5">
                      <div className="flex items-center gap-3">
                        <div
                          aria-hidden="true"
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-brand-500 bg-brand-50 text-xs font-bold text-brand-800"
                        >
                          {review.name
                            .split(/\s+/)
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join("")
                            .toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <h4 className="truncate text-sm font-semibold text-slate-900">
                            {review.name}
                          </h4>
                          <p className="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                            <MapPin className="h-3 w-3 shrink-0 text-brand-600" />
                            {review.location}
                          </p>
                          {review.service_name && (
                            <p className="mt-1 truncate text-[11px] font-medium text-brand-700">
                              {review.service_name}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Page dots */}
        {pages > 1 && (
          <div className="mt-6 flex items-center justify-center gap-2">
            {Array.from({ length: pages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                aria-label={`Go to review page ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === page ? "w-6 bg-brand-700" : "w-2 bg-slate-300 hover:bg-slate-400"
                }`}
              />
            ))}
          </div>
        )}
          </>
        )}

        {/* Rating summary — quiet panel */}
        <div className="mt-10 flex flex-col items-center justify-between gap-5 rounded-3xl border border-brand-100 bg-brand-50 px-7 py-6 sm:flex-row">
          <div className="flex items-center gap-4 text-center sm:text-left">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-700 text-lg font-bold text-white">
              {averageRating ?? "—"}
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                {averageRating
                  ? `Rated ${averageRating}/5 by verified clients`
                  : "No published ratings yet"}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                Independent client evaluations across cleaning and integrated pest control services.
              </p>
            </div>
          </div>

          <Link
            href="/reviews#write-review"
            className="shrink-0 rounded-full bg-brand-700 px-5 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-brand-800"
          >
            Submit Feedback
          </Link>
        </div>

      </div>
    </section>
  );
}
