'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Save, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminContentEditorPage({ params }: { params: { type: string } }) {
  const contentType = params.type || 'blogs';
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Engineering Architecture');
  const [authorName, setAuthorName] = useState('Sanskar');
  const [authorRole, setAuthorRole] = useState('Lead Systems Architect');
  const [readingTime, setReadingTime] = useState('5 min read');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    const autoSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    setSlug(autoSlug);
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    const frontmatter = {
      title,
      slug,
      description,
      published: true,
      publishDate: new Date().toISOString().split('T')[0],
      category,
      tags: ['Nextjs', 'Enterprise', 'Architecture'],
      author: {
        name: authorName,
        role: authorRole,
        avatar: '/brand/author-avatar.webp',
      },
      readingTime,
    };

    try {
      const res = await fetch(`/api/admin/content/${contentType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          frontmatter,
          content,
        }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({
          type: 'success',
          message: `Post Published! Created file at /content/${contentType}/${slug}.md. Live on website instantly.`,
        });
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 1500);
      } else {
        setStatus({
          type: 'error',
          message: data.error || 'Failed to publish content',
        });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Network error while saving file.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          href="/admin/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-gold-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Admin Dashboard
        </Link>

        <div className="glass-panel rounded-3xl p-8 sm:p-10 border border-gold-400/30 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-xs font-semibold text-gold-400 uppercase tracking-widest">
                Database-Free File Publisher
              </span>
              <h1 className="text-2xl font-extrabold text-white capitalize">
                Create & Publish New {contentType.replace(/-/g, ' ')}
              </h1>
            </div>
            <Sparkles className="w-6 h-6 text-gold-400" />
          </div>

          {status.type === 'success' && (
            <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span>{status.message}</span>
            </div>
          )}

          {status.type === 'error' && (
            <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-sm flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
              <span>{status.message}</span>
            </div>
          )}

          <form onSubmit={handlePublish} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={handleTitleChange}
                  placeholder="e.g. Next.js 14 Enterprise Architecture"
                  className="w-full px-4 py-3 rounded-xl bg-surface-dark border border-slate-700 text-white focus:outline-none focus:border-gold-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  File Slug (URL Path) *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. nextjs-enterprise-architecture"
                  className="w-full px-4 py-3 rounded-xl bg-surface-dark border border-slate-700 text-white focus:outline-none focus:border-gold-400 font-mono text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Short Excerpt / Description *
              </label>
              <textarea
                required
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A brief summary for card preview and search engine snippet..."
                className="w-full px-4 py-3 rounded-xl bg-surface-dark border border-slate-700 text-white focus:outline-none focus:border-gold-400 text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Category
                </label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-dark border border-slate-700 text-white focus:outline-none focus:border-gold-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Author Name
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-dark border border-slate-700 text-white focus:outline-none focus:border-gold-400 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Reading Time
                </label>
                <input
                  type="text"
                  value={readingTime}
                  onChange={(e) => setReadingTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-dark border border-slate-700 text-white focus:outline-none focus:border-gold-400 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Markdown Body Content *
              </label>
              <textarea
                required
                rows={10}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="# Write your Markdown post here...&#10;&#10;## Section Title&#10;Add your detailed article content using standard Markdown syntax."
                className="w-full px-4 py-3 rounded-xl bg-surface-dark border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-gold-400"
              />
            </div>

            <Button type="submit" variant="primary" size="lg" isLoading={loading} className="w-full gap-2">
              <Save className="w-4 h-4" />
              Publish Content to Server File
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
