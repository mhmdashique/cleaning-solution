"use client";

import { useState, useMemo, useEffect } from "react";
import PageHeader from "../shared/PageHeader";
import Toolbar from "../shared/Toolbar";
import DataTable from "../shared/DataTable";
import StatusPill from "../shared/StatusPill";
import Drawer from "../shared/Drawer";
import { AdminBooking, BookingStatus, PaymentStatus } from "@/types/admin";
import { 
  Download, 
  ExternalLink, 
  Phone, 
  User, 
  Clock, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  Calendar,
  MoreVertical,
  Eye,
  FileDown,
  X,
} from "lucide-react";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatCurrency";

const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });

interface BookingsViewProps {
  bookings: AdminBooking[];
  onStatusChange: (id: string, newStatus: BookingStatus, prevStatus: BookingStatus) => void;
  onPaymentStatusChange: (id: string, paymentStatus: PaymentStatus) => Promise<boolean>;
  onAmountChange: (id: string, amount: number | null) => Promise<boolean>;
  initialFilter?: string;
}

export default function BookingsView({
  bookings,
  onStatusChange,
  onPaymentStatusChange,
  onAmountChange,
  initialFilter = "all",
}: BookingsViewProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(initialFilter);
  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc">("date-desc");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Selected booking for Right-side detail drawer
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);
  const [amountDraft, setAmountDraft] = useState("");
  const [advanceDraft, setAdvanceDraft] = useState("");
  const [extraDraft, setExtraDraft] = useState("");
  const [discountDraft, setDiscountDraft] = useState("");
  const [isSavingAmount, setIsSavingAmount] = useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  const [amountError, setAmountError] = useState<string | null>(null);
  const [invoicePreviewOpen, setInvoicePreviewOpen] = useState(false);
  const [invoiceError, setInvoiceError] = useState<string | null>(null);

  useEffect(() => {
    setAmountDraft(selectedBooking?.amount?.toString() || "");
    setAdvanceDraft("");
    setExtraDraft("");
    setDiscountDraft("");
  }, [selectedBooking?.id]);

  // Status counts
  const pendingCount = bookings.filter((b) => b.status === "Pending").length;
  const confirmedCount = bookings.filter((b) => b.status === "Confirmed").length;
  const inProgressCount = bookings.filter((b) => b.status === "In progress").length;
  const completedCount = bookings.filter((b) => b.status === "Completed").length;
  const cancelledCount = bookings.filter((b) => b.status === "Cancelled").length;

  // Filtered and sorted bookings
  const filteredBookings = useMemo(() => {
    let list = bookings.filter((b) => {
      const matchesStatus = statusFilter === "all" || b.status === statusFilter;
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        b.bookingCode.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.customerPhone.includes(q) ||
        b.area.toLowerCase().includes(q) ||
        b.serviceName.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });

    list.sort((a, b) => {
      if (sortBy === "date-desc") {
        return new Date(b.serviceDate || b.createdAt).getTime() - new Date(a.serviceDate || a.createdAt).getTime();
      }
      return new Date(a.serviceDate || a.createdAt).getTime() - new Date(b.serviceDate || b.createdAt).getTime();
    });

    return list;
  }, [bookings, search, statusFilter, sortBy]);

  // Paginated slice
  const paginatedBookings = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredBookings.slice(start, start + pageSize);
  }, [filteredBookings, page]);

  // CSV export
  const handleExportCsv = () => {
    const headers = ["Booking Code", "Customer", "Phone", "Service", "Area", "Status", "Amount", "Service Date"];
    const rows = filteredBookings.map((b) => [
      b.bookingCode,
      `"${b.customerName}"`,
      b.customerPhone,
      `"${b.serviceName}"`,
      `"${b.area}"`,
      b.status,
      b.amount === null ? "" : formatCurrency(b.amount),
      b.serviceDate,
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `plan_c_bookings_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const calcNet = (base: number, advance: string, extra: string, discount: string) => {
    const a = parseFloat(advance) || 0;
    const e = parseFloat(extra) || 0;
    const d = parseFloat(discount) || 0;
    return Math.max(0, base + e - d - a);
  };

  const handleDownloadInvoice = (booking: AdminBooking, advance: string, extra: string, discount: string) => {
    if (booking.amount === null) return;

    const invoiceWindow = window.open("", "_blank");
    if (!invoiceWindow) {
      setInvoiceError("Your browser blocked the invoice window. Allow pop-ups and try again.");
      return;
    }

    setInvoiceError(null);
    const invoiceDate = new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    const customerEmail = booking.customerEmail
      ? `<p>${escapeHtml(booking.customerEmail)}</p>`
      : "";
    const advanceVal = parseFloat(advance) || 0;
    const extraVal = parseFloat(extra) || 0;
    const discountVal = parseFloat(discount) || 0;
    const netTotal = Math.max(0, booking.amount + extraVal - discountVal - advanceVal);
    const extraRow = extraVal > 0 ? `<tr><td><span class="service-name">Extra charges</span></td><td>+ ${escapeHtml(formatCurrency(extraVal))}</td></tr>` : "";
    const discountRow = discountVal > 0 ? `<tr><td><span class="service-name">Discount</span></td><td style="color:#dc2626">− ${escapeHtml(formatCurrency(discountVal))}</td></tr>` : "";
    const advanceRow = advanceVal > 0 ? `<tr><td><span class="service-name">Advance paid</span></td><td style="color:#2563eb">− ${escapeHtml(formatCurrency(advanceVal))}</td></tr>` : "";

    invoiceWindow.document.open();
    invoiceWindow.document.write(`<!doctype html>
      <html lang="en">
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <title>Invoice ${escapeHtml(booking.bookingCode)}</title>
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; padding: 36px; color: #172923; background: #f3f6f4; font: 14px Arial, sans-serif; }
            main { max-width: 780px; margin: 0 auto; padding: 44px 48px; background: #fff; border: 1px solid #e3e8e5; }
            header { display: flex; justify-content: space-between; gap: 24px; padding-bottom: 26px; border-bottom: 1px solid #dfe7e2; }
            .brand { display: flex; align-items: flex-start; gap: 14px; }
            .brand-mark { display: grid; width: 44px; height: 44px; place-items: center; flex: 0 0 44px; border-radius: 12px; color: #fff; background: #0f6b54; font-size: 14px; font-weight: 700; letter-spacing: .04em; }
            .company { margin: 2px 0 5px; font-size: 17px; font-weight: 700; letter-spacing: -.02em; }
            p { margin: 4px 0; color: #62716a; line-height: 1.55; }
            .contact { font-size: 11px; }
            .meta { min-width: 185px; text-align: right; }
            .eyebrow { margin: 0 0 6px; color: #0f6b54; font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
            h1 { margin: 0; font-size: 27px; letter-spacing: -.04em; }
            .invoice-number { margin-top: 6px; color: #33443d; font-size: 12px; font-weight: 700; }
            .status { display: inline-block; margin-top: 10px; padding: 5px 9px; border-radius: 99px; color: #0f6b54; background: #e8f4ee; font-size: 10px; font-weight: 700; }
            .paid-seal { display: grid; width: 76px; height: 76px; flex: 0 0 76px; place-items: center; border: 3px double #12805c; border-radius: 50%; color: #12805c; font-size: 15px; font-weight: 800; letter-spacing: .12em; transform: rotate(-12deg); }
            .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin: 26px 0; }
            .card { padding: 15px 16px; border: 1px solid #e5ebe7; border-radius: 8px; background: #fbfcfb; }
            .label { margin: 0 0 9px; color: #738078; font-size: 9px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; }
            .person { margin: 0 0 4px; color: #172923; font-size: 14px; font-weight: 700; }
            .items { width: 100%; border-collapse: collapse; }
            .items th { padding: 11px 12px; color: #5d6b65; background: #f3f6f4; font-size: 9px; letter-spacing: .1em; text-align: left; text-transform: uppercase; }
            .items td { padding: 16px 12px; border-bottom: 1px solid #e3e8e5; color: #263830; vertical-align: top; }
            .items th:last-child, .items td:last-child { text-align: right; }
            .service-name { font-weight: 700; }
            .subtext { display: block; margin-top: 5px; color: #748078; font-size: 11px; }
            .total-wrap { display: flex; justify-content: flex-end; margin-top: 18px; }
            .total { display: flex; min-width: 250px; justify-content: space-between; gap: 36px; padding: 15px 17px; border-radius: 8px; color: #fff; background: #0f6b54; font-size: 15px; font-weight: 700; }
            footer { display: flex; justify-content: space-between; gap: 18px; margin-top: 38px; padding-top: 14px; border-top: 1px solid #e3e8e5; font-size: 10px; }
            footer p { margin: 0; }
            .footer-brand { color: #0f6b54; font-weight: 700; white-space: nowrap; }
            @media (max-width: 560px) {
              body { padding: 12px; }
              main { padding: 26px 20px; }
              header { gap: 12px; }
              .brand-mark { width: 36px; height: 36px; flex-basis: 36px; }
              .company { font-size: 14px; }
              .meta { min-width: auto; }
              h1 { font-size: 23px; }
            }
            @media print {
              body { padding: 0; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
              main { max-width: none; padding: 0; border: 0; }
            }
            @page { size: A4; margin: 16mm; }
          </style>
        </head>
        <body>
          <main>
            <header>
              <div class="brand">
                <div class="brand-mark">PC</div>
                <div>
                  <p class="company">PLAN C Cleaning Solutions</p>
                  <p class="contact">Thrikannapuram, Thiruvananthapuram, Kerala - 695032</p>
                  <p class="contact">Phone: 7994342372</p>
                </div>
              </div>
              <div class="meta">
                <p class="eyebrow">Service invoice</p>
                <h1>Invoice</h1>
                <p class="invoice-number">${escapeHtml(booking.bookingCode)}</p>
                <span class="status">${escapeHtml(booking.status)}</span>
              </div>
              ${booking.paymentStatus === "Paid" ? '<div class="paid-seal" aria-label="Paid">PAID</div>' : ""}
            </header>
            <section class="parties">
              <div class="card">
                <p class="label">Billed to</p>
                <p class="person">${escapeHtml(booking.customerName)}</p>
                <p>${escapeHtml(booking.customerPhone)}</p>
                ${customerEmail}
                <p>${escapeHtml(booking.area)}</p>
              </div>
              <div class="card">
                <p class="label">Invoice details</p>
                <p><strong>Issued</strong> &nbsp; ${escapeHtml(invoiceDate)}</p>
                <p><strong>Booking ID</strong> &nbsp; ${escapeHtml(booking.bookingCode)}</p>
                <p><strong>Service date</strong> &nbsp; ${escapeHtml(booking.serviceDate)}</p>
                <p><strong>Payment</strong> &nbsp; <span style="display:inline-block;padding:2px 8px;border-radius:99px;font-size:10px;font-weight:700;background:${booking.paymentStatus === 'Paid' ? '#e8f4ee' : '#fef3c7'};color:${booking.paymentStatus === 'Paid' ? '#0f6b54' : '#b45309'}">${escapeHtml(booking.paymentStatus)}</span></p>
              </div>
            </section>
            <table class="items">
              <thead><tr><th>Description</th><th>Amount</th></tr></thead>
              <tbody>
                <tr><td><span class="service-name">${escapeHtml(booking.serviceName)}</span><span class="subtext">Cleaning service</span></td><td>${escapeHtml(formatCurrency(booking.amount))}</td></tr>
                ${extraRow}${discountRow}${advanceRow}
              </tbody>
            </table>
            <div class="total-wrap"><div class="total"><span>Net amount due</span><span>${escapeHtml(formatCurrency(netTotal))}</span></div></div>
            <footer><p>This invoice reflects the confirmed amount entered for this booking.</p><span class="footer-brand">Thank you for choosing PLAN C</span></footer>
          </main>
        </body>
      </html>`);
    invoiceWindow.document.close();
    invoiceWindow.document.title = `Invoice-${booking.bookingCode}`;
    invoiceWindow.onload = () => {
      invoiceWindow.focus();
      invoiceWindow.print();
    };
  };

  const columns = [
    {
      header: "Booking",
      cell: (b: AdminBooking) => (
        <div className="space-y-0.5">
          <div className="font-semibold text-[#12201B] flex items-center gap-1.5 font-mono text-[13px]">
            {b.bookingCode}
          </div>
          <div className="text-[12px] text-[#5D6B65]">
            {b.createdAt}
          </div>
        </div>
      ),
    },
    {
      header: "Customer",
      cell: (b: AdminBooking) => (
        <div className="space-y-0.5">
          <div className="font-medium text-[#12201B]">{b.customerName}</div>
          <a
            href={`tel:${b.customerPhone}`}
            onClick={(e) => e.stopPropagation()}
            className="text-[12px] text-[#0F6B54] hover:underline inline-flex items-center gap-1"
          >
            <Phone className="w-3 h-3" />
            <span>{b.customerPhone}</span>
          </a>
        </div>
      ),
    },
    {
      header: "Service",
      cell: (b: AdminBooking) => (
        <div className="max-w-[220px]" title={b.serviceName}>
          <div className="text-[#12201B] font-medium leading-snug">
            {b.serviceName}
          </div>
          <div className="text-[12px] text-[#5D6B65]">
            Date: {b.serviceDate}
          </div>
        </div>
      ),
    },
    {
      header: "Area",
      cell: (b: AdminBooking) => (
        <div className="max-w-[180px]" title={b.area}>
          <span className="text-[#5D6B65] font-normal leading-snug">
            {b.area}
          </span>
        </div>
      ),
    },
    {
      header: "Payment",
      cell: (b: AdminBooking) => (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11.5px] font-bold ${
          b.paymentStatus === "Paid"
            ? "bg-[#e8f4ee] text-[#0f6b54]"
            : "bg-amber-50 text-amber-700 border border-amber-200"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${b.paymentStatus === "Paid" ? "bg-[#0f6b54]" : "bg-amber-500"}`} />
          {b.paymentStatus}
        </span>
      ),
    },
    {
      header: "Status",
      cell: (b: AdminBooking) => (
        <div onClick={(e) => e.stopPropagation()}>
          <StatusPill
            status={b.status}
            interactive={true}
            onChange={(newStatus) => onStatusChange(b.id, newStatus, b.status)}
          />
        </div>
      ),
    },
    {
      header: "Amount",
      align: "right" as const,
      cell: (b: AdminBooking) => (
        <div className="font-semibold text-[#12201B] text-right font-mono text-[13.5px]">
          {b.amount === null ? "Not set" : formatCurrency(b.amount)}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <PageHeader
        title="Bookings"
        subtitle="Manage customer requests, update team dispatch, and status"
        showChips={true}
        awaitingCount={pendingCount}
        onFilterPending={() => setStatusFilter("Pending")}
      />

      {/* Toolbar */}
      <Toolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by code, customer, phone, area, service..."
        filters={
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-[10px] bg-white border border-[#E3E8E5] text-[13px] text-[#12201B] focus:outline-none focus:ring-2 focus:ring-[#0F6B54] cursor-pointer"
            >
              <option value="all">All statuses ({bookings.length})</option>
              <option value="Pending">Pending ({pendingCount})</option>
              <option value="Confirmed">Confirmed ({confirmedCount})</option>
              <option value="In progress">In progress ({inProgressCount})</option>
              <option value="Completed">Completed ({completedCount})</option>
              <option value="Cancelled">Cancelled ({cancelledCount})</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "date-desc" | "date-asc")}
              className="px-3 py-2 rounded-[10px] bg-white border border-[#E3E8E5] text-[13px] text-[#12201B] focus:outline-none focus:ring-2 focus:ring-[#0F6B54] cursor-pointer"
            >
              <option value="date-desc">Newest first</option>
              <option value="date-asc">Oldest first</option>
            </select>
          </div>
        }
        primaryAction={
          <button
            type="button"
            onClick={handleExportCsv}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] border border-[#E3E8E5] bg-white hover:bg-[#F1F4F2] text-[#12201B] text-[13px] font-medium transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#5D6B65]" />
            <span>Export CSV</span>
          </button>
        }
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={paginatedBookings}
        totalItems={filteredBookings.length}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onRowClick={(booking) => setSelectedBooking(booking)}
        emptyTitle="No bookings found"
        emptyDescription="No bookings match your current search or status filter."
      />

      {/* Detail Drawer */}
      <Drawer
        isOpen={Boolean(selectedBooking)}
        onClose={() => setSelectedBooking(null)}
        title={selectedBooking ? `Booking ${selectedBooking.bookingCode}` : "Booking Details"}
        subtitle={selectedBooking ? `Created on ${selectedBooking.createdAt}` : undefined}
        footer={
          selectedBooking && (
            <div className="flex items-center justify-between gap-3">
              <Link
                href={`/track?booking=${selectedBooking.bookingCode}`}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-[13px] font-medium text-[#0F6B54] hover:underline"
              >
                <span>Open tracking page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={() => setSelectedBooking(null)}
                className="px-4 py-2 rounded-[10px] bg-[#12201B] text-white text-[13px] font-medium hover:bg-black transition-colors"
              >
                Done
              </button>
            </div>
          )
        }
      >
        {selectedBooking && (
          <div className="space-y-6 text-[13.5px]">
            {/* Status + Payment row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#F1F4F2] p-4 rounded-[12px] border border-[#E3E8E5]">
                <div className="text-[12px] text-[#5D6B65] font-medium mb-2">Booking status</div>
                <StatusPill
                  status={selectedBooking.status}
                  interactive={true}
                  onChange={(newStatus) => {
                    onStatusChange(selectedBooking.id, newStatus, selectedBooking.status);
                    setSelectedBooking({ ...selectedBooking, status: newStatus });
                  }}
                />
              </div>
              <div className="bg-[#F1F4F2] p-4 rounded-[12px] border border-[#E3E8E5]">
                <div className="text-[12px] text-[#5D6B65] font-medium mb-2">Payment status</div>
                <button
                  type="button"
                  disabled={isUpdatingPayment}
                  onClick={async () => {
                    const next: PaymentStatus = selectedBooking.paymentStatus === "Paid" ? "Unpaid" : "Paid";
                    setIsUpdatingPayment(true);
                    try {
                      const updated = await onPaymentStatusChange(selectedBooking.id, next);
                      if (updated) {
                        setSelectedBooking({ ...selectedBooking, paymentStatus: next });
                      }
                    } finally {
                      setIsUpdatingPayment(false);
                    }
                  }}
                  className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[12px] font-bold transition-colors cursor-pointer disabled:cursor-wait disabled:opacity-60 ${
                    selectedBooking.paymentStatus === "Paid"
                      ? "bg-[#e8f4ee] text-[#0f6b54] hover:bg-[#d5ebdf]"
                      : "bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100"
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${selectedBooking.paymentStatus === "Paid" ? "bg-[#0f6b54]" : "bg-amber-500"}`} />
                  {isUpdatingPayment
                    ? "Updating..."
                    : selectedBooking.paymentStatus === "Paid"
                      ? "Mark as unpaid"
                      : "Mark as paid"}
                </button>
                <p className="text-[10px] text-[#5D6B65] mt-1.5">
                  {selectedBooking.paymentStatus === "Paid"
                    ? "Invoice shows a paid seal."
                    : "Confirm payment to add a paid seal to the invoice."}
                </p>
              </div>
            </div>

            {/* Customer Details */}
            <div className="space-y-2.5">
              <h3 className="text-[13px] font-semibold text-[#5D6B65] uppercase tracking-wider">
                Customer information
              </h3>
              <div className="bg-white p-3.5 rounded-[12px] border border-[#E3E8E5] space-y-2">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#5D6B65]" />
                  <span className="font-medium text-[#12201B]">{selectedBooking.customerName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#5D6B65]" />
                  <a href={`tel:${selectedBooking.customerPhone}`} className="text-[#0F6B54] hover:underline">
                    {selectedBooking.customerPhone}
                  </a>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#5D6B65] shrink-0 mt-0.5" />
                  <span className="text-[#5D6B65]">{selectedBooking.area}</span>
                </div>
              </div>
            </div>

            {/* Service & Schedule */}
            <div className="space-y-2.5">
              <h3 className="text-[13px] font-semibold text-[#5D6B65] uppercase tracking-wider">
                Service specification
              </h3>
              <div className="bg-white p-3.5 rounded-[12px] border border-[#E3E8E5] space-y-2">
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-[#12201B]">{selectedBooking.serviceName}</span>
                </div>
                <div className="flex items-center gap-2 text-[12.5px] text-[#5D6B65]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Scheduled date: {selectedBooking.serviceDate}</span>
                </div>
                <div className="flex items-center gap-2 text-[12.5px] text-[#5D6B65]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Assigned crew: {selectedBooking.assignedTechnician || "Unassigned"}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 rounded-[12px] border border-[#E3E8E5] bg-white p-3.5">
              <div>
                <p className="text-[12px] font-semibold text-[#12201B]">Billing breakdown (INR)</p>
                <p className="mt-0.5 text-[11px] text-[#5D6B65]">Base amount is saved to the booking. Advance, extra charges and discount appear on the invoice only.</p>
              </div>
              {amountError && (
                <p role="alert" className="text-[11px] font-medium text-red-600">{amountError}</p>
              )}
              {/* Base amount row */}
              <form
                className="flex items-center gap-2"
                onSubmit={async (event) => {
                  event.preventDefault();
                  const normalizedAmount = amountDraft.trim();
                  const amount = normalizedAmount === "" ? null : Number(normalizedAmount);
                  if (amount !== null && (!Number.isFinite(amount) || amount < 0 || Math.round(amount * 100) !== amount * 100)) {
                    setAmountError("Enter a valid amount with no more than two decimal places.");
                    return;
                  }
                  setAmountError(null);
                  setIsSavingAmount(true);
                  try {
                    const saved = await onAmountChange(selectedBooking.id, amount);
                    if (saved) setSelectedBooking((c) => c?.id === selectedBooking.id ? { ...c, amount } : c);
                  } catch {
                    setAmountError("Unable to save the amount. Please try again.");
                  } finally {
                    setIsSavingAmount(false);
                  }
                }}
              >
                <label htmlFor="booking-amount" className="w-24 shrink-0 text-[11.5px] font-semibold text-[#5D6B65]">Base amount</label>
                <input
                  id="booking-amount"
                  type="number" min="0" step="0.01" inputMode="decimal"
                  value={amountDraft}
                  onChange={(e) => { setAmountDraft(e.target.value); setAmountError(null); }}
                  placeholder="0.00"
                  className="min-w-0 flex-1 rounded-[9px] border border-[#E3E8E5] bg-white px-3 py-2 text-[13px] text-[#12201B] focus:outline-none focus:ring-2 focus:ring-[#0F6B54]"
                />
                <button type="submit" disabled={isSavingAmount}
                  className="rounded-[9px] bg-[#0F6B54] px-3 py-2 text-[12px] font-semibold text-white hover:bg-[#0c5543] disabled:opacity-60">
                  {isSavingAmount ? "Saving..." : "Save"}
                </button>
                {selectedBooking.amount !== null && (
                  <button type="button" disabled={isSavingAmount}
                    onClick={async () => {
                      setAmountError(null); setIsSavingAmount(true);
                      try {
                        const saved = await onAmountChange(selectedBooking.id, null);
                        if (saved) { setAmountDraft(""); setSelectedBooking((c) => c?.id === selectedBooking.id ? { ...c, amount: null } : c); }
                      } catch { setAmountError("Unable to clear."); } finally { setIsSavingAmount(false); }
                    }}
                    className="rounded-[9px] border border-[#E3E8E5] px-3 py-2 text-[12px] font-medium text-[#5D6B65] hover:bg-[#F1F4F2] disabled:opacity-60">
                    Clear
                  </button>
                )}
              </form>

              <div className="border-t border-[#E3E8E5] pt-3 space-y-2">
                {/* Advance */}
                <div className="flex items-center gap-2">
                  <label className="w-24 shrink-0 text-[11.5px] font-semibold text-blue-600">Advance</label>
                  <input
                    type="number" min="0" step="0.01" inputMode="decimal"
                    value={advanceDraft}
                    onChange={(e) => setAdvanceDraft(e.target.value)}
                    placeholder="0.00"
                    className="min-w-0 flex-1 rounded-[9px] border border-blue-200 bg-blue-50 px-3 py-2 text-[13px] text-[#12201B] focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                  {advanceDraft && <span className="text-[11px] text-blue-600 font-semibold shrink-0">− {formatCurrency(parseFloat(advanceDraft) || 0)}</span>}
                </div>
                {/* Extra charges */}
                <div className="flex items-center gap-2">
                  <label className="w-24 shrink-0 text-[11.5px] font-semibold text-orange-600">Extra charges</label>
                  <input
                    type="number" min="0" step="0.01" inputMode="decimal"
                    value={extraDraft}
                    onChange={(e) => setExtraDraft(e.target.value)}
                    placeholder="0.00"
                    className="min-w-0 flex-1 rounded-[9px] border border-orange-200 bg-orange-50 px-3 py-2 text-[13px] text-[#12201B] focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                  {extraDraft && <span className="text-[11px] text-orange-600 font-semibold shrink-0">+ {formatCurrency(parseFloat(extraDraft) || 0)}</span>}
                </div>
                {/* Discount */}
                <div className="flex items-center gap-2">
                  <label className="w-24 shrink-0 text-[11.5px] font-semibold text-red-600">Discount</label>
                  <input
                    type="number" min="0" step="0.01" inputMode="decimal"
                    value={discountDraft}
                    onChange={(e) => setDiscountDraft(e.target.value)}
                    placeholder="0.00"
                    className="min-w-0 flex-1 rounded-[9px] border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-[#12201B] focus:outline-none focus:ring-2 focus:ring-red-400"
                  />
                  {discountDraft && <span className="text-[11px] text-red-600 font-semibold shrink-0">− {formatCurrency(parseFloat(discountDraft) || 0)}</span>}
                </div>
              </div>

              {/* Net total preview */}
              {selectedBooking.amount !== null && (
                <div className="flex items-center justify-between rounded-[9px] bg-[#0F6B54] px-4 py-2.5">
                  <span className="text-[12px] font-semibold text-white">Net amount due</span>
                  <span className="text-[14px] font-bold text-white font-mono">
                    {formatCurrency(calcNet(selectedBooking.amount, advanceDraft, extraDraft, discountDraft))}
                  </span>
                </div>
              )}
            </div>

            {/* Customer request note */}
            {selectedBooking.note && (
              <div className="space-y-2.5">
                <h3 className="text-[13px] font-semibold text-[#5D6B65] uppercase tracking-wider">
                  Customer request note
                </h3>
                <div className="bg-[#E3F2EC]/60 border border-[#0F6B54]/20 p-3.5 rounded-[12px] text-[#12201B] text-[13px] leading-relaxed">
                  “{selectedBooking.note}”
                </div>
              </div>
            )}

            <div className="space-y-2.5">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={selectedBooking.amount === null}
                  onClick={() => {
                    setInvoiceError(null);
                    setInvoicePreviewOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-[9px] border border-[#0F6B54] bg-white px-3 py-2 text-[12px] font-semibold text-[#0F6B54] transition-colors hover:bg-[#E3F2EC] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Eye className="h-4 w-4" />
                  Preview invoice
                </button>
                <button
                  type="button"
                  disabled={selectedBooking.amount === null}
                  onClick={() => handleDownloadInvoice(selectedBooking, advanceDraft, extraDraft, discountDraft)}
                  className="inline-flex items-center gap-1.5 rounded-[9px] bg-[#0F6B54] px-3 py-2 text-[12px] font-semibold text-white transition-colors hover:bg-[#0c5543] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <FileDown className="h-4 w-4" />
                  Download invoice
                </button>
              </div>
              {selectedBooking.amount === null && (
                <p className="text-[11px] text-[#5D6B65]">
                  Save the booking amount above to preview or download its invoice.
                </p>
              )}
              {invoiceError && (
                <p role="alert" className="text-[11px] font-medium text-red-600">
                  {invoiceError}
                </p>
              )}
            </div>

            {/* Timeline */}
            <div className="space-y-3">
              <h3 className="text-[13px] font-semibold text-[#5D6B65] uppercase tracking-wider">
                Operation timeline
              </h3>
              <div className="space-y-3 border-l-2 border-[#E3E8E5] ml-2 pl-4">
                {selectedBooking.timeline?.map((step, idx) => (
                  <div key={idx} className="relative space-y-0.5">
                    <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#0F6B54]" />
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-[#12201B] text-[13px]">
                        {step.title}
                      </span>
                      <span className="text-[11.5px] text-[#5D6B65] font-mono">
                        {step.time}
                      </span>
                    </div>
                    <p className="text-[12.5px] text-[#5D6B65] leading-normal">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {invoicePreviewOpen && selectedBooking?.amount !== null && selectedBooking && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setInvoicePreviewOpen(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="invoice-preview-title"
            className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-[#F3F6F4] shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[#E3E8E5] bg-white px-5 py-3.5">
              <div>
                <h2 id="invoice-preview-title" className="text-sm font-bold text-[#12201B]">
                  Invoice preview
                </h2>
                <p className="text-xs text-[#5D6B65]">Review the invoice before saving as PDF</p>
              </div>
              <button
                type="button"
                onClick={() => setInvoicePreviewOpen(false)}
                aria-label="Close invoice preview"
                className="rounded-lg p-2 text-[#5D6B65] hover:bg-[#F1F4F2]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-4 sm:p-7">
              <article className="mx-auto max-w-[700px] border border-[#E3E8E5] bg-white px-5 py-7 shadow-sm sm:px-10 sm:py-10">
                <header className="flex flex-col justify-between gap-6 border-b border-[#DFE7E2] pb-6 sm:flex-row">
                  <div className="flex items-start gap-3.5">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#0F6B54] text-sm font-bold tracking-wide text-white">
                      PC
                    </div>
                    <div>
                      <p className="text-base font-bold tracking-tight text-[#172923]">
                        PLAN C Cleaning Solutions
                      </p>
                      <p className="mt-1 text-[11px] leading-relaxed text-[#62716A]">
                        Thrikannapuram, Thiruvananthapuram, Kerala - 695032
                        <br />
                        Phone: 7994342372
                      </p>
                    </div>
                  </div>
                  <div className="sm:text-right">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#0F6B54]">
                      Service invoice
                    </p>
                    <p className="mt-1 text-3xl font-bold tracking-tight text-[#172923]">Invoice</p>
                    <p className="mt-1 text-xs font-semibold text-[#33443D]">
                      {selectedBooking.bookingCode}
                    </p>
                    <div className="mt-2 flex items-center gap-2 flex-wrap sm:justify-end">
                      <span className="inline-flex rounded-full bg-[#E8F4EE] px-2.5 py-1 text-[10px] font-bold text-[#0F6B54]">
                        {selectedBooking.status}
                      </span>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        selectedBooking.paymentStatus === "Paid"
                          ? "bg-[#e8f4ee] text-[#0f6b54]"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${selectedBooking.paymentStatus === "Paid" ? "bg-[#0f6b54]" : "bg-amber-500"}`} />
                        {selectedBooking.paymentStatus}
                      </span>
                    </div>
                  </div>
                  {selectedBooking.paymentStatus === "Paid" && (
                    <div
                      aria-label="Paid"
                      className="grid h-[76px] w-[76px] shrink-0 rotate-[-12deg] place-items-center rounded-full border-[3px] border-double border-[#12805C] text-[15px] font-extrabold tracking-[0.12em] text-[#12805C]"
                    >
                      PAID
                    </div>
                  )}
                </header>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-[#E5EBE7] bg-[#FBFCFB] p-4">
                    <h3 className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#738078]">
                      Billed to
                    </h3>
                    <p className="text-sm font-bold text-[#172923]">{selectedBooking.customerName}</p>
                    <p className="mt-1 text-xs leading-relaxed text-[#62716A]">
                      {selectedBooking.customerPhone}
                      {selectedBooking.customerEmail && <><br />{selectedBooking.customerEmail}</>}
                      <br />
                      {selectedBooking.area}
                    </p>
                  </div>
                  <div className="rounded-lg border border-[#E5EBE7] bg-[#FBFCFB] p-4">
                    <h3 className="mb-2 text-[10px] font-bold uppercase tracking-[0.12em] text-[#738078]">
                      Invoice details
                    </h3>
                    <dl className="space-y-1.5 text-xs">
                      <div className="flex justify-between gap-3">
                        <dt className="text-[#738078]">Issued</dt>
                        <dd className="text-right font-medium text-[#263830]">
                          {new Date().toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-[#738078]">Booking ID</dt>
                        <dd className="text-right font-medium text-[#263830]">{selectedBooking.bookingCode}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-[#738078]">Service date</dt>
                        <dd className="text-right font-medium text-[#263830]">{selectedBooking.serviceDate}</dd>
                      </div>
                      <div className="flex justify-between gap-3">
                        <dt className="text-[#738078]">Payment</dt>
                        <dd className="text-right">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            selectedBooking.paymentStatus === "Paid"
                              ? "bg-[#e8f4ee] text-[#0f6b54]"
                              : "bg-amber-50 text-amber-700 border border-amber-200"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${selectedBooking.paymentStatus === "Paid" ? "bg-[#0f6b54]" : "bg-amber-500"}`} />
                            {selectedBooking.paymentStatus}
                          </span>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>

                <div className="mt-7 overflow-hidden rounded-lg border border-[#E3E8E5]">
                  <div className="grid grid-cols-[1fr_auto] gap-3 bg-[#F3F6F4] px-4 py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[#5D6B65]">
                    <span>Description</span>
                    <span>Amount</span>
                  </div>
                  <div className="divide-y divide-[#E3E8E5]">
                    <div className="grid grid-cols-[1fr_auto] gap-3 px-4 py-4 text-sm">
                      <div>
                        <p className="font-bold text-[#172923]">{selectedBooking.serviceName}</p>
                        <p className="mt-1 text-[11px] text-[#748078]">Cleaning service</p>
                      </div>
                      <span className="font-semibold text-[#263830]">{formatCurrency(selectedBooking.amount)}</span>
                    </div>
                    {(parseFloat(extraDraft) || 0) > 0 && (
                      <div className="grid grid-cols-[1fr_auto] gap-3 px-4 py-3 text-sm">
                        <span className="text-[#263830]">Extra charges</span>
                        <span className="font-semibold text-orange-600">+ {formatCurrency(parseFloat(extraDraft))}</span>
                      </div>
                    )}
                    {(parseFloat(discountDraft) || 0) > 0 && (
                      <div className="grid grid-cols-[1fr_auto] gap-3 px-4 py-3 text-sm">
                        <span className="text-[#263830]">Discount</span>
                        <span className="font-semibold text-red-600">− {formatCurrency(parseFloat(discountDraft))}</span>
                      </div>
                    )}
                    {(parseFloat(advanceDraft) || 0) > 0 && (
                      <div className="grid grid-cols-[1fr_auto] gap-3 px-4 py-3 text-sm">
                        <span className="text-[#263830]">Advance paid</span>
                        <span className="font-semibold text-blue-600">− {formatCurrency(parseFloat(advanceDraft))}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex justify-end">
                  <div className="flex min-w-[230px] justify-between gap-8 rounded-lg bg-[#0F6B54] px-4 py-3.5 text-sm font-bold text-white">
                    <span>Net amount due</span>
                    <span>{formatCurrency(calcNet(selectedBooking.amount, advanceDraft, extraDraft, discountDraft))}</span>
                  </div>
                </div>

                <footer className="mt-8 flex flex-col justify-between gap-2 border-t border-[#E3E8E5] pt-4 text-[10px] sm:flex-row">
                  <p className="text-[#62716A]">
                    This invoice reflects the confirmed amount entered for this booking.
                  </p>
                  <p className="font-bold text-[#0F6B54]">Thank you for choosing PLAN C</p>
                </footer>
              </article>
            </div>

            <div className="flex justify-end border-t border-[#E3E8E5] bg-white px-5 py-3.5">
              <button
                type="button"
                onClick={() => handleDownloadInvoice(selectedBooking, advanceDraft, extraDraft, discountDraft)}
                className="inline-flex items-center gap-2 rounded-[10px] bg-[#0F6B54] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#0c5543]"
              >
                <FileDown className="h-4 w-4" />
                Download / Save as PDF
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
