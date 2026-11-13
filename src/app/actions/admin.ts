"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import {
  updateBookingStatus,
  updateBookingAmount,
  updateBookingPaymentStatus,
  deleteBooking,
  updateReviewApproval,
  deleteReview,
  createBlogPost,
  deleteBlogPost,
  createService,
  updateService,
  deleteService,
  setServiceFeatured,
  setServiceActive,
  updateBlogPost,
  setBlogPostPublished,
  duplicateBlogPost,
  setClientNoteHandled,
  updateSiteSettings,
} from "@/lib/data/store";
import { BlogPost, BookingStatus, Service, ServiceCategory, SiteSettings } from "@/types";
import type { AdminService } from "@/types/admin";

const ADMIN_COOKIE_NAME = "planc_admin_session";
const PASSCODE = process.env.ADMIN_PASSCODE;

export async function verifyPasscodeAction(passcode: string) {
  if (!PASSCODE) {
    return {
      success: false,
      error: "Admin access is not configured. Set ADMIN_PASSCODE to enable sign-in.",
    };
  }

  if (passcode.trim() === PASSCODE.trim()) {
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
      sameSite: "lax",
    });
    return { success: true };
  }
  return { success: false, error: "Incorrect admin passcode. Access denied." };
}

export async function logoutAdminAction() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  revalidatePath("/admin");
  return { success: true };
}

export async function checkAdminSession(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_COOKIE_NAME);
  return session?.value === "authenticated";
}

export async function updateBookingAdminAction(
  id: string,
  status: BookingStatus,
  notes?: string,
  team?: string
) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: "Unauthorized" };

  await updateBookingStatus(id, status, notes, team);
  revalidatePath("/admin");
  revalidatePath("/track");
  return { success: true };
}

export async function deleteBookingAdminAction(id: string) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: "Unauthorized" };

  await deleteBooking(id);
  revalidatePath("/admin");
  revalidatePath("/track");
  return { success: true };
}

export async function updateBookingAmountAdminAction(
  id: string,
  amount: number | null
) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: "Unauthorized" };

  if (
    amount !== null &&
    (!Number.isFinite(amount) ||
      amount < 0 ||
      amount > 9_999_999_999.99 ||
      Math.abs(amount * 100 - Math.round(amount * 100)) > 1e-8)
  ) {
    return { success: false, error: "Enter a valid non-negative amount." };
  }

  try {
    const updated = await updateBookingAmount(id, amount);
    if (!updated) {
      return { success: false, error: "Booking not found. The amount was not saved." };
    }
  } catch {
    return {
      success: false,
      error: "Unable to save the amount. Check that the booking amount database migration has been applied.",
    };
  }

  revalidatePath("/admin");
  revalidatePath("/track");
  return { success: true };
}

export async function updateBookingPaymentStatusAdminAction(
  id: string,
  paymentStatus: "Paid" | "Unpaid"
) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: "Unauthorized" };

  if (paymentStatus !== "Paid" && paymentStatus !== "Unpaid") {
    return { success: false, error: "Invalid payment status." };
  }

  try {
    const updated = await updateBookingPaymentStatus(id, paymentStatus === "Paid");
    if (!updated) {
      return { success: false, error: "Booking not found. Payment status was not updated." };
    }
  } catch {
    return {
      success: false,
      error: "Unable to update payment status. Check that the booking payment migration has been applied.",
    };
  }

  revalidatePath("/admin");
  return { success: true };
}

export async function toggleReviewApprovalAction(id: string, approved: boolean) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: "Unauthorized" };

  await updateReviewApproval(id, approved);
  revalidatePath("/admin");
  revalidatePath("/reviews");
  return { success: true };
}

export async function deleteReviewAdminAction(id: string) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: "Unauthorized" };

  await deleteReview(id);
  revalidatePath("/admin");
  revalidatePath("/reviews");
  return { success: true };
}

export async function createBlogPostAdminAction(formData: FormData) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: "Unauthorized" };

  const title = (formData.get("title") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim() || title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const excerpt = (formData.get("excerpt") as string)?.trim();
  const content = (formData.get("content") as string)?.trim();
  const category = (formData.get("category") as string)?.trim() || "Cleaning Tips";
  const cover_image = (formData.get("cover_image") as string)?.trim() || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80";
  const tags = (formData.get("tags") as string)?.split(",").map((t) => t.trim()).filter(Boolean) || [];

  if (!title || !content) {
    return { success: false, error: "Title and content are required." };
  }

  await createBlogPost({
    title,
    slug,
    excerpt,
    content,
    category,
    cover_image,
    tags,
    published: true,
  });

  revalidatePath("/admin");
  revalidatePath("/blog");
  return { success: true };
}

