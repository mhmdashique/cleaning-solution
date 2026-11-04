import { Suspense } from "react";
import ContactForm from "@/components/contact/ContactForm";
import { Service } from "@/types";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Navigation,
} from "lucide-react";

type ContactSectionProps = {
  services: Service[];
  /** h1 for the dedicated /contact page, h2 when embedded on the homepage */
  headingLevel?: "h1" | "h2";
};

export default function ContactSection({
  services,
  headingLevel = "h2",
}: ContactSectionProps) {
  const Heading = headingLevel;

  const googleMapsUrl =
    "https://maps.google.com/maps?q=Thrikannapuram,+Thiruvananthapuram,+Kerala&t=&z=14&ie=UTF8&iwloc=&output=embed";

  const directionsUrl =
    "https://www.google.com/maps/dir/?api=1&destination=Thrikannapuram,+Thiruvananthapuram,+Kerala";

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="bg-slate-50 py-14 md:py-20 scroll-mt-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="max-w-3xl space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">
            Easy Online Booking
          </p>
          <Heading
            id="contact-heading"
            className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl"
          >
            Get in Touch with PLAN C
          </Heading>
          <p className="text-base leading-relaxed text-slate-600 sm:text-lg">
            Have an enquiry or ready to book? Complete the form below for an
            instant booking ID, or connect directly via phone or WhatsApp.
          </p>
        </div>

        {/* 2-Column Grid: Form (Col 7) and Info Panel (Col 5) */}
        <div className="mt-10 grid grid-cols-1 items-start gap-10 lg:grid-cols-12">
          {/* Form */}
          <div className="lg:col-span-7">
            <Suspense
              fallback={
                <div className="rounded-3xl bg-white p-8 text-center">
                  Loading booking form...
                </div>
              }
            >
              <ContactForm services={services} />
            </Suspense>
          </div>

          {/* Contact Details & Map */}
          <div className="space-y-6 lg:col-span-5">
            {/* Quick Helpline Card */}
            <div className="space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-soft">
              <h2 className="text-xl font-bold text-slate-900">
                Direct Contact Information
              </h2>

              <div className="space-y-4 text-sm text-slate-700">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Operating Office
                    </span>
                    <span className="font-semibold text-slate-900">
                      Thrikannapuram, Thiruvananthapuram, Kerala - 695032
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <Phone className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Phone Number
                    </span>
                    <a
                      href="tel:7994342372"
                      className="text-base font-bold text-brand-800 hover:underline"
                    >
                      +91 79943 42372
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Email Address
                    </span>
                    <a
                      href="mailto:contact@plancsolutions.in"
                      className="font-semibold text-slate-800 hover:text-brand-800"
                    >
                      contact@plancsolutions.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-400">
                      Working Hours
                    </span>
                    <span className="block font-semibold text-slate-900">
                      Monday - Sunday: 7:00 AM - 9:00 PM
                    </span>
                    <span className="text-xs text-slate-500">
                      Emergency call-outs available on request
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp CTA */}
              <div className="grid grid-cols-1 gap-3 pt-2">
                <a
                  href="https://wa.me/917994342372?text=Hi%20PLAN%20C%20Cleaning%2C%20I%20would%20like%20to%20inquire%20about%20cleaning%20services."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 text-xs font-bold text-white transition-colors hover:bg-[#20bd5a]"
                >
                  <MessageCircle className="h-4 w-4 fill-white text-[#25D366]" />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
              <div className="flex items-center justify-between border-b border-slate-200 bg-slate-50 p-4">
                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                  <MapPin className="h-4 w-4 text-brand-600" />
                  Location: Thrikannapuram, Trivandrum
                </span>
                <a
                  href={directionsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-700 hover:text-brand-900"
                >
                  <Navigation className="h-3.5 w-3.5" />
                  <span>Get Directions</span>
                </a>
              </div>

              <div className="relative h-64 w-full">
                <iframe
                  title="PLAN C Cleaning Solutions Location Map"
                  src={googleMapsUrl}
                  className="h-full w-full border-0"
                  loading="lazy"
                  allowFullScreen
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
