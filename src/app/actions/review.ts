"use server";

import { createReview } from "@/lib/data/store";
import { revalidatePath } from "next/cache";

export async function submitReviewAction(formData: FormData) {
  try {
    const name = (formData.get("name") as string)?.trim();
    const location = (formData.get("location") as string)?.trim();
    const rating = parseInt(formData.get("rating") as string, 10) || 5;
    const service_name = (formData.get("service_name") as string)?.trim() || "General Service";
    const comment = (formData.get("comment") as string)?.trim();

    if (!name || !location || !comment) {
      return { success: false, error: "Please fill in all required fields." };
    }

    if (rating < 1 || rating > 5) {
      return { success: false, error: "Invalid rating value." };
    }

    await createReview({
      name,
      location,
      rating,
      service_name,
      comment,
    });

    revalidatePath("/reviews");
    revalidatePath("/admin");
    revalidatePath("/");

    return { 
      success: true, 
      message: "Thank you for your review! It has been submitted and will appear on the site once approved by our team." 
    };
  } catch (error) {
    return { 
      success: false, 
      error: "An unexpected error occurred while submitting your review. Please try again or contact us directly." 
    };
  }
}

