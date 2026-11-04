"use client";

import { useState, useMemo } from "react";
import PageHeader from "../shared/PageHeader";
import Toolbar from "../shared/Toolbar";
import DataTable from "../shared/DataTable";
import StatusPill from "../shared/StatusPill";
import ConfirmDialog from "../shared/ConfirmDialog";
import { AdminArticle } from "@/types/admin";
import { 
  Plus, 
  Edit, 
  ExternalLink, 
  MoreVertical, 
  Copy, 
  Trash2 
} from "lucide-react";
import Link from "next/link";

interface ArticlesViewProps {
  articles: AdminArticle[];
  onCreateArticle: (art: Partial<AdminArticle>) => void;
  onDuplicateArticle: (id: string) => void;
  onDeleteArticle: (id: string) => void;
}

export default function ArticlesView({
  articles,
  onCreateArticle,
  onDuplicateArticle,
  onDeleteArticle,
}: ArticlesViewProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [showNewModal, setShowNewModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<AdminArticle["category"]>("Home cleaning");
  const [excerpt, setExcerpt] = useState("");
  const [author, setAuthor] = useState("Plan C Editorial");

  const filteredArticles = useMemo(() => {
    return articles.filter((a) => {
      const matchesStatus = statusFilter === "All" || a.status === statusFilter;
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [articles, statusFilter, search]);

  const paginatedArticles = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredArticles.slice(start, start + pageSize);
  }, [filteredArticles, page]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreateArticle({
      title,
      slug: title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      category,
      excerpt: excerpt || "Expert cleaning and pest prevention guidance for Kerala homeowners.",
      author: author || "Plan C Crew",
      date: "18 May 2025",
      status: "Published",
    });

    setTitle("");
    setExcerpt("");
    setShowNewModal(false);
  };

  const columns = [
    {
      header: "Category",
      cell: (a: AdminArticle) => (
        <span className="text-[12px] px-2.5 py-0.5 rounded-full bg-[#F1F4F2] text-[#5D6B65] font-medium border border-[#E3E8E5]">
          {a.category}
        </span>
      ),
    },
    {
      header: "Title & Excerpt",
      cell: (a: AdminArticle) => (
        <div className="space-y-1 max-w-md py-1">
          <div className="font-semibold text-[#12201B] text-[14.5px] leading-snug">
            {a.title}
          </div>
          <p className="text-[13px] text-[#5D6B65] line-clamp-2 leading-relaxed">
            {a.excerpt}
          </p>
        </div>
      ),
    },
    {
      header: "Author & Date",
      cell: (a: AdminArticle) => (
        <div className="text-[12.5px] space-y-0.5">
          <div className="font-medium text-[#12201B]">{a.author}</div>
          <div className="text-[#5D6B65]">{a.date}</div>
        </div>
      ),
    },
    {
      header: "Status",
      cell: (a: AdminArticle) => <StatusPill status={a.status} />,
    },
    {
      header: "Actions",
      align: "right" as const,
      cell: (a: AdminArticle) => (
        <div className="flex items-center justify-end gap-1.5 relative">
          <Link
            href={`/blog/${a.slug}`}
            target="_blank"
            className="p-1.5 rounded-[8px] text-[#5D6B65] hover:text-[#0F6B54] hover:bg-[#F1F4F2] transition-colors"
            title="View article on website"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>

          <button
            type="button"
            onClick={() => setActiveMenuId(activeMenuId === a.id ? null : a.id)}
            className="p-1.5 rounded-[8px] text-[#5D6B65] hover:text-[#12201B] hover:bg-[#F1F4F2] transition-colors"
            aria-label="More options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {activeMenuId === a.id && (
            <div className="absolute right-0 top-8 w-36 rounded-[10px] bg-white border border-[#E3E8E5] shadow-lg z-20 py-1 text-[12.5px]">
              <button
                type="button"
                onClick={() => {
                  onDuplicateArticle(a.id);
                  setActiveMenuId(null);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#F1F4F2] flex items-center gap-2 text-[#12201B]"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Duplicate</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveMenuId(null);
                  setDeleteId(a.id);
                }}
                className="w-full text-left px-3 py-1.5 hover:bg-[#DC2626]/10 flex items-center gap-2 text-[#DC2626]"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      <PageHeader
        title="Articles and blog"
        subtitle="Manage cleaning guides and termite defense tips for Kerala residents"
        actions={
          <button
            type="button"
            onClick={() => setShowNewModal(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-[10px] bg-[#0F6B54] hover:bg-[#0c5543] text-white text-[13px] font-medium transition-colors cursor-pointer shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>New article</span>
          </button>
        }
      />

      {/* Toolbar */}
      <Toolbar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search articles by title, excerpt, or author..."
        filters={
          <div className="flex items-center gap-1 bg-[#F1F4F2] p-1 rounded-[10px] border border-[#E3E8E5]">
            {(["All", "Published", "Draft"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setStatusFilter(s);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-[8px] text-[12.5px] font-medium transition-colors cursor-pointer ${
                  statusFilter === s
                    ? "bg-white text-[#12201B] font-semibold shadow-xs"
                    : "text-[#5D6B65] hover:text-[#12201B]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        }
      />

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={paginatedArticles}
        totalItems={filteredArticles.length}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={setPage}
        emptyTitle="No articles found"
        emptyDescription="No articles match your search or status criteria."
      />

      {/* New Article Modal */}
      {showNewModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
        >
          <div className="bg-white border border-[#E3E8E5] rounded-[14px] p-6 max-w-lg w-full shadow-2xl space-y-4">
            <h2 className="text-[17px] font-bold text-[#12201B]">
              New article
            </h2>

            <form onSubmit={handleCreate} className="space-y-4 text-[13.5px]">
              <div>
                <label className="block text-[#5D6B65] mb-1 font-medium">Article title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Monsoon Home Cleaning Checklist for Trivandrum"
                  className="w-full px-3 py-2 rounded-[10px] bg-white border border-[#E3E8E5] text-[#12201B] focus:outline-none focus:ring-2 focus:ring-[#0F6B54]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#5D6B65] mb-1 font-medium">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as AdminArticle["category"])}
                    className="w-full px-3 py-2 rounded-[10px] bg-white border border-[#E3E8E5] text-[#12201B] focus:outline-none focus:ring-2 focus:ring-[#0F6B54]"
                  >
                    <option value="Home cleaning">Home cleaning</option>
                    <option value="Pest prevention">Pest prevention</option>
                    <option value="Water hygiene">Water hygiene</option>
                    <option value="Seasonal care">Seasonal care</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#5D6B65] mb-1 font-medium">Author</label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full px-3 py-2 rounded-[10px] bg-white border border-[#E3E8E5] text-[#12201B] focus:outline-none focus:ring-2 focus:ring-[#0F6B54]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#5D6B65] mb-1 font-medium">Excerpt</label>
                <textarea
                  rows={3}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Short introductory summary for search previews..."
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
                  Publish article
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Article Confirm Dialog */}
      <ConfirmDialog
        isOpen={Boolean(deleteId)}
        title="Delete article"
        description="Are you sure you want to delete this blog post? It will no longer appear on the website."
        confirmLabel="Delete"
        onConfirm={() => {
          if (deleteId) onDeleteArticle(deleteId);
          setDeleteId(null);
        }}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
