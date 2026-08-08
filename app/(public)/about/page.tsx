import React from 'react';
import { getCompanyConfig } from '@/server/settings/service';
import { generateCustomMetadata } from '@/server/seo/generator';
import { Sparkles, Shield, Cpu, Award, Users } from 'lucide-react';

export async function generateMetadata() {
  return await generateCustomMetadata({
    title: 'About Us & Company Story',
    description: 'Learn about NexusCraft Technologies engineering mission, values, and enterprise software architecture philosophy.',
    slug: 'about',
  });
}

export default async function AboutPage() {
  const company = await getCompanyConfig();

  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-xs font-semibold uppercase">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Our Engineering Mission</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            Engineering the <span className="gold-gradient-text">Future of Digital Assets</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            {company.description} We combine high-performance software architecture with modern AI automation.
          </p>
        </div>

        {/* Core Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-panel rounded-3xl p-8 border border-gold-400/20 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400">
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Engineering Excellence</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              We build systems with strict TypeScript types, zero database overhead, and clean decoupled service boundaries.
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-8 border border-gold-400/20 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Zero-Trust Security</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Bank-grade security headers, encrypted session cookies, and strict IP rate limiting on all public API boundaries.
            </p>
          </div>

          <div className="glass-panel rounded-3xl p-8 border border-gold-400/20 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center text-gold-400">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-white">Guaranteed Performance</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              99.99% uptime guarantee with sub-second page delivery across global edge networks.
            </p>
          </div>
        </div>

        {/* Contact Info Card */}
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-gold-400/25 max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl font-bold text-white">Corporate Headquarters & Contact</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-slate-300">
            <div>
              <span className="text-xs text-gold-400 uppercase font-semibold block mb-1">Address</span>
              <p>{company.address}</p>
              <p>{company.country}</p>
            </div>
            <div>
              <span className="text-xs text-gold-400 uppercase font-semibold block mb-1">Direct Contact</span>
              <p>Email: {company.email}</p>
              <p>Sales: {company.salesEmail}</p>
              <p>Phone: {company.phone}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
