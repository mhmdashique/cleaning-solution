"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
} from "recharts";

interface WeekRevenue {
  week: string;
  revenue: number;
}

interface RevenueChartProps {
  data: WeekRevenue[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="w-full h-[95px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 0, left: 0, bottom: 0 }}
        >
          <XAxis
            dataKey="week"
            stroke="#5D6B65"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 11, fill: "#5D6B65" }}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                const val = payload[0].value as number;
                return (
                  <div className="bg-white border border-[#E3E8E5] rounded-[6px] p-1.5 text-xs shadow-md">
                    <span className="font-semibold text-[#12201B]">
                      {label}: ₹{val.toLocaleString("en-IN")}
                    </span>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="revenue"
            fill="#0F6B54"
            radius={[4, 4, 0, 0]}
            maxBarSize={28}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
