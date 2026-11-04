"use client";

import { ReactNode } from "react";
import EmptyState from "./EmptyState";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => ReactNode;
  align?: "left" | "right" | "center";
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
  currentPage?: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  onRowClick?: (item: T) => void;
}

export default function DataTable<T extends { id: string | number }>({
  columns,
  data,
  isLoading = false,
  emptyTitle = "No records found",
  emptyDescription = "Try adjusting your search query or filter options.",
  emptyAction,
  currentPage = 1,
  pageSize = 20,
  totalItems = 0,
  onPageChange,
  onRowClick,
}: DataTableProps<T>) {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  return (
    <div className="bg-white border border-[#E3E8E5] rounded-[14px] overflow-hidden flex flex-col shadow-xs">
      {/* Table container with horizontal scroll */}
      <div className="overflow-x-auto w-full">
        <table className="w-full text-left text-[14px] border-collapse min-w-[640px]">
          <thead className="bg-[#F1F4F2] text-[#5D6B65] border-b border-[#E3E8E5]">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  scope="col"
                  className={`py-3 px-4 font-semibold text-[13px] ${
                    col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                  } ${col.className || ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E3E8E5]">
            {isLoading ? (
              // Skeleton rows
              Array.from({ length: 5 }).map((_, rIdx) => (
                <tr key={rIdx} className="animate-pulse">
                  {columns.map((_, cIdx) => (
                    <td key={cIdx} className="py-4 px-4">
                      <div className="h-4 bg-[#F1F4F2] rounded w-3/4" />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-8">
                  <EmptyState
                    title={emptyTitle}
                    description={emptyDescription}
                    action={emptyAction}
                  />
                </td>
              </tr>
            ) : (
              data.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => onRowClick?.(item)}
                  className={`hover:bg-[#F1F4F2]/70 transition-colors ${
                    onRowClick ? "cursor-pointer" : ""
                  }`}
                >
                  {columns.map((col, cIdx) => (
                    <td
                      key={cIdx}
                      className={`py-3.5 px-4 text-[#12201B] ${
                        col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                      } ${col.className || ""}`}
                    >
                      {col.cell ? col.cell(item) : col.accessorKey ? String(item[col.accessorKey]) : null}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && totalItems > 0 && (
        <div className="p-3.5 px-4 border-t border-[#E3E8E5] bg-[#F1F4F2]/40 flex flex-col sm:flex-row items-center justify-between gap-3 text-[13px] text-[#5D6B65]">
          <span>
            Showing <strong className="font-semibold text-[#12201B]">{startItem}</strong> to{" "}
            <strong className="font-semibold text-[#12201B]">{endItem}</strong> of{" "}
            <strong className="font-semibold text-[#12201B]">{totalItems}</strong> entries
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => onPageChange?.(currentPage - 1)}
              className="p-1.5 rounded-[8px] border border-[#E3E8E5] text-[#12201B] hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-2 text-xs font-medium">
              Page {currentPage} of {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange?.(currentPage + 1)}
              className="p-1.5 rounded-[8px] border border-[#E3E8E5] text-[#12201B] hover:bg-white disabled:opacity-30 disabled:pointer-events-none transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
