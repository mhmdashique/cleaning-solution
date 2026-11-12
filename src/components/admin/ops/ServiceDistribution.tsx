"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

interface ServiceItem {
  service: string;
  percentage: number;
  count: number;
  color: string;
}

interface ServiceDistributionProps {
  data: ServiceItem[];
  total: number;
}

export default function ServiceDistribution({
  data,
  total,
}: ServiceDistributionProps) {
  return (
    <div className="bg-white border border-[#EEF0F6] rounded-[20px] p-6 shadow-[0_2px_12px_rgba(15,21,53,0.03)] hover:shadow-[0_8px_24px_rgba(15,21,53,0.06)] transition-all duration-200 flex flex-col justify-between">
      <div>
        <h2 className="text-[16px] font-bold text-[#0F1535] mb-2">
          Service Distribution
        </h2>
        <p className="text-[12px] text-[#6B7280]">
          Breakdown of total service bookings
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-2">
        {/* Donut with total in the center */}
        <div className="relative w-[150px] h-[150px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as ServiceItem;
                    return (
                      <div className="bg-white border border-[#EEF0F6] rounded-xl p-2.5 text-xs shadow-md">
                        <div className="font-bold text-[#0F1535]">
                          {item.service}
                        </div>
                        <div className="text-[#6B7280]">
                          {item.percentage}% ({item.count} bookings)
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Pie
                data={data}
                dataKey="count"
                nameKey="service"
                innerRadius={46}
                outerRadius={68}
                paddingAngle={4}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center text: "1,248 Bookings" */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[17px] font-bold text-[#0F1535] leading-tight">
              {total.toLocaleString("en-IN")}
            </span>
            <span className="text-[10px] text-[#6B7280] font-medium uppercase tracking-tight">
              Bookings
            </span>
          </div>
        </div>

        {/* Legend on the right with colored dots and percentages */}
        <div className="w-full sm:w-auto space-y-2.5">
          {data.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between sm:justify-start gap-3">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[13px] font-medium text-[#0F1535]">
                  {item.service}
                </span>
              </div>
              <span className="text-[13px] font-bold text-[#6B7280]">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 border-t border-[#EEF0F6] text-[11px] text-[#6B7280] text-center">
        Cleaning is the highest performing service
      </div>
    </div>
  );
}
