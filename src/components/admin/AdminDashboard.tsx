"use client";

import { useState, useTransition } from "react";
import { Booking, Service, Review, BlogPost, BookingStatus } from "@/types";
import { 
  logoutAdminAction, 
  updateBookingAdminAction, 
  updateBookingAmountAdminAction,
  updateBookingPaymentStatusAdminAction,
  toggleReviewApprovalAction, 
  deleteReviewAdminAction, 
  createBlogPostAdminAction, 
  deleteBlogPostAdminAction 
} from "@/app/actions/admin";

import AppShell from "./shell/AppShell";
import Toast, { ToastMessage } from "./shared/Toast";
import OverviewView from "./views/OverviewView";
import BookingsView from "./views/BookingsView";
import ServicesView from "./views/ServicesView";
import ReviewsView from "./views/ReviewsView";
import ArticlesView from "./views/ArticlesView";
import ClientNotesView from "./views/ClientNotesView";

import { 
  AdminTab, 
  AdminBooking, 
  AdminService, 
  AdminReview, 
  AdminArticle, 
  AdminClientNote,
  PaymentStatus,
} from "@/types/admin";

import { 
  initialBookings, 
  initialServices, 
  initialReviews, 
  initialArticles, 
  initialClientNotes 
} from "@/lib/data/adminMockData";

interface AdminDashboardProps {
  bookings: Booking[];
  services: Service[];
  reviews: Review[];
  blogPosts: BlogPost[];
}

