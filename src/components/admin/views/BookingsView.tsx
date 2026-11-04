"use client";

import { useState, useMemo } from "react";
import PageHeader from "../shared/PageHeader";
import Toolbar from "../shared/Toolbar";
import DataTable from "../shared/DataTable";
import StatusPill from "../shared/StatusPill";
import Drawer from "../shared/Drawer";
import { AdminBooking, BookingStatus } from "@/types/admin";
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
  MoreVertical
} from "lucide-react";
import Link from "next/link";

interface BookingsViewProps {
  bookings: AdminBooking[];
  onStatusChange: (id: string, newStatus: BookingStatus, prevStatus: BookingStatus) => void;
  initialFilter?: string;
}

export default function BookingsView({
  bookings,
  onStatusChange,
  initialFilter = "all",
}: BookingsViewProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(initialFilter);
  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc">("date-desc");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  // Selected booking for Right-side detail drawer
  const [selectedBooking, setSelectedBooking] = useState<AdminBooking | null>(null);

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
      b.amount,
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
          {b.amount}
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
            {/* Status change block */}
            <div className="bg-[#F1F4F2] p-4 rounded-[12px] border border-[#E3E8E5] flex items-center justify-between">
              <div>
                <div className="text-[12px] text-[#5D6B65] font-medium">Status</div>
                <div className="text-[14px] font-semibold text-[#12201B]">Current pipeline state</div>
              </div>
              <StatusPill
                status={selectedBooking.status}
                interactive={true}
                onChange={(newStatus) => {
                  onStatusChange(selectedBooking.id, newStatus, selectedBooking.status);
                  setSelectedBooking({ ...selectedBooking, status: newStatus });
                }}
              />
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
                  <span className="font-mono font-bold text-[#0F6B54]">{selectedBooking.amount}</span>
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
    </div>
  );
}
