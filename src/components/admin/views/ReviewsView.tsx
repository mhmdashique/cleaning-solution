"use client";

import { useState, useMemo } from "react";
import PageHeader from "../shared/PageHeader";
import Toolbar from "../shared/Toolbar";
import StatusPill from "../shared/StatusPill";
import ConfirmDialog from "../shared/ConfirmDialog";
import EmptyState from "../shared/EmptyState";
import { AdminReview } from "@/types/admin";
import { Star, Check, EyeOff, Trash2, MoreVertical } from "lucide-react";

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
  const [tab, setTab] = useState<"Pending" | "Approved" | "Hidden">("Pending");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Status counts
  const pendingCount = reviews.filter((r) => r.status === "Pending").length;
  const approvedCount = reviews.filter((r) => r.status === "Approved").length;
  const hiddenCount = reviews.filter((r) => r.status === "Hidden").length;
  const totalCount = reviews.length;

  // Average score & distribution
  const avgRating = totalCount > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalCount).toFixed(1)
    : "5.0";

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
      const matchesTab = r.status === tab;
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.customerName.toLowerCase().includes(q) ||
        r.comment.toLowerCase().includes(q) ||
        r.serviceName.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q);

      return matchesTab && matchesSearch;
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
    <div className="space-y-6 animate-in fade-in duration-150">
      <PageHeader
        title="Reviews"
        subtitle="Moderate genuine customer feedback and maintain service ratings"
      />

      {/* Summary Strip: Average rating, count, rating distribution bars, status counts */}
      <div className="bg-white border border-[#E3E8E5] rounded-[14px] p-5 grid grid-cols-1 md:grid-cols-12 gap-6 items-center shadow-xs">
        {/* Left: Big average score & stars */}
        <div className="md:col-span-3 border-b md:border-b-0 md:border-r border-[#E3E8E5] pb-4 md:pb-0 pr-0 md:pr-4 flex flex-col items-center sm:items-start text-center sm:text-left">
          <span className="text-[32px] font-bold text-[#12201B] leading-tight">
            {avgRating}
          </span>
          <div className="flex items-center gap-1 text-[#B57F0A] my-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-[#B57F0A]" />
            ))}
          </div>
          <span className="text-[13px] text-[#5D6B65]">
            Based on {totalCount} verified reviews
          </span>
        </div>

        {/* Center: Rating Distribution Bars */}
        <div className="md:col-span-5 space-y-1.5">
          {[5, 4, 3, 2, 1].map((stars, idx) => {
            const count = ratingCounts[idx] || 0;
            const pct = totalCount > 0 ? (count / totalCount) * 100 : 0;
            return (
              <div key={stars} className="flex items-center gap-2 text-[12px] text-[#5D6B65]">
                <span className="w-3 text-right">{stars}</span>
                <Star className="w-3 h-3 text-[#B57F0A] fill-[#B57F0A]" />
                <div className="flex-1 h-2 rounded-full bg-[#F1F4F2] overflow-hidden">
                  <div
                    style={{ width: `${pct}%` }}
                    className="h-full bg-[#0F6B54] rounded-full"
                  />
                </div>
                <span className="w-6 text-right font-mono text-[11px] text-[#12201B]">
                  {count}
                </span>
              </div>
            );
          })}
        </div>

        {/* Right: Status Counts Overview */}
        <div className="md:col-span-4 border-t md:border-t-0 md:border-l border-[#E3E8E5] pt-4 md:pt-0 pl-0 md:pl-6 grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-[10px] bg-[#F1F4F2]">
            <div className="text-[18px] font-bold text-[#B57F0A]">{pendingCount}</div>
            <div className="text-[11.5px] text-[#5D6B65]">Pending</div>
          </div>
          <div className="p-2 rounded-[10px] bg-[#F1F4F2]">
            <div className="text-[18px] font-bold text-[#0F6B54]">{approvedCount}</div>
            <div className="text-[11.5px] text-[#5D6B65]">Approved</div>
          </div>
          <div className="p-2 rounded-[10px] bg-[#F1F4F2]">
            <div className="text-[18px] font-bold text-[#5D6B65]">{hiddenCount}</div>
            <div className="text-[11.5px] text-[#5D6B65]">Hidden</div>
          </div>
        </div>
      </div>

      {/* Tabs and Toolbar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-[10px] bg-[#F1F4F2] border border-[#E3E8E5]">
            <button
              type="button"
              onClick={() => {
                setTab("Pending");
                setSelectedIds([]);
              }}
              className={`px-3 py-1.5 rounded-[8px] text-[12.5px] font-medium transition-colors cursor-pointer ${
                tab === "Pending"
                  ? "bg-white text-[#12201B] font-semibold shadow-xs"
                  : "text-[#5D6B65] hover:text-[#12201B]"
              }`}
            >
              Pending ({pendingCount})
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("Approved");
                setSelectedIds([]);
              }}
              className={`px-3 py-1.5 rounded-[8px] text-[12.5px] font-medium transition-colors cursor-pointer ${
                tab === "Approved"
                  ? "bg-white text-[#12201B] font-semibold shadow-xs"
                  : "text-[#5D6B65] hover:text-[#12201B]"
              }`}
            >
              Approved ({approvedCount})
            </button>
            <button
              type="button"
              onClick={() => {
                setTab("Hidden");
                setSelectedIds([]);
              }}
              className={`px-3 py-1.5 rounded-[8px] text-[12.5px] font-medium transition-colors cursor-pointer ${
                tab === "Hidden"
                  ? "bg-white text-[#12201B] font-semibold shadow-xs"
                  : "text-[#5D6B65] hover:text-[#12201B]"
              }`}
            >
              Hidden ({hiddenCount})
            </button>
          </div>

          {/* Bulk actions */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 text-[12.5px]">
              <span className="text-[#5D6B65]">
                {selectedIds.length} selected
              </span>
              {tab !== "Approved" && (
                <button
                  type="button"
                  onClick={() => {
                    onBulkAction(selectedIds, "approve");
                    setSelectedIds([]);
                  }}
                  className="px-2.5 py-1 rounded-[8px] bg-[#0F6B54] text-white hover:bg-[#0c5543]"
                >
                  Approve selected
                </button>
              )}
              {tab !== "Hidden" && (
                <button
                  type="button"
                  onClick={() => {
                    onBulkAction(selectedIds, "hide");
                    setSelectedIds([]);
                  }}
                  className="px-2.5 py-1 rounded-[8px] border border-[#E3E8E5] bg-white text-[#12201B] hover:bg-[#F1F4F2]"
                >
                  Hide selected
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  onBulkAction(selectedIds, "delete");
                  setSelectedIds([]);
                }}
                className="px-2.5 py-1 rounded-[8px] bg-[#DC2626]/10 text-[#DC2626] hover:bg-[#DC2626]/20"
              >
                Delete selected
              </button>
            </div>
          )}
        </div>

        <Toolbar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search reviews by customer, area, or feedback..."
        />
      </div>

      {/* Full width reviews list */}
      <div className="bg-white border border-[#E3E8E5] rounded-[14px] overflow-hidden divide-y divide-[#E3E8E5] shadow-xs">
        {filteredReviews.length === 0 ? (
          <div className="py-8">
            <EmptyState
              title={`No ${tab.toLowerCase()} reviews`}
              description="No feedback matches the selected tab and filter criteria."
            />
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:bg-[#F1F4F2]/40 transition-colors"
            >
              <div className="flex items-start gap-3.5 flex-1">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={selectedIds.includes(rev.id)}
                  onChange={() => toggleSelectOne(rev.id)}
                  aria-label={`Select review from ${rev.customerName}`}
                  className="mt-1 w-4 h-4 rounded border-[#E3E8E5] text-[#0F6B54] focus:ring-[#0F6B54] cursor-pointer"
                />

                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-[#12201B] text-[14.5px]">
                      {rev.customerName}
                    </span>
                    <span className="text-[#5D6B65] text-[13px]">·</span>
                    <span className="text-[13px] text-[#5D6B65]">
                      {rev.location}
                    </span>
                    <span className="text-[#5D6B65] text-[13px]">·</span>
                    <span className="text-[12px] text-[#5D6B65]">
                      {rev.createdAt}
                    </span>
                    <span className="text-[12px] px-2 py-0.5 rounded-full bg-[#E3F2EC] text-[#0F6B54] font-medium border border-[#0F6B54]/20">
                      {rev.serviceName}
                    </span>
                  </div>

                  {/* Star Rating */}
                  <div className="flex items-center gap-1 text-[#B57F0A]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? "fill-[#B57F0A]" : "text-[#E3E8E5]"
                        }`}
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-[13.5px] text-[#12201B] leading-relaxed pt-0.5">
                    “{rev.comment}”
                  </p>
                </div>
              </div>

              {/* Action buttons on the right */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                {rev.status !== "Approved" && (
                  <button
                    type="button"
                    onClick={() => onApprove(rev.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[8px] bg-[#0F6B54] text-white hover:bg-[#0c5543] text-[12.5px] font-medium transition-colors"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                )}

                {rev.status !== "Hidden" && (
                  <button
                    type="button"
                    onClick={() => onHide(rev.id)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-[8px] border border-[#E3E8E5] text-[#12201B] hover:bg-[#F1F4F2] text-[12.5px] font-medium transition-colors"
                  >
                    <EyeOff className="w-3.5 h-3.5 text-[#5D6B65]" />
                    <span>Hide</span>
                  </button>
                )}

                {/* Overflow menu with delete */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setActiveMenuId(activeMenuId === rev.id ? null : rev.id)}
                    className="p-1.5 rounded-[8px] border border-[#E3E8E5] text-[#5D6B65] hover:text-[#12201B] hover:bg-[#F1F4F2]"
                    aria-label="More options"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {activeMenuId === rev.id && (
                    <div className="absolute right-0 top-8 w-32 rounded-[10px] bg-white border border-[#E3E8E5] shadow-lg z-20 py-1 text-[12.5px]">
                      <button
                        type="button"
                        onClick={() => {
                          setActiveMenuId(null);
                          setDeleteReviewId(rev.id);
                        }}
                        className="w-full text-left px-3 py-1.5 hover:bg-[#DC2626]/10 text-[#DC2626] font-medium flex items-center gap-2"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Review Confirm Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteReviewId)}
        title="Delete customer review"
        description="Are you sure you want to delete this customer feedback? This operation cannot be undone."
        confirmLabel="Delete review"
        onConfirm={() => {
          if (deleteReviewId) onDeleteReview(deleteReviewId);
          setDeleteReviewId(null);
        }}
        onCancel={() => setDeleteReviewId(null)}
      />
    </div>
  );
}
