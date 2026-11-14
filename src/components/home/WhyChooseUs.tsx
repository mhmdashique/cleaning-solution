import Image from "next/image";

const clients = [
  { name: "Sarathy", image: "/images/sarathy%20logo.jpg" },
  {
    name: "Chaithanya Eye Hospital & Research Institute",
    image: "/images/chaithanya%20logo.jpg",
  },
  { name: "LuLu", image: "/images/lulu%20logo.jpg" },
  { name: "Mall of Travancore", image: "/images/MOT%20logo.jpg" },
  { name: "Amrita Television", image: "/images/amritha%20logo.jpg" },
  { name: "Technopark", image: "/images/tp%20logog.jpg" },
];

function ClientLogos({ duplicate = false }: { duplicate?: boolean }) {
  return (
    <ul
      aria-hidden={duplicate || undefined}
      className="flex shrink-0 items-center gap-5 pr-5"
    >
      {clients.map((client) => (
        <li
          key={client.name}
          className="flex h-32 w-64 shrink-0 items-center justify-center rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:h-36 sm:w-72"
        >
          <Image
            src={client.image}
            alt={duplicate ? "" : client.name}
            width={240}
            height={120}
            sizes="(max-width: 640px) 256px, 288px"
            className="max-h-full w-full object-contain"
          />
        </li>
      ))}
    </ul>
  );
}

export default function WhyChooseUs() {
  return (
    <section
      id="why-us"
      aria-labelledby="why-us-heading"
      className="overflow-hidden border-y border-brand-100 bg-slate-50/70 py-16 md:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-9 text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">
            Trusted by businesses
          </p>
          <h2
            id="why-us-heading"
            className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
          >
            Clients Who <span className="text-brand-700">Trust Us</span>
          </h2>
        </div>

        <div className="trusted-client-marquee" aria-label="Client logos">
          <div className="trusted-client-track">
            <ClientLogos />
            <ClientLogos duplicate />
          </div>
        </div>
      </div>
    </section>
  );
}
