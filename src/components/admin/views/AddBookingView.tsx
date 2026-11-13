"use client";

import { useState } from "react";
import { ArrowLeft, Calendar, Clock, CheckCircle, ShieldCheck } from "lucide-react";
import { useOpsHub } from "@/context/OpsHubContext";

interface AddBookingViewProps {
  onBack?: () => void;
  onSuccess?: () => void;
}

export default function AddBookingView({ onBack, onSuccess }: AddBookingViewProps) {
  const { customers, services, team, addBooking, showToast } = useOpsHub();

  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || "");
  const [selectedServiceId, setSelectedServiceId] = useState(services[0]?.id || "");
  const [date, setDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 1);
    return today.toISOString().split("T")[0];
  });
  const [time, setTime] = useState("10:00 AM");
  const [selectedStaffId, setSelectedStaffId] = useState(team[0]?.id || "");
  const [address, setAddress] = useState(customers[0]?.address || "Trivandrum, Kerala");
  const [notes, setNotes] = useState("");

  const currentCustomer = customers.find((c) => c.id === selectedCustomerId) || customers[0];
  const currentService = services.find((s) => s.id === selectedServiceId) || services[0];
  const currentStaff = team.find((t) => t.id === selectedStaffId) || team[0];

  const handleCustomerChange = (customerId: string) => {
    setSelectedCustomerId(customerId);
    const found = customers.find((c) => c.id === customerId);
    if (found) {
      setAddress(found.address);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCustomerId || !selectedServiceId) {
      showToast("Choose a customer and service before creating the booking.", "warning");
      return;
    }

    addBooking({
      customerId: selectedCustomerId,
      serviceId: selectedServiceId,
      date,
      time,
      address: address || currentCustomer?.address || "Trivandrum, Kerala",
      assignedStaffId: selectedStaffId,
      notes: notes || undefined,
      amount: currentService?.price || 1200,
    });

    onSuccess?.();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header with Back button */}
      <div className="flex items-center gap-3">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            className="w-9 h-9 rounded-xl bg-white border border-[#EEF0F6] text-[#0F1535] hover:bg-[#F6F7FD] flex items-center justify-center transition-colors shadow-xs cursor-pointer"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <div>
          <h1 className="text-[26px] md:text-[28px] font-bold text-[#0F1535] tracking-tight">
            Add New Booking
          </h1>
          <p className="text-[13.5px] text-[#6B7280] mt-0.5">
            Schedule a new customer appointment and assign technicians
          </p>
        </div>
      </div>

      {/* Two Column Layout: Left Form + Right Booking Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Card Form (7 cols) */}
        <div className="lg:col-span-7 bg-white border border-[#EEF0F6] rounded-[20px] p-6 sm:p-7 shadow-[0_4px_24px_rgba(91,91,240,0.06)] space-y-5">
          <div className="border-b border-[#EEF0F6] pb-3">
            <h2 className="text-[17px] font-bold text-[#0F1535]">Appointment Details</h2>
            <p className="text-[13px] text-[#6B7280] mt-0.5">Fill in customer and scheduling specifications</p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Customer Select */}
            <div>
              <label className="block text-[13px] font-semibold text-[#0F1535] mb-1.5">Customer</label>
              <select
                value={selectedCustomerId}
                onChange={(e) => handleCustomerChange(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F6F7FD] border border-[#EEF0F6] text-[14px] text-[#0F1535] outline-none focus:border-[#5B5BF0] focus:bg-white focus:ring-2 focus:ring-[#5B5BF0]/10 transition-all cursor-pointer"
              >
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.phone}) - {c.district}
                  </option>
                ))}
              </select>
            </div>

            {/* Service Select */}
            <div>
              <label className="block text-[13px] font-semibold text-[#0F1535] mb-1.5">Service</label>
              <select
                value={selectedServiceId}
                onChange={(e) => setSelectedServiceId(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F6F7FD] border border-[#EEF0F6] text-[14px] text-[#0F1535] outline-none focus:border-[#5B5BF0] focus:bg-white focus:ring-2 focus:ring-[#5B5BF0]/10 transition-all cursor-pointer"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.category}) – ₹{s.price.toLocaleString("en-IN")} · {s.duration}
                  </option>
                ))}
              </select>
            </div>

            {/* Service Address */}
            <div>
              <label className="block text-[13px] font-semibold text-[#0F1535] mb-1.5">Service Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Full street address in Trivandrum"
                className="w-full px-4 py-2.5 rounded-xl bg-[#F6F7FD] border border-[#EEF0F6] text-[14px] text-[#0F1535] outline-none focus:border-[#5B5BF0] focus:bg-white focus:ring-2 focus:ring-[#5B5BF0]/10 transition-all"
                required
              />
            </div>

            {/* Date & Time (side by side) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#0F1535] mb-1.5">Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F6F7FD] border border-[#EEF0F6] text-[14px] text-[#0F1535] outline-none focus:border-[#5B5BF0] focus:bg-white focus:ring-2 focus:ring-[#5B5BF0]/10 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#0F1535] mb-1.5">Preferred Time</label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F6F7FD] border border-[#EEF0F6] text-[14px] text-[#0F1535] outline-none focus:border-[#5B5BF0] focus:bg-white focus:ring-2 focus:ring-[#5B5BF0]/10 transition-all cursor-pointer"
                >
                  <option value="08:00 AM">08:00 AM – Morning slot</option>
                  <option value="10:00 AM">10:00 AM – Morning slot</option>
                  <option value="12:00 PM">12:00 PM – Midday slot</option>
                  <option value="02:30 PM">02:30 PM – Afternoon slot</option>
                  <option value="04:30 PM">04:30 PM – Evening slot</option>
                </select>
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-[13px] font-semibold text-[#0F1535] mb-1.5">Special Instructions / Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Key pickup instructions, gate code, pet notices, or special chemical requests..."
                rows={2}
                className="w-full px-4 py-2.5 rounded-xl bg-[#F6F7FD] border border-[#EEF0F6] text-[14px] text-[#0F1535] outline-none focus:border-[#5B5BF0] focus:bg-white focus:ring-2 focus:ring-[#5B5BF0]/10 transition-all resize-none"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#12B76A] hover:bg-[#0EA05C] text-white text-[15px] font-bold shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                Confirm &amp; Create Booking
              </button>
            </div>
          </form>
        </div>

        {/* Right Card: Booking Summary (5 cols) */}
        <div className="lg:col-span-5 bg-white border border-[#EEF0F6] rounded-[20px] p-6 sm:p-7 shadow-[0_4px_24px_rgba(91,91,240,0.06)] space-y-5">
          <div className="border-b border-[#EEF0F6] pb-3">
            <h2 className="text-[17px] font-bold text-[#0F1535]">Booking Summary</h2>
            <p className="text-[13px] text-[#6B7280] mt-0.5">Live appointment preview &amp; billing</p>
          </div>

          <div className="space-y-3.5 text-[14px]">
            <div className="flex justify-between items-center py-2 border-b border-[#EEF0F6]">
              <span className="text-[#6B7280]">Customer</span>
              <span className="font-semibold text-[#0F1535]">{currentCustomer?.name || "Customer"}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[#EEF0F6]">
              <span className="text-[#6B7280]">Phone</span>
              <span className="font-semibold text-[#0F1535]">{currentCustomer?.phone || "+91 94471 23456"}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[#EEF0F6]">
              <span className="text-[#6B7280]">Service</span>
              <span className="font-semibold text-[#0F1535]">{currentService?.name || "Service"}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[#EEF0F6]">
              <span className="text-[#6B7280]">Duration</span>
              <span className="font-semibold text-[#0F1535]">{currentService?.duration || "2-3 hrs"}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-[#EEF0F6]">
              <span className="text-[#6B7280]">Schedule</span>
              <span className="font-semibold text-[#0F1535] font-mono">{date} · {time}</span>
            </div>
            <div className="flex justify-between items-center py-2.5 bg-[#F6F7FD] px-3.5 rounded-xl text-[#0F1535]">
              <span className="font-bold text-[15px]">Total Amount</span>
              <span className="font-extrabold text-[18px] text-[#12B76A]">
                ₹{(currentService?.price || 1200).toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#ECFDF3] border border-[#A6F4C5] flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#12B76A] shrink-0 mt-0.5" />
            <div className="text-[12.5px] text-[#027A48] leading-relaxed">
              <span className="font-bold">Automated Dispatch:</span> Creating this booking will instantly generate an invoice in Payments and notify the dispatch team.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
