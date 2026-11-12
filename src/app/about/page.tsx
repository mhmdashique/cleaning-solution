import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getAllBookings, getSiteSettings } from "@/lib/data/store";
import { 
  ShieldCheck, 
  Target, 
  Eye, 
  Zap, 
  Leaf, 
  Cpu, 
  UserCheck, 
  Coins, 
  Award,
  ChevronRight,
  ArrowRight,
  HeartHandshake
} from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | PLAN C Cleaning Solutions Kerala",
  description:
    "Learn about PLAN C Cleaning Solutions in Thrikannapuram, Thiruvananthapuram. 5+ years of trusted cleaning and pest control services across Kerala. Mission, values, and expert team.",
};

export default async function AboutPage() {
  // Figures shown on this page are derived from live records.
  const [bookings, settings] = await Promise.all([
    getAllBookings().catch(() => []),
    getSiteSettings().catch(() => null),
  ]);

  const completedJobs = bookings.filter(
    (booking) => booking.status === "Completed"
  ).length;

  const values = [
    {
      icon: Zap,
      title: "Same Day Service",
      desc: "Rapid response teams ready for immediate dispatch across Thiruvananthapuram for prompt relief.",
    },
    {
      icon: Leaf,
      title: "Non-Toxic Chemicals",
      desc: "Eco-friendly, food-grade biodegradable solutions that preserve tile glaze and protect pets & children.",
    },
    {
      icon: Cpu,
      title: "Modern Equipment",
      desc: "Rotary scrubbers, high-temperature thermal steam units, and German injection-extraction machines.",
    },
    {
      icon: UserCheck,
      title: "Professional Cleaners",
      desc: "Strictly verified, experienced personnel trained in high-spec surface hygiene and customer courtesy.",
    },
    {
      icon: Coins,
      title: "Affordable Price",
      desc: "Transparent upfront pricing tailored to your property size with zero hidden travel charges.",
    },
    {
      icon: ShieldCheck,
      title: "100% Guaranteed Service",
      desc: "We stand behind our craft. If any corner is missed, we re-clean it immediately with zero friction.",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        
        {/* Breadcrumb & Intro */}
        <div className="space-y-4">
          <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <Link href="/" className="hover:text-brand-700">Home</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-brand-900 font-bold">About Us</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">
              Our Story & Heritage
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Kerala&apos;s Trusted Partner for Spotless & Healthy Spaces
            </h1>
            <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
              PLAN C Cleaning Solutions is a professional cleaning services company based in Kerala. With over <strong>5 years of experience</strong>, we specialise in offering clients customised solutions at cost-effective rates.
            </p>
          </div>
        </div>

        {/* Story Section With Image Composition */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 relative">
            <div className="relative h-[380px] sm:h-[460px] w-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <Image
                src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80"
                alt="PLAN C Cleaning Specialists in Thiruvananthapuram"
                fill
                className="object-cover"
              />
            </div>
            
          </div>

          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
              Who We Are
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              &quot;You leave it, we clean it&quot;
            </h2>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Founded in Thrikannapuram, Thiruvananthapuram, PLAN C was established with a singular objective: to bring mechanized, hospital-grade cleaning and scientific integrated pest management to residences and corporate enterprises across South Kerala.
            </p>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Kerala&apos;s climate presents specific challenges: high atmospheric humidity causing mildew, hard water depositing yellow calcium rings on tiles, and red soil mud adhering to exterior interlocks. Ordinary domestic sweeping cannot solve these deeply rooted problems.
            </p>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              By investing in German rotary scrubbers, 140°C thermal steam sanitizers, UV water tank irradiators, and odorless Bayer pest management, we have completed{" "}
              <strong>
                {completedJobs.toLocaleString("en-IN")} cleaning{" "}
                {completedJobs === 1 ? "engagement" : "engagements"}
              </strong>{" "}
              for households and office spaces across the region.
            </p>

            <div className="pt-2 flex items-center gap-6 text-sm font-bold text-slate-900">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-brand-600" />
                <span>{settings?.experience_years || "—"} Years Experience</span>
              </div>
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-brand-600" />
                <span>100% Satisfaction Guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mission and Vision Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <Target className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Our Mission</h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              To deliver uncompromising cleanliness, hygiene, and safe pest-free environments for every home and business in Kerala through modern mechanized technology, eco-friendly chemical formulations, and a deeply courteous, professional workforce.
            </p>
          </div>

          {/* Vision */}
          <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-soft space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center">
              <Eye className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Our Vision</h3>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              To become Kerala&apos;s benchmark brand for professional facility care, environmental sanitisation, and structural pest defense, setting the gold standard in speed, transparency, and customer delight.
            </p>
          </div>
        </div>

        {/* Why Choose Us - 6 Icon Pillars */}
        <div className="space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
              Core Pillars
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Why Customers Choose PLAN C
            </h2>
            <p className="text-sm text-slate-600">
              Our 6 uncompromising principles that guide every single service call across Kerala.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <div
                  key={v.title}
                  className="bg-white rounded-3xl p-7 border border-slate-200 shadow-soft hover:shadow-card-hover transition-all duration-300 space-y-3"
                >
                  <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 flex items-center justify-center">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">{v.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {v.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* CTA Banner */}
        <div className="flex flex-col items-center justify-between gap-8 rounded-[28px] border border-brand-100 bg-brand-50 p-8 sm:p-12 md:flex-row">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Experience the PLAN C Difference
            </h3>
            <p className="max-w-xl text-sm text-slate-600">
              Join homeowners and business owners across Kerala. Book your service or request a free site estimate today.
            </p>
          </div>

          <div className="flex w-full flex-col gap-4 sm:flex-row md:w-auto">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-700 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800 active:scale-[0.98] text-center"
            >
              <span>Book Service Online</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}

