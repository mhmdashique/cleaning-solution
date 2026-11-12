"use client";

import { motion } from "framer-motion";
import { Award, EyeOff, Leaf, ShieldCheck, Users } from "lucide-react";

export default function FeatureStrip() {
  const items = [
    { icon: ShieldCheck, title: "Same-Day", subtitle: "Service" },
    { icon: Leaf, title: "Eco-Friendly", subtitle: "Solutions" },
    { icon: Users, title: "Safe for Family", subtitle: "& Pets" },
    { icon: EyeOff, title: "Zero Hidden", subtitle: "Charges" },
    { icon: Award, title: "100% Reliable", subtitle: "Cleaners" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative z-20 -mt-16 mx-auto w-full max-w-6xl px-4 sm:px-6 lg:-mt-[140px]"
    >
      <div className="rounded-[2rem] border border-white/80 bg-white/95 px-5 py-5 shadow-[0_12px_40px_rgba(15,23,42,0.12)] backdrop-blur-md sm:px-7 sm:py-4">
        <div className="grid grid-cols-2 gap-x-4 gap-y-5 md:grid-cols-5 md:gap-y-0 md:divide-x md:divide-slate-200/80">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`flex items-center gap-3.5 ${
                  idx === 0
                    ? "md:pr-4"
                    : idx === items.length - 1
                      ? "md:pl-4"
                      : "md:px-4"
                }`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.9} aria-hidden="true" />
                </span>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold leading-tight text-slate-900 sm:text-[13px]">
                    {item.title}
                  </span>
                  <span className="mt-0.5 text-[11px] font-medium leading-tight text-slate-600 sm:text-xs">
                    {item.subtitle}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
