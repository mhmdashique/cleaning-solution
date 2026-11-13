"use client";

import { useState } from "react";
import { Plus, Search, CalendarCheck, ArrowRight, Pencil, Trash2 } from "lucide-react";
import { useOpsHub } from "@/context/OpsHubContext";
import { Customer } from "@/types/opsHub";

interface CustomersViewProps {
  onOpenCustomerDetail?: (customerId: string) => void;
}

export default function CustomersView({ onOpenCustomerDetail }: CustomersViewProps) {
  const { customers, bookings, addCustomer, updateCustomer, deleteCustomer, showToast } = useOpsHub();
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [deleteCandidateId, setDeleteCandidateId] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [district, setDistrict] = useState("Thiruvananthapuram");

  const filtered = customers.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.phone.includes(q) ||
      c.email.toLowerCase().includes(q) ||
      c.id.toLowerCase().includes(q)
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      showToast("Customer name and phone number are required.", "warning");
      return;
    }

    if (editingCustomer) {
      updateCustomer(editingCustomer.id, {
        name,
        phone,
        email,
        address,
        district,
      });
      setEditingCustomer(null);
    } else {
      addCustomer({
        name,
        phone,
        email: email || `${name.toLowerCase().replace(/\s+/g, ".")}@gmail.com`,
        address: address || "Trivandrum, Kerala",
        district,
        status: "Active",
        notes: "Newly registered customer.",
      });
    }

    setName("");
    setPhone("");
    setEmail("");
    setAddress("");
    setShowAddModal(false);
  };

  const handleOpenEdit = (customer: Customer, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingCustomer(customer);
    setName(customer.name);
    setPhone(customer.phone);
    setEmail(customer.email);
    setAddress(customer.address);
    setDistrict(customer.district || "Thiruvananthapuram");
    setShowAddModal(true);
  };

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] md:text-[28px] font-bold text-[#0F1535] tracking-tight">
            Customers
          </h1>
          <p className="text-[14px] text-[#6B7280] mt-0.5">
            Manage customer directory, contact info and order history
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[10px] bg-[#12B76A] hover:bg-[#0EA05C] text-white text-[14px] font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Customer</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-[#EEF0F6] rounded-[20px] p-6 shadow-[0_4px_24px_rgba(91,91,240,0.06)] space-y-5">
        {/* Search */}
        <div className="flex items-center justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search customers by name, phone, email..."
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
                <th className="py-3.5 px-4 font-semibold">ID</th>
                <th className="py-3.5 px-4 font-semibold">Name</th>
                <th className="py-3.5 px-4 font-semibold">Phone</th>
                <th className="py-3.5 px-4 font-semibold">Email</th>
                <th className="py-3.5 px-4 font-semibold">Total Bookings</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF0F6]">
              {filtered.map((c) => {
                const totalBookingsCount = bookings.filter((b) => b.customerId === c.id).length;
                return (
                  <tr
                    key={c.id}
                    onClick={() => onOpenCustomerDetail?.(c.id)}
                    className="hover:bg-[#F6F7FD]/70 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-4 font-mono text-[13px] text-[#5B5BF0] font-semibold">
                      {c.id}
                    </td>
                    <td className="py-4 px-4 font-semibold text-[#0F1535] text-[14px]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#EEF0FF] text-[#5B5BF0] font-bold text-[13px] flex items-center justify-center shrink-0">
                          {c.name.charAt(0)}
                        </div>
                        <span className="group-hover:text-[#5B5BF0] transition-colors">{c.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-[#6B7280] text-[13px] font-mono">
                      {c.phone}
                    </td>
                    <td className="py-4 px-4 text-[#6B7280] text-[13.5px]">
                      {c.email}
                    </td>
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EEF0FF] text-[#5B5BF0] text-[12px] font-bold">
                        <CalendarCheck className="w-3 h-3" />
                        {totalBookingsCount}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold ${
                          c.status === "Active"
                            ? "bg-[#E7F8F0] text-[#12B76A]"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => onOpenCustomerDetail?.(c.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#EEF0FF] hover:bg-[#E0E4FF] text-[#5B5BF0] text-[12px] font-bold inline-flex items-center gap-1 transition-colors cursor-pointer"
                        >
                          <span>View</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleOpenEdit(c, e)}
                          title="Edit Customer"
                          className="w-8 h-8 rounded-lg hover:bg-[#EEF0FF] text-[#6B7280] hover:text-[#5B5BF0] inline-flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteCandidateId(c.id);
                          }}
                          title="Delete Customer"
                          className="w-8 h-8 rounded-lg hover:bg-rose-50 text-[#6B7280] hover:text-rose-600 inline-flex items-center justify-center transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-[#6B7280] text-[14px]">
                    No customers found matching &quot;{search}&quot;.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Customer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-[#EEF0F6] rounded-[24px] max-w-md w-full shadow-2xl p-6 space-y-5 animate-in zoom-in-95 duration-150">
            <h3 className="text-[18px] font-bold text-[#0F1535]">
              {editingCustomer ? "Edit Customer" : "Add New Customer"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4 text-[13.5px]">
              <div>
                <label className="block text-[13px] font-semibold text-[#0F1535] mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Anandhu Krishnan"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEF0F6] bg-[#F6F7FD] outline-none focus:bg-white focus:border-[#5B5BF0] text-[#0F1535]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#0F1535] mb-1">
                  Phone Number *
                </label>
                <input
                  type="text"
                  required
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEF0F6] bg-[#F6F7FD] outline-none focus:bg-white focus:border-[#5B5BF0] text-[#0F1535]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#0F1535] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="anandhu@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEF0F6] bg-[#F6F7FD] outline-none focus:bg-white focus:border-[#5B5BF0] text-[#0F1535]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#0F1535] mb-1">
                  Address
                </label>
                <textarea
                  rows={2}
                  placeholder="Flat / House name, Street, Landmark"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-[#EEF0F6] bg-[#F6F7FD] outline-none focus:bg-white focus:border-[#5B5BF0] text-[#0F1535] resize-none"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#0F1535] mb-1">
                  District / Area
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEF0F6] bg-[#F6F7FD] outline-none focus:bg-white focus:border-[#5B5BF0] text-[#0F1535]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingCustomer(null);
                  }}
                  className="px-4 py-2 rounded-xl border border-[#EEF0F6] text-[#6B7280] font-semibold hover:bg-[#F6F7FD] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#12B76A] hover:bg-[#0EA05C] text-white font-semibold cursor-pointer"
                >
                  {editingCustomer ? "Save Changes" : "Create Customer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidateId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#EEF0F6] rounded-[24px] p-6 max-w-sm w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <h3 className="text-[17px] font-bold text-[#0F1535]">Delete Customer?</h3>
            <p className="text-[13.5px] text-[#6B7280]">
              Are you sure you want to remove this customer record? All associated contact information will be deleted.
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
                  deleteCustomer(deleteCandidateId);
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