export default function AdminDashboard({
  bookings: dbBookings,
  services: dbServices,
  reviews: dbReviews,
  blogPosts: dbArticles,
}: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [bookingsFilter, setBookingsFilter] = useState<string>("all");
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const [, startTransition] = useTransition();

  // Unified State with consistent types
  const [bookings, setBookings] = useState<AdminBooking[]>(() => {
    if (dbBookings && dbBookings.length > 0) {
      return dbBookings.map((b, i) => {
        const mockMatch = initialBookings[i] || initialBookings[0];
        return {
          id: b.id,
          bookingCode: b.booking_code,
          customerName: b.name,
          customerPhone: b.phone,
          customerEmail: b.email,
          serviceName: b.service_name,
          area: b.address.split(",")[0] || "Trivandrum",
          status: b.status,
          paymentStatus: b.is_paid ? "Paid" : "Unpaid",
          amount: b.amount ?? null,
          createdAt: "18 May 2025",
          serviceDate: b.preferred_date || "19 May 2025",
          statusUpdatedAt: "18 May 2025",
          assignedTechnician: b.assigned_team || mockMatch.assignedTechnician,
          note: b.message || mockMatch.note,
          timeline: mockMatch.timeline,
        };
      });
    }
    return initialBookings;
  });

  const [services, setServices] = useState<AdminService[]>(() => {
    if (dbServices && dbServices.length > 0) {
      return dbServices.map((s, i) => {
        const mockMatch = initialServices[i] || initialServices[0];
        return {
          id: s.id,
          slug: s.slug,
          name: s.title,
          category: s.category === "pest_control" 
            ? "Pest control" 
            : s.category === "commercial" 
            ? "Commercial" 
            : s.category === "specialised" 
            ? "Specialised" 
            : "Cleaning",
          shortDesc: s.short_desc,
          duration: mockMatch.duration || "2–3 hours",
          bookingsCount: mockMatch.bookingsCount || 15,
          isFeatured: s.is_featured,
          isActive: true,
        };
      });
    }
    return initialServices;
  });

  const [reviews, setReviews] = useState<AdminReview[]>(() => {
    if (dbReviews && dbReviews.length > 0) {
      return dbReviews.map((r) => ({
        id: r.id,
        customerName: r.name,
        location: r.location.split(",")[0].trim() || "Kowdiar",
        rating: r.rating,
        serviceName: r.service_name || "General cleaning",
        comment: r.comment,
        status: r.approved ? "Approved" : "Pending",
        createdAt: "18 May 2025",
      }));
    }
    return initialReviews;
  });

  const [articles, setArticles] = useState<AdminArticle[]>(() => {
    if (dbArticles && dbArticles.length > 0) {
      return dbArticles.map((a) => ({
        id: a.id,
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        content: a.content,
        category: (a.category as AdminArticle["category"]) || "Home cleaning",
        author: a.author || "Plan C Crew",
        date: "18 May 2025",
        status: a.published ? "Published" : "Draft",
      }));
    }
    return initialArticles;
  });

  const [clientNotes, setClientNotes] = useState<AdminClientNote[]>(initialClientNotes);

  // Status Change with Optimistic UI & Undo Toast
  const handleStatusChange = (
    bookingId: string, 
    newStatus: BookingStatus, 
    prevStatus: BookingStatus
  ) => {
    // 1. Optimistic update
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );

    // 2. Server transition
    startTransition(async () => {
      await updateBookingAdminAction(bookingId, newStatus);
    });

    // 3. Toast with Undo
    setToast({
      id: `toast-${Date.now()}`,
      text: `Status updated to ${newStatus}`,
      onUndo: () => {
        setBookings((prev) =>
          prev.map((b) => (b.id === bookingId ? { ...b, status: prevStatus } : b))
        );
        startTransition(async () => {
          await updateBookingAdminAction(bookingId, prevStatus);
        });
      },
    });
  };

  const handlePaymentStatusChange = async (
    bookingId: string,
    paymentStatus: PaymentStatus
  ): Promise<boolean> => {
    const result = await updateBookingPaymentStatusAdminAction(bookingId, paymentStatus);
    if (!result.success) {
      setToast({
        id: `toast-${Date.now()}`,
        text: result.error || "Unable to update payment status.",
      });
      return false;
    }

    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, paymentStatus } : b))
    );
    setToast({ id: `toast-${Date.now()}`, text: `Payment marked as ${paymentStatus}.` });
    return true;
  };

  const handleBookingAmountChange = async (
    bookingId: string,
    amount: number | null
  ): Promise<boolean> => {
    const result = await updateBookingAmountAdminAction(bookingId, amount);
    if (!result.success) {
      setToast({
        id: `toast-${Date.now()}`,
        text: result.error || "Unable to save booking amount.",
      });
      return false;
    }

    setBookings((prev) =>
      prev.map((booking) =>
        booking.id === bookingId ? { ...booking, amount } : booking
      )
    );
    setToast({
      id: `toast-${Date.now()}`,
      text: amount === null ? "Booking amount cleared." : "Booking amount saved.",
    });
    return true;
  };

  // Service handlers
  const handleToggleFeatured = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isFeatured: !s.isFeatured } : s))
    );
  };

  const handleToggleActive = (id: string) => {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isActive: !s.isActive } : s))
    );
  };

  const handleDeleteService = (id: string) => {
    setServices((prev) => prev.filter((s) => s.id !== id));
    setToast({
      id: `toast-${Date.now()}`,
      text: "Service deleted successfully.",
    });
  };

  const handleAddService = (newSrv: Partial<AdminService>) => {
    const fullSrv: AdminService = {
      id: `srv-${Date.now()}`,
      slug: newSrv.slug || "new-service",
      name: newSrv.name || "Untitled service",
      category: newSrv.category || "Cleaning",
      shortDesc: newSrv.shortDesc || "",
      duration: newSrv.duration || "2 hours",
      bookingsCount: 0,
      isFeatured: false,
      isActive: true,
    };
    setServices((prev) => [fullSrv, ...prev]);
    setToast({
      id: `toast-${Date.now()}`,
      text: "New service created.",
    });
  };

  // Review handlers
  const handleApproveReview = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Approved" } : r))
    );
    startTransition(async () => {
      await toggleReviewApprovalAction(id, true);
    });
    setToast({
      id: `toast-${Date.now()}`,
      text: "Review approved.",
    });
  };

  const handleHideReview = (id: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "Hidden" } : r))
    );
    startTransition(async () => {
      await toggleReviewApprovalAction(id, false);
    });
    setToast({
      id: `toast-${Date.now()}`,
      text: "Review hidden.",
    });
  };

  const handleDeleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    startTransition(async () => {
      await deleteReviewAdminAction(id);
    });
    setToast({
      id: `toast-${Date.now()}`,
      text: "Review deleted.",
    });
  };

  const handleBulkReviewAction = (ids: string[], action: "approve" | "hide" | "delete") => {
    if (action === "delete") {
      setReviews((prev) => prev.filter((r) => !ids.includes(r.id)));
      ids.forEach((id) => {
        startTransition(async () => {
          await deleteReviewAdminAction(id);
        });
      });
      setToast({
        id: `toast-${Date.now()}`,
        text: `${ids.length} reviews deleted.`,
      });
    } else {
      const nextStatus = action === "approve" ? "Approved" : "Hidden";
      setReviews((prev) =>
        prev.map((r) => (ids.includes(r.id) ? { ...r, status: nextStatus } : r))
      );
      ids.forEach((id) => {
        startTransition(async () => {
          await toggleReviewApprovalAction(id, action === "approve");
        });
      });
      setToast({
        id: `toast-${Date.now()}`,
        text: `${ids.length} reviews updated.`,
      });
    }
  };

  // Article handlers
  const handleCreateArticle = (newArt: Partial<AdminArticle>) => {
    const fullArt: AdminArticle = {
      id: `art-${Date.now()}`,
      slug: newArt.slug || "new-article",
      title: newArt.title || "Untitled article",
      excerpt: newArt.excerpt || "",
      category: newArt.category || "Home cleaning",
      author: newArt.author || "Plan C Crew",
      date: "18 May 2025",
      status: (newArt.status as "Published" | "Draft") || "Published",
    };
    setArticles((prev) => [fullArt, ...prev]);
    startTransition(async () => {
      const fd = new FormData();
      fd.append("title", fullArt.title);
      fd.append("slug", fullArt.slug);
      fd.append("excerpt", fullArt.excerpt);
      fd.append("content", fullArt.excerpt);
      fd.append("category", fullArt.category);
      fd.append("author", fullArt.author);
      await createBlogPostAdminAction(fd);
    });
    setToast({
      id: `toast-${Date.now()}`,
      text: "Article published.",
    });
  };

  const handleDuplicateArticle = (id: string) => {
    const target = articles.find((a) => a.id === id);
    if (!target) return;
    const duplicated: AdminArticle = {
      ...target,
      id: `art-${Date.now()}`,
      title: `${target.title} (Copy)`,
      slug: `${target.slug}-copy`,
      status: "Draft",
    };
    setArticles((prev) => [duplicated, ...prev]);
    setToast({
      id: `toast-${Date.now()}`,
      text: "Article duplicated as draft.",
    });
  };

  const handleDeleteArticle = (id: string) => {
    setArticles((prev) => prev.filter((a) => a.id !== id));
    startTransition(async () => {
      await deleteBlogPostAdminAction(id);
    });
    setToast({
      id: `toast-${Date.now()}`,
      text: "Article deleted.",
    });
  };

  // Client Note handlers
  const handleToggleNoteHandled = (id: string) => {
    setClientNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, handled: !n.handled } : n))
    );
  };

  const handleOpenBookingFromNote = (bookingCode: string) => {
    setActiveTab("bookings");
    setBookingsFilter("all");
  };

  const handleLogout = async () => {
    await logoutAdminAction();
    window.location.reload();
  };

  const unhandledNotesCount = clientNotes.filter((n) => !n.handled).length;

  return (
    <>
      <AppShell
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          if (tab === "bookings") {
            setBookingsFilter("all");
          }
        }}
        onNavigateTab={(tab, filter) => {
          setActiveTab(tab);
          if (tab === "bookings") {
            setBookingsFilter(filter || "all");
          }
        }}
        counts={{
          bookings: bookings.length,
          services: services.length,
          reviews: reviews.length,
          blog: articles.length,
          unhandledNotes: unhandledNotesCount,
        }}
        pendingCount={bookings.filter((booking) => booking.status === "Pending").length}
        onLogout={handleLogout}
      >
        {activeTab === "overview" && (
          <OverviewView
            bookings={bookings}
            onNavigateToBookings={(filter) => {
              setActiveTab("bookings");
              if (filter) setBookingsFilter(filter);
            }}
          />
        )}

        {activeTab === "bookings" && (
          <BookingsView
            bookings={bookings}
            onStatusChange={handleStatusChange}
            onPaymentStatusChange={handlePaymentStatusChange}
            onAmountChange={handleBookingAmountChange}
            initialFilter={bookingsFilter}
          />
        )}

        {activeTab === "services" && (
          <ServicesView
            services={services}
            onToggleFeatured={handleToggleFeatured}
            onToggleActive={handleToggleActive}
            onDeleteService={handleDeleteService}
            onAddService={handleAddService}
          />
        )}

        {activeTab === "reviews" && (
          <ReviewsView
            reviews={reviews}
            onApprove={handleApproveReview}
            onHide={handleHideReview}
            onDeleteReview={handleDeleteReview}
            onBulkAction={handleBulkReviewAction}
          />
        )}

        {activeTab === "blog" && (
          <ArticlesView
            articles={articles}
            onCreateArticle={handleCreateArticle}
            onDuplicateArticle={handleDuplicateArticle}
            onDeleteArticle={handleDeleteArticle}
          />
        )}

        {activeTab === "messages" && (
          <ClientNotesView
            notes={clientNotes}
            onToggleHandled={handleToggleNoteHandled}
            onOpenBooking={handleOpenBookingFromNote}
          />
        )}
      </AppShell>

      {/* Global Toast with Undo support */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </>
  );
}
