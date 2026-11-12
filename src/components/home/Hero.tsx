"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CalendarDays } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative isolate flex min-h-[780px] items-center justify-center overflow-hidden bg-slate-100 pt-24 pb-28 sm:min-h-[860px] sm:pt-28 lg:min-h-[min(960px,110svh)]">
      <Image
        src="/images/landingpage.jpg"
        alt="Professional cleaner caring for a bright, comfortable home"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[62%_center]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-gradient-to-r from-white/50 via-white/35 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.54)_0%,rgba(255,255,255,0.22)_42%,transparent_76%)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-5xl px-4 text-center sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55 }}
          className="mx-auto max-w-4xl"
        >
          <h1 className="mx-auto max-w-3xl text-balance text-[40px] font-extrabold leading-[1.04] tracking-[-0.045em] text-slate-950 sm:text-6xl lg:text-[68px]">
            <span className="block">Professional</span>
            <span className="block">Cleaning &amp; Pest</span>
            <span className="block">
              Defense <span className="text-brand-700">in Kerala.</span>
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-7 text-slate-700 sm:mt-6 sm:text-xl">
            Your space, our care — spotless, safe and pest-free!
          </p>
          <Link
            href="/contact"
            className="mt-7 inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-brand-600 to-brand-700 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-900/20 transition hover:-translate-y-0.5 hover:from-brand-700 hover:to-brand-800 sm:mt-8 sm:px-8 sm:py-4 sm:text-base"
          >
            <CalendarDays className="h-5 w-5" aria-hidden="true" />
            <span>Book Service Online</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
