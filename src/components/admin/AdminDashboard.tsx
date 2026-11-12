"use client";

import { useMemo, useState } from "react";
import { Booking, Service, Review, BlogPost } from "@/types";
import {
  logoutAdminAction,
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
import Toast, { ToastMessage } from "./shared/Toast";
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
  const { bookings: opsBookings, services: opsServices } = useOpsHub();
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

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
      return dbArticles.map((a) => ({
        id: a.id,
        slug: a.slug,
        title: a.title,
        excerpt: a.excerpt,
        content: a.content,
        category: (a.category as AdminArticle["category"]) || "Home cleaning",
        author: a.author || "Plan C Crew",
        date: "18 May 2025",
        status: (a.published ? "Published" : "Draft") as "Published" | "Draft",
      }));
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
    await logoutAdminAction();
    window.location.reload();
  };

  const pendingCount = opsBookings.filter((b) => b.status === "Pending").length;
  const unhandledNotesCount = clientNotes.filter((n) => !n.handled).length;

  return (
    <>
      <AppShell
        activeTab={activeTab}
        onTabChange={(tab: string) => setActiveTab(tab)}
        onNavigateTab={(tab: string, recordId?: string) => {
          if (tab === "bookings" && recordId) {
            setSelectedBookingId(recordId);
            setActiveTab("booking-detail");
          } else if (tab === "customers" && recordId) {
            setSelectedCustomerId(recordId);
            setActiveTab("customer-detail");
          } else {
            setActiveTab(tab);
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
            onNavigateToBookings={() => setActiveTab("bookings")}
          />
        )}

        {activeTab === "bookings" && (
          <BookingsView
            onNewBookingClick={() => setActiveTab("add-booking")}
            onOpenBookingDetail={(id) => {
              setSelectedBookingId(id);
              setActiveTab("booking-detail");
            }}
          />
        )}

        {activeTab === "booking-detail" && selectedBookingId && (
          <BookingDetailView
            bookingId={selectedBookingId}
            onBack={() => setActiveTab("bookings")}
          />
        )}

        {activeTab === "add-booking" && (
          <AddBookingView
            onBack={() => setActiveTab("bookings")}
            onSuccess={() => {
              setToast({
                id: `toast-${Date.now()}`,
                text: "Booking created successfully and dispatched to staff!",
              });
              setActiveTab("bookings");
            }}
          />
        )}

        {activeTab === "customers" && (
          <CustomersView
            onOpenCustomerDetail={(id) => {
              setSelectedCustomerId(id);
              setActiveTab("customer-detail");
            }}
          />
        )}

        {activeTab === "customer-detail" && selectedCustomerId && (
          <CustomerDetailView
            customerId={selectedCustomerId}
            onBack={() => setActiveTab("customers")}
            onViewBooking={(bId) => {
              setSelectedBookingId(bId);
              setActiveTab("booking-detail");
            }}
            onNewBookingForCustomer={() => {
              setActiveTab("add-booking");
            }}
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
              setToast({ id: `toast-${Date.now()}`, text: "Review approved and published to website." });
              try {
                await toggleReviewApprovalAction(id, true);
              } catch (e) {
                console.error("Failed to approve review on server", e);
              }
            }}
            onHide={async (id) => {
              setReviews((prev) =>
                prev.map((r) => (r.id === id ? { ...r, status: "Hidden" } : r))
              );
              setToast({ id: `toast-${Date.now()}`, text: "Review hidden from website." });
              try {
                await toggleReviewApprovalAction(id, false);
              } catch (e) {
                console.error("Failed to hide review on server", e);
              }
            }}
            onDeleteReview={async (id) => {
              setReviews((prev) => prev.filter((r) => r.id !== id));
              setToast({ id: `toast-${Date.now()}`, text: "Review removed permanently." });
              try {
                await deleteReviewAdminAction(id);
              } catch (e) {
                console.error("Failed to delete review on server", e);
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
              setToast({
                id: `toast-${Date.now()}`,
                text: `${ids.length} reviews updated.`,
              });
              try {
                for (const rId of ids) {
                  if (action === "approve") await toggleReviewApprovalAction(rId, true);
                  else if (action === "hide") await toggleReviewApprovalAction(rId, false);
                  else if (action === "delete") await deleteReviewAdminAction(rId);
                }
              } catch (e) {
                console.error("Failed bulk action", e);
              }
            }}
          />
        )}

        {(activeTab === "blog" || activeTab === "articles") && (
          <ArticlesView
            articles={articles}
            onCreateArticle={async (newArt) => {
              const fullArt: AdminArticle = {
                id: `art-${Date.now()}`,
                slug: newArt.slug || "new-article",
                title: newArt.title || "Untitled article",
                excerpt: newArt.excerpt || "",
                category: newArt.category || "Home cleaning",
                author: newArt.author || "Plan C Crew",
                date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
                status: (newArt.status as "Published" | "Draft") || "Published",
              };
              setArticles((prev) => [fullArt, ...prev]);
              setToast({ id: `toast-${Date.now()}`, text: "Article created and saved." });
              try {
                await saveBlogPostAdminAction({
                  title: newArt.title || "Untitled article",
                  slug: newArt.slug || "",
                  excerpt: newArt.excerpt || "",
                  content: newArt.content || newArt.excerpt || "Content for this article.",
                  category: newArt.category || "Home cleaning",
                  author: newArt.author || "Plan C Crew",
                  status: (newArt.status as "Published" | "Draft") || "Published",
                });
              } catch (e) {
                console.error("Failed to create article on server", e);
              }
            }}
            onUpdateArticle={async (id, patch) => {
              setArticles((prev) =>
                prev.map((a) => (a.id === id ? { ...a, ...patch } : a))
              );
              setToast({ id: `toast-${Date.now()}`, text: "Article updated." });
              try {
                const target = articles.find((a) => a.id === id);
                if (target) {
                  await updateBlogPostAdminAction(id, {
                    title: patch.title ?? target.title,
                    slug: patch.slug ?? target.slug,
                    excerpt: patch.excerpt ?? target.excerpt,
                    content: patch.content ?? target.content ?? target.excerpt,
                    category: patch.category ?? target.category,
                    author: patch.author ?? target.author,
                    status: (patch.status ?? target.status) as "Published" | "Draft",
                  });
                }
              } catch (e) {
                console.error("Failed to update article on server", e);
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
              setToast({
                id: `toast-${Date.now()}`,
                text: "Article duplicated as draft.",
              });
              try {
                await duplicateBlogPostAdminAction(id);
              } catch (e) {
                console.error("Failed to duplicate article on server", e);
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
              setToast({ id: `toast-${Date.now()}`, text: `Article set to ${nextStatus}.` });
              try {
                await toggleBlogPostPublishedAdminAction(id, nextStatus === "Published");
              } catch (e) {
                console.error("Failed to toggle status on server", e);
              }
            }}
            onDeleteArticle={async (id) => {
              setArticles((prev) => prev.filter((a) => a.id !== id));
              setToast({ id: `toast-${Date.now()}`, text: "Article deleted." });
              try {
                await deleteBlogPostAdminAction(id);
              } catch (e) {
                console.error("Failed to delete article on server", e);
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
                await setClientNoteHandledAdminAction(bookingCode, nextHandled);
              } catch (e) {
                console.error("Failed to update client note status", e);
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
            }}
          />
        )}
      </AppShell>

      {/* Global Toast */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </>
  );
}
