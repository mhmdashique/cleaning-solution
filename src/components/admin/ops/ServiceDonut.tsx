"use client";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";
import ChartCard from "./ChartCard";

interface ServiceItem {
  service: string;
  percentage: number;
  count: number;
  color: string;
}

interface ServiceDonutProps {
  data: ServiceItem[];
  total: number;
}

export default function ServiceDonut({ data, total }: ServiceDonutProps) {
  return (
    <ChartCard
      title="Bookings by service"
      subtitle="Distribution across service categories"
      ariaLabel="Donut chart showing bookings percentage by service"
    >
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-2">
        {/* Donut with total in the center */}
        <div className="relative w-[170px] h-[170px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as ServiceItem;
                    return (
                      <div className="bg-white border border-[#E3E8E5] rounded-[8px] p-2 text-xs shadow-md">
                        <div className="font-semibold text-[#12201B]">
                          {item.service}
                        </div>
                        <div className="text-[#5D6B65]">
                          {item.percentage}% ({item.count} jobs)
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
                innerRadius={52}
                outerRadius={74}
                paddingAngle={3}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-[24px] font-bold text-[#12201B] leading-none">
              {total}
            </span>
            <span className="text-[11px] text-[#5D6B65] mt-0.5">
              Total
            </span>
          </div>
        </div>

        {/* Percentage list */}
        <div className="w-full space-y-2 text-[13px]">
          {data.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between py-1 border-b border-[#E3E8E5]/60 last:border-0"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-[#12201B] font-medium">
                  {item.service}
                </span>
              </div>
              <span className="font-semibold text-[#5D6B65]">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </ChartCard>
  );
}
