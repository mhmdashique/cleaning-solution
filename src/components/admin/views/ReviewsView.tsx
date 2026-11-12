"use client";

import { useState, useMemo } from "react";
import { Star, Check, Clock, EyeOff, Trash2, Search, CheckCheck } from "lucide-react";
import { AdminReview } from "@/types/admin";

interface ReviewsViewProps {
  reviews: AdminReview[];
  onApprove: (id: string) => void;
  onHide: (id: string) => void;
  onDeleteReview: (id: string) => void;
  onBulkAction: (ids: string[], action: "approve" | "hide" | "delete") => void;
}

export default function ReviewsView({
  reviews,
  onApprove,
  onHide,
  onDeleteReview,
  onBulkAction,
}: ReviewsViewProps) {
  const [tab, setTab] = useState<"All" | "Pending" | "Approved" | "Hidden">("All");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);

  // Status counts
  const pendingCount = reviews.filter((r) => r.status === "Pending").length;
  const approvedCount = reviews.filter((r) => r.status === "Approved").length;
  const hiddenCount = reviews.filter((r) => r.status === "Hidden").length;
  const totalCount = reviews.length;

  const averageScore =
    totalCount > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / totalCount : null;
  const avgRating = averageScore !== null ? averageScore.toFixed(1) : "5.0";

  const ratingCounts = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    reviews.forEach((r) => {
      const idx = Math.min(Math.max(r.rating - 1, 0), 4);
      counts[idx]++;
    });
    return counts.reverse(); // 5-star to 1-star
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (tab !== "All" && r.status !== tab) return false;
      const q = search.toLowerCase().trim();
      if (!q) return true;
      return (
        r.customerName.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q) ||
        r.serviceName.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q)
      );
    });
  }, [reviews, tab, search]);

  const handleSelectAll = () => {
    if (selectedIds.length === filteredReviews.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredReviews.map((r) => r.id));
    }
  };

  const toggleSelectOne = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] md:text-[28px] font-bold text-[#0F1535] tracking-tight">
            Customer Reviews
          </h1>
          <p className="text-[14px] text-[#6B7280] mt-0.5">
            Moderate genuine customer feedback, service ratings and testimonials
          </p>
        </div>

        {pendingCount > 0 && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFF4E5] text-[#F79009] text-[13px] font-bold">
            <Clock className="w-4 h-4" />
            <span>{pendingCount} review{pendingCount !== 1 ? "s" : ""} pending approval</span>
          </div>
        )}
      </div>

      {/* KPI & Rating Summary Card */}
      <div className="bg-white border border-[#EEF0F6] rounded-[20px] p-6 shadow-[0_4px_24px_rgba(91,91,240,0.06)] grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left: Overall rating */}
        <div className="md:col-span-3 border-b md:border-b-0 md:border-r border-[#EEF0F6] pb-5 md:pb-0 pr-0 md:pr-6 flex flex-col items-center sm:items-start text-center sm:text-left">
          <span className="text-[36px] font-bold text-[#0F1535] leading-none tracking-tight">
            {avgRating}
          </span>
          <div className="flex items-center gap-1 text-[#F79009] my-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(Number(avgRating)) ? "fill-[#F79009] text-[#F79009]" : "text-[#EEF0F6]"
                }`}
              />
            ))}
          </div>
          <span className="text-[13px] text-[#6B7280]">
            Based on {totalCount} verified review{totalCount !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Center: Rating Distribution Bars */}
        <div className="md:col-span-5 space-y-2">
          {[5, 4, 3, 2, 1].map((stars, idx) => {
            const count = ratingCounts[idx] || 0;
            const pct = totalCount > 0 ? (count / totalCount) * 100 : 0;
            return (
              <div key={stars} className="flex items-center gap-2.5 text-[12.5px] text-[#6B7280]">
                <span className="w-3 text-right font-semibold">{stars}</span>
                <Star className="w-3.5 h-3.5 text-[#F79009] fill-[#F79009]" />
                <div className="flex-1 h-2 rounded-full bg-[#F6F7FD] overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className="h-full bg-[#12B76A] rounded-full transition-all"
                  />
                </div>
                <span className="w-6 text-right font-mono text-[11.5px] text-[#0F1535]">
                  {count}
                </span>
              </div>
            );
          })}
        </div>

        {/* Right: Quick Stats breakdown */}
        <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-[#EEF0F6] pt-5 md:pt-0 pl-0 md:pl-6 grid grid-cols-3 gap-2.5 text-center">
          <div className="p-3 rounded-xl bg-[#FFF4E5]/50 border border-[#FFE8CC]">
            <div className="text-[20px] font-bold text-[#F79009]">{pendingCount}</div>
            <div className="text-[12px] font-semibold text-[#6B7280] mt-0.5">Pending</div>
          </div>
          <div className="p-3 rounded-xl bg-[#E7F8F0]/60 border border-[#D1FADF]">
            <div className="text-[20px] font-bold text-[#12B76A]">{approvedCount}</div>
            <div className="text-[12px] font-semibold text-[#6B7280] mt-0.5">Approved</div>
          </div>
          <div className="p-3 rounded-xl bg-[#F6F7FD] border border-[#EEF0F6]">
            <div className="text-[20px] font-bold text-[#6B7280]">{hiddenCount}</div>
            <div className="text-[12px] font-semibold text-[#6B7280] mt-0.5">Hidden</div>
          </div>
        </div>
      </div>

      {/* Main Reviews List Card */}
      <div className="bg-white border border-[#EEF0F6] rounded-[20px] p-6 shadow-[0_4px_24px_rgba(91,91,240,0.06)] space-y-5">
        {/* Controls: Search + Filter Tabs + Bulk actions */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search reviews by name, comment, location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 rounded-xl bg-[#F6F7FD] border border-[#EEF0F6] text-[13px] text-[#0F1535] placeholder:text-[#9CA3AF] outline-none focus:border-[#5B5BF0] focus:bg-white focus:ring-2 focus:ring-[#5B5BF0]/10 transition-all w-full"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-[#F6F7FD] border border-[#EEF0F6]">
              {(["All", "Pending", "Approved", "Hidden"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setTab(t);
                    setSelectedIds([]);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-[12.5px] font-semibold transition-all cursor-pointer ${
                    tab === t
                      ? "bg-[#5B5BF0] text-white shadow-xs"
                      : "text-[#6B7280] hover:text-[#0F1535]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            {selectedIds.length > 0 && (
              <div className="flex items-center gap-2 text-[12.5px] pl-2">
                <span className="text-[#6B7280] font-semibold">{selectedIds.length} selected</span>
                <button
                  type="button"
                  onClick={() => {
                    onBulkAction(selectedIds, "approve");
                    setSelectedIds([]);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#12B76A] text-white font-semibold hover:bg-[#0EA05C] cursor-pointer"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onBulkAction(selectedIds, "hide");
                    setSelectedIds([]);
                  }}
                  className="px-3 py-1.5 rounded-lg border border-[#EEF0F6] bg-white text-[#6B7280] hover:text-[#0F1535] font-semibold cursor-pointer"
                >
                  Hide
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-3.5">
          {filteredReviews.map((r) => {
            const isSelected = selectedIds.includes(r.id);
            return (
              <div
                key={r.id}
                className={`p-5 rounded-[16px] border transition-all ${
                  isSelected
                    ? "bg-[#EEF0FF]/40 border-[#5B5BF0]"
                    : "bg-white border-[#EEF0F6] hover:border-[#5B5BF0]/30 hover:shadow-sm"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  {/* Left: Customer & Review info */}
                  <div className="flex items-start gap-3.5 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectOne(r.id)}
                      className="mt-1 w-4 h-4 rounded text-[#5B5BF0] focus:ring-[#5B5BF0] cursor-pointer accent-[#5B5BF0]"
                    />

                    <div className="w-10 h-10 rounded-full bg-[#EEF0FF] text-[#5B5BF0] font-bold text-[14px] flex items-center justify-center shrink-0">
                      {r.customerName.charAt(0)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-[15px] text-[#0F1535]">
                          {r.customerName}
                        </span>
                        <span className="text-[12.5px] text-[#6B7280]">
                          · {r.location}
                        </span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            r.status === "Approved"
                              ? "bg-[#E7F8F0] text-[#12B76A]"
                              : r.status === "Pending"
                              ? "bg-[#FFF4E5] text-[#F79009]"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {r.status}
                        </span>
                      </div>

                      {/* Stars & Service */}
                      <div className="flex items-center gap-3 my-1.5 flex-wrap">
                        <div className="flex items-center gap-0.5 text-[#F79009]">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${
                                i < r.rating
                                  ? "fill-[#F79009] text-[#F79009]"
                                  : "text-[#EEF0F6]"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-[12px] font-medium text-[#5B5BF0] bg-[#EEF0FF] px-2.5 py-0.5 rounded-full">
                          {r.serviceName}
                        </span>
                        <span className="text-[12px] text-[#9CA3AF]">
                          {r.createdAt}
                        </span>
                      </div>

                      {/* Comment */}
                      <p className="text-[13.5px] text-[#374151] leading-relaxed mt-2">
                        &ldquo;{r.comment}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-start">
                    {r.status !== "Approved" && (
                      <button
                        type="button"
                        onClick={() => onApprove(r.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E7F8F0] hover:bg-[#d5f5e4] text-[#12B76A] text-[12.5px] font-semibold transition-colors cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                    )}

                    {r.status !== "Hidden" && (
                      <button
                        type="button"
                        onClick={() => onHide(r.id)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F6F7FD] hover:bg-[#EEF0FF] text-[#6B7280] hover:text-[#5B5BF0] text-[12.5px] font-semibold transition-colors cursor-pointer"
                      >
                        <EyeOff className="w-3.5 h-3.5" />
                        <span>Hide</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => setDeleteCandidateId(r.id)}
                      className="w-8 h-8 rounded-lg hover:bg-rose-50 text-[#6B7280] hover:text-rose-600 inline-flex items-center justify-center transition-colors cursor-pointer"
                      title="Delete review"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredReviews.length === 0 && (
            <div className="py-12 text-center text-[#6B7280] text-[14px]">
              No reviews found matching current filter.
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteCandidateId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#EEF0F6] rounded-[24px] p-6 max-w-sm w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <h3 className="text-[17px] font-bold text-[#0F1535]">Delete Review?</h3>
            <p className="text-[13.5px] text-[#6B7280]">
              This review will be permanently deleted from the feedback repository.
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteCandidateId(null)}
                className="px-4 py-2 rounded-xl border border-[#EEF0F6] text-[#6B7280] font-semibold hover:bg-[#F6F7FD] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteReview(deleteCandidateId);
                  setDeleteCandidateId(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
