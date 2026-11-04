"use client";

import { useState, useMemo } from "react";
import PageHeader from "../shared/PageHeader";
import Toolbar from "../shared/Toolbar";
import DataTable from "../shared/DataTable";
import { AdminClientNote } from "@/types/admin";
import { CheckSquare, Square, Phone, ArrowUpRight } from "lucide-react";

interface ClientNotesViewProps {
  notes: AdminClientNote[];
  onToggleHandled: (id: string) => void;
  onOpenBooking: (bookingCode: string) => void;
}

export default function ClientNotesView({
  notes,
  onToggleHandled,
  onOpenBooking,
}: ClientNotesViewProps) {
  const [tab, setTab] = useState<"Open" | "Handled">("Open");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const openCount = notes.filter((n) => !n.handled).length;
  const handledCount = notes.filter((n) => n.handled).length;

  const filteredNotes = useMemo(() => {
    // Sort newest first
    const sorted = [...notes].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return sorted.filter((n) => {
      const matchesTab = tab === "Open" ? !n.handled : n.handled;
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        n.bookingCode.toLowerCase().includes(q) ||
        n.customerName.toLowerCase().includes(q) ||
        n.note.toLowerCase().includes(q) ||
        n.customerPhone.includes(q);
      return matchesTab && matchesSearch;
    });
  }, [notes, tab, search]);

  const paginatedNotes = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredNotes.slice(start, start + pageSize);
  }, [filteredNotes, page]);

  const columns = [
    {
      header: "Handled",
      cell: (n: AdminClientNote) => (
        <button
          type="button"
          onClick={() => onToggleHandled(n.id)}
          className="flex items-center gap-1.5 text-[12.5px] cursor-pointer"
          aria-label={n.handled ? "Mark open" : "Mark handled"}
        >
          {n.handled ? (
            <CheckSquare className="w-4 h-4 text-[#0F6B54]" />
          ) : (
            <Square className="w-4 h-4 text-[#5D6B65]" />
          )}
          <span className={n.handled ? "text-[#0F6B54] font-medium" : "text-[#5D6B65]"}>
            {n.handled ? "Done" : "Pending"}
          </span>
        </button>
      ),
    },
    {
      header: "Booking code",
      cell: (n: AdminClientNote) => (
        <button
          type="button"
          onClick={() => onOpenBooking(n.bookingCode)}
          className="font-mono text-[#0F6B54] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
        >
          <span>{n.bookingCode}</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
      ),
    },
    {
      header: "Customer",
      cell: (n: AdminClientNote) => (
        <div className="space-y-0.5">
          <div className="font-medium text-[#12201B]">{n.customerName}</div>
          <a
            href={`tel:${n.customerPhone}`}
            className="text-[12px] text-[#5D6B65] hover:text-[#0F6B54] inline-flex items-center gap-1"
          >
            <Phone className="w-3 h-3" />
            <span>{n.customerPhone}</span>
          </a>
        </div>
      ),
    },
    {
      header: "Note / Remarks",
      cell: (n: AdminClientNote) => (
        <p className="text-[13.5px] text-[#12201B] max-w-lg leading-relaxed py-1">
          “{n.note}”
        </p>
      ),
    },
    {
      header: "Logged date",
      align: "right" as const,
      cell: (n: AdminClientNote) => (
        <div className="text-[12px] text-[#5D6B65] text-right">
          {n.createdAt}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <PageHeader
        title="Client notes"
        subtitle="Customer requests and special remarks collected via online bookings"
      />

      {/* Toolbar */}
      <Toolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search notes by booking code, customer, text..."
        filters={
          <div className="flex items-center gap-1.5 p-1 rounded-[10px] bg-[#F1F4F2] border border-[#E3E8E5]">
            <button
              type="button"
              onClick={() => {
                setTab("Open");
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-[8px] text-[12.5px] font-medium transition-colors cursor-pointer ${
                tab === "Open"
                  ? "bg-white text-[#12201B] font-semibold shadow-xs"
                  : "text-[#5D6B65] hover:text-[#12201B]"
              }`}
            >
              Open ({openCount})
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("Handled");
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-[8px] text-[12.5px] font-medium transition-colors cursor-pointer ${
                tab === "Handled"
                  ? "bg-white text-[#12201B] font-semibold shadow-xs"
                  : "text-[#5D6B65] hover:text-[#12201B]"
              }`}
            >
              Handled ({handledCount})
            </button>
          </div>
        }
      />

      {/* Table */}
      <DataTable
        columns={columns}
        data={paginatedNotes}
        totalItems={filteredNotes.length}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={setPage}
        emptyTitle={`No ${tab.toLowerCase()} notes`}
        emptyDescription="All client special requests in this view have been addressed."
      />
    </div>
  );
}
