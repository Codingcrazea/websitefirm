import React from 'react';
import Link from 'next/link';
import { getAllContentItems } from '@/server/content/service';
import { generateCustomMetadata } from '@/server/seo/generator';
import { PortfolioItem } from '@/types/content';
import { Sparkles, ArrowRight, ExternalLink } from 'lucide-react';

export async function generateMetadata() {
  return await generateCustomMetadata({
    title: 'Client Portfolio & Enterprise Systems',
    description: 'Discover software systems and AI platforms built by NexusCraft Technologies for global clients.',
    slug: 'portfolio',
  });
}

export default async function PortfolioPage() {
  const portfolio = await getAllContentItems<PortfolioItem>('portfolio');

  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-xs font-semibold uppercase">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Proven Engineering Track Record</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            Featured <span className="gold-gradient-text">Portfolio Showcase</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Real-world systems engineered for high performance, compliance, and enterprise scale.
          </p>
        </div>

        {/* Portfolio Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {portfolio.map((item) => (
            <div key={item.slug} className="glass-panel rounded-3xl p-8 border border-gold-400/20 space-y-6 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="text-gold-300 font-semibold uppercase">{item.industry}</span>
                  <span>{item.client}</span>
                </div>
                <h3 className="text-2xl font-bold text-white">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.description}</p>
                {item.businessResults && (
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800">
                    {item.businessResults.map((res, i) => (
                      <div key={i} className="p-3 rounded-xl bg-surface-dark border border-gold-400/10">
                        <div className="text-xl font-bold text-gold-300">{res.metric}</div>
                        <div className="text-xs text-slate-400">{res.label}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
