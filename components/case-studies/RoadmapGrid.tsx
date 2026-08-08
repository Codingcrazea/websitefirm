import React from 'react';
import { Compass, CheckSquare } from 'lucide-react';

interface RecommendationStep {
  step: string;
  title: string;
  desc: string;
}

interface RoadmapGridProps {
  recommendations: RecommendationStep[];
}

export default function RoadmapGrid({ recommendations }: RoadmapGridProps) {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Compass className="w-5 h-5 text-gold-400" />
          <span>Architectural Refactoring Roadmap</span>
        </h3>
        <span className="text-xs font-semibold text-gold-300">Action Plan</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((item, idx) => (
          <div
            key={idx}
            className="glass-panel p-5 rounded-2xl border border-gold-400/20 hover:border-gold-400/50 transition-all flex items-start gap-4"
          >
            <div className="px-3 py-1.5 rounded-xl bg-gold-400/10 border border-gold-400/20 text-gold-300 font-mono font-bold text-xs shrink-0">
              {item.step}
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-gold-400 shrink-0" />
                <span>{item.title}</span>
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
