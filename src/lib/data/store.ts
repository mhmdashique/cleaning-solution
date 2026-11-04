/**
 * Data store — server-only module.
 * Uses supabaseAdmin for all DB access (service-role key, never sent to browser).
 * Falls back to in-memory seed data when Supabase is not configured.
 */

import {
  Service,
  Booking,
  Review,
  BlogPost,
  SiteSettings,
  BookingStatus,
} from "@/types";
import {
  INITIAL_SERVICES,
  INITIAL_REVIEWS,
  INITIAL_BLOG_POSTS,
  INITIAL_BOOKINGS,
  INITIAL_SITE_SETTINGS,
} from "./initial-data";
import { supabaseAdmin, isSupabaseAdminConfigured } from "@/lib/supabase/admin";

// Convenience aliases used throughout this file
const db = supabaseAdmin;
const hasDb = isSupabaseAdminConfigured;

// ---------------------------------------------------------------------------
// Global in-memory cache (persists across hot-reloads in dev)
// ---------------------------------------------------------------------------
declare global {
  // eslint-disable-next-line no-var
  var __planc_db:
    | {
        services: Service[];
        bookings: Booking[];
        reviews: Review[];
        blog_posts: BlogPost[];
        site_settings: SiteSettings;
      }
    | undefined;
}

if (!global.__planc_db) {
  global.__planc_db = {
    services: [...INITIAL_SERVICES],
    bookings: [...INITIAL_BOOKINGS],
    reviews: [...INITIAL_REVIEWS],
    blog_posts: [...INITIAL_BLOG_POSTS],
    site_settings: { ...INITIAL_SITE_SETTINGS },
  };
}

const memoryDb = global.__planc_db;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
export function generateBookingCode(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `PC-${year}-${randomNum}`;
}

// ---------------------------------------------------------------------------
// SERVICES
// ---------------------------------------------------------------------------
export async function getServices(): Promise<Service[]> {
  if (hasDb && db) {
    try {
      const { data, error } = await db
        .from("services")
        .select("*")
        .order("sort_order", { ascending: true });
      if (!error && data && data.length > 0) return data as Service[];
    } catch {
      // fallback to memory
    }
  }
  return memoryDb.services;
}

export async function getFeaturedServices(): Promise<Service[]> {
  const all = await getServices();
  return all.filter((s) => s.is_featured).slice(0, 6);
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  if (hasDb && db) {
    try {
      const { data, error } = await db
        .from("services")
        .select("*")
        .eq("slug", slug)
        .single();
      if (!error && data) return data as Service;
    } catch {
      // fallback to memory
    }
  }
  return memoryDb.services.find((s) => s.slug === slug) || null;
}

// ---------------------------------------------------------------------------
// BOOKINGS
// ---------------------------------------------------------------------------
export async function createBooking(payload: {
  name: string;
  email?: string;
  phone: string;
  service_name: string;
  service_id?: string;
  address: string;
  preferred_date?: string;
  message?: string;
}): Promise<Booking> {
  const booking_code = generateBookingCode();
  const newBooking: Booking = {
    id: `book-${Date.now()}`,
    booking_code,
    name: payload.name,
    email: payload.email || "",
    phone: payload.phone,
    service_id: payload.service_id,
    service_name: payload.service_name,
    address: payload.address,
    preferred_date:
      payload.preferred_date || new Date().toISOString().split("T")[0],
    message: payload.message || "",
    status: "Pending",
    assigned_team: "PLAN C Quick Response Unit",
    created_at: new Date().toISOString(),
  };

  if (hasDb && db) {
    try {
      const { data, error } = await db
        .from("bookings")
        .insert({
          booking_code: newBooking.booking_code,
          name: newBooking.name,
          email: newBooking.email,
          phone: newBooking.phone,
          service_name: newBooking.service_name,
          service_id: newBooking.service_id,
          address: newBooking.address,
          preferred_date: newBooking.preferred_date,
          message: newBooking.message,
          status: newBooking.status,
          assigned_team: newBooking.assigned_team,
        })
        .select()
        .single();
      if (!error && data) {
        memoryDb.bookings.unshift(data as Booking);
        return data as Booking;
      }
    } catch {
      // fallback to memory
    }
  }

  memoryDb.bookings.unshift(newBooking);
  return newBooking;
}

