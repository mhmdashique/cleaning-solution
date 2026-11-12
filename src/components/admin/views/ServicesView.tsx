"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { Plus, Search, Edit2, Trash2, Clock, X, Star, Sparkles, Check, AlertCircle } from "lucide-react";
import { Service, ServiceCategory } from "@/types";
import { useOpsHub } from "@/context/OpsHubContext";
import { ServiceCategoryType } from "@/types/opsHub";
import {
  createServiceAdminAction,
  updateServiceAdminAction,
  deleteServiceAdminAction,
  toggleServiceActiveAdminAction,
  toggleServiceFeaturedAdminAction,
} from "@/app/actions/admin";

interface ServicesViewProps {
  dbServices?: Service[];
}

interface DisplayService {
  id: string;
  slug: string;
  name: string;
  category: ServiceCategoryType;
  description: string;
  duration: string;
  price: number;
  imageUrl?: string;
  isFeatured: boolean;
  status: "Active" | "Inactive";
}

const CATEGORIES: ("All" | ServiceCategoryType)[] = [
  "All",
  "Cleaning",
  "Pest Control",
  "Commercial",
  "Specialised",
];

function mapDbToDisplay(s: Service): DisplayService {
  let cat: ServiceCategoryType = "Cleaning";
  if (s.category === "pest_control") cat = "Pest Control";
  else if (s.category === "commercial") cat = "Commercial";
  else if (s.category === "specialised") cat = "Specialised";

  return {
    id: s.id,
    slug: s.slug,
    name: s.title,
    category: cat,
    description: s.short_desc || s.long_desc || "",
    duration: s.duration || "2–3 hours",
    price: (s as any).price || 1200,
    imageUrl: s.image_url,
    isFeatured: Boolean(s.is_featured),
    status: s.is_active === false ? "Inactive" : "Active",
  };
}

