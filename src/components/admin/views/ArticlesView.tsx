"use client";

import { useState } from "react";
import { Plus, Search, Edit2, Trash2, Copy, Eye, EyeOff, X } from "lucide-react";
import { AdminArticle } from "@/types/admin";
import { useOpsHub } from "@/context/OpsHubContext";

interface ArticlesViewProps {
  articles: AdminArticle[];
  onCreateArticle: (data: Partial<AdminArticle>) => void;
  onUpdateArticle: (id: string, patch: Partial<AdminArticle>) => void;
  onDuplicateArticle: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onDeleteArticle: (id: string) => void;
}

const CATEGORIES = [
  "Home cleaning",
  "Pest prevention",
  "Pest control tips",
  "Commercial cleaning",
  "Water tank care",
  "Upholstery care",
  "General tips",
] as const;

export default function ArticlesView({
  articles,
  onCreateArticle,
  onUpdateArticle,
  onDuplicateArticle,
  onToggleStatus,
  onDeleteArticle,
}: ArticlesViewProps) {
  const { showToast } = useOpsHub();
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingArticle, setEditingArticle] = useState<AdminArticle | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState<string>("Home cleaning");
  const [author, setAuthor] = useState("Plan C Crew");
  const [status, setStatus] = useState<"Published" | "Draft">("Published");

  const filtered = articles.filter((a) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q) || a.author.toLowerCase().includes(q);
  });

  const handleOpenAdd = () => {
    setTitle("");
    setExcerpt("");
    setCategory("Home cleaning");
    setAuthor("Plan C Crew");
    setStatus("Published");
    setShowAddModal(true);
  };

  const handleOpenEdit = (art: AdminArticle) => {
    setEditingArticle(art);
    setTitle(art.title);
    setExcerpt(art.excerpt || "");
    setCategory(art.category);
    setAuthor(art.author);
    setStatus(art.status);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast("Enter an article title before saving.", "warning");
      return;
    }
    onCreateArticle({
      title: title.trim(),
      excerpt: excerpt.trim(),
      category,
      author: author.trim() || "Plan C Crew",
      status,
      slug: title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
    });
    setShowAddModal(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    if (!title.trim()) {
      showToast("Enter an article title before saving.", "warning");
      return;
    }
    onUpdateArticle(editingArticle.id, {
      title: title.trim(),
      excerpt: excerpt.trim(),
      category,
      author: author.trim() || "Plan C Crew",
      status,
    });
    setEditingArticle(null);
  };

  return (
    <div className="space-y-6 font-sans animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] md:text-[28px] font-bold text-[#0F1535] tracking-tight">Articles & Blog</h1>
          <p className="text-[14px] text-[#6B7280] mt-0.5">
            Publish educational content, cleaning tips, and service announcements
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-[10px] bg-[#12B76A] hover:bg-[#0EA05C] text-white text-[14px] font-semibold shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Article</span>
        </button>
      </div>

      {/* Main Card */}
      <div className="bg-white border border-[#EEF0F6] rounded-[20px] p-6 shadow-[0_4px_24px_rgba(91,91,240,0.06)] space-y-5">
        {/* Search */}
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 text-[#6B7280] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search articles by title, category, author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2.5 rounded-xl bg-[#F6F7FD] border border-[#EEF0F6] text-[13px] text-[#0F1535] placeholder:text-[#9CA3AF] outline-none focus:border-[#5B5BF0] focus:bg-white focus:ring-2 focus:ring-[#5B5BF0]/10 transition-all w-full"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-[#EEF0F6]">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-[#F8F9FC] text-[#6B7280] text-[12.5px] font-semibold border-b border-[#EEF0F6]">
                <th className="py-3.5 px-4 font-semibold">Title</th>
                <th className="py-3.5 px-4 font-semibold">Category</th>
                <th className="py-3.5 px-4 font-semibold">Author</th>
                <th className="py-3.5 px-4 font-semibold">Date</th>
                <th className="py-3.5 px-4 font-semibold">Status</th>
                <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEF0F6]">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-[#F6F7FD]/70 transition-colors">
                  <td className="py-4 px-4 max-w-xs">
                    <div className="font-semibold text-[14px] text-[#0F1535] line-clamp-1">{a.title}</div>
                    {a.excerpt && (
                      <p className="text-[12.5px] text-[#6B7280] line-clamp-1 mt-0.5">{a.excerpt}</p>
                    )}
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-full bg-[#EEF0FF] text-[#5B5BF0] text-[12px] font-medium">
                      {a.category}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-[#6B7280] text-[13px]">{a.author}</td>
                  <td className="py-4 px-4 text-[#6B7280] text-[13px]">{a.date}</td>
                  <td className="py-4 px-4">
                    <button
                      type="button"
                      onClick={() => onToggleStatus(a.id)}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[12px] font-semibold cursor-pointer transition-colors ${
                        a.status === "Published"
                          ? "bg-[#E7F8F0] text-[#12B76A] hover:bg-[#d6f5e6]"
                          : "bg-[#F6F7FD] text-[#6B7280] hover:bg-[#EEF0F6]"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${a.status === "Published" ? "bg-[#12B76A]" : "bg-[#9CA3AF]"}`} />
                      {a.status}
                    </button>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(a)}
                        title="Edit"
                        className="w-8 h-8 rounded-lg hover:bg-[#EEF0FF] text-[#6B7280] hover:text-[#5B5BF0] inline-flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDuplicateArticle(a.id)}
                        title="Duplicate"
                        className="w-8 h-8 rounded-lg hover:bg-[#EEF0FF] text-[#6B7280] hover:text-[#5B5BF0] inline-flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteId(a.id)}
                        title="Delete"
                        className="w-8 h-8 rounded-lg hover:bg-rose-50 text-[#6B7280] hover:text-rose-600 inline-flex items-center justify-center transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-[#6B7280] text-[14px]">
                    No articles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Article Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#EEF0F6] rounded-[24px] p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#EEF0F6] pb-3">
              <h2 className="text-[18px] font-bold text-[#0F1535]">New Article</h2>
              <button type="button" onClick={() => setShowAddModal(false)} className="w-8 h-8 rounded-full bg-[#F6F7FD] hover:bg-[#EEF0FF] text-[#6B7280] hover:text-[#5B5BF0] flex items-center justify-center transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveAdd} className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#0F1535] mb-1">Title *</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Article title..." className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEF0F6] bg-[#F6F7FD] outline-none focus:bg-white focus:border-[#5B5BF0] text-[#0F1535]" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#0F1535] mb-1">Excerpt / Summary</label>
                <textarea rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Brief summary for the article listing..." className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEF0F6] bg-[#F6F7FD] outline-none focus:bg-white focus:border-[#5B5BF0] text-[#0F1535] resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[13px] font-semibold text-[#0F1535] mb-1">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEF0F6] bg-[#F6F7FD] outline-none focus:bg-white focus:border-[#5B5BF0] text-[#0F1535]">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#0F1535] mb-1">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value as "Published" | "Draft")} className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEF0F6] bg-[#F6F7FD] outline-none focus:bg-white focus:border-[#5B5BF0] text-[#0F1535]">
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#0F1535] mb-1">Author</label>
                <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEF0F6] bg-[#F6F7FD] outline-none focus:bg-white focus:border-[#5B5BF0] text-[#0F1535]" />
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 rounded-xl border border-[#EEF0F6] text-[#6B7280] font-semibold hover:bg-[#F6F7FD] cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#12B76A] hover:bg-[#0EA05C] text-white font-semibold cursor-pointer">Publish Article</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Article Modal */}
      {editingArticle && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#EEF0F6] rounded-[24px] p-6 max-w-lg w-full shadow-2xl space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-[#EEF0F6] pb-3">
              <h2 className="text-[18px] font-bold text-[#0F1535]">Edit Article</h2>
              <button type="button" onClick={() => setEditingArticle(null)} className="w-8 h-8 rounded-full bg-[#F6F7FD] hover:bg-[#EEF0FF] text-[#6B7280] hover:text-[#5B5BF0] flex items-center justify-center transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-[13px] font-semibold text-[#0F1535] mb-1">Title *</label>
                <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEF0F6] bg-[#F6F7FD] outline-none focus:bg-white focus:border-[#5B5BF0] text-[#0F1535]" />
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#0F1535] mb-1">Excerpt / Summary</label>
                <textarea rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEF0F6] bg-[#F6F7FD] outline-none focus:bg-white focus:border-[#5B5BF0] text-[#0F1535] resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-[13px] font-semibold text-[#0F1535] mb-1">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEF0F6] bg-[#F6F7FD] outline-none focus:bg-white focus:border-[#5B5BF0] text-[#0F1535]">
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-[13px] font-semibold text-[#0F1535] mb-1">Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value as "Published" | "Draft")} className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEF0F6] bg-[#F6F7FD] outline-none focus:bg-white focus:border-[#5B5BF0] text-[#0F1535]">
                    <option value="Published">Published</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[13px] font-semibold text-[#0F1535] mb-1">Author</label>
                <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full px-3.5 py-2.5 rounded-xl border border-[#EEF0F6] bg-[#F6F7FD] outline-none focus:bg-white focus:border-[#5B5BF0] text-[#0F1535]" />
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button type="button" onClick={() => setEditingArticle(null)} className="px-4 py-2 rounded-xl border border-[#EEF0F6] text-[#6B7280] font-semibold hover:bg-[#F6F7FD] cursor-pointer">Cancel</button>
                <button type="submit" className="px-5 py-2 rounded-xl bg-[#5B5BF0] hover:bg-[#4E4EE0] text-white font-semibold cursor-pointer">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-[#EEF0F6] rounded-[24px] p-6 max-w-sm w-full shadow-2xl space-y-4 animate-in zoom-in-95 duration-150">
            <h3 className="text-[17px] font-bold text-[#0F1535]">Delete Article?</h3>
            <p className="text-[13.5px] text-[#6B7280]">This article will be permanently removed from the blog.</p>
            <div className="flex justify-end gap-3">
              <button type="button" onClick={() => setDeleteId(null)} className="px-4 py-2 rounded-xl border border-[#EEF0F6] text-[#6B7280] font-semibold hover:bg-[#F6F7FD] cursor-pointer">Cancel</button>
              <button type="button" onClick={() => { onDeleteArticle(deleteId); setDeleteId(null); }} className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-semibold cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
