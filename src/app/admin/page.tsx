import { Metadata } from "next";
import { checkAdminSession } from "@/app/actions/admin";
import PasscodeGate from "@/components/admin/PasscodeGate";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { OpsHubProvider } from "@/context/OpsHubContext";
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
  const isAuthenticated = await checkAdminSession();

  if (!isAuthenticated) {
    return <PasscodeGate />;
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
