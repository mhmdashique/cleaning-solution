"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Service } from "@/types";
import { ArrowRight } from "lucide-react";

interface ServiceCardProps {
  service: Service;
  index: number;
}

export default function ServiceCard({ service, index }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06, ease: "easeOut" }}
      className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-200 hover:border-slate-300 hover:shadow-soft-lg"
    >
      {/* Service Image */}
      <div className="relative h-44 w-full overflow-hidden bg-slate-100">
        <Image
          src={service.image_url}
          alt={service.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-slate-700 backdrop-blur-sm">
          {service.category.replace("_", " ")}
        </span>
      </div>

      {/* Card Content */}
      <div className="flex flex-1 flex-col justify-between space-y-4 p-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold leading-snug tracking-tight text-slate-900">
            <Link href={`/services/${service.slug}`} className="transition-colors group-hover:text-brand-800">
              {service.title}
            </Link>
          </h3>
          <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
            {service.short_desc}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <Link
            href={`/services/${service.slug}`}
            className="group/link inline-flex items-center gap-1 text-xs font-medium text-slate-500 transition-colors hover:text-brand-800"
          >
            <span>View Details</span>
            <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover/link:translate-x-0.5" />
          </Link>

          <Link
            href={`/contact?service=${encodeURIComponent(service.title)}`}
            className="inline-flex items-center gap-1.5 rounded-full bg-brand-700 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-brand-800"
          >
            <span>Book Now</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
