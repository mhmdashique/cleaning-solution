"use client";

import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  MapPin,
  CalendarCheck,
  CreditCard,
  Plus,
  ChevronRight,
  Eye,
} from "lucide-react";
import { useOpsHub } from "@/context/OpsHubContext";

interface CustomerDetailViewProps {
  customerId: string;
  onBack: () => void;
  onViewBooking: (bookingId: string) => void;
  onNewBookingForCustomer: (customerId: string) => void;
}

export default function CustomerDetailView({
  customerId,
  onBack,
  onViewBooking,
  onNewBookingForCustomer,
}: CustomerDetailViewProps) {
  const { customers, bookings, services } = useOpsHub();

  const customer = customers.find((c) => c.id === customerId);
  const customerBookings = bookings.filter((b) => b.customerId === customerId);

  if (!customer) {
    return (
      <div className="bg-white border border-[#EEF0F6] rounded-[20px] p-8 text-center space-y-4 font-sans">
        <p className="text-[#6B7280]">Customer profile not found.</p>
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-[#5B5BF0] text-white text-[14px] font-semibold cursor-pointer"
        >
          Back to Customers
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200 font-sans">
      {/* Top Navigation Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-[#EEF0F6] text-[#0F1535] hover:bg-[#F6F7FD] text-[13.5px] font-bold shadow-xs transition-colors cursor-pointer w-fit"
        >
          <ArrowLeft className="w-4 h-4 text-[#5B5BF0]" />
          <span>Back to Customers</span>
        </button>

        <button
          type="button"
          onClick={() => onNewBookingForCustomer(customer.id)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#12B76A] hover:bg-[#0EA05C] text-white text-[13.5px] font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Booking for {customer.name.split(" ")[0]}</span>
        </button>
      </div>

      {/* Main Grid: Left Customer Card (5 cols) + Right Bookings History (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Customer Profile Card */}
        <div className="lg:col-span-5 bg-white border border-[#EEF0F6] rounded-[20px] p-6 sm:p-7 shadow-[0_4px_24px_rgba(91,91,240,0.06)] space-y-6">
          <div className="flex items-center gap-4 border-b border-[#EEF0F6] pb-5">
            <div className="w-16 h-16 rounded-2xl bg-[#EEF0FF] text-[#5B5BF0] font-black text-[24px] flex items-center justify-center shadow-xs">
              {customer.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[20px] font-bold text-[#0F1535]">{customer.name}</h2>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#E7F8F0] text-[#12B76A]">
                  {customer.status}
                </span>
              </div>
              <span className="font-mono text-[12px] text-[#6B7280]">
                Customer ID: {customer.id} · Registered {customer.createdAt}
              </span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="p-3.5 rounded-xl bg-[#F8F9FC] border border-[#EEF0F6] text-center">
            <span className="text-[12px] text-[#6B7280] font-semibold block">Total Bookings</span>
            <span className="text-[20px] font-extrabold text-[#5B5BF0]">{customerBookings.length}</span>
          </div>

          {/* Contact Details */}
          <div className="space-y-3.5 text-[14px]">
            <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#9CA3AF]">Contact Information</h4>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F8F9FC] border border-[#EEF0F6]">
              <Phone className="w-4 h-4 text-[#12B76A]" />
              <a href={`tel:${customer.phone}`} className="font-semibold text-[#0F1535] hover:text-[#12B76A]">
                {customer.phone}
              </a>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#F8F9FC] border border-[#EEF0F6]">
              <Mail className="w-4 h-4 text-[#5B5BF0]" />
              <span className="text-[#0F1535]">{customer.email}</span>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F8F9FC] border border-[#EEF0F6]">
              <MapPin className="w-4 h-4 text-[#F79009] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#0F1535] block">{customer.address}</span>
                <span className="text-[12px] text-[#6B7280]">{customer.district}</span>
              </div>
            </div>
          </div>

          {customer.notes && (
            <div className="p-3.5 rounded-xl bg-[#F6F7FD] border border-[#EEF0F6] text-[13px] text-[#6B7280]">
              <span className="font-bold text-[#0F1535] block mb-0.5">Customer Notes:</span>
              <p>{customer.notes}</p>
            </div>
          )}
        </div>

        {/* Right Column: Customer's Complete Bookings History */}
        <div className="lg:col-span-7 bg-white border border-[#EEF0F6] rounded-[20px] p-6 sm:p-7 shadow-[0_4px_24px_rgba(91,91,240,0.06)] space-y-4">
          <div className="flex items-center justify-between border-b border-[#EEF0F6] pb-3">
            <div>
              <h3 className="text-[17px] font-bold text-[#0F1535]">Bookings History</h3>
              <p className="text-[12.5px] text-[#6B7280]">All service dispatches and orders for this client</p>
            </div>
            <span className="text-[12px] font-bold px-2.5 py-1 rounded-full bg-[#EEF0FF] text-[#5B5BF0]">
              {customerBookings.length} bookings
            </span>
          </div>

          {customerBookings.length === 0 ? (
            <div className="py-12 text-center text-[#6B7280] text-[14px]">
              No bookings recorded for this customer yet.
            </div>
          ) : (
            <div className="space-y-3">
              {customerBookings.map((b) => {
                const svc = services.find((s) => s.id === b.serviceId);
                return (
                  <div
                    key={b.id}
                    onClick={() => onViewBooking(b.id)}
                    className="p-4 rounded-xl border border-[#EEF0F6] bg-[#F8F9FC]/70 hover:bg-[#F6F7FD] hover:border-[#5B5BF0]/30 transition-all flex items-center justify-between cursor-pointer group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[13px] font-bold text-[#5B5BF0]">
                          {b.id}
                        </span>
                        <span className="font-bold text-[14px] text-[#0F1535]">
                          {svc?.name || "Service"}
                        </span>
                      </div>
                      <div className="text-[12.5px] text-[#6B7280] font-mono">
                        {b.date} · {b.time} · {b.address}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-right">
                      <span className="inline-block text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#E7F8F0] text-[#12B76A]">
                        {b.status}
                      </span>
                      <ChevronRight className="w-5 h-5 text-[#9CA3AF] group-hover:text-[#5B5BF0] group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

