"use client";

import { useState } from "react";
import { Download, Search, CheckCircle2, Clock } from "lucide-react";
import { useOpsHub } from "@/context/OpsHubContext";

export default function PaymentsView() {
  const { payments, customers, updatePaymentStatus } = useOpsHub();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = payments.filter((p) => {
    if (statusFilter !== "All" && p.status !== statusFilter) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const cust = customers.find((c) => c.id === p.customerId)?.name.toLowerCase() || "";
    return p.id.toLowerCase().includes(q) || cust.includes(q) || p.method.toLowerCase().includes(q);
  });

  const totalReceived = payments.filter((p) => p.status === "Paid").reduce((sum, p) => sum + p.amount, 0);
  const totalPending = payments.filter((p) => p.status === "Pending").reduce((sum, p) => sum + p.amount, 0);

  const handleExportCsv = () => {
    const headers = ["Invoice ID", "Booking ID", "Customer", "Amount", "Method", "Status", "Date"];
    const rows = filtered.map((p) => [
      p.id,
      p.bookingId,
      `"${customers.find((c) => c.id === p.customerId)?.name || "Customer"}"`,
      p.amount,
      p.method,
      p.status,
      p.date,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const encoded = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encoded);
    link.setAttribute("download", `plan_c_invoices_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#0F1535] tracking-tight">Payments</h1>
          <p className="text-[14px] text-[#6B7280] mt-0.5">Track customer invoices, collections and payment methods</p>
        </div>
        <button
          type="button"
          onClick={handleExportCsv}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[10px] bg-[#12B76A] hover:bg-[#0EA05C] text-white text-[14px] font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* Totals Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-[#EEF0F6] rounded-[20px] p-5 shadow-[0_4px_24px_rgba(91,91,240,0.06)] flex items-center justify-between">
          <div>
            <span className="text-[13px] text-[#6B7280] font-medium">Total Received (Paid)</span>
            <div className="text-[26px] font-bold text-[#12B76A] mt-1 font-mono">
              ₹{totalReceived.toLocaleString("en-IN")}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#E7F8F0] text-[#12B76A] flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white border border-[#EEF0F6] rounded-[20px] p-5 shadow-[0_4px_24px_rgba(91,91,240,0.06)] flex items-center justify-between">
          <div>
            <span className="text-[13px] text-[#6B7280] font-medium">Pending Collections</span>
            <div className="text-[26px] font-bold text-[#F79009] mt-1 font-mono">
              ₹{totalPending.toLocaleString("en-IN")}
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#FFF4E5] text-[#F79009] flex items-center justify-center">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-[#EEF0F6] rounded-[20px] p-6 shadow-[0_4px_24px_rgba(91,91,240,0.06)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search invoices by customer, ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-[#F6F7FD] border border-[#EEF0F6] text-[13px] text-[#0F1535] placeholder:text-[#9CA3AF] outline-none focus:border-[#5B5BF0] focus:bg-white focus:ring-2 focus:ring-[#5B5BF0]/10 transition-all w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3.5 py-2 rounded-xl bg-[#F6F7FD] border border-[#EEF0F6] text-[13px] text-[#0F1535] font-medium outline-none cursor-pointer"
            >
              <option value="All">All Invoices</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Refunded">Refunded</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-xl border border-[#EEF0F6]">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#F8F9FC] text-[#6B7280] text-[12.5px] font-semibold border-b border-[#EEF0F6]">
                <th className="py-3.5 px-4 font-semibold">Invoice #</th>
                <th className="py-3.5 px-4 font-semibold">Booking</th>
                <th className="py-3.5 px-4 font-semibold">Customer</th>
                <th className="py-3.5 px-4 font-semibold">Amount</th>
                <th className="py-3.5 px-4 font-semibold">Method</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold">Date</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF0F6]">
              {filtered.map((row) => {
                const customer = customers.find((c) => c.id === row.customerId);
                return (
                  <tr key={row.id} className="hover:bg-[#F6F7FD]/70 transition-colors">
                    <td className="py-4 px-4 font-mono text-[13px] font-semibold text-[#5B5BF0]">
                      {row.id}
                    </td>
                    <td className="py-4 px-4 font-mono text-[13px] text-[#6B7280]">
                      {row.bookingId}
                    </td>
                    <td className="py-4 px-4 font-semibold text-[#0F1535] text-[14px]">
                      {customer?.name || "Customer"}
                    </td>
                    <td className="py-4 px-4 font-bold text-[#0F1535] text-[14px]">
                      ₹{row.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="py-4 px-4 text-[#6B7280] text-[13px]">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#F6F7FD] border border-[#EEF0F6] text-[#0F1535] text-[12px] font-medium">
                        {row.method}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      {row.status === "Paid" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold bg-[#E7F8F0] text-[#12B76A]">
                          Paid
                        </span>
                      ) : row.status === "Pending" ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold bg-[#FFF4E5] text-[#F79009]">
                          Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold bg-[#FEE4E2] text-[#F04438]">
                          Refunded
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-[#6B7280] text-[13px] font-mono">
                      {row.date}
                    </td>
                    <td className="py-4 px-4 text-right">
                      {row.status === "Pending" ? (
                        <button
                          type="button"
                          onClick={() => updatePaymentStatus(row.id, "Paid")}
                          className="px-3 py-1 rounded-lg bg-[#12B76A] hover:bg-[#0EA05C] text-white text-[12px] font-semibold transition-colors cursor-pointer"
                        >
                          Mark as Paid
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => window.print()}
                          className="px-3 py-1 rounded-lg border border-[#EEF0F6] text-[#0F1535] hover:bg-[#F6F7FD] text-[12px] font-medium transition-colors"
                        >
                          Print
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
