"use client";

import KpiCard from "../ops/KpiCard";
import BookingsTrendChart from "../ops/BookingsTrendChart";
import PipelineBar from "../ops/PipelineBar";
import ServiceDonut from "../ops/ServiceDonut";
import PeakHoursChart from "../ops/PeakHoursChart";
import RecentBookingsTable from "../ops/RecentBookingsTable";
import { AdminBooking } from "@/types/admin";
import { formatCurrency } from "@/lib/formatCurrency";
import {
  opsOverviewMetrics,
} from "@/lib/data/adminMockData";

interface OverviewViewProps {
  bookings: AdminBooking[];
  onNavigateToBookings: (filter?: string) => void;
}

export default function OverviewView({
  bookings,
  onNavigateToBookings,
}: OverviewViewProps) {
  const pendingCount = bookings.filter((b) => b.status === "Pending").length;
  const inProgressCount = bookings.filter(
    (b) => b.status === "In progress"
  ).length;
  const completedCount = bookings.filter(
    (b) => b.status === "Completed"
  ).length;
  const confirmedCount = bookings.filter(
    (b) => b.status === "Confirmed"
  ).length;
  const totalCount = bookings.length;

  const pipelinePercentage =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const completedBookings = bookings.filter(
    (booking) => booking.status === "Completed" && booking.amount !== null
  );
  const billedRevenue = completedBookings.reduce(
    (total, booking) => total + (booking.amount || 0),
    0
  );

  const trendLast7Days = [
    { date: "Thu", bookings: 1 },
    { date: "Fri", bookings: 2 },
    { date: "Sat", bookings: 4 },
    { date: "Sun", bookings: 3 },
    { date: "Mon", bookings: 2 },
    { date: "Tue", bookings: 3 },
    { date: "Wed", bookings: 4 },
  ];

  const trendLast30Days = [
    { date: "Oct 8", bookings: 2 },
    { date: "Oct 12", bookings: 4 },
    { date: "Oct 16", bookings: 3 },
    { date: "Oct 20", bookings: 5 },
    { date: "Oct 24", bookings: 4 },
    { date: "Oct 28", bookings: 6 },
    { date: "Nov 1", bookings: 5 },
    { date: "Nov 4", bookings: 4 },
  ];

  const servicesDonut = [
    { service: "Home cleaning", percentage: 35, count: 14, color: "#0F6B54" },
    { service: "Pest control", percentage: 30, count: 12, color: "#2F7FC1" },
    { service: "Deep cleaning", percentage: 20, count: 8, color: "#6C5BC9" },
    { service: "Other", percentage: 15, count: 6, color: "#B57F0A" },
  ];

  const peakHours = [
    { slot: "7–9 AM", bookings: 14 },
    { slot: "9–11 AM", bookings: 28, isPeak: true },
    { slot: "11 AM–1 PM", bookings: 19 },
    { slot: "1–3 PM", bookings: 8 },
    { slot: "3–5 PM", bookings: 16 },
    { slot: "5–7 PM", bookings: 21 },
    { slot: "7–9 PM", bookings: 9 },
  ];

  const recentRows = bookings.slice(0, 5).map((b) => ({
    id: b.bookingCode,
    customer: b.customerName,
    phone: b.customerPhone,
    service: b.serviceName,
    area: b.area,
    status: b.status,
    amount: b.amount,
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Row 1: 4 Neutral KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          label="Total bookings"
          value={totalCount}
          sublabel={opsOverviewMetrics.totalBookings.sublabel}
          badge="+2 vs last week"
        />
        <KpiCard
          label="Pending dispatch"
          value={pendingCount}
          sublabel="Awaiting customer confirmation"
        />
        <KpiCard
          label="In progress"
          value={inProgressCount}
          sublabel="Technicians on site"
        />
        <KpiCard
          label="Billed revenue"
          value={completedBookings.length > 0 ? formatCurrency(billedRevenue) : "—"}
          sublabel={
            completedBookings.length > 0
              ? `${completedBookings.length} priced completed ${
                  completedBookings.length === 1 ? "job" : "jobs"
                }`
              : "No booking amounts entered"
          }
        />
      </div>

      {/* Row 2: Bookings trend (2fr) + Pipeline fulfilment (1fr) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-start">
        <div className="lg:col-span-2">
          <BookingsTrendChart
            last7Days={trendLast7Days}
            last30Days={trendLast30Days}
          />
        </div>
        <div className="lg:col-span-1">
          <PipelineBar
            percentage={pipelinePercentage}
            summary={`${completedCount} of ${totalCount} orders fulfilled`}
            counts={{
              completed: completedCount,
              inProgress: inProgressCount,
              confirmed: confirmedCount,
              pending: pendingCount,
            }}
          />
        </div>
      </div>

      {/* Row 3: Bookings by service (1fr) + Peak booking hours (1fr) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <ServiceDonut data={servicesDonut} total={40} />
        <PeakHoursChart data={peakHours} />
      </div>

      {/* Row 4: Recent bookings table */}
      <RecentBookingsTable
        bookings={recentRows}
        onViewAll={() => onNavigateToBookings()}
      />
    </div>
  );
}