export async function deleteBlogPostAdminAction(id: string) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false, error: "Unauthorized" };

  await deleteBlogPost(id);
  revalidatePath("/admin");
  revalidatePath("/blog");
  return { success: true };
}

// ---------------------------------------------------------------------------
// SERVICES
// ---------------------------------------------------------------------------
export type ServiceAdminInput = {
  name: string;
  slug: string;
  category: AdminService["category"];
  shortDesc: string;
  duration: string;
  longDesc?: string;
  imageUrl?: string;
  isFeatured?: boolean;
  isActive?: boolean;
};

const CATEGORY_TO_DB: Record<AdminService["category"], ServiceCategory> = {
  Cleaning: "cleaning",
  "Pest control": "pest_control",
  Commercial: "commercial",
  Specialised: "specialised",
};

function toServiceRecord(input: Partial<ServiceAdminInput>): Partial<Service> {
  const record: Partial<Service> = {};
  if (input.name !== undefined) record.title = input.name;
  if (input.slug !== undefined) record.slug = input.slug;
  if (input.category !== undefined) {
    record.category = CATEGORY_TO_DB[input.category] || "cleaning";
  }
  if (input.shortDesc !== undefined) record.short_desc = input.shortDesc;
  if (input.longDesc !== undefined) record.long_desc = input.longDesc;
  if (input.duration !== undefined) record.duration = input.duration;
  if (input.imageUrl !== undefined) record.image_url = input.imageUrl;
  if (input.isFeatured !== undefined) record.is_featured = input.isFeatured;
  if (input.isActive !== undefined) record.is_active = input.isActive;
  return record;
}

function revalidateServicePaths() {
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/services", "layout");
}

export async function createServiceAdminAction(input: ServiceAdminInput) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false as const, error: "Unauthorized" };

  if (!input.name.trim()) {
    return { success: false as const, error: "Service name is required." };
  }

  const slug =
    input.slug.trim() ||
    input.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  const service = await createService({
    ...toServiceRecord({ ...input, slug }),
    title: input.name.trim(),
    slug,
    short_desc: input.shortDesc.trim(),
    long_desc: input.longDesc?.trim() || input.shortDesc.trim(),
    is_featured: input.isFeatured ?? false,
    is_active: input.isActive ?? true,
  });

  revalidateServicePaths();
  return { success: true as const, service };
}

export async function updateServiceAdminAction(
  id: string,
  input: Partial<ServiceAdminInput>
) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false as const, error: "Unauthorized" };

  if (input.name !== undefined && !input.name.trim()) {
    return { success: false as const, error: "Service name cannot be empty." };
  }

  const record = toServiceRecord(input);
  if (input.name !== undefined) record.title = input.name.trim();
  if (input.slug !== undefined) {
    record.slug = input.slug.trim() || record.slug;
  }
  if (input.shortDesc !== undefined) {
    record.short_desc = input.shortDesc.trim();
  }
  if (input.longDesc !== undefined) {
    record.long_desc = input.longDesc.trim();
  }

  try {
    const updated = await updateService(id, record);
    if (!updated) {
      return {
        success: false as const,
        error: "Service not found. Nothing was saved.",
      };
    }
  } catch {
    return {
      success: false as const,
      error: "Unable to save the service. Please try again.",
    };
  }

  revalidateServicePaths();
  return { success: true as const };
}

export async function deleteServiceAdminAction(id: string) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false as const, error: "Unauthorized" };

  try {
    const deleted = await deleteService(id);
    if (!deleted) {
      return { success: false as const, error: "Service not found." };
    }
  } catch {
    return {
      success: false as const,
      error: "Unable to delete the service. Please try again.",
    };
  }

  revalidateServicePaths();
  return { success: true as const };
}

export async function toggleServiceFeaturedAdminAction(
  id: string,
  isFeatured: boolean
) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false as const, error: "Unauthorized" };

  const updated = await setServiceFeatured(id, isFeatured);
  if (!updated) {
    return { success: false as const, error: "Service not found." };
  }

  revalidateServicePaths();
  return { success: true as const };
}

