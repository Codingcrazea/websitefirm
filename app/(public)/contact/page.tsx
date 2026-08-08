import React from 'react';
import { getCompanyConfig } from '@/server/settings/service';
import { generateCustomMetadata } from '@/server/seo/generator';
import { ContactForm } from '@/components/forms/ContactForm';
import { Sparkles, Mail, Phone, MapPin, Clock } from 'lucide-react';

export async function generateMetadata() {
  return await generateCustomMetadata({
    title: 'Contact Us & Book Proposal Call',
    description: 'Contact NexusCraft Technologies engineering team for enterprise software, AI automation, and cloud proposals.',
    slug: 'contact',
  });
}

export default async function ContactPage() {
  const company = await getCompanyConfig();

  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-xs font-semibold uppercase">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Direct Lead Consultation</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            Let&apos;s Build Your Next <span className="gold-gradient-text">Enterprise System</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Have a project scope or architecture question? Get in touch directly with our senior software architects.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Information Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-panel rounded-3xl p-8 border border-gold-400/20 space-y-6">
              <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-4">Executive Direct Channels</h3>
              
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-gold-400/10 text-gold-400 border border-gold-400/20">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase">Sales & Proposals</div>
                  <div className="text-base font-bold text-white">{company.salesEmail}</div>
                  <div className="text-xs text-slate-400">{company.email}</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-gold-400/10 text-gold-400 border border-gold-400/20">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase">Phone & WhatsApp</div>
                  <div className="text-base font-bold text-white">{company.phone}</div>
                  <div className="text-xs text-slate-400">WhatsApp: {company.whatsapp}</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-gold-400/10 text-gold-400 border border-gold-400/20">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase">Global Headquarters</div>
                  <div className="text-sm font-medium text-white">{company.address}</div>
                  <div className="text-xs text-slate-400">{company.country}</div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-2xl bg-gold-400/10 text-gold-400 border border-gold-400/20">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-slate-400 uppercase">Response SLA</div>
                  <div className="text-sm font-medium text-white">24 Business Hours Guaranteed</div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Column */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
