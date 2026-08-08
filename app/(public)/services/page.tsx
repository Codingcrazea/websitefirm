import React from 'react';
import { getAllContentItems } from '@/server/content/service';
import { generateCustomMetadata } from '@/server/seo/generator';
import { ServiceItem } from '@/types/content';
import { ServiceCard } from '@/components/cards/ServiceCard';
import { Sparkles } from 'lucide-react';

export async function generateMetadata() {
  return await generateCustomMetadata({
    title: 'Enterprise Services & Solutions',
    description: 'Explore custom enterprise software, AI automation, cloud infrastructure, and cybersecurity services.',
    slug: 'services',
  });
}

export default async function ServicesPage() {
  const services = await getAllContentItems<ServiceItem>('services');

  return (
    <div className="pt-32 pb-24 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gold-400/10 border border-gold-400/20 text-gold-300 text-xs font-semibold uppercase">
            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
            <span>Full Solutions Directory</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            Enterprise <span className="gold-gradient-text">Engineering Services</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            Tailored software solutions designed for reliability, high availability, and rapid business scalability.
          </p>
        </div>

        {/* 3-Column Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </div>
    </div>
  );
}
