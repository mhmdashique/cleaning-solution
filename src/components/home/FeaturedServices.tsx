import Link from "next/link";
import ActionLoadingLink from "@/components/ui/ActionLoadingLink";
import Image from "next/image";
import { Service } from "@/types";
import { ArrowRight } from "lucide-react";

export default function FeaturedServices({ services }: { services: Service[] }) {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header without badges */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Comprehensive Cleaning &amp; Pest Control Services
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto">
            From deep sanitisation of Kerala villas to mechanized office floor scrubbing and odorless pest elimination.
          </p>
        </div>

        {/* 6-Grid of Services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service) => (
            <div
              key={service.slug}
              className="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 hover:border-brand-300 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col"
            >
              {/* Image without category badge */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <Image
                  src={service.image_url}
                  alt={service.title}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                />
              </div>

              {/* Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-800 transition-colors leading-snug">
                    <Link href={`/services/${service.slug}`}>
                      {service.title}
                    </Link>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {service.short_desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                  <ActionLoadingLink
                    href={`/services/${service.slug}`}
                    loadingLabel={`Opening ${service.title}...`}
                    showInlineSpinner
                    className="text-xs font-semibold text-slate-500 hover:text-slate-900"
                  >
                    View Details
                  </ActionLoadingLink>

                  <ActionLoadingLink
                    href={`/contact?service=${encodeURIComponent(service.title)}`}
                    loadingLabel={`Booking ${service.title}...`}
                    showInlineSpinner
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-brand-700 hover:bg-brand-800 text-white font-bold text-xs transition-colors shadow-2xs"
                  >
                    <span>Book Service</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </ActionLoadingLink>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Banner */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xs">
          <div className="text-center sm:text-left space-y-1">
            <h4 className="text-base font-bold text-slate-900">
              Need a specialized residential or commercial package?
            </h4>
            <p className="text-xs sm:text-sm text-slate-600">
              We provide villa handovers, post-construction sanitisation, and Annual Maintenance Contracts (AMC).
            </p>
          </div>
          <Link
            href="/services"
            className="px-6 py-3 rounded-full bg-brand-700 text-white hover:bg-brand-800 font-bold text-xs shrink-0 transition-colors shadow-xs"
          >
            Browse Full Directory →
          </Link>
        </div>

      </div>
    </section>
  );
}
