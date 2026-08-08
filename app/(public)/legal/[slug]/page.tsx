import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { generateCustomMetadata } from '@/server/seo/generator';
import { getCompanyConfig } from '@/server/settings/service';
import { ArrowLeft, ShieldCheck } from 'lucide-react';

const legalDocs: Record<string, { title: string; content: string }> = {
  privacy: {
    title: 'Privacy Policy',
    content:
      'We respect your privacy. This website does not store personal contact submissions in a persistent database. Form data is transmitted securely via transactional email directly to our sales inbox. We do not sell or share user data.',
  },
  terms: {
    title: 'Terms of Service',
    content:
      'By accessing Ohmtech Developers website, you agree to comply with modern software usage standards. All enterprise content, branding, and code specifications are protected under international copyright law.',
  },
  cookies: {
    title: 'Cookie Policy',
    content:
      'We use secure HTTP-Only session cookies for administrative authentication. We do not use third-party tracking cookies or persistent advertising cookies.',
  },
  security: {
    title: 'Security Policy',
    content:
      'Security is our primary engineering pillar. We enforce zero-trust network boundaries, strict Zod validation on API endpoints, HTTP-Only session cookies, and zero database persistent storage.',
  },
};

export async function generateStaticParams() {
  return [
    { slug: 'privacy' },
    { slug: 'terms' },
    { slug: 'cookies' },
    { slug: 'security' },
  ];
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const doc = legalDocs[params.slug];
  if (!doc) return {};
  return generateCustomMetadata({
    title: doc.title,
    description: doc.content,
    slug: `legal/${params.slug}`,
  });
}

export default async function LegalDocPage({ params }: { params: { slug: string } }) {
  const doc = legalDocs[params.slug];
  const company = await getCompanyConfig();

  if (!doc) {
    notFound();
  }

  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-gold-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Return to Homepage
        </Link>

        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-gold-400/20 space-y-6">
          <div className="flex items-center gap-2 text-gold-400 text-xs font-semibold uppercase">
            <ShieldCheck className="w-4 h-4" />
            Legal & Compliance Document
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{doc.title}</h1>
          <p className="text-xs text-slate-400">Effective Date: January 1, 2026 | Entity: {company.companyName} Inc.</p>

          <div className="pt-6 border-t border-slate-800 text-slate-300 leading-relaxed text-sm sm:text-base space-y-4">
            <p>{doc.content}</p>
            <p>If you have any compliance or security inquiries, please contact our lead legal team at <span className="text-gold-300 font-semibold">{company.email}</span>.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
