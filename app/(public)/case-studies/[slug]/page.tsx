import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getContentBySlug, getAllContentItems } from '@/server/content/service';
import { generateCustomMetadata } from '@/server/seo/generator';
import { CaseStudyItem } from '@/types/content';
import { ArrowLeft, Sparkles, ShieldCheck, CheckCircle2, Cpu, Calendar, UserCheck, Layers, ArrowRight } from 'lucide-react';

import CaseStudyGallery from '@/components/case-studies/CaseStudyGallery';
import BeforeAfterSlider from '@/components/case-studies/BeforeAfterSlider';
import LifecyclePipeline from '@/components/case-studies/LifecyclePipeline';
import FeatureMatrixTable from '@/components/case-studies/FeatureMatrixTable';
import AuditFindingsList from '@/components/case-studies/AuditFindingsList';
import RoadmapGrid from '@/components/case-studies/RoadmapGrid';

interface CaseStudyDetailProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const caseStudies = await getAllContentItems<CaseStudyItem>('case-studies');
  return caseStudies.map((study) => ({
    slug: study.slug,
  }));
}

export async function generateMetadata({ params }: CaseStudyDetailProps) {
  const result = await getContentBySlug<CaseStudyItem>('case-studies', params.slug);
  if (!result) return {};

  const study = result.data as CaseStudyItem;
  return await generateCustomMetadata({
    title: `${study.title} | Case Study Audit`,
    description: study.description,
    slug: `case-studies/${study.slug}`,
  });
}

export default async function CaseStudyDetailPage({ params }: CaseStudyDetailProps) {
  const result = await getContentBySlug<CaseStudyItem>('case-studies', params.slug);

  if (!result) {
    notFound();
  }

  const study = result.data as CaseStudyItem;

  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Navigation & Header Hero */}
        <div className="space-y-6">
          <Link
            href="/case-studies"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-gold-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Case Studies</span>
          </Link>

          <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-gold-400/20 space-y-8 relative overflow-hidden">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3.5 py-1.5 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                <span>{study.category || 'Architecture Audit'}</span>
              </span>
              <span className="px-3 py-1 rounded-full bg-surface-dark text-slate-400 border border-slate-800 text-xs font-medium">
                {study.industry}
              </span>
              {study.status && (
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">
                  {study.status}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
              {study.title}
            </h1>

            <p className="text-slate-300 text-base sm:text-xl leading-relaxed max-w-4xl">
              {study.overviewSummary || study.description}
            </p>

            {/* Key Metadata Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Client Organization</span>
                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>{study.clientName}</span>
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Architect Role</span>
                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>{study.role || 'Lead Auditor'}</span>
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Published Date</span>
                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>{study.publishDate}</span>
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">Core Focus</span>
                <span className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>{study.industry}</span>
                </span>
              </div>
            </div>

            {/* Tech Stack Pills */}
            {study.technologies && study.technologies.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-[10px] text-gold-400 font-semibold uppercase tracking-wider block">Technologies & Infrastructure Stack</span>
                <div className="flex flex-wrap gap-2">
                  {study.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono font-semibold px-3 py-1 rounded-lg bg-surface-dark text-slate-200 border border-slate-800"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Results Metrics Highlights */}
        {study.results && study.results.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {study.results.map((res, idx) => (
              <div
                key={idx}
                className="glass-panel p-6 rounded-2xl border border-gold-400/20 text-center space-y-2"
              >
                <div className="text-3xl sm:text-4xl font-extrabold text-gold-300 gold-gradient-text">
                  {res.metric}
                </div>
                <div className="text-xs text-slate-300 font-semibold">
                  {res.label || res.description}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Overview Problems & Challenges */}
        {study.overviewProblems && study.overviewProblems.length > 0 && (
          <div className="glass-panel rounded-3xl p-8 border border-gold-400/15 space-y-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-gold-400" />
              <span>Core Architectural Challenges & Problem Statements</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {study.overviewProblems.map((prob, idx) => (
                <div
                  key={idx}
                  className="p-5 rounded-2xl bg-surface-dark border border-slate-800 text-slate-300 text-xs sm:text-sm leading-relaxed flex items-start gap-3"
                >
                  <div className="w-2.5 h-2.5 rounded-full bg-gold-400 mt-1.5 shrink-0 shadow-[0_0_8px_rgba(223,183,108,0.8)]" />
                  <p>{prob}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dashboard Screenshot Gallery */}
        {study.dashboardImages && study.dashboardImages.length > 0 && (
          <CaseStudyGallery images={study.dashboardImages} title={study.title} />
        )}

        {/* Before / After UI Drag Slider */}
        {study.beforeImage && study.afterImage && (
          <BeforeAfterSlider beforeImage={study.beforeImage} afterImage={study.afterImage} />
        )}

        {/* Request-Response Lifecycle Flow */}
        {study.lifecycleSteps && study.lifecycleSteps.length > 0 && (
          <LifecyclePipeline steps={study.lifecycleSteps} />
        )}

        {/* Feature Matrix Table */}
        {study.features && study.features.length > 0 && (
          <FeatureMatrixTable features={study.features} />
        )}

        {/* Technical Code Audit & Security Findings */}
        <AuditFindingsList highlights={study.auditHighlights} bugs={study.auditBugs} />

        {/* Architectural Refactoring Roadmap */}
        {study.recommendations && study.recommendations.length > 0 && (
          <RoadmapGrid recommendations={study.recommendations} />
        )}

        {/* Enterprise Call To Action (CTA) */}
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-gold-400/30 text-center space-y-6 relative overflow-hidden bg-gradient-to-br from-surface to-slate-950">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl font-extrabold text-white">
              Need an Enterprise <span className="gold-gradient-text">Architecture Audit?</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Our principal software architects audit multi-tenant SaaS codebases, optimize database schema performance, and engineer zero-downtime cloud migration strategies.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gold-400 hover:bg-gold-300 text-slate-950 text-sm font-bold transition-all shadow-xl shadow-gold-400/20 hover:scale-105"
            >
              <span>Schedule Technical Consultation</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/case-studies"
              className="inline-flex items-center gap-2 px-6 py-4 rounded-2xl bg-surface-dark hover:bg-slate-800 text-slate-300 border border-slate-700 text-sm font-semibold transition-all"
            >
              <span>Browse Other Case Studies</span>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
