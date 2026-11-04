"use client";

import { motion } from "framer-motion";
import { Calendar, Leaf, Users, ShieldAlert, Award } from "lucide-react";

export default function FeatureStrip() {
  const items = [
    { icon: Calendar, title: "Same-Day", subtitle: "Service" },
    { icon: Leaf, title: "Eco-Friendly", subtitle: "Solutions" },
    { icon: Users, title: "Safe for Family", subtitle: "& Pets" },
    { icon: ShieldAlert, title: "Zero Hidden", subtitle: "Charges" },
    { icon: Award, title: "100% Re-Clean", subtitle: "Guarantee" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="relative z-20 -mt-16 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="rounded-3xl border border-slate-200 bg-white px-5 py-5 shadow-soft-lg sm:px-7">
        <div className="grid grid-cols-2 gap-y-5 md:grid-cols-5 md:gap-y-0 md:divide-x md:divide-slate-100">
          {items.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`flex items-center gap-3.5 ${
                  idx === 0
                    ? "md:pr-5"
                    : idx === items.length - 1
                      ? "md:pl-5"
                      : "md:px-5"
                }`}
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                  <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />
                </span>
                <div className="flex flex-col text-left">
                  <span className="text-[13px] font-semibold leading-tight text-slate-900">
                    {item.title}
                  </span>
                  <span className="mt-0.5 text-xs font-normal leading-tight text-slate-500">
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
