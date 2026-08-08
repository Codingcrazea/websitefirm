import React from 'react';
import { Workflow, ArrowRight } from 'lucide-react';

interface LifecycleStep {
  num: string;
  title: string;
  desc: string;
}

interface LifecyclePipelineProps {
  steps: LifecycleStep[];
}

export default function LifecyclePipeline({ steps }: LifecyclePipelineProps) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Workflow className="w-5 h-5 text-gold-400" />
          <span>Request-Response Lifecycle Architecture</span>
        </h3>
        <span className="text-xs text-gold-400 font-mono font-semibold">{steps.length}-Step Pipeline Flow</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="glass-panel p-5 rounded-2xl border border-gold-400/15 hover:border-gold-400/40 transition-all flex flex-col justify-between space-y-3 relative group"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-gold-400 px-2.5 py-1 rounded-lg bg-gold-400/10 border border-gold-400/20">
                {step.num}
              </span>
              {idx < steps.length - 1 && (
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-gold-400 transition-colors hidden lg:block" />
              )}
            </div>
            <div>
              <h4 className="text-base font-bold text-white mb-1.5">{step.title}</h4>
              <p className="text-xs text-slate-300 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
