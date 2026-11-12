"use client";

import { useState } from "react";
import { MessageSquare, Search, Check, CheckCheck, Plus, X, Phone } from "lucide-react";
import { AdminClientNote } from "@/types/admin";

interface ClientNotesViewProps {
  notes: AdminClientNote[];
  onToggleHandled: (id: string) => void;
  onOpenBooking: (bookingCode: string) => void;
  onAddNote?: (note: Omit<AdminClientNote, "id">) => void;
}

export default function ClientNotesView({
  notes,
  onToggleHandled,
  onOpenBooking,
  onAddNote,
}: ClientNotesViewProps) {
  const [search, setSearch] = useState("");
  const [filterHandled, setFilterHandled] = useState<"All" | "Open" | "Done">("All");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [newBookingCode, setNewBookingCode] = useState("");
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");
  const [newNote, setNewNote] = useState("");

  const filtered = notes.filter((n) => {
    const matchesFilter =
      filterHandled === "All" ||
      (filterHandled === "Open" && !n.handled) ||
      (filterHandled === "Done" && n.handled);

    if (!matchesFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      n.customerName.toLowerCase().includes(q) ||
      n.note.toLowerCase().includes(q) ||
      n.bookingCode.toLowerCase().includes(q)
    );
  });

  const unhandledCount = notes.filter((n) => !n.handled).length;

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim() || !newCustomerName.trim()) return;
    onAddNote?.({
      bookingId: `bk-${Date.now()}`,
      bookingCode: newBookingCode.trim() || `PC-${Math.floor(Math.random() * 9000) + 1000}`,
      customerName: newCustomerName.trim(),
      customerPhone: newCustomerPhone.trim() || "+91 00000 00000",
      note: newNote.trim(),
      createdAt: new Date().toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }),
      handled: false,
    });
    setNewBookingCode("");
    setNewCustomerName("");
    setNewCustomerPhone("");
    setNewNote("");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] md:text-[28px] font-bold text-[#0F1535] tracking-tight">
            Client Notes
          </h1>
          <p className="text-[14px] text-[#6B7280] mt-0.5">
            Special instructions, follow-ups and customer-specific requests
            {unhandledCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full bg-[#FFF4E5] text-[#F79009] text-[12px] font-bold">
                {unhandledCount} open
              </span>
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[10px] bg-[#12B76A] hover:bg-[#0EA05C] text-white text-[14px] font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Note</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-[#EEF0F6] rounded-[20px] p-6 shadow-[0_4px_24px_rgba(91,91,240,0.06)] space-y-5">
        {/* Search + Filter */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by customer, booking code or note..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 rounded-xl bg-[#F6F7FD] border border-[#EEF0F6] text-[13px] text-[#0F1535] placeholder:text-[#9CA3AF] outline-none focus:border-[#5B5BF0] focus:bg-white focus:ring-2 focus:ring-[#5B5BF0]/10 transition-all w-full"
            />
          </div>

          <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F6F7FD] border border-[#EEF0F6]">
            {(["All", "Open", "Done"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilterHandled(f)}
                className={`px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold transition-all cursor-pointer ${
                  filterHandled === f
                    ? "bg-white text-[#0F1535] shadow-xs"
                    : "text-[#6B7280] hover:text-[#0F1535]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Notes List */}
        <div className="space-y-3">
          {filtered.map((note) => (
            <div
              key={note.id}
              className={`flex items-start justify-between gap-4 p-4 rounded-[14px] border transition-all ${
                note.handled
                  ? "bg-[#F8F9FC] border-[#EEF0F6] opacity-70"
                  : "bg-white border-[#EEF0F6] hover:border-[#5B5BF0]/30 hover:shadow-sm"
              }`}
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    note.handled
                      ? "bg-[#E7F8F0] text-[#12B76A]"
                      : "bg-[#FFF4E5] text-[#F79009]"
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-[14px] text-[#0F1535]">
                      {note.customerName}
                    </span>
                    <span className="font-mono text-[12px] text-[#5B5BF0] bg-[#EEF0FF] px-2 py-0.5 rounded-full">
                      {note.bookingCode}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                        note.handled
                          ? "bg-[#E7F8F0] text-[#12B76A]"
                          : "bg-[#FFF4E5] text-[#F79009]"
                      }`}
                    >
                      {note.handled ? "Done" : "Open"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 mt-1 text-[12.5px] text-[#6B7280]">
                    <Phone className="w-3 h-3" />
                    <span className="font-mono">{note.customerPhone}</span>
                    <span className="text-[#D1D5DB]">·</span>
                    <span>{note.createdAt}</span>
                  </div>

                  <p
                    className={`mt-2 text-[13.5px] leading-relaxed ${
                      note.handled
                        ? "text-[#9CA3AF] line-through"
                        : "text-[#374151]"
                    }`}
                  >
                    {note.note}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onOpenBooking(note.bookingCode)}
                  className="px-3 py-1.5 rounded-lg border border-[#EEF0F6] text-[12.5px] font-semibold text-[#5B5BF0] hover:bg-[#EEF0FF] transition-colors cursor-pointer"
                >
                  View booking
                </button>
                <button
                  type="button"
                  onClick={() => onToggleHandled(note.id)}
                  title={note.handled ? "Mark as open" : "Mark as done"}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors cursor-pointer ${
                    note.handled
                      ? "bg-[#F6F7FD] text-[#9CA3AF] hover:bg-[#EEF0F6] hover:text-[#6B7280]"
                      : "bg-[#E7F8F0] text-[#12B76A] hover:bg-[#c8f5df]"
                  }`}
                >
                  {note.handled ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <CheckCheck className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="py-12 text-center space-y-3">
              <MessageSquare className="w-10 h-10 text-[#EEF0F6] mx-auto" />
              <p className="text-[#6B7280] text-[14px]">
                No client notes matching the current filter.
              </p>
              <button
                type="button"
                onClick={() => setShowAddModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#12B76A] text-white text-[13px] font-semibold cursor-pointer hover:bg-[#0EA05C] transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Add first note
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Note Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#EEF0F6] rounded-[24px] p-6 max-w-md w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#EEF0F6] pb-3">
              <h2 className="text-[18px] font-bold text-[#0F1535]">Add Client Note</h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-[#F6F7FD] hover:bg-[#EEF0FF] text-[#6B7280] hover:text-[#5B5BF0] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddNote} className="space-y-4">
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[13px] font-semibold text-[#0F1535] mb-1">
                    Customer Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={newCustomerName}
                    onChange={(e) => setNewCustomerName(e.target.value)}
                    placeholder="e.g. Meera Krishnan"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEF0F6] bg-[#F6F7FD] outline-none focus:bg-white focus:border-[#5B5BF0] text-[#0F1535]"
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#0F1535] mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={newCustomerPhone}
                    onChange={(e) => setNewCustomerPhone(e.target.value)}
                    placeholder="+91 94471 23456"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEF0F6] bg-[#F6F7FD] outline-none focus:bg-white focus:border-[#5B5BF0] text-[#0F1535]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#0F1535] mb-1">
                  Booking Code
                </label>
                <input
                  type="text"
                  value={newBookingCode}
                  onChange={(e) => setNewBookingCode(e.target.value)}
                  placeholder="e.g. PC-8421 (auto-generated if empty)"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEF0F6] bg-[#F6F7FD] outline-none focus:bg-white focus:border-[#5B5BF0] text-[#0F1535]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#0F1535] mb-1">
                  Note / Instruction *
                </label>
                <textarea
                  required
                  rows={3}
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="Enter customer instructions or special request..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEF0F6] bg-[#F6F7FD] outline-none focus:bg-white focus:border-[#5B5BF0] text-[#0F1535] resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-[#EEF0F6] text-[#6B7280] font-semibold hover:bg-[#F6F7FD] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#12B76A] hover:bg-[#0EA05C] text-white font-semibold cursor-pointer"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
