import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getContentBySlug, getAllContentItems } from '@/server/content/service';
import { generateCustomMetadata } from '@/server/seo/generator';
import { ServiceItem } from '@/types/content';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, CheckCircle2, Cpu, Building2, Cloud, ShieldCheck, ArrowRight } from 'lucide-react';

export async function generateStaticParams() {
  const services = await getAllContentItems<ServiceItem>('services');
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const service = await getContentBySlug<ServiceItem>('services', params.slug);
  if (!service) return {};
  return generateCustomMetadata({
    title: service.data.title,
    description: service.data.description || service.data.overview,
    slug: `services/${params.slug}`,
  });
}

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
  const serviceResult = await getContentBySlug<ServiceItem>('services', params.slug);

  if (!serviceResult) {
    notFound();
  }

  const { data, htmlContent } = serviceResult;
  const service = data as ServiceItem;

  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Back Link */}
        <Link
          href="/#services"
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-gold-300 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Solutions
        </Link>

        {/* Hero Banner */}
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-gold-400/25 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/10 text-gold-300 text-xs font-semibold uppercase">
            Enterprise Solution
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-white">{service.title}</h1>
          <p className="text-gold-300 text-lg sm:text-xl font-medium">{service.tagline}</p>
          <p className="text-slate-300 text-base leading-relaxed max-w-3xl">{service.overview}</p>

          {/* Tech Stack Badges */}
          {service.techStack && (
            <div className="pt-4 border-t border-slate-800 flex flex-wrap gap-2 items-center">
              <span className="text-xs text-slate-400 font-semibold mr-2">Technologies Used:</span>
              {service.techStack.map((tech) => (
                <span
                  key={tech}
                  className="text-xs font-mono px-3 py-1 rounded-lg bg-slate-900 text-gold-300 border border-gold-400/20"
                >
                  {tech}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Markdown Rich Content */}
        <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-slate-800 text-slate-300 prose prose-invert max-w-none prose-gold leading-relaxed">
          <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
        </div>

        {/* CTA Banner */}
        <div className="glass-panel rounded-3xl p-8 text-center space-y-4 border border-gold-400/30">
          <h3 className="text-2xl font-bold text-white">Ready to Deploy {service.title}?</h3>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Schedule a technical discovery session with our lead system architects today.
          </p>
          <Link href="/contact" className="inline-block pt-2">
            <Button variant="primary" size="lg" className="gap-2">
              Book Proposal Call
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
