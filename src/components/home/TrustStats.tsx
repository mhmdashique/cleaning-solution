import { Award, Users, Sparkles, ShieldCheck } from "lucide-react";

export default function TrustStats() {
  const stats = [
    {
      icon: Award,
      value: "5+ Years",
      label: "Kerala Industry Record",
      desc: "Serving Thiruvananthapuram homes and facilities since 2019.",
    },
    {
      icon: Users,
      value: "2,500+",
      label: "Properties Cleaned",
      desc: "From private villas in Kowdiar to Tech campuses in Technopark.",
    },
    {
      icon: Sparkles,
      value: "24+",
      label: "Mechanised Services",
      desc: "Deep cleaning, water tank sanitisation, and odorless pest defense.",
    },
    {
      icon: ShieldCheck,
      value: "100%",
      label: "Satisfaction Assurance",
      desc: "Rigorous standards with immediate re-clean if anything is missed.",
    },
  ];

  return (
    <section className="bg-slate-50 border-b border-slate-200/80 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 divide-y lg:divide-y-0 lg:divide-x divide-slate-200/80">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`flex flex-col items-start ${
                  idx !== 0 ? "pt-6 lg:pt-0 lg:pl-8" : ""
                }`}
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-brand-800">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
                    {stat.value}
                  </span>
                </div>
                <div className="font-bold text-xs uppercase tracking-wider text-slate-800">
                  {stat.label}
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {stat.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
