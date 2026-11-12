"use client";

import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  Printer,
  FileText,
  Plus,
  Trash2,
  DollarSign,
  Receipt,
  X,
  ShieldCheck,
  Edit2,
  CreditCard,
} from "lucide-react";
import { useOpsHub } from "@/context/OpsHubContext";
import { BookingStatusType, ExtraCharge } from "@/types/opsHub";

interface BookingDetailViewProps {
  bookingId: string;
  onBack: () => void;
}

export default function BookingDetailView({ bookingId, onBack }: BookingDetailViewProps) {
  const {
    bookings,
    customers,
    services,
    team,
    updateBookingStatus,
    updateBookingPricing,
  } = useOpsHub();

  const booking = bookings.find((b) => b.id === bookingId);
  const customer = booking ? customers.find((c) => c.id === booking.customerId) : null;
  const service = booking ? services.find((s) => s.id === booking.serviceId) : null;
  const staff = booking ? team.find((t) => t.id === booking.assignedStaffId) : null;

  // Pricing & invoice editing state
  const [isEditingBasePrice, setIsEditingBasePrice] = useState(false);
  const [basePriceInput, setBasePriceInput] = useState(booking?.amount ? String(booking.amount) : "0");
  const [showAddAdvanceModal, setShowAddAdvanceModal] = useState(false);
  const [advanceInput, setAdvanceInput] = useState(booking?.advancePaid ? String(booking.advancePaid) : "");
  const [showAddExtraModal, setShowAddExtraModal] = useState(false);
  const [extraTitle, setExtraTitle] = useState("");
  const [extraAmount, setExtraAmount] = useState("");
  const [showInvoicePreview, setShowInvoicePreview] = useState(false);

  if (!booking) {
    return (
      <div className="bg-white border border-[#EEF0F6] rounded-[20px] p-8 text-center space-y-4 font-sans">
        <p className="text-[#6B7280]">Booking not found or has been removed.</p>
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl bg-[#5B5BF0] text-white text-[14px] font-semibold cursor-pointer"
        >
          Back to Bookings
        </button>
      </div>
    );
  }

  // Financial calculations
  const basePrice = Number(booking.amount) || 0;
  const advancePaid = Number(booking.advancePaid) || 0;
  const extraCharges: ExtraCharge[] = booking.extraCharges || [];
  const extrasTotal = extraCharges.reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
  const totalOrderValue = basePrice + extrasTotal;
  const balanceDue = Math.max(0, totalOrderValue - advancePaid);
  const isPaidInFull = totalOrderValue > 0 && balanceDue === 0;

  const handleSaveBasePrice = () => {
    const parsed = Math.max(0, Number(basePriceInput) || 0);
    updateBookingPricing(booking.id, { amount: parsed });
    setIsEditingBasePrice(false);
  };

  const handleSaveAdvance = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = Math.max(0, Number(advanceInput) || 0);
    updateBookingPricing(booking.id, { advancePaid: parsed });
    setShowAddAdvanceModal(false);
  };

  const handleAddExtra = (e: React.FormEvent) => {
    e.preventDefault();
    if (!extraTitle.trim() || !extraAmount) return;
    const newExtra: ExtraCharge = {
      id: `ext-${Date.now()}`,
      title: extraTitle.trim(),
      amount: Math.max(0, Number(extraAmount) || 0),
    };
    const updated = [...extraCharges, newExtra];
    updateBookingPricing(booking.id, { extraCharges: updated });
    setExtraTitle("");
    setExtraAmount("");
    setShowAddExtraModal(false);
  };

  const handleRemoveExtra = (extraId: string) => {
    const updated = extraCharges.filter((item) => item.id !== extraId);
    updateBookingPricing(booking.id, { extraCharges: updated });
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  // 1-Page Printable Invoice Component
  const PrintableInvoiceContent = () => (
    <div
      id="printable-invoice"
      className="p-8 bg-white text-[#0F1535] space-y-5 font-sans max-w-2xl mx-auto border border-[#E5E7EB] rounded-2xl shadow-xs print:border-none print:shadow-none print:p-0 print:space-y-4 print:max-w-full"
      style={{ breakInside: "avoid", pageBreakInside: "avoid" }}
    >
      {/* Invoice Header */}
      <div className="flex justify-between items-start border-b border-[#E5E7EB] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-[#12B76A] text-white flex items-center justify-center font-black text-sm">
              C
            </span>
            <h2 className="text-[20px] font-extrabold tracking-tight text-[#0F1535]">
              PLAN C CLEANING SOLUTIONS
            </h2>
          </div>
          <p className="text-[11.5px] text-[#6B7280] mt-1 leading-relaxed">
            Thrikannapuram, Thiruvananthapuram, Kerala 695032<br />
            Phone: +91 79943 42372 · Email: contact@plancsolutions.in
          </p>
        </div>
        <div className="text-right">
          <span className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wider block">
            TAX INVOICE
          </span>
          <span className="text-[17px] font-black font-mono text-[#5B5BF0] block">
            INV-{booking.id}
          </span>
          <span className="text-[12px] text-[#4B5563] block mt-0.5">
            Date: {booking.date}
          </span>
          <span
            className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
              balanceDue === 0
                ? "bg-[#E7F8F0] text-[#12B76A]"
                : "bg-[#FFF4E5] text-[#F79009]"
            }`}
          >
            {balanceDue === 0 ? "PAID IN FULL" : "BALANCE DUE"}
          </span>
        </div>
      </div>

      {/* Bill To & Job Details */}
      <div className="grid grid-cols-2 gap-4 text-[12.5px] border-b border-[#E5E7EB] pb-4">
        <div>
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#9CA3AF] block mb-1">
            BILLED TO
          </span>
          <div className="font-bold text-[14px] text-[#0F1535]">{customer?.name || booking.customerName || "Customer"}</div>
          <div className="text-[#4B5563] font-mono text-[12px] mt-0.5">{customer?.phone || booking.customerPhone}</div>
          <div className="text-[#6B7280] text-[12px] mt-0.5 line-clamp-2">
            {booking.address || customer?.address || "Thiruvananthapuram, Kerala"}
          </div>
        </div>
        <div>
          <span className="text-[10.5px] font-bold uppercase tracking-wider text-[#9CA3AF] block mb-1">
            SERVICE SPECIFICATIONS
          </span>
          <div className="text-[#0F1535]">
            Service: <span className="font-bold">{service?.name || booking.serviceName || "Cleaning Service"}</span>
          </div>
          <div className="text-[#4B5563] mt-0.5">
            Scheduled: <span className="font-semibold">{booking.date} at {booking.time}</span>
          </div>
        </div>
      </div>

      {/* Line Items Table */}
      <table className="w-full text-left text-[12.5px]">
        <thead>
          <tr className="border-b border-[#E5E7EB] text-[#6B7280] text-[11.5px] uppercase font-semibold">
            <th className="py-2">Item & Description</th>
            <th className="py-2 text-center">Duration</th>
            <th className="py-2 text-right">Amount (₹)</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F3F4F6]">
          <tr>
            <td className="py-2.5 font-semibold text-[#0F1535]">
              {service?.name || booking.serviceName || "Cleaning Service Package"}
            </td>
            <td className="py-2.5 text-center text-[#6B7280]">
              {service?.duration || "2–3 hours"}
            </td>
            <td className="py-2.5 text-right font-bold text-[#0F1535]">
              ₹{basePrice.toLocaleString("en-IN")}
            </td>
          </tr>
          {extraCharges.map((ext) => (
            <tr key={ext.id}>
              <td className="py-2 text-[#4B5563]">
                + {ext.title} (Additional Work)
              </td>
              <td className="py-2 text-center text-[#9CA3AF]">—</td>
              <td className="py-2 text-right font-semibold text-[#0F1535]">
                ₹{ext.amount.toLocaleString("en-IN")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Invoice Totals */}
      <div className="pt-3 border-t border-[#E5E7EB] space-y-1.5 text-[12.5px]">
        <div className="flex justify-between text-[#6B7280]">
          <span>Total Gross Amount</span>
          <span className="font-bold text-[#0F1535]">₹{totalOrderValue.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between text-[#12B76A]">
          <span>Advance Received</span>
          <span className="font-bold">-₹{advancePaid.toLocaleString("en-IN")}</span>
        </div>
        <div className="flex justify-between items-center text-[15px] font-extrabold text-[#0F1535] pt-2 border-t border-[#E5E7EB]">
          <span>Net Balance Payable</span>
          <span className="text-[#12B76A]">₹{balanceDue.toLocaleString("en-IN")}</span>
        </div>
      </div>

      {/* Payment Information & Signatory Note */}
      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-[#E5E7EB] text-[11px] text-[#6B7280]">
        <div>
          <span className="font-bold text-[#0F1535] block mb-0.5">Payment Modes</span>
          <span>UPI / GPay / PhonePe: contact@plancsolutions.in</span><br />
          <span>Cash on completion or Instant Bank Transfer accepted.</span>
        </div>
        <div className="text-right">
          <span className="font-bold text-[#0F1535] block mb-0.5">Authorized Signature</span>
          <span className="italic">For Plan C Cleaning Solutions</span>
        </div>
      </div>

      {/* Footnote */}
      <div className="text-center pt-2 text-[10.5px] text-[#9CA3AF] border-t border-[#F3F4F6]">
        Thank you for choosing Plan C Cleaning Solutions Trivandrum. This is a computer-generated tax invoice.
      </div>
    </div>
  );

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
          <span>Back to Bookings</span>
        </button>

        {/* Action Buttons: Preview Invoice & Print / Download PDF */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowInvoicePreview(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#EEF0F6] bg-white hover:bg-[#F6F7FD] text-[#0F1535] text-[13.5px] font-bold shadow-xs transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-[#5B5BF0]" />
            <span>Preview Invoice</span>
          </button>
          <button
            type="button"
            onClick={handlePrintInvoice}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#12B76A] hover:bg-[#0EA05C] text-white text-[13.5px] font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Download PDF</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Details (7 cols) + Right Financials & Invoice (5 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Main Booking Header Card */}
          <div className="bg-white border border-[#EEF0F6] rounded-[24px] p-6 sm:p-7 shadow-[0_4px_24px_rgba(91,91,240,0.04)] space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EEF0F6] pb-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[15px] font-bold text-[#5B5BF0] bg-[#EEF0FF] border border-[#5B5BF0]/15 px-3 py-1 rounded-xl shadow-2xs">
                  {booking.id}
                </span>
                <span className="text-[12.5px] font-medium text-[#6B7280]">
                  Created {booking.createdAt}
                </span>
              </div>

              {/* Status Selector */}
              <div className="flex items-center gap-2.5">
                <span className="text-[12px] font-bold uppercase tracking-wider text-[#9CA3AF]">Status</span>
                <div className="relative">
                  <select
                    value={booking.status}
                    onChange={(e) => updateBookingStatus(booking.id, e.target.value as BookingStatusType)}
                    className={`pl-3.5 pr-8 py-1.5 rounded-full text-[13px] font-bold border transition-all outline-none cursor-pointer appearance-none shadow-2xs ${
                      booking.status === "Completed"
                        ? "bg-[#ECFDF3] border-[#A6F4C5] text-[#027A48]"
                        : booking.status === "In Progress"
                        ? "bg-[#EFF8FF] border-[#B2DDFF] text-[#175CD3]"
                        : booking.status === "Cancelled"
                        ? "bg-[#FEF3F2] border-[#FECDCA] text-[#B42318]"
                        : "bg-[#FFF4ED] border-[#FDDCAB] text-[#B54708]"
                    }`}
                  >
                    <option value="Confirmed">Confirmed</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-current opacity-70 text-[10px]">
                    ▼
                  </span>
                </div>
              </div>
            </div>

            {/* Service & Schedule */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13.5px]">
              <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-[#EEF0F6] space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                  Service Offering
                </span>
                <div className="text-[16px] font-extrabold text-[#0F1535]">
                  {service?.name || booking.serviceName || "General Service"}
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EEF0FF] text-[12px] text-[#5B5BF0] font-semibold w-fit">
                  <span>{service?.category || "Cleaning"}</span>
                  <span>·</span>
                  <span>{service?.duration || "2–3 hrs"}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-[#EEF0F6] space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                  Service Appointment
                </span>
                <div className="text-[16px] font-extrabold text-[#0F1535] font-mono">
                  {booking.date}
                </div>
                <div className="text-[12.5px] text-[#6B7280] font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#5B5BF0]" />
                  <span>{booking.time}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Customer & Address Details Card */}
          <div className="bg-white border border-[#EEF0F6] rounded-[24px] p-6 sm:p-7 shadow-[0_4px_24px_rgba(91,91,240,0.04)] space-y-5">
            <div className="flex items-center justify-between border-b border-[#EEF0F6] pb-3.5">
              <h3 className="text-[16px] font-bold text-[#0F1535]">
                Customer Contact &amp; Dispatch Location
              </h3>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF] font-mono">
                {customer?.id || booking.customerId}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13.5px]">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8F9FC] border border-[#EEF0F6]">
                <div className="w-9 h-9 rounded-xl bg-[#EEF0FF] text-[#5B5BF0] flex items-center justify-center font-bold text-[14px] shrink-0">
                  <User className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF] block mb-0.5">
                    Customer Name
                  </span>
                  <div className="font-bold text-[14px] text-[#0F1535] truncate">
                    {customer?.name || booking.customerName || "Customer Name"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8F9FC] border border-[#EEF0F6]">
                <div className="w-9 h-9 rounded-xl bg-[#ECFDF3] text-[#12B76A] flex items-center justify-center font-bold shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF] block mb-0.5">
                    Phone Number
                  </span>
                  <a
                    href={`tel:${customer?.phone || booking.customerPhone}`}
                    className="font-bold text-[14px] text-[#0F1535] hover:text-[#12B76A] transition-colors truncate block font-mono"
                  >
                    {customer?.phone || booking.customerPhone || "+91 94471 23456"}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8F9FC] border border-[#EEF0F6]">
                <div className="w-9 h-9 rounded-xl bg-[#EEF0FF] text-[#5B5BF0] flex items-center justify-center font-bold shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF] block mb-0.5">
                    Email Address
                  </span>
                  <div className="font-medium text-[13px] text-[#0F1535] truncate">
                    {customer?.email || booking.customerEmail || "Not provided"}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#F8F9FC] border border-[#EEF0F6]">
                <div className="w-9 h-9 rounded-xl bg-[#FFF4E5] text-[#F79009] flex items-center justify-center font-bold shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#9CA3AF] block mb-0.5">
                    Service Address
                  </span>
                  <div className="font-semibold text-[13px] text-[#0F1535] line-clamp-2">
                    {booking.address || customer?.address || "Trivandrum, Kerala"}
                  </div>
                </div>
              </div>
            </div>

            {booking.notes && (
              <div className="p-4 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-[13px] space-y-1">
                <span className="font-bold uppercase tracking-wider block text-[11px]">
                  Customer Notes &amp; Access Instructions:
                </span>
                <p className="leading-relaxed">{booking.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Pricing, Extras, Advance & Invoice (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Financial Breakdown Card */}
          <div className="bg-white border border-[#EEF0F6] rounded-[24px] p-6 sm:p-7 shadow-[0_4px_24px_rgba(91,91,240,0.04)] space-y-5">
            <div className="flex items-center justify-between border-b border-[#EEF0F6] pb-3.5">
              <div>
                <h3 className="text-[17px] font-bold text-[#0F1535]">Order Financials</h3>
                <p className="text-[12px] text-[#6B7280] mt-0.5">Base pricing, advances and extra charges</p>
              </div>
              <div className="w-9 h-9 rounded-xl bg-[#EEF0FF] text-[#5B5BF0] flex items-center justify-center shrink-0">
                <Receipt className="w-4 h-4" />
              </div>
            </div>

            {/* Base Price Row with Manual Edit */}
            <div className="p-4 rounded-2xl bg-[#F8F9FC] border border-[#EEF0F6] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-[#0F1535]">Base Service Price</span>
                {!isEditingBasePrice ? (
                  <div className="flex items-center gap-2">
                    <span className="text-[16px] font-extrabold text-[#0F1535]">
                      {basePrice > 0 ? `₹${basePrice.toLocaleString("en-IN")}` : "Not Set / Pending Quote"}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setBasePriceInput(String(basePrice));
                        setIsEditingBasePrice(true);
                      }}
                      className="p-1.5 rounded-lg text-[#5B5BF0] hover:bg-[#EEF0FF] transition-colors cursor-pointer"
                      title="Edit base price"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={basePriceInput}
                      onChange={(e) => setBasePriceInput(e.target.value)}
                      className="w-24 px-2 py-1 rounded-lg border border-[#5B5BF0] text-[14px] font-bold text-[#0F1535] bg-white outline-none"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={handleSaveBasePrice}
                      className="px-2.5 py-1 rounded-lg bg-[#12B76A] text-white text-[12px] font-bold cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingBasePrice(false)}
                      className="px-2 py-1 rounded-lg text-[#6B7280] text-[12px] hover:text-[#0F1535] cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
              <p className="text-[11.5px] text-[#6B7280]">
                Can be updated anytime before or after job completion.
              </p>
            </div>

            {/* Extra Charges Section */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-[#0F1535]">Extra Charges / Add-ons</span>
                <button
                  type="button"
                  onClick={() => setShowAddExtraModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#EEF0FF] hover:bg-[#E0E4FF] text-[#5B5BF0] text-[12px] font-bold transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Extras</span>
                </button>
              </div>

              {extraCharges.length === 0 ? (
                <div className="py-2.5 px-3 rounded-xl bg-[#F8F9FC] border border-dashed border-[#EEF0F6] text-[12.5px] text-[#9CA3AF] text-center italic">
                  No additional extra charges added.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {extraCharges.map((ext) => (
                    <div
                      key={ext.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#F8F9FC] border border-[#EEF0F6] text-[13px]"
                    >
                      <span className="font-semibold text-[#0F1535]">{ext.title}</span>
                      <div className="flex items-center gap-2.5">
                        <span className="font-bold text-[#0F1535]">+₹{ext.amount.toLocaleString("en-IN")}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveExtra(ext.id)}
                          className="text-[#9CA3AF] hover:text-[#F04438] p-1 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Advance Payment Section */}
            <div className="space-y-2.5 pt-3 border-t border-[#EEF0F6]">
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-[#0F1535]">Advance Payment Received</span>
                <button
                  type="button"
                  onClick={() => {
                    setAdvanceInput(String(advancePaid));
                    setShowAddAdvanceModal(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ECFDF3] hover:bg-[#D5EBDF] text-[#12B76A] text-[12px] font-bold transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{advancePaid > 0 ? "Edit Advance" : "Add Advance"}</span>
                </button>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F8F9FC] border border-[#EEF0F6] flex items-center justify-between">
                <span className="text-[13px] font-medium text-[#6B7280]">Advance Deposit</span>
                <span className="text-[15px] font-extrabold text-[#12B76A] font-mono">
                  -₹{advancePaid.toLocaleString("en-IN")}
                </span>
              </div>
            </div>

            {/* Final Calculation Summary */}
            <div className="space-y-2.5 pt-4 border-t border-[#EEF0F6]">
              <div className="flex justify-between text-[13px] text-[#6B7280]">
                <span>Total Order Value</span>
                <span className="font-bold text-[#0F1535] font-mono">₹{totalOrderValue.toLocaleString("en-IN")}</span>
              </div>

              <div className="flex justify-between items-center p-4 rounded-2xl bg-gradient-to-br from-[#F6F7FD] to-[#EEF0FF] border border-[#E0E4FF] text-[#0F1535]">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider block text-[#6B7280] mb-0.5">
                    Remaining Balance Due
                  </span>
                  <span className="text-[22px] font-black text-[#0F1535] font-mono tracking-tight">
                    ₹{balanceDue.toLocaleString("en-IN")}
                  </span>
                </div>

                {isPaidInFull ? (
                  <span className="px-3 py-1 rounded-full bg-[#E7F8F0] border border-[#A6F4C5] text-[#12B76A] text-[11.5px] font-extrabold tracking-wide">
                    PAID IN FULL
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full bg-[#FFF4ED] border border-[#FDDCAB] text-[#B54708] text-[11.5px] font-bold">
                    PENDING BALANCE
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Advance Payment Modal */}
      {showAddAdvanceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-[#EEF0F6] rounded-[24px] max-w-sm w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-[#EEF0F6] pb-3">
              <h4 className="font-bold text-[16px] text-[#0F1535]">Record Advance Payment</h4>
              <button
                type="button"
                onClick={() => setShowAddAdvanceModal(false)}
                className="text-[#9CA3AF] hover:text-[#0F1535]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveAdvance} className="space-y-4">
              <div>
                <label className="block text-[12.5px] font-semibold text-[#0F1535] mb-1">Advance Amount (₹)</label>
                <input
                  type="number"
                  value={advanceInput}
                  onChange={(e) => setAdvanceInput(e.target.value)}
                  placeholder="e.g. 500"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EEF0F6] text-[14px] font-bold text-[#0F1535] outline-none focus:border-[#12B76A]"
                  autoFocus
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAdvanceModal(false)}
                  className="px-4 py-2 rounded-xl text-[13px] font-medium text-[#6B7280] hover:bg-[#F6F7FD]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#12B76A] hover:bg-[#0EA05C] text-white text-[13px] font-bold cursor-pointer"
                >
                  Save Advance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Extra Charges Modal */}
      {showAddExtraModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-[#EEF0F6] rounded-[24px] max-w-sm w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-[#EEF0F6] pb-3">
              <h4 className="font-bold text-[16px] text-[#0F1535]">Add Extra Charge / Service</h4>
              <button
                type="button"
                onClick={() => setShowAddExtraModal(false)}
                className="text-[#9CA3AF] hover:text-[#0F1535]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleAddExtra} className="space-y-4">
              <div>
                <label className="block text-[12.5px] font-semibold text-[#0F1535] mb-1">Charge Description</label>
                <input
                  type="text"
                  value={extraTitle}
                  onChange={(e) => setExtraTitle(e.target.value)}
                  placeholder="e.g. Balcony wash, stain removal"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EEF0F6] text-[13.5px] text-[#0F1535] outline-none focus:border-[#5B5BF0]"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-[12.5px] font-semibold text-[#0F1535] mb-1">Amount (₹)</label>
                <input
                  type="number"
                  value={extraAmount}
                  onChange={(e) => setExtraAmount(e.target.value)}
                  placeholder="e.g. 300"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#EEF0F6] text-[14px] font-bold text-[#0F1535] outline-none focus:border-[#5B5BF0]"
                  required
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddExtraModal(false)}
                  className="px-4 py-2 rounded-xl text-[13px] font-medium text-[#6B7280] hover:bg-[#F6F7FD]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5B5BF0] hover:bg-[#4E4EE0] text-white text-[13px] font-bold cursor-pointer"
                >
                  Add Charge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dedicated Hidden Print Host (Always present in DOM so window.print() prints only this on 1 page) */}
      <div className="hidden print:block">
        <PrintableInvoiceContent />
      </div>

      {/* Invoice Preview Modal */}
      {showInvoicePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150 no-print">
          <div className="bg-white border border-[#EEF0F6] rounded-[24px] max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95">
            {/* Action Bar */}
            <div className="flex justify-between items-center border-b border-[#EEF0F6] pb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#5B5BF0]" />
                <span className="font-bold text-[17px] text-[#0F1535]">Tax Invoice Preview</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handlePrintInvoice}
                  className="px-4 py-2 rounded-xl bg-[#12B76A] hover:bg-[#0EA05C] text-white text-[13px] font-bold inline-flex items-center gap-1.5 cursor-pointer shadow-xs transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save PDF (1 Page)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowInvoicePreview(false)}
                  className="w-8 h-8 rounded-full bg-[#F6F7FD] hover:bg-[#EEF0FF] text-[#6B7280] flex items-center justify-center cursor-pointer transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Preview Document */}
            <PrintableInvoiceContent />
          </div>
        </div>
      )}
    </div>
  );
}
