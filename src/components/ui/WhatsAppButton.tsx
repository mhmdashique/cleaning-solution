"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppButton() {
  const prefilledMessage = encodeURIComponent("Hi PLAN C, I'd like to book a service.");
  const whatsappUrl = `https://wa.me/917994342372?text=${prefilledMessage}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5">
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="group flex items-center gap-2.5 transition-all duration-200 hover:scale-105 active:scale-95"
      >
        {/* Desktop pill label */}
        <span className="hidden sm:inline-block px-3.5 py-1.5 rounded-full bg-white text-navy-950 text-xs font-bold shadow-md border border-slate-100/90 group-hover:border-brand-200 transition-colors">
          Chat with us
        </span>

        {/* Round Green WhatsApp Button */}
        <div className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-lg shadow-[#25D366]/30 transition-all">
          <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
        </div>
      </a>
    </div>
  );
}

