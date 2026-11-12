"use client";

import { useMemo } from "react";
import {
  Calendar as CalendarIcon,
  Users,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import DashboardKpiCard from "../ops/DashboardKpiCard";
import RevenueOverview from "../ops/RevenueOverview";
import ServiceDistribution from "../ops/ServiceDistribution";
import DashboardRecentBookings from "../ops/DashboardRecentBookings";
import UpcomingAppointments from "../ops/UpcomingAppointments";
import CalendarPanel from "../ops/Calendar";
import { useOpsHub } from "@/context/OpsHubContext";
import { AdminBooking } from "@/types/admin";

interface OverviewViewProps {
  bookings?: AdminBooking[];
  onNavigateToBookings?: (filter?: string) => void;
}

export default function OverviewView({
  onNavigateToBookings,
}: OverviewViewProps) {
  const { bookings, customers, services, payments } = useOpsHub();

  const totalBookingsCount = bookings.length;
  const activeCustomersCount = customers.filter((c) => c.status === "Active").length;
  const completedJobsCount = bookings.filter((b) => b.status === "Completed").length;
  const totalRevenue = payments
    .filter((p) => p.status === "Paid")
    .reduce((sum, p) => sum + p.amount, 0);

  // Sparklines - default to subtle baseline flatline or proportional points when no data
  const sparklineBookings = totalBookingsCount > 0 ? [32, 45, 52, 48, 60, 58, 68, 72, 85, Math.min(120, totalBookingsCount * 12)] : [0, 0, 0, 0, 0, 0, 0, 0];
  const sparklineCustomers = activeCustomersCount > 0 ? [20, 24, 28, 35, 38, 42, 48, 55, 60, Math.min(100, activeCustomersCount * 10)] : [0, 0, 0, 0, 0, 0, 0, 0];
  const sparklineRevenue = totalRevenue > 0 ? [18, 26, 32, 38, 45, 52, 60, 72, 80, 95] : [0, 0, 0, 0, 0, 0, 0, 0];
  const sparklineCompleted = completedJobsCount > 0 ? [28, 35, 42, 46, 50, 55, 62, 70, 78, Math.min(110, completedJobsCount * 15)] : [0, 0, 0, 0, 0, 0, 0, 0];

  // Monthly revenue breakdown
  const revenueChartData = useMemo(() => {
    const months = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];
    if (totalRevenue === 0) {
      return months.map((m) => ({ month: m, revenue: 0 }));
    }
    return [
      { month: "May", revenue: Math.round(totalRevenue * 0.1) },
      { month: "Jun", revenue: Math.round(totalRevenue * 0.15) },
      { month: "Jul", revenue: Math.round(totalRevenue * 0.2) },
      { month: "Aug", revenue: Math.round(totalRevenue * 0.18) },
      { month: "Sep", revenue: Math.round(totalRevenue * 0.25) },
      { month: "Oct", revenue: Math.round(totalRevenue * 0.3) },
    ];
  }, [totalRevenue]);
  const recentRows = useMemo(() => {
    return bookings.slice(0, 4).map((b) => {
      const cust = customers.find((c) => c.id === b.customerId)?.name || b.customerName || "Customer";
      const svc = services.find((s) => s.id === b.serviceId)?.name || b.serviceName || "Cleaning";
      return {
        status: b.status,
        customer: cust,
        service: svc,
        when: `${b.date} · ${b.time}`,
      };
    });
  }, [bookings, customers, services]);

  // Live upcoming appointments
  const upcomingRows = useMemo(() => {
    const upcoming = bookings.filter((b) => b.status === "Confirmed" || b.status === "In Progress" || b.status === "Pending");
    return (upcoming.length > 0 ? upcoming : bookings).slice(0, 3).map((b) => {
      const svc = services.find((s) => s.id === b.serviceId)?.name || b.serviceName || "Service";
      return {
        when: `${b.date} · ${b.time}`,
        service: svc,
      };
    });
  }, [bookings, services]);

  return (
    <div className="space-y-7 animate-in fade-in duration-200 font-sans">
      {/* HEADER: Matching Image 1 */}
      <div>
        <h1 className="text-[32px] sm:text-[40px] font-extrabold text-[#0F1535] leading-tight tracking-tight">
          Welcome back, Admin!
        </h1>
        <p className="mt-1 text-[15px] sm:text-[16px] text-[#6B7280] leading-relaxed">
          Here&apos;s what&apos;s happening with your business today.
        </p>
      </div>

      {/* KPI ROW: 4 equal cards with pastel icons, numbers, green delta & sparkline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* 1. Total Bookings */}
        <DashboardKpiCard
          icon={<CalendarIcon className="w-5 h-5" />}
          iconBg="bg-[#EFF8FF] text-[#3B82F6]"
          label="Total Bookings"
          value={totalBookingsCount.toLocaleString("en-IN")}
          trend="12.5%"
          sparkline={sparklineBookings}
          sparklineColor="#3B82F6"
        />

        {/* 2. Active Customers */}
        <DashboardKpiCard
          icon={<Users className="w-5 h-5" />}
          iconBg="bg-[#ECFDF3] text-[#12B76A]"
          label="Active Customers"
          value={activeCustomersCount.toLocaleString("en-IN")}
          trend="8.3%"
          sparkline={sparklineCustomers}
          sparklineColor="#12B76A"
        />

        {/* 3. Total Revenue */}
        <DashboardKpiCard
          icon={<span className="font-bold text-[17px]">₹</span>}
          iconBg="bg-[#F5F3FF] text-[#8B5CF6]"
          label="Total Revenue"
          value={`₹ ${totalRevenue.toLocaleString("en-IN")}`}
          trend="15.7%"
          sparkline={sparklineRevenue}
          sparklineColor="#8B5CF6"
        />

        {/* 4. Completed Jobs */}
        <DashboardKpiCard
          icon={<CheckCircle2 className="w-5 h-5" />}
          iconBg="bg-[#ECFDF3] text-[#12B76A]"
          label="Completed Jobs"
          value={completedJobsCount.toLocaleString("en-IN")}
          trend="13.2%"
          sparkline={sparklineCompleted}
          sparklineColor="#12B76A"
        />
      </div>

      {/* MIDDLE ROW: Revenue Overview (wide) + Service Distribution + Promo Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Revenue Overview Card */}
        <div className="lg:col-span-6 flex flex-col">
          <RevenueOverview
            data={revenueChartData}
            total={`₹ ${totalRevenue.toLocaleString("en-IN")}`}
            change={totalRevenue > 0 ? "↑ 15.7% from last period" : "No payments recorded yet"}
          />
        </div>

        {/* Service Distribution Donut Card */}
        <div className="lg:col-span-3 flex flex-col">
          <ServiceDistribution
            total={totalBookingsCount}
            data={
              totalBookingsCount === 0
                ? [
                    { service: "Cleaning", percentage: 0, count: 0, color: "#12B76A" },
                    { service: "Pest Control", percentage: 0, count: 0, color: "#3B82F6" },
                    { service: "Specialised", percentage: 0, count: 0, color: "#8B5CF6" },
                  ]
                : [
                    { service: "Cleaning", percentage: 52, count: Math.round(totalBookingsCount * 0.52), color: "#12B76A" },
                    { service: "Pest Control", percentage: 32, count: Math.round(totalBookingsCount * 0.32), color: "#3B82F6" },
                    { service: "Specialised", percentage: 16, count: Math.round(totalBookingsCount * 0.16), color: "#8B5CF6" },
                  ]
            }
          />
        </div>

        {/* Promo Card: Lavender with Sparkle & Green progress underline */}
        <div className="lg:col-span-3 flex flex-col justify-between bg-[#F6F7FD] border border-[#EEF0F6] rounded-[20px] p-6 shadow-[0_4px_24px_rgba(91,91,240,0.06)] relative overflow-hidden">
          <div className="space-y-4">
            <div className="w-12 h-12 rounded-[16px] bg-gradient-to-br from-[#8B5CF6] to-[#5B5BF0] text-white flex items-center justify-center shadow-sm">
              <span className="text-[22px]">✨</span>
            </div>
            <div>
              <span className="inline-block px-2.5 py-1 rounded-full bg-[#EEF0FF] text-[#5B5BF0] text-[11px] font-bold uppercase tracking-wider mb-2">
                Operational Vision
              </span>
              <h3 className="text-[19px] font-bold text-[#0F1535] leading-snug">
                Cleaner Kerala, Greener Tomorrow
              </h3>
              <p className="mt-2 text-[13px] text-[#6B7280] leading-relaxed">
                Eco-safe chemicals, compliant pest protection, and certified hygiene specialists dispatching across Trivandrum.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-[#EEF0F6] mt-4 space-y-2">
            <div className="flex justify-between text-[12px] font-semibold">
              <span className="text-[#6B7280]">Monthly Dispatch Target</span>
              <span className="text-[#12B76A]">84% Achieved</span>
            </div>
            <div className="w-full h-2 bg-[#E9EDF5] rounded-full overflow-hidden">
              <div className="h-full w-[84%] bg-[#12B76A] rounded-full transition-all duration-500" />
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: Recent Bookings + Upcoming Appointments + Mini Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Recent Bookings Card (5 cols) */}
        <div className="lg:col-span-5 flex flex-col">
          <DashboardRecentBookings
            bookings={recentRows}
            onViewAll={() => onNavigateToBookings?.()}
          />
        </div>

        {/* Upcoming Appointments Card (4 cols) */}
        <div className="lg:col-span-4 flex flex-col">
          <UpcomingAppointments appointments={upcomingRows} />
        </div>

        {/* Mini Calendar Card (3 cols) */}
        <div className="lg:col-span-3 flex flex-col">
          <CalendarPanel />
        </div>
      </div>
    </div>
  );
}
