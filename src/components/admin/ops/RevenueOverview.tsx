"use client";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { BarChart3 } from "lucide-react";

interface MonthRevenue {
  month: string;
  revenue: number;
}

interface RevenueOverviewProps {
  data: MonthRevenue[];
  total: string;
  change: string;
  changeColor?: string;
}

export default function RevenueOverview({
  data,
  total,
  change,
}: RevenueOverviewProps) {
  const latest = data[data.length - 1];

  return (
    <div className="bg-white border border-[#EEF0F6] rounded-[20px] p-6 shadow-[0_2px_12px_rgba(15,21,53,0.03)] hover:shadow-[0_8px_24px_rgba(15,21,53,0.06)] transition-all duration-200">
      {/* Top Header: Title + Dropdown */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-[10px] bg-[#EEF0FF] text-[#5B5BF0] flex items-center justify-center shrink-0">
            <BarChart3 className="w-4 h-4" />
          </div>
          <h2 className="text-[16px] font-bold text-[#0F1535]">
            Revenue Overview
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Legend dots */}
          <div className="hidden sm:flex items-center gap-3 text-[12px] text-[#6B7280] font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#12B76A]" />
              This Period
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#D1D5DB]" />
              Last Period
            </span>
          </div>

          <select
            defaultValue="Last 6 Months"
            className="text-[12.5px] text-[#0F1535] font-medium border border-[#EEF0F6] rounded-xl bg-[#F6F7FD] px-3 py-1.5 outline-none focus:border-[#5B5BF0] cursor-pointer"
          >
            <option>Last 6 Months</option>
            <option>Last 3 Months</option>
            <option>Last 12 Months</option>
          </select>
        </div>
      </div>

      {/* Revenue Number + Percentage Delta */}
      <div className="flex items-baseline gap-3 mb-4">
        <div className="text-[32px] font-bold text-[#0F1535] tracking-tight">
          {total}
        </div>
        <div className="text-[13px] font-semibold text-[#12B76A] flex items-center gap-1">
          <span>↑</span>
          <span>{change.replace(/^[+\-↑]\s*/, "")} from last period</span>
        </div>
      </div>

      {/* Area Chart: May - Oct on x-axis, 0 - 5L on y-axis, dot markers, light green gradient fill */}
      <div className="w-full h-[240px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 20, right: 12, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueGreenGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#12B76A" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#12B76A" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#F3F4F6"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              stroke="#9CA3AF"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 12, fill: "#6B7280" }}
            />
            <YAxis
              stroke="#9CA3AF"
              tickLine={false}
              axisLine={false}
              domain={[0, 500000]}
              ticks={[0, 100000, 200000, 300000, 400000, 500000]}
              tickFormatter={(v) => (v === 0 ? "0" : `${v / 100000}L`)}
              tick={{ fontSize: 12, fill: "#6B7280" }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-[#12B76A] text-white font-bold text-[12px] px-3 py-1.5 rounded-full shadow-lg">
                      ₹ {(payload[0].value as number).toLocaleString("en-IN")}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#12B76A"
              strokeWidth={3}
              fill="url(#revenueGreenGradient)"
              dot={{ r: 4, fill: "#12B76A", strokeWidth: 2, stroke: "#FFFFFF" }}
              activeDot={{ r: 6, fill: "#12B76A", strokeWidth: 3, stroke: "#FFFFFF" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
