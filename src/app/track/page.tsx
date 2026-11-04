import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import TrackClient from "@/components/track/TrackClient";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Track Booking Status | PLAN C Cleaning Solutions",
  description:
    "Track the live status of your cleaning or pest control service in Thiruvananthapuram without needing to create an account. View arrival time, assigned team, and request rescheduling.",
};

export default function TrackPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Link href="/" className="hover:text-brand-700">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-brand-900 font-bold">Track Booking</span>
        </nav>

        {/* Client tracker */}
        <Suspense fallback={<div className="p-8 text-center bg-white rounded-3xl">Loading tracker...</div>}>
          <TrackClient />
        </Suspense>

      </div>
    </div>
  );
}

