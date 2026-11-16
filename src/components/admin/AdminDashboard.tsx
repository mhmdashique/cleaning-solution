"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Booking, Service, Review, BlogPost } from "@/types";
import {
  toggleReviewApprovalAction,
  deleteReviewAdminAction,
  saveBlogPostAdminAction,
  updateBlogPostAdminAction,
  deleteBlogPostAdminAction,
  duplicateBlogPostAdminAction,
  toggleBlogPostPublishedAdminAction,
  setClientNoteHandledAdminAction,
} from "@/app/actions/admin";
import { OpsHubProvider, useOpsHub } from "@/context/OpsHubContext";

import AppShell from "./shell/AppShell";
import OverviewView from "./views/OverviewView";
import BookingsView from "./views/BookingsView";
import BookingDetailView from "./views/BookingDetailView";
import CustomersView from "./views/CustomersView";
import CustomerDetailView from "./views/CustomerDetailView";
import ServicesView from "./views/ServicesView";
import PaymentsView from "./views/PaymentsView";
import ReportsView from "./views/ReportsView";
import SettingsView from "./views/SettingsView";
import NotificationsView from "./views/NotificationsView";
import AddBookingView from "./views/AddBookingView";
import ReviewsView from "./views/ReviewsView";
import ArticlesView from "./views/ArticlesView";
import ClientNotesView from "./views/ClientNotesView";

import {
  AdminBooking,
  AdminReview,
  AdminArticle,
  AdminClientNote,
} from "@/types/admin";

interface AdminDashboardProps {
  bookings: Booking[];
  services: Service[];
  reviews: Review[];
  blogPosts: BlogPost[];
  clientNoteStates?: Record<string, boolean>;
}

function toAdminArticle(post: BlogPost): AdminArticle {
  return {
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    content: post.content,
    category: post.category || "Home cleaning",
    author: post.author || "Plan C Crew",
    date: new Date(post.published_at).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    status: post.published ? "Published" : "Draft",
  };
}

export default function AdminDashboard(props: AdminDashboardProps) {
  return (
    <OpsHubProvider initialServices={props.services} initialBookings={props.bookings}>
      <AdminDashboardContent {...props} />
    </OpsHubProvider>
  );
}