export async function toggleServiceActiveAdminAction(
  id: string,
  isActive: boolean
) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false as const, error: "Unauthorized" };

  const updated = await setServiceActive(id, isActive);
  if (!updated) {
    return { success: false as const, error: "Service not found." };
  }

  revalidateServicePaths();
  return { success: true as const };
}

// ---------------------------------------------------------------------------
// ARTICLES / BLOG
// ---------------------------------------------------------------------------
export type BlogAdminInput = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  status: "Published" | "Draft";
  coverImage?: string;
  tags?: string[];
};

function revalidateBlogPaths() {
  revalidatePath("/admin");
  revalidatePath("/");
  revalidatePath("/blog", "layout");
}

function makeSlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function saveBlogPostAdminAction(input: BlogAdminInput) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false as const, error: "Unauthorized" };

  if (!input.title.trim() || !input.content.trim()) {
    return {
      success: false as const,
      error: "Title and article content are required.",
    };
  }

  const slug = input.slug.trim() || makeSlug(input.title);
  const post = await createBlogPost({
    title: input.title.trim(),
    slug,
    excerpt: input.excerpt.trim(),
    content: input.content.trim(),
    category: input.category,
    author: input.author.trim() || "PLAN C Editorial Team",
    cover_image: input.coverImage?.trim(),
    tags: input.tags?.length ? input.tags : ["Cleaning"],
    published: input.status === "Published",
    meta_title: input.title.trim(),
    meta_description: input.excerpt.trim(),
    published_at: new Date().toISOString(),
  });

  revalidateBlogPaths();
  return { success: true as const, post };
}

export async function updateBlogPostAdminAction(
  id: string,
  input: BlogAdminInput
) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false as const, error: "Unauthorized" };

  if (!input.title.trim() || !input.content.trim()) {
    return {
      success: false as const,
      error: "Title and article content are required.",
    };
  }

  const record: Partial<BlogPost> = {
    title: input.title.trim(),
    slug: input.slug.trim() || makeSlug(input.title),
    excerpt: input.excerpt.trim(),
    content: input.content.trim(),
    category: input.category,
    author: input.author.trim() || "PLAN C Editorial Team",
    published: input.status === "Published",
    meta_title: input.title.trim(),
    meta_description: input.excerpt.trim(),
  };
  if (input.coverImage !== undefined) {
    record.cover_image = input.coverImage.trim();
  }
  if (input.tags) record.tags = input.tags;

  try {
    const updated = await updateBlogPost(id, record);
    if (!updated) {
      return {
        success: false as const,
        error: "Article not found. Nothing was saved.",
      };
    }
  } catch {
    return {
      success: false as const,
      error: "Unable to save the article. Please try again.",
    };
  }

  revalidateBlogPaths();
  return { success: true as const };
}

export async function duplicateBlogPostAdminAction(id: string) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false as const, error: "Unauthorized" };

  const post = await duplicateBlogPost(id);
  if (!post) {
    return { success: false as const, error: "Article not found." };
  }

  revalidateBlogPaths();
  return { success: true as const, post };
}

export async function toggleBlogPostPublishedAdminAction(
  id: string,
  published: boolean
) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false as const, error: "Unauthorized" };

  const updated = await setBlogPostPublished(id, published);
  if (!updated) {
    return { success: false as const, error: "Article not found." };
  }

  revalidateBlogPaths();
  return { success: true as const };
}

// ---------------------------------------------------------------------------
// CLIENT NOTES
// ---------------------------------------------------------------------------
export async function setClientNoteHandledAdminAction(
  bookingCode: string,
  handled: boolean
) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false as const, error: "Unauthorized" };

  await setClientNoteHandled(bookingCode, handled);
  revalidatePath("/admin");
  return { success: true as const };
}

// ---------------------------------------------------------------------------
// SITE SETTINGS
// ---------------------------------------------------------------------------
export async function updateSiteSettingsAdminAction(patch: Partial<SiteSettings>) {
  const isAdmin = await checkAdminSession();
  if (!isAdmin) return { success: false as const, error: "Unauthorized" };

  await updateSiteSettings(patch);
  revalidatePath("/", "layout");
  return { success: true as const };
}
