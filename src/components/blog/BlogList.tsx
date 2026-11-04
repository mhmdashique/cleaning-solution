"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { BlogPost } from "@/types";
import { 
  Search, 
  Calendar, 
  Clock, 
  ArrowRight, 
  Tag, 
  Sparkles,
  BookOpen
} from "lucide-react";

export default function BlogList({ posts }: { posts: BlogPost[] }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(() => {
    const cats = new Set(posts.map((p) => p.category));
    return ["all", ...Array.from(cats)];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCat =
        selectedCategory === "all" || post.category === selectedCategory;
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCat && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  const featuredPost = posts[0];
  const regularPosts = filteredPosts.filter((p) => p.slug !== (selectedCategory === "all" && !searchQuery ? featuredPost?.slug : ""));

  return (
    <div className="space-y-12">
      
      {/* Category Pills & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-4 sm:p-6 bg-white rounded-3xl border border-slate-200 shadow-soft">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-colors capitalize ${
                selectedCategory === cat
                  ? "bg-brand-700 text-white shadow-md shadow-brand-900/15"
                  : "bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              {cat === "all" ? "All Articles" : cat}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search guides (e.g. termite, tank)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-600/20 focus:border-brand-600"
          />
        </div>
      </div>

      {/* Featured Post Card (Only shown if browsing All and no active search) */}
      {selectedCategory === "all" && !searchQuery && featuredPost && (
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-soft hover:shadow-card-hover transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            
            <div className="lg:col-span-7 relative h-72 sm:h-96 w-full overflow-hidden">
              <Image
                src={featuredPost.cover_image}
                alt={featuredPost.title}
                fill
                className="object-cover"
              />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-accent-yellow text-brand-950 shadow-md">
                Featured Guide
              </span>
            </div>

            <div className="lg:col-span-5 p-8 sm:p-10 space-y-4">
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {new Date(featuredPost.published_at).toLocaleDateString("en-IN", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  5 min read
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 hover:text-brand-800 transition-colors leading-tight">
                <Link href={`/blog/${featuredPost.slug}`}>
                  {featuredPost.title}
                </Link>
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                {featuredPost.excerpt}
              </p>

              <div className="pt-2 flex flex-wrap gap-1.5">
                {featuredPost.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center gap-2 text-sm font-bold text-brand-700 hover:text-brand-900"
                >
                  <span>Read Complete Guide</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Regular Posts Grid */}
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-slate-900">
          Articles & Guides ({filteredPosts.length})
        </h3>

        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
            <BookOpen className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-lg font-bold text-slate-700">No articles found</h4>
            <p className="text-xs text-slate-500">
              Try adjusting your search criteria or explore other categories.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <article
                key={post.slug}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-soft hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={post.cover_image}
                      alt={post.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-3.5 left-3.5 px-3 py-1 rounded-full text-[11px] font-bold bg-white/95 text-brand-900 shadow-xs">
                      {post.category}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.published_at).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        4 min read
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-brand-800 transition-colors leading-snug">
                      <Link href={`/blog/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h4>

                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-brand-700">
                    <Link href={`/blog/${post.slug}`}>Read Full Article</Link>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

