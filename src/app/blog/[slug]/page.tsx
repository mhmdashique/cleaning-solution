import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getBlogPostBySlug, getPublishedBlogPosts } from "@/lib/data/store";
import { BlogPostJsonLd } from "@/components/seo/JsonLd";
import { 
  Calendar, 
  Clock, 
  User, 
  ChevronRight, 
  Share2, 
  Sparkles,
  ArrowRight,
  BookOpen
} from "lucide-react";
import BlogShareButtons from "@/components/blog/BlogShareButtons";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPublishedBlogPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return { title: "Article Not Found" };
  }

  return {
    title: post.meta_title || `${post.title} | PLAN C Cleaning`,
    description: post.meta_description || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{ url: post.cover_image, width: 1200, height: 630, alt: post.title }],
      type: "article",
      publishedTime: post.published_at,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const allPosts = await getPublishedBlogPosts();
  const relatedPosts = allPosts
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  // Extract simple table of contents from content markdown headers
  const headingMatches = post.content.match(/^##\s+(.*$)/gm) || [];
  const toc = headingMatches.map((h) => h.replace(/^##\s+/, ""));

  return (
    <div className="bg-slate-50 min-h-screen py-10 md:py-16">
      <BlogPostJsonLd
        title={post.title}
        description={post.excerpt}
        url={`https://plancsolutions.in/blog/${post.slug}`}
        image={post.cover_image}
        publishedAt={post.published_at}
        author={post.author}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
          <Link href="/" className="hover:text-brand-700">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/blog" className="hover:text-brand-700">Blog</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-brand-900 font-bold truncate max-w-xs">{post.title}</span>
        </nav>

        {/* Main Article Header */}
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-brand-100 text-brand-800 border border-brand-200">
            {post.category}
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 font-medium">
            <span className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-brand-700" />
              {post.author}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400" />
              {new Date(post.published_at).toLocaleDateString("en-IN", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400" />
              4 min read
            </span>
          </div>
        </div>

        {/* Cover Image */}
        <div className="max-w-5xl mx-auto relative h-72 sm:h-[460px] w-full rounded-3xl overflow-hidden border border-slate-200 shadow-md">
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* 2-Column Content Layout: Article + TOC / CTA Sidebar */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Main Article Body (Col 8) */}
          <article className="lg:col-span-8 bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-soft space-y-8">
            
            {/* Lead Excerpt */}
            <p className="text-lg text-slate-700 leading-relaxed font-medium pb-6 border-b border-slate-100 italic">
              &quot;{post.excerpt}&quot;
            </p>

            {/* Markdown Render (Clean typography) */}
            <div className="prose prose-slate max-w-none space-y-6 text-slate-700 leading-relaxed text-base">
              {post.content.split("\n\n").map((block, idx) => {
                if (block.startsWith("# ")) {
                  return null; // Skip main title already in H1
                }
                if (block.startsWith("## ")) {
                  return (
                    <h2
                      key={idx}
                      id={`heading-${idx}`}
                      className="text-2xl font-extrabold text-slate-900 pt-4 pb-1 border-b border-slate-100"
                    >
                      {block.replace("## ", "")}
                    </h2>
                  );
                }
                if (block.startsWith("### ")) {
                  return (
                    <h3 key={idx} className="text-xl font-bold text-slate-900 pt-2">
                      {block.replace("### ", "")}
                    </h3>
                  );
                }
                if (block.startsWith("- ") || block.startsWith("* ")) {
                  const items = block.split("\n").map((li) => li.replace(/^[-*]\s+/, ""));
                  return (
                    <ul key={idx} className="space-y-2 pl-4 list-disc marker:text-brand-600">
                      {items.map((item, i) => (
                        <li key={i} className="text-sm sm:text-base text-slate-700">
                          {item}
                        </li>
                      ))}
                    </ul>
                  );
                }
                if (block.startsWith("1. ") || block.startsWith("2. ")) {
                  const items = block.split("\n").map((li) => li.replace(/^\d+\.\s+/, ""));
                  return (
                    <ol key={idx} className="space-y-2 pl-4 list-decimal marker:text-brand-700 font-medium">
                      {items.map((item, i) => (
                        <li key={i} className="text-sm sm:text-base text-slate-700 font-normal">
                          {item}
                        </li>
                      ))}
                    </ol>
                  );
                }
                if (block.startsWith("> ")) {
                  return (
                    <blockquote
                      key={idx}
                      className="p-5 rounded-2xl bg-brand-50/80 border-l-4 border-brand-700 text-brand-950 font-medium text-sm sm:text-base not-italic"
                    >
                      {block.replace("> ", "")}
                    </blockquote>
                  );
                }
                return (
                  <p key={idx} className="text-sm sm:text-base text-slate-700 leading-relaxed">
                    {block}
                  </p>
                );
              })}
            </div>

            {/* Tags & Share */}
            <div className="pt-8 border-t border-slate-100 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-500 mr-2">Tags:</span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Share buttons */}
              <BlogShareButtons title={post.title} slug={post.slug} />
            </div>

          </article>

          {/* Sticky Sidebar (Col 4) */}
          <div className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            
            {/* Table of contents */}
            {toc.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-brand-700" />
                  Table of Contents
                </h3>
                <nav className="space-y-2 text-xs">
                  {toc.map((item, i) => (
                    <a
                      key={i}
                      href={`#heading-${i + 1}`}
                      className="block text-slate-600 hover:text-brand-800 transition-colors py-1 leading-snug"
                    >
                      {i + 1}. {item}
                    </a>
                  ))}
                </nav>
              </div>
            )}

            {/* Direct Booking CTA Card */}
            <div className="bg-gradient-to-br from-brand-900 to-brand-800 rounded-3xl p-7 text-white shadow-xl space-y-4">
              <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider bg-accent-yellow text-brand-950 rounded-full inline-block">
                Professional Cleaners Kerala
              </span>
              <h4 className="text-xl font-bold">
                Need Professional Hands for Your Home?
              </h4>
              <p className="text-xs text-brand-200 leading-relaxed">
                Save time and effort. Book PLAN C&apos;s verified specialists with industrial scrubbers and safe chemicals.
              </p>
              
              <div className="space-y-2 pt-2">
                <Link
                  href="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-white text-brand-950 hover:bg-slate-100 font-bold text-xs transition-colors shadow-md"
                >
                  <Sparkles className="w-4 h-4 text-brand-700" />
                  <span>Schedule Service Online</span>
                </Link>

              </div>
            </div>

          </div>

        </div>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="max-w-5xl mx-auto pt-12 border-t border-slate-200 space-y-6">
            <h3 className="text-2xl font-bold text-slate-900">
              More Recommended Guides
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rel) => (
                <div
                  key={rel.slug}
                  className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-soft hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative h-44 w-full overflow-hidden">
                    <Image
                      src={rel.cover_image}
                      alt={rel.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 space-y-2">
                    <h4 className="font-bold text-sm text-slate-900 group-hover:text-brand-800 transition-colors line-clamp-2">
                      <Link href={`/blog/${rel.slug}`}>{rel.title}</Link>
                    </h4>
                    <p className="text-xs text-slate-500 line-clamp-2">
                      {rel.excerpt}
                    </p>
                    <div className="pt-3 flex items-center justify-between text-xs font-bold text-brand-700">
                      <Link href={`/blog/${rel.slug}`}>Read Article</Link>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

