import { Metadata } from "next";
import Link from "next/link";
import { getServices } from "@/lib/data/store";
import ContactSection from "@/components/contact/ContactSection";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Book Cleaning & Pest Control | Contact PLAN C Kerala",
  description:
    "Schedule your professional cleaning or pest control service in Thiruvananthapuram. Same day dispatch available. Call 7994342372 or book online.",
};

export default async function ContactPage() {
  const services = await getServices();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Breadcrumb bar */}
      <div className="border-b border-slate-200/70 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-xs font-medium text-slate-500"
          >
            <Link href="/" className="hover:text-brand-700">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-bold text-brand-900">Book &amp; Contact</span>
          </nav>
        </div>
      </div>

      <ContactSection services={services} headingLevel="h1" />
    </div>
  );
}
