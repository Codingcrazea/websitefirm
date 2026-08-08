import React from 'react';
import { CompanyConfig } from '@/types/config';

interface StatsSectionProps {
  company: CompanyConfig;
}

export const StatsSection: React.FC<StatsSectionProps> = ({ company }) => {
  const stats = [
    { label: 'Enterprise Systems Delivered', value: company.metrics.projectsCompleted },
    { label: 'Client Satisfaction Rate', value: company.metrics.clientSatisfaction },
    { label: 'Guaranteed SLA Uptime', value: company.metrics.uptimeGuarantee },
    { label: 'Global Enterprise Clients', value: company.metrics.globalClients },
  ];

  return (
    <section className="py-16 bg-background border-y border-gold-glass relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center space-y-2 p-6 glass-panel rounded-2xl border border-gold-400/15">
              <div className="text-3xl sm:text-4xl lg:text-5xl font-extrabold gold-gradient-text">
                {stat.value}
              </div>
              <div className="text-xs sm:text-sm font-medium text-slate-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
