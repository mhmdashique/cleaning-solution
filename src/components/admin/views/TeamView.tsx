"use client";

import { useState } from "react";
import { Plus, Search, Phone, Mail, Trash2, X, Shield, Award, Pencil } from "lucide-react";
import { useOpsHub } from "@/context/OpsHubContext";
import { TeamMember } from "@/types/opsHub";

export default function TeamView() {
  const { team, addTeamMember, updateTeamMember, deleteTeamMember } = useOpsHub();
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  // Form state
  const [name, setName] = useState("");
  const [role, setRole] = useState<"Manager" | "Support" | "Technician" | "Cleaner">("Technician");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const filtered = team.filter((m) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return m.name.toLowerCase().includes(q) || m.role.toLowerCase().includes(q) || m.phone.includes(q) || m.email.toLowerCase().includes(q);
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingMember) {
      updateTeamMember(editingMember.id, {
        name,
        role,
        phone: phone || "+91 98460 11223",
        email: email || `${name.toLowerCase().replace(/\s+/g, ".")}@planc.com`,
      });
      setEditingMember(null);
    } else {
      addTeamMember({
        name,
        role,
        phone: phone || "+91 98460 11223",
        email: email || `${name.toLowerCase().replace(/\s+/g, ".")}@planc.com`,
        status: "Active",
      });
    }

    setName("");
    setPhone("");
    setEmail("");
    setShowAddModal(false);
  };

  const handleOpenEdit = (member: TeamMember) => {
    setEditingMember(member);
    setName(member.name);
    setRole(member.role);
    setPhone(member.phone);
    setEmail(member.email);
    setShowAddModal(true);
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "Manager":
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-bold bg-[#F5F3FF] text-[#8B5CF6]">Manager</span>;
      case "Support":
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-bold bg-[#EFF8FF] text-[#3B82F6]">Support</span>;
      case "Technician":
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-bold bg-[#ECFDF3] text-[#12B76A]">Technician</span>;
      case "Cleaner":
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-bold bg-[#FFF4E5] text-[#F79009]">Cleaner</span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-bold bg-gray-100 text-gray-700">{role}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] md:text-[28px] font-bold text-[#0F1535] tracking-tight">Team</h1>
          <p className="text-[14px] text-[#6B7280] mt-0.5">Staff directory, technician assignments and roles</p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[10px] bg-[#12B76A] hover:bg-[#0EA05C] text-white text-[14px] font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Member</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-[#EEF0F6] rounded-[20px] p-6 shadow-[0_4px_24px_rgba(91,91,240,0.06)] space-y-5">
        <div className="flex items-center justify-between">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search team members by name or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl bg-[#F6F7FD] border border-[#EEF0F6] text-[13px] text-[#0F1535] placeholder:text-[#9CA3AF] outline-none focus:border-[#5B5BF0] focus:bg-white focus:ring-2 focus:ring-[#5B5BF0]/10 transition-all w-full"
            />
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-xl border border-[#EEF0F6]">
          <table className="w-full text-left border-collapse min-w-[650px]">
            <thead>
              <tr className="bg-[#F8F9FC] text-[#6B7280] text-[12.5px] font-semibold border-b border-[#EEF0F6]">
                <th className="py-3.5 px-4 font-semibold">#</th>
                <th className="py-3.5 px-4 font-semibold">Name</th>
                <th className="py-3.5 px-4 font-semibold">Role</th>
                <th className="py-3.5 px-4 font-semibold">Contact Info</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF0F6]">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-[#F6F7FD]/70 transition-colors">
                  <td className="py-4 px-4 font-mono text-[13px] text-[#5B5BF0] font-semibold">
                    {m.id}
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#EEF0FF] text-[#5B5BF0] font-bold text-[13.5px] flex items-center justify-center">
                        {m.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-[#0F1535] text-[14px]">{m.name}</div>
                        <div className="text-[12px] text-[#6B7280]">Joined {m.joinedAt}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    {getRoleBadge(m.role)}
                  </td>
                  <td className="py-4 px-4 text-[#6B7280] text-[13px]">
                    <div className="font-mono text-[#0F1535]">{m.phone}</div>
                    <div className="text-[12px]">{m.email}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-[12px] font-semibold bg-[#E7F8F0] text-[#12B76A]">
                      {m.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(m)}
                        className="w-8 h-8 rounded-lg hover:bg-[#EEF0FF] text-[#6B7280] hover:text-[#5B5BF0] inline-flex items-center justify-center transition-colors cursor-pointer"
                        title="Edit member"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteTeamMember(m.id)}
                        className="w-8 h-8 rounded-lg hover:bg-[#FEE4E2] text-[#6B7280] hover:text-[#F04438] inline-flex items-center justify-center transition-colors cursor-pointer"
                        title="Remove member"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Member Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-[#EEF0F6] rounded-[24px] max-w-md w-full shadow-2xl p-6 sm:p-7 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#EEF0F6] pb-3">
              <h3 className="text-[19px] font-bold text-[#0F1535]">
                {editingMember ? "Edit Team Member" : "Add Team Member"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingMember(null);
                }}
                className="w-8 h-8 rounded-full bg-[#F6F7FD] hover:bg-[#EEF0FF] text-[#6B7280] flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#0F1535] mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Suresh G"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F6F7FD] border border-[#EEF0F6] text-[14px] text-[#0F1535] outline-none focus:border-[#5B5BF0] focus:bg-white focus:ring-2 focus:ring-[#5B5BF0]/10 transition-all"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#0F1535] mb-1">Operational Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F6F7FD] border border-[#EEF0F6] text-[14px] text-[#0F1535] outline-none focus:border-[#5B5BF0] focus:bg-white focus:ring-2 focus:ring-[#5B5BF0]/10 transition-all cursor-pointer"
                >
                  <option value="Technician">Technician (Pest &amp; Deep Clean Specialist)</option>
                  <option value="Cleaner">Cleaner (Residential &amp; Commercial)</option>
                  <option value="Support">Support (Customer Dispatch &amp; QA)</option>
                  <option value="Manager">Manager (Operations Lead)</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#0F1535] mb-1">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98460 77889"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F6F7FD] border border-[#EEF0F6] text-[14px] text-[#0F1535] outline-none focus:border-[#5B5BF0] focus:bg-white focus:ring-2 focus:ring-[#5B5BF0]/10 transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#0F1535] mb-1">Email</label>
                <input
                  type="email"
                  placeholder="name@planc.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#F6F7FD] border border-[#EEF0F6] text-[14px] text-[#0F1535] outline-none focus:border-[#5B5BF0] focus:bg-white focus:ring-2 focus:ring-[#5B5BF0]/10 transition-all"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-[#EEF0F6]">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingMember(null);
                  }}
                  className="px-5 py-2.5 rounded-xl border border-[#EEF0F6] bg-white text-[#6B7280] hover:bg-[#F6F7FD] text-[14px] font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#12B76A] hover:bg-[#0EA05C] text-white text-[14px] font-semibold shadow-xs cursor-pointer"
                >
                  {editingMember ? "Save Changes" : "Add Member"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
