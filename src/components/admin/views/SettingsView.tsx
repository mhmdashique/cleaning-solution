"use client";

import { useState } from "react";
import { UploadCloud, Building2, Sliders, Bell, Share2, Shield, CreditCard, RotateCcw } from "lucide-react";
import { useOpsHub } from "@/context/OpsHubContext";
import { updateSiteSettingsAdminAction } from "@/app/actions/admin";

export default function SettingsView() {
  const { settings, updateSettings, resetAllData, showToast } = useOpsHub();
  const [activeMenu, setActiveMenu] = useState("profile");

  const [form, setForm] = useState({
    businessName: settings.businessName || "PLAN C Cleaning Solutions",
    phone: settings.phone || "+91 79943 42372",
    email: settings.email || "contact@plancsolutions.in",
    address: settings.address || "Thrikannapuram, Thiruvananthapuram, Kerala - 695032",
    currency: settings.currency || "INR (₹)",
    taxPercent: settings.taxPercent || 18,
    bookingLeadHours: settings.bookingLeadHours || 4,
  });

  const menuItems = [
    { id: "profile", label: "Business Profile", icon: Building2 },
    { id: "general", label: "General & Tax", icon: Sliders },
    { id: "notifications", label: "Notification Prefs", icon: Bell },
    { id: "integrations", label: "Integrations & API", icon: Share2 },
    { id: "security", label: "Security & Data", icon: Shield },
    { id: "billing", label: "Billing & Plans", icon: CreditCard },
  ];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.businessName.trim() || !form.phone.trim() || !form.email.trim()) {
      showToast("Business name, phone, and email are required.", "warning");
      return;
    }
    try {
      const result = await updateSiteSettingsAdminAction({
        company_name: form.businessName,
        phone: form.phone.replace(/[^0-9]/g, ""),
        phone_display: form.phone,
        email: form.email,
        address: form.address,
      });
      if (!result.success) {
        showToast(result.error || "Could not save settings.", "error");
        return;
      }
      updateSettings(form);
      showToast("Settings saved successfully.");
    } catch (err) {
      console.error("Could not sync to server site settings", err);
      showToast("Could not save settings. Please try again.", "error");
    }
  };

  const handleReset = () => {
    if (confirm("Reset all operations data to initial seed records? This will clear any local edits.")) {
      resetAllData();
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] md:text-[28px] font-bold text-[#0F1535] tracking-tight">Settings</h1>
          <p className="text-[14px] text-[#6B7280] mt-0.5">Manage business profile, team preferences and operational configurations</p>
        </div>

      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left inner menu (3 cols) */}
        <div className="lg:col-span-3 bg-white border border-[#EEF0F6] rounded-[20px] p-3 shadow-[0_4px_24px_rgba(91,91,240,0.06)] space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeMenu === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveMenu(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13.5px] font-medium transition-colors text-left cursor-pointer ${
                  isActive
                    ? "bg-[#EEF0FF] text-[#5B5BF0] font-semibold"
                    : "text-[#6B7280] hover:text-[#0F1535] hover:bg-[#F6F7FD]"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-[#5B5BF0]" : "text-[#6B7280]"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right Form Card (9 cols) */}
        <div className="lg:col-span-9 bg-white border border-[#EEF0F6] rounded-[20px] p-6 sm:p-7 shadow-[0_4px_24px_rgba(91,91,240,0.06)] space-y-6">
          <div className="border-b border-[#EEF0F6] pb-4">
            <h2 className="text-[18px] font-bold text-[#0F1535]">
              {menuItems.find((m) => m.id === activeMenu)?.label || "Configuration"}
            </h2>
            <p className="text-[13px] text-[#6B7280] mt-0.5">Update operational settings and system parameters</p>
          </div>

          <form className="space-y-5" onSubmit={handleSave}>
            {activeMenu === "profile" && (
              <>
                {/* Business Name */}
                <div>
                  <label className="block text-[13px] font-semibold text-[#0F1535] mb-1.5">Business Name</label>
                  <input
                    type="text"
                    value={form.businessName}
                    onChange={(e) => setForm({ ...form, businessName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6F7FD] border border-[#EEF0F6] text-[14px] text-[#0F1535] outline-none focus:border-[#5B5BF0] focus:bg-white focus:ring-2 focus:ring-[#5B5BF0]/10 transition-all"
                  />
                </div>

                {/* Phone & Email side by side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#0F1535] mb-1.5">Dispatch Phone</label>
                    <input
                      type="text"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F6F7FD] border border-[#EEF0F6] text-[14px] text-[#0F1535] outline-none focus:border-[#5B5BF0] focus:bg-white focus:ring-2 focus:ring-[#5B5BF0]/10 transition-all font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[13px] font-semibold text-[#0F1535] mb-1.5">Support Email</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F6F7FD] border border-[#EEF0F6] text-[14px] text-[#0F1535] outline-none focus:border-[#5B5BF0] focus:bg-white focus:ring-2 focus:ring-[#5B5BF0]/10 transition-all"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-[13px] font-semibold text-[#0F1535] mb-1.5">Hub Headquarters Address</label>
                  <textarea
                    rows={2}
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6F7FD] border border-[#EEF0F6] text-[14px] text-[#0F1535] outline-none focus:border-[#5B5BF0] focus:bg-white focus:ring-2 focus:ring-[#5B5BF0]/10 transition-all"
                  />
                </div>

                {/* Logo Upload Dropzone */}
                <div>
                  <label className="block text-[13px] font-semibold text-[#0F1535] mb-1.5">Business Logo</label>
                  <div className="border-2 border-dashed border-[#EEF0F6] hover:border-[#5B5BF0] rounded-[16px] p-6 text-center bg-[#F6F7FD]/60 hover:bg-[#EEF0FF]/30 transition-all cursor-pointer">
                    <div className="w-12 h-12 rounded-full bg-white shadow-xs text-[#5B5BF0] flex items-center justify-center mx-auto mb-2">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <div className="text-[13.5px] font-semibold text-[#0F1535]">Upload Company Logo</div>
                    <div className="text-[12px] text-[#6B7280] mt-0.5">PNG, SVG or WebP up to 2MB</div>
                  </div>
                </div>
              </>
            )}

            {activeMenu === "general" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[13px] font-semibold text-[#0F1535] mb-1.5">Currency</label>
                    <input
                      type="text"
                      value={form.currency}
                      onChange={(e) => setForm({ ...form, currency: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F6F7FD] border border-[#EEF0F6] text-[14px] text-[#0F1535] outline-none focus:border-[#5B5BF0]"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-semibold text-[#0F1535] mb-1.5">GST / Tax Percentage (%)</label>
                    <input
                      type="number"
                      value={form.taxPercent}
                      onChange={(e) => setForm({ ...form, taxPercent: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#F6F7FD] border border-[#EEF0F6] text-[14px] text-[#0F1535] outline-none focus:border-[#5B5BF0]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#0F1535] mb-1.5">Minimum Advance Booking Lead (Hours)</label>
                  <input
                    type="number"
                    value={form.bookingLeadHours}
                    onChange={(e) => setForm({ ...form, bookingLeadHours: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#F6F7FD] border border-[#EEF0F6] text-[14px] text-[#0F1535] outline-none focus:border-[#5B5BF0]"
                  />
                </div>
              </div>
            )}

            {activeMenu === "security" && (
              <div className="space-y-4">
                <div className="p-4 rounded-xl bg-[#FEE4E2]/40 border border-[#FECDCA] text-[#B42318] space-y-2">
                  <h4 className="font-bold text-[14px]">Reset All Operations Hub Data</h4>
                  <p className="text-[13px] leading-relaxed">
                    This will reset all bookings, customers, services, payments and team members back to the initial Kerala seed state.
                  </p>
                  <button
                    type="button"
                    onClick={handleReset}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#F04438] text-white text-[13px] font-bold hover:bg-[#D92D20] transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset to Seed Data</span>
                  </button>
                </div>
              </div>
            )}

            {(activeMenu === "notifications" || activeMenu === "integrations" || activeMenu === "billing") && (
              <div className="p-6 rounded-xl bg-[#F6F7FD] text-center text-[#6B7280] text-[14px] space-y-2">
                <p className="font-semibold text-[#0F1535]">Operational module active</p>
                <p className="text-[13px]">Configured and connected for Trivandrum operations dispatch.</p>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#EEF0F6]">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#12B76A] hover:bg-[#0EA05C] text-white text-[13.5px] font-bold shadow-xs hover:shadow-md transition-all cursor-pointer"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
