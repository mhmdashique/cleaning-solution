"use client";

import { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import ChartCard from "./ChartCard";

interface TrendPoint {
  date: string;
  bookings: number;
}

interface BookingsTrendChartProps {
  last7Days: TrendPoint[];
  last30Days: TrendPoint[];
}

export default function BookingsTrendChart({
  last7Days,
  last30Days,
}: BookingsTrendChartProps) {
  const [range, setRange] = useState<"7d" | "30d">("7d");
  const data = range === "7d" ? last7Days : last30Days;

  return (
    <ChartCard
      title="Bookings trend"
      subtitle="Volume of daily customer bookings"
      ariaLabel="Bookings trend over time"
      action={
        <div 
          className="inline-flex items-center p-0.5 rounded-[8px] bg-[#F1F4F2] border border-[#E3E8E5]"
          role="group"
          aria-label="Time range selector"
        >
          <button
            type="button"
            onClick={() => setRange("7d")}
            aria-pressed={range === "7d"}
            className={`px-2.5 py-1 text-[12px] font-medium rounded-[6px] transition-colors cursor-pointer ${
              range === "7d"
                ? "bg-white text-[#12201B] shadow-xs font-semibold"
                : "text-[#5D6B65] hover:text-[#12201B]"
            }`}
          >
            7 days
          </button>
          <button
            type="button"
            onClick={() => setRange("30d")}
            aria-pressed={range === "30d"}
            className={`px-2.5 py-1 text-[12px] font-medium rounded-[6px] transition-colors cursor-pointer ${
              range === "30d"
                ? "bg-white text-[#12201B] shadow-xs font-semibold"
                : "text-[#5D6B65] hover:text-[#12201B]"
            }`}
          >
            30 days
          </button>
        </div>
      }
    >
      <div className="w-full h-[220px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorBookingsLight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0F6B54" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#0F6B54" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="#E3E8E5"
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              stroke="#5D6B65"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "#5D6B65" }}
            />
            <YAxis
              stroke="#5D6B65"
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              tick={{ fontSize: 12, fill: "#5D6B65" }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white border border-[#E3E8E5] rounded-[8px] p-2.5 text-xs shadow-md">
                      <div className="font-semibold text-[#12201B] mb-0.5">
                        {label}
                      </div>
                      <div className="text-[#0F6B54] font-medium flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#0F6B54]" />
                        <span>{payload[0].value} bookings</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="bookings"
              stroke="#0F6B54"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorBookingsLight)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
}
