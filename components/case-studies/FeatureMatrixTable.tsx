'use client';

import React, { useState, useMemo } from 'react';
import { Layers, Search, CheckCircle2, Clock, Sparkles } from 'lucide-react';

interface FeatureItem {
  category: string;
  component: string;
  desc: string;
  status: string;
}

interface FeatureMatrixTableProps {
  features: FeatureItem[];
}

export default function FeatureMatrixTable({ features }: FeatureMatrixTableProps) {
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const categories = useMemo(() => {
    if (!features) return ['All'];
    const cats = Array.from(new Set(features.map((f) => f.category)));
    return ['All', ...cats];
  }, [features]);

  const filteredFeatures = useMemo(() => {
    if (!features) return [];
    return features.filter((item) => {
      const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
      const matchesSearch =
        item.component.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [features, activeCategory, searchTerm]);

  if (!features || features.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-gold-400" />
            <span>Complete Feature Matrix & Implementation Status</span>
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            {features.length} core platform subsystems and status flags
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search features..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-surface-dark border border-slate-800 focus:border-gold-400/50 text-xs text-white rounded-xl pl-9 pr-3 py-2 outline-none transition-all placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`text-xs px-3.5 py-1.5 rounded-full whitespace-nowrap font-medium transition-all ${
              activeCategory === cat
                ? 'bg-gold-400 text-slate-950 font-bold shadow-md shadow-gold-400/20'
                : 'bg-surface-dark text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Features List Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFeatures.map((item, idx) => {
          const isImplemented = item.status === 'Implemented';
          const isSchemaReady = item.status === 'Schema Ready';

          return (
            <div
              key={idx}
              className="glass-panel p-5 rounded-2xl border border-slate-800/80 hover:border-gold-400/30 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700">
                  {item.category}
                </span>

                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5 border ${
                    isImplemented
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : isSchemaReady
                      ? 'bg-gold-400/10 text-gold-400 border-gold-400/20'
                      : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                  }`}
                >
                  {isImplemented ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : isSchemaReady ? (
                    <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                  ) : (
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  )}
                  <span>{item.status}</span>
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white mb-1">{item.component}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
