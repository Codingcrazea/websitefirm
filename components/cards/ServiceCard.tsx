import React from 'react';
import Link from 'next/link';
import { Cpu, Building2, Smartphone, Cloud, ShieldCheck, ArrowRight } from 'lucide-react';
import { ServiceItem } from '@/types/content';

interface ServiceCardProps {
  service: ServiceItem;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({ service }) => {
  const getIcon = (name: string) => {
    switch (name) {
      case 'Cpu':
        return <Cpu className="w-7 h-7 text-gold-400" />;
      case 'Building2':
        return <Building2 className="w-7 h-7 text-gold-400" />;
      case 'Smartphone':
        return <Smartphone className="w-7 h-7 text-gold-400" />;
      case 'Cloud':
        return <Cloud className="w-7 h-7 text-gold-400" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-7 h-7 text-gold-400" />;
      default:
        return <Cpu className="w-7 h-7 text-gold-400" />;
    }
  };

  return (
    <div className="glass-panel glass-panel-hover rounded-2xl p-8 flex flex-col justify-between group relative overflow-hidden">
      {/* Accent Light Highlight */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gold-400/10 blur-2xl group-hover:bg-gold-400/20 transition-all rounded-full pointer-events-none" />

      <div>
        {/* Icon & Category Header */}
        <div className="w-14 h-14 rounded-2xl bg-surface-light border border-gold-400/20 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:border-gold-400/50 transition-all duration-300 shadow-gold-glow">
          {getIcon(service.icon)}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-white group-hover:text-gold-300 transition-colors mb-3">
          {service.title}
        </h3>

        {/* Overview */}
        <p className="text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
          {service.description || service.overview}
        </p>

        {/* Tech Stack Chips */}
        {service.techStack && service.techStack.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {service.techStack.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="text-[11px] font-mono font-medium px-2.5 py-1 rounded-md bg-slate-900/80 text-gold-300 border border-gold-400/15"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <Link
        href={`/services/${service.slug}`}
        className="inline-flex items-center gap-2 text-sm font-semibold text-gold-300 hover:text-gold-200 transition-all pt-4 border-t border-slate-800/80"
      >
        Explore Solution Detail
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </Link>
    </div>
  );
};
