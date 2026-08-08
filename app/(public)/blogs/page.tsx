import React from 'react';
import Link from 'next/link';
import { getAllContentItems } from '@/server/content/service';
import { generateCustomMetadata } from '@/server/seo/generator';
import { BlogItem } from '@/types/content';
import { Sparkles, Clock, User, ArrowRight } from 'lucide-react';

export async function generateMetadata() {
  return await generateCustomMetadata({
    title: 'Engineering Blog & Technical Insights',
    description: 'Read technical insights on software architecture, Next.js, AI automation, and zero-trust security.',
    slug: 'blogs',
  });
}

export default async function BlogListingPage() {
  const blogs = await getAllContentItems<BlogItem>('blogs');

  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-xs font-semibold uppercase">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Architectural Insights</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            Technical <span className="gold-gradient-text">Engineering Blog</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Deep-dive articles on enterprise system design, database-free architecture, and AI automation pipelines.
          </p>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div key={blog.slug} className="glass-panel glass-panel-hover rounded-3xl p-6 border border-gold-400/20 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="text-gold-300 font-semibold px-2.5 py-1 rounded-md bg-gold-400/10 border border-gold-400/20">
                    {blog.category}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-gold-400" />
                    {blog.readingTime || '5 min'}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-gold-300 transition-colors">
                  {blog.title}
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed line-clamp-3">{blog.description}</p>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <User className="w-3.5 h-3.5 text-gold-400" />
                  <span>{blog.author?.name || 'NexusCraft Team'}</span>
                </div>
                <Link
                  href={`/blogs/${blog.slug}`}
                  className="text-xs font-semibold text-gold-300 hover:text-gold-200 flex items-center gap-1"
                >
                  Read Article
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
