import React from 'react';
import Link from 'next/link';
import { CompanyConfig, NavigationConfig } from '@/types/config';
import { Phone, Mail, MapPin, MessageSquare, Linkedin, Github, Twitter, Youtube } from 'lucide-react';
import { CallButton } from '../ui/CallButton';

interface FooterProps {
  company: CompanyConfig;
  nav: NavigationConfig;
}

export const Footer: React.FC<FooterProps> = ({ company, nav }) => {
  return (
    <footer className="bg-surface-dark border-t border-gold-glass pt-16 pb-12 relative overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-gold-400/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-12 border-b border-slate-800">
          {/* Brand & Direct Contact Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-gold-600 via-gold-400 to-gold-200 flex items-center justify-center p-0.5 shadow-gold-glow">
                <div className="w-full h-full bg-background rounded-[10px] flex items-center justify-center">
                  <span className="font-bold text-gold-300 text-xl tracking-tighter">N</span>
                </div>
              </div>
              <span className="font-bold text-xl text-white tracking-tight">{company.companyName}</span>
            </Link>
            <p className="text-slate-400 text-sm max-w-sm leading-relaxed">{company.description}</p>
            
            {/* Direct Contact Block */}
            <div className="pt-2 text-xs text-slate-300 space-y-2.5">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gold-400 shrink-0" />
                <span>{company.address}, {company.country}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold-400 shrink-0" />
                <a href={`mailto:${company.salesEmail}`} className="hover:text-gold-300 transition-colors">
                  {company.salesEmail} ({company.email})
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gold-400 shrink-0" />
                <a href={`tel:${company.phone.replace(/[^0-9+]/g, '')}`} className="font-mono font-semibold text-gold-300 hover:underline">
                  {company.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <MessageSquare className="w-4 h-4 shrink-0" />
                <a href={`https://wa.me/${company.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                  WhatsApp: {company.whatsapp}
                </a>
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {company.social?.linkedin && (
                <a href={company.social.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-surface-light border border-slate-800 hover:border-gold-400/50 text-slate-400 hover:text-gold-300 transition-colors">
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {company.social?.github && (
                <a href={company.social.github} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-surface-light border border-slate-800 hover:border-gold-400/50 text-slate-400 hover:text-gold-300 transition-colors">
                  <Github className="w-4 h-4" />
                </a>
              )}
              {company.social?.twitter && (
                <a href={company.social.twitter} target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-surface-light border border-slate-800 hover:border-gold-400/50 text-slate-400 hover:text-gold-300 transition-colors">
                  <Twitter className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-gold-400 pl-2">
              Solutions
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/services/ai-automation" className="text-slate-400 hover:text-gold-300 transition-colors">
                  AI Automation
                </Link>
              </li>
              <li>
                <Link href="/services/enterprise-software" className="text-slate-400 hover:text-gold-300 transition-colors">
                  Enterprise Software
                </Link>
              </li>
              <li>
                <Link href="/services/cloud-devops" className="text-slate-400 hover:text-gold-300 transition-colors">
                  Cloud Infrastructure
                </Link>
              </li>
              <li>
                <Link href="/services/cybersecurity" className="text-slate-400 hover:text-gold-300 transition-colors">
                  Cybersecurity
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-gold-400 pl-2">
              Company
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="text-slate-400 hover:text-gold-300 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/portfolio" className="text-slate-400 hover:text-gold-300 transition-colors">
                  Portfolio
                </Link>
              </li>
              <li>
                <Link href="/case-studies" className="text-slate-400 hover:text-gold-300 transition-colors">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link href="/blogs" className="text-slate-400 hover:text-gold-300 transition-colors">
                  Insights & Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-gold-400 pl-2">
              Admin & System
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/admin/login" className="text-slate-400 hover:text-gold-300 transition-colors">
                  Admin CMS Portal
                </Link>
              </li>
              <li>
                <span className="inline-flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-950/50 px-2.5 py-1 rounded-full border border-emerald-800">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  System Operational (Database-Free)
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 {company.companyName} Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/legal/privacy" className="hover:text-slate-400">
              Privacy Policy
            </Link>
            <Link href="/legal/terms" className="hover:text-slate-400">
              Terms of Service
            </Link>
            <Link href="/sitemap.xml" className="hover:text-slate-400">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
