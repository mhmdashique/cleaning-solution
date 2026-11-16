"use client";

import type { FAQ } from "@/types";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

export default function FAQ({ faqs }: { faqs: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-20 md:py-24 scroll-mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {/* Section header */}
          <div className="mb-12 text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">
              Frequently Asked Questions
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Your Cleaning Questions, Answered
            </h2>
            <p className="mt-3 text-[15px] text-slate-600">
              Find answers to common questions about our cleaning and pest control services.
            </p>
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={faq.id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition-all duration-200 hover:border-slate-300 hover:shadow-soft-sm"
              >
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-5 text-left transition-colors hover:bg-slate-50 focus:outline-none"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold tracking-tight text-slate-900">
                      {faq.question}
                    </h3>
                    <ChevronDown
                      className={`h-5 w-5 text-slate-500 transition-transform flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>

                {openIndex === index && (
                  <div className="border-t border-slate-200 bg-slate-50 px-6 py-5">
                    <p className="text-sm leading-relaxed text-slate-700">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Bottom action */}
          <div className="mt-12 text-center">
            <p className="text-sm text-slate-600">
              Still have questions? <span className="font-semibold text-brand-700">Contact us directly at 7994342372</span> or visit our <a href="/contact" className="font-semibold text-brand-700 hover:text-brand-800">contact page</a>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
