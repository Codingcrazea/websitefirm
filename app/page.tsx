import React from 'react';
import { getCompanyConfig } from '@/server/settings/service';
import { getAllContentItems } from '@/server/content/service';
import { ServiceItem } from '@/types/content';
import { HeroSection } from '@/components/sections/HeroSection';
import { ServicesSection } from '@/components/sections/ServicesSection';
import { StatsSection } from '@/components/sections/StatsSection';
import { ContactForm } from '@/components/forms/ContactForm';
import { Sparkles, CheckCircle2 } from 'lucide-react';

export default async function HomePage() {
  const company = await getCompanyConfig();
  const services = await getAllContentItems<ServiceItem>('services');

  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <HeroSection company={company} />

      {/* Key Metrics & Stats Section */}
      <StatsSection company={company} />

      {/* Prominent Services Section (3-Column Glassmorphism Grid) */}
      <ServicesSection services={services} />

      {/* Why Choose Us & Process Banner */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel rounded-3xl p-10 lg:p-16 border border-gold-400/20 relative overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/10 text-gold-300 text-xs font-semibold uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                  Engineering Standard
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                  Why Leading Enterprises Trust <span className="gold-gradient-text">{company.companyName}</span>
                </h2>
                <p className="text-slate-400 leading-relaxed text-sm sm:text-base">
                  We eliminate database bloat, guarantee sub-second page performance, and enforce strict zero-trust security architecture across all deployments.
                </p>
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-3 text-slate-300 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0" />
                    <span>Database-Free Architecture with zero external database vulnerability vectors</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0" />
                    <span>Strict HTTP-Only Cookie Authentication & Encrypted Session Management</span>
                  </div>
                  <div className="flex items-center gap-3 text-slate-300 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-gold-400 shrink-0" />
                    <span>Nodemailer Direct Email Pipeline for instant sales notification</span>
                  </div>
                </div>
              </div>

              {/* Proposal Form Container */}
              <div>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
