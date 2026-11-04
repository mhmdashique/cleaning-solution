import { Metadata } from "next";
import Link from "next/link";
import { getPublishedBlogPosts } from "@/lib/data/store";
import BlogList from "@/components/blog/BlogList";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Cleaning & Pest Control Guides | PLAN C Kerala Blog",
  description:
    "Expert tips, checklists, and seasonal guides for homeowners and businesses in Kerala. Deep cleaning tips, termite prevention, water tank maintenance, and pest solutions.",
  keywords: [
    "cleaning blog Kerala",
    "pest control tips Trivandrum",
    "deep cleaning checklist",
    "termite control Kerala",
    "water tank hygiene tips",
  ],
};

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();

  return (
    <div className="bg-slate-50 min-h-screen py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumb & Header */}
        <div className="space-y-4">
          <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/" className="hover:text-brand-700">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-brand-900 font-bold">Blog</span>
          </nav>

          <div className="max-w-3xl space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">
              Expert Knowledge Base
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Cleaning & Pest Control Guides for Kerala
            </h1>
            <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
              Tailored specifically for Kerala&apos;s humid climate, red laterite soil, and hard borewell water. Learn how to safeguard your property and maintain pristine hygiene.
            </p>
          </div>
        </div>

        {/* Blog Listing Component */}
        <BlogList posts={posts} />

      </div>
    </div>
  );
}

