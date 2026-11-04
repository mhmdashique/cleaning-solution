"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Service } from "@/types";
import ServiceCard from "./ServiceCard";
import { ArrowRight } from "lucide-react";

interface ServicesSectionProps {
  services: Service[];
}

export default function ServicesSection({ services }: ServicesSectionProps) {
  const [activeTab, setActiveTab] = useState<"all" | "cleaning" | "pest_control">("all");

  const filteredServices = useMemo(() => {
    const sorted = [...services].sort((a, b) => a.sort_order - b.sort_order);

    if (activeTab === "all") {
      // Most usable services: featured first, then top sort order, up to 12 (3 rows of 4)
      const featured = sorted.filter((s) => s.is_featured);
      const rest = sorted.filter((s) => !s.is_featured);
      return [...featured, ...rest].slice(0, 12);
    }

    if (activeTab === "cleaning") {
      return sorted.filter(
        (s) =>
          s.category === "cleaning" ||
          s.category === "commercial" ||
          s.category === "specialised"
      );
    }

    return sorted.filter((s) => s.category === "pest_control");
  }, [services, activeTab]);

  return (
    <section className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Centered header */}
        <div className="mx-auto mb-12 max-w-2xl space-y-3 text-center">
          <div className="inline-flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-slate-200" />
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">
              Our Services
            </span>
            <span className="h-px w-8 bg-slate-200" />
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Comprehensive Cleaning &amp; Pest Control Services
          </h2>
          <p className="mx-auto text-[15px] text-slate-500">
            Customized solutions for Kerala homes, offices, and institutional buildings.
          </p>

          {/* Minimal segmented tabs */}
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 p-1 pt-1">
            {[
              { id: "all", label: "All Services" },
              { id: "cleaning", label: "Cleaning" },
              { id: "pest_control", label: "Pest Control" },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 sm:px-5 sm:text-sm ${
                    isActive
                      ? "bg-white text-slate-900 shadow-2xs"
                      : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4 Columns Desktop (one line), 2 Tablet, 1 Mobile Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {filteredServices.map((service, idx) => (
            <ServiceCard key={service.slug} service={service} index={idx} />
          ))}
        </div>

        {/* "View all services" — minimal outline button */}
        <div className="mt-12 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-900 transition-all duration-200 hover:border-slate-900 hover:bg-slate-900 hover:text-white active:scale-[0.98]"
          >
            <span>View all services</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </section>
  );
}
