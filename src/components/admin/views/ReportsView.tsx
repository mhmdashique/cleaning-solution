"use client";

import { Calendar, Users, CalendarCheck, TrendingUp, CheckCircle2 } from "lucide-react";
import DashboardKpiCard from "../ops/DashboardKpiCard";
import RevenueOverview from "../ops/RevenueOverview";
import { useOpsHub } from "@/context/OpsHubContext";

export default function ReportsView() {
  const { bookings, payments, customers } = useOpsHub();

  const totalRevenue = payments
    .filter((p) => p.status === "Paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const completedCount = bookings.filter((b) => b.status === "Completed").length;

  const sparklineRevenue = [18, 26, 32, 38, 45, 52, 60, 72, 80, 95];
  const sparklineBookings = [32, 45, 52, 48, 60, 58, 68, 72, 85, 92];
  const sparklineCustomers = [20, 24, 28, 35, 38, 42, 48, 55, 60, 68];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#0F1535] tracking-tight">Reports</h1>
          <p className="text-[14px] text-[#6B7280] mt-0.5">Live operational performance analytics &amp; revenue metrics</p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#EEF0F6] text-[13px] text-[#0F1535] font-medium shadow-xs">
          <Calendar className="w-4 h-4 text-[#6B7280]" />
          <span>Oct 1 – Oct 31, 2025</span>
        </div>
      </div>

      {/* 3 KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <DashboardKpiCard
          icon={<span className="font-bold text-[17px]">₹</span>}
          iconBg="bg-[#F5F3FF] text-[#8B5CF6]"
          label="Total Revenue"
          value={`₹ ${totalRevenue.toLocaleString("en-IN")}`}
          trend="15.7%"
          sparkline={sparklineRevenue}
          sparklineColor="#8B5CF6"
        />
        <DashboardKpiCard
          icon={<CalendarCheck className="w-5 h-5" />}
          iconBg="bg-[#EFF8FF] text-[#3B82F6]"
          label="Total Bookings"
          value={bookings.length}
          trend="12.5%"
          sparkline={sparklineBookings}
          sparklineColor="#3B82F6"
        />
        <DashboardKpiCard
          icon={<Users className="w-5 h-5" />}
          iconBg="bg-[#ECFDF3] text-[#12B76A]"
          label="Active Customers"
          value={customers.length}
          trend="8.3%"
          sparkline={sparklineCustomers}
          sparklineColor="#12B76A"
        />
      </div>

      {/* Large Revenue Trend Line Chart */}
      <div className="w-full">
        <RevenueOverview
          data={[
            { month: "May", revenue: 150000 },
            { month: "Jun", revenue: 240000 },
            { month: "Jul", revenue: 320000 },
            { month: "Aug", revenue: 380000 },
            { month: "Sep", revenue: 410000 },
            { month: "Oct", revenue: totalRevenue || 450280 },
          ]}
          total={`₹ ${totalRevenue.toLocaleString("en-IN")}`}
          change="15.7%"
        />
      </div>
    </div>
  );
}
