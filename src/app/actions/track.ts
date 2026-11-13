"use server";

import {
  getBookingByCodeAndPhone,
  saveBookingRescheduleRequest,
  updateBookingStatus,
} from "@/lib/data/store";
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
  reason: string,
  phone: string
) {
  try {
    const normalizedCode = bookingCode.trim();
    const normalizedReason = reason.trim();
    const parsedDate = new Date(`${newDate}T00:00:00.000Z`);
    if (
      !normalizedCode ||
      !phone.trim() ||
      !/^\d{4}-\d{2}-\d{2}$/.test(newDate) ||
      Number.isNaN(parsedDate.getTime()) ||
      parsedDate.toISOString().slice(0, 10) !== newDate ||
      normalizedReason.length > 500
    ) {
      return { success: false, error: "Please enter a valid date and a reason under 500 characters." };
    }

    const booking = await getBookingByCodeAndPhone(normalizedCode, phone);
    if (!booking) {
      return { success: false, error: "Booking not found. Please check your booking ID and phone number." };
    }
    if (booking.status === "Completed" || booking.status === "Cancelled") {
      return { success: false, error: "This booking can no longer be rescheduled." };
    }

    const saved = await saveBookingRescheduleRequest(
      normalizedCode,
      newDate,
      normalizedReason
    );
    if (!saved) {
      return { success: false, error: "Booking not found. Please check your booking ID and try again." };
    }

    revalidatePath("/track");
    revalidatePath("/admin");
    return {
      success: true,
      message: "Reschedule request received. Our coordinator will call you to confirm the new slot.",
    };
  } catch (error) {
    console.error("Unable to save customer reschedule request", error);
    return { success: false, error: "Unable to process reschedule request. Please try again later." };
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
