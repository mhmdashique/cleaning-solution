"use server";

import { z } from "zod";
import { createBooking } from "@/lib/data/store";
import { revalidatePath } from "next/cache";

const bookingSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters long"),
  phone: z.string().min(10, "Please provide a valid 10-digit mobile number"),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  service_name: z.string().min(1, "Please choose a service"),
  preferred_date: z.string().optional(),
  address: z.string().min(5, "Please provide your street address / location in Kerala"),
  message: z.string().optional(),
  honeypot: z.string().max(0, "Bot detected"), // anti-spam honeypot
});

export async function submitBookingAction(formData: FormData) {
  try {
    const rawData = {
      name: formData.get("name") as string,
      phone: formData.get("phone") as string,
      email: formData.get("email") as string,
      service_name: formData.get("service_name") as string,
      preferred_date: formData.get("preferred_date") as string,
      address: formData.get("address") as string,
      message: formData.get("message") as string,
      honeypot: formData.get("hp_field") as string || "",
    };

    const parsed = bookingSchema.safeParse(rawData);
    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || "Validation failed";
      return { success: false, error: errorMsg };
    }

    const booking = await createBooking({
      name: parsed.data.name.trim(),
      phone: parsed.data.phone.trim(),
      email: parsed.data.email?.trim(),
      service_name: parsed.data.service_name.trim(),
      preferred_date: parsed.data.preferred_date || undefined,
      address: parsed.data.address.trim(),
      message: parsed.data.message?.trim(),
    });

    revalidatePath("/track");
    revalidatePath("/admin/bookings");

    return {
      success: true,
      booking_code: booking.booking_code,
      message: `Booking created successfully! Your Booking ID is ${booking.booking_code}. You can use this code and your phone number to track status at any time.`,
    };
  } catch (error) {
    return {
      success: false,
      error: "Unable to process booking at this moment. Please call our direct helpline at 7994342372.",
    };
  }
}

