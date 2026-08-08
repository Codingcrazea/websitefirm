'use client';

import React, { useState } from 'react';
import { Phone, Copy, Check, MessageSquare, Mail, X } from 'lucide-react';
import { CompanyConfig } from '@/types/config';
import { Button } from './Button';

interface CallButtonProps {
  company: CompanyConfig;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const CallButton: React.FC<CallButtonProps> = ({
  company,
  variant = 'outline',
  size = 'md',
  className = '',
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCallClick = (e: React.MouseEvent) => {
    // Check if user is on mobile browser
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768;

    if (isMobile) {
      // On mobile, trigger direct phone dialer
      window.location.href = `tel:${company.phone.replace(/[^0-9+]/g, '')}`;
    } else {
      // On desktop, show crisp contact modal with phone number & copy option
      e.preventDefault();
      setModalOpen(true);
    }
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(company.phone);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={handleCallClick}
        className={`gap-2 ${className}`}
      >
        <Phone className="w-4 h-4 text-gold-400" />
        <span>Call Us: {company.phone}</span>
      </Button>

      {/* Desktop Call Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-md">
          <div className="glass-panel rounded-3xl p-8 max-w-md w-full border border-gold-400/30 space-y-6 shadow-2xl relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gold-400/10 border border-gold-400/30 flex items-center justify-center mx-auto text-gold-400">
                <Phone className="w-6 h-6 animate-bounce" />
              </div>
              <h3 className="text-xl font-bold text-white">Direct Executive Support</h3>
              <p className="text-xs text-slate-400">Connect directly with our senior system architects</p>
            </div>

            {/* Phone Number Display & Copy Button */}
            <div className="p-4 rounded-2xl bg-surface-dark border border-gold-400/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold block">Phone Number</span>
                <span className="font-mono text-lg font-bold text-gold-300">{company.phone}</span>
              </div>
              <button
                onClick={handleCopyNumber}
                className="p-2.5 rounded-xl bg-gold-400/10 hover:bg-gold-400/20 text-gold-400 border border-gold-400/30 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            {/* Quick Action Links */}
            <div className="space-y-3">
              <a
                href={`https://wa.me/${company.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full p-3.5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 text-emerald-300 flex items-center justify-center gap-2 text-sm font-semibold transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                Chat on WhatsApp ({company.whatsapp})
              </a>

              <a
                href={`mailto:${company.salesEmail}`}
                className="w-full p-3.5 rounded-xl bg-surface-light hover:bg-slate-800 border border-gold-400/20 text-slate-200 flex items-center justify-center gap-2 text-sm font-semibold transition-colors"
              >
                <Mail className="w-4 h-4 text-gold-400" />
                Email: {company.salesEmail}
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
