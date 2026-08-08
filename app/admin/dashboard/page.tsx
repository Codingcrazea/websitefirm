import React from 'react';
import Link from 'next/link';
import { getCompanyConfig } from '@/server/settings/service';
import { getAllContentItems } from '@/server/content/service';
import { ServiceItem } from '@/types/content';
import { Button } from '@/components/ui/Button';
import { Database, FileText, FolderCheck, ShieldCheck, Plus, ExternalLink, Sparkles } from 'lucide-react';

export default async function AdminDashboardPage() {
  const company = await getCompanyConfig();
  const services = await getAllContentItems<ServiceItem>('services');

  return (
    <div className="min-h-screen bg-background pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel rounded-2xl p-6 border border-gold-400/20">
          <div>
            <span className="text-xs font-semibold text-gold-300 uppercase tracking-widest flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold-400" />
              File-Based CMS Active
            </span>
            <h1 className="text-2xl font-extrabold text-white">Operational Admin Dashboard</h1>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/admin/content/blogs">
              <Button variant="primary" size="sm" className="gap-1.5">
                <Plus className="w-4 h-4" />
                Publish Blog Post
              </Button>
            </Link>
            <Link href="/admin/content/services">
              <Button variant="outline" size="sm" className="gap-1.5">
                <Plus className="w-4 h-4" />
                Publish Service
              </Button>
            </Link>
            <Link href="/" target="_blank">
              <Button variant="secondary" size="sm" className="gap-1.5">
                <ExternalLink className="w-3.5 h-3.5" />
                View Site
              </Button>
            </Link>
          </div>
        </div>

        {/* System Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-panel rounded-2xl p-6 border border-gold-400/15 space-y-2">
            <div className="flex items-center justify-between text-gold-400">
              <span className="text-xs font-semibold uppercase">Architecture</span>
              <Database className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-white">Database-Free</div>
            <div className="text-xs text-slate-400">Content stored in /content files</div>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-gold-400/15 space-y-2">
            <div className="flex items-center justify-between text-gold-400">
              <span className="text-xs font-semibold uppercase">Active Services</span>
              <FileText className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-white">{services.length} Published</div>
            <div className="text-xs text-slate-400">Managed in /content/services</div>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-gold-400/15 space-y-2">
            <div className="flex items-center justify-between text-gold-400">
              <span className="text-xs font-semibold uppercase">Media Uploads</span>
              <FolderCheck className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-white">Persistent</div>
            <div className="text-xs text-slate-400">Stored in /uploads directory</div>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-gold-400/15 space-y-2">
            <div className="flex items-center justify-between text-emerald-400">
              <span className="text-xs font-semibold uppercase">Server Health</span>
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-emerald-400">100% SLA</div>
            <div className="text-xs text-slate-400">Secure HTTP Cookie Session</div>
          </div>
        </div>

        {/* Content Actions Banner */}
        <div className="glass-panel rounded-3xl p-8 border border-gold-400/20 space-y-4">
          <h3 className="text-lg font-bold text-white">Quick Content Management Actions</h3>
          <p className="text-slate-400 text-sm">
            Create and publish dynamic Markdown content files directly from your browser. Changes update live across the entire website instantly.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link href="/admin/content/blogs">
              <Button variant="primary" size="md" className="gap-2">
                <Plus className="w-4 h-4" />
                Publish Blog Post
              </Button>
            </Link>
            <Link href="/admin/content/services">
              <Button variant="outline" size="md" className="gap-2">
                <Plus className="w-4 h-4" />
                Publish New Service
              </Button>
            </Link>
            <Link href="/admin/content/portfolio">
              <Button variant="outline" size="md" className="gap-2">
                <Plus className="w-4 h-4" />
                Publish Portfolio Item
              </Button>
            </Link>
            <Link href="/admin/content/case-studies">
              <Button variant="outline" size="md" className="gap-2">
                <Plus className="w-4 h-4" />
                Publish Case Study
              </Button>
            </Link>
          </div>
        </div>

        {/* Published Services Grid */}
        <div className="glass-panel rounded-3xl p-8 border border-slate-800 space-y-6">
          <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-4">
            Published Services & Solutions Content
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((item) => (
              <div
                key={item.slug}
                className="p-4 rounded-xl bg-surface-dark border border-gold-400/10 space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-mono text-gold-400 mb-1">/content/services/{item.slug}.md</div>
                  <div className="font-semibold text-white text-sm">{item.title}</div>
                  <div className="text-xs text-slate-400 line-clamp-2 mt-1">{item.description}</div>
                </div>
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-medium">✓ Published</span>
                  <Link href={`/services/${item.slug}`} className="text-gold-300 hover:underline">
                    Preview Page →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
