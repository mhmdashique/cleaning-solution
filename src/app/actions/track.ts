"use server";

import { getBookingByCodeAndPhone, updateBookingStatus } from "@/lib/data/store";
import { BookingStatus } from "@/types";
import { revalidatePath } from "next/cache";

export async function trackBookingAction(code: string, phone: string) {
  try {
    if (!code || !phone) {
      return { success: false, error: "Please provide both Booking ID and Phone number." };
    }

    const booking = await getBookingByCodeAndPhone(code, phone);
    if (!booking) {
      return {
        success: false,
        error: "No booking found matching this ID and phone number. Please check and try again.",
      };
    }

    return { success: true, booking };
  } catch (error) {
    return {
      success: false,
      error: "An error occurred while tracking your booking. Please try again.",
    };
  }
}

export async function requestRescheduleAction(
  bookingCode: string,
  newDate: string,
  reason: string
) {
  try {
    // In our system, note the reschedule request in admin notes or status
    await updateBookingStatus(
      bookingCode,
      "Pending" as BookingStatus,
      `Reschedule requested to ${newDate}. Note: ${reason}`
    );
    revalidatePath("/track");
    revalidatePath("/admin");
    return {
      success: true,
      message: "Reschedule request received. Our coordinator will call you to confirm the new slot.",
    };
  } catch {
    return { success: false, error: "Unable to process reschedule request." };
  }
}

export async function cancelBookingAction(bookingCode: string, reason: string) {
  try {
    await updateBookingStatus(
      bookingCode,
      "Cancelled" as BookingStatus,
      `Customer cancelled: ${reason}`
    );
    revalidatePath("/track");
    revalidatePath("/admin");
    return {
      success: true,
      message: "Your booking cancellation request has been processed.",
    };
  } catch {
    return { success: false, error: "Unable to cancel booking." };
  }
}

