import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Home, Building2, Trees, Check } from "lucide-react";

export default function SegmentCards() {
  const segments = [
    {
      title: "Home Cleaning",
      desc: "Complete deep cleaning, floor descaling, kitchen degreasing, bathroom scrubbing, and sofa shampooing tailored for Kerala homes.",
      image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80",
      icon: Home,
      features: [
        "Full House Deep Scrub & Sanitisation",
        "Kitchen Chimney & Cabinet Degreasing",
        "Hard-Water Bathroom Scale Removal",
        "Sofa & Mattress Injection-Extraction",
      ],
      href: "/services?cat=cleaning",
    },
    {
      title: "Office Cleaning",
      desc: "Custom housekeeping and deep sanitisation for IT workspaces in Technopark, clinics, retail shops, and corporate facilities.",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
      icon: Building2,
      features: [
        "Workstation & Hardware Disinfection",
        "Conference Room & Carpet Vacuuming",
        "Restroom Scale Treatment & Refills",
        "After-Hours / Weekend Schedules",
      ],
      href: "/services?cat=commercial",
    },
    {
      title: "Garden Cleaning",
      desc: "Clearing overgrown brush, hedge trimming, clearing fallen palm fronds, and pressure washing mossy interlock pavers.",
      image: "https://images.unsplash.com/photo-1557429287-b2e26467fc2b?auto=format&fit=crop&w=800&q=80",
      icon: Trees,
      features: [
        "Overgrowth & Brush Clearance",
        "Hedge Trimming & Pruning",
        "Debris & Leaf Carting",
        "Paver High-PSI Moss Washing",
      ],
      href: "/services?cat=specialised",
    },
  ];

  return (
    <section className="bg-slate-50/70 py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-12 max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">
            Who We Serve
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Tailored For Every Environment
          </h2>
          <p className="mt-3 text-[15px] text-slate-600">
            Whether you require an intensive deep scrub of your family villa, regular housekeeping for an IT facility, or lawn rejuvenation, we deliver measurable results.
          </p>
        </div>

        {/* 3 Column Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {segments.map((segment) => {
            const Icon = segment.icon;
            return (
              <div
                key={segment.title}
                className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-200 hover:border-slate-300 hover:shadow-soft-lg"
              >
                {/* Image */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={segment.image}
                    alt={segment.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col space-y-4 p-6">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                      <Icon className="h-4 w-4" strokeWidth={1.8} />
                    </span>
                    <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                      {segment.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {segment.desc}
                  </p>

                  <div className="flex-1 space-y-2 border-t border-slate-100 pt-4">
                    {segment.features.map((feat) => (
                      <div key={feat} className="flex items-start gap-2 text-xs text-slate-600">
                        <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" strokeWidth={2.2} />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>

                  <Link
                    href={segment.href}
                    className="mt-1 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-800 transition-all hover:gap-2.5 hover:text-brand-900"
                  >
                    <span>Explore {segment.title}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
