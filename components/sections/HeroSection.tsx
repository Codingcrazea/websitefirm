'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '../ui/Button';
import { ArrowRight, Shield, Zap, Sparkles, Terminal, Code } from 'lucide-react';
import { CompanyConfig } from '@/types/config';

interface HeroSectionProps {
  company: CompanyConfig;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ company }) => {
  return (
    <section className="relative min-h-screen pt-32 pb-20 flex items-center justify-center overflow-hidden bg-background">
      {/* Ambient Lighting Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gold-400/10 blur-[150px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 left-1/4 w-[350px] h-[350px] bg-gold-600/5 blur-[120px] pointer-events-none rounded-full" />

      {/* Grid Mesh Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#121722_1px,transparent_1px),linear-gradient(to_bottom,#121722_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Hero Copy */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            {/* Enterprise Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-panel border border-gold-400/30 text-gold-300 text-xs font-semibold uppercase tracking-wider shadow-gold-glow">
              <Sparkles className="w-3.5 h-3.5 text-gold-400 animate-pulse" />
              <span>Next-Gen Enterprise Architecture</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
              Architecting <span className="gold-gradient-text">Scalable Software</span> & Autonomous AI Systems
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed mx-auto lg:mx-0">
              {company.description} Engineered for high availability, zero database overhead, and bank-grade zero-trust security.
            </p>

            {/* Dual CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link href="/contact" className="w-full sm:w-auto">
                <Button variant="primary" size="lg" className="w-full sm:w-auto gap-2">
                  Request Proposal
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/services" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explore Solutions
                </Button>
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="pt-6 border-t border-slate-800/80 flex items-center justify-center lg:justify-start gap-8 text-xs font-medium text-slate-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-gold-400" />
                <span>Zero Database Overhead</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-gold-400" />
                <span>99.99% Guaranteed SLA</span>
              </div>
            </div>
          </div>

          {/* Right Column: Floating Glassmorphic Code Card */}
          <div className="lg:col-span-5 relative">
            <div className="glass-panel rounded-2xl p-6 border border-gold-400/25 shadow-2xl relative z-10 backdrop-blur-xl">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <span className="ml-2 font-mono text-xs text-slate-400">enterprise-system.ts</span>
                </div>
                <Terminal className="w-4 h-4 text-gold-400" />
              </div>

              {/* Code Snippet */}
              <div className="font-mono text-xs space-y-2.5 text-slate-300 overflow-x-auto py-2">
                <p className="text-purple-400">
                  <span className="text-blue-400">export async function</span> <span className="text-gold-300">deploySystem</span>() &#123;
                </p>
                <p className="pl-4 text-slate-400">
                  <span className="text-blue-400">const</span> architecture = <span className="text-green-400">&apos;Database-Free File CMS&apos;</span>;
                </p>
                <p className="pl-4 text-slate-400">
                  <span className="text-blue-400">const</span> security = <span className="text-green-400">&apos;HTTP-Only Secure Cookies&apos;</span>;
                </p>
                <p className="pl-4 text-slate-400">
                  <span className="text-blue-400">const</span> performance = <span className="text-gold-300">99.99</span>;
                </p>
                <p className="pl-4 text-slate-400">
                  <span className="text-blue-400">return</span> await <span className="text-gold-300">Nodemailer</span>.dispatchLead();
                </p>
                <p className="text-purple-400">&#125;</p>
              </div>

              {/* Floating Metric Card Overlay */}
              <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-between bg-surface-dark/90 p-3 rounded-xl border border-gold-400/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gold-400/10 text-gold-400">
                    <Code className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">System Status</div>
                    <div className="text-[11px] text-emerald-400">100% Operational & Verified</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-gold-300">0ms DB Delay</span>
                </div>
              </div>
            </div>

            {/* Back Glow Effect */}
            <div className="absolute inset-0 bg-gold-400/15 blur-3xl rounded-full transform scale-90 -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
};