export async function getBookingByCodeAndPhone(
  code: string,
  phone: string
): Promise<Booking | null> {
  const cleanCode = code.trim().toUpperCase();
  const cleanPhone = phone.trim().replace(/\D/g, "");

  if (hasDb && db) {
    try {
      const { data, error } = await db
        .from("bookings")
        .select("*")
        .ilike("booking_code", cleanCode)
        .single();
      if (!error && data) {
        const dbPhoneClean = (data.phone || "").replace(/\D/g, "");
        if (
          dbPhoneClean.includes(cleanPhone) ||
          cleanPhone.includes(dbPhoneClean)
        ) {
          return data as Booking;
        }
      }
    } catch {
      // fallback
    }
  }

  const found = memoryDb.bookings.find(
    (b) =>
      b.booking_code.toUpperCase() === cleanCode &&
      b.phone.replace(/\D/g, "").includes(cleanPhone.slice(-7))
  );

  return found || null;
}

export async function getAllBookings(): Promise<Booking[]> {
  if (hasDb && db) {
    try {
      const { data, error } = await db
        .from("bookings")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) return data as Booking[];
    } catch {
      // fallback
    }
  }
  return memoryDb.bookings;
}

export async function updateBookingStatus(
  id: string,
  status: BookingStatus,
  adminNotes?: string,
  assignedTeam?: string
): Promise<boolean> {
  if (hasDb && db) {
    try {
      const updateData: Record<string, unknown> = { status };
      if (adminNotes !== undefined) updateData.admin_notes = adminNotes;
      if (assignedTeam !== undefined) updateData.assigned_team = assignedTeam;

      const { error } = await db
        .from("bookings")
        .update(updateData)
        .eq("id", id);
      if (!error) return true;
    } catch {
      // fallback
    }
  }

  const target = memoryDb.bookings.find(
    (b) => b.id === id || b.booking_code === id
  );
  if (target) {
    target.status = status;
    if (adminNotes !== undefined) target.admin_notes = adminNotes;
    if (assignedTeam !== undefined) target.assigned_team = assignedTeam;
    return true;
  }
  return false;
}

export async function updateBookingAmount(
  id: string,
  amount: number | null
): Promise<boolean> {
  if (hasDb && db) {
    const { data, error } = await db
      .from("bookings")
      .update({ amount })
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data !== null;
  }

  const target = memoryDb.bookings.find(
    (booking) => booking.id === id || booking.booking_code === id
  );
  if (!target) return false;

  target.amount = amount;
  return true;
}

export async function updateBookingPaymentStatus(
  id: string,
  isPaid: boolean
): Promise<boolean> {
  if (hasDb && db) {
    const { data, error } = await db
      .from("bookings")
      .update({ is_paid: isPaid })
      .eq("id", id)
      .select("id")
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return data !== null;
  }

  const target = memoryDb.bookings.find(
    (booking) => booking.id === id || booking.booking_code === id
  );
  if (!target) return false;

  target.is_paid = isPaid;
  return true;
}

// ---------------------------------------------------------------------------
// REVIEWS
// ---------------------------------------------------------------------------
export async function getApprovedReviews(): Promise<Review[]> {
  if (hasDb && db) {
    try {
      const { data, error } = await db
        .from("reviews")
        .select("*")
        .eq("approved", true)
        .order("created_at", { ascending: false });
      if (!error && data && data.length > 0) return data as Review[];
    } catch {
      // fallback
    }
  }
  return memoryDb.reviews.filter((r) => r.approved);
}

export async function getAllReviews(): Promise<Review[]> {
  if (hasDb && db) {
    try {
      const { data, error } = await db
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error && data) return data as Review[];
    } catch {
      // fallback
    }
  }
  return memoryDb.reviews;
}

