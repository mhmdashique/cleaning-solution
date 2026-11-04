import { Metadata } from "next";
import { checkAdminSession } from "@/app/actions/admin";
import PasscodeGate from "@/components/admin/PasscodeGate";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { 
  getAllBookings, 
  getServices, 
  getAllReviews, 
  getAllBlogPosts 
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

  const [bookings, services, reviews, blogPosts] = await Promise.all([
    getAllBookings(),
    getServices(),
    getAllReviews(),
    getAllBlogPosts(),
  ]);

  return (
    <AdminDashboard
      bookings={bookings}
      services={services}
      reviews={reviews}
      blogPosts={blogPosts}
    />
  );
}
