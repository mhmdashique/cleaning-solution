"use client";

import { useState, useMemo } from "react";
import PageHeader from "../shared/PageHeader";
import Toolbar from "../shared/Toolbar";
import DataTable from "../shared/DataTable";
import ConfirmDialog from "../shared/ConfirmDialog";
import { AdminService } from "@/types/admin";
import { 
  Plus, 
  Star, 
  MoreVertical, 
  Edit, 
  Trash2, 
  Eye, 
  Clock, 
  Calendar,
  LayoutGrid,
  Table as TableIcon
} from "lucide-react";

interface ServicesViewProps {
  services: AdminService[];
  onToggleFeatured: (id: string) => void;
  onToggleActive: (id: string) => void;
  onDeleteService: (id: string) => void;
  onAddService: (service: Partial<AdminService>) => void;
}

const CATEGORIES = ["All", "Cleaning", "Pest control", "Commercial", "Specialised"] as const;

export default function ServicesView({
  services,
  onToggleFeatured,
  onToggleActive,
  onDeleteService,
  onAddService,
}: ServicesViewProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [page, setPage] = useState(1);
  const pageSize = 12;

  // Modals & Menu states
  const [showNewModal, setShowNewModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [cat, setCat] = useState<AdminService["category"]>("Cleaning");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [desc, setDesc] = useState("");

  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      const matchesCat = category === "All" || s.category === category;
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.shortDesc.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q);

      return matchesCat && matchesSearch;
    });
  }, [services, search, category]);

  const paginatedServices = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredServices.slice(start, start + pageSize);
  }, [filteredServices, page]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddService({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category: cat,
      priceFrom: price || "₹1,500",
      duration: duration || "2 hours",
      shortDesc: desc || "Professional cleaning & sanitisation service in Trivandrum.",
      bookingsCount: 0,
      isFeatured: false,
      isActive: true,
    });
    setName("");
    setPrice("");
    setDuration("");
    setDesc("");
    setShowNewModal(false);
  };

  const columns = [
    {
      header: "Service",
      cell: (s: AdminService) => (
        <div>
          <div className="font-semibold text-[#12201B] flex items-center gap-1.5">
            {s.name}
            {s.isFeatured && <Star className="w-3.5 h-3.5 fill-[#B57F0A] text-[#B57F0A]" />}
          </div>
          <div className="text-[12px] text-[#5D6B65] font-mono">{s.slug}</div>
        </div>
      ),
    },
    {
      header: "Category",
      cell: (s: AdminService) => (
        <span className="text-[12.5px] px-2 py-0.5 rounded-full bg-[#F1F4F2] text-[#5D6B65] border border-[#E3E8E5]">
          {s.category}
        </span>
      ),
    },
    {
      header: "Starting price",
      cell: (s: AdminService) => <span className="font-mono text-[#0F6B54] font-semibold">{s.priceFrom}</span>,
    },
    {
      header: "Duration",
      cell: (s: AdminService) => <span className="text-[#5D6B65]">{s.duration}</span>,
    },
    {
      header: "Bookings",
      cell: (s: AdminService) => <span className="text-[#12201B] font-medium">{s.bookingsCount}</span>,
    },
    {
      header: "Active",
      cell: (s: AdminService) => (
        <button
          type="button"
          onClick={() => onToggleActive(s.id)}
          className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${
            s.isActive ? "bg-[#0F6B54]" : "bg-[#E3E8E5]"
          }`}
          aria-label={s.isActive ? "Deactivate service" : "Activate service"}
        >
          <span
            className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.75 transition-transform ${
              s.isActive ? "right-1" : "left-1"
            }`}
          />
        </button>
      ),
    },
    {
      header: "Actions",
      align: "right" as const,
      cell: (s: AdminService) => (
        <button
          type="button"
          onClick={() => setDeleteId(s.id)}
          className="p-1.5 rounded-[8px] text-[#5D6B65] hover:text-[#DC2626] hover:bg-[#F1F4F2] transition-colors"
          aria-label="Delete service"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <PageHeader
        title="Services"
        subtitle="Active service offerings and category configurations in Trivandrum"
        actions={
          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-[#0F6B54] hover:bg-[#0c5543] text-white text-[13px] font-medium transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New service</span>
          </button>
        }
      />

      {/* Toolbar & Category Tabs */}
      <div className="space-y-3">
        <Toolbar
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder="Search services by title, slug, or description..."
          filters={
            <div className="flex items-center gap-1 bg-[#F1F4F2] p-0.5 rounded-[10px] border border-[#E3E8E5]">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                aria-pressed={viewMode === "grid"}
                aria-label="Grid view"
                className={`p-1.5 rounded-[8px] transition-colors ${
                  viewMode === "grid" ? "bg-white text-[#12201B] shadow-xs" : "text-[#5D6B65] hover:text-[#12201B]"
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                aria-pressed={viewMode === "table"}
                aria-label="Table view"
                className={`p-1.5 rounded-[8px] transition-colors ${
                  viewMode === "table" ? "bg-white text-[#12201B] shadow-xs" : "text-[#5D6B65] hover:text-[#12201B]"
                }`}
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
          }
        />

        {/* Categories Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => {
                setCategory(c);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-[8px] text-[12.5px] font-medium transition-colors shrink-0 cursor-pointer ${
                category === c
                  ? "bg-[#12201B] text-white font-semibold"
                  : "bg-white text-[#5D6B65] hover:text-[#12201B] border border-[#E3E8E5]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Content: Grid or Table */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedServices.map((srv) => (
            <div
              key={srv.id}
              className="bg-white border border-[#E3E8E5] rounded-[14px] p-5 flex flex-col justify-between shadow-xs hover:border-[#0F6B54]/40 transition-all space-y-4"
            >
              {/* Card Header */}
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <h3 className="text-[16px] font-bold text-[#12201B] leading-tight flex items-center gap-1.5">
                      {srv.name}
                    </h3>
                    <span className="inline-block text-[11px] font-medium text-[#5D6B65] bg-[#F1F4F2] px-2 py-0.5 rounded-full border border-[#E3E8E5]">
                      {srv.category}
                    </span>
                  </div>

                  {/* Star toggle & Overflow menu */}
                  <div className="flex items-center gap-1 relative">
                    <button
                      type="button"
                      onClick={() => onToggleFeatured(srv.id)}
                      aria-label="Toggle featured"
                      className="p-1 rounded text-[#5D6B65] hover:text-[#B57F0A]"
                    >
                      <Star
                        className={`w-4 h-4 ${
                          srv.isFeatured ? "fill-[#B57F0A] text-[#B57F0A]" : "text-[#5D6B65]"
                        }`}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveMenuId(activeMenuId === srv.id ? null : srv.id)}
                      className="p-1 rounded text-[#5D6B65] hover:text-[#12201B]"
                      aria-label="Service options"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {activeMenuId === srv.id && (
                      <div className="absolute right-0 top-7 w-36 rounded-[10px] bg-white border border-[#E3E8E5] shadow-lg z-20 py-1 text-[12.5px]">
                        <button
                          type="button"
                          onClick={() => setActiveMenuId(null)}
                          className="w-full text-left px-3 py-1.5 hover:bg-[#F1F4F2] flex items-center gap-2 text-[#12201B]"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveMenuId(null);
                            setDeleteId(srv.id);
                          }}
                          className="w-full text-left px-3 py-1.5 hover:bg-[#DC2626]/10 flex items-center gap-2 text-[#DC2626]"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2-line description */}
                <p className="text-[13px] text-[#5D6B65] line-clamp-2 leading-relaxed">
                  {srv.shortDesc}
                </p>
              </div>

              {/* Price & Duration Strip */}
              <div className="bg-[#F1F4F2]/50 p-2.5 rounded-[10px] border border-[#E3E8E5] flex items-center justify-between text-[12.5px]">
                <div>
                  <span className="text-[#5D6B65]">From </span>
                  <span className="font-bold text-[#0F6B54] font-mono">{srv.priceFrom}</span>
                </div>
                <div className="flex items-center gap-1 text-[#5D6B65]">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{srv.duration}</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="pt-2 border-t border-[#E3E8E5] flex items-center justify-between text-[12px]">
                <span className="font-mono text-[#5D6B65] text-[11px] truncate max-w-[120px]">
                  /{srv.slug}
                </span>

                <div className="flex items-center gap-3">
                  <span className="text-[#5D6B65]">{srv.bookingsCount} bookings</span>
                  {/* Switch */}
                  <button
                    type="button"
                    onClick={() => onToggleActive(srv.id)}
                    className={`w-8 h-4.5 rounded-full transition-colors relative cursor-pointer ${
                      srv.isActive ? "bg-[#0F6B54]" : "bg-[#E3E8E5]"
                    }`}
                    aria-label={srv.isActive ? "Deactivate" : "Activate"}
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 transition-transform ${
                        srv.isActive ? "right-0.5" : "left-0.5"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={paginatedServices}
          totalItems={filteredServices.length}
          currentPage={page}
          pageSize={pageSize}
          onPageChange={setPage}
        />
      )}

      {/* New Service Modal */}
      {showNewModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white border border-[#E3E8E5] rounded-[14px] p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h2 className="text-[17px] font-bold text-[#12201B]">
              Add new service
            </h2>

            <form onSubmit={handleCreate} className="space-y-4 text-[13.5px]">
              <div>
                <label className="block text-[#5D6B65] mb-1 font-medium">Service name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Sofa Shampooing & Sanitisation"
                  className="w-full px-3 py-2 rounded-[10px] bg-white border border-[#E3E8E5] text-[#12201B] focus:outline-none focus:ring-2 focus:ring-[#0F6B54]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5D6B65] mb-1 font-medium">Category</label>
                  <select
                    value={cat}
                    onChange={(e) => setCat(e.target.value as AdminService["category"])}
                    className="w-full px-3 py-2 rounded-[10px] bg-white border border-[#E3E8E5] text-[#12201B] focus:outline-none focus:ring-2 focus:ring-[#0F6B54]"
                  >
                    <option value="Cleaning">Cleaning</option>
                    <option value="Pest control">Pest control</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Specialised">Specialised</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#5D6B65] mb-1 font-medium">Starting price</label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g., ₹1,800"
                    className="w-full px-3 py-2 rounded-[10px] bg-white border border-[#E3E8E5] text-[#12201B] focus:outline-none focus:ring-2 focus:ring-[#0F6B54]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#5D6B65] mb-1 font-medium">Estimated duration</label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g., 2–3 hours"
                  className="w-full px-3 py-2 rounded-[10px] bg-white border border-[#E3E8E5] text-[#12201B] focus:outline-none focus:ring-2 focus:ring-[#0F6B54]"
                />
              </div>

              <div>
                <label className="block text-[#5D6B65] mb-1 font-medium">Description</label>
                <textarea
                  rows={3}
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="Short service description for booking summary..."
                  className="w-full px-3 py-2 rounded-[10px] bg-white border border-[#E3E8E5] text-[#12201B] focus:outline-none focus:ring-2 focus:ring-[#0F6B54]"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#E3E8E5]">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-[10px] border border-[#E3E8E5] text-[#12201B] hover:bg-[#F1F4F2] font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-[10px] bg-[#0F6B54] text-white font-medium hover:bg-[#0c5543]"
                >
                  Create service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Delete service"
        description="Are you sure you want to delete this service? This action will remove it from the catalog."
        confirmLabel="Delete"
        onConfirm={() => {
          if (deleteId) onDeleteService(deleteId);
          setDeleteId(null);
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
