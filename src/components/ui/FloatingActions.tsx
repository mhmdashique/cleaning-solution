"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Phone, MessageCircle, Sparkles, ArrowUp } from "lucide-react";
import Link from "next/link";

export default function FloatingActions() {
  const pathname = usePathname();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const whatsappMessage = encodeURIComponent(
    "Hi PLAN C Cleaning Solutions, I would like to inquire about your cleaning/pest control services in Kerala."
  );

  return (
    <>
      {/* Desktop Floating WhatsApp & Back-To-Top (Right Side) */}
      <div className="fixed bottom-6 right-6 z-40 hidden sm:flex flex-col items-end gap-3">
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className="w-11 h-11 rounded-full bg-white text-slate-700 shadow-soft-lg hover:shadow-card-hover border border-slate-200 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}

        {/* WhatsApp Floating button */}
        <a
          href={`https://wa.me/917994342372?text=${whatsappMessage}`}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2.5 px-4 py-3 rounded-full bg-[#25D366] text-white font-bold shadow-xl shadow-[#25D366]/30 hover:shadow-2xl hover:bg-[#20bd5a] transition-all hover:scale-105 active:scale-95"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
          <span className="text-sm font-semibold pr-1">WhatsApp Us</span>
        </a>
      </div>

      {/* Mobile Sticky Bottom Bar (Essential for Kerala mobile users) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white/95 backdrop-blur-md border-t border-slate-200 p-2.5 shadow-2xl safe-area-pb">
        <div className="grid grid-cols-3 gap-2">
          {/* Call button */}
          <a
            href="tel:7994342372"
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-slate-100 text-slate-800 font-bold active:bg-slate-200"
          >
            <Phone className="w-4 h-4 text-brand-700 mb-0.5" />
            <span className="text-[11px] font-semibold">Call Now</span>
          </a>

          {/* WhatsApp button */}
          <a
            href={`https://wa.me/917994342372?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-[#25D366]/15 text-[#128C7E] font-bold active:bg-[#25D366]/25"
          >
            <MessageCircle className="w-4 h-4 text-[#25D366] mb-0.5" />
            <span className="text-[11px] font-semibold">WhatsApp</span>
          </a>

          {/* Book online */}
          <Link
            href="/contact"
            className="flex flex-col items-center justify-center py-2 px-1 rounded-xl bg-brand-700 text-white font-bold active:bg-brand-800 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-accent-yellow mb-0.5 animate-pulse" />
            <span className="text-[11px] font-semibold">Book Now</span>
          </Link>
        </div>
      </div>
    </>
  );
}

