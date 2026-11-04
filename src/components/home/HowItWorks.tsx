import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function HowItWorks() {
  const steps = [
    {
      number: "01",
      title: "Select Service & Date",
      desc: "Choose your service online or reach us at 7994342372. Specify your preferred schedule, locality, and any specific areas of focus.",
      image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80",
      alt: "A planner calendar used to schedule a cleaning service",
    },
    {
      number: "02",
      title: "Equipped Team Arrives",
      desc: "Our verified cleaning specialists arrive on time with industrial rotary scrubbers, steam cleaners, and eco-friendly chemicals.",
      image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=800&q=80",
      alt: "A gloved hand holding a professional cleaning spray bottle",
    },
    {
      number: "03",
      title: "Inspect & Settle",
      desc: "Walk through and inspect the finished results. Enjoy clean, sanitized, and pest-free spaces backed by our free re-clean guarantee.",
      image: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=800&q=80",
      alt: "A service handshake after final inspection and acceptance",
    },
  ];

  return (
    <section id="how-it-works" className="bg-slate-50/70 py-20 md:py-24 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="mb-12 max-w-2xl">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">
            Process
          </p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            How PLAN C Works
          </h2>
          <p className="mt-3 text-[15px] text-slate-600">
            A structured, reliable procedure from initial booking to spotless final walkthrough.
          </p>
        </div>

        {/* 3 Steps with photos */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div
              key={step.title}
              className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-200 hover:border-slate-300 hover:shadow-soft-lg"
            >
              {/* Step photo with number chip */}
              <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                <Image
                  src={step.image}
                  alt={step.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
                <span className="absolute left-4 top-4 flex h-9 items-center justify-center rounded-full bg-white/90 px-3.5 text-xs font-bold text-slate-900 backdrop-blur-sm">
                  {step.number}
                </span>
              </div>

              {/* Copy */}
              <div className="flex flex-1 flex-col p-6">
                <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action row */}
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-800 active:scale-[0.98]"
          >
            <span>Book Your Service</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/track"
            className="inline-flex items-center gap-1.5 px-4 py-3 text-xs font-semibold text-slate-500 transition-colors hover:text-slate-900"
          >
            <span>Already booked? Track status</span>
          </Link>
        </div>

      </div>
    </section>
  );
}