export async function createReview(payload: {
  name: string;
  location: string;
  rating: number;
  service_name?: string;
  comment: string;
}): Promise<Review> {
  const newReview: Review = {
    id: `rev-${Date.now()}`,
    name: payload.name,
    location: payload.location,
    rating: payload.rating,
    service_name: payload.service_name || "General Service",
    comment: payload.comment,
    approved: false, // Requires admin approval
    created_at: new Date().toISOString(),
  };

  if (hasDb && db) {
    try {
      const { data, error } = await db
        .from("reviews")
        .insert({
          name: newReview.name,
          location: newReview.location,
          rating: newReview.rating,
          service_name: newReview.service_name,
          comment: newReview.comment,
          approved: false,
        })
        .select()
        .single();
      if (!error && data) {
        memoryDb.reviews.unshift(data as Review);
        return data as Review;
      }
    } catch {
      // fallback
    }
  }

  memoryDb.reviews.unshift(newReview);
  return newReview;
}

export async function updateReviewApproval(
  id: string,
  approved: boolean
): Promise<boolean> {
  if (hasDb && db) {
    try {
      const { error } = await db
        .from("reviews")
        .update({ approved })
        .eq("id", id);
      if (!error) return true;
    } catch {
      // fallback
    }
  }

  const review = memoryDb.reviews.find((r) => r.id === id);
  if (review) {
    review.approved = approved;
    return true;
  }
  return false;
}

export async function deleteReview(id: string): Promise<boolean> {
  if (hasDb && db) {
    try {
      const { error } = await db.from("reviews").delete().eq("id", id);
      if (!error) return true;
    } catch {
      // fallback
    }
  }

  const index = memoryDb.reviews.findIndex((r) => r.id === id);
  if (index !== -1) {
    memoryDb.reviews.splice(index, 1);
    return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// BLOG POSTS
// ---------------------------------------------------------------------------
export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  if (hasDb && db) {
    try {
      const { data, error } = await db
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (!error && data && data.length > 0) return data as BlogPost[];
    } catch {
      // fallback
    }
  }
  return memoryDb.blog_posts.filter((b) => b.published);
}

export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  if (hasDb && db) {
    try {
      const { data, error } = await db
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .single();
      if (!error && data) return data as BlogPost;
    } catch {
      // fallback
    }
  }
  return memoryDb.blog_posts.find((b) => b.slug === slug) || null;
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  if (hasDb && db) {
    try {
      const { data, error } = await db
        .from("blog_posts")
        .select("*")
        .order("published_at", { ascending: false });
      if (!error && data) return data as BlogPost[];
    } catch {
      // fallback
    }
  }
  return memoryDb.blog_posts;
}

export async function createBlogPost(
  payload: Partial<BlogPost>
): Promise<BlogPost> {
  const newPost: BlogPost = {
    id: `blog-${Date.now()}`,
    slug: payload.slug || `post-${Date.now()}`,
    title: payload.title || "Untitled Article",
    excerpt: payload.excerpt || "",
    content: payload.content || "",
    cover_image:
      payload.cover_image ||
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
    category: payload.category || "Cleaning Tips",
    tags: payload.tags || ["Cleaning"],
    author: payload.author || "PLAN C Editorial Team",
    published: payload.published !== false,
    meta_title: payload.meta_title || payload.title,
    meta_description: payload.meta_description || payload.excerpt,
    published_at: new Date().toISOString(),
  };

  if (hasDb && db) {
    try {
      const { data, error } = await db
        .from("blog_posts")
        .insert(newPost)
        .select()
        .single();
      if (!error && data) {
        memoryDb.blog_posts.unshift(data as BlogPost);
        return data as BlogPost;
      }
    } catch {
      // fallback
    }
  }

  memoryDb.blog_posts.unshift(newPost);
  return newPost;
}

export async function deleteBlogPost(id: string): Promise<boolean> {
  if (hasDb && db) {
    try {
      const { error } = await db.from("blog_posts").delete().eq("id", id);
      if (!error) return true;
    } catch {
      // fallback
    }
  }

  const idx = memoryDb.blog_posts.findIndex((b) => b.id === id);
  if (idx !== -1) {
    memoryDb.blog_posts.splice(idx, 1);
    return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// SITE SETTINGS
// ---------------------------------------------------------------------------
export async function getSiteSettings(): Promise<SiteSettings> {
  return memoryDb.site_settings;
}
