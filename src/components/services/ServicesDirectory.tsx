"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Service, ServiceCategory } from "@/types";
import { 
  Sparkles, 
  Search, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Filter,
  Phone
} from "lucide-react";

const CATEGORY_IDS = [
  "all",
  "cleaning",
  "pest_control",
  "commercial",
  "specialised",
] as const;

function normalizeCategory(value?: string): string {
  if (!value) return "all";
  const normalized = value.trim().toLowerCase().replace(/[\s-]+/g, "_");
  return (CATEGORY_IDS as readonly string[]).includes(normalized)
    ? normalized
    : "all";
}

export default function ServicesDirectory({
  services,
  initialCategory = "all",
}: {
  services: Service[];
  initialCategory?: string;
}) {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    normalizeCategory(initialCategory)
  );
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setSelectedCategory(normalizeCategory(initialCategory));
  }, [initialCategory]);

  const categories = [
    { id: "all", label: "All Services" },
    { id: "cleaning", label: "Cleaning" },
    { id: "pest_control", label: "Pest Control" },
    { id: "commercial", label: "Commercial" },
    { id: "specialised", label: "Specialised" },
  ];

  const filteredServices = useMemo(() => {
    return services.filter((service) => {
      const matchesCategory =
        selectedCategory === "all" ||
        normalizeCategory(service.category) === selectedCategory;
      const matchesSearch =
        service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.short_desc.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [services, selectedCategory, searchQuery]);

  return (
    <div className="space-y-12">
      {/* Category Pills & Search Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-4 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-soft">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat.id
                  ? "bg-brand-700 text-white shadow-md shadow-brand-900/15"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search service (e.g. termite, tank)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600 text-sm placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Filter className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800">No services found</h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            We couldn&apos;t find any service matching &quot;{searchQuery}&quot;. Please try a different search term or call our helpline.
          </p>
          <a
            href="tel:7994342372"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-700 text-white font-bold text-sm shadow-md"
          >
            <Phone className="w-4 h-4" />
            <span>Call Helpline 7994342372</span>
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => (
            <div
              key={service.slug}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-soft hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Image */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={service.image_url}
                    alt={service.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  
                  {/* Category Pill */}
                  <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/95 text-brand-900 shadow-xs">
                    {service.category.replace("_", " ")}
                  </span>

                  {service.is_featured && (
                    <span className="absolute top-3.5 right-3.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-accent-yellow text-brand-950 shadow-xs flex items-center gap-1">
                      <Sparkles className="w-3 h-3" /> Popular
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-brand-800 transition-colors leading-snug">
                    <Link href={`/services/${service.slug}`}>
                      {service.title}
                    </Link>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                    {service.short_desc}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-6 pt-0 space-y-3">
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <Link
                    href={`/services/${service.slug}`}
                    className="group/link inline-flex items-center gap-1 text-xs font-semibold text-slate-600 transition-colors hover:text-brand-800"
                  >
                    <span>View Details</span>
                    <ArrowRight className="w-3 h-3 transition-transform duration-200 group-hover/link:translate-x-0.5" />
                  </Link>

                  <Link
                    href={`/contact?service=${encodeURIComponent(service.title)}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs shadow-xs transition-colors"
                  >
                    <span>Book Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Trust reassurance banner */}
      <div className="flex flex-col items-center justify-between gap-6 rounded-[28px] border border-brand-100 bg-brand-50 p-8 md:flex-row">
        <div className="space-y-2 text-center md:text-left">
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-brand-700 md:justify-start">
            <ShieldCheck className="w-4 h-4" />
            <span>Guaranteed Quality Across Kerala</span>
          </div>
          <h4 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Can&apos;t find the exact cleaning service you need?
          </h4>
          <p className="max-w-xl text-xs text-slate-600 sm:text-sm">
            We provide bespoke cleaning contracts, specialized stain removal, and combined pest-cleaning packages for large residences and businesses.
          </p>
        </div>

      </div>
    </div>
  );
}

