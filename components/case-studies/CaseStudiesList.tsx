'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { CaseStudyItem } from '@/types/content';
import { Search, ArrowRight, Layers, ShieldCheck, Sparkles, Code2, ExternalLink } from 'lucide-react';

interface CaseStudiesListProps {
  caseStudies: CaseStudyItem[];
}

export default function CaseStudiesList({ caseStudies }: CaseStudiesListProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const categories = useMemo(() => {
    const cats = new Set<string>();
    caseStudies.forEach((item) => {
      if (item.category) cats.add(item.category);
    });
    return ['All', ...Array.from(cats)];
  }, [caseStudies]);

  const filteredStudies = useMemo(() => {
    return caseStudies.filter((item) => {
      const matchesCategory =
        activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch =
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.industry && item.industry.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.technologies &&
          item.technologies.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase())));
      return matchesCategory && matchesSearch;
    });
  }, [caseStudies, activeCategory, searchTerm]);

  return (
    <div className="space-y-10">
      {/* Search and Category Filter Header */}
      <div className="glass-panel p-6 rounded-3xl border border-gold-400/20 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-gold-400" />
            <h2 className="text-lg font-bold text-white">Filter Case Studies</h2>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, stack, industry..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surface-dark border border-slate-800 focus:border-gold-400/50 text-xs text-white rounded-xl pl-10 pr-4 py-2.5 outline-none transition-all placeholder:text-slate-500"
            />
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`text-xs px-4 py-2 rounded-full whitespace-nowrap font-medium transition-all ${
                activeCategory === cat
                  ? 'bg-gold-400 text-slate-950 font-bold shadow-lg shadow-gold-400/20'
                  : 'bg-surface-dark text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Case Studies */}
      {filteredStudies.length === 0 ? (
        <div className="glass-panel p-12 rounded-3xl border border-slate-800 text-center space-y-3">
          <p className="text-slate-400 text-sm">No case studies match your search criteria.</p>
          <button
            onClick={() => {
              setActiveCategory('All');
              setSearchTerm('');
            }}
            className="text-xs font-semibold text-gold-400 underline hover:text-gold-300"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {filteredStudies.map((study) => (
            <div
              key={study.slug}
              className="glass-panel glass-panel-hover rounded-3xl p-6 sm:p-8 border border-gold-400/20 flex flex-col lg:flex-row gap-8 items-stretch justify-between group"
            >
              {/* Left Column: Hero Image Preview */}
              {study.mainImage && (
                <div className="lg:w-2/5 rounded-2xl overflow-hidden bg-surface-dark border border-slate-800 flex items-center justify-center p-3 relative shrink-0 min-h-[220px]">
                  <img
                    src={study.mainImage}
                    alt={study.title}
                    className="w-full h-full object-contain max-h-[260px] group-hover:scale-105 transition-transform duration-500"
                  />
                  {study.category && (
                    <span className="absolute top-4 left-4 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-gold-400/20 text-gold-300 border border-gold-400/30 backdrop-blur-md">
                      {study.category}
                    </span>
                  )}
                </div>
              )}

              {/* Right Column: Content & Metadata */}
              <div className="lg:w-3/5 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="text-gold-300 font-semibold uppercase tracking-wider">{study.industry}</span>
                    <span className="text-slate-400">{study.clientName}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white group-hover:text-gold-300 transition-colors">
                    {study.title}
                  </h3>

                  <p className="text-slate-300 text-sm leading-relaxed line-clamp-3">
                    {study.description}
                  </p>

                  {/* Tech Stack Pills */}
                  {study.technologies && study.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {study.technologies.slice(0, 6).map((tech, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-surface-dark text-slate-300 border border-slate-800"
                        >
                          {tech}
                        </span>
                      ))}
                      {study.technologies.length > 6 && (
                        <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-surface-dark text-gold-400 border border-slate-800">
                          +{study.technologies.length - 6} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* Key Results */}
                  {study.results && study.results.length > 0 && (
                    <div className="grid grid-cols-3 gap-3 pt-3 border-t border-slate-800/80">
                      {study.results.map((res, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-gold-400/5 border border-gold-400/10 text-center">
                          <div className="text-lg font-bold text-gold-300">{res.metric}</div>
                          <div className="text-[10px] text-slate-400 truncate">{res.label || res.description}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer CTA Buttons */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <span className="text-xs text-slate-400 font-medium">
                    {study.role || 'Enterprise System Audit'}
                  </span>
                  <div className="flex items-center gap-2">
                    {(study.projectUrl || study.liveUrl) && (
                      <a
                        href={study.projectUrl || study.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-dark hover:bg-slate-800 text-gold-300 border border-gold-400/30 text-xs font-semibold transition-all hover:scale-105"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-gold-400" />
                        <span>Visit Live Project</span>
                      </a>
                    )}
                    <Link
                      href={`/case-studies/${study.slug}`}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-400 hover:bg-gold-300 text-slate-950 text-xs font-bold transition-all shadow-md hover:shadow-gold-400/30 group-hover:translate-x-1"
                    >
                      <span>Read Deep-Dive Audit</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
