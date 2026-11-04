import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "@/types";
import { ArrowRight } from "lucide-react";

export default function HomeBlogSection({ posts }: { posts: BlogPost[] }) {
  const latestPosts = posts.slice(0, 3);

  return (
    <section className="bg-slate-50/70 py-20 md:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand-700">
              OUR BLOGS
            </p>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Maintenance &amp; Pest Insights
            </h2>
            <p className="text-[15px] text-slate-500">
              Guidance tailored for Kerala&apos;s climate, monsoons, humidity, and water tank cleanliness standards.
            </p>
          </div>

          <Link
            href="/blog"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-brand-800 hover:text-brand-900"
          >
            <span>View All Articles</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        {/* 3 Blog Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {latestPosts.map((post) => (
            <article
              key={post.slug}
              className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white transition-all duration-200 hover:border-slate-300 hover:shadow-soft-lg"
            >
              <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                <Image
                  src={post.cover_image}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />
              </div>

              <div className="flex flex-1 flex-col justify-between space-y-4 p-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold uppercase tracking-wider text-brand-700">
                      {post.category}
                    </span>
                    <span className="text-slate-400">4 min read</span>
                  </div>

                  <h3 className="text-[17px] font-semibold leading-snug tracking-tight text-slate-900 transition-colors group-hover:text-brand-900">
                    <Link href={`/blog/${post.slug}`}>
                      {post.title}
                    </Link>
                  </h3>

                  <p className="line-clamp-2 text-sm leading-relaxed text-slate-600">
                    {post.excerpt}
                  </p>
                </div>

                <div className="border-t border-slate-100 pt-4">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-800 transition-all hover:gap-2.5 hover:text-brand-900"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>

      </div>
    </section>
  );
}
