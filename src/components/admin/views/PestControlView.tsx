"use client";

import { useState } from "react";
import { Plus, Search, X } from "lucide-react";
import { useOpsHub } from "@/context/OpsHubContext";

export default function PestControlView() {
  const { pestPlans, addPestPlan, updatePestPlan } = useOpsHub();
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // Form
  const [type, setType] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("800");
  const [warranty, setWarranty] = useState("3");

  const filtered = pestPlans.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return p.type.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type.trim()) return;

    addPestPlan({
      type,
      description: desc || "Comprehensive chemical eradication and pest control treatment",
      price: Number(price) || 800,
      warrantyMonths: Number(warranty) || 3,
      status: "Active",
    });

    setType("");
    setDesc("");
    setPrice("800");
    setWarranty("3");
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold text-[#0F1535] tracking-tight">Pest Control</h1>
          <p className="text-[14px] text-[#6B7280] mt-0.5">Manage pest eradication plans &amp; treatment packages</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[10px] bg-[#12B76A] hover:bg-[#0EA05C] text-white text-[14px] font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Plan</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-[#EEF0F6] rounded-[20px] p-6 shadow-[0_4px_24px_rgba(91,91,240,0.06)] space-y-5">
        <div className="flex items-center justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search pest plans..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-[#F6F7FD] border border-[#EEF0F6] text-[13px] text-[#0F1535] placeholder:text-[#9CA3AF] outline-none focus:border-[#5B5BF0] focus:bg-white focus:ring-2 focus:ring-[#5B5BF0]/10 transition-all w-full"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-xl border border-[#EEF0F6]">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#F8F9FC] text-[#6B7280] text-[12.5px] font-semibold border-b border-[#EEF0F6]">
                <th className="py-3.5 px-4 font-semibold">#</th>
                <th className="py-3.5 px-4 font-semibold">Service Type</th>
                <th className="py-3.5 px-4 font-semibold">Description</th>
                <th className="py-3.5 px-4 font-semibold">Warranty</th>
                <th className="py-3.5 px-4 font-semibold">Price</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF0F6]">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-[#F6F7FD]/70 transition-colors">
                  <td className="py-4 px-4 font-mono text-[13px] font-semibold text-[#5B5BF0]">
                    {p.id}
                  </td>
                  <td className="py-4 px-4 font-semibold text-[#0F1535] text-[14px]">
                    {p.type}
                  </td>
                  <td className="py-4 px-4 text-[#6B7280] text-[13px] max-w-md">
                    {p.description}
                  </td>
                  <td className="py-4 px-4 text-[#6B7280] text-[13px]">
                    {p.warrantyMonths} Months
                  </td>
                  <td className="py-4 px-4 font-bold text-[#0F1535] text-[14px]">
                    ₹{p.price.toLocaleString("en-IN")}
                  </td>
                  <td className="py-4 px-4">
                    <button
                      type="button"
                      onClick={() => updatePestPlan(p.id, { status: p.status === "Active" ? "Inactive" : "Active" })}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold cursor-pointer transition-colors ${
                        p.status === "Active"
                          ? "bg-[#E7F8F0] text-[#12B76A]"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {p.status}
                    </button>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <button
                      type="button"
                      aria-label="Actions"
                      className="w-8 h-8 rounded-lg hover:bg-[#EEF0FF] text-[#6B7280] hover:text-[#5B5BF0] inline-flex items-center justify-center transition-colors cursor-pointer"
                    >
                      ···
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Plan Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#EEF0F6] rounded-[20px] p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#EEF0F6] pb-3">
              <h2 className="text-[17px] font-bold text-[#0F1535]">Add Pest Plan</h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="p-1 text-[#6B7280] hover:text-[#0F1535] rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 text-[13.5px]">
              <div>
                <label className="block text-[#0F1535] font-semibold mb-1">Plan / Treatment Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Bedbug Thermal Eradication"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F7FD] border border-[#EEF0F6] text-[#0F1535] outline-none focus:border-[#5B5BF0] focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-[#0F1535] font-semibold mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Treatment scope and chemical warranty specifications..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F7FD] border border-[#EEF0F6] text-[#0F1535] outline-none focus:border-[#5B5BF0] focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#0F1535] font-semibold mb-1">Price (₹)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F7FD] border border-[#EEF0F6] text-[#0F1535] outline-none focus:border-[#5B5BF0] focus:bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[#0F1535] font-semibold mb-1">Warranty (Months)</label>
                  <input
                    type="number"
                    value={warranty}
                    onChange={(e) => setWarranty(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#F6F7FD] border border-[#EEF0F6] text-[#0F1535] outline-none focus:border-[#5B5BF0] focus:bg-white font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#EEF0F6]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-[#6B7280] font-semibold hover:bg-[#F6F7FD]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#12B76A] hover:bg-[#0EA05C] text-white font-bold transition-all shadow-xs"
                >
                  Create Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
