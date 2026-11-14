import { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { OpsHubProvider } from "@/context/OpsHubContext";
import { checkAdminSession } from "@/lib/admin-auth";
import { 
  getAllBookings, 
  getServices, 
  getAllReviews, 
  getAllBlogPosts,
  getClientNoteStates,
} from "@/lib/data/store";

export const metadata: Metadata = {
  title: "Operations Hub | PLAN C Cleaning Solutions",
  robots: {
    index: false,
    follow: false,
  },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!(await checkAdminSession())) {
    redirect("/admin/login");
  }

  const [bookings, services, reviews, blogPosts, clientNoteStates] =
    await Promise.all([
      getAllBookings(),
      getServices(),
      getAllReviews(),
      getAllBlogPosts(),
      getClientNoteStates(),
    ]);

  return (
    <OpsHubProvider initialServices={services} initialBookings={bookings}>
      <AdminDashboard
        bookings={bookings}
        services={services}
        reviews={reviews}
        blogPosts={blogPosts}
        clientNoteStates={clientNoteStates}
      />
    </OpsHubProvider>
  );
}
