'use client';

import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { ContactFormData } from '@/server/validation/schemas';

export const ContactForm: React.FC = () => {
  const [formData, setFormData] = useState<Partial<ContactFormData>>({
    name: '',
    email: '',
    company: '',
    phone: '',
    country: '',
    projectType: 'AI & Automation',
    budget: '$25,000 - $50,000',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({
    type: null,
    message: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setStatus({
          type: 'success',
          message: 'Thank you! Your proposal request has been dispatched directly to our executive engineering inbox.',
        });
        setFormData({
          name: '',
          email: '',
          company: '',
          phone: '',
          country: '',
          projectType: 'AI & Automation',
          budget: '$25,000 - $50,000',
          message: '',
        });
      } else {
        setStatus({
          type: 'error',
          message: data.error || 'Failed to submit form. Please check fields and try again.',
        });
      }
    } catch (err) {
      setStatus({
        type: 'error',
        message: 'Network error. Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-panel rounded-3xl p-8 sm:p-10 border border-gold-400/25 space-y-6 shadow-2xl">
      <h3 className="text-2xl font-bold text-white mb-2">Request an Enterprise Proposal</h3>
      <p className="text-slate-400 text-sm mb-6">
        Fill out your project specifications. Our lead architect will review and respond within 24 business hours.
      </p>

      {status.type === 'success' && (
        <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-sm flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <span>{status.message}</span>
        </div>
      )}

      {status.type === 'error' && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-500/40 text-red-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <span>{status.message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Full Name *
          </label>
          <input
            type="text"
            required
            value={formData.name || ''}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="John Doe"
            className="w-full px-4 py-3 rounded-xl bg-surface-dark border border-slate-700 text-white focus:outline-none focus:border-gold-400 transition-colors text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Work Email *
          </label>
          <input
            type="email"
            required
            value={formData.email || ''}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="john@company.com"
            className="w-full px-4 py-3 rounded-xl bg-surface-dark border border-slate-700 text-white focus:outline-none focus:border-gold-400 transition-colors text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Company Name
          </label>
          <input
            type="text"
            value={formData.company || ''}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="Acme Corp"
            className="w-full px-4 py-3 rounded-xl bg-surface-dark border border-slate-700 text-white focus:outline-none focus:border-gold-400 transition-colors text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Project Type *
          </label>
          <select
            value={formData.projectType}
            onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
            className="w-full px-4 py-3 rounded-xl bg-surface-dark border border-slate-700 text-white focus:outline-none focus:border-gold-400 transition-colors text-sm"
          >
            <option value="AI & Automation">AI & Automation</option>
            <option value="Enterprise Custom Software">Enterprise Custom Software</option>
            <option value="Cloud Infrastructure & DevOps">Cloud Infrastructure & DevOps</option>
            <option value="Cybersecurity Audit">Cybersecurity Audit</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
          Project Details & Scope *
        </label>
        <textarea
          required
          rows={4}
          value={formData.message || ''}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          placeholder="Describe your project requirements, current tech stack, and goals..."
          className="w-full px-4 py-3 rounded-xl bg-surface-dark border border-slate-700 text-white focus:outline-none focus:border-gold-400 transition-colors text-sm"
        />
      </div>

      <Button type="submit" variant="primary" size="lg" isLoading={loading} className="w-full gap-2">
        <Send className="w-4 h-4" />
        Submit Proposal Request
      </Button>
    </form>
  );
};
