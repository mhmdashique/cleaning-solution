import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getServiceBySlug, getServices } from "@/lib/data/store";
import { ServiceJsonLd, FAQJsonLd } from "@/components/seo/JsonLd";
import { 
  CheckCircle2,
  Sparkles,
  ShieldCheck, 
  Clock, 
  Users, 
  ArrowRight, 
  ChevronRight,
  HelpCircle
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const services = await getServices();
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    return { title: "Service Not Found" };
  }

  return {
    title: service.meta_title || `${service.title} in Thiruvananthapuram | PLAN C`,
    description: service.meta_description || service.short_desc,
    openGraph: {
      title: `${service.title} | PLAN C Cleaning Solutions Kerala`,
      description: service.short_desc,
      images: [{ url: service.image_url, width: 1200, height: 630, alt: service.title }],
    },
  };
}

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  const allServices = await getServices();
  const relatedServices = allServices
    .filter((s) => s.category === service.category && s.slug !== service.slug)
    .slice(0, 3);

  // Dynamic FAQs tailored to this service
  const faqs = [
    {
      question: `How long does the ${service.title} take?`,
      answer: "Most residential sessions take between 2 to 5 hours depending on property square footage and initial contamination levels. Our team arrives fully equipped to complete the job in a single visit.",
    },
    {
      question: "Are the chemicals used safe for children and domestic pets?",
      answer: "Yes, absolutely. PLAN C exclusively uses eco-safe, neutral-pH and biodegradable formulations approved by municipal hygiene standards. Our pest control solutions are odorless and safe for indoor living spaces.",
    },
    {
      question: "Do I need to arrange water, electricity, or cleaning gear?",
      answer: "We bring all heavy equipment including single-disc scrubbers, steam units, ladder extensions, and supplies. We only require access to a normal water connection and electric power plug point.",
    },
    {
      question: "How do I pay, and what if I am not satisfied?",
      answer: "Payment is due only after our job completion and your inspection. If any spot is not up to your standard, our team addresses it immediately on the spot backed by our 100% satisfaction guarantee.",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-10 md:py-16">
      {/* Schema Injection */}
      <ServiceJsonLd
        name={service.title}
        description={service.short_desc}
        url={`https://plancsolutions.in/services/${service.slug}`}
        image={service.image_url}
      />
      <FAQJsonLd faqs={faqs} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Link href="/" className="hover:text-brand-700">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/services" className="hover:text-brand-700">Services</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-brand-900 font-bold truncate max-w-xs">{service.title}</span>
        </nav>

        {/* Top Hero Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Info (Col 8) */}
          <div className="lg:col-span-8 space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-100 text-brand-800 border border-brand-200">
                {service.category.replace("_", " ")}
              </span>

              <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {service.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal">
                {service.short_desc}
              </p>
            </div>

            {/* High-Res Hero Image */}
            <div className="relative h-72 sm:h-96 w-full rounded-3xl overflow-hidden border border-slate-200 shadow-md">
              <Image
                src={service.image_url}
                alt={service.title}
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* In-depth details */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-soft space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">
                Overview & Process in Kerala Homes
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                {service.long_desc}
              </p>

              <div className="pt-4 border-t border-slate-100 space-y-4">
                <h3 className="text-lg font-bold text-slate-900">
                  What is included in this service:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-700">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                    <span>Industrial single-disc & rotary scrubbers</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                    <span>Safe eco-friendly & non-toxic supplies</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                    <span>Trained, police-verified uniform crew</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                    <span>Hard water & mineral scale removal</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                    <span>Germ & bacterial sanitisation</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-brand-600 flex-shrink-0 mt-0.5" />
                    <span>Post-clean quality walk-through check</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Specific FAQs */}
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-soft space-y-6">
              <div className="flex items-center gap-2 text-brand-700">
                <HelpCircle className="w-5 h-5" />
                <h2 className="text-2xl font-bold text-slate-900">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="space-y-4 divide-y divide-slate-100">
                {faqs.map((faq, idx) => (
                  <div key={idx} className={idx !== 0 ? "pt-4" : ""}>
                    <h4 className="text-base font-bold text-slate-900 mb-2">
                      {faq.question}
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Sticky Booking Sidebar (Col 4) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            
            <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-soft-lg space-y-6">
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-brand-700">
                  Quick Booking
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900">
                  Book {service.title}
                </h3>
                <p className="text-xs text-slate-500">
                  Direct dispatch across Thiruvananthapuram, Kowdiar, Pattom, Kazhakkoottam & Technopark.
                </p>
              </div>

              <div className="space-y-3 py-3 border-y border-slate-100 text-xs text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3.5 h-3.5 text-brand-600" /> Duration:
                  </span>
                  <span className="font-bold text-slate-800">2 - 4 Hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium">
                    <Users className="w-3.5 h-3.5 text-brand-600" /> Team Size:
                  </span>
                  <span className="font-bold text-slate-800">2 - 5 Specialists</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-600" /> Guarantee:
                  </span>
                  <span className="font-bold text-emerald-700">100% Guaranteed</span>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href={`/contact?service=${encodeURIComponent(service.title)}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-gradient-to-r from-brand-700 to-brand-800 hover:from-brand-800 hover:to-brand-900 text-white font-bold text-sm shadow-md shadow-brand-900/15 hover:shadow-lg transition-all active:scale-[0.98]"
                >
                  <Sparkles className="w-4 h-4 text-accent-yellow" />
                  <span>Book This Service Now</span>
                </Link>
              </div>

              <p className="text-[11px] text-center text-slate-400">
                No advance payment needed • Inspect and pay after service
              </p>
            </div>

            {/* Quick Helpline Box */}
            <div className="bg-brand-900 rounded-3xl p-6 text-white space-y-3">
              <p className="text-xs font-semibold text-accent-yellow uppercase tracking-wider">
                Speak with a Cleaning Expert
              </p>
              <h4 className="text-lg font-bold">Have custom requirements?</h4>
              <p className="text-xs text-brand-200 leading-relaxed">
                We customize plans for large villas, commercial IT offices, and commercial institutions.
              </p>
              <a
                href="tel:7994342372"
                className="inline-flex items-center gap-2 text-sm font-bold text-white hover:text-accent-yellow transition-colors"
              >
                <span>Call +91 79943 42372</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>

        </div>

        {/* Related Services */}
        {relatedServices.length > 0 && (
          <div className="pt-12 border-t border-slate-200 space-y-6">
            <h3 className="text-2xl font-bold text-slate-900">
              Related Services in {service.category.replace("_", " ")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedServices.map((rel) => (
                <div
                  key={rel.slug}
                  className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-soft hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative h-44 w-full overflow-hidden">
                    <Image
                      src={rel.image_url}
                      alt={rel.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 space-y-2">
                    <h4 className="font-bold text-base text-slate-900 group-hover:text-brand-800 transition-colors">
                      <Link href={`/services/${rel.slug}`}>{rel.title}</Link>
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {rel.short_desc}
                    </p>
                    <div className="pt-3 flex items-center justify-between text-xs font-bold text-brand-700">
                      <Link href={`/services/${rel.slug}`}>View Service</Link>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

