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
  FAQ,
} from "@/types";
import {
  INITIAL_SERVICES,
  INITIAL_REVIEWS,
  INITIAL_BLOG_POSTS,
  INITIAL_BOOKINGS,
  INITIAL_SITE_SETTINGS,
  INITIAL_FAQS,
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
        faqs: FAQ[];
        site_settings: SiteSettings;
        client_notes: Record<string, boolean>;
      }
    | undefined;
}

if (!global.__planc_db) {
  global.__planc_db = {
    services: [...INITIAL_SERVICES],
    bookings: [...INITIAL_BOOKINGS],
    reviews: [...INITIAL_REVIEWS],
    blog_posts: [...INITIAL_BLOG_POSTS],
    faqs: [...INITIAL_FAQS],
    site_settings: { ...INITIAL_SITE_SETTINGS },
    client_notes: {},
  };
}

// Guard against hot-reload snapshots created before these fields existed.
if (!global.__planc_db.client_notes) {
  global.__planc_db.client_notes = {};
}

if (!global.__planc_db.faqs) {
  global.__planc_db.faqs = [...INITIAL_FAQS];
}

const memoryDb = global.__planc_db;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const DATA_FETCH_TIMEOUT_MS = 1800;

async function withTimeout<T>(promise: Promise<T>, fallback: T, ms = DATA_FETCH_TIMEOUT_MS): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  try {
    return await Promise.race([
      promise,
      new Promise<T>((resolve) => {
        timeoutId = setTimeout(() => resolve(fallback), ms);
      }),
    ]);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export function generateBookingCode(): string {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `PC-${year}-${randomNum}`;
}

// ---------------------------------------------------------------------------
// SERVICES
// ---------------------------------------------------------------------------
async function fetchServices(): Promise<Service[]> {
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

export async function getServices(): Promise<Service[]> {
  return withTimeout(fetchServices(), memoryDb.services);
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

export async function createService(
  payload: Partial<Service>
): Promise<Service> {
  const newService: Service = {
    id: payload.id || `srv-${Date.now()}`,
    slug: payload.slug || `service-${Date.now()}`,
    title: payload.title || "Untitled service",
    category: payload.category || "cleaning",
    short_desc: payload.short_desc || "",
    long_desc: payload.long_desc || payload.short_desc || "",
    image_url:
      payload.image_url ||
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
    icon: payload.icon || "Sparkles",
    duration: payload.duration || "2–3 hours",
    is_featured: payload.is_featured ?? false,
    is_active: payload.is_active ?? true,
    sort_order: payload.sort_order ?? memoryDb.services.length + 1,
    meta_title: payload.meta_title || payload.title,
    meta_description: payload.meta_description || payload.short_desc,
    created_at: new Date().toISOString(),
  };

  if (hasDb && db) {
    try {
      const { id: _ignoredId, created_at: _ignoredCreatedAt, ...insertPayload } =
        newService;
      const { data, error } = await db
        .from("services")
        .insert(insertPayload)
        .select()
        .single();
      if (!error && data) {
        memoryDb.services.unshift(data as Service);
        return data as Service;
      }
    } catch {
      // fallback to memory
    }
  }

  memoryDb.services.unshift(newService);
  return newService;
}

export async function updateService(
  id: string,
  payload: Partial<Service>
): Promise<boolean> {
  let persisted = false;

  if (hasDb && db) {
    try {
      const { error } = await db
        .from("services")
        .update(payload)
        .eq("id", id);
      if (!error) persisted = true;
    } catch {
      // fallback to memory
    }
  }

  const target = memoryDb.services.find(
    (service) => service.id === id || service.slug === id
  );
  if (target) {
    Object.assign(target, payload);
    return true;
  }

  return persisted;
}

export async function deleteService(id: string): Promise<boolean> {
  let persisted = false;

  if (hasDb && db) {
    try {
      const { error } = await db.from("services").delete().eq("id", id);
      if (!error) persisted = true;
    } catch {
      // fallback to memory
    }
  }

  const index = memoryDb.services.findIndex(
    (service) => service.id === id || service.slug === id
  );
  if (index !== -1) {
    memoryDb.services.splice(index, 1);
    return true;
  }

  return persisted;
}

export async function setServiceFeatured(
  id: string,
  isFeatured: boolean
): Promise<boolean> {
  return updateService(id, { is_featured: isFeatured });
}

export async function setServiceActive(
  id: string,
  isActive: boolean
): Promise<boolean> {
  return updateService(id, { is_active: isActive });
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

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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

      let query = db.from("bookings").update(updateData);
      if (UUID_REGEX.test(id)) {
        query = query.eq("id", id);
      } else {
        query = query.eq("booking_code", id);
      }

      const { error } = await query;
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

export async function saveBookingRescheduleRequest(
  bookingCode: string,
  requestedDate: string,
  reason: string
): Promise<boolean> {
  if (hasDb && db) {
    const { data, error } = await db
      .from("bookings")
      .update({
        reschedule_requested_date: requestedDate,
        reschedule_reason: reason || null,
        reschedule_requested_at: new Date().toISOString(),
      })
      .eq("booking_code", bookingCode)
      .select("id")
      .maybeSingle();

    if (error) {
      throw new Error(`Failed to save reschedule request: ${error.message}`);
    }

    return data !== null;
  }

  const booking = memoryDb.bookings.find(
    (item) => item.booking_code.toUpperCase() === bookingCode.toUpperCase()
  );
  if (!booking) return false;

  booking.reschedule_requested_date = requestedDate;
  booking.reschedule_reason = reason || null;
  booking.reschedule_requested_at = new Date().toISOString();
  return true;
}

export async function updateBookingAmount(
  id: string,
  amount: number | null
): Promise<boolean> {
  if (hasDb && db) {
    let query = db.from("bookings").update({ amount });
    if (UUID_REGEX.test(id)) {
      query = query.eq("id", id);
    } else {
      query = query.eq("booking_code", id);
    }

    const { data, error } = await query.select("id").maybeSingle();

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
    let query = db.from("bookings").update({ is_paid: isPaid });
    if (UUID_REGEX.test(id)) {
      query = query.eq("id", id);
    } else {
      query = query.eq("booking_code", id);
    }

    const { data, error } = await query.select("id").maybeSingle();

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

export async function deleteBooking(id: string): Promise<boolean> {
  if (hasDb && db) {
    try {
      let query = db.from("bookings").delete();
      if (UUID_REGEX.test(id)) {
        query = query.eq("id", id);
      } else {
        query = query.eq("booking_code", id);
      }

      const { error } = await query;
      if (!error) return true;
    } catch {
      // fallback
    }
  }

  const idx = memoryDb.bookings.findIndex(
    (b) => b.id === id || b.booking_code === id
  );
  if (idx !== -1) {
    memoryDb.bookings.splice(idx, 1);
    return true;
  }
  return false;
}

// ---------------------------------------------------------------------------
// REVIEWS
// ---------------------------------------------------------------------------
async function fetchApprovedReviews(): Promise<Review[]> {
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

export async function getApprovedReviews(): Promise<Review[]> {
  return withTimeout(fetchApprovedReviews(), memoryDb.reviews.filter((r) => r.approved));
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
async function fetchPublishedBlogPosts(): Promise<BlogPost[]> {
  if (hasDb && db) {
    try {
      const { data, error } = await db
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("published_at", { ascending: false });
      if (!error && data) return data as BlogPost[];
    } catch {
      // fallback
    }
  }
  return memoryDb.blog_posts.filter((b) => b.published);
}

export async function getPublishedBlogPosts(): Promise<BlogPost[]> {
  return withTimeout(fetchPublishedBlogPosts(), memoryDb.blog_posts.filter((b) => b.published));
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
  const postFields = {
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
    published_at: payload.published_at || new Date().toISOString(),
  };
  const newPost: BlogPost = {
    id: `blog-${Date.now()}`,
    ...postFields,
  };

  if (hasDb && db) {
    const { data, error } = await db
      .from("blog_posts")
      .insert(postFields)
      .select()
      .single();
    if (error) {
      throw new Error(`Failed to save blog post: ${error.message}`);
    }
    if (!data) throw new Error("The database did not return the saved blog post.");

    const savedPost = data as BlogPost;
    memoryDb.blog_posts.unshift(savedPost);
    return savedPost;
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

export async function updateBlogPost(
  id: string,
  payload: Partial<BlogPost>
): Promise<boolean> {
  let persisted = false;

  if (hasDb && db) {
    try {
      const { error } = await db
        .from("blog_posts")
        .update(payload)
        .eq("id", id);
      if (!error) persisted = true;
    } catch {
      // fallback
    }
  }

  const target = memoryDb.blog_posts.find(
    (post) => post.id === id || post.slug === id
  );
  if (target) {
    Object.assign(target, payload);
    return true;
  }

  return persisted;
}

export async function setBlogPostPublished(
  id: string,
  published: boolean
): Promise<boolean> {
  return updateBlogPost(id, { published });
}

export async function duplicateBlogPost(
  id: string
): Promise<BlogPost | null> {
  const source = memoryDb.blog_posts.find(
    (post) => post.id === id || post.slug === id
  );

  let original = source;
  if (!original && hasDb && db) {
    try {
      const { data, error } = await db
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .single();
      if (!error && data) original = data as BlogPost;
    } catch {
      // no source available
    }
  }

  if (!original) return null;

  const suffix = `copy-${Date.now().toString(36)}`;
  return createBlogPost({
    ...original,
    id: undefined,
    slug: `${original.slug}-${suffix}`,
    title: `${original.title} (Copy)`,
    published: false,
    published_at: new Date().toISOString(),
    meta_title: original.meta_title
      ? `${original.meta_title} (Copy)`
      : `${original.title} (Copy)`,
  });
}

// ---------------------------------------------------------------------------
// CLIENT NOTES (handled state keyed by booking code)
// ---------------------------------------------------------------------------
export async function getClientNoteStates(): Promise<Record<string, boolean>> {
  const states: Record<string, boolean> = { ...memoryDb.client_notes };

  if (hasDb && db) {
    try {
      const { data, error } = await db
        .from("client_notes")
        .select("booking_code, handled");
      if (!error && data) {
        for (const row of data as Array<{
          booking_code: string;
          handled: boolean;
        }>) {
          states[row.booking_code] = row.handled;
        }
      }
    } catch {
      // fallback to memory
    }
  }

  return states;
}

export async function setClientNoteHandled(
  bookingCode: string,
  handled: boolean
): Promise<boolean> {
  memoryDb.client_notes[bookingCode] = handled;

  if (hasDb && db) {
    try {
      const { error } = await db.from("client_notes").upsert(
        {
          booking_code: bookingCode,
          handled,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "booking_code" }
      );
      if (!error) return true;
    } catch {
      // fallback to memory
    }
  }

  return true;
}

// ---------------------------------------------------------------------------
// SITE SETTINGS
// ---------------------------------------------------------------------------
export async function getSiteSettings(): Promise<SiteSettings> {
  return memoryDb.site_settings;
}

export async function updateSiteSettings(
  patch: Partial<SiteSettings>
): Promise<SiteSettings> {
  memoryDb.site_settings = { ...memoryDb.site_settings, ...patch };
  return memoryDb.site_settings;
}

// ---------------------------------------------------------------------------
// FAQ
// ---------------------------------------------------------------------------

async function fetchFAQs(): Promise<FAQ[]> {
  if (hasDb && db) {
    try {
      const { data, error } = await db
        .from("faqs")
        .select("*");
      if (!error && data && data.length > 0) return data as FAQ[];
    } catch {
      // fallback to memory
    }
  }
  return memoryDb.faqs || [];
}

export async function getFAQs(): Promise<FAQ[]> {
  return withTimeout(fetchFAQs(), memoryDb.faqs || []);
}

export async function getFAQById(id: string): Promise<FAQ | null> {
  if (hasDb && db) {
    try {
      const { data, error } = await db
        .from("faqs")
        .select("*")
        .eq("id", id)
        .single();
      if (!error && data) return data as FAQ;
    } catch {
      // fallback to memory
    }
  }
  return memoryDb.faqs.find((faq) => faq.id === id) || null;
}
