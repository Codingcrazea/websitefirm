import React from 'react';
import { getAllContentItems } from '@/server/content/service';
import { generateCustomMetadata } from '@/server/seo/generator';
import { CaseStudyItem } from '@/types/content';
import { Sparkles } from 'lucide-react';
import CaseStudiesList from '@/components/case-studies/CaseStudiesList';

export async function generateMetadata() {
  return await generateCustomMetadata({
    title: 'Enterprise Case Studies & Architectural Audits',
    description: 'In-depth case studies on cloud migration, AI integration, multi-tenant security, and software architecture audits.',
    slug: 'case-studies',
  });
}

export default async function CaseStudiesPage() {
  const caseStudies = await getAllContentItems<CaseStudyItem>('case-studies');

  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-xs font-semibold uppercase">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Proven Engineering Architecture</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            Enterprise <span className="gold-gradient-text">Case Studies & Audits</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Detailed technical breakdowns of complex software engineering challenges, multi-tenant architectures, and security audits solved by our lead architects.
          </p>
        </div>

        {/* Interactive Case Studies List */}
        <CaseStudiesList caseStudies={caseStudies} />
      </div>
    </div>
  );
}
