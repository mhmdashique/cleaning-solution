import { Metadata } from "next";
import Link from "next/link";
import { getApprovedReviews, getServices } from "@/lib/data/store";
import ReviewsClient from "@/components/reviews/ReviewsClient";
import { ChevronRight } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const reviews = await getApprovedReviews().catch(() => []);
  const average =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : null;

  return {
    title: "Customer Reviews & Ratings | PLAN C Cleaning Solutions",
    description:
      average && reviews.length > 0
        ? `Read genuine reviews from homeowners and businesses across Thiruvananthapuram, Kowdiar, Pattom, and Kazhakkoottam. ${average}/5 rating across ${reviews.length} verified reviews.`
        : "Read genuine reviews from homeowners and businesses across Thiruvananthapuram, Kowdiar, Pattom, and Kazhakkoottam.",
  };
}

export const revalidate = 60;

export default async function ReviewsPage() {
  const [reviews, services] = await Promise.all([
    getApprovedReviews(),
    getServices(),
  ]);

  return (
    <div className="bg-slate-50 min-h-screen py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumb & Header */}
        <div className="space-y-4">
          <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/" className="hover:text-brand-700">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-brand-900 font-bold">Reviews</span>
          </nav>

          <div className="max-w-3xl space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">
              Verified Local Testimonials
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              What Kerala Says About PLAN C
            </h1>
            <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
              Read real feedback from our clients across Thiruvananthapuram. We take immense pride in delivering on our promise: &quot;You leave it, we clean it&quot;.
            </p>
          </div>
        </div>

        {/* Client interactive view */}
        <ReviewsClient reviews={reviews} services={services} />

      </div>
    </div>
  );
}

