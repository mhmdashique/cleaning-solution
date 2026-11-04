import { Metadata } from "next";
import { getServices } from "@/lib/data/store";
import ServicesDirectory from "@/components/services/ServicesDirectory";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Professional Cleaning & Pest Control Services in Kerala",
  description:
    "Explore our complete directory of 24+ cleaning and pest control services in Thiruvananthapuram. Full house deep cleaning, water tank sanitisation, sofa shampooing, termite eradication & more.",
  keywords: [
    "cleaning services Trivandrum",
    "pest control services Kerala",
    "deep cleaning services list",
    "water tank cleaning Thiruvananthapuram",
    "anti termite treatment Kerala",
  ],
};

export const revalidate = 60;

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const resolvedParams = await searchParams;
  const initialCategory = resolvedParams?.cat || "all";
  const services = await getServices();

  return (
    <div className="bg-slate-50 min-h-screen py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Breadcrumb & Header */}
        <div className="space-y-4">
          <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/" className="hover:text-brand-700">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-brand-900 font-bold">Services</span>
          </nav>

          <div className="max-w-3xl space-y-3">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">
              Complete Service Directory
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Cleaning & Pest Control Services in Kerala
            </h1>
            <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
              With over 5 years of industry leadership in Thiruvananthapuram, PLAN C offers comprehensive residential, commercial, and outdoor solutions. Filter by category or search below.
            </p>
          </div>
        </div>

        {/* Directory component with category filter and search */}
        <ServicesDirectory
          services={services}
          initialCategory={initialCategory}
        />

      </div>
    </div>
  );
}