function AdminDashboardContent({
  bookings: dbBookings,
  services: dbServices,
  reviews: dbReviews,
  blogPosts: dbArticles,
  clientNoteStates = {},
}: AdminDashboardProps) {
  const router = useRouter();
  const { bookings: opsBookings, services: opsServices, showToast } = useOpsHub();

  // Persist active tab + selected IDs across page reloads via sessionStorage
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("planc_admin_tab") || "overview";
    }
    return "overview";
  });
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("planc_admin_booking_id") || null;
    }
    return null;
  });
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("planc_admin_customer_id") || null;
    }
    return null;
  });
  // Keep sessionStorage in sync whenever tab/selection changes
  const handleTabChange = (tab: string) => {
    sessionStorage.setItem("planc_admin_tab", tab);
    // Clear sub-selections when navigating away
    if (tab !== "booking-detail") {
      sessionStorage.removeItem("planc_admin_booking_id");
      setSelectedBookingId(null);
    }
    if (tab !== "customer-detail") {
      sessionStorage.removeItem("planc_admin_customer_id");
      setSelectedCustomerId(null);
    }
    setActiveTab(tab);
    if (tab === "notifications") {
      router.refresh();
    }
  };

  const handleSelectBooking = (id: string) => {
    sessionStorage.setItem("planc_admin_booking_id", id);
    sessionStorage.setItem("planc_admin_tab", "booking-detail");
    setSelectedBookingId(id);
    setActiveTab("booking-detail");
  };

  const handleSelectCustomer = (id: string) => {
    sessionStorage.setItem("planc_admin_customer_id", id);
    sessionStorage.setItem("planc_admin_tab", "customer-detail");
    setSelectedCustomerId(id);
    setActiveTab("customer-detail");
  };

  const [reviews, setReviews] = useState<AdminReview[]>(() => {
    if (dbReviews && dbReviews.length > 0) {
      return dbReviews.map((r) => ({
        id: r.id,
        customerName: r.name,
        location: r.location.split(",")[0].trim() || "Kowdiar",
        rating: r.rating,
        serviceName: r.service_name || "General cleaning",
        comment: r.comment,
        status: (r.approved ? "Approved" : "Pending") as "Pending" | "Approved" | "Hidden",
        createdAt: "18 May 2025",
      }));
    }
    return [];
  });

  const [articles, setArticles] = useState<AdminArticle[]>(() => {
    if (dbArticles && dbArticles.length > 0) {
      return dbArticles.map(toAdminArticle);
    }
    return [];
  });

  const [clientNotes, setClientNotes] = useState<AdminClientNote[]>([]);

  const bookings: AdminBooking[] = useMemo(() => {
    return (dbBookings || []).map((b) => ({
      id: b.id,
      bookingCode: b.booking_code,
      customerName: b.name,
      customerPhone: b.phone,
      customerEmail: b.email,
      serviceName: b.service_name,
      area: b.address.split(",")[0] || "Trivandrum",
      status: b.status,
      paymentStatus: b.is_paid ? "Paid" : "Unpaid",
      amount: b.amount ? Number(b.amount) : 1200,
      createdAt: b.created_at ? new Date(b.created_at).toLocaleDateString("en-IN") : "Oct 28, 2025",
      serviceDate: b.preferred_date || "Oct 29, 2025",
      statusUpdatedAt: "Oct 28, 2025",
      assignedTechnician: b.assigned_team || "Riyas P",
      note: b.message || "",
      timeline: [],
    }));
  }, [dbBookings]);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/admin/logout", { method: "POST" });
      if (!response.ok) {
        throw new Error(`Logout failed with status ${response.status}.`);
      }

      sessionStorage.removeItem("planc_admin_tab");
      sessionStorage.removeItem("planc_admin_booking_id");
      sessionStorage.removeItem("planc_admin_customer_id");
      window.location.assign("/admin/login");
    } catch (error) {
      console.error("[admin-auth] Unable to sign out", error);
      showToast("Unable to sign out. Please try again.", "error");
    }
  };

  const pendingCount = opsBookings.filter((b) => b.status === "Pending").length;
  const unhandledNotesCount = clientNotes.filter((n) => !n.handled).length;

  return (
    <>
      <AppShell
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onNavigateTab={(tab: string, recordId?: string) => {
          if (tab === "bookings" && recordId) {
            handleSelectBooking(recordId);
          } else if (tab === "customers" && recordId) {
            handleSelectCustomer(recordId);
          } else {
            handleTabChange(tab);
          }
        }}
        counts={{
          bookings: opsBookings.length,
          services: opsServices.length,
          reviews: reviews.length,
          blog: articles.length,
          unhandledNotes: unhandledNotesCount,
        }}
        pendingCount={pendingCount}
        onLogout={handleLogout}
      >
        {activeTab === "overview" && (
          <OverviewView
            bookings={bookings}
            onNavigateToBookings={() => handleTabChange("bookings")}
            onOpenBookingDetail={(id) => handleSelectBooking(id)}
          />
        )}

        {activeTab === "bookings" && (
          <BookingsView
            onNewBookingClick={() => handleTabChange("add-booking")}
            onOpenBookingDetail={(id) => handleSelectBooking(id)}
          />
        )}

        {activeTab === "booking-detail" && selectedBookingId && (
          <BookingDetailView
            bookingId={selectedBookingId}
            onBack={() => handleTabChange("bookings")}
          />
        )}

        {activeTab === "add-booking" && (
          <AddBookingView
            onBack={() => handleTabChange("bookings")}
            onSuccess={() => {
              handleTabChange("bookings");
            }}
          />
        )}

        {activeTab === "customers" && (
          <CustomersView
            onOpenCustomerDetail={(id) => handleSelectCustomer(id)}
          />
        )}

        {activeTab === "customer-detail" && selectedCustomerId && (
          <CustomerDetailView
            customerId={selectedCustomerId}
            onBack={() => handleTabChange("customers")}
            onViewBooking={(bId) => handleSelectBooking(bId)}
            onNewBookingForCustomer={() => handleTabChange("add-booking")}
          />
        )}

        {activeTab === "services" && <ServicesView dbServices={dbServices} />}

        {activeTab === "payments" && <PaymentsView />}

        {activeTab === "reports" && <ReportsView />}

        {activeTab === "settings" && <SettingsView />}

        {activeTab === "notifications" && <NotificationsView />}

        {activeTab === "reviews" && (
          <ReviewsView
            reviews={reviews}
            onApprove={async (id) => {
              setReviews((prev) =>
                prev.map((r) => (r.id === id ? { ...r, status: "Approved" } : r))
              );
              try {
                const result = await toggleReviewApprovalAction(id, true);
                if (!result.success) {
                  showToast(result.error || "Could not approve the review.", "error");
                  return;
                }
                showToast("Review approved and published to website.");
              } catch (e) {
                console.error("Failed to approve review on server", e);
                showToast("Could not approve the review. Please try again.", "error");
              }
            }}
            onHide={async (id) => {
              setReviews((prev) =>
                prev.map((r) => (r.id === id ? { ...r, status: "Hidden" } : r))
              );
              try {
                const result = await toggleReviewApprovalAction(id, false);
                if (!result.success) {
                  showToast(result.error || "Could not hide the review.", "error");
                  return;
                }
                showToast("Review hidden from website.");
              } catch (e) {
                console.error("Failed to hide review on server", e);
                showToast("Could not hide the review. Please try again.", "error");
              }
            }}
            onDeleteReview={async (id) => {
              setReviews((prev) => prev.filter((r) => r.id !== id));
              try {
                const result = await deleteReviewAdminAction(id);
                if (!result.success) {
                  showToast(result.error || "Could not delete the review.", "error");
                  return;
                }
                showToast("Review removed permanently.");
              } catch (e) {
                console.error("Failed to delete review on server", e);
                showToast("Could not delete the review. Please try again.", "error");
              }
            }}
            onBulkAction={async (ids, action) => {
              setReviews((prev) =>
                prev.map((r) =>
                  ids.includes(r.id)
                    ? {
                        ...r,
                        status:
                          action === "approve"
                            ? "Approved"
                            : action === "hide"
                            ? "Hidden"
                            : r.status,
                      }
                    : r
                )
              );
              try {
                for (const rId of ids) {
                  let result: { success: boolean; error?: string };
                  if (action === "approve") result = await toggleReviewApprovalAction(rId, true);
                  else if (action === "hide") result = await toggleReviewApprovalAction(rId, false);
                  else result = await deleteReviewAdminAction(rId);
                  if (!result.success) {
                    showToast(result.error || "Some reviews could not be updated.", "error");
                    return;
                  }
                }
                showToast(`${ids.length} reviews updated.`);
              } catch (e) {
                console.error("Failed bulk action", e);
                showToast("Could not complete the review update. Please try again.", "error");
              }
            }}
          />
        )}

        {(activeTab === "blog" || activeTab === "articles") && (
          <ArticlesView
            articles={articles}
            onCreateArticle={async (newArt) => {
              try {
                const result = await saveBlogPostAdminAction({
                  title: newArt.title || "Untitled article",
                  slug: newArt.slug || "",
                  excerpt: newArt.excerpt || "",
                  content: newArt.content || newArt.excerpt || "Content for this article.",
                  category: newArt.category || "Home cleaning",
                  author: newArt.author || "Plan C Crew",
                  status: (newArt.status as "Published" | "Draft") || "Published",
                });
                if (!result.success) {
                  showToast(result.error || "Could not save the article.", "error");
                  return;
                }
                setArticles((prev) => [toAdminArticle(result.post), ...prev]);
                showToast("Article created and saved.");
              } catch (e) {
                console.error("Failed to create article on server", e);
                showToast("Could not save the article. Please try again.", "error");
              }
            }}
            onUpdateArticle={async (id, patch) => {
              setArticles((prev) =>
                prev.map((a) => (a.id === id ? { ...a, ...patch } : a))
              );
              try {
                const target = articles.find((a) => a.id === id);
                if (target) {
                  const result = await updateBlogPostAdminAction(id, {
                    title: patch.title ?? target.title,
                    slug: patch.slug ?? target.slug,
                    excerpt: patch.excerpt ?? target.excerpt,
                    content: patch.content ?? target.content ?? target.excerpt,
                    category: patch.category ?? target.category,
                    author: patch.author ?? target.author,
                    status: (patch.status ?? target.status) as "Published" | "Draft",
                  });
                  if (!result.success) {
                    showToast(result.error || "Could not update the article.", "error");
                    return;
                  }
                  showToast("Article updated.");
                }
              } catch (e) {
                console.error("Failed to update article on server", e);
                showToast("Could not update the article. Please try again.", "error");
              }
            }}
            onDuplicateArticle={async (id) => {
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
              try {
                const result = await duplicateBlogPostAdminAction(id);
                if (!result.success) {
                  showToast(result.error || "Could not duplicate the article.", "error");
                  return;
                }
                showToast("Article duplicated as draft.");
              } catch (e) {
                console.error("Failed to duplicate article on server", e);
                showToast("Could not duplicate the article. Please try again.", "error");
              }
            }}
            onToggleStatus={async (id) => {
              const target = articles.find((a) => a.id === id);
              const nextStatus = target?.status === "Published" ? "Draft" : "Published";
              setArticles((prev) =>
                prev.map((a) =>
                  a.id === id
                    ? {
                        ...a,
                        status: nextStatus,
                      }
                    : a
                )
              );
              try {
                const result = await toggleBlogPostPublishedAdminAction(id, nextStatus === "Published");
                if (!result.success) {
                  showToast(result.error || "Could not update article status.", "error");
                  return;
                }
                showToast(`Article set to ${nextStatus}.`);
              } catch (e) {
                console.error("Failed to toggle status on server", e);
                showToast("Could not update article status. Please try again.", "error");
              }
            }}
            onDeleteArticle={async (id) => {
              setArticles((prev) => prev.filter((a) => a.id !== id));
              try {
                const result = await deleteBlogPostAdminAction(id);
                if (!result.success) {
                  showToast(result.error || "Could not delete the article.", "error");
                  return;
                }
                showToast("Article deleted.");
              } catch (e) {
                console.error("Failed to delete article on server", e);
                showToast("Could not delete the article. Please try again.", "error");
              }
            }}
          />
        )}

        {(activeTab === "messages" || activeTab === "client-notes") && (
          <ClientNotesView
            notes={clientNotes}
            onToggleHandled={async (id) => {
              const target = clientNotes.find((n) => n.id === id);
              const nextHandled = target ? !target.handled : true;
              setClientNotes((prev) =>
                prev.map((n) => (n.id === id ? { ...n, handled: nextHandled } : n))
              );
              try {
                const bookingCode = target?.bookingCode || id;
                const result = await setClientNoteHandledAdminAction(bookingCode, nextHandled);
                if (!result.success) {
                  showToast(result.error || "Could not update the note.", "error");
                  return;
                }
                showToast(nextHandled ? "Client note marked as handled." : "Client note reopened.");
              } catch (e) {
                console.error("Failed to update client note status", e);
                showToast("Could not update client note. Please try again.", "error");
              }
            }}
            onOpenBooking={() => {
              setActiveTab("bookings");
            }}
            onAddNote={(newNote) => {
              setClientNotes((prev) => [
                { ...newNote, id: `note-${Date.now()}` },
                ...prev,
              ]);
              showToast("Client note added.");
            }}
          />
        )}
      </AppShell>

    </>
  );
}
