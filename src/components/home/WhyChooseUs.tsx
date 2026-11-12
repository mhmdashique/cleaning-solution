import {
  Zap,
  Leaf,
  Cpu,
  UserCheck,
  Coins,
  ShieldCheck,
  MapPin,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import {
  getServices,
  getAllBookings,
  getSiteSettings,
} from "@/lib/data/store";

const pillars = [
  {
    icon: Zap,
    title: "Same Day Service",
    desc: "Urgent turnaround available across Thiruvananthapuram for housewarmings, events, or post-tenant departures. We dispatch within hours.",
  },
  {
    icon: Leaf,
    title: "Non-Toxic Chemicals",
    desc: "Eco-friendly, food-safe bio degreasers and pet-compatible sprays with zero harsh chlorine or toxic fumes. Safe for children & the elderly.",
  },
  {
    icon: Cpu,
    title: "Modern Equipment",
    desc: "Industrial single-disc rotary scrubbers, German injection-extraction vacuums, UV water tank sanitisers, and 140°C thermal steam cleaners.",
  },
  {
    icon: UserCheck,
    title: "Professional Cleaners",
    desc: "Police-verified, background-checked, fully uniformed staff trained in specialized surface preservation and customer courtesy protocols.",
  },
  {
    icon: Coins,
    title: "Affordable Pricing",
    desc: "Transparent upfront quotation with zero hidden charges or surprise travel fees. Competitive rates with package deals for repeat bookings.",
  },
  {
    icon: ShieldCheck,
    title: "100% Guaranteed",
    desc: "Your complete satisfaction is our promise. If any spot is missed, we return and re-clean it promptly — zero quibbles, zero extra cost.",
  },
];

export default async function WhyChooseUs() {
  // Every figure below is derived from live records — nothing is hardcoded.
  const [services, bookings, settings] = await Promise.all([
    getServices().catch(() => []),
    getAllBookings().catch(() => []),
    getSiteSettings().catch(() => null),
  ]);

  const happyClients = new Set(
    bookings
      .filter((booking) => booking.status === "Completed")
      .map((booking) => booking.phone.replace(/\D/g, ""))
      .filter(Boolean)
  ).size;

  const stats = [
    { value: settings?.experience_years || "—", label: "Years of excellence" },
    { value: String(happyClients), label: "Happy clients" },
    { value: String(services.length), label: "Services offered" },
    { value: "100%", label: "Satisfaction guarantee" },
  ];

  return (
    <section
      id="why-us"
      className="relative overflow-hidden bg-white py-20 md:py-24"
    >
      {/* ── Ambient washes + site-native grid pattern ── */}
      <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-60" />
      <div className="pointer-events-none absolute -right-40 top-20 h-96 w-96 rounded-full bg-brand-50/80 blur-3xl" />
      <div className="pointer-events-none absolute -left-44 bottom-24 h-80 w-80 rounded-full bg-slate-50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* ── Top: editorial header + portrait ───────────────────── */}
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Copy col */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-100 bg-brand-50 text-brand-700">
                <Sparkles className="h-4 w-4" strokeWidth={1.8} />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-brand-700">
                The PLAN C Advantage
              </span>
            </div>

            <h2 className="mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-slate-900 text-balance sm:text-5xl lg:text-[52px]">
              Why Kerala{" "}
              <span className="relative inline-block font-serif font-medium italic text-brand-700">
                Trusts
                <svg
                  aria-hidden="true"
                  viewBox="0 0 220 14"
                  className="absolute -bottom-2 left-0 w-full"
                  fill="none"
                >
                  <path
                    d="M4 10C60 4 150 3 216 8"
                    stroke="#16a34a"
                    strokeOpacity="0.55"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              PLAN&nbsp;C Cleaning
            </h2>

            <p className="mt-6 max-w-md text-[15px] leading-7 text-slate-500">
              5+ years of science-backed cleaning across Thiruvananthapuram.
              Six non-negotiable standards, engineered into every visit —
              no shortcuts, no exceptions.
            </p>

            {/* Stats as editorial 2×2 with brand ticks */}
            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="flex flex-col border-l border-brand-200/80 pl-4"
                >
                  <dt className="order-2 mt-1.5 text-[10px] font-semibold uppercase leading-4 tracking-[0.18em] text-slate-400">
                    {s.label}
                  </dt>
                  <dd className="order-1 text-4xl font-extrabold tracking-tight text-slate-900 tabular-nums sm:text-5xl">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Portrait col */}
          <div className="relative lg:col-span-7">
            <div className="group relative aspect-[16/11] w-full overflow-hidden rounded-[2rem] border border-slate-200/80 bg-slate-100 shadow-soft-lg">
              <Image
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80"
                alt="A spotless modern home maintained by PLAN C Cleaning Solutions"
                fill
                sizes="(max-width: 1024px) 100vw, 58vw"
                className="object-cover object-center transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
              />
              {/* Soft gradient wash for caption legibility */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/45 via-slate-900/10 to-transparent" />

              {/* Caption chip */}
              <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6">
                <p className="max-w-[16rem] text-[11px] font-semibold uppercase leading-5 tracking-[0.2em] text-white/90">
                  Science-backed care for modern homes
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Hairline divider with standards label ───────────────── */}
        <div className="mb-7 mt-14 flex items-center gap-5 md:mt-16">
          <span className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-200 to-slate-300" />
          <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.28em] text-slate-400">
            Six Non-Negotiable Standards
          </span>
          <span className="hidden font-serif text-sm italic tabular-nums text-brand-600 sm:block">
            01 — 06
          </span>
          <span className="h-px flex-1 bg-gradient-to-l from-transparent via-slate-200 to-slate-300" />
        </div>

        {/* ── Pillar cards: white with brand accents ──────────────── */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {pillars.map((item, index) => {
            const Icon = item.icon;
            return (
              <article
                key={item.title}
                className="group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card-hover sm:p-7"
              >
                {/* Corner tint on hover */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-50/0 blur-2xl transition-colors duration-500 group-hover:bg-brand-50"
                />

                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-100 bg-brand-50 text-brand-700 transition-colors duration-300 group-hover:border-brand-700 group-hover:bg-brand-700 group-hover:text-white">
                    <Icon className="h-6 w-6" strokeWidth={1.9} />
                  </span>
                  <span
                    aria-hidden="true"
                    className="font-serif text-4xl font-bold italic leading-none text-slate-100 transition-colors duration-300 group-hover:text-brand-200"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-bold tracking-tight text-slate-900">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-500">
                  {item.desc}
                </p>

                <span className="pointer-events-none absolute bottom-0 left-6 right-6 h-px origin-left scale-x-0 bg-gradient-to-r from-brand-600/70 via-brand-300/50 to-transparent transition-transform duration-500 group-hover:scale-x-100 sm:left-7 sm:right-7" />
              </article>
            );
          })}
        </div>

        {/* ── CTA: deep brand-green panel (site primary) ──────────── */}
        <div className="relative mt-16 overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-800 via-brand-800 to-navy-950 px-7 py-10 shadow-glow sm:px-10 md:px-14 md:py-12">
          {/* Ambient glows */}
          <div className="pointer-events-none absolute -right-24 -top-28 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-28 left-1/4 h-64 w-64 rounded-full bg-brand-400/10 blur-3xl" />
          {/* Subtle leaf-grid texture */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]"
          >
            <defs>
              <pattern id="cta-grid" width="44" height="44" patternUnits="userSpaceOnUse">
                <path d="M 44 0 L 0 0 0 44" fill="none" stroke="#bbf7d0" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-grid)" />
          </svg>

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.3em] text-brand-100">
                Ready When You Are
              </p>
              <h3 className="mt-2 text-3xl font-extrabold leading-[1.15] tracking-tight text-white sm:text-4xl">
                Book your first service today.
              </h3>
              <p className="mt-3 flex items-start gap-2 text-[13px] font-medium leading-6 text-emerald-100/70">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-300" strokeWidth={2.2} />
                <span>
                  Thrikannapuram · Kowdiar · Pattom · Kazhakkoottam ·
                  Technopark &amp; all Trivandrum
                </span>
              </p>
            </div>

            <Link
              href="/contact"
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-9 py-4 text-sm font-bold uppercase tracking-[0.14em] text-brand-800 shadow-xl transition-all duration-200 hover:bg-brand-50 hover:shadow-2xl active:scale-[0.97]"
            >
              <span>Book Online</span>
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" strokeWidth={2.4} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
