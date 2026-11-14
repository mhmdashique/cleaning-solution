import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";

const serviceAreas = [
  {
    title: "Main Areas in Trivandrum",
    places: [
      "Kazhakkoottam",
      "Technopark",
      "Akkulam",
      "Sreekariyam",
      "Ulloor",
      "Pattom",
      "Kowdiar",
      "Vellayambalam",
      "Palayam",
      "Statue",
      "Thampanoor",
      "East Fort",
      "Karamana",
      "Poojappura",
      "Sasthamangalam",
      "Vazhuthacaud",
      "Jagathy",
    ],
  },
  {
    title: "Residential & Suburban Areas",
    places: [
      "Thirumala",
      "Peyad",
      "Malayinkeezhu",
      "Nemom",
      "Balaramapuram",
      "Neyyattinkara",
      "Vattiyoorkavu",
      "Peroorkada",
      "Mannanthala",
      "Paruthippara",
      "Kannanmoola",
      "Anayara",
      "Pettah",
      "Chacka",
      "Enchakkal",
    ],
  },
  {
    title: "Nearby Locations We Serve",
    places: [
      "Attingal",
      "Kallambalam",
      "Varkala",
      "Chirayinkeezhu",
      "Kilimanoor",
      "Nedumangad",
    ],
  },
];

export default function ServiceAreas() {
  return (
    <section
      aria-labelledby="service-areas-heading"
      className="border-t border-slate-100 bg-white py-16 md:py-20"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.05fr_2.65fr] lg:items-start lg:gap-12 lg:px-8">
        <div className="flex flex-col items-start lg:sticky lg:top-28">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">
            Serving Trivandrum & nearby
          </span>
          <h2
            id="service-areas-heading"
            className="mt-4 max-w-sm text-3xl font-bold leading-tight tracking-tight text-slate-900 sm:text-4xl"
          >
            Service Areas in Trivandrum
          </h2>
          <p className="mt-4 max-w-md text-sm leading-6 text-slate-600 sm:text-[15px] sm:leading-7">
            We provide professional deep cleaning services across major
            residential and commercial areas in Trivandrum and nearby
            locations.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="tel:7994342372"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call Us
            </a>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-700"
            >
              Book Now
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="grid gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {serviceAreas.map((area) => (
            <div key={area.title}>
              <h3 className="max-w-[16rem] text-sm font-bold leading-6 text-slate-900">
                {area.title}
              </h3>
              <ul className="mt-4 space-y-2.5">
                {area.places.map((place) => (
                  <li
                    key={place}
                    className="flex items-center gap-2.5 text-sm text-slate-600"
                  >
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand-600"
                      aria-hidden="true"
                    />
                    {place}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
