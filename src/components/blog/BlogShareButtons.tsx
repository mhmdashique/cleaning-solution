"use client";

import { useState } from "react";
import { Share2, MessageCircle, Twitter, Link2, Check } from "lucide-react";

export default function BlogShareButtons({
  title,
  slug,
}: {
  title: string;
  slug: string;
}) {
  const [copied, setCopied] = useState(false);

  const url = typeof window !== "undefined"
    ? `${window.location.origin}/blog/${slug}`
    : `https://plancsolutions.in/blog/${slug}`;

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `${title} - Read more from PLAN C Cleaning: ${url}`
  )}`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    title
  )}&url=${encodeURIComponent(url)}`;

  return (
    <div className="flex items-center gap-3 pt-3">
      <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
        <Share2 className="w-3.5 h-3.5" /> Share:
      </span>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25D366]/15 hover:bg-[#25D366]/25 text-[#128C7E] font-bold text-xs transition-colors"
      >
        <MessageCircle className="w-3.5 h-3.5 fill-[#25D366] text-[#25D366]" />
        <span>WhatsApp</span>
      </a>

      <a
        href={twitterUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
      >
        <Twitter className="w-3.5 h-3.5 fill-slate-700 text-slate-700" />
        <span>Tweet</span>
      </a>

      <button
        onClick={handleCopy}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5 text-brand-600" />
            <span className="text-brand-700">Copied!</span>
          </>
        ) : (
          <>
            <Link2 className="w-3.5 h-3.5" />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
}

