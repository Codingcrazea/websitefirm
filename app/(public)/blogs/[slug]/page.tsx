import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getContentBySlug, getAllContentItems } from '@/server/content/service';
import { generateCustomMetadata } from '@/server/seo/generator';
import { BlogItem } from '@/types/content';
import { ArrowLeft, Clock, User } from 'lucide-react';

export async function generateStaticParams() {
  const blogs = await getAllContentItems<BlogItem>('blogs');
  return blogs.map((blog) => ({ slug: blog.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const blog = await getContentBySlug<BlogItem>('blogs', params.slug);
  if (!blog) return {};
  return generateCustomMetadata({
    title: blog.data.title,
    description: blog.data.description,
    slug: `blogs/${params.slug}`,
  });
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const blogResult = await getContentBySlug<BlogItem>('blogs', params.slug);

  if (!blogResult) {
    notFound();
  }

  const { data, htmlContent } = blogResult;
  const blog = data as BlogItem;

  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          href="/blogs"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-gold-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog Listing
        </Link>

        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-gold-400/20 space-y-6">
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="text-gold-300 font-semibold px-3 py-1 rounded-full bg-gold-400/10 border border-gold-400/20">
              {blog.category}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-gold-400" />
              {blog.readingTime || '5 min'}
            </span>
            <span>Published: {blog.publishDate}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">{blog.title}</h1>

          <div className="flex items-center gap-3 pt-4 border-t border-slate-800 text-sm text-slate-300">
            <div className="w-8 h-8 rounded-full bg-gold-400/20 flex items-center justify-center text-gold-400 font-bold">
              <User className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-white">{blog.author?.name || 'NexusCraft Team'}</div>
              <div className="text-xs text-slate-400">{blog.author?.role || 'System Architect'}</div>
            </div>
          </div>
        </div>

        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-800 text-slate-300 prose prose-invert max-w-none prose-gold leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>
      </div>
    </div>
  );
}
