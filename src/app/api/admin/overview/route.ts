import { NextResponse } from "next/server";
import {
  getAllBookings,
  getServices,
  getAllReviews,
  getAllBlogPosts,
  getClientNoteStates,
} from "@/lib/data/store";
import { formatCurrency } from "@/lib/formatCurrency";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [bookings, services, reviews, blogPosts, clientNoteStates] =
      await Promise.all([
        getAllBookings().catch(() => []),
        getServices().catch(() => []),
        getAllReviews().catch(() => []),
        getAllBlogPosts().catch(() => []),
        getClientNoteStates().catch(() => ({})),
      ]);

    const totalBookings = bookings.length;
    const pending = bookings.filter((b) => b.status === "Pending").length;
    const inProgress = bookings.filter((b) => b.status === "In progress").length;
    const completed = bookings.filter((b) => b.status === "Completed").length;
    const confirmed = bookings.filter((b) => b.status === "Confirmed").length;
    const billedBookings = bookings.filter(
      (booking) => booking.status === "Completed" && booking.amount != null
    );
    const billedRevenue = billedBookings.reduce(
      (total, booking) => total + (booking.amount || 0),
      0
    );

    const unhandledNotes = Object.values(clientNoteStates).filter(
      (handled) => !handled
    ).length;

    const percentage =
      totalBookings > 0 ? Math.round((completed / totalBookings) * 100) : 0;

    return NextResponse.json({
      metrics: {
        totalBookings: {
          value: totalBookings,
          sublabel: "Bookings received to date",
          badge: "All time",
        },
        pendingDispatch: {
          value: pending,
          sublabel: "Awaiting customer confirmation",
        },
        inProgress: {
          value: inProgress,
          sublabel: "Technicians on site",
        },
        billedRevenue: {
          value: billedBookings.length > 0 ? formatCurrency(billedRevenue) : "—",
          sublabel:
            billedBookings.length > 0
              ? `${billedBookings.length} priced completed ${
                  billedBookings.length === 1 ? "job" : "jobs"
                }`
              : "No booking amounts entered",
        },
      },
      pipeline: {
        percentage,
        summary: `${completed} of ${totalBookings} orders fulfilled`,
        counts: {
          completed,
          inProgress,
          confirmed,
          pending,
        },
      },
      navCounts: {
        bookings: totalBookings,
        services: services.length,
        reviews: reviews.length,
        blog: blogPosts.length,
        unhandledNotes,
      },
      statusChips: {
        awaitingDispatch: pending,
        operatingHours: "Dispatch 7:00 AM – 9:00 PM",
      },
    });
  } catch {
    // No data available — report empty counts rather than placeholder figures.
    return NextResponse.json({
      metrics: {
        totalBookings: {
          value: 0,
          sublabel: "Bookings received to date",
          badge: "All time",
        },
        pendingDispatch: { value: 0, sublabel: "Awaiting customer confirmation" },
        inProgress: { value: 0, sublabel: "Technicians on site" },
        billedRevenue: { value: "—", sublabel: "No booking amounts entered" },
      },
      pipeline: {
        percentage: 0,
        summary: "0 of 0 orders fulfilled",
        counts: { completed: 0, inProgress: 0, confirmed: 0, pending: 0 },
      },
      navCounts: {
        bookings: 0,
        services: 0,
        reviews: 0,
        blog: 0,
        unhandledNotes: 0,
      },
      statusChips: {
        awaitingDispatch: 0,
        operatingHours: "Dispatch 7:00 AM – 9:00 PM",
      },
    });
  }
}
