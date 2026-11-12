"use client";

/**
 * ClientShell — named "use client" exports for layout chrome.
 * Matches the requested UI design with high-precision layout,
 * clean typography, active green indicators, and floating WhatsApp action.
 */

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ActionLoadingLink from "@/components/ui/ActionLoadingLink";
import {
  Phone,
  Menu,
  X,
  ChevronRight,
  Mail,
  MapPin,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Lock,
  MessageCircle,
  ArrowUp,
  Calendar,
  Compass,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// NAVBAR
// ─────────────────────────────────────────────────────────────────────────────
function Navbar() {
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

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];
  const isHome = pathname === "/";

  return (
    <header
      className={`z-50 transition-all duration-300 ${
        isHome
          ? `fixed inset-x-0 top-0 ${
              scrolled
                ? "border-b border-slate-100 bg-white/95 shadow-xs backdrop-blur-md"
                : "border-b border-transparent bg-transparent"
            }`
          : `sticky top-0 ${
              scrolled
                ? "border-b border-slate-100 bg-white/95 shadow-xs backdrop-blur-md"
                : "border-b border-slate-100 bg-white/90 backdrop-blur-sm"
            }`
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo — Green Squircle PC + Brand Typography */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-brand-700 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <span className="font-extrabold text-lg tracking-tight text-white font-sans">
                PC
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 font-sans leading-none">
                PLAN <span className="text-brand-700">C</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide mt-1">
                Cleaning &amp; Pest Control Solutions
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links with Green Underline on Active */}
          <nav
            className={`hidden items-center lg:flex ${
              isHome
                ? "gap-1 rounded-full border border-white/70 bg-white/70 p-1.5 shadow-sm backdrop-blur-md"
                : "gap-8"
            }`}
          >
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <div
                  key={link.name}
                  className={`relative ${isHome ? "rounded-full px-4 py-2.5" : "py-2"} ${
                    isHome && isActive ? "bg-white shadow-sm" : ""
                  }`}
                >
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
                  {isActive && !isHome && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-600 rounded-full" />
                  )}
                  {isActive && isHome && (
                    <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5 rounded-full bg-brand-600" />
                  )}
                </div>
              );
            })}
          </nav>

          {/* Right Action Cluster — Track Booking + Book Now */}
          <div className="hidden items-center gap-3 sm:flex">
            {/* Track Booking shortcut */}
            <ActionLoadingLink
              href="/track"
              loadingLabel="Opening Tracker..."
              className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:text-brand-700 ${
                isHome ? "bg-white/80 shadow-sm backdrop-blur-sm" : ""
              }`}
            >
              <Compass className="w-4 h-4 text-brand-600" />
              <span>Track Booking</span>
            </ActionLoadingLink>

            {/* Book Now — Outline pill with Calendar icon & arrow */}
            <ActionLoadingLink
              href="/contact"
              loadingLabel="Loading Booking Form..."
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold transition-all active:scale-[0.98] sm:text-sm ${
                isHome
                  ? "bg-gradient-to-r from-brand-600 to-brand-700 text-white shadow-sm hover:from-brand-700 hover:to-brand-800"
                  : "border border-brand-600/90 bg-white text-brand-700 shadow-2xs hover:bg-brand-50"
              }`}
            >
              <Calendar
                className={`w-4 h-4 ${isHome ? "text-white" : "text-brand-600"}`}
              />
              <span>Book Now</span>
              <span className={isHome ? "text-white" : "text-brand-600"}>→</span>
            </ActionLoadingLink>
          </div>

          {/* Mobile Menu Triggers */}
          <div className="flex items-center gap-2 lg:hidden">
            <ActionLoadingLink
              href="/track"
              loadingLabel="Opening Tracker..."
              className="p-2 rounded-xl bg-brand-50 text-brand-800 border border-brand-100"
              aria-label="Track Booking"
            >
              <Compass className="w-4 h-4 text-brand-700" />
            </ActionLoadingLink>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none transition-colors"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-slate-900" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Slide-Down Menu */}
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

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
            <ActionLoadingLink
              href="/track"
              loadingLabel="Opening Tracker..."
              className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-full border border-slate-200 bg-slate-50 text-slate-800 font-bold text-xs text-center"
            >
              <Compass className="w-3.5 h-3.5 text-brand-600" />
              <span>Track Booking</span>
            </ActionLoadingLink>
            <ActionLoadingLink
              href="/contact"
              loadingLabel="Opening Booking Form..."
              className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-full bg-brand-700 text-white font-bold text-xs text-center shadow-xs"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Online</span>
            </ActionLoadingLink>
          </div>
        </div>
      )}
    </header>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER
// ─────────────────────────────────────────────────────────────────────────────
interface FooterService {
  title: string;
  slug: string;
}

function Footer({ services }: { services: FooterService[] }) {
  const currentYear = new Date().getFullYear();
  const featuredServices = services.slice(0, 8);

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-900">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-5 group">
              <div className="w-10 h-10 rounded-xl bg-brand-700 flex items-center justify-center text-white font-sans font-extrabold text-lg">
                PC
              </div>
              <div>
                <div className="font-extrabold text-xl text-white tracking-tight">
                  PLAN <span className="text-brand-400">C</span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  Cleaning &amp; Pest Control
                </div>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              Kerala&apos;s trusted cleaning partner since 2019. Professional,
              eco-friendly, and affordable services across Thiruvananthapuram.
            </p>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-brand-400 shrink-0" />
                <span>5+ Years Certified Service Record</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" />
                <span>100% Guaranteed Satisfaction</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-brand-400 shrink-0" />
                <span>Verified &amp; Background-Checked Cleaners</span>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-bold text-white mb-5 text-xs uppercase tracking-widest text-slate-400">
              Navigation
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "Home", href: "/" },
                { label: "Services", href: "/services" },
                { label: "About Us", href: "/about" },
                { label: "Track Booking", href: "/track" },
                { label: "Reviews", href: "/reviews" },
                { label: "Blog", href: "/blog" },
                { label: "Contact Us", href: "/contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-bold text-white mb-5 text-xs uppercase tracking-widest text-slate-400">
              Core Services
            </h3>
            <ul className="space-y-2.5">
              {featuredServices.length > 0 ? (
                featuredServices.map((s) => (
                  <li key={s.slug}>
                    <Link
                      href={`/services/${s.slug}`}
                      className="text-sm text-slate-400 hover:text-white transition-colors"
                    >
                      {s.title}
                    </Link>
                  </li>
                ))
              ) : (
                <li>
                  <Link
                    href="/services"
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    Browse all services
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="font-bold text-white mb-5 text-xs uppercase tracking-widest text-slate-400">
              Direct Contact
            </h3>
            <ul className="space-y-3.5">
              <li>
                <a
                  href="tel:7994342372"
                  className="flex items-start gap-3 group text-sm"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center shrink-0 text-brand-400 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Helpline</div>
                    <span className="font-semibold text-white group-hover:text-brand-300 transition-colors">
                      7994342372
                    </span>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@plancsolutions.in"
                  className="flex items-start gap-3 group text-sm"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center shrink-0 text-brand-400 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Email</div>
                    <span className="font-semibold text-white group-hover:text-brand-300 transition-colors">
                      info@plancsolutions.in
                    </span>
                  </div>
                </a>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center shrink-0 text-brand-400 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Office</div>
                  <span className="text-slate-300">
                    Thrikannapuram, Thiruvananthapuram, Kerala
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3 text-sm">
                <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center shrink-0 text-brand-400 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs text-slate-500">Hours</div>
                  <span className="text-slate-300">
                    Mon – Sun: 7:00 AM – 9:00 PM
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500 text-center sm:text-left">
            © {currentYear} PLAN C Cleaning Solutions. All rights reserved.
            Thrikannapuram, Thiruvananthapuram, Kerala.
          </p>
          <div className="flex items-center gap-4 text-xs text-slate-500">
            <Link href="/reviews" className="hover:text-slate-300">
              Reviews
            </Link>
            <span>•</span>
            <Link href="/blog" className="hover:text-slate-300">
              Blog
            </Link>
            <span>•</span>
            <span className="text-slate-400 italic">
              &quot;You leave it, we clean it&quot;
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FLOATING ACTIONS — Matches the mockup with "Chat with us" pill + WhatsApp
// ─────────────────────────────────────────────────────────────────────────────
function FloatingActions() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowScrollTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const whatsappMessage = encodeURIComponent(
    "Hi PLAN C, I'd like to book a service."
  );

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="w-10 h-10 rounded-full bg-white text-slate-700 shadow-md border border-slate-200 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}

      {/* WhatsApp action matching mockup with "Chat with us" pill */}
      <a
        href={`https://wa.me/917994342372?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
        aria-label="Chat with us on WhatsApp"
      >
        <span className="hidden sm:inline-block px-3 py-1.5 rounded-full bg-white text-slate-800 text-xs font-semibold shadow-md border border-slate-100">
          Chat with us
        </span>
        <div className="w-12 h-12 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-lg hover:bg-[#20bd5a] transition-colors">
          <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
        </div>
      </a>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NAMED EXPORTS
// ─────────────────────────────────────────────────────────────────────────────
export function NavbarShell() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return <Navbar />;
}

export function FooterShell({
  services = [],
}: {
  services?: FooterService[];
}) {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return (
    <>
      <Footer services={services} />
      <FloatingActions />
    </>
  );
}
