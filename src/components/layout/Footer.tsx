"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  MessageSquare, 
  ArrowRight,
  CheckCircle2,
  Lock
} from "lucide-react";

export default function Footer() {
  const pathname = usePathname();
  const currentYear = new Date().getFullYear();

  if (pathname?.startsWith("/admin")) {
    return null;
  }

  return (
    <footer className="bg-brand-950 text-slate-300 pt-16 pb-12 border-t border-brand-900 relative overflow-hidden">
      {/* Decorative gradient blur background */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-800/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-brand-900/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top pre-footer CTA Banner */}
        <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 rounded-3xl p-8 sm:p-10 border border-brand-700/50 shadow-2xl mb-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent-yellow/15 text-accent-yellow border border-accent-yellow/30">
              <Sparkles className="w-3.5 h-3.5" /> Fast Response Across Thiruvananthapuram
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ready for a Spotless, Germ-Free Home?
            </h3>
            <p className="text-brand-200 text-sm sm:text-base max-w-xl">
              Book our verified professionals today. Experience customized cleaning & pest eradication at pocket-friendly rates.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm transition-all shadow-lg shadow-brand-950/30 text-center"
            >
              <span>Book Online</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* 4-column main footer grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-brand-900/80">
          {/* Column 1: Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-brand-600 to-brand-800 flex items-center justify-center text-white shadow-md">
                <span className="font-extrabold text-xl">P<span className="text-accent-yellow">C</span></span>
              </div>
              <div>
                <span className="font-extrabold text-xl text-white tracking-tight block">
                  PLAN C
                </span>
                <span className="text-xs text-brand-300 font-medium block">
                  Cleaning & Pest Control
                </span>
              </div>
            </Link>

            <p className="text-sm text-slate-300 leading-relaxed font-sans">
              &quot;You leave it, we clean it&quot;
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              PLAN C Cleaning Solutions is a professional cleaning and pest control company based in Kerala. With over 5+ years of hands-on expertise, we specialise in offering residential and commercial clients customised solutions at cost-effective rates.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-brand-200">
              <ShieldCheck className="w-4 h-4 text-accent-yellow flex-shrink-0" />
              <span>100% Satisfaction & Service Guarantee</span>
            </div>
          </div>

          {/* Column 2: Popular Cleaning Services */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-500"></span>
              Cleaning Services
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link href="/services/full-house-deep-cleaning" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-brand-400" />
                  Full House Deep Cleaning
                </Link>
              </li>
              <li>
                <Link href="/services/kitchen-cleaning" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-brand-400" />
                  Kitchen Deep Cleaning & Degreasing
                </Link>
              </li>
              <li>
                <Link href="/services/bathroom-cleaning" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-brand-400" />
                  Bathroom Descaling & Cleaning
                </Link>
              </li>
              <li>
                <Link href="/services/water-tank-cleaning" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-brand-400" />
                  6-Stage Water Tank Sanitisation
                </Link>
              </li>
              <li>
                <Link href="/services/sofa-mattress-carpet-shampooing" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-brand-400" />
                  Sofa, Mattress & Carpet Shampooing
                </Link>
              </li>
              <li>
                <Link href="/services/outdoor-cleaning" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-brand-400" />
                  Outdoor & Interlock Pressure Wash
                </Link>
              </li>
              <li>
                <Link href="/services/office-commercial-cleaning" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-brand-400" />
                  Office & Commercial Cleaning
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Pest Control & Segments */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white tracking-wide flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-accent-yellow"></span>
              Pest Control & Segments
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li>
                <Link href="/services/general-pest-control" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-accent-yellow" />
                  General Pest Control
                </Link>
              </li>
              <li>
                <Link href="/services/anti-termite-control" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-accent-yellow" />
                  Anti-Termite Treatment (Warranty)
                </Link>
              </li>
              <li>
                <Link href="/services/cockroach-control" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-accent-yellow" />
                  Odorless Cockroach Gel Treatment
                </Link>
              </li>
              <li>
                <Link href="/services/bed-bugs-control" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-accent-yellow" />
                  Bed Bugs Thermal Steam Eradication
                </Link>
              </li>
              <li>
                <Link href="/services/garden-cleaning" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-accent-yellow" />
                  Garden & Lawn Clearing
                </Link>
              </li>
              <li>
                <Link href="/services/post-construction-cleaning" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-accent-yellow" />
                  Post-Construction Handover
                </Link>
              </li>
              <li>
                <Link href="/services/annual-maintenance-contract" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <ArrowRight className="w-3 h-3 text-accent-yellow" />
                  Annual Maintenance Contracts (AMC)
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Operations */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white tracking-wide">
              Kerala Headquarters
            </h4>
            <div className="space-y-3 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                <span>
                  Thrikannapuram, Thiruvananthapuram, Kerala - 695032
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <a href="tel:7994342372" className="hover:text-white font-semibold text-accent-yellow transition-colors">
                  +91 79943 42372
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-400 flex-shrink-0" />
                <a href="mailto:contact@plancsolutions.in" className="hover:text-white transition-colors">
                  contact@plancsolutions.in
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                <span>
                  Mon - Sun: 7:00 AM - 9:00 PM<br />
                  <span className="text-[11px] text-slate-400">Emergency call-outs available</span>
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/track"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-brand-900 border border-brand-700 text-xs text-brand-200 hover:text-white hover:bg-brand-800 transition-colors"
              >
                <span>Track Existing Booking</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Local Service Areas Section for SEO */}
        <div className="py-6 border-b border-brand-900/60 text-xs">
          <p className="text-slate-400 leading-relaxed font-sans">
            <strong className="text-slate-200">Service Coverage in Trivandrum & Kerala:</strong>{" "}
            Thrikannapuram • Kowdiar • Pattom • Kazhakkoottam • Technopark • Sasthamangalam • Vattiyoorkavu • Vellayambalam • Thycaud • Poojappura • Karamana • Attingal • Nedumangad • Neyyattinkara • Pothencode • Sreekaryam • Kesavadasapuram • Ulloor • Medical College • Varkala • Venjaramoodu.
          </p>
        </div>

        {/* Bottom copyright & admin access */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {currentYear} PLAN C Cleaning Solutions. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-slate-200 transition-colors">
              About
            </Link>
            <Link href="/reviews" className="hover:text-slate-200 transition-colors">
              Customer Reviews
            </Link>
            <Link href="/blog" className="hover:text-slate-200 transition-colors">
              Cleaning Blog
            </Link>
            <Link href="/admin" className="inline-flex items-center gap-1 text-slate-500 hover:text-brand-300 transition-colors" title="Admin Portal">
              <Lock className="w-3 h-3" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