export default function ServicesView({ dbServices = [] }: ServicesViewProps) {
  const { services: opsServices, addService, updateService, deleteService } = useOpsHub();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState<"All" | ServiceCategoryType>("All");

  // Local state initialized with live website services
  const [items, setItems] = useState<DisplayService[]>(() => {
    if (dbServices && dbServices.length > 0) {
      return dbServices.map(mapDbToDisplay);
    }
    return opsServices.map((s) => ({
      id: s.id,
      slug: s.id.toLowerCase(),
      name: s.name,
      category: s.category,
      description: s.description,
      duration: s.duration,
      price: s.price,
      isFeatured: false,
      status: s.status,
    }));
  });

  // Sync if dbServices updates
  useEffect(() => {
    if (dbServices && dbServices.length > 0) {
      setItems(dbServices.map(mapDbToDisplay));
    }
  }, [dbServices]);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<DisplayService | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<DisplayService | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [category, setCategory] = useState<ServiceCategoryType>("Cleaning");
  const [price, setPrice] = useState("1200");
  const [duration, setDuration] = useState("2–3 hours");
  const [desc, setDesc] = useState("");
  const [status, setStatus] = useState<"Active" | "Inactive">("Active");
  const [isFeatured, setIsFeatured] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const showFeedback = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3000);
  };

  const filtered = useMemo(() => {
    return items.filter((s) => {
      const matchesCategory = activeCategory === "All" || s.category === activeCategory;
      if (!matchesCategory) return false;
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        s.name.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q)
      );
    });
  }, [items, activeCategory, search]);

  const handleOpenAdd = () => {
    setName("");
    setCategory("Cleaning");
    setPrice("1200");
    setDuration("2–3 hours");
    setDesc("");
    setStatus("Active");
    setIsFeatured(false);
    setImageUrl("https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80");
    setShowAddModal(true);
  };

  const handleOpenEdit = (svc: DisplayService) => {
    setEditingService(svc);
    setName(svc.name);
    setCategory(svc.category);
    setPrice(String(svc.price));
    setDuration(svc.duration);
    setDesc(svc.description);
    setStatus(svc.status);
    setIsFeatured(svc.isFeatured);
    setImageUrl(svc.imageUrl || "");
  };

  const handleSaveAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const newDisplayItem: DisplayService = {
      id: `srv-${Date.now()}`,
      slug,
      name: name.trim(),
      category,
      description: desc.trim() || "Professional cleaning & sanitisation service in Kerala.",
      duration: duration.trim() || "2–3 hours",
      price: Number(price) || 1200,
      imageUrl: imageUrl || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
      isFeatured,
      status,
    };

    // Update UI immediately
    setItems((prev) => [newDisplayItem, ...prev]);

    // Also update OpsHub context
    addService({
      name: newDisplayItem.name,
      category: newDisplayItem.category,
      price: newDisplayItem.price,
      duration: newDisplayItem.duration,
      description: newDisplayItem.description,
      status: newDisplayItem.status,
    });

    // Call server action to save to website database
    try {
      const adminCat = category === "Pest Control" ? "Pest control" : category;
      await createServiceAdminAction({
        name: newDisplayItem.name,
        slug: newDisplayItem.slug,
        category: adminCat as any,
        shortDesc: newDisplayItem.description,
        duration: newDisplayItem.duration,
        isFeatured: newDisplayItem.isFeatured,
        isActive: newDisplayItem.status === "Active",
        imageUrl: newDisplayItem.imageUrl,
      });
      showFeedback(`Service "${newDisplayItem.name}" published to website!`);
    } catch (err) {
      console.error("Failed to sync new service to server", err);
    }

    setShowAddModal(false);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService || !name.trim()) return;

    const updatedItem: DisplayService = {
      ...editingService,
      name: name.trim(),
      category,
      description: desc.trim(),
      duration: duration.trim() || "2–3 hours",
      price: Number(price) || 1200,
      imageUrl: imageUrl.trim() || editingService.imageUrl,
      isFeatured,
      status,
    };

    setItems((prev) =>
      prev.map((item) => (item.id === editingService.id ? updatedItem : item))
    );

    // Sync to OpsHub
    updateService(editingService.id, {
      name: updatedItem.name,
      category: updatedItem.category,
      price: updatedItem.price,
      duration: updatedItem.duration,
      description: updatedItem.description,
      status: updatedItem.status,
    });

    // Sync to website server action
    try {
      const adminCat = category === "Pest Control" ? "Pest control" : category;
      await updateServiceAdminAction(editingService.id, {
        name: updatedItem.name,
        category: adminCat as any,
        shortDesc: updatedItem.description,
        duration: updatedItem.duration,
        isFeatured: updatedItem.isFeatured,
        isActive: updatedItem.status === "Active",
        imageUrl: updatedItem.imageUrl,
      });
      showFeedback(`Service "${updatedItem.name}" updated on website!`);
    } catch (err) {
      console.error("Failed to sync service update to server", err);
    }

    setEditingService(null);
  };

  const handleToggleActive = async (service: DisplayService) => {
    const newStatus: "Active" | "Inactive" = service.status === "Active" ? "Inactive" : "Active";
    const isActive = newStatus === "Active";

    setItems((prev) =>
      prev.map((item) => (item.id === service.id ? { ...item, status: newStatus } : item))
    );

    updateService(service.id, { status: newStatus });

    try {
      await toggleServiceActiveAdminAction(service.id, isActive);
      showFeedback(`Service ${service.name} is now ${newStatus}`);
    } catch (err) {
      console.error("Failed to toggle active", err);
    }
  };

  const handleToggleFeatured = async (service: DisplayService) => {
    const newFeatured = !service.isFeatured;

    setItems((prev) =>
      prev.map((item) => (item.id === service.id ? { ...item, isFeatured: newFeatured } : item))
    );

    try {
      await toggleServiceFeaturedAdminAction(service.id, newFeatured);
      showFeedback(
        newFeatured
          ? `"${service.name}" is now featured on the homepage!`
          : `"${service.name}" unfeatured.`
      );
    } catch (err) {
      console.error("Failed to toggle featured", err);
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return;

    const id = deleteCandidate.id;
    const name = deleteCandidate.name;

    setItems((prev) => prev.filter((item) => item.id !== id));
    deleteService(id);

    try {
      await deleteServiceAdminAction(id);
      showFeedback(`Service "${name}" deleted.`);
    } catch (err) {
      console.error("Failed to delete service on server", err);
    }

    setDeleteCandidate(null);
  };

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[26px] md:text-[28px] font-bold text-[#0F1535] tracking-tight">
              Services
            </h1>
            <span className="text-[12px] font-bold px-2.5 py-0.5 rounded-full bg-[#EEF0FF] text-[#5B5BF0]">
              {items.length} from website
            </span>
          </div>
          <p className="text-[14px] text-[#6B7280] mt-0.5">
            Manage packages and visibility fetched directly from the website main page
          </p>
        </div>

        <div className="flex items-center gap-3">
          {actionNotice && (
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#E7F8F0] text-[#12B76A] text-[13px] font-bold animate-in fade-in">
              <Check className="w-4 h-4" />
              <span>{actionNotice}</span>
            </div>
          )}

          <button
            type="button"
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[10px] bg-[#12B76A] hover:bg-[#0EA05C] text-white text-[14px] font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Service</span>
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-[#EEF0F6] rounded-[20px] p-6 shadow-[0_4px_24px_rgba(91,91,240,0.06)] space-y-5">
        {/* Search & Category Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search website services by name, keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2.5 rounded-xl bg-[#F6F7FD] border border-[#EEF0F6] text-[13px] text-[#0F1535] placeholder:text-[#9CA3AF] outline-none focus:border-[#5B5BF0] focus:bg-white focus:ring-2 focus:ring-[#5B5BF0]/10 transition-all w-full"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#5B5BF0] text-white shadow-xs"
                    : "bg-[#F6F7FD] text-[#6B7280] hover:text-[#0F1535] hover:bg-[#EEF0FF]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto rounded-xl border border-[#EEF0F6]">
          <table className="w-full text-left border-collapse min-w-[820px]">
            <thead>
              <tr className="bg-[#F8F9FC] text-[#6B7280] text-[12.5px] font-semibold border-b border-[#EEF0F6]">
                <th className="py-3.5 px-4 font-semibold">Service</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Duration</th>
                <th className="py-3.5 px-4 font-semibold">Featured on Home</th>
                <th className="py-3.5 px-4 font-semibold">Website Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF0F6]">
              {filtered.map((s) => (
                <tr key={s.id} className="hover:bg-[#F6F7FD]/70 transition-colors">
                  <td className="py-4 px-4 max-w-sm">
                    <div className="flex items-center gap-3">
                      {s.imageUrl ? (
                        <div className="relative w-11 h-11 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-[#EEF0F6]">
                          <Image
                            src={s.imageUrl}
                            alt={s.name}
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-11 h-11 rounded-xl bg-[#EEF0FF] text-[#5B5BF0] font-bold flex items-center justify-center shrink-0">
                          {s.name.charAt(0)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="font-bold text-[#0F1535] text-[14px] truncate">
                          {s.name}
                        </div>
                        <p className="text-[12px] text-[#6B7280] line-clamp-1 mt-0.5">
                          {s.description}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="py-4 px-4 text-[#6B7280] text-[13px]">
                    <span
                      className={`px-2.5 py-1 rounded-full border text-[12px] font-medium whitespace-nowrap ${
                        s.category === "Cleaning"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : s.category === "Pest Control"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : s.category === "Commercial"
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-purple-50 text-purple-700 border-purple-200"
                      }`}
                    >
                      {s.category}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-[#6B7280] text-[13px] whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-[#9CA3AF]" />
                      <span>{s.duration}</span>
                    </div>
                  </td>

                  <td className="py-4 px-4">
                    <button
                      type="button"
                      onClick={() => handleToggleFeatured(s)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-semibold cursor-pointer transition-colors ${
                        s.isFeatured
                          ? "bg-[#FFF4E5] text-[#F79009] hover:bg-[#ffe8cc]"
                          : "bg-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-200"
                      }`}
                      title={s.isFeatured ? "Featured on website main page" : "Not featured"}
                    >
                      <Star className={`w-3.5 h-3.5 ${s.isFeatured ? "fill-[#F79009]" : ""}`} />
                      <span>{s.isFeatured ? "Featured" : "Standard"}</span>
                    </button>
                  </td>

                  <td className="py-4 px-4">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(s)}
                      title="Click to toggle website visibility"
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold cursor-pointer transition-colors ${
                        s.status === "Active"
                          ? "bg-[#E7F8F0] text-[#12B76A] hover:bg-[#d6f5e6]"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          s.status === "Active" ? "bg-[#12B76A]" : "bg-gray-400"
                        }`}
                      />
                      <span>{s.status}</span>
                    </button>
                  </td>

                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(s)}
                        title="Edit service"
                        className="w-8 h-8 rounded-lg hover:bg-[#EEF0FF] text-[#6B7280] hover:text-[#5B5BF0] inline-flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteCandidate(s)}
                        title="Delete service"
                        className="w-8 h-8 rounded-lg hover:bg-rose-50 text-[#6B7280] hover:text-rose-600 inline-flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-[#6B7280] text-[14px]">
                    No services found matching current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#EEF0F6] rounded-[24px] p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EEF0F6] pb-3">
              <h2 className="text-[18px] font-bold text-[#0F1535]">Add Service to Website</h2>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-[#F6F7FD] hover:bg-[#EEF0FF] text-[#6B7280] hover:text-[#5B5BF0] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="space-y-4 text-[13.5px]">
              <div>
                <label className="block text-[13px] font-semibold text-[#0F1535] mb-1">
                  Service Name / Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Balcony Pressure Wash & Sanitisation"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEF0F6] bg-[#F6F7FD] outline-none focus:bg-white focus:border-[#5B5BF0] text-[#0F1535]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[13px] font-semibold text-[#0F1535] mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ServiceCategoryType)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEF0F6] bg-[#F6F7FD] outline-none focus:bg-white focus:border-[#5B5BF0] text-[#0F1535]"
                  >
                    <option value="Cleaning">Cleaning</option>
                    <option value="Pest Control">Pest Control</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Specialised">Specialised</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#0F1535] mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2–3 hours"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEF0F6] bg-[#F6F7FD] outline-none focus:bg-white focus:border-[#5B5BF0] text-[#0F1535]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#0F1535] mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "Active" | "Inactive")}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEF0F6] bg-[#F6F7FD] outline-none focus:bg-white focus:border-[#5B5BF0] text-[#0F1535]"
                >
                  <option value="Active">Active (Visible)</option>
                  <option value="Inactive">Inactive (Hidden)</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#0F1535] mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEF0F6] bg-[#F6F7FD] outline-none focus:bg-white focus:border-[#5B5BF0] text-[#0F1535]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#0F1535] mb-1">
                  Description & Scope
                </label>
                <textarea
                  rows={3}
                  placeholder="Detail what is included in this service (equipment, steps, chemicals used)..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEF0F6] bg-[#F6F7FD] outline-none focus:bg-white focus:border-[#5B5BF0] text-[#0F1535] resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="add-featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-[#5B5BF0] focus:ring-[#5B5BF0] cursor-pointer accent-[#5B5BF0]"
                />
                <label htmlFor="add-featured" className="text-[13px] text-[#0F1535] font-medium cursor-pointer">
                  Feature on website main page carousel
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
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
                  Publish Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#EEF0F6] rounded-[24px] p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[#EEF0F6] pb-3">
              <div>
                <h2 className="text-[18px] font-bold text-[#0F1535]">Edit Service</h2>
                <span className="font-mono text-[12px] text-[#6B7280]">
                  Slug: {editingService.slug}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="w-8 h-8 rounded-full bg-[#F6F7FD] hover:bg-[#EEF0FF] text-[#6B7280] hover:text-[#5B5BF0] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-[13.5px]">
              <div>
                <label className="block text-[13px] font-semibold text-[#0F1535] mb-1">
                  Service Name / Title *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEF0F6] bg-[#F6F7FD] outline-none focus:bg-white focus:border-[#5B5BF0] text-[#0F1535]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[13px] font-semibold text-[#0F1535] mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ServiceCategoryType)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEF0F6] bg-[#F6F7FD] outline-none focus:bg-white focus:border-[#5B5BF0] text-[#0F1535]"
                  >
                    <option value="Cleaning">Cleaning</option>
                    <option value="Pest Control">Pest Control</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Specialised">Specialised</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[13px] font-semibold text-[#0F1535] mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEF0F6] bg-[#F6F7FD] outline-none focus:bg-white focus:border-[#5B5BF0] text-[#0F1535]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#0F1535] mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as "Active" | "Inactive")}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEF0F6] bg-[#F6F7FD] outline-none focus:bg-white focus:border-[#5B5BF0] text-[#0F1535]"
                >
                  <option value="Active">Active (Visible)</option>
                  <option value="Inactive">Inactive (Hidden)</option>
                </select>
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#0F1535] mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEF0F6] bg-[#F6F7FD] outline-none focus:bg-white focus:border-[#5B5BF0] text-[#0F1535]"
                />
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-[#0F1535] mb-1">
                  Description & Scope
                </label>
                <textarea
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEF0F6] bg-[#F6F7FD] outline-none focus:bg-white focus:border-[#5B5BF0] text-[#0F1535] resize-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="edit-featured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-[#5B5BF0] focus:ring-[#5B5BF0] cursor-pointer accent-[#5B5BF0]"
                />
                <label htmlFor="edit-featured" className="text-[13px] text-[#0F1535] font-medium cursor-pointer">
                  Feature on website main page carousel
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingService(null)}
                  className="px-4 py-2 rounded-xl border border-[#EEF0F6] text-[#6B7280] font-semibold hover:bg-[#F6F7FD] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#5B5BF0] hover:bg-[#4E4EE0] text-white font-semibold cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#EEF0F6] rounded-[24px] p-6 max-w-sm w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <h3 className="text-[17px] font-bold text-[#0F1535]">Delete Service?</h3>
            <p className="text-[13.5px] text-[#6B7280]">
              Are you sure you want to delete <span className="font-semibold text-[#0F1535]">{deleteCandidate.name}</span> from the website?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 rounded-xl border border-[#EEF0F6] text-[#6B7280] font-semibold hover:bg-[#F6F7FD] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
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
