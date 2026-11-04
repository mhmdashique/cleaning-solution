"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { 
  updateBookingStatus, 
  updateReviewApproval, 
  deleteReview, 
  createBlogPost, 
  deleteBlogPost 
} from "@/lib/data/store";
import { BookingStatus } from "@/types";

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
