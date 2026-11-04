"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import ChartCard from "./ChartCard";

interface HourSlot {
  slot: string;
  bookings: number;
  isPeak?: boolean;
}

interface PeakHoursChartProps {
  data: HourSlot[];
}

export default function PeakHoursChart({ data }: PeakHoursChartProps) {
  const maxVal = Math.max(...data.map((d) => d.bookings));

  return (
    <ChartCard
      title="Peak booking hours"
      subtitle="Preferred appointment slots across Trivandrum"
      ariaLabel="Bar chart of peak booking hours"
    >
      <div className="w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <CartesianGrid
              stroke="#E3E8E5"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="slot"
              stroke="#5D6B65"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "#5D6B65" }}
            />
            <YAxis
              stroke="#5D6B65"
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "#5D6B65" }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white border border-[#E3E8E5] rounded-[8px] p-2 text-xs shadow-md">
                      <div className="font-semibold text-[#12201B]">
                        {label}
                      </div>
                      <div className="text-[#0F6B54] font-medium">
                        {payload[0].value} bookings
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="bookings" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => {
                const isHighest = entry.bookings === maxVal;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={isHighest ? "#0F6B54" : "#D6DFDA"}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
