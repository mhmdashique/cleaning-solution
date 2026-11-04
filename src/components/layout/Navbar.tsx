"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { 
  Phone, 
  Calendar, 
  Menu, 
  X, 
  ChevronRight,
  Compass
} from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 15);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  if (pathname?.startsWith("/admin")) return null;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-xs border-b border-slate-100"
          : "bg-white/90 backdrop-blur-sm border-b border-slate-100"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Green Rounded-Square Logo Mark + 2-Line Text Block */}
          <Link href="/" className="flex items-center gap-3.5 group shrink-0">
            <div className="w-11 h-11 rounded-xl bg-brand-700 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-xl tracking-tight text-white font-sans">
                PC
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-navy-950 font-sans leading-tight">
                PLAN <span className="text-brand-700">C</span>
              </span>
              <span className="text-[11px] text-slate-500 font-medium tracking-wide">
                Cleaning &amp; Pest Control Solutions
              </span>
            </div>
          </Link>

          {/* Centre Links with active green text and short green underline */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <div key={link.name} className="relative py-2">
                  <Link
                    href={link.href}
                    className={`text-sm font-semibold transition-colors duration-150 ${
                      isActive
                        ? "text-brand-700 font-bold"
                        : "text-slate-700 hover:text-brand-700"
                    }`}
                  >
                    {link.name}
                  </Link>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 rounded-full" />
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right: Track Booking + Outlined Green Pill Book Now Button */}
          <div className="hidden sm:flex items-center gap-5">
            {/* Track Booking shortcut */}
            <Link
              href="/track"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-700 transition-colors hover:text-brand-700"
            >
              <Compass className="w-4 h-4 text-brand-700" />
              <span>Track Booking</span>
            </Link>

            {/* Outlined Green Pill Button: Calendar icon + "Book Now" + Arrow */}
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-brand-700 bg-white hover:bg-brand-50 rounded-full border border-brand-600/90 shadow-2xs hover:shadow-xs transition-all active:scale-[0.98]"
            >
              <Calendar className="w-4 h-4 text-brand-700" />
              <span>Book Now</span>
              <span className="text-brand-700 font-bold">→</span>
            </Link>
          </div>

          {/* Mobile Triggers */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/track"
              className="p-2 rounded-xl bg-brand-50 text-brand-800 border border-brand-100"
              aria-label="Track Booking"
            >
              <Compass className="w-4 h-4 text-brand-700" />
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-navy-950" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-lg">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                    isActive
                      ? "bg-brand-50 text-brand-800 font-bold"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </Link>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/contact"
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-brand-700 text-white font-bold text-sm shadow-xs"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Now →</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
