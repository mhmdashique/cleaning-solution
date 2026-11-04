"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-10 md:pt-14 pb-20 md:pb-24">
        {/* One faint green tint behind the headline only */}
        <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[880px] max-w-screen -translate-x-1/2 rounded-full bg-brand-50/60 blur-3xl" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 xl:gap-14">
            {/* ─────────────────────────────────────────────
                LEFT — copy
            ────────────────────────────────────────────── */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-semibold text-slate-600 shadow-2xs"
              >
                <ShieldCheck className="h-3.5 w-3.5 text-brand-600" strokeWidth={2} />
                <span>Trusted · Professional · Reliable</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 }}
                className="text-[38px] font-bold leading-[1.1] tracking-tight text-slate-900 text-balance sm:text-5xl lg:text-[56px]"
              >
                Professional Cleaning &amp; Pest Defense{" "}
                <span className="whitespace-nowrap text-brand-700">in Kerala.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.16 }}
                className="text-lg italic text-slate-500"
              >
                You leave it, we clean it.
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="max-w-[520px] text-[15px] leading-7 text-slate-600"
              >
                PLAN C Cleaning Solutions is a specialized cleaning and pest
                control company based in Thiruvananthapuram. We provide
                customized, mechanized solutions with safe and effective
                treatments.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.26 }}
                className="flex flex-wrap items-center gap-3 pt-2"
              >
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-brand-700 px-7 py-3.5 text-sm font-semibold text-white transition-colors duration-200 hover:bg-brand-800 active:scale-[0.98]"
                >
                  <span>Book Service Online</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </div>

            {/* ─────────────────────────────────────────────
                RIGHT — photo
            ────────────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.12, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative aspect-[1056/840] w-full overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 shadow-soft-lg">
                <Image
                  src="/images/hero-cleaner-new.jpg"
                  alt="Professional cleaner in safety gear wiping a window with a green cloth and spray bottle"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover object-center"
                />
              </div>
            </motion.div>
          </div>
        </div>
    </section>
  );
}
